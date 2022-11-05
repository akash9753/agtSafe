import React, { Component } from "react";
import axios from 'axios';
import {
    Row,
    Modal,
    Form,
    Button,
    Tabs,
    Col
} from "antd";
import LayoutContent from "../../components/utility/layoutContent";
import ReactTable from "../Utility/reactTable";
import { MappingData } from "../TreeView/getMappingDatas";
import ButtonWithToolTip from "../Tooltip/ButtonWithToolTip";
import MonacoEditor from '@uiw/react-monacoeditor';
import MappingList from "./mappingList";
import BlocklyWorkspace from "./blocklyWorkspace"
import {
    CREATE,
    UPDATE,
    getUserID,
    getStudyID,
    errorModal,
    showProgress,
    hideProgress,
    getProjectRole,
    setSessionValue,
    CallServerPost,
    PostCallWithZone,
    errorModalCallback,
    successModalCallback,
} from "../Utility/sharedUtility";
import { HotTable, HotColumn } from '@handsontable/react';
import ImportMappingLibrary from "./ImportMappingLibrary";
import "handsontable/dist/handsontable.min.css";
import { SOURCE, WORK } from "../Utility/commonUtils";
import { lib } from "crypto-js";
const { TabPane } = Tabs;
var thisObj;
let alreadyunmount = false;
const projectRole = getProjectRole();

