import React, { Component } from 'react';
import axios from 'axios';
import { Modal, Spin, Icon, Row, Tooltip } from 'antd';
import Button from '../../components/uielements/button';
import {
    validJSON,
    CallServerPost,
    errorModal,
    successModalCallback,
    DownloadFileWithPostData,
    showProgress,
    hideProgress,
    XPTSuccessModal,
    mappingPermission
} from '../Utility/sharedUtility';
import { DownloadasText, DownloadasSas } from '../Utility/exportFile';
import CodeMirror from "../AdvancedUI/codeMirror/codeMirror.style";
import Tabs, { TabPane } from '../../components/uielements/tabs';
import BlockWorkResult from '../Mapper/blockWorkResult';
import ProgramWorkSpace from './Workspace';
import MonacoEditor from '@uiw/react-monacoeditor';
import { HotTable, HotColumn } from '@handsontable/react';

const empty = "\n\n\n\n\n\n\n\n\n";
let thisObj = {};
class ProgramEditorDS extends Component {
    constructor(props) {
        super(props);

        //get programtype 
        //for generate button functionality
        let actV = props.activityDetails.find(x => x.activityText === "Transformation" && x.configurationName === "MappingOutput");
        let progType = 1;
        if (actV) {
            progType = parseInt(actV.configurationValue);
        }
        //end

        this.state = {
            log: "",
            lstHTML: "",
            activeKey: '1',
            loading: false,
            datasetName: "",
            //used only for tab 1
            defaultVariable: [],
            pythonProgram: empty,
            mappingProgram: empty,
            programType: progType,
            view_dataset: [],
            sasfooter: true
        };

        thisObj = this;


    }
    static getDerivedStateFromProps(nextProps, currState) {
        if (nextProps.datasetName !== currState.datasetName) {
            if (currState.programType === 1) {
                thisObj.generatepythonProgramForDomain(nextProps.selectedDomain, nextProps.datasetName);
                return { activeKey: "1" }

            }
            else if (currState.programType === 2) {
                thisObj.generateMacroCallProgramForDomain(nextProps.selectedDomain, nextProps.datasetName);
                return { activeKey: "1" }

            }

        }
    }
    onTabChange = (activeKey) => {
        this.setState({ activeKey: activeKey });
    };
    generateMacroCallProgramForDomain = (selectedDomain, datasetName, newlySelctedDatasetVar, oldOrder) => {
        const thisObj = this;
        let { TargetVars } = this.props;

        var values = {};
        let StudyID = JSON.parse(sessionStorage.getItem("studyDetails")).studyID;
        let ProjectID = JSON.parse(sessionStorage.getItem("studyDetails")).projectID;
        let UpdatedBy = JSON.parse(sessionStorage.userProfile).userID;
        var selctedDatasetVar = TargetVars.find(x => x.Id === datasetName);



        let targetvariable = (selctedDatasetVar && typeof selctedDatasetVar === "object") ?
            selctedDatasetVar.Children.map((target, i) => {
                let data = validJSON(target.data);
                if ('Order' in data) {
                    data.Order = i + 1;
                }
                return data;
            }) : [];
        //saved order

        if (newlySelctedDatasetVar === undefined ||
            (newlySelctedDatasetVar[0].CDISCDataStdVariableMetadataID === oldOrder.Children[0].Id &&
                newlySelctedDatasetVar.length === oldOrder.Children.length)) {
            values =
            {
                StudyID: StudyID,
                ProjectID: ProjectID,
                execution: targetvariable,
                TargetDataSet: datasetName,
                CDISCDataStdDomainMetadataID: selectedDomain,
                UpdatedUser: JSON.parse(sessionStorage.userProfile).userName,
                UpdatedBy: UpdatedBy
            };
        } else if (newlySelctedDatasetVar !== undefined &&
            (newlySelctedDatasetVar[0].CDISCDataStdVariableMetadataID !== oldOrder.Children[0].Id ||
                newlySelctedDatasetVar.length !== oldOrder.Children.length)) {
            values =
            {
                StudyID: StudyID,
                ProjectID: ProjectID,
                MappingOperationList: newlySelctedDatasetVar,
                TargetDataSet: datasetName,
                CDISCDataStdDomainMetadataID: selectedDomain,
                UpdatedUser: JSON.parse(sessionStorage.userProfile).userName,
                UpdatedBy: UpdatedBy,
                UnsavedOrder: 1

            };
        }

        showProgress();
        //Generate Macro Call program for selected Dataset
        CallServerPost('MappingOperations/GenerateMacrocallProgramForDataset', values)
            .then(
                function (response) {
                    if (response.status == 1) {
                        hideProgress();
                        thisObj.setState({ mappingProgram: response.value, datasetName: datasetName });



                    } else {
                        errorModal(response.message);
                    }
                });
    }

