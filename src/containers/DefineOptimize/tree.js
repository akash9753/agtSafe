import React, { Component } from 'react';
import { Input, Button, Icon, Row, Col } from 'antd';
import Tree from '../../components/uielements/tree';
import
{
    getUserID,
    errorModal,
    showProgress,
    validJSON,
    hideProgress,
    CallServerPost,
    getWebsocketInstance_State
} from '../Utility/sharedUtility';
import DefineStudy from './DefineStudy/index.js';
import Box from '../../components/utility/box';
import ContentTab from '../TreeView/contentTab';
import Progress from '../Utility/ProgressBar';
import DomainList from './Domain';
import ValuelevelList from './ValueLevel';
import VariableLevelMetaDataList from './VariableLevelMetaData';
import WhereClauseList from './WhereClause';
import CodeList from './CodeList';
import ExternalCodeList from './ExternalCodeList';
import CodeListUpdate from './CodeList/update';
import ValueLevelUpdate from './ValueLevel/update';
import VariableUpdate from './VariableLevelMetaData/update';
import WhereClauseUpdate from './WhereClause/update';
import ExternalCodeListUpdate from './ExternalCodeList/update';
import Method from './Method';
import Comment from './Comment';
import Documents from './Documents';
//Importing ButtonWithToolTip For Action Edit Icon
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip.js';
import { DefineContext } from './context';

//Importing Custom DefineBot
import './DefineBot.css';

var thisObj;

const flexDisplay = { height: 'calc(100% - 26px) !important', display: "flex", flexDirection: "column", padding: "6px 0px 0px 0px" };
class DefineTree extends Component {
    static contextType = DefineContext;

    constructor(props) {
        super(props);
        this.state = {
            treeVisible:true,
            expandedKeys: [],
            treeData: [],
            from: props.from,
            progress: "",
            acknowledgeFn: "",
            activityDetails: props.allActivityDetails,
        };
        thisObj = this;

    }

    componentDidMount()
    {

        if (getWebsocketInstance_State() === 1)
        {
            this.setState({ progress: "active" });

            this.getTreeViewData();
        }
    }

    progressAcknowledgement = (Socekt_State) =>
    {
        this.setState({ progress: "active" });

        this.getTreeViewData();
    }

    getTreeViewData = (resolve = false,reject = false) =>
    {
        var values = {};
        values["StudyID"] = JSON.parse(sessionStorage.getItem("studyDetails")).studyID;
        values["StandardVersionID"] = JSON.parse(sessionStorage.getItem("studyDetails")).standardVersionID;
        values["UserID"] = getUserID();
        const thisObj = this;

        CallServerPost('Study/TreeView', values).then(
            function (response)
            {
                if (response == "")
                {
                    thisObj.setState({ progress: "exception" });
                    hideProgress();
                    reject && reject();
                    errorModal(response);
                }
                else
                {

                    let data = JSON.parse(response);
                    let res = thisObj.formTreeData(data);

                    //resolve true ? return only data no need to update the state else update the state
                    if (resolve)
                    {
                        resolve({ data: data, treeData: res.treeData });
                    }
                    else
                    {
                        const { setExpandNode } = thisObj.context ? thisObj.context : {};
                        setExpandNode(["Study"]);

                        thisObj.setState({
                            data: data,
                            progress: "success",
                            treeData: res.treeData
                        }, hideProgress);
                    }
                }
            }).catch(error => error);
    }



    //Tree Node on select
    onTreeNodeSelect = (selectedKeys, e) => {

        let { props } = e.node;

        let { TitleText, Source, parentType, childrenObj, siblings, parents, parentKey, eventKey, prev, next } = props;
        let { storeNode } = this.context;

        storeNode({
            type: Source,
            prev: prev,
            next: next,
            nodeKey: eventKey,
            title: TitleText,
            parents: parents,
            siblings: siblings,
            //json Obj
            children: childrenObj,
            parentKey: parentKey,
            parentType: parentType
        });
    };

      
    //search fn
    onChange = (e) => {
        const value = e.target.value;

        let { data } = thisObj.state;
        const { setExpandNode } = this.context ? this.context : {};

        let res = thisObj.formTreeData(data, value);
        if (value && value.length > 0) {
            setExpandNode(res.expandNode);
        } else {
            setExpandNode(["Study"]);
        }

        thisObj.setState({
            treeData: res.treeData,
            searchText: e.target.value,
            autoExpandParent: true,
        });
    }
   
