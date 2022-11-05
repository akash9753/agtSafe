import React from 'react';
import { Form, Row, Col, Button, TreeSelect, Switch, Select, Popconfirm, Divider } from 'antd';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import { getRules } from '../Utility/htmlUtility';
import ReactTable from '../Utility/reactTable';
import '../Utility/browse.css';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import Title from 'antd/lib/skeleton/Title';

var disableOMOPLoc = false;
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
const splitClass = 12;
const margin = {
    margin: '0 5px 0 0'
};

export const OMOPFields = {
    OMOPMappingRequried: "OMOPMappingRequried",
    OMOPRawDatasetLoc: "OMOPRawDatasetLoc",
    OMOPStandardDatasetLoc1: "OMOPStandardDatasetLoc1",
    OMOPMappingOutput: "OMOPMappingOutput"
};


export function OMOPStep(props) {
    const { getFieldValue } = props.form;

    if (props.allData === null) {
        return <div />;
    }
    const {  xptlocationTreeData, omopEnabled, rawDatasetTreeData } = props;
    const { getFieldDecorator, getFieldsValue } = props.form;

    const omopMappingEnabled = getFieldsValue([OMOPFields.OMOPMappingRequried])[OMOPFields.OMOPMappingRequried] !== undefined && getFieldsValue([OMOPFields.OMOPMappingRequried])[OMOPFields.OMOPMappingRequried];

    const mappingSwitchOMOP = {
        controlTypeText: "Switch",
        inputTypeText: "Switch",
        inputRequirementText: "Optional",
        inputTypeErrorMessage: "",
        validationErrorMessage: "",
        requirementErrorMessage: "",
        regExText: null,
        minValue: null,
        maxValue: null
    };

    const rawDatasetFieldOMOP = {
        controlTypeText: "FileSelect",
        inputTypeText: "ServerBrowse",
        inputRequirementText: omopEnabled && omopMappingEnabled  ? "Mandatory" : "Optional",
        inputTypeErrorMessage: "",
        validationErrorMessage: "",
        requirementErrorMessage: "Raw Dataset location for OMOP should be selected",
        regExText: null,
        minValue: null,
        maxValue: null
    };


    const MappingOutputTypeField = {
        controlTypeText: "DropDownWithSearch",
        inputTypeText: "Alphanumeric",
        inputRequirementText: omopEnabled && omopMappingEnabled ? "Mandatory" : "Optional",
        inputTypeErrorMessage: "",
        validationErrorMessage: "",
        requirementErrorMessage: "Mapping Output Type should be selected",
        regExText: null,
        minValue: null,
        maxValue: null
    };


    const fnOMOPStandardDatasetLoc1Change = e => {
        if (getFieldValue(OMOPFields.OMOPDefineRequired)) {
            props.form.setFieldsValue({ OMOPStandardDatasetLoc2: e })
        }
    }

    const fnOMOPSwitch = value => {
        if (!value) {
            props.form.resetFields([OMOPFields.OMOPRawDatasetLoc, OMOPFields.OMOPStandardDatasetLoc1])
        }
    }

    const OMOP = (
        <div id="study_step2">
            <Row style={rowStyle} justify="space-between">
                <span style={{ fontSize: '14px', color: '#1890ff' }}>MAPPING</span>
                <Divider />
                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                    <FormItem label="Do you want to perform OMOP mapping?" key={"annotateSwitchItem"}>               {/* OMOP mapping Field */}
                        {getFieldDecorator(OMOPFields.OMOPMappingRequried, {
                            valuePropName: 'checked',
                            rules: getRules(mappingSwitchOMOP, props),
                            initialValue: false
                        })(
                            <Switch
                                disabled={!omopEnabled}
                                name="OMOPSwitch"
                                onChange={(e) => fnOMOPSwitch(e)}
                            />,
                        )}
                    </FormItem>
                    <FormItem label="Mapping Program Language">                                                                    {/* Mapping Output Type Field */}
                        {getFieldDecorator(OMOPFields.OMOPMappingOutput, {
                            rules: getRules(MappingOutputTypeField, props),
                            initialValue: omopEnabled && omopMappingEnabled  ? '1' : ''
                        })(

                            <Select
                                key={'omopMappingOutputType'}
                                mode="single"
                                disabled={!omopMappingEnabled}
                                aria-name="Mapping Output Type SDTM"
                            >
                                <Option name="Mapping Output Type SDTM_Option" key={"1"}>
                                    Python
                                </Option>
                                <Option name="Mapping Output Type SDTM_Option" key={"2"}>
                                    SAS
                                </Option>
                            </Select>,
                        )}
                    </FormItem>
                </Col>
                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                    <FormItem label="Raw Dataset Location for OMOP">                                                   {/* Raw Dataset Location for OMOP Field */}
                        {getFieldDecorator(OMOPFields.OMOPRawDatasetLoc, {
                            rules: getRules(rawDatasetFieldOMOP, props),
                            initialValue: ''
                        })(
                            <TreeSelect
                                tabIndex={0}
                                showSearch
                                autoBlur
                                mode="single"
                                allowClear
                                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                                placeholder="Please Select"
                                disabled={!omopMappingEnabled}
                            >
                                {rawDatasetTreeData}
                            </TreeSelect>
                        )}
                    </FormItem>
                    <FormItem label="Output Standardized OMOP Dataset Location">                                       {/* Standardized Dataset Field */}
                        {getFieldDecorator(OMOPFields.OMOPStandardDatasetLoc1, {
                            rules: getRules(rawDatasetFieldOMOP, props),
                            initialValue: ''
                        })(
                            <TreeSelect
                                onChange={(e) => fnOMOPStandardDatasetLoc1Change}
                                disabled={!omopMappingEnabled}
                                tabIndex={0} 
                                showSearch
                                autoBlur
                                mode="single"
                                allowClear
                                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                                placeholder="Please Select"
                            >
                                {xptlocationTreeData}
                            </TreeSelect>
                        )}
                    </FormItem>
                </Col>


            </Row>
        </div>
    );
    return OMOP;
}