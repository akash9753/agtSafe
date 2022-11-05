////import React from 'react';
////import { Form, Row, Col, Icon, Input, Select, TreeSelect, Checkbox, Button, Divider  } from 'antd';
////import { rowStyle } from '../../styles/JsStyles/CommonStyles';
////import { getRules } from '../Utility/htmlUtility';

////const FormItem = Form.Item;
////const splitClass = 12;
////const Option = Select.Option;
////const TreeNode = TreeSelect.TreeNode;

////const standardNameOptions = [
////    { label: 'SDTM', value: 'SDTM-IG' },
////    { label: 'ADAM', value: 'ADAM' }
////];

////export const Step1Fields = {
////    ProjectID: 'ProjectID',
////    ProtocolName: 'ProtocolName',
////    SponsorName: 'SponsorName',
////    ProtocolDocument: 'ProtocolDocument',
////    StudyName: 'StudyName',
////    StandardID: 'StandardID',
////    StudyCode: 'StudyCode',
////    SDTMStandardVersionID: 'SDTMStandardVersionID',
////    SDTMCodelistVersionID: 'SDTMCodelistVersionID',
////    ADAMStandardVersionID: 'ADAMStandardVersionID',
////    ADAMCodelistVersionID: 'ADAMCodelistVersionID',
////    SENDStandardVersionID: 'SENDStandardVersionID',
////    SENDCodelistVersionID: 'SENDCodelistVersionID',
////    OMOPStandardVersionID: 'OMOPStandardVersionID',
////    StudyDescription: 'StudyDescription'
////};

////const projectNameField = {
////    controlTypeText: "TextBox",
////    inputTypeText: "Alphanumeric",
////    inputRequirementText: "Mandatory",
////    requirementErrorMessage: "Project Name is mandatory",
////    inputTypeErrorMessage: "Project Name should contain only alphanumeric values",
////    validationErrorMessage: "Project Name should be between 2 and 255 characters",
////    regExText: "/^[a-zA-Z][a-zA-Z0-9_]+$/",
////    minValue: 2,
////    maxValue: 255
////};
////const protocolNameField = {
////    controlTypeText: "TextBox",
////    inputTypeText: "Alphanumeric",
////    inputRequirementText: "Mandatory",
////    requirementErrorMessage: "Protocol Name is mandatory",
////    inputTypeErrorMessage: "Protocol Name should contain only alphanumeric values",
////    validationErrorMessage: "Protocol Name should be between 2 and 255 characters",
////    regExText: "/^(?!.*  )[A-Za-z0-9 ]+$/",
////    minValue: 2,
////    maxValue: 255
////};

////const sponsorNameField = {
////    controlTypeText: "TextBox",
////    inputTypeText: "Alphanumeric",
////    inputRequirementText: "Mandatory",
////    inputTypeErrorMessage: "Sponsor Name should contain only alphanumeric values and special characters(._-)",
////    validationErrorMessage: "Sponsor Name should be between 2 and 255 characters",
////    requirementErrorMessage: "Sponsor Name is mandatory",
////    regExText: "/^[a-zA-Z0-9-_\.]+$/",
////    minValue: 2,
////    maxValue: 255
////};

////const protocolDocumentField = {
////    controlTypeText: "FileSelect",
////    inputTypeText: "ServerBrowse",
////    inputRequirementText: "Mandatory",
////    inputTypeErrorMessage: "",
////    validationErrorMessage: "",
////    requirementErrorMessage: "Protocol Document should be selected",
////    regExText: null,
////    minValue: null,
////    maxValue: null
////};

////const studyNameField = {
////    attributeName: "StudyName",
////    controlTypeText: "TextBox",
////    inputTypeText: "Alphanumeric",
////    inputRequirementText: "Mandatory",
////    inputTypeErrorMessage: "Study Name should contain only alphanumeric values and underscore",
////    validationErrorMessage: "Study Name should be between 2 and 255 characters",
////    requirementErrorMessage: "Study Name is mandatory",
////    regExText: "/^[a-zA-Z][a-zA-Z0-9_]+$/",
////    minValue: 2,
////    maxValue: 255
////};

////const standardNameField = {
////    controlTypeText: "MultipleDropdown",
////    inputTypeText: "Alphanumeric",
////    inputRequirementText: "Mandatory",
////    inputTypeErrorMessage: "",
////    validationErrorMessage: "",
////    requirementErrorMessage: "Standard Name should be selected",
////    regExText: null,
////    minValue: null,
////    maxValue: null
////};