export default class MapperWorkSpace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: "work_map_list",
            addMapValues: {},
            action: "",
            MappingConstruct: {},
            iconClassChange: true,
            contentTabOpen: false,
            showProgramArea: false,
            nciCodelistData: [],
            ImportFromMappingLibrary_Data: [],
            ImportDataFromMappingLibrary_Column: [],
            Import_ShowAll: false,
            fnImporting: false,
            importLib_State: "",
            isCopy: false
        };
        thisObj = this;
    }

    componentWillUpdate(nextProps, nextState) {

        if (nextProps.sourceObj.TABLE_NAME !== this.props.sourceObj.TABLE_NAME || nextProps.sourceObj.COLUMN_NAME !== this.props.sourceObj.COLUMN_NAME) {
            this.clearWorkSpace("noChange");
        } else if (nextProps.showMapTab) {
            this.setState({
                activeKey: "work_map_list"
            });
        } else if (nextProps.actkey != undefined && nextProps.actkey != "") {
            this.setState({
                activeKey: nextProps.actkey
            });
        }
    }

    //Have to change the checkedout status if unmount
    componentWillUnmount() {
        //console.log(alreadyunmount)

        if (!alreadyunmount) {
            thisObj.clearWorkSpace();
        }
    }


    tabChanged = value => {
        this.setState({ activeKey: value });
    };


    //create one record to make Ischeckedout is 1
    addMapping = (values) => {
        thisObj = this;
        const isCopy = Object.keys(values.SelectedMapping).length > 0;
        let { cdiscDataStdDomainMetadataID, cdiscDataStdVariableMetadataID } = values.variable;
        let sourceTableName = !isCopy ? thisObj.props.sourceObj.TABLE_NAME : values.SelectedMapping.sourceDataset;
        let sourceVariableName = !isCopy ? thisObj.props.sourceObj.COLUMN_NAME : values.SelectedMapping.sourceVariableName;



        let data = {
            studyID: JSON.parse(
                sessionStorage.getItem("studyDetails")
            ).studyID,
            cDISCDataStdID: JSON.parse(
                sessionStorage.getItem("studyDetails")
            ).standardID,
            cDISCDataStdDomainMetadataID: cdiscDataStdDomainMetadataID,
            cDISCDataStdVariableMetadataID: cdiscDataStdVariableMetadataID,
            SourceDataset: sourceTableName,
            SourceVariableName: sourceVariableName,
            TimeZone: "IST",
            UpdatedBy: projectRole.userProfile.userID,
            IsCheckedOut: 1
        }
        showProgress();
        CallServerPost("MappingOperations/CreateMappingOperations", data).then((response) => {
            if (response.status === 1) {

                // if not created,delete the record. when overall refresh 
                setSessionValue("MappingDeleteIsCheckOut", response.value[0]);
                let mappingConst = response.value[0];
                if (isCopy) {
                    mappingConst.constructJson = values.SelectedMapping.constructJson;
                }
                alreadyunmount = false;
                thisObj.addMappingData(values);
                thisObj.setState({
                    showProgramArea: false,
                    isCopy: isCopy,
                    MappingConstruct: mappingConst,
                    ShowImportListFromLibrary: false,
                    ImportFromMappingLibrary_Data: []
                })
            } else {
                errorModal(response.message);
            }
            hideProgress();
        });

    }


    //Mapping add
    addMappingData = (values) => {
        thisObj = this;
        let { cdiscDataStdVersionID, cdiscDataStdDomainMetadataID, cdiscDataStdVariableMetadataID } = values.variable;

        let data = {
            cDISCDataStdID: JSON.parse(
                sessionStorage.getItem("studyDetails")
            ).standardID,
            ...values.variable
        }
        data["StudyID"] = JSON.parse(
            sessionStorage.getItem("studyDetails")
        ).studyID;
        //showProgress();
        CallServerPost("NCICodeList/GetNCIByDatasetVariable", data).then((response) => {
            if (response.status === 1) {
                let val = response.value;
                thisObj.setState({
                    activeKey: "work_map_list", addMapValues: {}, action: "" }, () => {
                    thisObj.setState({ activeKey: "workpace_key", nciCodelistData: val, addMapValues: values, action: CREATE });//changes made as per T#31
                });
            } else {
                errorModal(response.message);
            }
            hideProgress();
        });

    }
    //Mapping Edit
    MappingEdit = (mappingOperation) => {
        thisObj = this;
        let { cdiscDataStdVersionID, cdiscDataStdDomainMetadataID, cdiscDataStdVariableMetadataID } = mappingOperation;

        let data = {
            StudyID: JSON.parse(
                sessionStorage.getItem("studyDetails")
            ).studyID,
            cDISCDataStdID: 1,
            cdiscDataStdDomainMetadataID: cdiscDataStdDomainMetadataID,
            cdiscDataStdVariableMetadataID: cdiscDataStdVariableMetadataID
        }
        mappingOperation.unsavedOrder = mappingOperation.unsavedOrder ? 1 : 0;
        mappingOperation.isCheckedOut = 1;
        mappingOperation.updatedBy = projectRole.userProfile.userID;
        let data1 = mappingOperation;
        showProgress();
        //console.log(alreadyunmount)
        CallServerPost("MappingOperations/UpdateCheckInCheckOut", data1).then((response) => {
            if (response.status === 1) {
                setSessionValue("MappingUpdateIsCheckOut", response.value);
                alreadyunmount = false;

                // use latest record
                //so we can see the latest update by other user
                let latestRecord = response.value;

                //For updating impact record
                if (latestRecord.impact === 1) {
                    latestRecord.sourceDataset = mappingOperation.sourceDataset;
                    latestRecord.sourceVariableName = mappingOperation.sourceVariableName;
                }

                CallServerPost("NCICodeList/GetNCIByDatasetVariable", data).then((response) => {
                    hideProgress();

                    if (response.status === 1) {
                        let val = response.value;
                        thisObj.setState({ activeKey: "work_map_list", addMapValues: {}, action: "" }, () => {
                            thisObj.setState({
                                isCopy: false,
                                showProgramArea:false,
                                MappingConstruct: latestRecord,
                                nciCodelistData: val,
                                action: UPDATE,
                                activeKey: "workpace_key",
                                ShowImportListFromLibrary: false,
                                ImportFromMappingLibrary_Data: []
                            })
                        });
                    } else {
                        errorModal(response.message);
                    }

                }).catch((e) => {
                    //console.log(e);
                    hideProgress();
                });
            } else if (response.status === 0) {

                hideProgress();
                if (response.value === "Refresh") {
                    errorModalCallback(response.message, () => this.clearWorkSpace("refresh"));
                } else {
                    errorModal(response.message);

                }
            }

        }).catch((e) => {
            //console.log(e);
            hideProgress();
        });

    }

    //Clear Workspace
    clearWorkSpace = (nextStep = "") => {
        thisObj = this;
        if (nextStep === "refresh") {
            alreadyunmount = true;
            let MappinDatas = new MappingData();
            showProgress();
            MappinDatas.CallBack = (_, mappingList) => {
                thisObj.props.updateState({ mappingDataList: mappingList });
                thisObj.setState({
                    activeKey: "work_map_list",
                    addMapValues: {},
                    action: "",
                    showProgramArea: false,
                    MappingConstruct: {},
                    ShowImportListFromLibrary: false,
                    ImportFromMappingLibrary_Data: []
                });
                hideProgress();
            };
            MappinDatas.RefreshMapping({});
            thisObj.props.addWorkDataset([]);
        } else if (nextStep === "noChange") {
            // alreadyunmount = true;
            thisObj.props.addWorkDataset([]);

            thisObj.setState({
                activeKey: "work_map_list",
                addMapValues: {},
                action: "",
                showProgramArea: false,
                ShowImportListFromLibrary: false,
                ImportFromMappingLibrary_Data: []
            });
        }
        else {
            if (Object.keys(thisObj.state.MappingConstruct).length > 0) {
                let mapOperations = thisObj.state.MappingConstruct[0] !== undefined ? thisObj.state.MappingConstruct[0] : thisObj.state.MappingConstruct;
                //add
                if (nextStep !== "Update" && mapOperations.constructString === null) {
                    showProgress();
                    CallServerPost("MappingOperations/Delete", mapOperations).then((response) => {
                        if (response.status === 1) {

                            //Remove stored record in session
                            setSessionValue("MappingUpdateIsCheckOut", null);
                            setSessionValue("MappingDeleteIsCheckOut", null);
                            //end

                            thisObj.setState({
                                isCopy: false,
                                MappingConstruct: {},
                                ShowImportListFromLibrary: false,
                                ImportFromMappingLibrary_Data: []
                            });
                            //console.log("success");
                        } else {
                            thisObj.setState({
                                isCopy: false,
                                MappingConstruct: {},
                                ShowImportListFromLibrary: false,
                                ImportFromMappingLibrary_Data: []
                            });
                            // errorModal(response.message);
                        }
                        hideProgress();
                    });
                }
                //update
                else if (mapOperations.constructString !== null) {
                    let mappingOperations = mapOperations;
                    mappingOperations.unsavedOrder = mappingOperations.unsavedOrder ? 1 : 0;
                    mappingOperations.isCheckedOut = 0;
                    let data1 = mappingOperations;
                    showProgress();
                    CallServerPost("MappingOperations/UpdateCheckInCheckOut", data1).then((response) => {
                        if (response.status === 1) {
                            alreadyunmount = true;

                            //Remove stored record in session
                            setSessionValue("MappingUpdateIsCheckOut", null);
                            setSessionValue("MappingDeleteIsCheckOut", null);
                            //end

                            let MappinDatas = new MappingData();
                            MappinDatas.CallBack = (_, mappingList) => {
                                thisObj.props.updateState({ mappingDataList: mappingList });
                                thisObj.setState({
                                    MappingConstruct: {},
                                    activeKey: "work_map_list",
                                    addMapValues: {},
                                    action: "",
                                    showProgramArea: false,
                                    ShowImportListFromLibrary: false,
                                    ImportFromMappingLibrary_Data: []
                                });
                                hideProgress();
                            };
                            MappinDatas.RefreshMapping({});
                        } else {
                            hideProgress();
                            errorModal(response.message);
                        }

                    }).catch((e) => hideProgress());
                }

            }
            thisObj.props.addWorkDataset([]);

            thisObj.setState({ activeKey: "work_map_list", addMapValues: {}, action: "", showProgramArea: false });
        }

    }
    refreshMapping = (type = "") => {
        showProgress();
        let MappinDatas = new MappingData();
        MappinDatas.CallBack = (_, mappingList) => {
            if (type === "ALL") {
                //for import from lib
                //we have to select all tab in tree datasettree.js
                this.props.updateState({
                    sourceObj: {},
                    truemappingDataList: mappingList, type: "ALL"
                });

            } else {
                this.props.updateState({ mappingDataList: mappingList });
            }
            hideProgress();
        };
        MappinDatas.RefreshMapping({});
    }



    getTable = (valueObj, type) => {
        const getColHeaders = () => {
            let cols = [];
            if (valueObj.values.length > 0) {
                Object.keys(valueObj.values[0]).map(key => {
                    cols.push(key);
                });
            }
            return cols;
        }
        return (<HotTable
            width="100%"
            height="100%"
            key={valueObj.name + "_hottable_" + type}
            data={valueObj.values}
            licenseKey="non-commercial-and-evaluation"
            settings={
                {
                    stretchH: 'all',
                    colHeaders: getColHeaders(),
                    rowHeaders: true,
                    readOnly: true,
                    filters: true,
                    editor: false,
                    dropdownMenu: ['filter_by_condition', 'filter_by_value', 'filter_action_bar'],
                }
            }
        />)
    }
    onTabsEdit = (targetKey, action) => {
        if (action == "remove") {
            if (this.state.activeKey == targetKey) {
                this.setState({ activeKey: "work_map_list" });
            }
            const keys = targetKey.split("!!");
            if (keys[2] == WORK) {
                this.props.removeWorkTable(keys[0]);
            } else if (targetKey === "importmappinglibrary") {
                this.setState({ ShowImportListFromLibrary: false, ImportFromMappingLibrary_Data: [] });
            }
            else {
                this.props.removeTable(keys[0], keys[2]);
            }
        }
    }




    //Icon ClassName Change Func when SideToggle Button clicked
    arrowChangeFunc = () => {
        this.setState({ iconClassChange: !this.state.iconClassChange });
    }

    programAreShowHide = (value) => {
        this.setState({ showProgramArea: value });
    }

    //Import from Mapping Library

    ImportDataFromMappingLibrary = (mappingOperation = false, callback = this.ImportCreate) => {
        thisObj = this;

        let data = {};

        //If mappingOperation  false means get all
        //Get only by cDISCDataStdDomainMetadataID and cDISCDataStdVariableMetadataID
        if (mappingOperation) {
            let {
                targetDataSet,
                targetVariableName
            } = mappingOperation;

            data.targetDataSet = targetDataSet;
            data.targetVariableName = targetVariableName
            data.mappingLibraryID = 0;

        }
        else {
            data.mappingLibraryID = -1;
        }

        showProgress();
        thisObj.setState(
            {
                importLib_State: "reLoading"
            });
        CallServerPost("MappingLibrary/GetAll", data).then((res) => {
            hideProgress();
            if (res.status === 1) {

                let libraryRecord = res.value;

                let filterValueByAvailable_Source = [];
                let { SourceDataset } = thisObj.props.allValues;
                let Src_Variable = SourceDataset.Variable;

                libraryRecord && typeof libraryRecord === "object" && libraryRecord.map(lib_rec => {

                    lib_rec.source = lib_rec.sourceDataset + "." + lib_rec.sourceVariableName;
                    lib_rec.target = lib_rec.targetDataSet + "." + lib_rec.targetVariableName;
                    //For checkbox check 
                    lib_rec.Row_Selection = false;
                    filterValueByAvailable_Source.push(lib_rec);
                });

                if (filterValueByAvailable_Source.length > 0) {
                    thisObj.setState(
                        {
                            importLib_State: "reLoaded",
                            activeKey: "importmappinglibrary",
                            ShowImportListFromLibrary: true,
                            Import_ShowAll: !mappingOperation,
                            ImportFromMappingLibrary_Data: filterValueByAvailable_Source,
                            fnImporting: callback
                        });
                    return;
                }
            }
            thisObj.setState({ ShowImportListFromLibrary: false, ImportFromMappingLibrary_Data: [] });
            //!mappingOperation means show all
            //else show record by stddomain and variable
            if (!mappingOperation) {
                errorModal("No Rule available");
            } else {
                errorModal("No Rules available For " + mappingOperation.targetDataSet + "." + mappingOperation.targetVariableName);

            }


        }).catch((e) => {
            //console.log(e);
            hideProgress();
        });
    }

    //Get record from lib
    ImportCreate = (mappingoperationlist) => {
        let mappingoperation_list = mappingoperationlist.map(mappingoperation => {
            mappingoperation.StudyID = getStudyID();
            mappingoperation.ChangeReason = "Copied From Library";
            mappingoperation.isCheckedOut = 0;
            mappingoperation.UpdatedBy = getUserID();
            return mappingoperation;
        });

        showProgress();
        //Save reocrd to MappingConstruct table
        PostCallWithZone("MappingOperations/CreateMultipleMappingOperation", mappingoperation_list).then((response) => {
            const responseData = response;
            if (responseData.status === 1) {

                successModalCallback(response.message, () => {
                    thisObj.setState({
                        activeKey: "work_map_list",
                        ShowImportListFromLibrary: false,
                        ImportFromMappingLibrary_Data: []
                    }, () => thisObj.refreshMapping("ALL"));
                })
            } else {
                errorModal(response.message);
            }
            hideProgress();
        })
    }


    //Set activeKey
    setActiveKey = () => {
        this.setState({ activeKey: "workpace_key" });
    }
    importcancel = () => {
        this.setState((state) => ({
            activeKey: state.Import_ShowAll ? "work_map_list" : "workpace_key",
            ShowImportListFromLibrary: false, ImportFromMappingLibrary_Data: []
        }));

    }
    render() {
        const { action,
            activeKey,
            nciCodelistData,
            addMapValues,
            Import_ShowAll,
            MappingConstruct,
            ShowImportListFromLibrary,
            ImportFromMappingLibrary_Data,
            importLib_State,
            isCopy
        } = this.state;

        const { sourceTables, sourceObj, activityWrkflowStatus, allValues, isHeaderContentShowing } = this.props;
        let targetDomainVariable = "";
        if (action == CREATE) {
            targetDomainVariable = `${addMapValues.TargetDomain}.${addMapValues.TargetVariable}`;
        } else if (action == UPDATE) {
            targetDomainVariable = `${MappingConstruct.targetDataSet}.${MappingConstruct.targetVariableName}`;
        }

        const onMapping = action !== "";
        const srcVariable = 'TABLE_NAME' in sourceObj ? `(${sourceObj.TABLE_NAME}.${sourceObj.COLUMN_NAME})` : "";
        const srcVar2 = isCopy ? `${MappingConstruct.sourceDataset}.${MappingConstruct.sourceVariableName}` : 'TABLE_NAME' in sourceObj ? `${sourceObj.TABLE_NAME}.${sourceObj.COLUMN_NAME}` : "";
        const tabTitle = (<div><Button className="sideToggleBtn"
            onClick={(e) => {
                this.props.fnToHideShowTreeView();
                this.arrowChangeFunc();
                e.stopPropagation();
            }}>
            <i className={this.state.iconClassChange ? " fas fa-chevron-circle-left" : "fas fa-chevron-circle-right"} />
        </Button>
            <span style={{ marginLeft: 10 }}>{`Mapping List ${srcVariable}`}</span>
        </div>);
        const contenttabbtn = (
            <div>
                <Button style={{ marginRight: 10 }} className="sideToggleBtn" onClick={() => { this.setState({ contentTabOpen: !this.state.contentTabOpen }, () => { this.props.changeContentTab() }); }}>
                    <i className={this.state.contentTabOpen ? " fas fa-chevron-circle-up" : "fas fa-chevron-circle-down"} />
                </Button>
                {
                    activeKey == "workpace_key" &&
                    <Button className="sideToggleBtn" onClick={() => { this.setState({ showProgramArea: !this.state.showProgramArea }); }}>
                        <i className={this.state.showProgramArea ? " fas fa-caret-square-down" : "fas fa-caret-square-up"} />
                    </Button>
                }
            </div>
        )
        return (
            <div style={{ width: "100%", height: "100%" }}>
                <Tabs
                    hideAdd
                    onChange={this.tabChanged}
                    activeKey={activeKey}
                    type="editable-card"
                    key="work_tabs_key"
                    closable={true}
                    onEdit={this.onTabsEdit}
                    style={{ height: "100%" }}
                    tabBarExtraContent={
                        activeKey == "workpace_key" ? <div style={{ display: "flex" }}>
                            {
                                action == CREATE &&
                                < span style={{ fontWeight: 500, marginRight: 25 }}>
                                    {`Source: ${srcVar2} | Target : ${addMapValues.TargetDomain}.${addMapValues.TargetVariable}`}
                                </span>
                            }
                            {
                                action == UPDATE &&
                                < span style={{ fontWeight: 500, marginRight: 25 }}>
                                    {`Source: ${MappingConstruct.sourceDataset}.${MappingConstruct.sourceVariableName} | Target: ${MappingConstruct.targetDataSet}.${MappingConstruct.targetVariableName}`}
                                </span>
                            }
                            {contenttabbtn}
                        </div>

                            : contenttabbtn}
                >
                    <TabPane closable={false} tab={tabTitle} key={"work_map_list"}>
                        <Row >
                            <Col span={24}>
                                <LayoutContent>

                                    <MappingList
                                        isHeaderContentShowing={isHeaderContentShowing}
                                        activityWrkflowStatus={activityWrkflowStatus}
                                        activityDetails={this.props.activityDetails}
                                        MappingEdit={this.MappingEdit}
                                        sourceObj={this.props.sourceObj}
                                        targetObj={this.props.targetObj}
                                        mappingData={this.props.mappingData}
                                        allValues={this.props.allValues}
                                        type={this.props.type}
                                        addNewMapping={this.addMapping}
                                        onMapping={onMapping}
                                        refreshMapping={this.refreshMapping}
                                        ImportFromMappingLibrary={this.ImportDataFromMappingLibrary}
                                    />


                                </LayoutContent>
                            </Col>
                        </Row>
                    </TabPane>
                    {
                        (Object.keys(addMapValues).length > 0 || action == UPDATE) &&
                        <TabPane closable={false} tab={"WorkSpace"} key={"workpace_key"}>

                            <BlocklyWorkspace
                                    activityWrkflowStatus={activityWrkflowStatus}
                                    activityDetails={this.props.activityDetails}
                                    MappingConstruct={MappingConstruct}
                                    clearWorkSpace={this.clearWorkSpace}
                                    action={action}
                                    allValues={this.props.allValues}
                                    selectedTargetObj={addMapValues}
                                    work_datasets={this.props.work_datasets}
                                    mappingBlocks={this.props.mappingBlocks}
                                    sourceObj={isCopy ? { TABLE_NAME: MappingConstruct.sourceDataset, COLUMN_NAME: MappingConstruct.sourceVariableName } : this.props.sourceObj}
                                    addWorkTable={this.props.addWorkTable}
                                    addWorkDataset={this.props.addWorkDataset}
                                    showProgramArea={this.state.showProgramArea}
                                    fnToShowHideProgramArea={this.programAreShowHide}
                                    NCICODELISTDATA={nciCodelistData}
                                    ImportDataFromMappingLibrary={this.ImportDataFromMappingLibrary}
                                    setActiveKey={this.setActiveKey}
                                    bulkMapConfig={this.props.bulkMapConfig}
                                    targetDomainVariable={targetDomainVariable }
                            />
                        </TabPane>
                    }
                    {
                        sourceTables.map((tableObj) => {
                            return <TabPane tab={tableObj.name} key={tableObj.name + "!!tabkey!!" + SOURCE}>
                                <div style={{ height: isHeaderContentShowing ? "calc(100vh - 294px)" : "calc(100vh - 170px)", width: "100%" }}>
                                    {this.getTable(tableObj, SOURCE)}
                                </div>
                            </TabPane>
                        })
                    }
                    {
                        this.props.workTables.map((tableObj) => {
                            return <TabPane tab={tableObj.name} key={tableObj.name + "!!tabkey!!" + "work"}>
                                <div style={{ height: isHeaderContentShowing ? "calc(100vh - 294px)" : "calc(100vh - 170px)", width: "100%" }}>
                                    {this.getTable(tableObj, WORK)}
                                </div>
                            </TabPane>
                        })
                    }
                    {
                        ShowImportListFromLibrary &&
                        <TabPane tab={"Copy Rule"} key={"importmappinglibrary"} style={{ paddingBottom: 5 }}>
                            <ImportMappingLibrary
                                Standards={allValues.Standards}
                                SourceDataset={allValues.SourceDataset}
                                MappingList={allValues.MappingList}
                                ShowAll={Import_ShowAll}
                                libRecord={ImportFromMappingLibrary_Data}
                                import={this.state.fnImporting}
                                cancel={this.importcancel}
                                contentTabOpen={this.state.contentTabOpen}
                                importLib_State={importLib_State}
                            />
                        </TabPane>

                    }
                </Tabs>
            </div>
        );
    }
}