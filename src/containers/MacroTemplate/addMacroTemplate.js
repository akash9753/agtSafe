import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { Breadcrumb, Form, Col, Row, Select, Input, Icon, Button, message } from 'antd';
import LayoutContent from '../../components/utility/layoutContent';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import { CallServerPost, errorModal, PostCallWithZone, successModal, getAddButtonText, getSaveButtonText } from '../Utility/sharedUtility';
import MacroArguments from './arguments';
import ConfirmModal from '../Utility/ConfirmModal';
import { getRules } from '../Utility/htmlUtility';
import { select } from 'redux-saga/effects';
import { errorMessageTooltip } from '../Utility/errorMessageUtility.js';

const Option = Select.Option;
const FormItem = Form.Item;


class AddMacroTemplate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            programTemplateOptions: [],
            argumentsVisibility: false,
            macroArguments: [],
            argTypes: [],
            loading: this.props.location.state.macroTemplateID > 0,
            macroTemplateID: this.props.location.state.macroTemplateID,
            macroTemplate: null,
            showEditModal: false,
            modalLoading: false
        };       
       this.getList();        
    }

    clearFields = () => {
        this.props.form.resetFields();
    }

    getMacroTemplate = (thisObj) => {
        CallServerPost('MacroTemplate/GetMacroTemplate', { MacroTemplateID: thisObj.props.location.state.macroTemplateID})
            .then(
                function (response) {
                    if (response.value !== null) {
                        //console.log(response.value);
                        thisObj.setState({ macroTemplate: response.value, loading: false, macroArguments: JSON.parse(response.value.arguments) });
                    } else {
                        message.destroy();
                        message.error('Macro Template Not Found');
                        thisObj.props.history.push('/trans/MacroTemplate');
                    }
                });
    }


    getList = () => {
        const thisObj = this;
        let values = {};
        values["ProgramTemplateID"] = thisObj.props.location.state.programTemplateID;
        CallServerPost('ProgramTemplate/GetAllForMacro', values)
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
                        if (thisObj.props.location.state.macroTemplateID > 0) {
                            thisObj.getMacroTemplate(thisObj);
                        }
                    }
                });
    }

    toogleArguments = (macroArguments) => {
        this.setState({ argumentsVisibility: !this.state.argumentsVisibility, macroArguments: macroArguments })
    }
    showArgumentModal = () => {
        const thisObj = this;
        if (this.state.argTypes.length === 0) {
            CallServerPost('ProductControlledTerm/GetProductControlledTermByTermName', { TermName: "MacroArgumentType"})
                .then(
                    function (response) {
                        if (response.value !== null) {
                            thisObj.setState({ argumentsVisibility: true, argTypes: response.value })
                        }
                    });
        } else {
            thisObj.setState({ argumentsVisibility: true });
        }
    }


    navBack = () => {
        this.props.history.push('/trans/MacroTemplate');
       
    }
    saveMacro = () => {
        const thisObj = this;
        thisObj.props.form.validateFields((err, values) => {
            if (this.state.macroArguments.length === 0) {
                message.destroy();
                message.error('Please Add Arguments',3);
                err = true;
            } 
            if (!err) {
                const macroTemp = { MacroDisplayName: values["macroDisplayName"], MacroName: values["macroName"], Arguments: JSON.stringify(this.state.macroArguments)};
                PostCallWithZone('MacroTemplate/Create', macroTemp)
                    .then(
                        function (response) {
                            if (response.status === 1) {
                                successModal(response.message, thisObj.props, "/trans/MacroTemplate");
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
            if (this.state.macroArguments.length === 0) {
                message.destroy();
                message.error('Please Add Arguments');
                err = true;
            } 
            if (!err) {
                const macroTemp = {
                    MacroDisplayName: values["macroDisplayName"], MacroName: values["macroName"], Arguments: JSON.stringify(this.state.macroArguments),
                    ChangeReason: changeReason, MacroTemplateID: this.state.macroTemplateID,
                    UpdatedDateTimeText: thisObj.state.macroTemplate.updatedDateTimeText
                };
                
                PostCallWithZone('MacroTemplate/Update', macroTemp)
                    .then(
                        function (response) {
                            if (response.status === 1) {
                                successModal(response.message, thisObj.props, "/trans/MacroTemplate");
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
                if (this.state.macroArguments.length === 0) {
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
        const { macroArguments, argTypes, argumentsVisibility, macroTemplateID, macroTemplate } = this.state;
        let splitClass = 12;
        const argumentsError = macroArguments.length === 0;
        const displayNameField = {
            controlTypeText:"",
            inputTypeText: "AlphaNumericUnderscore",
            inputRequirementText: "Mandatory",
            requirementErrorMessage: "Macro Display Name is mandatory",
            inputTypeErrorMessage: "Macro Display Name should contain only alphanumeric values and underscore",
            validationErrorMessage: "Macro Display Name should be between 2-25 characters",
            regExText: "/^[a-zA-Z0-9-_ ]+$/",
            minValue: 2,
            maxValue: 25
        };

        const macroNameField = {
            attributeName: "MacroName",
            displayName: "Macro Name",
            controlTypeText: "",
            defaultValue: macroTemplate !== null ? macroTemplate.macroName : "",
            inputTypeText: "AlphanumericSpecial",
            inputRequirementText: "Mandatory",
            requirementErrorMessage: "Macro Name is mandatory",
            inputTypeErrorMessage: "Macro Name should contain only alphanumeric values and special characters(_@!`%*()=${};:<>.,'\/#& +-?)",
            validationErrorMessage: "Macro Name should be between 2-25 characters",
            regExText: "/^(?!.*  )[ A-Za-z0-9_@!`%*()=${};:<>'.\/#&+-?]+$/g",
            minValue: 2,
            maxValue: 25
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
                        <span>Macro Template</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {macroTemplateID === 0 ? "Add" : "Edit" }
                    </Breadcrumb.Item>
                </Breadcrumb>
                <LayoutContent style={{ wordBreak: 'break-all' }}>
                    <Form layout="vertical">
                        <Row style={rowStyle} >
                            <Col md={splitClass} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="Macro Name" >
                                    {getFieldDecorator('macroName', {
                                        rules: getRules(macroNameField, this.props),
                                        initialValue: macroTemplate !== null ? macroTemplate.macroName : ""
                                    })(
                                        <Input
                                            placeholder="Macro Name"
                                            disabled={macroTemplateID === 0 ? false : this.props.location.state.readOnly === false ? false : true}
                                        />,
                                    )}
                                </FormItem>
                            </Col>                            
                            <Col md={splitClass} sm={6} xs={6}>
                                <FormItem label="Macro Display Name">
                                    {getFieldDecorator('macroDisplayName', {
                                        rules: getRules(displayNameField, this.props),
                                        initialValue: macroTemplate !== null ? macroTemplate.macroDisplayName : ""
                                    })(
                                        <Input
                                            placeholder="Macro Display Name"
                                        />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={rowStyle} >
                            <Col md={splitClass} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="Arguments">
                                    <Input disabled addonAfter={macroTemplateID === 0 ? <Icon onClick={this.showArgumentModal} type={macroArguments.length > 0 ? "edit" : "plus-circle"} /> : this.props.location.state.readOnly === false ? <Icon onClick={this.showArgumentModal} type={macroArguments.length > 0 ? "edit" : "plus-circle"} /> : true} placeholder={macroArguments.length > 0 ? "Arguments Available" : "Arguments Not Added yet"}  ></Input>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={rowStyle}>
                            <Col md={24} sm={24} xs={24}>
                                <Button type="danger" style={{ marginRight: 10, float: "left" }} onClick={this.navBack}> Cancel </Button>
                                {macroTemplateID === 0 ? <Button className='ant-btn sc-ifAKCX fcfmNQ ant-btn-default' style={{ float: 'left' }} onClick={this.clearFields}>Clear</Button> : ("")}
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
                        {macroTemplate !== null &&

                            <ConfirmModal loading={this.state.modalLoading} title="Update Macro Template" SubmitButtonName="Update" onSubmit={this.updateMacro} visible={this.state.showEditModal} handleCancel={this.handleEditCancel} getFieldDecorator={getFieldDecorator} />
                        }
                    </Form>
                    {
                        argumentsVisibility &&

                        <MacroArguments visible={argumentsVisibility} argTypes={argTypes} handleCancel={this.toogleArguments} macroArguments={macroArguments} viewOnly={false} />
                    }
                </LayoutContent>
            </LayoutContentWrapper>
         )
    }
}
const WrappedApp = Form.create()(AddMacroTemplate);
export default WrappedApp;