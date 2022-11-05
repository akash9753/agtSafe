////import React from 'react';
////import { Form, Row, Col, Button, TreeSelect, Switch, Select, Popconfirm, Divider } from 'antd';
////import { rowStyle } from '../../styles/JsStyles/CommonStyles';
////import { getRules } from '../Utility/htmlUtility';
////import ReactTable from '../Utility/reactTable';
////import '../Utility/browse.css';
////import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
////import Title from 'antd/lib/skeleton/Title';

////var disableSDTMLoc = false;
////const FormItem = Form.Item;
////const TreeNode = TreeSelect.TreeNode;
////const Option = Select.Option;
////const splitClass = 12;
////const margin = {
////    margin: '0 5px 0 0'
////};

////export const Step4Fields = {
////    AnnotationRequired: "SDTMAnnotationRequired",
////    CRFDocument: "SDTMCRFDocument",
////    SDTMMappingRequried: "SDTMMappingRequried",
////    SDTMRawDatasetLoc: "SDTMRawDatasetLoc",
////    SDTMStandardDatasetLoc1: "SDTMStandardDatasetLoc1",
////    SDTMDefineRequired: "SDTMDefineRequired",
////    SDTMStandardDatasetLoc2: "SDTMStandardDatasetLoc2",
////    SDTMDefineOutputType: "SDTMDefineOutputType",
////    SDTMStudyRelatedDocument: "SDTMStudyRelatedDocument",
////    SDTMMappingOutput: "SDTMMappingOutput"
////};


////export function Step4(props) {
////    const { getFieldValue } = props.form;

////    if (props.allData === null) {
////        return <div />;
////    }
////    const { pdfDocumentData, xptlocationTreeData, allData, docDataSource, sdtmEnabled, rawDatasetTreeData, sdtmDocDataSource } = props;
////    const { getFieldDecorator, getFieldsValue } = props.form;
////    const cfrRequirement = props.sdtmEnabled;

////    //const cfrRequirement = getFieldsValue(['StandardName']).StandardName !== undefined && getFieldsValue(['StandardName']).StandardName.indexOf('SDTM') > -1;

////    const treeLoop = (data, folderOnly, isMappingElabled) =>
////        data.map(item => {
////            if (item.props.children !== undefined && item.props.children.length > 0) {
////                if (item.props.title !== undefined && item.props.title.indexOf(".pdf") === -1 &&
////                    item.props.title.indexOf(".xlsx") === -1 && item.props.title.indexOf(".docx") === -1) {
////                    return (
////                        <TreeNode selectable={folderOnly} key={item.key} value={item.key} title={item.props.title}>
////                            {treeLoop(item.props.children, folderOnly, isMappingElabled)}
////                        </TreeNode>
////                    );
////                }
////            }
////            else {
////                var selectable = true;
////                if (folderOnly && !item.folder) {
////                    selectable = false;
////                }
////                if (isMappingElabled) {
////                    if (item.props.title !== undefined && item.props.title.indexOf(".pdf") === -1 &&
////                        item.props.title.indexOf(".xlsx") === -1 && item.props.title.indexOf(".docx") === -1) {
////                        return <TreeNode selectable={selectable} key={item.key} value={item.key} title={item.props.title} />;
////                    }
////                } else {
////                    if (item.props.title !== undefined && item.props.title.indexOf(".") !== -1 && item.props.title.indexOf(".pdf") === -1 &&
////                        item.props.title.indexOf(".xlsx") === -1 && item.props.title.indexOf(".docx") === -1) {
////                        return <TreeNode selectable={selectable} key={item.key} value={item.key} title={item.props.title} />;
////                    }
////                }
////            }
////        });

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

////    const sdtmMappingEnabled = getFieldsValue([Step4Fields.SDTMMappingRequried])[Step4Fields.SDTMMappingRequried] !== undefined && getFieldsValue([Step4Fields.SDTMMappingRequried])[Step4Fields.SDTMMappingRequried];
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

////    const outputStandardizedSDTM = {
////        controlTypeText: "FileSelect",
////        inputTypeText: "ServerBrowse",
////        inputRequirementText: sdtmEnabled && sdtmMappingEnabled ? "Mandatory" : "Optional",
////        inputTypeErrorMessage: "",
////        validationErrorMessage: "",
////        requirementErrorMessage: "Output Standardized SDTM Dataset Location should be selected",
////        regExText: null,
////        minValue: null,
////        maxValue: null
////    };

