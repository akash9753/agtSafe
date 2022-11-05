////import React, { Component } from "react";
////import ContentTab from "../TreeView/contentTab";
////import {
////    Row,
////    Modal,
////    Form,
////    Button,
////    Spin,
////    Icon,
////    Tabs
////} from "antd";
////import Blockly from 'blockly/core';
////import BlocklyComponent, { Block, Field, Category } from './Blockly';
////import { MappingDatas } from '../TreeView/getMappingDatas';
////import { CREATE, UPDATE, PostCallWithZone, successModalCallback, errorModal, showProgress, hideProgress, CallServerPost } from '../Utility/sharedUtility';
////import ConfirmModal from '../Utility/ConfirmModal';
////import SASViewer from './sasViewer';
////import MonacoEditor from '@uiw/react-monacoeditor';
////import { HotTable, HotColumn } from '@handsontable/react';
////import "handsontable/dist/handsontable.min.css";

////const { TabPane } = Tabs;


////let thisObj = "";
////let SelectedCategory = {};
////const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

////class MapperModal extends Component {
////    constructor(props) {
////        super(props);
////        this.state = {
////            MappingTitle: this.MappingTitle(),
////            SOURCE: this.sourceBlocks(props),
////            TARGET: this.targetBlocks(props),
////            selected_sourceDS: "",
////            selected_targetDS: "",
////            SOURCEVARIABLE: [],
////            TARGETVARIABLE: [],
////            xml: props.action === CREATE ? '' : props.MappingConstruct.constructJson,
////            showConfirmation: false,
////            blockInit: false,
////            minSize: "100%",
////            hasResult: true,
////            log: "",
////            resultSet: [],
////            loading: false,
////            lstHTML: "",
////            sasmacro: "",
////            activeKey: "1",
////            dsName:""
////        };
////        thisObj = this;
////        this.FetchBlocks();
////    }



////    componentDidUpdate() {
////        let workspace = Blockly.getMainWorkspace();

////        if (workspace.toolbox_.flyout_.isVisible_) {
////            let getCategory = workspace.toolbox_.tree_.children_[SelectedCategory.Category];
////            if (getCategory) {
////                getCategory.select();
////            }

////        } else {
////            SelectedCategory = { Category: -1 };

////        }


////    }
////    hideToolBox = () => {
////        var workspace = Blockly.getMainWorkspace();
////        // For now the trashcan flyout always autocloses because it overlays the
////        // trashcan UI (no trashcan to click to close it).

////        if (workspace.trashcan &&
////            workspace.trashcan.flyout) {
////            workspace.trashcan.flyout.hide();
////        }
////        var toolbox = workspace.getToolbox();
////        if (toolbox &&
////            toolbox.getFlyout() &&
////            toolbox.getFlyout().autoClose) {
////            toolbox.clearSelection();
////        }
////    }

////    //Blocks Initialization
////    FetchBlocks = () => {
////        showProgress();
////        CallServerPost("MappingBlock/GetAllMappingBlock", {}).then((response) => {
////            const responseData = response;

////            if (responseData.status == 1) {
////                responseData.value.map((mappingBlock, index) => {
////                    // //console.log(mappingBlock);
////                    var blockObj = {};
////                    blockObj["type"] = mappingBlock["type"];
////                    blockObj["message0"] = mappingBlock["message"];
////                    blockObj["args0"] = JSON.parse(mappingBlock["args"]);
////                    blockObj["colour"] = mappingBlock["color"];
////                    blockObj["tooltip"] = mappingBlock["tooltip"];

////                    if (mappingBlock["previousStatement"]) {
////                        blockObj["previousStatement"] = null;
////                    }
////                    if (mappingBlock["nextStatement"]) {
////                        blockObj["nextStatement"] = null;
////                    }
////                    if (mappingBlock["output"]) {
////                        blockObj["output"] = null;
////                    }
////                    if (mappingBlock["inputsInline"]) {
////                        blockObj["inputsInline"] = true;
////                    }



////                    Blockly.Blocks[mappingBlock.type] = {
////                        init: function () {
////                            this.jsonInit(blockObj);
////                        }
////                    };
////                });
////                thisObj.setState({ blockInit: true });
////                hideProgress();
////            } else {
////                hideProgress();
////            }

