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
////export const Step5Fields = {
////    ADAMMappingRequried: "ADAMMappingRequried",
////    ADAMRawDatasetLoc: "ADAMRawDatasetLoc",
////    ADAMDefineRequired: "ADAMDefineRequired",
////    ADAMStandardDatasetLoc: "ADAMStandardDatasetLoc",
////    ADAMStandardDatasetLoc1: "ADAMStandardDatasetLoc1",
////    ADAMStandardDatasetLoc2: "ADAMStandardDatasetLoc2",

////    ADAMDefineOutputType: "ADAMDefineOutputType",
////    ADAMStudyRelatedDocument: "ADAMStudyRelatedDocument"
////};
////export function Step5(props) {
////    const { getFieldValue } = props.form;

////    if (props.allData === null) {
////        return <div />;
////    }
////    const { pdfDocumentData, xptlocationTreeData, allData, docDataSource, adamEnabled } = props;
////    const { getFieldDecorator, getFieldsValue } = props.form;

////    //const cfrRequirement = getFieldsValue(['StandardName']).StandardName !== undefined && getFieldsValue(['StandardName']).StandardName.indexOf('ADAM') > -1;

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

////    const adamMappingEnabled = getFieldsValue([Step5Fields.ADAMMappingRequried])[Step5Fields.ADAMMappingRequried] !== undefined && getFieldsValue([Step5Fields.ADAMMappingRequried])[Step5Fields.ADAMMappingRequried];
////    const rawDatasetFieldADAM = {
////        controlTypeText: "FileSelect",
////        inputTypeText: "ServerBrowse",
////        inputRequirementText: adamEnabled && adamMappingEnabled ? "Mandatory" : "Optional",
////        inputTypeErrorMessage: "",
////        validationErrorMessage: "",
////        requirementErrorMessage: "Raw Dataset location for ADAM should be selected",
////        regExText: null,
////        minValue: null,
////        maxValue: null
////    };

////    const ADAMdefineXMlEnabled = getFieldsValue([Step5Fields.ADAMDefineRequired])[Step5Fields.ADAMDefineRequired] !== undefined && getFieldsValue([Step5Fields.ADAMDefineRequired])[Step5Fields.ADAMDefineRequired];
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
////        inputRequirementText: ADAMdefineXMlEnabled ? "Mandatory" : "Optional",
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
////        inputRequirementText: ADAMdefineXMlEnabled ? "Mandatory" : "Optional",
////        inputTypeErrorMessage: "",
////        validationErrorMessage: "",
////        requirementErrorMessage: "Define Output Type should be selected",
////        regExText: null,
////        minValue: null,
////        maxValue: null
////    };

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
////    //            onClick={() => props.editDoc('ADAM', index)}
////    //        />
////    //        <Popconfirm
////    //            title="Are you sure？"
////    //            okText={<span name="PopoverYes">yes</span>}
////    //            cancelText={<span name="PopoverNo">No</span>}
////    //            onConfirm={() => props.editDoc('ADAM', index, true)}
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



////    const defineOutputOptions = allData["defineOutputType"].map(function (option) {
////        return (
////            <Option name="Define Output Type ADAM_Option" key={option['productcontrolledTermID']}>
////                {option['shortValue']}
////            </Option>
////        );

////    });

////    const fnADAMSwitch = value => {
////        if (!value) {
////            props.form.resetFields([Step5Fields.ADAMRawDatasetLoc, Step5Fields.ADAMStandardDatasetLoc1, Step5Fields.ADAMStandardDatasetLoc2])
////            props.form.validateFields([Step5Fields.ADAMDefineOutputType, Step5Fields.ADAMStandardDatasetLoc2])

////        }
////    }

