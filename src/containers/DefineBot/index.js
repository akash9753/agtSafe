import React, { Component } from 'react';
import { Input, Button, Form, Spin, Icon, Row, Col } from 'antd';
import Tree, { TreeNode } from '../../components/uielements/tree';
import { InputSearch } from '../../components/uielements/input';
import {
    CallServerPost,
    errorModal,
    successModal,
    showProgress,
    hideProgress,
    definePermission,
    getUserID,
    getWebsocketInstance_State
} from '../Utility/sharedUtility';
import List from './List.js';
import DefineStudy from './DefineStudy/index.js';
import AddVariableLevelMetaData from './VariableLevelMetaData/update.js';
import AddValueLevel from './ValueLevel/update.js';
import AddWhereClause from './WhereClause/update.js';
import AddCodeList from './CodeList/update';
import AddExternalCodeList from './CodeList/AddExternalCodeList';
import Box from '../../components/utility/box';
import ContentTab from '../TreeView/contentTab';
import Progress from '../Utility/ProgressBar';

//Importing ButtonWithToolTip For Action Edit Icon
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip.js'

//Importing Custom DefineBot
import './DefineBot.css';


const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;
const Search = Input.Search;
var treeClickEvent;
var tempData = [];
var refreshOnlyTree
var moveKey = 0;
var StudyID;
var defineData = [];
const headerStyle = { height: "auto", backgroundColor: '#ffffff', padding: "0px  10px 10px 10px" };
const flexDisplay = { height: 'calc(100% - 26px) !important', display: "flex", flexDirection: "column", padding: "6px 0px 0px 0px" };
class DefineTree extends Component {

    constructor(props) {
        super(props);
        //Show selected study popup when returned from study workspace
        let locationState = (props.location && props.location.state) ? props.location.state : {};
        this.state = {
            expandedKeys: ["Study"],
            searchValue: '',
            loading: false,
            treeSelect: 0,
            currentTreeNodeObject: [],
            defaultSelectedKeys: [],
            defaultExpandParent: true,
            siblings: [],
            treeData: [],
            defineGData: [],
            StudyID: JSON.parse(sessionStorage.studyDetails).studyID,
            nodeName: "",
            treeProps: {},
            toHide: "both",
            treeVisible: true,
            from: locationState.from,
            defineWorkflowStatus: locationState.wrkFlowStatus,
            progress: "active",
            acknowledgeFn: "",
            activityDetails: locationState.allActivityDetails,

        };
        thisObj = this;

    }
    componentDidMount() {

        if (getWebsocketInstance_State() === 1)
        {
            this.getTreeViewData(true);
        }
    }

    progressAcknowledgement = (Socekt_State) => {
        this.getTreeViewData(true);
    }