////        })
////    }
////    //Header Actions
////    MappingTitle = () => {
////        const { TargetDomain, TargetVariable } = this.props.selectedTargetObj;

////        return <div>
////            <span className="selectedOperations">
////                <strong>
////                    <span>Mapping:</span>{" "}
////                    <span style={{ color: "#1890ff" }}>
////                        {TargetDomain + "." + TargetVariable}
////                    </span>
////                </strong>
////            </span>
////            <ContentTab showToggleIcon={false} />
////        </div>
////    }

////    //Source Block
////    sourceBlocks = props => {
////        let { SourceDataset } = props.allValues;
////        return SourceDataset.Domain.map(source => {
////            let dataSource = { ...source, blockType: "Source" };

////            return (<React.Fragment key={source.TABLE_NAME + "_key"}>
////                <Block editable={false} type="dataset_type_multi_source" >
////                    <Field name="ds_name">
////                        {source.TABLE_NAME}
////                    </Field>
////                    <data>{JSON.stringify(dataSource)}</data>
////                </Block>
////                <Block editable={false} type="dataset_type_single_source" >
////                    <Field name="ds_name">
////                        {source.TABLE_NAME}
////                    </Field>
////                    <data>{JSON.stringify(dataSource)}</data>
////                </Block>
////            </React.Fragment>);
////        })
////    };

////    //Target Block
////    targetBlocks = props => {
////        let { Standards } = props.allValues;
////        let { Domain } = Standards;
////        let MappingList = MappingDatas.MappingList;
////        return MappingList.map((data, index) => {
////            if (MappingList.findIndex(e => e.cdiscDataStdDomainMetadataID == data.cdiscDataStdDomainMetadataID) === index) {
////                let Target = Domain.find(x => x.cdiscDataStdDomainMetadataID === data.cdiscDataStdDomainMetadataID);
////                if (Target !== null && typeof Target === "object") {
////                    let dataTarget = { ...Target, blockType: "Target" };
////                    return (<React.Fragment key={Target.domain + "_key"}>
////                        <Block editable={false} type="dataset_type_multi_target" >
////                            <Field name="ds_name">
////                                {Target.domain}
////                            </Field>
////                            <data>{JSON.stringify(dataTarget)}</data>
////                        </Block>
////                        <Block editable={false} type="dataset_type_single_target" >
////                            <Field name="ds_name">
////                                {Target.domain}
////                            </Field>
////                            <data>{JSON.stringify(dataTarget)}</data>
////                        </Block>
////                    </React.Fragment>);
////                }
////            }
////        })
////    };

////    // Variable Block for Source
////    SourceVariableBlocks = obj => {
////        let { SourceDataset } = thisObj.props.allValues;

////        let VariableList = SourceDataset.Variable.filter(
////            va => va.TABLE_NAME === obj.TABLE_NAME
////        );

////        SelectedCategory = { Category: 1 };

////        let varBlock = VariableList.map(data => {
////            return (<React.Fragment>
////                <Block editable={false} type="variable_type_source_multi" >
////                    <Field name="var_name">
////                        {obj.TABLE_NAME}.{data.COLUMN_NAME}
////                    </Field>
////                    <data>{JSON.stringify(data)}</data>
////                </Block>
////                <Block editable={false} type="variable_type_source_single" >
////                    <Field name="var_name">
////                        {obj.TABLE_NAME}.{data.COLUMN_NAME}
////                    </Field>
////                    <data>{JSON.stringify(data)}</data>
////                </Block>
////            </React.Fragment>);
////        });

////        thisObj.setState({ SOURCEVARIABLE: varBlock, selected_sourceDS: obj.TABLE_NAME });
////    };

////    //Variable Block for Target
////    TargetVariableBlocks = obj => {
////        let { Standards } = thisObj.props.allValues;

////        //For HighLight node
////        SelectedCategory = { Category: 2 };

////        let variablesList = Standards.Variable.filter(
////            variable =>
////                variable.cdiscDataStdDomainMetadataID ===
////                obj.cdiscDataStdDomainMetadataID
////        );

