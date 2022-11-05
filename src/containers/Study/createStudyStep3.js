////import React from 'react';
////import { Form, Row, Col, TreeSelect, Switch } from 'antd';
////import { rowStyle } from '../../styles/JsStyles/CommonStyles';
////import { getRules } from '../Utility/htmlUtility';
////import { Step1Fields } from './createStudyStep1';
////import '../Utility/browse.css';

////const FormItem = Form.Item;
////const TreeNode = TreeSelect.TreeNode;
////const splitClass = 12;
////export const Step3Fields = {
////    SDTMMappingRequried: "SDTMMappingRequried",
////    SDTMRawDatasetLoc: "SDTMRawDatasetLoc",
////    ADAMMappingRequried: "ADAMMappingRequried",
////    ADAMRawDatasetLoc: "ADAMRawDatasetLoc",
////    SENDMappingRequried: "SENDMappingRequried",
////    SENDRawDatasetLoc: "SENDRawDatasetLoc"
////};
////export function Step3(props) {
////    if (props.allData === null) {
////        return <div />;
////    }
////    const { getFieldDecorator, getFieldsValue } = props.form;
////    const { rawDatasetTreeData, sdtmEnabled, adamEnabled,sendEnabled, xptlocationTreeData } = props;

   
////    const mappingSwitchSDTM = {
////        controlTypeText: "Switch",
////        inputTypeText: "Switch",
////        inputRequirementText: "Optional",
////        inputTypeErrorMessage: "",
////        validationErrorMessage: "",
////        requirementErrorMessage: "",
////        regExText: null,
////        minValue: null,
////        maxValue: null
////    };

 

////    const mappingSwitchADAM = {
////        controlTypeText: "Switch",
////        inputTypeText: "Switch",
////        inputRequirementText: "Optional",
////        inputTypeErrorMessage: "",
////        validationErrorMessage: "",
////        requirementErrorMessage: "",
////        regExText: null,
////        minValue: null,
////        maxValue: null
////    };

////    const mappingSwitchSEND = {
////        controlTypeText: "Switch",
////        inputTypeText: "Switch",
////        inputRequirementText: "Optional",
////        inputTypeErrorMessage: "",
////        validationErrorMessage: "",
////        requirementErrorMessage: "",
////        regExText: null,
////        minValue: null,
////        maxValue: null
////    };

////    const sdtmMappingEnabled = getFieldsValue([Step3Fields.SDTMMappingRequried])[Step3Fields.SDTMMappingRequried] !== undefined && getFieldsValue([Step3Fields.SDTMMappingRequried])[Step3Fields.SDTMMappingRequried];
////    const rawDatasetFieldSDTM = {
////        controlTypeText: "FileSelect",
////        inputTypeText: "ServerBrowse",
////        inputRequirementText: sdtmEnabled && sdtmMappingEnabled ? "Mandatory" : "Optional",
////        inputTypeErrorMessage: "",
////        validationErrorMessage: "",
////        requirementErrorMessage: "Raw Dataset location for SDTM should be selected",
////        regExText: null,
////        minValue: null,
////        maxValue: null
////    };
////    const adamMappingEnabled = getFieldsValue([Step3Fields.ADAMMappingRequried])[Step3Fields.ADAMMappingRequried] !== undefined && getFieldsValue([Step3Fields.ADAMMappingRequried])[Step3Fields.ADAMMappingRequried];

////    const rawDatasetFieldADAM = {
////        controlTypeText: "FileSelect",
////        inputTypeText: "ServerBrowse",
////        inputRequirementText: adamEnabled && adamMappingEnabled  ? "Mandatory" : "Optional",
////        inputTypeErrorMessage: "",
////        validationErrorMessage: "",
////        requirementErrorMessage: "Raw Dataset location for ADAM should be selected",
////        regExText: null,
////        minValue: null,
////        maxValue: null
////    };

////    const sendMappingEnabled = getFieldsValue([Step3Fields.SENDMappingRequried])[Step3Fields.SENDMappingRequried] !== undefined && getFieldsValue([Step3Fields.SENDMappingRequried])[Step3Fields.SENDMappingRequried];
////    const rawDatasetFieldSEND = {
////        controlTypeText: "FileSelect",
////        inputTypeText: "ServerBrowse",
////        inputRequirementText: sendEnabled && sendMappingEnabled ? "Mandatory" : "Optional",
////        inputTypeErrorMessage: "",
////        validationErrorMessage: "",
////        requirementErrorMessage: "Raw Dataset location for SEND should be selected",
////        regExText: null,
////        minValue: null,
////        maxValue: null
////    };