    getTreeViewData = (onlyRefreshTree) =>
    {
        defineData = [];
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
                    errorModal(response);
                    hideProgress();
                }
                else
                {
                    thisObj.splitList(JSON.parse(response));
                    if (!onlyRefreshTree) {
                        thisObj.onTreeNodeSelect("", treeClickEvent, treeClickEvent.node.props.parentName.toLowerCase());
                    }
                    let expandedKeys = thisObj.state.expandedKeys;
                    thisObj.setState({ progress: "success", expandedKeys: (expandedKeys.length == 0 || (expandedKeys.length == 1 && expandedKeys.indexOf("Study") != -1)) ? ["Study"] : expandedKeys, treeData: JSON.parse(response), defineGData: JSON.parse(response), loading: false, display: "none" })
                    hideProgress();
                }
            }).catch(error => 
            {
                hideProgress();
                thisObj.setState({ progress: "exception" });
            });
    }


    splitList = (data) => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            if (node.TabName == "Define") {
                defineData.push(node);
            }
        }
        //let Child = [{
        //    ChildList: null, Children: Child, Collapsed: true, Folder: false, Id: 0, Key: "AnalysisResult", LeftClickAction: "", Selected: false, Source: null, TabName: "Define", Title: "Analysis Result"
        //}];
        //if (defineData.length != 0) {
        //    defineData[0].Children.push({
        //        ChildList: null, Children: Child, Collapsed: true, Folder: false, Id: 0, Key: "AnalysisResultMetaData", LeftClickAction: "", Selected: false, Source: null, TabName: "Define", Title: "Analysis Result MetaData"
        //    });
        //}
        this.setState({  });
    };

    onTreeNodeSelect = (selectedKeys, e, nodeName, toHide) => {
        let pageProps = this.props.location.state;
        treeClickEvent = e;
        var nodeKey = "";
        var data = {};
        var url = "";
        const props = e.node.props;

        //for to hide the left arroe or right it depands
        let position = props.pos.lastIndexOf('-');
        let tempPos = props.pos.substring(position + 1);
        let siblingLength = (props.siblings != undefined) ? (props.siblings.length - 1) : "none";

        //for refresh when directly click the create page in tree
        if (nodeName != "move") {

            if (tempPos == 0 && tempPos == siblingLength) {
                toHide = "both";
            }
            else if (tempPos == 0) {
                toHide = "left";
            }
            else if (tempPos == siblingLength) {
                toHide = "right";

            }
        }
        if (nodeName == undefined || nodeName == "") {
            nodeName = e.node.props.type.toLowerCase();
            nodeKey = e.node.props.dataRef.Key;
        }
        else if (nodeName == "move") {
            nodeKey = selectedKeys;
            nodeName = e.node.props.type.toLowerCase();
        }
        else {
            nodeKey = e.node.props.parentKey;
        }
        moveKey = nodeKey;
        thisObj.setState({ progress: "success", toHide: toHide, treeProps: props, nodeName: nodeName, nodeKey: nodeKey, defaultSelectedKeys: [nodeKey], selectedKeys: selectedKeys });



    };

    getDataURL = (nodeName) => {
        let { nodeKey, treeProps } = this.state;
        switch (nodeName) {

            case "domain":
            case "domainclass":

                return {
                    data: {
                        StudyID: JSON.parse(sessionStorage.studyDetails).studyID,
                        DomainName: this.state.nodeKey
                    },
                    url: 'Domain/GetDomainByStudyID'
                }

            case "domaindetails":

                return {
                    data: {
                        StudyID: JSON.parse(sessionStorage.studyDetails).studyID,
                        ID: nodeKey
                    },
                    url: 'Variable/GetVariableDataByStudyID'
                }
            case "valuelevel":
            case "valuelistgroupdetails":

                return {
                    data: {
                        StudyID: JSON.parse(sessionStorage.studyDetails).studyID,
                        FormName: treeProps.dataRef.Title.split(".")[0],
                        ID: (parseInt(nodeKey)) ? nodeKey : 0
                    },

                    url: 'ValueLevelMetaData/GetValueLevelDataByStudyID'
                }
            case "analysisresultmetadata":
                return {
                    data: {
                        StudyID: JSON.parse(sessionStorage.studyDetails).studyID,
                        ID: nodeKey
                    },
                    url: 'Variable/GetVariableDataByStudyID'
                }
            case "analysisresult":
                return {
                    data: { StudyID: JSON.parse(sessionStorage.studyDetails).studyID, ID: nodeKey },
                    url: 'Variable/GetVariableDataByStudyID'
                }
            case "whereclause":
                return {
                    data: { ID: JSON.parse(sessionStorage.studyDetails).studyID },
                    url: 'WhereClause/GetWhereClauseByStudyID'
                }
            case "codelist":
            case "codelistgroupdetails":

                return {
                    data: { StudyID: JSON.parse(sessionStorage.studyDetails).studyID, ID: (parseInt(nodeKey)) ? nodeKey : 0 },
                    url: 'CodeList/GetCodeListByStudyID'
                }
            case "externalcodelist":
                return {
                    data: { StudyID: JSON.parse(sessionStorage.studyDetails).studyID, ID: (parseInt(nodeKey)) ? nodeKey : 0 },
                    url: 'CodeList/GetAllExternalCodeListByStudyID'
                }
            case "comment":

                return {
                    data: { StudyID: JSON.parse(sessionStorage.studyDetails).studyID },
                    url: 'Comment/GetCommentByStudyID'
                }

            case "method":
                return {
                    data:
                        { StudyID: JSON.parse(sessionStorage.studyDetails).studyID },
                    url: 'Method/GetMethodByStudyID'
                }
            case "documents":
                return {
                    data: { StudyID: JSON.parse(sessionStorage.studyDetails).studyID },
                    url: 'Document/GetDocumentByStudyID'
                }
            default:
                return { data: {}, url: "" }

        }
    }


    renderTreeNodes = (data, parent) => {
        return data.map((item, order) => {
            const index = item.Title.toLowerCase().indexOf(thisObj.state.searchValue.toLowerCase());
            const beforeStr = item.Title.substr(0, index);
            const afterStr = item.Title.substr(index + thisObj.state.searchValue.length);
            let tempTitle = item.Title;

            if (item.Children != null) {
                if (item.Children.length != 0) {
                    tempTitle = item.Title + " (" + item.Children.length + ")";
                }
            }
            const title = (index > -1 && thisObj.state.searchValue != "") ? (
                <span style={{ color: 'red' }}>{tempTitle}</span>
            ) : <span>{tempTitle}</span>;


            var parentName = "", parentKey = 0;;
            if (parent != null) {
                if (parseInt(parent.Key)) {
                    parentKey = parent.Key;
                    if (parent.Source == null) {
                        parentName = parent.Key;
                    }
                    else {
                        parentName = parent.Source
                    }
                } else {
                    if (parent.Key == "ExternalCodeList" || parent.Key == "Whereclause") {
                        parentName = parent.Key;
                        parentKey = parent.Key;
                    }
                }
            }
            else {
                if (item.Source == null) {
                    parentName = item.Key
                }
                else {
                    parentName = item.Source
                }
                parentKey = item.Key;
            }

            if ((item.Children != null) ? (item.Children.length > 0) ? true : false : false) {

                return (

                    <TreeNode title={title} parentKey={parentKey}
                        parentName={parentName}
                        key={item.Key} type={(item.Source == null) ? item.Key : item.Source} dataRef={item}>
                        {

                            this.renderTreeNodes(item.Children, item)
                        }
                    </TreeNode>
                );
            }
            return <TreeNode siblings={data} parentKey={parentKey} parentName={parentName} title={title} key={item.Key} type={(item.Source == null) ? item.Key : item.Source} dataRef={item} />;


        });
    }

    refresh = (directClick) => {
        thisObj.getTreeViewData(false);
    }
    treeWholeRefresh = () =>
    {
        showProgress();
        thisObj.setState({ treeData: [], nodeName: "", defaultSelectedKeys: [], display: "flex" });
        thisObj.getTreeViewData(true)
    }

    pageRefresh = () =>
    {
        thisObj.setState({
            progress: "active",
            expandedKeys: ["Study"], searchValue:"", defaultSelectedKeys: [], nodeName: "", display: "flex"
        }, thisObj.getTreeViewData(true));
    }
    move = (moveAction) => {
        var temp = treeClickEvent.node.props.siblings;
        const ID = moveKey;
        temp.forEach(function (key, index) {
            if (key.Key == ID) {
                if (moveAction.currentTarget.id == 'left') {
                    if ((index - 1) >= 0) {
                        //for to hide left and right arrow it depands
                        let toHide = ((index - 1) == 0) ? "left" : "none";

                        moveKey = temp[index - 1].Key;
                        thisObj.onTreeNodeSelect(temp[index - 1].Key, treeClickEvent, "move", toHide);

                    }
                }
                else {
                    if ((index + 1) != temp.length) {
                        let toHide = ((index + 2) == temp.length) ? "right" : "none";

                        moveKey = temp[index + 1].Key;
                        thisObj.onTreeNodeSelect(temp[index + 1].Key, treeClickEvent, "move", toHide);
                    }
                }
            }
        })
    };

    onChange = (e) => {
        const value = e.target.value;
        tempData = [];
        if (value != "") {
            this.searchData(this.state.defineGData, null, value, tempData)
        }
        const expandedKeys = (value != null) ? tempData.filter((item, i, self) => item && self.indexOf(item) === i) : [];
        this.setState({
            expandedKeys,
            searchValue: e.target.value,
            autoExpandParent: true,
        });
    }
    searchData = (data, parent, searchValue, tempData) => {
        data.map((item) => {
            if (item.Title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
                if (parent != null) {
                    tempData.push(parent);
                }
                if (item.Children) {
                    this.searchData(item.Children, item.Key, searchValue, tempData);
                }
            }
            else {
                if (item.Children) {
                    this.searchData(item.Children, item.Key, searchValue, tempData);
                }
            }
        })
    }

    highLightNode = (selectKey, key) => {
        var expandedKeys = thisObj.state.expandedKeys;
        key.forEach(function (keys, index) {
            expandedKeys = expandedKeys.toLocaleString().replace(new RegExp(keys + ",", 'g'), "");
            expandedKeys = expandedKeys.toLocaleString().replace(new RegExp("," + keys, 'g'), "");
        })

        var temp = key.concat(expandedKeys.split(","));

        thisObj.setState({ defaultSelectedKeys: [selectKey], expandedKeys: temp, autoExpandParent: false })

    }

    onExpand = (expandedKeys, { expanded: bool, node }) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });

    };

    //Common table
    table = (props, response, header, width, action) => {

        var columns = response.value.columns;
        var availableDocs = [];
        var data = response.value.data;
        var col = [];
        var dataSource = [];
        var tampActions = {};
        let forPosition = props.props.node.children;
        let { defineWorkflowStatus } = thisObj.state;

        if (response.value.data.length != 0) {
            data.forEach(function (key, index) {
                if (props.props.pageName === "Documents") {
                    availableDocs.push(key[1]);
                }

                var tempcolumn = {};
                let forPositionToHide = "none";

                if (index == 0 && (index + 1) == response.value.data.length) {
                    forPositionToHide = "both";
                }
                else if (index == 0) {
                    forPositionToHide = "left";
                }
                else if ((index + 1) == response.value.data.length) {
                    forPositionToHide = "right";
                }

                columns.forEach(function (columnKey, columnIndex) {

                    if (index == 0) {
                        if (columnKey == "Actions") {
                            tampActions = {
                                columnKey: columnKey, header: header, width: width
                            }
                        } else {
                            col.push(thisObj.fnColumn(columnKey, header, width));
                        }
                    }
                    if (columnKey.toLowerCase().replace(/ /g, "") == "actions") {
                        const ID = key[columnIndex];
                        var editCell;

                        if (props.props.pageName !== "Documents") {
                            editCell = (<div>
                                <ButtonWithToolTip
                                    name="Edit"
                                    tooltip="Edit"
                                    shape="circle"
                                    classname="fas fa-pen"
                                    disabled={!definePermission(defineWorkflowStatus)}
                                    size="small"
                                    onClick={() => props.fnToShowEditPage({ key: ID, forPositionToHide: forPositionToHide })}
                                />

                                {((props.props.pageName === "Codelist" || props.props.pageName === "Method" || props.props.pageName === "Comment")) ?

                                    <ButtonWithToolTip name="Delete" tooltip="Delete" shape="circle" classname="fas fa-trash-alt" size="small" style={{ margin: "0px 0px 0px 5px" }}
                                        onClick={() => props.fnToDeletePage(ID)}
                                        disabled={!definePermission(defineWorkflowStatus)}
                                    /> : ("")
                                }

                            </div>);
                        } else {

                            var docType = key[2];
                            editCell = (<div>
                                <ButtonWithToolTip name="Delete" tooltip="Delete" shape="circle" classname="fas fa-trash-alt" size="small" style={{ margin: "0px 0px 0px 5px" }}
                                    onClick={() => props.fnToDeletePage(ID, key[1])}
                                    disabled={!definePermission(defineWorkflowStatus) || docType === "AnnotatedCRF"}
                                />
                            </div>);
                        }

                        tempcolumn[columnKey.toLowerCase().replace(/ /g, "")] = editCell;
                    }
                    else {
                        tempcolumn[columnKey.toLowerCase().replace(/ /g, "")] = key[columnIndex];
                    }

                })
                tempcolumn.forPositionToHide = forPositionToHide;

                tempcolumn.key = key[0];

                dataSource.push(tempcolumn);

            });
            if (tampActions.columnKey != undefined) {
                col.push(thisObj.fnColumn(tampActions.columnKey, tampActions.header, tampActions.width));

            }
        }
        else {
            let tempAction = {};
            columns.forEach(function (columnKey, columnIndex) {
                if (columnIndex == 0) {
                    tempAction = thisObj.fnColumn(columnKey, header, width);

                } else {
                    col.push(thisObj.fnColumn(columnKey, header, width));
                }
            });
            col.push(tempAction);
        }

        return ({ columns: col, dataSource: dataSource, availableDocs: availableDocs })
    }


    fnColumn = (data, header, width) => {
        if (data.toLowerCase() == "actions") {
            return ({
                title: data, dataIndex: data.toLowerCase(), key: data.toLowerCase(), title: data, width: 100, fixed: "right"
            })
        }
        else {
            var tempdata = data.replace(/ /g, "").toLowerCase();
            if (tempdata == header) {
                return ({ title: data, dataIndex: tempdata, width: 250, key: tempdata, sorter: (a, b) => thisObj.tableSort(a, b, tempdata) })
            }
            else {
                return ({ title: data, dataIndex: tempdata, key: tempdata, width: width, sorter: (a, b) => thisObj.tableSort(a, b, tempdata) })
            }
        }
    }

    tableSort = (a, b, column) => {
        if (parseInt(a[column])) {
            if (a[column] < b[column]) return -1;
            if (a[column] > b[column]) return 1;
            return 0;
        }
        else {
            if (a[column] < b[column]) return -1;
            if (a[column] > b[column]) return 1;
            return 0;
        }
    }
    clearSearch = () => {
        this.setState({
            expandedKeys: ["Study"],
            searchValue: "",
            autoExpandParent: true,
        });
    }

    fnToHideShowTreeView = () => {
        this.setState({ treeVisible: !this.state.treeVisible })

    }

    //Handle Promise
    reloadTree = (callback, reject) => {
        defineData = [];
        var values = {};
        values["StudyID"] = JSON.parse(sessionStorage.getItem("studyDetails")).studyID;
        values["StandardVersionID"] = JSON.parse(sessionStorage.getItem("studyDetails")).standardVersionID;
        values["UserID"] = getUserID();
        const thisObj = this;

        CallServerPost('Study/TreeView', values).then(function (response) {
            if (response == "") {

                // errorModal(response);
                //reject();
            }
            else {
                callback();
                thisObj.setState({ progress: "success", treeData: JSON.parse(response), defineGData: JSON.parse(response), loading: false, display: "none" })

                thisObj.onTreeNodeSelect("", treeClickEvent, treeClickEvent.node.props.parentName.toLowerCase());
            }
        }).catch(error => error);
    }

    render() {
        const { treeVisible,
            progress,
            selectedKeys,
            toHide,
            searchValue,
            nodeKey,
            expandedKeys,
            autoExpandParent,
            defaultSelectedKeys,
            defaultExpandParent,
            defineGData,
            nodeName,
            treeProps,
            selectedKey,
            defineWorkflowStatus,
            from,
            activityDetails
        } = this.state;

        const props = this.props.location.state;
        let { data, url } = this.getDataURL(nodeName);
        
        return (
            <div style={{ height: "calc(100vh - 80px)" }}>
                <Row style={{ width: '100%', height: '100%' }}>
                    {
                        <Col span={6} style={{ display: treeVisible ? "block" : "none", height: '100%' }}>
                            <Box className = "curveborder">
                                <div style={{ display: "table" }}>
                                    <Button style={{ display: "table-cell", marginRight: 10 }}
                                        className="sideToggleBtn"
                                        onClick={(e) => {
                                            if (from === "Dashboard") {
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
                                            searchValue !== "" ?
                                                <Input tabIndex="0" suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)', float: 'right' }} />} suffix={<Icon onClick={this.clearSearch} type="close" style={{ color: 'rgba(0,0,0,.25)', float: 'right' }} />} style={{ width: '100%', minWidth: '100px' }} value={searchValue} onChange={this.onChange} placeholder="Search" />
                                                :
                                                <Input tabIndex="0" suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)', float: 'right' }} />} style={{ width: '100%', minWidth: '100px' }} value={searchValue} onChange={this.onChange} placeholder="Search" />
                                        }
                                    </span>
                                    <ButtonWithToolTip
                                        tooltip="Refresh"
                                        shape="circle"
                                        icon="reload"
                                        size="small"
                                        style={{ display: "table-cell", marginLeft: 10 }}
                                        onClick={() => this.pageRefresh()} />
                                </div>
                                <Tree
                                    selectedKeys={defaultSelectedKeys}
                                    onExpand={this.onExpand}
                                    expandedKeys={expandedKeys}
                                    defaultExpandedKeys={["Study"]}
                                    autoExpandParent={autoExpandParent}
                                    onSelect={this.onTreeNodeSelect}
                                    className='Definelistscroll'

                                >
                                    {this.renderTreeNodes(this.state.defineGData, null)}
                                </Tree>
                                {
                                    this.state.treeData.length ? "" : <div style={{ display: "flex", height: "100%", width: "100%", top: 0, position: "absolute" }}>
                                        {/*    <Spin tip="Loading..." indicator={antIcon} style={{ color: "rgba(0, 0, 0, 0.65)", margin: "auto" }} size="small" spinning={true}></Spin>*/}

                                        {<Progress NoInitialPercent={true} progress={progress} acknowledge={(getWebsocketInstance_State() != 1) ? this.progressAcknowledgement : ""} />}
                                    </div>
                                }
                            </Box>
                        </Col>
                    }
                    <Col className="leftfivepadding" span={treeVisible ? 18 : 24} style={{ height: '100%',padding:0 }} >
                        <Box className="curveborder" style={{ padding: 5 }}>
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
                                nodeName === "study" &&
                                <DefineStudy
                                    defineActivityWorkflowStatus={defineWorkflowStatus}
                                    viewImport={this.fnToHideShowTreeView}
                                    projectInActive={props.projectInActive}
                                    history={props.history}
                                    projectStudyLockStatus={props.projectStudyLockStatus}
                                    workflowActivityStatusID={props.workflowActivityStatusID}
                                    StudyID={thisObj.state.StudyID}
                                    treeWholeRefresh={thisObj.treeWholeRefresh}
                                />
                            }
                            {
                                (nodeName === "domain" || nodeName === "domainclass") &&
                                <List
                                    defineActivityWorkflowStatus={defineWorkflowStatus}
                                    projectStudyLockStatus={props.projectStudyLockStatus}
                                    url={url}
                                    data={data}
                                    pageName="Domain"
                                    ID={nodeKey}
                                    node={treeProps}
                                    treePageProp={thisObj}
                                    refresh={thisObj.refresh}
                                    reloadTree={thisObj.reloadTree}
                                    isStudyLock={JSON.parse(sessionStorage.studyDetails).locked}
                                />
                            }
                            {
                                nodeName === "domaindetails" &&
                                <List
                                    defineActivityWorkflowStatus={defineWorkflowStatus}
                                    projectStudyLockStatus={props.projectStudyLockStatus}
                                    node={treeProps}
                                    toHide={toHide}
                                    url={url}
                                    data={data}
                                    pageName="Variable Level Meta Data"
                                    ID={nodeKey}
                                    treePageProp={thisObj}
                                    refresh={thisObj.refresh}
                                    reloadTree={thisObj.reloadTree}
                                    isStudyLock={JSON.parse(sessionStorage.studyDetails).locked}
                                />
                            }
                            {
                                (nodeName === "valuelevel" || nodeName === "valuelistgroupdetails") &&

                                <List
                                    defineActivityWorkflowStatus={defineWorkflowStatus}
                                    projectStudyLockStatus={props.projectStudyLockStatus}
                                    toHide={toHide}
                                    url={url}
                                    data={data}
                                    pageName="Valuelevel"
                                    ID={nodeKey}
                                    node={treeProps}
                                    treePageProp={thisObj}
                                    refresh={thisObj.refresh}
                                    reloadTree={thisObj.reloadTree}
                                    isStudyLock={JSON.parse(sessionStorage.studyDetails).locked}
                                />
                            }{
                                (nodeName === "analysisresultmetadata") &&
                                <List
                                    defineActivityWorkflowStatus={defineWorkflowStatus}
                                    projectStudyLockStatus={props.projectStudyLockStatus}
                                    toHide={toHide}
                                    analysis={true}
                                    url={null}
                                    data={null}
                                    pageName="Analysis Result Metadata"
                                    ID={nodeKey}
                                    node={treeProps}
                                    treePageProp={thisObj}
                                    refresh={thisObj.refresh}
                                    reloadTree={thisObj.reloadTree}
                                    isStudyLock={JSON.parse(sessionStorage.studyDetails).locked}
                                />
                            }
                            {
                                nodeName === "analysisresult"
                                &&
                                <List
                                    defineActivityWorkflowStatus={defineWorkflowStatus}
                                    projectStudyLockStatus={props.projectStudyLockStatus}
                                    toHide={toHide}
                                    analysis={true}
                                    url={url}
                                    data={data}
                                    pageName="Analysis Result"
                                    ID={nodeKey}
                                    node={treeProps}
                                    treePageProp={thisObj}
                                    refresh={thisObj.refresh}
                                    reloadTree={thisObj.reloadTree}
                                    isStudyLock={JSON.parse(sessionStorage.studyDetails).locked}
                                />
                            }{
                                nodeName === "whereclause" &&
                                <List
                                    defineActivityWorkflowStatus={defineWorkflowStatus}
                                    projectStudyLockStatus={props.projectStudyLockStatus}
                                    toHide={toHide}
                                    url={url}
                                    data={data}
                                    pageName="Whereclause"
                                    ID={nodeKey}
                                    node={treeProps}
                                    treePageProp={thisObj}
                                    refresh={thisObj.refresh}
                                    reloadTree={thisObj.reloadTree}
                                    isStudyLock={JSON.parse(sessionStorage.studyDetails).locked}
                                />
                            }{
                                (nodeName === "codelist" || nodeName === "codelistgroupdetails") &&
                                <List
                                    defineActivityWorkflowStatus={defineWorkflowStatus}
                                    projectStudyLockStatus={props.projectStudyLockStatus}
                                    toHide={toHide}
                                    url={url}
                                    data={data}
                                    pageName="Codelist"
                                    ID={nodeKey}
                                    node={treeProps}
                                    treePageProp={thisObj}
                                    refresh={thisObj.refresh}
                                    isStudyLock={JSON.parse(sessionStorage.studyDetails).locked}
                                    selectedKey={selectedKeys}
                                    parentPageName={nodeName}
                                    reloadTree={thisObj.reloadTree}
                                    workflowActivityStatusID={props.workflowActivityStatusID}
                                />
                            }
                            {
                                nodeName === "externalcodelist" &&
                                <List
                                    defineActivityWorkflowStatus={defineWorkflowStatus}
                                    projectStudyLockStatus={props.projectStudyLockStatus}
                                    toHide={toHide}
                                    url={url}
                                    data={data}
                                    pageName="External Codelist"
                                    ID={nodeKey}
                                    node={treeProps}
                                    treePageProp={thisObj}
                                    refresh={thisObj.refresh}
                                    reloadTree={thisObj.reloadTree}
                                    isStudyLock={JSON.parse(sessionStorage.studyDetails).locked}
                                    workflowActivityStatusID={props.workflowActivityStatusID}
                                />
                            }
                            {
                                nodeName === "comment" &&
                                <List
                                    defineActivityWorkflowStatus={defineWorkflowStatus}
                                    projectStudyLockStatus={props.projectStudyLockStatus}
                                    toHide={toHide}
                                    url={url}
                                    data={data}
                                    pageName="Comment"
                                    ID={nodeKey}
                                    node={treeProps}
                                    treePageProp={thisObj}
                                    refresh={thisObj.refresh}
                                    reloadTree={thisObj.reloadTree}
                                    isStudyLock={JSON.parse(sessionStorage.studyDetails).locked}
                                    workflowActivityStatusID={props.workflowActivityStatusID}
                                />
                            }{
                                nodeName === "method" &&
                                <List
                                    defineActivityWorkflowStatus={defineWorkflowStatus}
                                    projectStudyLockStatus={props.projectStudyLockStatus}
                                    toHide={toHide}
                                    url={url}
                                    data={data}
                                    pageName="Method"
                                    ID={nodeKey}
                                    node={treeProps}
                                    treePageProp={thisObj}
                                    refresh={thisObj.refresh}
                                    reloadTree={thisObj.reloadTree}
                                    isStudyLock={JSON.parse(sessionStorage.studyDetails).locked}
                                    workflowActivityStatusID={props.workflowActivityStatusID}
                                />
                            }
                            {
                                nodeName === "documents" &&
                                <List
                                    defineActivityWorkflowStatus={defineWorkflowStatus}
                                    projectStudyLockStatus={props.projectStudyLockStatus}
                                    toHide={toHide}
                                    url={url}
                                    data={data}
                                    pageName="Documents"
                                    ID={nodeKey}
                                    node={treeProps}
                                    treePageProp={thisObj}
                                    refresh={thisObj.refresh}
                                    reloadTree={thisObj.reloadTree}
                                    isStudyLock={JSON.parse(sessionStorage.studyDetails).locked}
                                    workflowActivityStatusID={props.workflowActivityStatusID}
                                />
                            }
                            {
                                nodeName === "variabledetails" &&
                                <AddVariableLevelMetaData
                                    defineActivityWorkflowStatus={defineWorkflowStatus}
                                    toHide={toHide}
                                    directClick={true}
                                    node={treeProps}
                                    move={thisObj.move}
                                    ID={nodeKey}
                                    parrentID={props.parentKey}
                                    currentNode={props}
                                    refresh={thisObj.refresh}
                                    reloadTree={thisObj.reloadTree}
                                    cancel={false}
                                    isStudyLock={JSON.parse(sessionStorage.studyDetails).locked}
                                    workflowActivityStatusID={props.workflowActivityStatusID}
                                />
                            }
                            {
                                nodeName === "valuelistitemdetails" &&
                                <AddValueLevel
                                    defineActivityWorkflowStatus={defineWorkflowStatus}

                                    toHide={toHide}
                                    directClick={true}
                                    node={treeProps}
                                    move={thisObj.move}
                                    ID={nodeKey}
                                    refresh={thisObj.refresh}
                                    reloadTree={thisObj.reloadTree}
                                    cancel={false}
                                    isStudyLock={JSON.parse(sessionStorage.studyDetails).locked}
                                />
                            }
                            {
                                nodeName === "whereclausedetails" &&
                                <AddWhereClause
                                    defineActivityWorkflowStatus={defineWorkflowStatus}

                                    toHide={toHide}
                                    directClick={true}
                                    node={treeProps}
                                    move={thisObj.move}
                                    ID={nodeKey}
                                    refresh={thisObj.refresh}
                                    reloadTree={thisObj.reloadTree}
                                    cancel={false}
                                    isStudyLock={JSON.parse(sessionStorage.studyDetails).locked}
                                />
                            }
                            {
                                nodeName === "codelistitemdetails" &&
                                <AddCodeList
                                    defineActivityWorkflowStatus={defineWorkflowStatus}
                                    toHide={toHide}
                                    action="Update"
                                    node={treeProps}
                                    directClick={true}
                                    ID={nodeKey}
                                    move={thisObj.move}
                                    refresh={thisObj.refresh}
                                    reloadTree={thisObj.reloadTree}
                                    cancel={false}
                                    isStudyLock={JSON.parse(sessionStorage.studyDetails).locked}
                                />
                            }
                            {
                                nodeName === "externalcodelistdetails" &&
                                <AddExternalCodeList
                                    defineActivityWorkflowStatus={defineWorkflowStatus}
                                    toHide={toHide}
                                    action="Update"
                                    node={treeProps}
                                    directClick={true}
                                    ID={nodeKey}
                                    move={thisObj.move}
                                    refresh={thisObj.refresh}
                                    reloadTree={thisObj.reloadTree}
                                    cancel={false}
                                    isStudyLock={JSON.parse(sessionStorage.studyDetails).locked}
                                />
                            }
                            </div>
                        </Box>
                    </Col>
                </Row>


            </div>
        );
    }
}

export default DefineTree;