    generatepythonProgramForDomain = (selectedDomain, datasetName, newlySelctedDatasetVar, oldOrder) => {
        const thisObj = this;
        let { TargetObj, domain, TargetVars } = this.props;
        //show progress
        showProgress();
        let StudyID = JSON.parse(sessionStorage.getItem("studyDetails")).studyID;
        let ProjectID = JSON.parse(sessionStorage.getItem("studyDetails")).projectID;
        var selctedDatasetVar = TargetVars.find(x => x.Id === datasetName);

        let targetvariable = (selctedDatasetVar && typeof selctedDatasetVar === "object") ?
            selctedDatasetVar.Children.map((target, i) => {
                let data = validJSON(target.data);
                if ('Order' in data) {
                    data.Order = i + 1;
                }
                return data;
            }) : [];
        //saved order

        var values;
        if (newlySelctedDatasetVar === undefined ||
            (newlySelctedDatasetVar[0].CDISCDataStdVariableMetadataID === oldOrder.Children[0].Id &&
                newlySelctedDatasetVar.length === oldOrder.Children.length)) {
            values =
            {
                StudyID: StudyID,
                ProjectID: ProjectID,
                execution: targetvariable,
                MappingOperationList: targetvariable,
                TargetDataSet: datasetName,
                CDISCDataStdDomainMetadataID: selectedDomain,
                UpdatedUser: JSON.parse(sessionStorage.userProfile).userName

            };
        } else if (newlySelctedDatasetVar !== undefined &&
            (newlySelctedDatasetVar[0].CDISCDataStdVariableMetadataID !== oldOrder.Children[0].Id ||
                newlySelctedDatasetVar.length !== oldOrder.Children.length)) {
            values =
            {
                StudyID: StudyID,
                ProjectID: ProjectID,
                MappingOperationList: newlySelctedDatasetVar,
                TargetDataSet: datasetName,
                CDISCDataStdDomainMetadataID: selectedDomain,
                UpdatedUser: JSON.parse(sessionStorage.userProfile).userName,
                UnsavedOrder: 1

            };
        }
        //var finalVal = v
        //Generate Macro Call program for selected Dataset
        CallServerPost('MappingOperations/GeneratePyProgramForDataset', values)
            .then(
                function (response) {
                    hideProgress();
                    if (response.status == 1) {
                        thisObj.setState({
                            mappingProgram: empty,
                            pythonProgram: response.value,
                            datasetName: datasetName
                        });
                    } else {
                        errorModal(response.message);
                    }
                });
    }

    executeSAS = (isInterMediate = false) => {
        const thisObj = this;
        showProgress();
        let { datasetName, domain } = thisObj.props;

        const StudyID = JSON.parse(sessionStorage.getItem("studyDetails")).studyID;
        CallServerPost("Py/ExecSas",
            {
                'program': this.state.mappingProgram,
                'username': JSON.parse(sessionStorage.userProfile).userName,
                StudyID: StudyID,
                isInterMediate: isInterMediate
            }).then((response) => {
                hideProgress();

                const res = response.value;
                if (res && response.status !== 0 && 'LOG' in res && "LST" in res) {
                    if (res["LOG"].toLowerCase().includes("error")) {
                        Modal.error({
                            title: 'Error',
                            content: datasetName + ' XPT Generation Failed',
                        });
                    }
                    else {
                        XPTSuccessModal({
                            title: 'Generate XPT',
                            msg: datasetName + ' XPT Generated Successfully',
                            onOk: () => {
                                thisObj.fnToViewDataset()
                            }
                        });


                    }
                    thisObj.setState({ log: res["LOG"], lstHTML: res["LST"] });

                } else {
                    Modal.error({
                        title: 'Error',
                        content: datasetName + ' XPT Generated Failed',
                    });

                }
            });
    }