////const studyCodeField = {
////    controlTypeText: "TextBox",
////    inputTypeText: "Alphanumeric",
////    inputRequirementText: "Optional",
////    inputTypeErrorMessage: "Study Code should contain only alphanumeric values",
////    validationErrorMessage: "Study Code should be between 2 and 255 characters",
////    requirementErrorMessage: "",
////    regExText: "/^(?!.*  )[A-Za-z0-9 ]+$/",
////    minValue: 2,
////    maxValue: 255
////};



////const studyDescriptionField = {
////    controlTypeText: "TextBox",
////    inputTypeText: "Alphanumeric",
////    inputRequirementText: "Optional",
////    inputTypeErrorMessage: "Study Description should contain only alphanumeric values",
////    validationErrorMessage: "Study Description should be between 2 and 255 characters",
////    requirementErrorMessage: "",
////    regExText: "/^(?!.*  )[A-Za-z0-9 ]+$/",
////    minValue: 2,
////    maxValue: 255
////};

////export function Step1(props) {
////    if (props.allData === null) {
////        return <div/>;
////    }
////    const { getFieldDecorator, getFieldsValue } = props.form;
////    const project = props.allData["project"];
////    const { allData, sdtmEnabled, adamEnabled, sendEnabled, protocolDocumentData, omopEnabled } = props;
    
////    const standardVersionFieldSDTM = {
////        controlTypeText: "DropDownWithSearch",
////        inputTypeText: "Alphanumeric",
////        inputRequirementText: sdtmEnabled ? "Mandatory" : "Optional",
////        inputTypeErrorMessage: "",
////        validationErrorMessage: "",
////        requirementErrorMessage: "SDTM Standard Version should be selected",
////        regExText: null,
////        minValue: null,
////        maxValue: null
////    };

////    const standardVersionFieldOMOP = {
////        controlTypeText: "DropDownWithSearch",
////        inputTypeText: "Alphanumeric",
////        inputRequirementText: omopEnabled ? "Mandatory" : "Optional",
////        inputTypeErrorMessage: "",
////        validationErrorMessage: "",
////        requirementErrorMessage: "OMOP CDM Version should be selected",
////        regExText: null,
////        minValue: null,
////        maxValue: null
////    };

////    const codeListVersionFieldSDTM = {
////        controlTypeText: "DropDownWithSearch",
////        inputTypeText: "Alphanumeric",
////        inputRequirementText: sdtmEnabled ? "Mandatory" : "Optional",
////        inputTypeErrorMessage: "",
////        validationErrorMessage: "",
////        requirementErrorMessage: "SDTM CodeList Version should be selected",
////        regExText: null,
////        minValue: null,
////        maxValue: null
////    };

////    const standardVersionFieldADAM = {
////        controlTypeText: "DropDownWithSearch",
////        inputTypeText: "Alphanumeric",
////        inputRequirementText: adamEnabled ? "Mandatory" : "Optional",
////        inputTypeErrorMessage: "",
////        validationErrorMessage: "",
////        requirementErrorMessage: "ADAM Standard Version should be selected",
////        regExText: null,
////        minValue: null,
////        maxValue: null
////    };

////    const codeListVersionFieldADAM = {
////        controlTypeText: "DropDownWithSearch",
////        inputTypeText: "Alphanumeric",
////        inputRequirementText: adamEnabled ? "Mandatory" : "Optional",
////        inputTypeErrorMessage: "",
////        validationErrorMessage: "",
////        requirementErrorMessage: "ADAM CodeList Version should be selected",
////        regExText: null,
////        minValue: null,
////        maxValue: null
////    };

////    const codeListVersionFieldSEND = {
////        controlTypeText: "DropDownWithSearch",
////        inputTypeText: "Alphanumeric",
////        inputRequirementText: sendEnabled ? "Mandatory" : "Optional",
////        inputTypeErrorMessage: "",
////        validationErrorMessage: "",
////        requirementErrorMessage: "SEND CodeList Version should be selected",
////        regExText: null,
////        minValue: null,
////        maxValue: null
////    };

////    const standardVersionFieldSEND = {
////        controlTypeText: "DropDownWithSearch",
////        inputTypeText: "Alphanumeric",
////        inputRequirementText: sendEnabled ? "Mandatory" : "Optional",
////        inputTypeErrorMessage: "",
////        validationErrorMessage: "",
////        requirementErrorMessage: "SEND Standard Version should be selected",
////        regExText: null,
////        minValue: null,
////        maxValue: null
////    };

////    const standardOptions = allData["cDISCDataStandards"].map(function (option) {
////        // if (option['standardName'].toLowerCase().includes("sdtm")) {
////        let tempStore = props.form.getFieldValue("StandardID");