////        let varBlock = variablesList.map(function (variable) {


////            let mappingConstruct = MappingDatas.MappingList.filter(
////                mapper =>
////                    mapper.cdiscDataStdVariableMetadataID ===
////                    variable.cdiscDataStdVariableMetadataID
////            );


////            if (typeof mappingConstruct === 'object' && mappingConstruct && mappingConstruct.length > 0) {
////                return (<React.Fragment>
////                    <Block editable={false} type="variable_type_target_multi" >
////                        <Field name="var_name">
////                            {obj.domain}.{variable.variableName}
////                        </Field>
////                        <data>{JSON.stringify(variable)}</data>
////                    </Block>
////                    <Block editable={false} type="variable_type_target_single" >
////                        <Field name="var_name">
////                            {obj.domain}.{variable.variableName}
////                        </Field>
////                        <data>{JSON.stringify(variable)}</data>
////                    </Block>
////                </React.Fragment>);
////            }
////        });

////        thisObj.setState({ TARGETVARIABLE: varBlock, selected_targetDS: obj.domain });
////    };

////    //Remove Variable Blocks When Delete
////    RemoveVariables = (obj) => {
////        if (obj.blockType === "Source") {
////            thisObj.setState({ SOURCEVARIABLE: [] });

////        } else if (obj.blockType === "Target") {
////            thisObj.setState({ TARGETVARIABLE: [] });

////        }
////    }

////    //Cancel
////    hideMapperModal = flag => {
////        if (flag === "Cancel") {
////            this.props.hideMapperModal();
////        }
////    };

////    // Save Process
////    //For Save Rules
////    saveRule = (ChangeReason = "Created") => {

////        let { props } = this;
////        let { sourceObj, selectedTargetObj, MappingConstruct, action } = props;
////        const { TargetDomainID, TargetVariableID } = selectedTargetObj;

////        //Create and Update 
////        let xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
////        if (xml) {

////            let XMLValue = new XMLSerializer().serializeToString(xml);

////            let values = {
////                ConstructJson: XMLValue,
////                ConstructString: "",
////                MappingXML: "",
////                StudyID: JSON.parse(
////                    sessionStorage.getItem("studyDetails")
////                ).studyID,
////                CDISCDataStdDomainMetadataID: action === UPDATE ? MappingConstruct.cdiscDataStdDomainMetadataID : TargetDomainID,
////                CDISCDataStdVariableMetadataID: action === UPDATE ? MappingConstruct.cdiscDataStdVariableMetadataID : TargetVariableID,
////                SourceDataset: sourceObj.Domain.TABLE_NAME,
////                SourceVariableName: sourceObj.Variable.COLUMN_NAME,
////                ChangeReason: ChangeReason,
////                UpdatedDateTimeText: action === UPDATE ? MappingConstruct.updatedDateTimeText : ""

////            }
////            if (action == UPDATE) {
////                values.MappingConstructID = MappingConstruct.mappingConstructID;
////            }
////            let urlAction = this.props.action === CREATE ? "CreateMappingOperations" : "UpdateMappingOperations";
////            //Loader
////            showProgress();
////            PostCallWithZone("MappingOperations/" + urlAction, values).then((response) => {
////                const responseData = response;
////                if (responseData.status == 1) {
////                    thisObj.setState({ showConfirmation: false });
////                    successModalCallback(response.message, thisObj.props.hideMapperModal);
////                } else {
////                    errorModal(response.message);
////                }
////                hideProgress();
////            })
////        }
////    }
////    //UpdateWithConfirmation
////    UpdateWithConfirmation = () => {
////        thisObj.setState({ showConfirmation: true });
////    }

////    //Change Reason Cancel
////    handleChangeReasonCancel = () => {
////        thisObj.setState({ showConfirmation: false });
////    }

////    handleSASResult = (response) => {
////        this.setState({ log: response["LOG"], lstHTML: response["LST"], resultSet: JSON.parse(response["dataset"]) });
////    }

////    setProgress = (show) => {
////        this.setState({ loading: show });
////    }

   

