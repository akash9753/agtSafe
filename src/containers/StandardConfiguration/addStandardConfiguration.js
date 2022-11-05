import React, { Component, Children } from 'react';
import { Breadcrumb, Col, Row, Select, Form, Input, TreeSelect } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import Button from '../../components/uielements/button';
import { getRules } from '../Utility/htmlUtility';
import { CallServerPost, errorModal, successModal, getProjectRole, getAddButtonText } from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import SingleForm from '../Utility/SingleForm';
import { errorMessageTooltip } from '../Utility/errorMessageUtility.js';

const projectRole = getProjectRole();
const Option = Select.Option;
const { TreeNode } = TreeSelect;
const FormItem = Form.Item;
var thisObj;

class AddStandardConfiguration extends Component {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            standardData: [],
            defineOutputVersion: [],
            standardElement: [],
            standardAttribute: []
        };

        thisObj = this;

        CallServerPost('StandardConfiguration/GetStandardConfigurationFormData', { FormName: "StandardConfiguration", ActionName: "Create" }).then(
            function (response) {
                const responseData = response.value;
                if (response.status === 1) {
                    thisObj.setState({
                        standardData: responseData.selectOptions.standarddataid,
                        defineOutputVersion: responseData.selectOptions.defineoutputversionid
                    });
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

    clear = () => {
        this.props.form.resetFields();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const thisObj = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values["TimeZone"] = "IST";
                values["UpdatedBy"] = projectRole.userProfile.userID;

                CallServerPost('StandardConfiguration/Create', values)
                    .then(
                        function (response) {
                            if (response.status == 1) {
                                successModal(response.message, thisObj.props, "/trans/StandardConfiguration");
                            } else {
                                errorModal(response.message);
                            }
                        }).catch(error => error);
            }
        });
    }

    componentDidUpdate() {
        errorMessageTooltip(this.props);
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

    render() {
        const { getFieldDecorator, setFieldsValue, getFieldValue } = this.props.form;
        const { standardAttribute, standardData, standardElement, defineOutputVersion } = this.state;

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
                        Add
                    </Breadcrumb.Item>
                </Breadcrumb>
                <LayoutContent style={{ wordBreak: 'break-all' }}>
                    <Form layout="vertical">
                        <Row style={rowStyle} >
                            <Col md={12} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="Standard">
                                    {getFieldDecorator('CDISCDataStandardID', {
                                        rules: getRules(StandardField, this.props),
                                        initialValue: "--Select--"
                                    })(
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {standardData.length > 0 && standardData.map(option => (
                                                <Option key={option.keyValue}>
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
                                        initialValue: "--Select--"
                                    })(
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onSelect={this.LoadStandardElement}
                                            disabled={getFieldValue('CDISCDataStandardID') !== "--Select--" ? false : true}
                                        >
                                            {defineOutputVersion.length > 0 && defineOutputVersion.map(option => (
                                                <Option key={option.keyValue}>
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
                                        initialValue: "--Select--"
                                    })(
                                        <TreeSelect
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            onChange={this.selectStandardElement}
                                            disabled={getFieldValue('CDISCDataStdVersionID') !== "--Select--" && getFieldValue('CDISCDataStandardID') !== "--Select--" ? false : true}
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
                                        initialValue: "--Select--"
                                    })(
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            disabled={getFieldValue('StandardElementID') !== "--Select--" ? false : true}
                                        >
                                            {standardAttribute.length > 0 && standardAttribute.map(option => (
                                                <Option key={option.standardAttributeID}>
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
                                        initialValue: ""
                                    })(
                                        <Input />,
                                    )}
                                </FormItem>
                            </Col>
                            <Col md={12} sm={6} xs={6}>
                                <FormItem label="Column" >
                                    {getFieldDecorator('ColumnName', {
                                        rules: getRules(ColumnField, this.props),
                                        initialValue: ""
                                    })(
                                        <Input />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row><Row style={rowStyle} >
                            <Col md={12} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="Condition">
                                    {getFieldDecorator('Condition', {
                                        rules: getRules(ConditionField, this.props),
                                        initialValue: ""
                                    })(
                                        <Input />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={rowStyle}>
                            <Col md={24} sm={24} xs={24}>
                                <Button type="danger" style={{ marginRight: 10, float: "left" }} onClick={this.cancel}> Cancel </Button>
                                <Button className='ant-btn sc-ifAKCX fcfmNQ ant-btn-default' style={{ float: 'left' }} onClick={this.clear}>Clear</Button>
                                <Button type="primary" className='ant-btn sc-ifAKCX fcfmNQ saveBtn' style={{ float: "right" }} onClick={this.handleSubmit} >{getAddButtonText()}</Button>
                            </Col>
                        </Row>
                    </Form>
                </LayoutContent>
            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(AddStandardConfiguration);

export default WrappedApp;