////    const MappingOutputTypeField = {
////        controlTypeText: "DropDownWithSearch",
////        inputTypeText: "Alphanumeric",
////        inputRequirementText: sdtmEnabled && sdtmMappingEnabled ? "Mandatory" : "Optional",
////        inputTypeErrorMessage: "",
////        validationErrorMessage: "",
////        requirementErrorMessage: "Mapping Program Language should be selected",
////        regExText: null,
////        minValue: null,
////        maxValue: null
////    };

////    const sdtmdefineXMlEnabled = getFieldsValue([Step4Fields.SDTMDefineRequired])[Step4Fields.SDTMDefineRequired] !== undefined && getFieldsValue([Step4Fields.SDTMDefineRequired])[Step4Fields.SDTMDefineRequired];
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
////        inputRequirementText: sdtmdefineXMlEnabled ? "Mandatory":"Optional",
////        inputTypeErrorMessage: "",
////        validationErrorMessage: "",
////        requirementErrorMessage: "Standardized SDTM Dataset Location should be selected",
////        regExText: null,
////        minValue: null,
////        maxValue: null
////    };

////    const DefineOutputTypeField = {
////        controlTypeText: "DropDownWithSearch",
////        inputTypeText: "Alphanumeric",
////        inputRequirementText: sdtmdefineXMlEnabled ? "Mandatory" : "Optional",
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
////    //            onClick={() => props.editDoc('SDTM',index)}
////    //        />
////    //        <Popconfirm
////    //            className="PopoverConfirm"
////    //            title="Are you sure？"
////    //            okText={<span name="PopoverYes">yes</span>}
////    //            cancelText={<span name="PopoverNo">No</span>}
////    //            onConfirm={() => props.editDoc('SDTM', index, true)}
////    //        >
////    //            <ButtonWithToolTip
////    //                name={docDetail.Title + "_Delete"}
////    //                tooltip="Delete"
////    //                shape="circle"
////    //                classname="fas fa-trash-alt"
////    //                size="small"
////    //                style={margin}
////    //                />
////    //        </Popconfirm>
////    //    </div>);
////    //    return {
////    //        key: docDetail.Title+index,
////    //        Title: docDetail.Title,
////    //        DestinationType: docDetail.DestinationType,
////    //        DocumentType: docDetail.DocumentType,
////    //        FileLocation: docDetail.FileLocation,
////    //        actions: editCell
////    //    };
////    //});

    

////    const defineOutputOptions = allData["defineOutputType"].map(function (option) {
////        return (
////            <Option name="Define Output Type SDTM_Option" key={option['productcontrolledTermID']}>
////                {option['shortValue']}
////            </Option>
////        );

////    });
////    const fnSDTMSwitch = value => {
////        if (!value) {
////            props.form.resetFields([Step4Fields.SDTMRawDatasetLoc, Step4Fields.SDTMStandardDatasetLoc1, Step4Fields.SDTMStandardDatasetLoc2, Step4Fields.SDTMMappingOutput])
////            props.form.validateFields([Step4Fields.SDTMDefineOutputType, Step4Fields.SDTMStandardDatasetLoc2])

////        }
////    }
////    const fnDefineSwitch = value => {
////        if (!value) {
////            props.form.resetFields([Step4Fields.SDTMStandardDatasetLoc2, Step4Fields.SDTMDefineOutputType]);
////            props.handleSDTM();
////        } else{
////            props.form.setFieldsValue({ SDTMStandardDatasetLoc2:getFieldValue(Step4Fields.SDTMStandardDatasetLoc1) })
////        }
////    }
////    const fnSDTMStandardDatasetLoc1Change = e => {
////        if (getFieldValue(Step4Fields.SDTMDefineRequired)) {
////            props.form.setFieldsValue({ SDTMStandardDatasetLoc2: e })
////        }
////    }
    
////    //const mappingEnabled = (checked, event) => {
////    //    disableSDTMLoc = checked;
////    //    if (!checked) {
////    //        props.form.resetFields("SDTMRawDatasetLoc");
////    //    }
////    //}

////    const step4 = (
////        <div id="study_step2">
////            <Row style={rowStyle} justify="space-between">
////                <span style={{ fontSize: '14px', color: '#1890ff' }}>CRF</span>
////                <Divider />
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Do you want to annotate the document?" key={"annotateSwitchItem"}>               {/* Annotate the document Field */}
////                        {getFieldDecorator(Step4Fields.AnnotationRequired, {
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
////                        {getFieldDecorator(Step4Fields.CRFDocument, {
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
////            <Row style={rowStyle} justify="space-between">
////                <span style={{ fontSize: '14px', color: '#1890ff' }}>MAPPING</span>
////                <Divider />
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Do you want to perform SDTM mapping?" key={"annotateSwitchItem"}>               {/* SDTM mapping Field */}
////                        {getFieldDecorator(Step4Fields.SDTMMappingRequried, {
////                            valuePropName: 'checked',
////                            rules: getRules(mappingSwitchSDTM, props),
////                            initialValue: false
////                        })(
////                            <Switch
////                            disabled={!sdtmEnabled}
////                            name="SDTMSwitch"
////                            onChange={(e) => fnSDTMSwitch(e)}

