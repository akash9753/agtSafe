////import React from 'react';
////import { Form, Row, Col, Button, TreeSelect, Switch, Select, Popconfirm, Divider } from 'antd';
////import { rowStyle } from '../../styles/JsStyles/CommonStyles';
////import { getRules } from '../Utility/htmlUtility';
////import ReactTable from '../Utility/reactTable';
////import '../Utility/browse.css';
////import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';

////var adamDatasetLoc = "";
////const FormItem = Form.Item;
////const TreeNode = TreeSelect.TreeNode;
////const Option = Select.Option;
////const splitClass = 12;
////const margin = {
////    margin: '0 5px 0 0'
////};
////export const Step6Fields = {
////    SENDMappingRequried: "SENDMappingRequried",
////    SENDRawDatasetLoc: "SENDRawDatasetLoc",
////    SENDDefineRequired: "SENDDefineRequired",
////    SENDStandardDatasetLoc1: "SENDStandardDatasetLoc1",
////    SENDStandardDatasetLoc2: "SENDStandardDatasetLoc2",
////    SENDDefineOutputType: "SENDDefineOutputType",
////    SENDStudyRelatedDocument: "SENDStudyRelatedDocument"
////};
////export function Step6(props) {
////    const { getFieldValue } = props.form;
////    if (props.allData === null) {
////        return <div />;
////    }
////    const { pdfDocumentData, xptlocationTreeData, allData, docDataSource, sendEnabled } = props;
////    const { getFieldDecorator, getFieldsValue } = props.form;

////    //const cfrRequirement = getFieldsValue(['StandardName']).StandardName !== undefined && getFieldsValue(['StandardName']).StandardName.indexOf('SEND') > -1;

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

////    const sendMappingEnabled = getFieldsValue([Step6Fields.SENDMappingRequried])[Step6Fields.SENDMappingRequried] !== undefined && getFieldsValue([Step6Fields.SENDMappingRequried])[Step6Fields.SENDMappingRequried];
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

////    const SENDdefineXMlEnabled = getFieldsValue([Step6Fields.SENDDefineRequired])[Step6Fields.SENDDefineRequired] !== undefined && getFieldsValue([Step6Fields.SENDDefineRequired])[Step6Fields.SENDDefineRequired];
////    const defineSwitch = {
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



////    const StandardizedDatasetLocationField = {
////        controlTypeText: "FileSelect",
////        inputTypeText: "ServerBrowse",
////        inputRequirementText: SENDdefineXMlEnabled ? "Mandatory" : "Optional",
////        inputTypeErrorMessage: "",
////        validationErrorMessage: "",
////        requirementErrorMessage: "Standardized Dataset Location should be selected",
////        regExText: null,
////        minValue: null,
////        maxValue: null
////    };

////    const DefineOutputTypeField = {
////        controlTypeText: "DropDownWithSearch",
////        inputTypeText: "Alphanumeric",
////        inputRequirementText: SENDdefineXMlEnabled ? "Mandatory" : "Optional",
////        inputTypeErrorMessage: "",
////        validationErrorMessage: "",
////        requirementErrorMessage: "Define Output Type should be selected",
////        regExText: null,
////        minValue: null,
////        maxValue: null
////    };

////    const fnDefineSwitch = value => {
////        if (!value) {
////            props.form.resetFields([Step6Fields.SENDRawDatasetLoc, Step6Fields.SENDStandardDatasetLoc2, Step6Fields.SENDDefineOutputType]);
////            props.handleSEND();
////        } else {
////            props.form.setFieldsValue({ SENDStandardDatasetLoc2: getFieldValue(Step6Fields.SENDStandardDatasetLoc1) })
////        }
////    }

////    const fnSENDtandardDatasetLoc1Change = e => {
////        if (getFieldValue(Step6Fields.SENDDefineRequired)) {
////            props.form.setFieldsValue({ SENDStandardDatasetLoc2: e })
////        }
////    }

////    const columns = [
////        {
////            title: 'Actions',
////            dataIndex: 'actions',
////            key: 'actions',
////            width: 50
////        },
////        {
////            title: 'Title',
////            dataIndex: 'Title',
////            key: 'Title',
////            width: 100
////        },
////        {
////            title: 'Type',
////            dataIndex: 'DestinationType',
////            key: 'DestinationType',
////            width: 50
////        },

////        {
////            title: 'Document Type',
////            dataIndex: 'DocumentType',
////            key: 'DocumentType',
////            width: 50
////        },
////        {
////            title: 'Path',
////            dataIndex: 'FileLocation',
////            key: 'FileLocation',
////            width: 100
////        }


////    ];
////    //const dataSource = docDataSource.map(function (docDetail, index) {
////    //    const editCell = (<div>
////    //        <ButtonWithToolTip
////    //            name={docDetail.Title + "_Edit"}
////    //            tooltip="Edit"
////    //            shape="circle"
////    //            classname="fas fa-pen"
////    //            size="small"
////    //            style={margin}
////    //            onClick={() => props.editDoc('SEND', index)}
////    //        />
////    //        <Popconfirm
////    //            title="Are you sure？"
////    //            okText={<span name="PopoverYes">yes</span>}
////    //            cancelText={<span name="PopoverNo">No</span>}
////    //            onConfirm={() => props.editDoc('SEND', index, true)}
////    //        >
////    //            <ButtonWithToolTip
////    //                name={docDetail.Title + "_Delete"}
////    //                tooltip="Delete"
////    //                shape="circle"
////    //                classname="fas fa-trash-alt"
////    //                size="small"
////    //                style={margin}
////    //            />
////    //        </Popconfirm>
////    //    </div>);
////    //    return {
////    //        key: docDetail.Title + index,
////    //        Title: docDetail.Title,
////    //        DestinationType: docDetail.DestinationType,
////    //        DocumentType: docDetail.DocumentType,
////    //        FileLocation: docDetail.FileLocation,
////    //        actions: editCell
////    //    };
////    //});