    downloadMappingProgram = () => {
        var thisObj = this;
        let content = thisObj.state.mappingProgram.replace(/%/g, '\n%');
        let fileName = thisObj.props.datasetName;
        // DownloadasText(content, fileName);
        DownloadasSas(content, fileName);
    }
    executeXPT = (isInterMediate = false) => {
        const thisObj = this;
        showProgress();
        let { datasetName, domain } = thisObj.props;

        CallServerPost("Py/ExecFinal",
            {
                'program': this.state.pythonProgram,
                'username': JSON.parse(sessionStorage.userProfile).userName,
                StudyID: JSON.parse(sessionStorage.getItem("studyDetails")).studyID,
                isInterMediate: isInterMediate
            }).then((response) => {
                hideProgress();


                const res = response.value;

                if (response.status !== 0 && 'LOG' in res && "LST" in res) {
                    if (res["LOG"].toLowerCase().includes("error")) {
                        Modal.error({
                            title: 'Error',
                            content: datasetName + ' XPT Generated Failed',
                        });

                    }
                    else {
                        XPTSuccessModal({
                            title: 'Generate XPT',
                            msg: datasetName + ' XPT Generated Successfully',
                            onOk: () => {
                                thisObj.fnToViewDataset()
                            }
                        });
                    }
                    thisObj.setState({ log: res["LOG"] });

                } else {

                    Modal.error({
                        title: 'Error',
                        content: datasetName + ' XPT Generated Failed',
                    });
                }


            }).catch(function (error) {
                //console.log(error);
                thisObj.setState({ loading: false });
                Modal.error({
                    title: 'Error',
                    content: 'XPT Generation Failed',
                });
            });;
    }
    //fnToViewDataset
    fnToViewDataset = () => {
        let { view_dataset } = this.state;
        let { datasetName, domain } = this.props;

        //Remove duplicate in view_dataset then append to view_dataset

        let index = view_dataset.findIndex(ds => ds.name === datasetName);
        index != -1 && view_dataset.splice(index, 1);
        let study = JSON.parse(sessionStorage.getItem("studyDetails"));
        //Progress
        showProgress();
        CallServerPost('MappingOperations/GetTargetDataset',
            {
                StudyID: study.studyID,
                StudyName: study.studyName,
                TableName: thisObj.state.datasetName
            })
            .then(
                function (response) {
                    hideProgress();
                    let res = response;
                    if (res.status === 1) {
                        try {
                            //let row = JSON.parse(res.value.dataset);
                            let row = res.value;
                            if (Object.keys(row).length > 0) {
                                let col = Object.keys(row[0]).map(clname => clname.toUpperCase());
                                thisObj.setState({
                                    view_dataset:
                                        [
                                            {
                                                name: datasetName,
                                                col: col,
                                                row: row,
                                                key: 4
                                            },
                                            ...view_dataset
                                        ],
                                    activeKey: "4"
                                });
                            } else {
                                Modal.error({
                                    title: 'Error',
                                    content: "No data",
                                });
                            }

                        } catch (e) {
                            //console.log(e);
                            Modal.error({
                                title: 'Error',
                                content: "No data",
                            });
                        }

                    } else {
                        Modal.error({
                            title: 'Error',
                            content: res.message,
                        });
                    }
                })

    }
    executeXPTOld = () => {
        const thisObj = this;
        const payload = { 'program': this.state.pythonProgram };
        const url = 'http://172.16.1.246:6555/exec/';
        //const url = 'http://localhost:6555/exec/';
        //  const inst = axios.create({ headers: { "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS" } });
        this.setState({ loading: true });
        return axios.post(url, payload)
            .then(function (response) {
                const res = response.data;
                //console.log(res);
                thisObj.setState({ loading: false });
                Modal.success({
                    content: 'XPT Generated Successfully',
                });
            })
            .catch(function (error) {
                //console.log(error);
                thisObj.setState({ loading: false });
                Modal.error({
                    title: 'Error',
                    content: 'XPT Generation Failed',
                });
            });

    }

