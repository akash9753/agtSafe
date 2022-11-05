import React, { Component } from 'react';
import { connect } from "react-redux";
import { Tooltip, Col, Row, Spin, Icon } from 'antd';
import Tree, { TreeNode } from '../../components/uielements/tree';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { InputSearch } from '../../components/uielements/input';
import Button from '../../components/uielements/button';
import ContentTab from '../TreeView/contentTab';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import Box from '../../components/utility/box';
import DataContext from "../TreeView/DataContext";
import { getStudyDetails } from '../Utility/sharedUtility';
import DatasetTree from './datasetTree';
import MapperWorkSpace from './mapperWorkSpace';
import appActions from "../../redux/app/actions";
import { CREATE, UPDATE, PostCallWithZone, successModalCallback, errorModal, showProgress, hideProgress, CallServerPost } from '../Utility/sharedUtility';
import { SOURCE, TARGET, WORK, TARGET_DATASET } from "../Utility/commonUtils";
import { MappingData, MappingDatas } from '../TreeView/getMappingDatas';

const headerStyleShow = {backgroundColor: '#ffffff', padding: "0px  10px 10px 10px", display: "block" };
const headerStyleHide = { display: "none" };
const flexDisplay = { display: "flex", flexDirection: "column", height: "100%", padding: "10px 0px 0px 0px", borderRadius:"5px" };
const studyDetails = getStudyDetails();
const { setCodeList } = appActions;
let thisObj = {};

var offProgress = false;

class MapIndex extends Component {
    constructor(props) {
        super(props);
        this.fnToHideShowTreeView = this.fnToHideShowTreeView.bind(this);
        let locationState = (props.location && props.location.state) ? props.location.state : {};


        this.state = {
            studyID: studyDetails.studyID,
            treeVisible: true,
            loading: false,
            mappingDataList: [],
            sourceTables: [],
            workTables: [],
            mappingBlocks: [],
            sourceObj: {},
            type: "ALL",
            targetObj: {},
            work_datasets: [],
            showContentTab: false,
            showMapTab: false,
            actkey: "",
            Load: false,
            from: locationState.from,
            activityWrkflowStatus: locationState.wrkFlowStatus,
            refreshToChooseAllNodeTree: "",
            bulkMapConfig:[]
        };
        thisObj = this;
        sessionStorage.projectInActive = props.location.state.projectInActive;
       this.FetchBlocks(this);
    }


    componentDidMount() {
        if (!MappingDatas.Loaded) {

            showProgress();
            let MappinDatas = new MappingData();
            MappinDatas.CallBack = () => {

                thisObj.setState({ Load: true, mappingDataList: MappingDatas.MappingList }, () => {
                    //two controller fns are calling .so , in order to not stop loading for 2nd controller fn we are handle following fn
                    offProgress && hideProgress();
                    offProgress = !offProgress;
                }
                );
            }
            MappinDatas.GetInit();
        } else {
            offProgress = true;
        }
    }
    componentWillUnmount() {
        sessionStorage.removeItem("projectInActive")
    }

    addWorkTable = (table, name, columns, callBack = null) => {
        const dsvalue = {
            name: name,
            values: table
        };
        const newtables = [...this.removeIfExists(name), dsvalue];
        const actkey = name + "!!tabkey!!" + "work";
        if (callBack !== null) {
            const newWork = [...this.state.work_datasets.filter(e => e.memname.toLowerCase() !== name.toLowerCase()), ...columns]
            this.setState({ workTables: newtables, work_datasets: newWork, actkey: actkey }, () => {
                this.setState({ actkey: "" }, () => {
                    callBack();
                });

            });
        } else {
            this.setState({
                workTables: newtables, actkey: actkey
            }, ()=> {
                    this.setState({ actkey: "" });
            });
        }
    }