////                            //onChange={mappingEnabled}
////                            />,
////                        )}
////                    </FormItem>
                    
////                    <FormItem label="Mapping Program Language">                                                                    {/* Mapping Output Type Field */}
////                        {getFieldDecorator(Step4Fields.SDTMMappingOutput, {
////                            rules: getRules(MappingOutputTypeField, props),
////                            initialValue: sdtmEnabled && sdtmMappingEnabled  ? '1' : ''
////                        })(

////                            <Select
////                                key={'sdtmMappingOutputType'}
////                                mode="single"
////                                disabled={!sdtmMappingEnabled}
////                                aria-name="Mapping Output Type SDTM"
////                            >
////                                <Option name="Mapping Output Type SDTM_Option" key={"1"}>
////                                    Python
////                                </Option>
////                                <Option name="Mapping Output Type SDTM_Option" key={"2"}>
////                                    SAS
////                                </Option>
////                            </Select>,
////                        )}
////                    </FormItem>
                   
////                </Col>
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Raw Dataset Location for SDTM">                                                   {/* Raw Dataset Location for SDTM Field */}
////                        {getFieldDecorator(Step4Fields.SDTMRawDatasetLoc, {
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
////                    <FormItem label="Output Standardized SDTM Dataset Location">                                                                    {/* Standardized Dataset Field */}
////                        {getFieldDecorator(Step4Fields.SDTMStandardDatasetLoc1, {
////                            rules: getRules(outputStandardizedSDTM, props),
////                            initialValue: ''
////                        })(
////                            <TreeSelect
////                                onChange={(e) => fnSDTMStandardDatasetLoc1Change(e)}
////                                disabled={!sdtmMappingEnabled }
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
////                    <FormItem label="Do you want to create define XML for SDTM?">               {/* create define XML Field */}
////                        {getFieldDecorator(Step4Fields.SDTMDefineRequired, {
////                            valuePropName: 'checked',
////                            rules: getRules(defineSwitch, props),
////                            initialValue: false
////                        })(
////                           <Switch
////                            key={'sdtmdefineSwitch'}
////                            name="XMLSwitchSDTM"
////                            onChange={(e) => fnDefineSwitch(e)}

////                            />, 
////                        )}
////                    </FormItem>
////                </Col>
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Define Output Type">                                                                    {/* Define Output Type Field */}
////                        {getFieldDecorator(Step4Fields.SDTMDefineOutputType, {
////                            rules: getRules(DefineOutputTypeField, props),
////                            initialValue: ''
////                        })(
                           
////                            <Select
////                                key={'sdtmDefineOutputType'}
////                                mode="single"
////                                disabled={!sdtmdefineXMlEnabled} 
////                                aria-name="Define Output Type SDTM"
////                            >
////                                {defineOutputOptions}
////                            </Select>,
////                        )}
////                    </FormItem>
////                </Col>
////            </Row>
////            <Row style={rowStyle} justify="space-between">
////                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
////                    <FormItem label="Standardized SDTM Dataset Location">                                                                    {/* Standardized Dataset Field */}
////                        {getFieldDecorator(Step4Fields.SDTMStandardDatasetLoc2, {
////                            rules: getRules(StandardizedDatasetLocationField, props),
////                            initialValue: ''
////                        })(
////                            <TreeSelect
////                            disabled={(!sdtmdefineXMlEnabled || (sdtmMappingEnabled && (getFieldValue(Step4Fields.SDTMStandardDatasetLoc1) != "" &&
////                                      getFieldValue(Step4Fields.SDTMStandardDatasetLoc1) != undefined)))}
////                                tabIndex={0}
////                                showSearch
////                                autoBlur
////                                mode="single"
////                                allowClear
////                                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
////                                placeholder="Please Select"
////                            >
////                                {treeLoop(xptlocationTreeData[0].props.children, true, props.form.getFieldValue("SDTMMappingRequried"))}
////                            </TreeSelect>
////                        )}
////                    </FormItem>
////                </Col>
////            </Row>
            
////        </div>
////    );
////    return step4;
////}