    //
    refresh = (resolve = null, reject = null) => {
        const { programType } = this.state;

        if (programType == 2) {
            thisObj.generateMacroCallProgramForDomain(thisObj.props.selectedDomain, thisObj.state.datasetName);
        } else {
            thisObj.generatepythonProgramForDomain(thisObj.props.selectedDomain, thisObj.state.datasetName);

        }


        thisObj.props.refresh(resolve, reject);
    }
    DownloadSpec = () => {
        const postObj = {
            StudyID: JSON.parse(sessionStorage.getItem("studyDetails")).studyID,
            CDISCDataStdDomainMetadataID: this.props.selectedDomain,
        }
        let fileName = this.props.datasetName + "_Spec.xlsx";
        DownloadFileWithPostData("MappingOperations/GenerateMappingSpec", fileName, postObj, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    }

    viewPythonTab = (slectedTargetObj, oldOrder) => {
        let { programType } = thisObj.state;
        if (programType === 1) {
            thisObj.generatepythonProgramForDomain(thisObj.props.selectedDomain, thisObj.state.datasetName, slectedTargetObj, oldOrder);
            this.setState({ activeKey: "2" });
        } else {
            thisObj.generateMacroCallProgramForDomain(thisObj.props.selectedDomain, thisObj.state.datasetName, slectedTargetObj, oldOrder);
            this.setState({ activeKey: "3" });
        }

    }
    //onTabsEdit
    //For 1.0.1 View dataset task
    onTabsEdit = (targetKey, action) => {
        if (action === "remove") {
            let { view_dataset } = this.state;

            /*Actually we have 3 tabs(Block,Python,Log).
            and we generate dynamic tabs for view dataset .So that view dataset will start from 4,5,6... 
            when we remove specific view dataset tab means we have to minus 4 */
            let removeKey = targetKey - 4;
            view_dataset.splice(removeKey, 1);

            this.setState({
                view_dataset: view_dataset,
                activeKey: "1"
            });
        }
    }
    //show footer button for program page
    showFooter = (key) => {

        this.setState({ sasfooter: key === "work_result_macro" })
    }
    getHeight = () => {
        let { activeKey } = this.state;
        let { contentTabVisible } = this.props;
        switch (activeKey) {
            case "1":
                return contentTabVisible ? "calc(100vh - 120px)" : "calc(100vh - 87px)";
            case "3":
                return contentTabVisible ? "calc(100vh - 130px)" : "calc(100vh - 97px)";

        }
    }
    getHeightForSasDiv = () => {
        let { sasfooter } = this.state;
        let { contentTabVisible } = this.props;

        switch (sasfooter) {
            case true:
                return contentTabVisible ? "calc(100vh - 255px)" : "calc(100vh - 215px)";
            case false:
                return contentTabVisible ? "calc(100vh - 202px)" : "calc(100vh - 156px)";

        }
    }
    render() {
        const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
        const { activeKey, view_dataset, mappingProgram, pythonProgram, loading, lstHTML, log, programType, sasfooter } = this.state;
        const { mappingBlocks, TargetVars, datasetName, contentTabVisible, AllTargetVariables, activityWrkflowStatus } = this.props;

        /*const execbtntext = mappingProgram === empty ? "Generate Program for " + this.props.datasetName : "Execute " + this.props.datasetName;*/


        const macro = (<div className={"op_pydivs"} >

            <Row className="op_pyrow sas_opgen" style={{
                height: this.getHeightForSasDiv()
            }}>
                {mappingProgram !== "" &&
                    <BlockWorkResult programType={programType} log={log} lstHTML={lstHTML} showFooter={this.showFooter} sasmacro={mappingProgram} actions={true} />
                }
            </Row>
            <Row className="ouputgeneration_footerbtn" style={{ display: sasfooter ? "block" : "none" }} >
                <Button disabled={mappingProgram === empty} type="primary" onClick={this.downloadMappingProgram}>{"Program"} <i className="fas fa-download outputgen_icon" /></Button>

                <Button style={{ float: "right", marginLeft: 5 }} className={"saveBtn"} disabled={mappingProgram === empty || !mappingPermission(activityWrkflowStatus)} onClick={() => this.executeSAS(false)}>{"Run"} <i className="fas fa-play outputgen_icon" /></Button>
                <Button style={{ float: "right", marginLeft: 5 }} className={"saveBtn"} disabled={mappingProgram === empty || !mappingPermission(activityWrkflowStatus)} onClick={() => this.executeSAS(true)}>{"Run with intermediate"} <i className="fas fa-play outputgen_icon" /></Button>
                <Button style={{ float: "right", marginLeft: 5 }} className="outputgen_button op_view" disabled={pythonProgram === ""} onClick={this.fnToViewDataset}>{"View Dataset"} <i className="fas fa-file-alt outputgen_icon" /></Button>
            </Row>
        </div>);

        const downloadBtn = <React.Fragment>
            <Button type="primary" onClick={this.DownloadSpec}>{`${this.props.datasetName} Mapping Spec `}<i className="fas fa-download outputgen_icon" /></Button>
            <Tooltip placement="leftTop" title={contentTabVisible ? "Hide Study Details" : "Show Study Details"}>
                <Button className="sideToggleBtn" style={{ marginLeft: 5 }} onClick={() => this.props.changeContentTab()}>
                    <i className={contentTabVisible ? " fas fa-chevron-circle-up" : "fas fa-chevron-circle-down"} />
                </Button>
            </Tooltip>
        </React.Fragment>

        const python = (<div className="op_pydivs" style={{ height: contentTabVisible ? "calc(100vh - 239px)" : "calc(100vh - 193px)" }}>

            <Row className="op_pyrow" >
                {pythonProgram !== "" &&
                    <CodeMirror
                        value={pythonProgram}
                        options={{
                            lineNumbers: true,
                            readOnly: true,
                            mode: "python",
                            theme: "rubyblue"
                        }}
                        className={"customCodeMirror"}
                    />
                }
            </Row>
            <Row className="ouputgeneration_footerbtn">
                <Button style={{ float: "right" }} className={"saveBtn"} disabled={pythonProgram === "" || !mappingPermission(activityWrkflowStatus)} type="primary" onClick={() => this.executeXPT(false)}>{"Run"}<i className="fas fa-play outputgen_icon" /></Button>
                <Button style={{ float: "right", marginRight: 5 }} className={"saveBtn"} disabled={pythonProgram === "" || !mappingPermission(activityWrkflowStatus)} type="primary" onClick={() => this.executeXPT(true)}>{"Run with intermediate"}<i className="fas fa-play outputgen_icon" /></Button>
                <Button style={{ float: "right", marginRight: 5 }} disabled={pythonProgram === ""} className="outputgen_button op_view" onClick={this.fnToViewDataset}>{"View Dataset"}<i className="fas fa-file-alt outputgen_icon" /></Button>

            </Row>
        </div>);

        let getHeight = this.getHeight();
        return (
            <>
                <Row style={{
                    width: '100%', padding: "0px 5px",
                    height: getHeight
                }} >

                    <Tabs
                        hideAdd
                        className="op_tabs"
                        closable={true}
                        type="editable-card"
                        onEdit={this.onTabsEdit}
                        style={{ width: '100%' }}
                        onChange={this.onTabChange}
                        activeKey={this.state.activeKey}
                        tabBarExtraContent={downloadBtn}
                    >
                        <TabPane
                            tab="Block"
                            key="1"
                            className="op_tabpane"

                            closable={false}
                        >
                            {
                                <ProgramWorkSpace
                                    activityWrkflowStatus={activityWrkflowStatus}
                                    domain={datasetName}
                                    TargetObj={TargetVars}
                                    refresh={this.refresh}
                                    mappingBlocks={mappingBlocks}
                                    AllTargetVariables={AllTargetVariables}
                                    viewPythonTab={(slectedTargetObj, oldOrder) => this.viewPythonTab(slectedTargetObj, oldOrder)}
                                />
                            }
                        </TabPane>
                        {
                            programType == 1 ?

                                <TabPane
                                    tab="Python"
                                    key="2"
                                    className="op_tabpane"
                                    closable={false}
                                >
                                    {python}
                                </TabPane>


                                : ""
                        }
                        {
                            programType == 1 ?

                                <TabPane
                                    tab="Log"
                                    key="3"
                                    className="op_tabpane"
                                    closable={false}
                                >
                                    <div style={{ height: contentTabVisible ? "calc(100vh - 255px)" : "calc(100vh - 215px)" }}>
                                        <CodeMirror
                                            value={this.state.log}
                                            options={{
                                                lineNumbers: true,
                                                readOnly: true,
                                                mode: "python",
                                                theme: "rubyblue"
                                            }}
                                            className={"customCodeMirror"}
                                        />

                                    </div>
                                </TabPane>


                                : ""
                        }


                        {
                            programType == 2 &&
                            <TabPane
                                tab="Execute"
                                key="3"
                                className="op_tabpane"

                                closable={false}

                            >
                                {macro}
                            </TabPane>
                        }
                        {
                            view_dataset.map((ds, index) => {
                                return <TabPane closable={true} tab={ds.name} key={4 + index} >
                                    <div>{"Observation Count : " + ds.row.length}</div>
                                    <div style={{ height: '100%' }}>
                                        <HotTable
                                            width="100%"
                                            height={contentTabVisible ? "calc(100vh - 234px)" : "calc(100vh - 197px)"}
                                            key={ds.name + "_hottable"}
                                            data={ds.row}
                                            licenseKey="non-commercial-and-evaluation"
                                            settings={
                                                {
                                                    stretchH: 'all',
                                                    width: "100%",
                                                    colHeaders: ds.col,
                                                    rowHeaders: true,
                                                    readOnly: true,
                                                    filters: true,
                                                    editor: false,
                                                    dropdownMenu: ['filter_by_condition', 'filter_by_value', 'filter_action_bar'],
                                                }
                                            }
                                        />

                                    </div>
                                </TabPane>
                            })
                        }
                    </Tabs>

                </Row>

            </>
        );
    }
}

export default ProgramEditorDS;