    //expand
    onExpand = (expandedKeys, { expanded: bool }) =>
    {
        const { setExpandNode } = this.context ? this.context : {};

        setExpandNode(expandedKeys);
        this.setState({
            autoExpandParent: false,
        })
    };

    clearSearch = () =>
    {
        const { setExpandNode } = this.context ? this.context : {};

        setExpandNode(["Study"]);
        this.setState({
            expandedKeys: ["Study"],
            searchValue: "",
            autoExpandParent: true,
        });
    }

    fnToHideShowTreeView = () =>
    {
        this.setState({ treeVisible: !this.state.treeVisible })
    }

    //Tree data form here
    formTreeData = (obj,searchText = "") =>
    {
        if (obj && obj.length > 0)
        {
            let expandKeys = [];
            function formData(data, immediateParent = false, parents = [])
            {

                try
                {
                    return data.map((node, i) =>
                    {
                        let searched = (searchText && searchText != "") ? node.Title.toLowerCase().indexOf(searchText) > -1 : false;

                        //child loop
                        let child = node.Children && node.Children.length > 0 ? formData(node.Children, node, [...parents, node.Key]) : [];

                        //for search expanding searched node
                        expandKeys = searched ? [...new Set([...expandKeys, "Study", immediateParent.Key, ...parents])] : expandKeys;

                        return ({
                            //HTML
                            title: <span className={searched ? "searched" : "treetitle"} > {node.Title} {child.length != 0 && "("+child.length+")"}</span>,
                            //String text
                            TitleText: node.Title,
                            //unique identifier
                            key: node.Key,
                            //html element
                            children: child,
                            //children JSON Object
                            childrenObj: node.Children,
                            Source: (node.Source == null) ? node.Key : node.Source,
                            //For navigation purpose
                            siblings: data,
                            prev: i != 0 ? data[i - 1].Key : false,
                            next: i < (data.length - 1) ? data[i + 1].Key : false,
                            isLeaf: ["Comment", "Method", "Documents"].indexOf(node.Key) != -1 || child.length == 0,
                            //All parents stored in below key (for expand purpose)
                            parentType: immediateParent.Source,
                            parents: parents,
                            parentName: immediateParent.Key != "Study" && ["Comment", "Method", "Documents", "ExternalCodeList"].indexOf(node.Key) == -1 ?
                                (immediateParent.Source ? immediateParent.Source : immediateParent.Key) : node.Key,
                            parentKey: ["Comment", "Method", "Documents", "ExternalCodeList"].indexOf(node.Key) == -1 ? (
                                (immediateParent && immediateParent.Key != "Study") ? immediateParent.Key : node.Key) : node.Key
                        });
                    })

                } catch (e) {
                    console.log(e);
                }
            }

            let result =
            {
                treeData: formData(obj),
                expandNode: expandKeys
            };
         
            return result;
        }
        return [];
    }

    backToList = () =>
    {

        let { node, backToParent } = this.context;
        let { data } = this.state;

        backToParent(node.parentKey,data)
        
    }

    refresh = () =>
    {
        new Promise((resolve,reject) =>
        {
            showProgress();
            thisObj.getTreeViewData(resolve, reject);    

        }).then((result) =>
        {
            let { node, backToParent } = thisObj.context;

            backToParent(node.parentKey, result.data);
            thisObj.setState({ progress: "success", data: result.data, treeData: result.treeData }, () => hideProgress());

        }).catch((e) =>
        {
            hideProgress();
            console.log(e)

        });
    }

    //reload and reset expand and highlightnode
    reload = () =>
    {
        new Promise((resolve, reject) => {
            showProgress();
            thisObj.getTreeViewData(resolve, reject);

        }).then((result) =>
        {
            let { node, backToParent ,reset} = thisObj.context;

            reset();

            thisObj.setState({
                progress: "success",
                data: result.data,
                treeData: result.treeData
            }, () => hideProgress());

        }).catch((e) => {
            hideProgress();
            console.log(e)

        });
    }

