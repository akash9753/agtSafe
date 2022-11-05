import React, { Component } from 'react';
import Tree, { TreeNode } from '../../components/uielements/tree';
import { InputSearch } from '../../components/uielements/input';
import ProgramStudy from './ProgramStudy.js';
import ProgramEditor from './ProgramEditor.js';
import ProgramEditorDS from './ProgramEditorDS';
import ProgramList from './ProgramList.js';
import { CallServerPost, errorModal, successModalCallback, showProgress, hideProgress, getStudyDetails, mappingPermission } from '../Utility/sharedUtility';
import NewListComponentWrapper from '../TreeView/newListComponent.style';
import { Col, Row, Form, Modal, Icon, Button, Input, Tooltip, Menu, Dropdown } from 'antd';
import Box from '../../components/utility/box';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import ContentTab from '../TreeView/contentTab';
import { MappingData, MappingDatas } from '../TreeView/getMappingDatas';
import TargetVariableCreation from './TargetVarCreation';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import TargetVarCreationUpdation from './TargetVarCreation/TargetVarCreationUpdation';
import Tabs, { TabPane } from '../../components/uielements/tabs';
const { confirm } = Modal;

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var programData = [];
var tempData = [];
var thisObj = {}
var offProgress = false;
class ProgramTree extends Component {

    constructor(props) {
        super(props);

        let locationState = (props.location && props.location.state) ? props.location.state : {};


        this.state =
        {
            searchValue: '',
            loading: true,
            programData: [],
            treeVisible: true,
            mappingBlocks: [],
            TargetVariables: {},
            autoExpandParent: true,
            AllTargetVariables: {},
            contentTabVisible: false,
            from: locationState.from,
            activityDetails: locationState.allActivityDetails,
            activityWrkflowStatus: locationState.wrkFlowStatus,
            showCreateTargetVarModal: false,
            readOnly: !mappingPermission(locationState.wrkFlowStatus)

        };
        this.getTargetDomainVars();
        this.FetchBlocks(this);
        thisObj = this;
    }

    componentDidMount() {
        if (!MappingDatas.Loaded) {
            showProgress();
            let MappinDatas = new MappingData();
            MappinDatas.CallBack = () => {

                thisObj.setState({ Load: true, mappingDataList: MappingDatas.MappingList }, () => {
                    //console.log(1)
                    //two controller fns are calling .so , in order to not stop loading for 2nd controller fn we are handle following fn
                    offProgress && hideProgress();
                    offProgress = !offProgress;
                })
            }
            MappinDatas.GetInit();


        }
        else {
            offProgress = true;
        }
    }


    getTargetDomainVars = (resolve = null, reject = null) => {
        const thisObj = this;
        var values = {};
        values["StudyID"] = JSON.parse(sessionStorage.getItem("studyDetails")).studyID;
        showProgress();
        CallServerPost('Study/GetAllTargetDataSetMetaData', values)
            .then(
                function (response) {

                    var TargetVariables = {};
                    if (response.value !== null) {
                        const varMetadata = response.value.TargetVariable;
                        var datasetList = response.value.TargetDataset;
                        var targetDataSet = [];

                        let hasValues = false;
                        if (datasetList && typeof datasetList === "object") {
                            hasValues = true;

                            datasetList.map(function (dataset) {
                                //Filter by targetDomain  and isimpact
                                //if impact rule means no need to show that var
                                var variables = varMetadata.filter(varMeta => varMeta.TargetDataSet === dataset.TargetDataSet && varMeta.Impact === "0");
                                var allChildVars = [];

                                //the following if is to check no child means no need to display parent node
                                if (variables.length > 0) {
                                    //sort by order key
                                    variables = variables.sort((v2, v1) => v2.Order < v1.Order ? -1 : v2.Order > v1.Order ? 1 : 0);

                                    let isManualTarget = true;
                                    //Child
                                    variables.map(function (childNode) {
                                        if (childNode.VariableName.toLowerCase() != "row_num") {
                                            isManualTarget = !('MappingConstructID' in childNode);
                                            allChildVars.push({
                                                Source: null,
                                                Children: null,
                                                Selected: false,
                                                Collapsed: true,
                                                LeftClickAction: "",
                                                data: JSON.stringify(childNode),
                                                Key: childNode.VariableName,
                                                Title: childNode.VariableName,
                                                Id: childNode.CDISCDataStdVariableMetadataID,
                                                domainID: childNode.CDISCDataStdDomainMetadataID,
                                                isDomain: false,
                                            });
                                        }
                                    });

                                    //Parent 
                                    if (dataset.TargetDataSet !== "" && dataset.TargetDataSet) {
                                        targetDataSet.push({
                                            Children: allChildVars,
                                            Collapsed: true,
                                            Folder: false,
                                            Id: dataset.TargetDataSet,
                                            Key: dataset.TargetDataSet,
                                            LeftClickAction: "",
                                            Selected: false,
                                            Source: "TargetDataset",
                                            TabName: "Mapping",
                                            Title: dataset.TargetDataSet,
                                            isManualTarget: isManualTarget,
                                            isDomain: true,
                                        });
                                    }

                                }
                            });

                            if (resolve) {
                                thisObj.setState({ TargetVariables: hasValues ? targetDataSet : [], AllTargetVariables: varMetadata }, resolve());
                            } else {
                                thisObj.setState({ TargetVariables: hasValues ? targetDataSet : [], AllTargetVariables: varMetadata, nodename:"" });
                            }

                        }

                    }
                    else {
                        //for Workspace save function
                        //resolve and reject come from workspcae
                        return reject ? reject() : false;
                    }
                    hideProgress();
                });
    }