////        //have to hide ADAM its enable only if you choose SEND or SDTM
////        let check = tempStore == undefined ? true : false; 

////        if (check ? true : tempStore.length == 0 ? true : false) {
////            return (
////                <Option name="Standard Name_Option" key={option['cdiscDataStandardID']}>
////                    {option['standardName']}
////                </Option>
////            );
////        }

////        if (!check ? tempStore.length > 0 ? true  :false : true )
////        {
////            if (tempStore.indexOf("1") < 0 && tempStore.indexOf("10") < 0) {
////                return (
////                    <Option name="Standard Name_Option" key={option['cdiscDataStandardID']}>
////                        {option['standardName']}
////                    </Option>
////                );
////            } 
////            if (tempStore.indexOf("1") >= 0 && option['cdiscDataStandardID'] == "10" ? true : false) {
////                return (
////                    <Option name="Standard Name_Option" disabled key={option['cdiscDataStandardID']}>
////                        {option['standardName']}
////                    </Option>
////                );
////            } 

////             if (tempStore.indexOf("10") >= 0 && option['cdiscDataStandardID'] == "1" ? true : false) {
////                return (
////                    <Option name="Standard Name_Option" disabled key={option['cdiscDataStandardID']}>
////                        {option['standardName']}
////                    </Option>
////                );
////            }

           
////            return (
////                <Option name="Standard Name_Option"  key={option['cdiscDataStandardID']}>
////                    {option['standardName']}
////                </Option>
////            );
             


////        }
////        //}
////    });



////    const sdtmVersionOptions = allData["cDISCDataStdVersions"].map(function (option) {
////        if (option['cdiscDataStandardID'] === 1) {
////            return (
////                <Option name="SDTM Standard Version_Option" key={option['cdiscDataStdVersionID']}>
////                    {option['stdVersionName']}
////                </Option>
////            );
////        }
        
////    });

////    const adamVersionOptions = allData["cDISCDataStdVersions"].map(function (option) {
////        if (option['cdiscDataStandardID'] === 2) {
////            return (
////                <Option name="ADAM Standard Version_Option" key={option['cdiscDataStdVersionID']}>
////                    {option['stdVersionName']}
////                </Option>
////            );
////        }

////    });



////    const sendVersionOptions = allData["cDISCDataStdVersions"].map(function (option) {
////        if (option['cdiscDataStandardID'] === 3) {
////            return (
////                <Option name="SEND Standard Version_Option" key={option['cdiscDataStdVersionID']}>
////                    {option['stdVersionName']}
////                </Option>
////            );
////        }

////    });

////    const omopVersionOptions = allData["cDISCDataStdVersions"].map(function (option) {
////        if (option['cdiscDataStandardID'] === 4) {
////            return (
////                <Option name="ADAM Standard Version_Option" key={option['cdiscDataStdVersionID']}>
////                    {option['stdVersionName']}
////                </Option>
////            );
////        }

////    });

////    const sdtmCodeLists = allData["nCICodeLists"].map(function (option) {
////        if (option['cdiscDataStandardID'] === 1) {
////            return (
////                <Option name="SDTM CodeList Version_Option" key={option['nciCodeListID']}>
////                    {option['codeListVersion']}
////                </Option>
////            );
////        }

////    });
////    const adamCodeLists = allData["nCICodeLists"].map(function (option) {
////        if (option['cdiscDataStandardID'] === 2) {
////            return (
////                <Option name="ADAM CodeList Version_Option" key={option['nciCodeListID']}>
////                    {option['codeListVersion']}
////                </Option>
////            );
////        }

////    });
////    const sendCodeLists = allData["nCICodeLists"].map(function (option) {
////        if (option['cdiscDataStandardID'] === 3) {
////            return (
////                <Option name="SEND CodeList Version_Option" key={option['nciCodeListID']}>
////                    {option['codeListVersion']}
////                </Option>
////            );
////        }