    render()
    {
        const {
            treeVisible,
            progress,
            treeData,
            from,
            autoExpandParent,
            activityDetails,
            searchText
        } = this.state;

        const props = this.props;
        let { highLightNode, node, expandNode,back } = this.context ? this.context : {};
        const { type, prev, next } = node ? node : {};

        return (
            <div style={{ height: "calc(100vh - 82px)" }}>
                <Row style={{ width: '100%', height: '100%' }}>
                    {
                        <Col span={6} style={{ display: treeVisible ? "block" : "none", height: '100%' }}>
                            <Box className={"box_curve"}>
                                <div style={{ display: "table" }}>
                                    <Button
                                        style={{ display: "table-cell", marginRight: 10 }}
                                        className="sideToggleBtn"
                                        onClick={(e) => {
                                            if (from === "Dashboard")
                                            {
                                                thisObj.props.history.push("/trans", { openSelectedStudy: true });

                                            } else {
                                                thisObj.props.history.push("/trans/project", { openSelectedStudy: true });

                                            }
                                        }}
                                    >
                                        <i className="fas fa-arrow-left" />
                                    </Button>
                                    <span style={{
                                        display: "table-cell", width: '100%'
                                    }}>
                                        {
                                                <Input tabIndex="0" suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)', float: 'right' }} />} style={{ width: '100%', minWidth: '100px' }} value={searchText} onChange={this.onChange} placeholder="Search" />
                                        }
                                    </span>
                                    <ButtonWithToolTip
                                        tooltip="Refresh"
                                        shape="circle"
                                        icon="reload"
                                        size="small"
                                        style={{ display: "table-cell", marginLeft: 10 }}
                                        onClick={() => this.reload()} />
                                </div>

                                <Tree
                                    selectedKeys={[highLightNode]}
                                    treeData={treeData}
                                    onExpand={this.onExpand}
                                    expandedKeys={expandNode}
                                    autoExpandParent={autoExpandParent}
                                    onSelect={this.onTreeNodeSelect}
                                    className='Definelistscroll'
                                >
                                </Tree>                               
                            </Box>
                        </Col>
                    }

                    <Col className={"box_curve leftfivepadding"} span={treeVisible ? 18 : 24} style={{height: '100%' }} >
                        <Box className={"box_curve"} style={{ paddingTop:4}}>

                        {props && <ContentTab
                            projectInActive={props.projectInActive}
                            history={this.props.history}
                            projectStudyLockStatus={props.projectStudyLockStatus}
                            fromDashboard={props.fromDashboard}
                            sideToggle={this.fnToHideShowTreeView}
                            showToggleIcon={true}
                            from={from}
                            actidetails={activityDetails}
                        />}

                            <div style={flexDisplay} className={"customBox"}>
                            {
                                type === "Study" &&
                                <DefineStudy
                                    reload={ this.reload}
                                />
                            }
                            {(type === "domain" || type === "DomainClass") && <DomainList nodeKey={node.nodeKey} />}
                            {(type === "Valuelevel" || type === "ValueListGroupDetails") && <ValuelevelList />}
                            {type === "DomainDetails" && <VariableLevelMetaDataList />}
                            {type === "Whereclause" && <WhereClauseList />}
                            {(type === "Codelist" || type === "CodeListGroupDetails") && <CodeList refresh={this.refresh} />}
                            {type === "Method" && <Method />}
                            {type === "Comment" && <Comment />}
                            {type === "Documents" && <Documents />}
                            {type === "ExternalCodeList" && <ExternalCodeList />}
                            {/*Update Code Start*/}
                            {type === "VariableDetails" &&
                                <VariableUpdate
                                    refresh={this.refresh}
                                    ID={node.nodeKey}
                                    prev={prev}
                                    next={next}
                                    backToList={back ? this.backToList : ""}
                                 />
                            }
                            {type === "ValueListItemDetails" &&
                                <ValueLevelUpdate
                                    backToList={this.backToList}
                                    refresh={this.refresh}
                                    ID={node.nodeKey}
                                    prev={node.prev}
                                    next={node.next}
                                />}
                            {type === "WhereClauseDetails" &&
                                <WhereClauseUpdate
                                    backToList={this.backToList}
                                    refresh={this.refresh}
                                    ID={node.nodeKey}
                                    prev={node.prev}
                                    next={node.next}
                                />}
                            {type === "CodeListItemDetails" &&
                                <CodeListUpdate
                                    backToList={this.backToList}
                                    refresh={this.refresh}
                                    ID={node.nodeKey}
                                    prev={node.prev}
                                    next={node.next}
                                />}
                            {type === "ExternalCodeListDetails" &&
                                <ExternalCodeListUpdate
                                    refresh={this.refresh}
                                    ID={node.nodeKey}
                                    prev={prev}
                                    next={next}
                                    backToList={this.backToList}
                                />
                            }
                            </div>
                        </Box>
                    </Col>
                </Row>
                {<Progress progress={progress} NoInitialPercent={true} acknowledge={(getWebsocketInstance_State() != 1) ? this.progressAcknowledgement : ""} />}
            </div>
        );
    }
}

export default DefineTree;