    //Fire when click the Get Work Dataset of step contextmenu option (in BlocklyWorkspace.js)
    addWorkDataset = (workdataset, callBack = null) =>
    {
        try {
            if (callBack !== null) {
                this.setState({ work_datasets: workdataset }, () => {
                    callBack(workdataset);
                });

            }
            else {
                this.setState({ work_datasets: workdataset});
            }
        }
        catch (e)
        {
            console.log(e);
        }
    }
    updateSourceTables = (values, name) => {
        const actkey = name + "!!tabkey!!" + "source";
        this.setState({ ...values, actkey: actkey }, () => {
            this.setState({ actkey: "" });
        });
    }


removeWorksetsIfExists = (key) => {
    let srctabscopy = [...this.state.work_datasets];
    let newSrcTables = [];
    srctabscopy.map((tablesrc) => {
        if (tablesrc.name !== key) {
            newSrcTables.push(tablesrc);
        }
    });
    return newSrcTables;
}

removeIfExists = (key) => {
    let srctabscopy = [...this.state.workTables];
    let newSrcTables = [];
    srctabscopy.map((tablesrc) => {
        if (tablesrc.name !== key) {
            newSrcTables.push(tablesrc);
        }
    });
    return newSrcTables;
}
removeWorkTable = (key) => {
    this.setState({ workTables: this.removeIfExists(key) });
}


FetchBlocks = (thisObj) => {
    showProgress();
    let reqObj = { FetchNCI: false };
    let hasNCI = true;

    if (thisObj.props.codelist === null)
    {
        hasNCI = false;
        reqObj.FetchNCI = false;
        
        reqObj["UserID"] = JSON.parse(sessionStorage.userProfile).userID;

        reqObj["StudyID"] = JSON.parse(
            sessionStorage.getItem("studyDetails")
        ).studyID
        let studyDet = getStudyDetails();

        //let nciCodeListID = () => {
        //    return studyDet.sdtmEnabled ? studyDet.sdtmStudyProperty.codelistVersionID :
        //            studyDet.sendEnabled ? studyDet.sendStudyProperty.nciCodeListID :
        //                studyDet.adamEenabled ? studyDet.adamStudyProperty.nciCodeListID : -1;
            
        //}

        reqObj["NCICodeListID"] = studyDet.codelistVersionID;
    }
    CallServerPost("MappingOperations/GetMappingWorkspaceValues", reqObj).then((response) => {
        const responseData = response;
        if (responseData.status == 1) {
         
            thisObj.setState({ mappingBlocks: responseData.value["mappingBlocks"], bulkMapConfig: responseData.value["bulkMapConfig"] , work_datasets: [] }, () => {
                //two controller fns are calling .so , in order to not stop loading for 2nd controller fn we are handle following fn
                    //2nd api takestime load, it can be loaded in background for now
                offProgress && hideProgress();
                offProgress = !offProgress;
                // Not Loading from server . Work datasets are loaded internally
                //CallServerPost("Py/GetWorkTreeData", {
                //    'username': JSON.parse(sessionStorage.userProfile).userName, StudyID: JSON.parse(
                //        sessionStorage.getItem("studyDetails")
                //    ).studyID
                //}).then((response2) =>
                //{
                    
                   
                //    //console.log(response2);
                //    if (response2.status == 1 && response2.value != null && 'dataset' in response2.value) {
                //        thisObj.setState({ work_datasets: JSON.parse(response2.value.dataset), mappingBlocks: responseData.value["mappingBlocks"] });
                //    }


                //});

            });
            

        } else {
            //two controller fns are calling .so , in order to not stop loading for 2nd controller fn we are handle following fn

            offProgress && hideProgress();
            offProgress = !offProgress;
        }
    });

}

updateState = (values) => {
    const { sourceObj } = this.state;
    if (Object.keys(sourceObj) > 0 && values.TABLE_NAME == sourceObj.TABLE_NAME && values.COLUMN_NAME == sourceObj.COLUMN_NAME) {
        if ("showMapTab" in values) {
            this.setState({ showMapTab: true }, () => {
                this.setState({ showMapTab: false });
            });
        }
        
    } else if (values.type && values.type === "ALL")
    {
        this.setState({ ...values, type: "ALL", refreshToChooseAllNodeTree: true, showMapTab: true }, () =>
        {
            this.setState({ showMapTab: false, refreshToChooseAllNodeTree: false });
        });
    }
    else {
        this.setState({ ...values }, () => {
            this.setState({ showMapTab: false });
        });
    }
}



fnToHideShowTreeView = () => {
    this.setState({ treeVisible: !this.state.treeVisible });
}


removeTable = (key, type) => {
    if (type == SOURCE) {
        let srctabscopy = [...this.state.sourceTables];
        let newSrcTables = [];
        srctabscopy.map((tablesrc) => {
            if (tablesrc.name !== key) {
                newSrcTables.push(tablesrc);
            }
        });
        this.setState({ sourceTables: newSrcTables });
    }
}

changeContentTab = () => {
    this.setState({ showContentTab: !this.state.showContentTab })
}


render() {
    const { treeVisible,
        activityWrkflowStatus, from, refreshToChooseAllNodeTree, isMappingPage, sourceTables, sourceObj, mappingDataList, work_datasets,type } = this.state;
    const permissions = this.props.permissions;
    let allActivityDetails = this.props.location ? this.props.location.state.allActivityDetails : [];
    return (
        <div>
            <DataContext.Provider value={{
                ...MappingDatas,
                permissions: permissions,
                projectStudyLockStatus: this.props.history.location.state.projectStudyLockStatus
            }}>
                <LayoutWrapper className="treeview-layout">
                    <Row style={{ width: '100%', height: '100%', overflow: "auto" }}>
                        <Col
                            md={treeVisible ? 5 : 0}
                            sm={treeVisible ? 24 : 0}
                            xs={treeVisible ? 24 : 0} style={{ height: '100%', background: "#fff", borderRadius: "5px" }}>
                            <div style={{ height: '100%', background: "transparent", padding:"10px" }} >
                                <Row style={{ height: '100%' }}>
                                    <Col style={{ height: '100%' }}>
                                        <DatasetTree
                                            activityDetails={allActivityDetails}
                                            history={this.props.history}
                                            sourceTables={sourceTables}
                                            updateState={this.updateState}
                                            work_datasets={work_datasets}
                                            addWorkTable={this.addWorkTable}
                                            updateSourceTables={this.updateSourceTables}
                                            removeWorkTable={this.removeWorkTable}
                                            from={from}
                                            refreshToChooseAllNodeTree={refreshToChooseAllNodeTree}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col md={treeVisible ? 19 : 24} sm={treeVisible ? 24 : 0} xs={treeVisible ? 24 : 0} style={{ height: '100%', display: "flex", flexDirection: "column", paddingLeft:"5px" }}>
                            <Box style={flexDisplay}>
                                <div style={this.state.showContentTab ? headerStyleShow : headerStyleHide} >
                                    <Row>
                                        <Col span={24}>
                                            <ContentTab showToggleIcon={false} actidetails={allActivityDetails} />
                                        </Col>
                                    </Row>
                                </div>
                                <Row id="pdfDivRow" style={{ display: "flex", flexDirection: "column", height:'100%' }}>
                                    <Col id="pdfDiv" style={{ height: "100%" }}>
                                        <LayoutContentWrapper style={{ height: "100%" }}>
                                            <MapperWorkSpace
                                                activityWrkflowStatus={activityWrkflowStatus}
                                                activityDetails={allActivityDetails}
                                                sourceTables={sourceTables}
                                                allValues={{ ...MappingDatas }}
                                                updateState={this.updateState}
                                                mappingData={MappingDatas.MappingList}
                                                work_datasets={work_datasets}
                                                type={this.state.type}
                                                mappingBlocks={this.state.mappingBlocks}
                                                sourceObj={sourceObj}
                                                targetObj={this.state.targetObj}
                                                removeTable={this.removeTable}
                                                addWorkTable={this.addWorkTable}
                                                addWorkDataset={this.addWorkDataset}
                                                workTables={this.state.workTables}
                                                removeWorkTable={this.removeWorkTable}
                                                fnToHideShowTreeView={this.fnToHideShowTreeView}
                                                changeContentTab={this.changeContentTab}
                                                showMapTab={this.state.showMapTab}
                                                actkey={this.state.actkey}
                                                bulkMapConfig={this.state.bulkMapConfig}
                                                isHeaderContentShowing={this.state.showContentTab}

                                            />
                                        </LayoutContentWrapper>
                                    </Col>

                                </Row>
                            </Box>

                        </Col>
                    </Row>
                </LayoutWrapper>
            </DataContext.Provider>
        </div>
    );
}
}

export default connect(
    state => ({
        codelist: state.App.toJS().codelist
    }),
    { setCodeList }
)(MapIndex);