////    getSASMacro = () => {
////        let { props } = this;
////        let { sourceObj, selectedTargetObj, MappingConstruct, action } = props;
////        let xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
////        const { TargetDomainID, TargetVariableID } = selectedTargetObj;
////        if (xml) {
////            let XMLValue = new XMLSerializer().serializeToString(xml);

////            let values = {
////                ConstructJson: XMLValue,
////                ConstructString: "",
////                MappingXML: "",
////                StudyID: JSON.parse(
////                    sessionStorage.getItem("studyDetails")
////                ).studyID,
////                CDISCDataStdDomainMetadataID: action === UPDATE ? MappingConstruct.cdiscDataStdDomainMetadataID : TargetDomainID,
////                CDISCDataStdVariableMetadataID: action === UPDATE ? MappingConstruct.cdiscDataStdVariableMetadataID : TargetVariableID,
////                SourceDataset: sourceObj.Domain.TABLE_NAME,
////                SourceVariableName: sourceObj.Variable.COLUMN_NAME
////            }
////            showProgress();
////            CallServerPost("MappingOperations/GenMacro", values).then((response) => {
////                const responseData = response;
////                if (responseData.status == 1) {
////                    thisObj.setState({
////                        sasmacro: responseData.value.mappingProgram,
////                        activeKey: "2",
////                        dsName: `final_${responseData.value.domain}_${responseData.value.variableName}`
////                    });
////                } else {
////                    errorModal(response.message);
////                }
////                hideProgress();
////            })
////        }

////    }

////    render() {

////        const { dsName, sasmacro, activeKey, MappingTitle, SOURCE, TARGET, SOURCEVARIABLE, TARGETVARIABLE, selected_sourceDS, selected_targetDS, showConfirmation, xml, blockInit, minSize, log, resultSet, loading, lstHTML } = this.state;
////        const { action } = this.props;
////        const getColHeaders = () => {
////            let cols = [];
////            if (resultSet.length > 0) {
////                Object.keys(resultSet[0]).map(key => {
////                    cols.push(key);
////                });
////            }
////            return cols;
////        }
////        return (
////            <Modal
////                className="operationalModal"
////                visible={this.props.visible}
////                maskClosable={false}
////                style={{ top: 0 }}
////                width={"100%"}

////                title={MappingTitle}
////                onCancel={() => this.hideMapperModal("Cancel")}
////                footer={null}
////                ref="modal"
////            >
////                <Spin
////                    indicator={antIcon}
////                    spinning={loading}
////                >

////                    <div>
////                        <Tabs defaultActiveKey="1"
////                            onChange={(activekey_new) => {
////                                if (activekey_new === "2") {
////                                    thisObj.getSASMacro();
////                                } else {
////                                    thisObj.setState({ activeKey: activekey_new });
////                                }
////                            }}
////                            style={{}}
////                            type="card">
////                            <TabPane

////                                tab="Mapping Builder"
////                                key="1"
////                            >
////                                <div style={{ height: "calc(100vh - 185px)" }} >
////                                    {blockInit &&
////                                        <BlocklyComponent
////                                            style={{ height: "100%", width: "100%" }}
////                                            ref={e => this.simpleWorkspace = e}
////                                            readOnly={false}
////                                            move={{
////                                                scrollbars: true,
////                                                drag: true,
////                                                wheel: true
////                                            }}
////                                            RemoveVariables={this.RemoveVariables}
////                                            sourceVariableBlocks={this.SourceVariableBlocks}
////                                            targetVariableBlocks={this.TargetVariableBlocks}
////                                            manualClick={this.manualClick}
////                                            initialXml={xml}>

////                                            <Category name="Logic" colour="%{BKY_LOGIC_HUE}">
////                                                <Block type="simple_ops_mutiple_args_type" />
////                                                <Block type="simple_ops_single_arg_type" />
////                                                <Block type="complex_ops_multi" />

////                                                <Block type="eq_type" />
////                                                <Block type="eq_type_single" />
////                                                <Block type="filter_type" />
////                                                <Block type="if_else_type" />
////                                                <Block type="andor_type" />

