import React, { Component } from 'react';
import Tabs, { TabPane } from '../../components/uielements/tabs';
import ReactDomServer from 'react-dom/server';
import { Tooltip } from 'antd';
import Button from '../../components/uielements/button';
import { CallServerPost, PostCallWithZone, errorModal, successModalCallback, showProgress, hideProgress } from '../Utility/sharedUtility';
import CodeMirror from "../AdvancedUI/codeMirror/codeMirror.style";
import { DownloadasXml, DownloadasText } from '../Utility/exportFile';

let thisObj = {};
let selectedDomainID;
let selectedVariableID;
class ProgramEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mappingXml: '',
            mappingProgram: '',
            pythonProgram: '',
            mappingConstructID: 0,
            currentValue: {},
            disableSaveBtnForXml: true,
            disableSaveBtnForProgram: true,
            enableActionsForProgram: false,
            activeKey: "1",
            enableDownloadBtnForxml: false,
            enableDownloadBtnForProgram: false,
            updatedDateTimeForCurMapID: '',
            programType: JSON.parse(sessionStorage.studyDetails).versionID,
            contentTabOpen: true
        }
        selectedDomainID = this.props.selectedDomain;
        selectedVariableID = this.props.selectedVariable;
        this.getMappingOperationList();
        thisObj = this;
    }
    static getDerivedStateFromProps(nextProps, currentstate) {
        if (selectedDomainID !== nextProps.selectedDomain || selectedVariableID !== nextProps.selectedVariable) {
            selectedDomainID = nextProps.selectedDomain;
            selectedVariableID = nextProps.selectedVariable;
            return thisObj.getMappingOperationList();
        }
    }
    /*componentWillReceiveProps(nextProps) {
        if (selectedDomainID !== nextProps.selectedDomain || selectedVariableID !== nextProps.selectedVariable) {
            selectedDomainID = nextProps.selectedDomain;
            selectedVariableID = nextProps.selectedVariable;
            this.getMappingOperationList();
        }        
    }*/

    getMappingOperationList = () => {
        const thisObj = this;
        var values = {};
        values["StudyID"] = JSON.parse(sessionStorage.getItem("studyDetails")).studyID;
        values["CDISCDataStdDomainMetadataID"] = selectedDomainID;
        values["CDISCDataStdVariableMetadataID"] = selectedVariableID;
        //Getting all Mapping Operations from server
        showProgress();

        CallServerPost('MappingOperations/GetAllMappingOperationsByTargetVariable', values)
            .then(
                function (response) {
                    hideProgress();

                    if (response.value != null && response.value.length > 0) {
                        let mappingXml = '';
                        let mappingProgram = '';
                        let currentValue = {};
                        let enableActionsForProgram;
                        let enableDownloadBtnForxml;
                        let enableDownloadBtnForProgram;
                        //console.log(response.value);
                        for (var i = 0; i < response.value.length; i++) {
                            //'setting values for xml
                            if (response.value[i].mappingXML != undefined && response.value[i].mappingXML != null && response.value[i].mappingXML != "") {
                                mappingXml = response.value[i].mappingXML;
                                enableDownloadBtnForxml = true;
                            }
                            var pythonProgram = '';
                            if (response.value[i].pythonProgram != undefined && response.value[i].pythonProgram != null && response.value[i].pythonProgram != "") {
                                pythonProgram = response.value[i].pythonProgram;
                                //  enableDownloadBtnForxml = true;
                            }
                            //setting values for program
                            if (response.value[i].mappingProgram != undefined && response.value[i].mappingProgram != null && response.value[i].mappingProgram != "") {
                                mappingProgram = response.value[i].mappingProgram;
                                enableActionsForProgram = false;
                                enableDownloadBtnForProgram = true;
                            } else {
                                mappingProgram = response.value[i].mappingProgram;
                                enableActionsForProgram = true;
                                enableDownloadBtnForProgram = false;
                            }
                        }
                        thisObj.setState({
                            mappingXml, mappingProgram, pythonProgram, mappingConstructID: response.value[0].mappingConstructID, currentValue: response.value[0], disableSaveBtnForXml: true, disableSaveBtnForProgram: true, enableActionsForProgram, enableDownloadBtnForxml, enableDownloadBtnForProgram,
                            updatedDateTimeForCurMapID: response.value[0].updatedDateTimeText
                        });
                    }
                });
    }

    saveProgram = () => {
        const thisObj = this;
        var values = {};
        values["StudyID"] = JSON.parse(sessionStorage.getItem("studyDetails")).studyID;
        values["CDISCDataStdDomainMetadataID"] = thisObj.props.selectedDomain;
        values["CDISCDataStdVariableMetadataID"] = thisObj.props.selectedVariable;
        values["MappingConstructID"] = thisObj.state.mappingConstructID;
        values["MappingXML"] = thisObj.state.mappingXml;
        values["UpdatedDateTimeText"] = thisObj.state.updatedDateTimeForCurMapID;
        if (thisObj.state.activeKey == "2") {
            values["ChangeReason"] = "Created Mapping Program";
            values["MappingProgram"] = thisObj.state.mappingProgram
        }
        showProgress();

        //Update Mapping Operations 
        PostCallWithZone('MappingOperations/UpdateMappingOperations', values)
            .then(function (response) {
                hideProgress();

                if (response.status == 1) {
                    successModalCallback(response.message, thisObj.getMappingOperationList);
                } else {
                    errorModal(response.message);
                }
            });
    }
    downloadMappingXml = () => {
        var thisObj = this;
        let content = thisObj.state.mappingXml;
        let fileName = thisObj.state.currentValue.targetDataSet + '_' + thisObj.state.currentValue.targetVariableName;
        DownloadasXml(content, fileName);
    }
    downloadMappingProgram = () => {
        var thisObj = this;
        let content = thisObj.state.mappingProgram.replace(/%/g, '\n%');
        let fileName = thisObj.state.currentValue.targetDataSet + '_' + thisObj.state.currentValue.targetVariableName;
        DownloadasText(content, fileName);
    }

    generateMappingProgram = () => {
        var thisObj = this;
        var values = {};
        values["MappingXML"] = thisObj.state.mappingXml;
        values["SourceDataset"] = thisObj.state.currentValue.sourceDataset;
        values["TargetDataset"] = thisObj.state.currentValue.targetDataSet;
        values["TargetVariableName"] = thisObj.state.currentValue.targetVariableName;
        showProgress();

        CallServerPost('MappingOperations/GenerateMacrocallProgram', values)
            .then(function (response) {
                hideProgress();

                if (response.status == 1) {
                    thisObj.setState({ mappingProgram: response.value, disableSaveBtnForProgram: false });
                }
            });
    }
    generatePythonProgram = () => {
        var thisObj = this;
        var values = {};
        values["MappingXML"] = thisObj.state.mappingXml;
        values["SourceDataset"] = thisObj.state.currentValue.sourceDataset;
        values["TargetDataset"] = thisObj.state.currentValue.targetDataSet;
        values["TargetVariableName"] = thisObj.state.currentValue.targetVariableName;
        showProgress();
        CallServerPost('MappingOperations/GeneratePythonProgram', values)
            .then(function (response) {
                hideProgress();
                if (response.status == 1) {
                    thisObj.setState({ pythonProgram: response.value, disableSaveBtnForProgram: false });
                }
            });
    }

    onTabChange = (activeKey) => {
        this.setState({ activeKey: activeKey });
    };

    getContent = () => {
        let btnName;
        let content = "";
        let mode;
        if (this.state.activeKey == "1") {
            btnName = "Generate Xml";
            mode = "xml";
            content = this.state.mappingXml;
        } else if (this.state.activeKey == "2") {
            btnName = "Generate Program";
            mode = "javascript";
            content = (this.state.mappingProgram != null ? this.state.mappingProgram : "");
        } else if (this.state.activeKey == "3") {
            btnName = "Generate Program";
            mode = "javascript";
            content = (this.state.pythonProgram != null ? this.state.pythonProgram : "");
        }
        return (
            <div style={{ height: 'calc(100vh - 189px)', display: "flex", flexDirection: "column" }}>

                {
                    this.state.activeKey === "1" && this.state.enableDownloadBtnForxml &&
                    <div style={{ textAlign: 'right' }}>
                        <Button style={{ marginBottom: '1%', borderRadius: 3 }} type="primary" onClick={this.downloadMappingXml}>Download Xml</Button>
                    </div>
                }
                {this.state.activeKey === "2" && this.state.enableActionsForProgram &&
                    <div style={{ textAlign: 'right' }}>
                        <Button style={{ marginBottom: '1%', borderRadius: 3, marginRight: 20 }} type="primary" disabled={this.props.projectStudyLockStatus} onClick={this.generateMappingProgram}>{btnName}</Button>
                        <Button style={{ marginBottom: '1%', borderRadius: 3, marginLeft: 20 }} type="primary" disabled={this.state.disableSaveBtnForProgram} onClick={this.saveProgram}>Save</Button>
                    </div>
                }

                {this.state.activeKey === "3" && this.state.enableActionsForProgram &&
                    <div style={{ textAlign: 'right' }}>
                        <Button style={{ marginBottom: '1%', borderRadius: 3, marginRight: 20 }} type="primary" disabled={this.props.projectStudyLockStatus} onClick={this.generatePythonProgram}>{btnName}</Button>
                        <Button style={{ marginBottom: '1%', borderRadius: 3, marginLeft: 20 }} type="primary" disabled={this.state.disableSaveBtnForProgram} onClick={this.saveProgram}>Save</Button>

                    </div>
                }

                {
                    btnName == "Generate MacroCall" && this.state.enableDownloadBtnForProgram &&
                    <div style={{ textAlign: 'right' }}>
                        <Button style={{ marginBottom: '1%', borderRadius: 3 }} type="primary" onClick={this.downloadMappingProgram}>Download MacroCall</Button>
                    </div>
                }
                {content !== "" &&
                    <CodeMirror
                        value={content}
                        options={{
                            lineNumbers: true,
                            readOnly: true,
                            mode: mode,
                            autoRefresh: { force: true },
                            theme: "rubyblue"
                        }}
                        onChange={(editor, data, value) => {
                            editor.options.value = value;
                        }}
                        className="parentFulHeight"

                    />
                }
            </div>
        );
    }

    render() {
        const { programType } = this.state;
        const { contentTabVisible } = this.props;

        let contentHideShowBtn = <Tooltip placement="leftTop" title={contentTabVisible ? "Hide Study Details" : "Show Study Details"}> <Button style={{ marginRight: 10 }} className="sideToggleBtn" onClick={() => this.props.changeContentTab()}>
            <i className={contentTabVisible ? " fas fa-chevron-circle-up" : "fas fa-chevron-circle-down"} />
        </Button></Tooltip>;



        return (
            <Tabs
                activeKey={this.state.activeKey}
                onChange={this.onTabChange}
                type="card" style={{ width: '100%' }}
                tabBarExtraContent={contentHideShowBtn}
            >
                <TabPane tab="Xml" key="1">
                    {this.getContent()}
                </TabPane>
                {
                    programType == 2 &&
                    <TabPane tab="Program" key="2">
                        {this.getContent()}
                    </TabPane>
                }
                {
                    programType == 1 &&
                    <TabPane tab="Program" key="3">
                        {this.getContent()}
                    </TabPane>
                }
            </Tabs>
        );
    }

}

export default ProgramEditor;