////    const fnDefineSwitchADAM = value => {
////        if (!value) {
////            props.form.resetFields([Step5Fields.ADAMRawDatasetLoc, Step5Fields.ADAMStandardDatasetLoc2, Step5Fields.ADAMDefineOutputType]);
////            props.handleADAM();
////        } else {
////            props.form.setFieldsValue({ ADAMStandardDatasetLoc2: getFieldValue(Step5Fields.ADAMStandardDatasetLoc1) })
////        }
////    }
////    const fnADAMtandardDatasetLoc1Change = e => {
////        if (getFieldValue(Step5Fields.ADAMDefineRequired)) {
////            props.form.setFieldsValue({ ADAMStandardDatasetLoc2: e })
////        }
////    }




////    const step5 = (
////        <div id="study_step2">
////            <Row style={rowStyle} >
////                <span style={{ fontSize: '14px', color: '#1890ff' }}>MAPPING</span>
////                <Divider />
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Do You want to perform mapping for ADAM ?" key={"annotateSwitchItem"}>               {/* ADAM mapping Field */}
////                        {getFieldDecorator(Step5Fields.ADAMMappingRequried, {
////                            valuePropName: 'checked',
////                            rules: getRules(mappingSwitchADAM, props),
////                            initialValue: false
////                        })(
////                            <Switch
////                            name="ADAMSwitch"
////                            onChange={(e) => fnADAMSwitch(e)}

////                            />,
////                        )}
////                    </FormItem>
////                </Col>
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Standardized SDTM Dataset Location">                                                 {/* Raw Dataset Location for ADAM Field */}
////                        {getFieldDecorator(Step5Fields.ADAMRawDatasetLoc, {
////                            rules: getRules(rawDatasetFieldADAM, props),
////                            initialValue: props.sdtmEnabled ? adamDatasetLoc : null
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

////                    <FormItem label="Output Standardized Dataset Location">                                                                    {/* Standardized Dataset Field */}
////                        {getFieldDecorator(Step5Fields.ADAMStandardDatasetLoc1, {
////                            rules: getRules(rawDatasetFieldADAM, props),
////                            initialValue: ''
////                        })(
////                            <TreeSelect
////                                onChange={(e) => fnADAMtandardDatasetLoc1Change(e)}
////                                disabled={!adamMappingEnabled}
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
////                    <FormItem label="Do You want to create define XML for ADAM?">               {/* create define XML Field */}
////                        {getFieldDecorator(Step5Fields.ADAMDefineRequired, {
////                            valuePropName: 'checked',
////                            rules: getRules(defineSwitch, props),
////                            initialValue: false
////                        })(
////                            <Switch
////                            key={'ADAMdefineSwitch'}
////                            onChange={(e) => fnDefineSwitchADAM(e)}
////                            name="XMLSwitchADAM"
////                            />,
////                        )}
////                    </FormItem>
////                </Col>
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Define Output Type">                                                                    {/* Define Output Type Field */}
////                        {getFieldDecorator(Step5Fields.ADAMDefineOutputType, {
////                            rules: getRules(DefineOutputTypeField, props),
////                            initialValue: ''
////                        })(

////                            <Select
////                                key={'ADAMDefineOutputType'}
////                                mode="single"
////                                disabled={!ADAMdefineXMlEnabled}
////                                aria-name="Define Output Type ADAM"
////                            >
////                                {defineOutputOptions}
////                            </Select>,
////                        )}
////                    </FormItem>
////                </Col>
////            </Row>
////            <Row style={rowStyle} justify="space-between">              
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Standardized Dataset Location">                                                                    {/* Standardized Dataset Field */}
////                        {getFieldDecorator(Step5Fields.ADAMStandardDatasetLoc2, {
////                            rules: getRules(StandardizedDatasetLocationField, props),
////                            initialValue: ''
////                        })(
////                            <TreeSelect
////                            disabled={(!ADAMdefineXMlEnabled || (adamMappingEnabled && (getFieldValue(Step5Fields.ADAMStandardDatasetLoc1) != "" &&
////                                getFieldValue(Step5Fields.ADAMStandardDatasetLoc1) != undefined)))}
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
////    return step5;
////}