////    const step3 = (


////        <div id="study_step3">
////            <Row style={rowStyle} justify="space-between">
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Do You want to perform SDTM mapping?" key={"annotateSwitchItem"}>               {/* SDTM mapping Field */}
////                        {getFieldDecorator(Step3Fields.SDTMMappingRequried, {
////                            valuePropName: 'checked',
////                            rules: getRules(mappingSwitchSDTM, props),
////                            initialValue: false
////                        })(
////                            <Switch
////                            disabled={!sdtmEnabled}
////                            name="SDTMSwitch"
////                            />,
////                        )}
////                    </FormItem>
////                </Col>
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Raw Dataset Location for SDTM">                                                   {/* Raw Dataset Location for SDTM Field */}
////                        {getFieldDecorator(Step3Fields.SDTMRawDatasetLoc, {
////                            rules: getRules(rawDatasetFieldSDTM, props),
////                            initialValue: ''
////                        })(
////                            <TreeSelect
////                                tabIndex={0}
////                                showSearch
////                                autoBlur
////                                mode="single"
////                                allowClear
////                                disabled={!sdtmMappingEnabled} 
////                                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
////                                placeholder="Please Select"
////                            >
////                                {rawDatasetTreeData}
////                            </TreeSelect>
////                        )}
////                    </FormItem>
////                </Col>
////            </Row>
////            <Row style={rowStyle} >
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Do You want to perform mapping for ADAM ?" key={"annotateSwitchItem"}>               {/* ADAM mapping Field */}
////                        {getFieldDecorator(Step3Fields.ADAMMappingRequried, {
////                            valuePropName: 'checked',
////                            rules: getRules(mappingSwitchADAM, props),
////                            initialValue: false
////                        })(
////                            <Switch
////                            disabled={!adamEnabled}
////                            name="ADAMSwitch"
////                            />,
////                        )}
////                    </FormItem>
////                </Col>
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="ADAM Input Dataset Location">                                                 {/* Raw Dataset Location for ADAM Field */}
////                        {getFieldDecorator(Step3Fields.ADAMRawDatasetLoc, {
////                            rules: getRules(rawDatasetFieldADAM, props),
////                            initialValue: ''
////                        })(
////                            <TreeSelect
////                                tabIndex={0}
////                                showSearch
////                                autoBlur
////                                mode="single"
////                                allowClear
////                                disabled={!adamMappingEnabled}
////                                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
////                                placeholder="Please Select"
////                            >
////                                {xptlocationTreeData}
////                            </TreeSelect>
////                        )}
////                    </FormItem>
////                </Col>
////            </Row>
////            <Row style={rowStyle} justify="space-between">
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Do You want to perform SEND mapping?" key={"annotateSwitchItem"}>               {/* SEND mapping Field */}
////                        {getFieldDecorator(Step3Fields.SENDMappingRequried, {
////                            valuePropName: 'checked',
////                            rules: getRules(mappingSwitchSEND, props),
////                            initialValue: false
////                        })(
////                            <Switch
////                                disabled={!sendEnabled}
////                                name="SENDSwitch"
////                            />,
////                        )}
////                    </FormItem>
////                </Col>
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Raw Dataset Location for SEND">                                                   {/* Raw Dataset Location for SEND Field */}
////                        {getFieldDecorator(Step3Fields.SENDRawDatasetLoc, {
////                            rules: getRules(rawDatasetFieldSEND, props),
////                            initialValue: ''
////                        })(
////                            <TreeSelect
////                                tabIndex={0}
////                                showSearch
////                                autoBlur
////                                mode="single"
////                                allowClear
////                                disabled={!sendMappingEnabled}
////                                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
////                                placeholder="Please Select"
////                            >
////                                {rawDatasetTreeData}
////                            </TreeSelect>
////                        )}
////                    </FormItem>
////                </Col>
////            </Row>
////        </div>
////    );
////    return step3;
////}