////    const fnSENDSwitch = value => {
////        if (!value) {
////            props.form.resetFields([Step6Fields.SENDRawDatasetLoc, Step6Fields.SENDStandardDatasetLoc1, Step6Fields.SENDStandardDatasetLoc2])
////            props.form.validateFields([Step6Fields.SENDDefineOutputType, Step6Fields.SENDStandardDatasetLoc2])

////        }
////    }

////    const defineOutputOptions = allData["defineOutputType"].map(function (option) {
////        return (
////            <Option name="Define Output Type SEND_Option" key={option['productcontrolledTermID']}>
////                {option['shortValue']}
////            </Option>
////        );

////    });

////    const step6 = (
////        <div id="study_step2">
////            <Row style={rowStyle} >
////                <span style={{ fontSize: '14px', color: '#1890ff' }}>MAPPING</span>
////                <Divider />
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Do You want to perform mapping for SEND ?" key={"annotateSwitchItem"}>               {/* SEND mapping Field */}
////                        {getFieldDecorator(Step6Fields.SENDMappingRequried, {
////                            valuePropName: 'checked',
////                            rules: getRules(mappingSwitchSEND, props),
////                            initialValue: false
////                        })(
////                            <Switch
////                                name="SENDSwitch"
////                                disabled={!sendEnabled}
////                                onChange={(e) => fnSENDSwitch(e)}

////                            />,
////                        )}
////                    </FormItem>
////                </Col>
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Raw Dataset Location for SEND">                           {/* Raw Dataset Location for SEND Field */}
////                        {getFieldDecorator(Step6Fields.SENDRawDatasetLoc, {
////                            rules: getRules(rawDatasetFieldSEND, props),
////                            initialValue: props.sdtmEnabled ? adamDatasetLoc : null
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
////                                {xptlocationTreeData}
////                            </TreeSelect>
////                        )}
////                    </FormItem>

////                    <FormItem label="Output Standardized SEND Dataset Location">                                                                    {/* Standardized Dataset Field */}
////                        {getFieldDecorator(Step6Fields.SENDStandardDatasetLoc1, {
////                            rules: getRules(rawDatasetFieldSEND, props),
////                            initialValue: ''
////                        })(
////                            <TreeSelect
////                                onChange={(e) => fnSENDtandardDatasetLoc1Change(e)}
////                                disabled={!sendMappingEnabled}
////                                tabIndex={0}
////                                showSearch
////                                autoBlur
////                                mode="single"
////                                allowClear
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
////                <span style={{ fontSize: '14px', color: '#1890ff' }}>DEFINE</span>
////                <Divider />
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Do You want to create define XML for SEND?">               {/* create define XML Field */}
////                        {getFieldDecorator(Step6Fields.SENDDefineRequired, {
////                            valuePropName: 'checked',
////                            rules: getRules(defineSwitch, props),
////                            initialValue: false
////                        })(
////                            <Switch
////                                key={'SENDdefineSwitch'}
////                                name="XMLSwitchSEND"
////                                onChange={(e) => fnDefineSwitch(e)}

////                            />,
////                        )}
////                    </FormItem>
////                </Col>
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Define Output Type">                                                                    {/* Define Output Type Field */}
////                        {getFieldDecorator(Step6Fields.SENDDefineOutputType, {
////                            rules: getRules(DefineOutputTypeField, props),
////                            initialValue: ''
////                        })(

////                            <Select
////                                key={'SENDDefineOutputType'}
////                                mode="single"
////                                disabled={!SENDdefineXMlEnabled}
////                                aria-name="Define Output Type SEND"
////                            >
////                                {defineOutputOptions}
////                            </Select>,
////                        )}
////                    </FormItem>
////                </Col>
////            </Row>
////            <Row style={rowStyle} justify="space-between">
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Standardized Send Dataset Location">                                                                    {/* Standardized Dataset Field */}
////                        {getFieldDecorator(Step6Fields.SENDStandardDatasetLoc2, {
////                            rules: getRules(StandardizedDatasetLocationField, props),
////                            initialValue: ''
////                        })(
////                            <TreeSelect
////                                disabled={(!SENDdefineXMlEnabled || (sendMappingEnabled && (getFieldValue(Step6Fields.SENDStandardDatasetLoc1) != "" &&
////                                    getFieldValue(Step6Fields.SENDStandardDatasetLoc1) != undefined)))}
////                                tabIndex={0}
////                                showSearch
////                                autoBlur
////                                mode="single"
////                                allowClear
////                                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
////                                placeholder="Please Select"
////                            >
////                                {xptlocationTreeData}
////                            </TreeSelect>
////                        )}
////                    </FormItem>
////                </Col>
////            </Row>

////        </div>
////    );
////    return step6;
////}