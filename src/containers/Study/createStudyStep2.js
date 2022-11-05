////import React from 'react';
////import { Form, Row, Col, TreeSelect, Switch } from 'antd';
////import { rowStyle } from '../../styles/JsStyles/CommonStyles';
////import { getRules } from '../Utility/htmlUtility';
////import { Step1Fields } from './createStudyStep1';
////import '../Utility/browse.css';

////const FormItem = Form.Item;
////const TreeNode = TreeSelect.TreeNode;
////const splitClass = 12;
////export const Step2Fields = {
////    AnnotationRequired: "SDTMAnnotationRequired",
////    CRFDocument: "SDTMCRFDocument"
////};
////export function Step2(props) {
////    if (props.allData === null) {
////        return <div />;
////    }
////    const { getFieldDecorator, getFieldsValue } = props.form;
////    const { pdfDocumentData } = props;
////    const cfrRequirement = props.sdtmEnabled;

////    const annotateSwitch = {
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

////    const crfDocumentField = {
////        controlTypeText: "FileSelect",
////        inputTypeText: "ServerBrowse",
////        inputRequirementText: cfrRequirement ? "Mandatory" : "Optional",
////        inputTypeErrorMessage: "",
////        validationErrorMessage: "",
////        requirementErrorMessage: "CRF Document should be selected",
////        regExText: null,
////        minValue: null,
////        maxValue: null
////    };

////    const step2 = (
////        <div id="study_step2">
////            <Row style={rowStyle} justify="space-between">
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Do You want to annotate the document?" key={"annotateSwitchItem"}>               {/* Annotate the document Field */}
////                        {getFieldDecorator(Step2Fields.AnnotationRequired, {
////                            valuePropName: 'checked',
////                            rules: getRules(annotateSwitch, props),
////                            initialValue: false
////                        })(
////                            <Switch
////                                key={'annotateSwitch'}
////                                disabled={!cfrRequirement}
////                                name="AnnotateSwitch"
////                            />,
////                        )}
////                    </FormItem>
////                </Col>
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="CRF Document">                                                                    {/* CRF Document Field */}
////                        {getFieldDecorator(Step2Fields.CRFDocument, {
////                            rules: getRules(crfDocumentField, props),
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
////                                {pdfDocumentData}
////                            </TreeSelect>
////                        )}
////                    </FormItem>
////                </Col>
////            </Row>
////        </div>
////    );
////    return step2;
////}