////    });
////    const step1 = (
////        <div id = "study_step1">
////            <Row style={rowStyle} justify="space-between"> 
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>    
////                    <FormItem label="Project Name" key={"ProjectIDItem"}>               {/* Project Name Field */}
////                        {getFieldDecorator(Step1Fields.ProjectID, {
////                            rules: getRules(projectNameField, props),
////                            initialValue: project.projectName
////                        })(
////                            <Input
////                                placeholder="Project Name"
////                                disabled
////                            />,
////                        )}
////                    </FormItem>
////                </Col>
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Protocol Name" key={"protocolNameItem"}>                                    {/* Protocol Name Field */}
////                        {getFieldDecorator(Step1Fields.ProtocolName, {
////                            rules: getRules(protocolNameField, props),
////                            initialValue: ''
////                        })(
////                            <Input
////                                placeholder="Protocol Name"
////                            />,
////                        )}
////                    </FormItem>
////                </Col>
////            </Row>
////            <Row style={rowStyle} justify="space-between">
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Sponsor Name" key={"SponsorNameItem"}>               {/* Sponsor Name Field */}
////                        {getFieldDecorator(Step1Fields.SponsorName, {
////                            rules: getRules(sponsorNameField, props),
////                            initialValue: project.sponsorName
////                        })(
////                            <Input
////                                disabled
////                            />,
////                        )}
////                    </FormItem>
////                </Col>
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Protocol Document" key={"ProtocolDocumentItem"}>                                   {/* Protocol Document Field */}
////                        {getFieldDecorator(Step1Fields.ProtocolDocument, {
////                            rules: getRules(protocolDocumentField, props),
////                            initialValue: ''
////                        })(
////                            <TreeSelect
////                                tabIndex={0}
////                                showSearch
////                                autoBlur
////                                mode="single"
////                                allowClear
////                                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
////                                placeholder="Please Select"
////                            >
////                                {protocolDocumentData}
////                            </TreeSelect>,
////                        )}
////                    </FormItem>
////                </Col>
////            </Row>
////            <Row style={rowStyle} justify="space-between">
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Study Name" key={"StudyNameItem"}>                     {/* Study Name Field */}
////                        {getFieldDecorator(Step1Fields.StudyName, {
////                            rules: getRules(studyNameField, props),
////                            initialValue: ''
////                        })(
////                            <Input
////                                placeholder="Study Name"
////                            />,
////                        )}
////                    </FormItem>
////                </Col>
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Study Code" key={"StudyCodeItem"}>                                          {/* Study Code Field */}
////                        {getFieldDecorator(Step1Fields.StudyCode, {
////                            rules: getRules(studyCodeField, props),
////                            initialValue: ''
////                        })(
////                            <Input
////                                placeholder="Study Code"
////                            />,
////                        )}
////                    </FormItem>
////                </Col>
////            </Row>
////            <Row style={rowStyle} justify="space-between">
////                <Col md={splitClass} sm={24} xs={24} >
////                    <Row style={rowStyle} justify="space-between">
////                        <Col  sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                            <FormItem label="Standard Name" key={"StandardNameItem"}>              {/* Standard Name Field */}
////                            {getFieldDecorator(Step1Fields.StandardID, {
////                                rules: getRules(standardNameField, props),
////                                initialValue: []
////                            })(
////                                    <Select
////                                        mode="multiple"
////                                        placeholder="Please select"
////                                        onChange={props.onStandardNameChange}
////                                        aria-name="Standard Name"
////                                        dropdownRender={(menu) => (
////                                            <div>
////                                                {menu}
////                                                <Divider style={{ margin: '4px 0' }} />
////                                                <div style={{ padding: 10}}>
////                                                    <Button type="danger" size="small" style={{ width:'60px' }}>Cancel</Button>