////                                                <Block type="merge_type" />
////                                                <Block type="for_type" />
////                                                <Block type="map_type" />
////                                                <Block type="int_constant_type_multi" />
////                                                <Block type="int_constant_type_single" />
////                                                <Block type="constant_type_multi" />
////                                                <Block type="text" />
////                                                <Block type="select_type" />
////                                                <Block type="where_type" />
////                                                <Block type="group_type" />
////                                                <Block type="condition_type" />
////                                                <Block type="out_ds_type" />
////                                                <Block type="out_vr_type" />
////                                                <Block type="input_format_type" />
////                                                <Block type="output_format_type" />
////                                                <Block type="id_variable_type" />
////                                            </Category>
////                                            <Category name="Source DS" colour="20">
////                                                {SOURCE}
////                                            </Category>
////                                            <Category name="Target DS" colour="250">
////                                                {TARGET}
////                                            </Category>
////                                            {SOURCEVARIABLE.length > 0 &&
////                                                <Category name={selected_sourceDS} colour="65">
////                                                    {SOURCEVARIABLE}
////                                                </Category>}
////                                            {TARGETVARIABLE.length > 0 && <Category name={selected_targetDS} colour="300">
////                                                {TARGETVARIABLE}
////                                            </Category>
////                                            }
////                                        </BlocklyComponent>
////                                    }

////                                </div>
////                                <Row gutter={2} style={{ paddingTop: 10, paddingBottom: 10 }}>
////                                    <Button
////                                        type="danger"

////                                        onClick={() => this.hideMapperModal("Cancel")}
////                                    >
////                                        {"Cancel"}
////                                    </Button>
////                                    <Button
////                                        style={{ float: "right" }}
////                                        className="saveBtn"
////                                        onClick={() => {
////                                            action === CREATE ?
////                                                this.saveRule()
////                                                :
////                                                this.UpdateWithConfirmation()
////                                        }}
////                                    >
////                                        <i className="fas fa-save" style={{ paddingRight: 2 }}> {action === CREATE ? CREATE : UPDATE}</i>
////                                    </Button>
////                                </Row>
////                            </TabPane>
////                            <TabPane tab="SAS Program" key="2">
////                                <div style={{ height: "calc(100vh - 134px)" }} >
////                                    {activeKey === "2" && 
////                                        <SASViewer dsName={dsName} sasmacro={sasmacro} setProgress={this.setProgress} handleSASResult={this.handleSASResult} />
////                                    }
                                    
////                                </div>
////                            </TabPane>
////                            <TabPane tab="Logs" key="3">
////                                <div style={{ height: "calc(100vh - 134px)" }} >
////                                    <MonacoEditor
////                                        language="sas"
////                                        value={log}
////                                        options={{
////                                            readOnly: true,
////                                            theme: 'vs-dark',
////                                        }}
////                                    />
////                                </div>
////                            </TabPane>
////                            <TabPane tab="LST" key="4">
////                                <div style={{ height: "calc(100vh - 134px)", overflow: "auto" }} >
////                                    <div dangerouslySetInnerHTML={{ __html: lstHTML }} />
////                                </div>
////                            </TabPane>
////                            <TabPane tab="Result Dataset" key="5">
////                                <div style={{ height: "calc(100vh - 134px)" }} >
////                                    <HotTable
////                                        width="100%"
////                                        height="100%"
////                                        data={resultSet}
////                                        licenseKey="non-commercial-and-evaluation"
////                                        settings={
////                                            {
////                                                colHeaders: getColHeaders(),
////                                                rowHeaders: true,
////                                                readOnly: true,
////                                                dropdownMenu: true,
////                                                filters: true
////                                            }
////                                        }
////                                    />
////                                </div>
////                            </TabPane>
////                        </Tabs>
////                        <ConfirmModal loading={false} title="Update Mapping" SubmitButtonName="Update" onSubmit={this.saveRule} visible={showConfirmation} handleCancel={this.handleChangeReasonCancel} getFieldDecorator={this.props.form.getFieldDecorator} />
////                    </div>
////                </Spin>
////            </Modal>
////        );
////    }
////}

////const WrappedApp = Form.create()(MapperModal);

////export default WrappedApp;


