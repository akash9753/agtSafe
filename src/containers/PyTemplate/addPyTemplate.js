import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { Breadcrumb, Form, Col, Row, Select, Input, Icon, Button, message } from 'antd';
import LayoutContent from '../../components/utility/layoutContent';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import { CallServerPost, errorModal, PostCallWithZone, successModal, getAddButtonText, getSaveButtonText } from '../Utility/sharedUtility';
import PyArguments from './arguments';
import ConfirmModal from '../Utility/ConfirmModal';
import { getRules } from '../Utility/htmlUtility';
import { errorMessageTooltip } from '../Utility/errorMessageUtility';

const Option = Select.Option;
const FormItem = Form.Item;

var pyArguments = [];
class AddPyTemplate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            programTemplateOptions: [],
            argumentsVisibility: false,
            argTypes: [],
            loading: this.props.location.state.pyTemplateID > 0,
            pyTemplateID: this.props.location.state.pyTemplateID,
            pyTemplate: null,
            showEditModal: false,
            modalLoading: false
        };   
        pyArguments = [];
       this.getList();        
    }

    clearFields = () => {
        pyArguments = [];
        this.props.form.resetFields();
    }

    getPyTemplate = (thisObj) => {
        CallServerPost('PyTemplate/GetPyTemplate', { PyTemplateID: thisObj.props.location.state.pyTemplateID})
            .then(
                function (response) {
                    if (response.value !== null) {
                        //console.log(response.value);
                        pyArguments = JSON.parse(response.value.arguments);
                        thisObj.setState({ pyTemplate: response.value, loading: false  });
                    } else {
                        message.destroy();
                        message.error('Python Template Not Found');
                        thisObj.props.history.push('/trans/PyTemplate');
                    }
                });
    }


    getList = () => {
        const thisObj = this;
        let values = {};
        values["ProgramTemplateID"] = thisObj.props.location.state.programTemplateID;
        CallServerPost('ProgramTemplate/GetAllForPython', values)
            .then(
                function (response) {
                    if (response.value !== null) {
                        const programTemplateList = response.value;
                        const options = programTemplateList.map(function (option) {
                            return (
                                <Option key={option["programTemplateID"]}>
                                    {option["label"]}
                                </Option>
                            )
                        });
                        thisObj.setState({ programTemplateOptions: options });
                        if (thisObj.props.location.state.pyTemplateID > 0) {
                            thisObj.getPyTemplate(thisObj);
                        }
                    }
                });
    }

    toogleArguments = (pyarguments) => {
        pyArguments = pyarguments;
        this.setState({ argumentsVisibility: !this.state.argumentsVisibility });
    }
    showArgumentModal = () => {
        const thisObj = this;
        if (this.state.argTypes.length === 0) {
            CallServerPost('ProductControlledTerm/GetProductControlledTermByTermName', { TermName: "MacroArgumentType"})
                .then(
                    function (response) {
                        if (response.value !== null) {
                            thisObj.setState({ argumentsVisibility: true, argTypes: response.value });
                        }
                    });
        } else {
            thisObj.setState({ argumentsVisibility: true });
        }
    }


    navBack = () => {
        this.props.history.push('/trans/PyTemplate');
    }

    saveMacro = () => {
        const thisObj = this;
        thisObj.props.form.validateFields((err, values) => {
            if (pyArguments.length === 0) {
                message.destroy();
                message.error('Please Add Arguments',3);
                err = true;
            } 
            if (!err) {
                const macroTemp = { Name: values["Name"], Status: parseInt(values["Status"]), Arguments: JSON.stringify(pyArguments)};
                PostCallWithZone('PyTemplate/Create', macroTemp)
                    .then(
                        function (response) {
                            if (response.status === 1) {
                                successModal(response.message, thisObj.props, "/trans/PyTemplate");
                            } else {
                                errorModal(response.message);
                            }
                        });
            }
        });
    }

    updateMacro = (changeReason) => {
        const thisObj = this;
        thisObj.props.form.validateFields((err, values) => {
            if (pyArguments.length === 0) {
                message.destroy();
                message.error('Please Add Arguments');
                err = true;
            } 
            if (!err) {
                const macroTemp = {
                    Name: values["Name"], Status: parseInt(values["Status"]), Arguments: JSON.stringify(pyArguments),
                    ChangeReason: changeReason, PyTemplateID: this.state.pyTemplateID,
                    UpdatedDateTimeText: thisObj.state.pyTemplate.updatedDateTimeText
                };
                
                PostCallWithZone('PyTemplate/Update', macroTemp)
                    .then(
                        function (response) {
                            if (response.status === 1) {
                                successModal(response.message, thisObj.props, "/trans/PyTemplate");
                            } else {
                                errorModal(response.message);
                                thisObj.handleEditCancel();
                            }
                        });
                
            }
        });
    }

    checkData = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (pyArguments.length === 0) {
                    message.destroy();
                    message.error('Please Add Arguments');
                } else {
                    this.handleEditCancel();
                } 
            }
        });
}

    handleEditCancel = () => {
        this.setState({ showEditModal: !this.state.showEditModal });
    }

    programTemplateChange = (key, Option) => {
        if (Option.props.children !== "--Select--") {
            this.props.form.setFieldsValue({
                'macroDisplayName': Option.props.children
            })
        }
    }

    componentDidUpdate() {
        errorMessageTooltip(this.props);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { argTypes, argumentsVisibility, pyTemplateID, pyTemplate } = this.state;
        let splitClass = 12;
        const argumentsError = pyArguments.length === 0;
        const displayNameField = {
            attributeName: "Name",
            displayName: "Name",
            defaultValue: pyTemplate !== null ? pyTemplate.name : "",
            controlTypeText:"",
            inputTypeText: "AlphaNumericUnderscore",
            inputRequirementText: "Mandatory",
            requirementErrorMessage: "Macro Display Name is mandatory",
            inputTypeErrorMessage: "PyTemplate Name should contain only alphanumeric values and underscore",
            validationErrorMessage: "PyTemplate Name should be between 2-25 characters",
            regExText: "/^[a-zA-Z0-9-_ ]+$/",
            minValue: 2,
            maxValue: 25
        };

        const statusField = {
            controlTypeText: "DropDown",
            inputRequirementText: "Mandatory",
            requirementErrorMessage: "Program Template should be selected"
        };

        const programField = {
            controlTypeText: "DropDown",
            inputRequirementText: "Mandatory",
            requirementErrorMessage: "Program Template should be selected"
        };

        return (
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-microchip" ></i>
                        <span>Python Template</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {pyTemplateID === 0 ? "Add" : "Edit" }
                    </Breadcrumb.Item>
                </Breadcrumb>
                <LayoutContent style={{ wordBreak: 'break-all' }}>
                    <Form layout="vertical">
                        <Row style={rowStyle} >
                            <Col md={splitClass} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="PyTemplate Name">
                                    {
                                        getFieldDecorator('Name', {
                                            rules: getRules(displayNameField, this.props, "PyTemplate"),
                                            initialValue: pyTemplate !== null ? pyTemplate.name : ""
                                        })(
                                            <Input
                                                placeholder="PyTemplate Name"
                                            />,
                                        )}
                                </FormItem>
                            </Col>                            
                            <Col md={splitClass} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="Status">
                                    {getFieldDecorator('Status', {
                                        rules: getRules(statusField, this.props),
                                        initialValue: pyTemplate !== null ? pyTemplate.status.toString() : "1"
                                    })(
                                        <Select
                                            placeholder="Status"
                                            optionFilterProp="children"
                                            disabled={this.props.location.state.readOnly === false ? false : true}
                                        >
                                            <Option key={"1"}>
                                                {"Active"}
                                            </Option>
                                            <Option key={"0"}>
                                                {"InActive"}
                                            </Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={rowStyle} >
                            <Col md={splitClass} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="Arguments">
                                    <Input disabled addonAfter={pyTemplateID === 0 ? <Icon onClick={this.showArgumentModal} type={pyArguments.length > 0 ? "edit" : "plus-circle"} /> : this.props.location.state.readOnly === false ? <Icon onClick={this.showArgumentModal} type={pyArguments.length > 0 ? "edit" : "plus-circle"} /> : true} placeholder={pyArguments.length > 0 ? "Arguments Available" : "Arguments Not Added yet"}  ></Input>
                                </FormItem>
                            </Col>                            
                        </Row>
                        <Row style={rowStyle}>
                            <Col md={24} sm={24} xs={24}>
                                <Button type="danger" style={{ marginRight: 10, float: "left" }} onClick={this.navBack}> Cancel </Button>
                                {pyTemplateID === 0 ? <Button className='ant-btn sc-ifAKCX fcfmNQ ant-btn-default' style={{ float: 'left' }} onClick={this.clearFields}>Clear</Button> : ("")}
                                {typeof this.props.location.state.readOnly === 'undefined' ?
                                    <Button type="primary" className='ant-btn sc-ifAKCX fcfmNQ saveBtn' style={{ float: "right" }} onClick={this.saveMacro} >{getAddButtonText()}</Button>
                                    :
                                    this.props.location.state.readOnly === false ?
                                        <Button type="primary" className='ant-btn sc-ifAKCX fcfmNQ saveBtn' style={{ float: "right" }} onClick={this.checkData} >{getSaveButtonText()}</Button>
                                        :
                                        <div style={{ height: "32px" }}></div>
                                }
                            </Col>
                        </Row>
                        {pyTemplate !== null &&

                            <ConfirmModal loading={this.state.modalLoading} title="Update PyTemplate" SubmitButtonName="Update" onSubmit={this.updateMacro} visible={this.state.showEditModal} handleCancel={this.handleEditCancel} getFieldDecorator={getFieldDecorator} />
                        }
                    </Form>
                    {
                        argumentsVisibility &&

                        <PyArguments visible={argumentsVisibility} argTypes={argTypes} handleCancel={this.toogleArguments} pyArgs={pyArguments} viewOnly={false} />
                    }
                </LayoutContent>
            </LayoutContentWrapper>
         )
    }
}
const WrappedApp = Form.create()(AddPyTemplate);
export default WrappedApp;