    onChange = (e) => {
        const value = e.target.value;
        tempData = [];
        if (value != "") {
            this.searchData(this.state.programData, null, value, tempData)
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
    clearSearch = () => {
        this.setState({
            expandedKeys: [],
            searchValue: "",
            autoExpandParent: true,
        });
    }

    onExpand = expandedKeys => {
        this.setState({
            expandedKeys,
            autoExpandParent: false
        });
    };

    onTreeNodeSelect = (selectedKeys, e) => {
        const thisObj = this;
        if (e.node.props.isDomain) {
            if (e.node.props.domainID !== undefined) {
                thisObj.setState({ nodename: "ProgramEditor", selectedDomain: e.node.props.domainID, selectedVariable: e.node.props.eventKey });
            } else if (e.node.props.domain !== undefined) {
                thisObj.setState({ nodename: "ProgramEditorDS", selectedDomain: e.node.props.domain, datasetName: e.node.props.eventKey });
            }
            if (!e.node.props.domain) {
                thisObj.setState({ nodename: "TargetDataset", selectedDomain: e.node.props.eventKey, datasetName: e.node.props.eventKey });
            }
        }

    };

    fnToHideShowTreeView = () => {
        this.setState({ treeVisible: !this.state.treeVisible });
    }
    hideTreewhenImport = () => {
        this.setState({ treeVisible: false });
    }

    /* */
    FetchBlocks = (thisObj) => {
        showProgress();
        let reqObj = { FetchNCI: false };
        let hasNCI = true;
        hasNCI = false;
        reqObj.FetchNCI = false;

        reqObj["UserID"] = JSON.parse(sessionStorage.userProfile).userID;
        //console.log(thisObj.props)
        let studyDet = getStudyDetails();

        //let nciCodeListID = () => {
        //    return studyDet.sdtmEnabled ? studyDet.sdtmStudyProperty.nciCodeListID :
        //        studyDet.sendEnabled ? studyDet.sendStudyProperty.nciCodeListID :
        //            studyDet.adamEenabled ? studyDet.adamStudyProperty.nciCodeListID : -1;

        //}

        reqObj["NCICodeListID"] = studyDet.codelistVersionID;
        reqObj["StudyID"] = studyDet.studyID;
        showProgress();
        CallServerPost("MappingOperations/GetMappingWorkspaceValues", reqObj).then((response) => {
            const responseData = response;

            if (responseData.status == 1) {
                //console.log(11)

                //CallServerPost("Py/GetWorkTreeData", {
                //    'username': JSON.parse(sessionStorage.userProfile).userName, StudyID: JSON.parse(
                //        sessionStorage.getItem("studyDetails")
                //    ).studyID
                //}).then((response2) => {
                //    //console.log(response2);
                //    if (response2.status == 1 && response2.value != null && 'dataset' in response2.value) {
                //        thisObj.setState({ work_datasets: JSON.parse(response2.value.dataset), mappingBlocks: responseData.value["mappingBlocks"] });
                //    } else {
                //thisObj.setState({ mappingBlocks: responseData.value["mappingBlocks"], work_datasets: [] });
                //}
                //console.log(111)
                thisObj.setState({ mappingBlocks: responseData.value["mappingBlocks"], work_datasets: [] });

                //two controller fns are calling .so , in order to not stop loading for 2nd controller fn we are handle following fn
                offProgress && hideProgress();
                offProgress = !offProgress;
                /* })*/
            } else {
                //two controller fns are calling .so , in order to not stop loading for 2nd controller fn we are handle following fn
                offProgress && hideProgress();
                offProgress = !offProgress;
            }
        });

    }

    changeContentTab = () => {

        this.setState({ contentTabVisible: !this.state.contentTabVisible });
    }

    refresh = (resolve = null, reject = null) => {
        //parameters resolve and reject from workspace save action
        this.getTargetDomainVars(resolve, reject);
    }

    //Add Custom Variable
    showCreateCustomVariable = () => {
        thisObj.setState({ showCreateTargetVarModal: true })
    }
    //Hide the modal
    hideCreateTargetVarModal = (refresh = false) => {
        if (refresh) {
            thisObj.setState({ showCreateTargetVarModal: false }, () => {
                thisObj.getTargetDomainVars();
            });
        } else {

            thisObj.setState({ showCreateTargetVarModal: false })
        }
    }

    //Delete the manually created Target
    deleteTarget = (dataset) => {
        const tis = this;
        confirm({
            title: 'Are you sure to delete ' + dataset + '?',
            content: '',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                tis.confirmDeleteTarget(dataset);
            },
            onCancel() {
            },
        });
        
    }
    confirmDeleteTarget = (dataset) => {
        let reqObj = {};
        let studyDet = getStudyDetails();
        reqObj["StudyID"] = studyDet.studyID;
        reqObj["Domain"] = dataset;
        showProgress();
        const thisob = this;
        CallServerPost("MappingOperations/DeleteDirectTarget", reqObj).then((response) => {
            const responseData = response;
            hideProgress();
            if (responseData.status == 1) {
                successModalCallback("Domain deleted successfully!", thisob.getTargetDomainVars);
            } else {
                errorModal(responseData.message);
            }
        });
    }

    render() {

        const
            {
                from,
                nodename,
                searchValue,
                treeVisible,
                datasetName,
                expandedKeys,
                mappingBlocks,
                selectedDomain,
                TargetVariables,
                activityDetails,
                autoExpandParent,
                selectedVariable,
                contentTabVisible,
                AllTargetVariables,
                activityWrkflowStatus,
                showCreateTargetVarModal,
                readOnly
            } = this.state;

        const { projectInActive, projectStudyLockStatus, fromDashboard } = this.props.location.state;

        const loop = data =>
            data.map(item => {
                const index = item.Title.toLowerCase().indexOf(this.state.searchValue.toLowerCase());
                const beforeStr = item.Title.substr(0, index);
                const afterStr = item.Title.substr(index + this.state.searchValue.length);
                let tempTitle = item.Title;

                if (item.Children != null) {
                    if (item.Children.length != 0) {
                        tempTitle = item.Title + " (" + item.Children.length + ")";
                    }
                }
                //END
                const title = (index > -1 && this.state.searchValue != "") ? (
                    <span style={{ color: 'red' }}>{tempTitle}</span>
                ) : <span>{tempTitle}</span>;
                //Delete option only for Manual target creation
                const menus = (dsname) => {
                    return (
                        <Menu >
                            <Menu.Item key={dsname} name={dsname} onClick={(e) => {
                                //handle event capturing to parent click
                                'domEvent' in e && e.domEvent.stopPropagation();
                                this.deleteTarget(dsname)
                            }}>Delete</Menu.Item>
                        </Menu>
                    )
                };
                const getTitle = (name) => {
                    return <div>
                        <Dropdown overlay={menus(name)} trigger={['contextMenu']}>
                            <div style={{ color: "black" }}>
                                {title}
                            </div>
                        </Dropdown>
                    </div>;
                }


                if (item.Children != null && item.Children.length > 0) {
                    if (typeof item.Children[0].domainID !== 'undefined') {
                        let titleName = item.isManualTarget ? getTitle(item.Title) : title;
                        return (
                            <TreeNode selectable isDomain={item.isDomain} domain={item.Children[0].domainID} key={item.Title} title={titleName}>
                                {loop(item.Children)}
                            </TreeNode>
                        );
                    } else {
                        let titleName = item.isManualTarget ? getTitle(item.Title) : title;

                        return (
                            <TreeNode selectable isDomain={item.isDomain} key={item.Title} title={titleName}>
                                {loop(item.Children)}
                            </TreeNode>
                        );
                    }

                }
                return <TreeNode selectable key={item.Id ? item.Id : item.key} domainID={item.domainID ? item.domainID : null} title={title} />;
            });

        // const targetDataSet1 = this.state.programData.filter(item => item.Title === "Target Dataset");
        //console.log(TargetVariables);
        return (
            <>
                <LayoutWrapper id="treeview_layout" style={{ height: "calc(100vh - 83px)" }}>
                    <Box style={{ display: "flex", flexDirection: "column", padding: "6px 0px 10px 0px" }}>
                        <Row style={{ width: '100%', height: '100%' }}>

                            <Col span={6} style={{ height: '100%', display: treeVisible ? "block" : "none", borderRight: "1px solid lightgrey" }} >
                                <Box>
                                    <div style={{ display: "table" }}>
                                        <Tooltip placement="rightTop" title={"Project List"}>
                                            <Button style={{ display: "table-cell", marginRight: 10 }}
                                                className="sideToggleBtn"
                                                onClick={(e) => {
                                                    this.props.history.push("/trans/project", { openSelectedStudy: true });

                                                }}>
                                                <i className="fas fa-arrow-left" />
                                            </Button>
                                        </Tooltip>
                                        <span style={{ display: "table-cell", width: "100%" }}>
                                            {
                                                searchValue !== "" ?
                                                    <Input tabIndex="0" suffix={<Icon type="search" style={{ width: "100%", color: 'rgba(0,0,0,.25)', float: 'right' }} />} suffix={<Icon onClick={this.clearSearch} type="close" style={{ color: 'rgba(0,0,0,.25)', float: 'right' }} />} style={{ width: '100%', minWidth: '100px' }} value={searchValue} onChange={this.onChange} placeholder="Search" />
                                                    :
                                                    <Input tabIndex="0" suffix={<Icon type="search" style={{ width: "100%", color: 'rgba(0,0,0,.25)', float: 'right' }} />} style={{ width: '100%', minWidth: '100px' }} value={searchValue} onChange={this.onChange} placeholder="Search" />
                                            }
                                        </span>
                                        {
                                            !readOnly &&
                                            <ButtonWithToolTip
                                                tooltip="Add Target Dataset"
                                                name="addtargetDataset"
                                                shape="circle"
                                                classname="fas fa-plus"
                                                style={{ marginLeft: "10px" }}
                                                size="small"
                                                onClick={() => this.showCreateCustomVariable()} />
                                        }
                                    </div>
                                    {Object.keys(TargetVariables).length > 0 &&
                                        <div style={{ maxHeight: 'calc(100vh - 143px)', overflow: 'auto' }}>
                                            <Tree
                                                onExpand={this.onExpand}
                                                expandedKeys={expandedKeys}
                                                autoExpandParent={autoExpandParent}
                                                onSelect={this.onTreeNodeSelect}
                                            >
                                                {loop(TargetVariables)}
                                            </Tree>
                                        </div>
                                    }

                                </Box>
                            </Col>
                            <Col span={treeVisible ? 18 : 24} className="op_parent_div"  >
                                {contentTabVisible &&
                                    <ContentTab
                                        from={from}
                                        projectInActive={projectInActive}
                                        history={this.props.history}
                                        projectStudyLockStatus={projectStudyLockStatus}
                                        fromDashboard={fromDashboard}
                                        sideToggle={this.fnToHideShowTreeView}
                                        showToggleIcon={true}
                                        actidetails={activityDetails}
                                    />
                                }
                                {
                                    nodename === "ProgramEditor" &&
                                    <ProgramEditor
                                        selectedDomain={selectedDomain}
                                        selectedVariable={selectedVariable}
                                        contentTabVisible={contentTabVisible}
                                        changeContentTab={this.changeContentTab}
                                        activityWrkflowStatus={activityWrkflowStatus}
                                        projectStudyLockStatus={this.props.location.state.projectStudyLockStatus}
                                    />
                                }
                                {
                                    nodename === "ProgramEditorDS" &&
                                    <ProgramEditorDS
                                        refresh={this.refresh}
                                        datasetName={datasetName}
                                        TargetVars={TargetVariables}
                                        mappingBlocks={mappingBlocks}
                                        selectedDomain={selectedDomain}
                                        activityDetails={activityDetails}
                                        contentTabVisible={contentTabVisible}
                                        AllTargetVariables={AllTargetVariables}
                                        changeContentTab={this.changeContentTab}
                                        activityWrkflowStatus={activityWrkflowStatus}
                                        projectStudyLockStatus={this.props.location.state.projectStudyLockStatus}
                                    />
                                }

                                {
                                    !showCreateTargetVarModal && nodename === "TargetDataset" &&
                                    <Tabs
                                        hideAdd
                                        className="op_tabs"
                                        closable={false}
                                        type="editable-card"
                                        style={{ width: '100%' }}
                                        activeKey={datasetName}
                                    >
                                        <TabPane
                                            tab={datasetName}
                                            key={datasetName}
                                            className="op_tabpane"

                                            closable={false}
                                        >
                                            <div style={{ padding: "10px" }}>
                                                <TargetVarCreationUpdation
                                                    stepNo={1}
                                                    cancel={this.hideCreateTargetVarModal}
                                                    canceling={false}
                                                    tar_Domain={datasetName}
                                                    isEdit={true}
                                                    tar_Variables={[]}
                                                    readOnly={readOnly}
                                                    activityWrkflowStatus={activityWrkflowStatus}
                                                />
                                            </div>
                                        </TabPane>
                                    </Tabs>
                                }
                            </Col>
                        </Row>
                    </Box>
                </LayoutWrapper>
                {showCreateTargetVarModal && <TargetVariableCreation tar_ds={TargetVariables} readOnly={readOnly} visible={showCreateTargetVarModal} cancel={this.hideCreateTargetVarModal} />}
            </>
        );
    }
}

export default ProgramTree;