////                                                    <Button type="primary" size="small" style={{width:'60px',float:"right" }}>OK</Button>
////                                                </div>
////                                            </div>
////                                        )}
////                                    >
////                                        {standardOptions}
////                                    </Select>
////                            )}
////                            </FormItem>
////                        </Col>
////                    </Row>
////                    <Row>
////                        <Col  sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                            <FormItem label="Study Description" key={"StudyDescriptionItem"}>              {/* Study Description Field */}
////                            {getFieldDecorator(Step1Fields.StudyDescription, {
////                                rules: getRules(studyDescriptionField, props),
////                                initialValue: ''
////                            })(
////                                <Input
////                                    placeholder={"Study Description"}
////                                />
////                            )}
////                            </FormItem>
////                        </Col>
////                    </Row>
////                </Col>
////                <Col md={splitClass} sm={24} xs={24} >
////                    <Row style={rowStyle} justify="space-between">
////                        <Col md={splitClass} sm={12} xs={12} style={{ paddingRight: "10px" , display: !sdtmEnabled ? "none" : "block" }}>
////                            <FormItem label="SDTM Standard Version" key={"StandardVersionSDTMItem"}>             {/* SDTM Standard Version Field */}
////                                {getFieldDecorator(Step1Fields.SDTMStandardVersionID, {
////                                    rules: getRules(standardVersionFieldSDTM, props),
////                                    initialValue: ''
////                                })(
////                                    <Select
////                                    mode="single"
////                                    aria-name="SDTM Standard Version"
////                                    >
////                                        {sdtmVersionOptions}
////                                    </Select>,
////                                )}
////                            </FormItem>
////                        </Col>
////                        <Col md={splitClass} sm={12} xs={12} style={{ paddingRight: "10px", display: !sdtmEnabled ? "none" : "block" }}>
////                            <FormItem label="SDTM CodeList Version" key={"codeListVersionFieldSDTMItem"}>             {/* SDTM CodeList Version Field */}
////                                {getFieldDecorator(Step1Fields.SDTMCodelistVersionID, {
////                                    rules: getRules(codeListVersionFieldSDTM, props),
////                                    initialValue: ''
////                                })(
////                                    <Select                                         
////                                        mode="single"
////                                        aria-name="SDTM CodeList Version"
////                                    >
////                                        {sdtmCodeLists}
////                                    </Select>,
////                                )}
////                            </FormItem>
////                        </Col>
////                        <Col md={splitClass} sm={12} xs={12} style={{ paddingRight: "10px", display: !sendEnabled ? "none" : "block" }}>
////                            <FormItem label="SEND Standard Version" key={"StandardVersionSENDItem"}>             {/* SEND Standard Version Field */}
////                                {getFieldDecorator(Step1Fields.SENDStandardVersionID, {
////                                    rules: getRules(standardVersionFieldSEND, props),
////                                    initialValue: ''
////                                })(
////                                    <Select
////                                        mode="single"
////                                        aria-name="SEND Standard Version"
////                                    >
////                                        {sendVersionOptions}
////                                    </Select>,
////                                )}
////                            </FormItem>
////                        </Col>
////                        <Col md={splitClass} sm={12} xs={12} style={{ paddingRight: "10px", display: !sendEnabled ? "none" : "block" }}>
////                            <FormItem label="SEND CodeList Version" key={"codeListVersionFieldSENDItem"}>            {/* SEND CodeList Version Field */}
////                                {getFieldDecorator(Step1Fields.SENDCodelistVersionID, {
////                                    rules: getRules(codeListVersionFieldSEND, props),
////                                    initialValue: ''
////                                })(
////                                    <Select
////                                        mode="single"
////                                        aria-name="SEND CodeList Version"
////                                    >
////                                        {sendCodeLists}
////                                    </Select>,
////                                )}
////                            </FormItem>
////                        </Col>
////                        <Col md={splitClass} sm={12} xs={12} style={{ paddingRight: "10px", display: !adamEnabled ? "none" : "block" }}>
////                            <FormItem label="ADAM Standard Version" key={"StandardVersionADAMItem"}>             {/* ADAM Standard Version Field */}
////                                {getFieldDecorator(Step1Fields.ADAMStandardVersionID, {
////                                    rules: getRules(standardVersionFieldADAM, props),
////                                    initialValue: ''
////                                })(
////                                    <Select
////                                        mode="single"
////                                        aria-name="ADAM Standard Version"
////                                    >
////                                        {adamVersionOptions}
////                                    </Select>,
////                                )}
////                            </FormItem>
////                        </Col>
////                        <Col md={splitClass} sm={12} xs={12} style={{ paddingRight: "10px", display: !adamEnabled ? "none" : "block" }}>
////                            <FormItem label="ADAM CodeList Version" key={"codeListVersionFieldADAMItem"}>            {/* ADAM CodeList Version Field */}
////                                {getFieldDecorator(Step1Fields.ADAMCodelistVersionID, {
////                                    rules: getRules(codeListVersionFieldADAM, props),
////                                    initialValue: ''
////                                })(
////                                    <Select
////                                        mode="single"
////                                        aria-name="ADAM CodeList Version"
////                                    >
////                                        {adamCodeLists}
////                                    </Select>,
////                                )}
////                            </FormItem>
////                        </Col>
////                        <Col md={splitClass} sm={12} xs={12} style={{ paddingRight: "10px", display: !omopEnabled ? "none" : "block" }}>
////                            <FormItem label="OMOP CDM Version" key={"StandardVersionSDTMItem"}>             {/* OMOP CDM Standard Version Field */}
////                                {getFieldDecorator(Step1Fields.OMOPStandardVersionID, {
////                                    rules: getRules(standardVersionFieldOMOP, props),
////                                    initialValue: ''
////                                })(
////                                    <Select
////                                        mode="single"
////                                        aria-name="OMOP CDM Standard Version"
////                                    >
////                                        {omopVersionOptions}
////                                    </Select>,
////                                )}
////                            </FormItem>
////                        </Col>
////                    </Row>
////                </Col>
////            </Row>
         

////        </div>
////    );

////    return step1;
////}