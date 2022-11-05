import React, { Component, Children } from 'react';
import { Breadcrumb, Col, Row, Select, Form, Input, TreeSelect } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import Button from '../../components/uielements/button';
import { getRules } from '../Utility/htmlUtility';
import { CallServerPost, errorModal, successModal, getProjectRole, getSaveButtonText, getTimeZone, PostCallWithZone } from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import SingleForm from '../Utility/SingleForm';
import ConfirmModal from '../Utility/ConfirmModal';
import { errorMessageTooltip } from '../Utility/errorMessageUtility.js';

const projectRole = getProjectRole();
const Option = Select.Option;
const { TreeNode } = TreeSelect;
const FormItem = Form.Item;
var thisObj;

class EditStandardConfiguration extends Component {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            standardConfigurationID: this.props.location.state.StandardConfigurationID,
            showModal: false,
            standardData: [],
            defineOutputVersion: [],
            standardElement: [],
            standardAttribute: [],
            allValues: {},
            modalLoad: false,
            standardConfigurationValues: null,
            responseData: {}
        };

        thisObj = this;
        let standardConfigurationID = thisObj.props.location.state.StandardConfigurationID;
        CallServerPost('StandardConfiguration/GetStandardConfigurationFormData', { FormName: "StandardConfiguration", ActionName: "Update", ID: standardConfigurationID, Editable: this.props.location.state.readOnly }).then(
            function (response) {
                const responseData = response.value;
                if (response.status === 1) {
                    thisObj.setState({
                        standardData: responseData.selectOptions.standarddataid,
                        defineOutputVersion: responseData.selectOptions.defineoutputversionid,
                        standardConfigurationValues: responseData.standardConfigurationValues,
                        responseData: responseData
                    });
                    thisObj.onLoadStandardElement(responseData.standardConfigurationValues.cdiscDataStandardID, responseData.standardConfigurationValues.cdiscDataStdVersionID);
                    thisObj.onLoadStandardAttribute(responseData.standardConfigurationValues.standardElementID);
                } else {
                    errorModal(responseData.message);
                }

            }).catch(error => error);

    }

    cancel = () => {
        this.props.form.resetFields();
        this.props.history.push({
            pathname: '/trans/StandardConfiguration'
        });
    }

    handleUpdate = (ChangeReason) => {
        const thisObj = this;
        let values = thisObj.state.allValues;
        values["ChangeReason"] = ChangeReason;
        values["StandardConfigurationID"] = thisObj.state.standardConfigurationID;
        values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;
        thisObj.setState({ modalLoad: true });
        PostCallWithZone('StandardConfiguration/Update', values)
            .then(
                function (response) {                    
                    if (response.status == 1) {
                        thisObj.setState({ modalLoad: false });
                        successModal(response.message, thisObj.props, "/trans/StandardConfiguration");
                    } else {
                        thisObj.setState({ modalLoad: false });
                        errorModal(response.message);
                    }
                }).catch(error => error);

    }

    handleSubmit = (e) => {
        const thisObj = this;
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                thisObj.setState({ showModal: true, allValues: values });
            }
        });
    }

    handleCancel = () => {
        this.setState({ showModal: false });
        this.props.form.resetFields(['Change Reason']);

    }

    onLoadStandardElement = (stdID, stdVersionID) => {
        const thisObj = this;

        const loop = data =>
            data.map(item => {
                if (item.children) {
                    return (
                        <TreeNode key={item.key} value={item.key} title={<p>{item.title}</p>}>
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={item.key} value={item.key} title={<p>{item.title}</p>} />;
            });
        
        
            CallServerPost('StandardConfiguration/TreeBasedOnVersion', { CDISCDataStandardID: stdID, CDISCDataStdVersionID: stdVersionID })
                .then(
                    function (response) {
                        if (response.status == 1) {
                            thisObj.setState({ standardElement: [loop([response.value["folderTree"]])] });
                        } else {
                            thisObj.setState({ standardElement: [] });
                        }
                    }).catch(error => error);
    }

    onLoadStandardAttribute = (id) => {
        CallServerPost('StandardConfiguration/GetStandardAttribute_By_StandardElementID', { StandardElementID: id })
            .then(
                function (response) {
                    if (response.status == 1) {
                        thisObj.setState({ standardAttribute: response.value });
                    } else {
                        thisObj.setState({ standardAttribute: [] });
                    }
                }).catch(error => error);
    }

    LoadStandardElement = (key, Option) => {
        const thisObj = this;
        thisObj.props.form.setFieldsValue({
            'StandardElementID': '--Select--',
            'StandardAttributeID': '--Select--'
        });
        const loop = data =>
            data.map(item => {
                if (item.children) {
                    return (
                        <TreeNode key={item.key} value={item.key} title={<p>{item.title}</p>}>
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={item.key} value={item.key} title={<p>{item.title}</p>} />;
            });

        let standardDataID = thisObj.props.form.getFieldValue("CDISCDataStandardID");
        if (Option.props.children !== "--Select--" && standardDataID !== "--Select--") {
            CallServerPost('StandardConfiguration/TreeBasedOnVersion', { CDISCDataStandardID: standardDataID, CDISCDataStdVersionID: key })
                .then(
                    function (response) {
                        if (response.status == 1) {
                            thisObj.setState({ standardElement: [loop([response.value["folderTree"]])] });
                        } else {
                            thisObj.setState({ standardElement: [] });
                        }
                    }).catch(error => error);
        }
    }

    selectStandardElement = (e) => {
        thisObj.props.form.setFieldsValue({
            'StandardAttributeID': '--Select--'
        });
        CallServerPost('StandardConfiguration/GetStandardAttribute_By_StandardElementID', { StandardElementID: e })
            .then(
                function (response) {
                    if (response.status == 1) {
                        thisObj.setState({ standardAttribute: response.value });
                    } else {
                        thisObj.setState({ standardAttribute: [] });
                    }
                }).catch(error => error);
    }

    componentDidUpdate() {
        errorMessageTooltip(this.props);
    }

    render() {
        const { getFieldDecorator, setFieldsValue, getFieldValue } = this.props.form;
        const { standardAttribute, standardData, standardElement, defineOutputVersion, standardConfigurationValues } = this.state;

        const StandardField = {
            controlTypeText: "DropDown",
            inputRequirementText: "Mandatory",
            requirementErrorMessage: "Standard should be selected"
        };

        const DefineOutputVersionField = {
            controlTypeText: "DropDown",
            inputRequirementText: "Mandatory",
            requirementErrorMessage: "Define Output Version should be selected"
        };

        const StandardElementField = {
            controlTypeText: "DropDown",
            inputRequirementText: "Mandatory",
            requirementErrorMessage: "Standard Element should be selected"
        };

        const StandardAttributeField = {
            controlTypeText: "DropDown",
            inputRequirementText: "Mandatory",
            requirementErrorMessage: "Standard Attribute should be selected"
        };

        const ModelField = {
            controlTypeText: "TextBox",
            inputTypeText: "Alpha",
            inputRequirementText: "Mandatory",
            requirementErrorMessage: "Model is mandatory",
            inputTypeErrorMessage: "Model should contain only alphabets",
            validationErrorMessage: "Model should be between 2-255 characters",
            regExText: "/^(?!.*  )[a-zA-Z ]*$/",
            minValue: 2,
            maxValue: 255
        };

        const ColumnField = {
            controlTypeText: "TextBox",
            inputTypeText: "Alpha",
            inputRequirementText: "Mandatory",
            requirementErrorMessage: "Column Name is mandatory",
            inputTypeErrorMessage: "Column Name should contain only alphabets",
            validationErrorMessage: "Column Name should be between 2-255 characters",
            regExText: "/^(?!.*  )[a-zA-Z ]*$/",
            minValue: 2,
            maxValue: 255
        };

        const ConditionField = {
            controlTypeText: "TextBox",
            inputTypeText: "ALLInputsAccepted",
            inputRequirementText: "Mandatory",
            requirementErrorMessage: "Condition is mandatory",
            inputTypeErrorMessage: "Condition should contain only alphanumeric values and special characters(_@!`%*()=${};:<>.'\/#&+-?)",
            validationErrorMessage: "Condition should be between 2-255 characters",
            regExText: "/^(?!.*  )[ A-Za-z0-9_@!`%*()=${};:<>'.\/#&+-?]+$/g",
            minValue: 2,
            maxValue: 255
        };

        return (
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-dice-d20" />
                        <span> Standard Configuration</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Edit
                    </Breadcrumb.Item>
                </Breadcrumb>
                <LayoutContent style={{ wordBreak: 'break-all' }}>
                    <Form layout="vertical">
                        <Row style={rowStyle} >
                            <Col md={12} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="Standard">
                                    {getFieldDecorator('CDISCDataStandardID', {
                                        rules: getRules(StandardField, this.props),
                                        initialValue: standardConfigurationValues && standardConfigurationValues.cdiscDataStandardID !== null ? standardConfigurationValues.cdiscDataStandardID.toString() : "--Select--" 
                                    })(
                                        <Select
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        disabled={this.props.location.state.readOnly === true ? true : false}
                                        >
                                            {standardData.length > 0 && standardData.map(option => (
                                                <Option key={option.keyValue} value={option.keyValue}>
                                                    {option.literal}
                                                </Option>
                                            ))}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col md={12} sm={6} xs={6}>
                                <FormItem label="Define Output Version" >
                                    {getFieldDecorator('CDISCDataStdVersionID', {
                                        rules: getRules(DefineOutputVersionField, this.props),
                                        initialValue: standardConfigurationValues && standardConfigurationValues.cdiscDataStdVersionID !== null ? standardConfigurationValues.cdiscDataStdVersionID.toString() : "--Select--"
                                    })(
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onSelect={this.LoadStandardElement}
                                            disabled={this.props.location.state.readOnly === true ? (true) : (getFieldValue('CDISCDataStandardID') !== "--Select--" ? false : true)}
                                        >
                                            {defineOutputVersion.length > 0 && defineOutputVersion.map(option => (
                                                <Option key={option.keyValue} value={option.keyValue}>
                                                    {option.literal}
                                                </Option>
                                            ))}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={rowStyle} >
                            <Col md={12} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="Standard Element">
                                    {getFieldDecorator('StandardElementID', {
                                        rules: getRules(StandardElementField, this.props),
                                        initialValue: standardConfigurationValues && standardConfigurationValues.standardElementID !== null ? standardConfigurationValues.standardElementID.toString() : "--Select--"
                                    })(
                                        <TreeSelect
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            onChange={this.selectStandardElement}
                                            disabled={this.props.location.state.readOnly === true ? (true) : (getFieldValue('CDISCDataStdVersionID') !== "--Select--" && getFieldValue('CDISCDataStandardID') !== "--Select--" ? false : true)}
                                        >
                                            {standardElement.length > 0 ? standardElement : []}
                                        </TreeSelect>
                                    )}
                                </FormItem>
                            </Col>
                            <Col md={12} sm={6} xs={6}>
                                <FormItem label="Standard Attribute" >
                                    {getFieldDecorator('StandardAttributeID', {
                                        rules: getRules(StandardAttributeField, this.props),
                                        initialValue: standardConfigurationValues && standardConfigurationValues.standardAttributeID !== null ? standardConfigurationValues.standardAttributeID.toString() : "--Select--"
                                })(
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            disabled={this.props.location.state.readOnly === true ? (true) : (getFieldValue('StandardElementID') !== "--Select--" ? false : true)}
                                        >
                                            {standardAttribute.length > 0 && standardAttribute.map(option => (
                                            <Option key={option.standardAttributeID.toString()} value={option.standardAttributeID.toString()}>
                                                    {option.attributeName}
                                                </Option>
                                            ))}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row><Row style={rowStyle} >
                            <Col md={12} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="Model">
                                    {getFieldDecorator('Model', {
                                        rules: getRules(ModelField, this.props),
                                        initialValue: standardConfigurationValues && standardConfigurationValues.model !== null ? standardConfigurationValues.model : ""
                                    })(
                                        <Input disabled={this.props.location.state.readOnly === true ? true : false}/>,
                                    )}
                                </FormItem>
                            </Col>
                            <Col md={12} sm={6} xs={6}>
                                <FormItem label="Column" >
                                    {getFieldDecorator('ColumnName', {
                                        rules: getRules(ColumnField, this.props),
                                        initialValue: standardConfigurationValues && standardConfigurationValues.columnName !== null ? standardConfigurationValues.columnName : ""
                                    })(
                                        <Input disabled={this.props.location.state.readOnly === true ? true: false} />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row><Row style={rowStyle} >
                            <Col md={12} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="Condition">
                                    {getFieldDecorator('Condition', {
                                        rules: getRules(ConditionField, this.props),
                                        initialValue: standardConfigurationValues && standardConfigurationValues.condition !== null ? standardConfigurationValues.condition : ""
                                    })(
                                        <Input disabled={this.props.location.state.readOnly === true ? true : false} />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={rowStyle}>
                            <Col md={24} sm={24} xs={24}>
                                <Button type="danger" style={{ marginRight: 10, float: "left" }} onClick={this.cancel}> Cancel </Button>
                                {this.props.location.state.readOnly === false && <Button type="primary" className='ant-btn sc-ifAKCX fcfmNQ saveBtn' style={{ float: "right" }} onClick={this.handleSubmit} >{getSaveButtonText()}</Button>}
                            </Col>
                        </Row>
                        <ConfirmModal loading={this.state.modalLoad} title="Update Standard Configuration" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
                    </Form>
                </LayoutContent>
            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(EditStandardConfiguration);

export default WrappedApp;