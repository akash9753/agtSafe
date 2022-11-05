import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { Breadcrumb, Form, Col, Row, Select, Input, Icon, Button, message, Modal } from 'antd';
import LayoutContent from '../../components/utility/layoutContent';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import { hideProgress, CallServerPost, errorModal, PostCallWithZone, successModal, getAddButtonText, getSaveButtonText, showProgress } from '../Utility/sharedUtility';
import ConfirmModal from '../Utility/ConfirmModal';
import { getRules } from '../Utility/htmlUtility';
import { select } from 'redux-saga/effects';
import { errorMessageTooltip } from '../Utility/errorMessageUtility.js';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

const Option = Select.Option;
const FormItem = Form.Item;


class AddMappingBlock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            MappingBlockOptions: [],
            argumentsVisibility: false,
            MappingBlockArguments: [],
            argTypes: [],
            loading: this.props.location.state.MappingBlockID > 0,
            MappingBlockID: this.props.location.state.MappingBlockID,
            MappingBlock: null,
            showEditModal: false,
            modalLoading: false,
            jsonmodalvisible: false,
            maparguments: "",


        };
        if (this.props.location.state.MappingBlockID > 0) {
            this.getMappingBlock(this);
        }

    }

    clearFields = () => {
        this.props.form.resetFields();
    }

    showModal = () => {
        this.setState({
            jsonmodalvisible: true,
        });
    };



    handleCancel = e => {
        this.setState({
            jsonmodalvisible: false,
        });
    };

    getMappingBlock = (thisObj) => {
        CallServerPost('MappingBlock/GetMappingBlock', { MappingBlockID: thisObj.props.location.state.MappingBlockID })
            .then(
                function (response) {
                    if (response.value !== null) {
                        //console.log(response.value);
                        thisObj.setState({ MappingBlock: response.value, loading: false, maparguments: response.value.args, MappingBlockArguments: JSON.parse(response.value.args) });
                    } else {
                        message.destroy();
                        message.error('Mapping Block Not Found');
                        thisObj.props.history.push('/trans/MappingBlock');
                    }
                });
    }


    /*getList = () => {
        const thisObj = this;
        let values = {};
        values["MappingBlockID"] = thisObj.props.location.state.MappingBlockID;
        CallServerPost('MappingBlock/GetAllMappingBlock', values)
            .then(
                function (response) {
                    if (response.value !== null) {
                        const MappingBlockList = response.value;
                        const options = MappingBlockList.map(function (option) {
                            return (
                                <Option key={option["MappingBlockID"]}>
                                    {option["label"]}
                                </Option>
                            )
                        });
                        if (thisObj.props.location.state.MappingBlockID > 0) {
                            thisObj.getMappingBlock(thisObj);
                        }
                    }
                });
    }*/

    /*toogleArguments = (MappingBlockArguments) => {
        this.setState({ argumentsVisibility: !this.state.argumentsVisibility, MappingBlockArguments: MappingBlockArguments })
    }
    showArgumentModal = () => {
        const thisObj = this;
        if (this.state.argTypes.length === 0) {
            CallServerPost('ProductControlledTerm/GetProductControlledTermByTermName', { TermName: "MappingBlockArgumentType"})
                .then(
                    function (response) {
                        if (response.value !== null) {
                            thisObj.setState({ argumentsVisibility: true, argTypes: response.value })
                        }
                    });
        } else {
            thisObj.setState({ argumentsVisibility: true });
        }
    }*/


    navBack = () => {
        this.props.history.push('/trans/MappingBlock');

    }
    saveMapping = () => {
        const thisObj = this;
        thisObj.props.form.validateFields((err, values) => {
            //if (this.state.MappingBlockArguments.length === 0) {
            //    message.destroy();
            //    message.error('Please Fill the all required fields',3);
            //    err = true;
            //} 
            if (!err) {
                const mappingBlock = {
                    Name: values["name"],
                    Category: values["category"],
                    Order: parseInt(values["order"]),
                    Type: values["type"],
                    Message: values["message"],
                    Args: values["args"],
                    Color: values["color"],
                    PreviousStatement: (values["previousStatement"]),
                    NextStatement: (values["nextStatement"]),
                    InputsInline: parseInt(values["inputsInline"]),
                    Output: values["output"],
                    Tooltip: values["tooltip"],
                    Description: values["description"],
                    view_category: values["view_category"]
                };
                PostCallWithZone('MappingBlock/CreateMappingBlock', mappingBlock)
                    .then(
                        function (response) {
                            if (response.status === 1) {
                                successModal(response.message, thisObj.props, "/trans/MappingBlock");
                            } else {
                                errorModal(response.message);
                            }
                        });
            }
        });
    }

    updateMapping = (changeReason) => {
        const thisObj = this;
        thisObj.setState({ showEditModal: false });
        thisObj.props.form.validateFields((err, values) => {
            if (this.state.MappingBlockArguments.length === 0) {
                message.destroy();
                message.error('Please Fill the all required fields');
                err = true;
            }
            if (!err) {
                const mappingBlock = {
                    Name: values["name"],
                    Category: values["category"],
                    Order: parseInt(values["order"]),
                    Type: values["type"],
                    Message: values["message"],
                    Args: values["args"],
                    Color: values["color"],
                    PreviousStatement: (values["previousStatement"]),
                    NextStatement: (values["nextStatement"]),
                    InputsInline: parseInt(values["inputsInline"]),
                    Output: values["output"],
                    Tooltip: values["tooltip"],
                    Description: values["description"],
                    view_category: values["view_category"],
                    ChangeReason: changeReason, MappingBlockID: this.state.MappingBlockID,
                    UpdatedDateTimeText: thisObj.state.MappingBlock.updatedDateTimeText
                };
                showProgress();
                PostCallWithZone('MappingBlock/UpdateMappingBlock', mappingBlock)
                    .then(
                        function (response) {
                            if (response.status === 1) {
                                successModal(response.message, thisObj.props, "/trans/MappingBlock");
                            } else {
                                errorModal(response.message);
                            }
                            hideProgress();
                        });

            }
        });
    }

    checkData = () => {

        const thisObj = this;
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                if (thisObj.state.MappingBlockArguments.length === 0) {
                    message.destroy();
                    message.error('Please fill the all required fields');
                } else {
                    thisObj.handleEditCancel();
                }
            }
        });
    }

    handleEditCancel = () => {
        this.setState({ showEditModal: !this.state.showEditModal });
    }

    MappingBlockChange = (key, Option) => {
        if (Option.props.children !== "--Select--") {
            this.props.form.setFieldsValue({
                'MappingBlockDisplayName': Option.props.children
            })
        }
    }

    ArgumentsChange = (value) => {
        this.setState({ maparguments: value.json })
    }


    SetMapArguments = (setFieldsValue) => {
        const { maparguments } = this.state;
        this.setState({ jsonmodalvisible: false, }, () => {
            setFieldsValue({
                'args': maparguments,
                MappingBlockArguments: JSON.parse(maparguments)
            });
        });
    }

    componentDidUpdate() {
        errorMessageTooltip(this.props);
    }

    render() {
        const { getFieldDecorator, setFieldsValue } = this.props.form;
        const { MappingBlockArguments, argTypes, argumentsVisibility, MappingBlockID, MappingBlock } = this.state;
        const { Option } = Select;
        let splitClass = 8;

        function handleChange(value) {
            //console.log(`selected ${value}`);
        }

        const mappingNameField = {
            attributeName: "name",
            displayName: "Name",
            controlTypeText: "",
            inputTypeText: "AlphanumericSpecial",
            inputRequirementText: "Mandatory",
            requirementErrorMessage: "Mapping Name is mandatory",
            inputTypeErrorMessage: "Mapping Name should contain only alphanumeric values and special characters(_@!`%*()=${};:<>.,'\/#& +-?)",
            validationErrorMessage: "Mapping Name should be between 2-25 characters",
            regExText: "/^(?!.*  )[ A-Za-z0-9_@!`%*()=${};:<>'.\/#&+-?]+$/g",
            minValue: 2,
            maxValue: 25
        };

        const mappingCategoryField = {
            attributeName: "Category",
            displayName: "Category",
            controlTypeText: "",
            inputTypeText: "AlphanumericSpecial",
            inputRequirementText: "Mandatory",
            requirementErrorMessage: "Mapping category is mandatory",
            inputTypeErrorMessage: "Mapping Category should contain only alphanumeric values and special characters(_@!`%*()=${};:<>.,'\/#& +-?)",
            validationErrorMessage: "Mapping Category should be between 2-25 characters",
            regExText: "/^(?!.*  )[ A-Za-z0-9_@!`%*()=${};:<>'.\/#&+-?]+$/g",
            minValue: 2,
            maxValue: 25
        };

        const mappingOrderField = {
            attributeName: "Order",
            displayName: "Order",
            controlTypeText: "",
            inputTypeText: "Number",
            inputRequirementText: "Mandatory",
            requirementErrorMessage: "Mapping Order is mandatory",
            inputTypeErrorMessage: "Mapping Order should contain only numeric values",
            validationErrorMessage: "Mapping Order should be between 1-25 characters",
            regExText: "/^[0-9-_ ]+$/",
            minValue: 0,
            maxValue: 25
        };

        const mappingTypeField = {
            attributeName: "Type",
            displayName: "Type",
            controlTypeText: "",
            inputTypeText: "AlphanumericSpecial",
            inputRequirementText: "Mandatory",
            requirementErrorMessage: "Mapping type is mandatory",
            inputTypeErrorMessage: "Mapping Type should contain only alphanumeric values and special characters(_@!`%*()=${};:<>.,'\/#& +-?)",
            validationErrorMessage: "Mapping Type should be between 2-100 characters",
            regExText: "/^(?!.*  )[ A-Za-z0-9_@!`%*()=${};:<>'.\/#&+-?]+$/g",
            minValue: 2,
            maxValue: 100
        };

        const mappingMessageField = {
            attributeName: "Message",
            displayName: "Message",
            controlTypeText: "",
            inputTypeText: "AlphanumericSpecial",
            inputRequirementText: "Mandatory",
            requirementErrorMessage: "Mapping type is mandatory",
            inputTypeErrorMessage: "Mapping Message should contain only alphanumeric values and special characters(_@!`%*()=${};:<>.,'\/#& +-?)",
            validationErrorMessage: "Mapping Message should be between 2-255 characters",
            regExText: "/^(?!.*  )[A-Za-z0-9_ @!`%*()=${};:<>'\".\/#&+-?]+$/g",
            minValue: 2,
            maxValue: 255
        };

        const mappingArgumentsField = {
            attributeName: "Arguments",
            displayName: "Arguments",
            controlTypeText: "Textarea",
            inputTypeText: "AlphanumericSpecial",
            inputRequirementText: "Mandatory",
            requirementErrorMessage: "Mapping Arguments is mandatory",
            inputTypeErrorMessage: "Mapping Arguments should contain only alphanumeric values and special characters(_@!`%*()=${}[]\";:<>.,'\/#& +-?)",
            validationErrorMessage: "Mapping Arguments should be between 2-1000 characters",
            regExText: "",
            minValue: 2,
            maxValue: 1000
        };

        const mappingColorField = {
            attributeName: "Color",
            displayName: "Color",
            controlTypeText: "",
            inputTypeText: "AlphanumericSpecial",
            inputRequirementText: "Mandatory",
            requirementErrorMessage: "Mapping Color is mandatory",
            inputTypeErrorMessage: "Mapping Color should contain only alphanumeric values and special characters(_@!`%*()=${};:<>.,'\/#& +-?)",
            validationErrorMessage: "Mapping Color should be between 2-25 characters",
            regExText: "/^(?!.*  )[ A-Za-z0-9_@!`%*()=${};:<>'.\/#&+-?]+$/g",
            minValue: 2,
            maxValue: 25
        };

        const mappingTooltipField = {
            attributeName: "Tooltip",
            displayName: "Tooltip",
            controlTypeText: "",
            inputTypeText: "AlphanumericSpecial",
            requirementErrorMessage: "Mapping Tooltip is mandatory",
            inputTypeErrorMessage: "Mapping Tooltip should contain only alphanumeric values and special characters(_@!`%*()=${};:<>.,'\/#& +-?)",
            validationErrorMessage: "Mapping Tooltip should be between 2-25 characters",
            regExText: "/^(?!.*  )[ A-Za-z0-9_@!`%*()=${};:<>'.\/#&+-?]+$/g",
            minValue: 2,
            maxValue: 25
        };

        const mappingDescriptionField = {
            attributeName: "Description",
            displayName: "Description",
            controlTypeText: "",
            inputTypeText: "AlphanumericSpecial",
            requirementErrorMessage: "Mapping Description is mandatory",
            inputTypeErrorMessage: "Mapping Description should contain only alphanumeric values and special characters(_@!`%*()=${};:<>.,'\/#& +-?)",
            validationErrorMessage: "Mapping Description should be between 2-25 characters",
            regExText: "/^(?!.*  )[ A-Za-z0-9_@!`%*()=${};:<>'.\/#&+-?]+$/g",
            minValue: 2,
            maxValue: 25
        };

        const mappingViewCategoryField = {
            attributeName: "view_category",
            displayName: "ViewCategory",
            controlTypeText: "",
            inputTypeText: "AlphanumericSpecial",
            requirementErrorMessage: "Mapping viewCategory is mandatory",
            inputTypeErrorMessage: "Mapping viewCategory should contain only alphanumeric values and special characters(_@!`%*()=${};:<>.,'\/#& +-?)",
            validationErrorMessage: "Mapping viewCategory should be between 2-25 characters",
            regExText: "/^(?!.*  )[ A-Za-z0-9_@!`%*()=${};:<>'.\/#&+-?]+$/g",
            minValue: 2,
            maxValue: 25
        };

        const previousStatementField = {
            attributeName: "previousStatement",
            controlTypeText: "",
            inputTypeText: "AlphanumericSpecial",
            requirementErrorMessage: "Mapping Output is mandatory",
            inputTypeErrorMessage: "Mapping Output should contain only alphanumeric values and special characters(_@!`%*()=${};:<>.,'\/#& +-?)",
            validationErrorMessage: "Mapping Output should be between 1-25 characters",
            regExText: "",
        };

        const nextStatementField = {
            attributeName: "nextStatement",
            controlTypeText: "",
            inputTypeText: "AlphanumericSpecial",
            requirementErrorMessage: "Mapping Output is mandatory",
            inputTypeErrorMessage: "Mapping Output should contain only alphanumeric values and special characters(_@!`%*()=${}[]\";:<>.,'\/#& +-?)",
            validationErrorMessage: "Mapping Output should be between 1-25 characters",
            regExText: "",
        };

        const inputsInlineField = {
            controlTypeText: "DropDown",
            inputRequirementText: "Mandatory",
            requirementErrorMessage: "Input Inline should be selected"
        };

        const mappingOutputField = {
            attributeName: "Output",
            displayName: "Output",
            controlTypeText: "",
            inputTypeText: "AlphanumericSpecial",
            requirementErrorMessage: "Mapping Output is mandatory",
            inputTypeErrorMessage: "Mapping Output should contain only alphanumeric values and special characters(_@!`%*()=${};:<>.,'\/#& +-?)",
            validationErrorMessage: "Mapping Output should be between 1-25 characters",
            regExText: "/^(?!.*  )[ A-Za-z0-9_@!`%*()=${};:<>'.\/#&+-?]+$/g",
            minValue: 1,
            maxValue: 25
        };

        return (
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-microchip" ></i>
                        <span>Mapping Block</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {MappingBlockID === 0 ? "Add" : "Edit"}
                    </Breadcrumb.Item>
                </Breadcrumb>
                <LayoutContent style={{ wordBreak: 'break-all' }}>
                    <Form layout="vertical">
                        <Row style={rowStyle} >
                            <Col md={splitClass} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="Name" >
                                    {getFieldDecorator('name', {
                                        rules: getRules(mappingNameField, this.props),
                                        initialValue: MappingBlock !== null ? MappingBlock.name : ""
                                    })(
                                        <Input
                                            placeholder="Name"
                                            disabled={MappingBlockID === 0 ? false : this.props.location.state.readOnly === false ? false : true}
                                        />,
                                    )}
                                </FormItem>

                            </Col>
                            <Col md={splitClass} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="Category" >
                                    {getFieldDecorator('category', {
                                        rules: getRules(mappingCategoryField, this.props),
                                        initialValue: MappingBlock !== null ? MappingBlock.category : ""
                                    })(
                                        <Input
                                            placeholder="Category"
                                            disabled={MappingBlockID === 0 ? false : this.props.location.state.readOnly === false ? false : true}
                                        />,
                                    )}
                                </FormItem>

                            </Col>
                            <Col md={splitClass} sm={4} xs={4} style={{ paddingRight: "10px" }}>
                                <FormItem label="Order" >
                                    {getFieldDecorator('order', {
                                        rules: getRules(mappingOrderField, this.props),
                                        initialValue: MappingBlock !== null ? MappingBlock.order.toString() : ""
                                    })(
                                        <Input
                                            placeholder="Order"
                                            disabled={MappingBlockID === 0 ? false : this.props.location.state.readOnly === false ? false : true}
                                        />,
                                    )}
                                </FormItem>

                            </Col>
                            <Col md={splitClass} sm={4} xs={4} style={{ paddingRight: "10px" }}>
                                <FormItem label="Type" >
                                    {getFieldDecorator('type', {
                                        rules: getRules(mappingTypeField, this.props),
                                        initialValue: MappingBlock !== null ? MappingBlock.type : ""
                                    })(
                                        <Input
                                            placeholder="Type"
                                            disabled={MappingBlockID === 0 ? false : this.props.location.state.readOnly === false ? false : true}
                                        />,
                                    )}
                                </FormItem>

                            </Col>
                            <Col md={splitClass} sm={4} xs={4} style={{ paddingRight: "10px" }}>
                                <FormItem label="Message" >
                                    {getFieldDecorator('message', {
                                        rules: getRules(mappingMessageField, this.props),
                                        initialValue: MappingBlock !== null ? MappingBlock.message : ""
                                    })(
                                        <Input
                                            placeholder="Message"
                                            disabled={MappingBlockID === 0 ? false : this.props.location.state.readOnly === false ? false : true}
                                        />,
                                    )}
                                </FormItem>

                            </Col>
                            <Col md={splitClass} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="Arguments" >
                                    {getFieldDecorator('args', {
                                        rules: getRules(mappingArgumentsField, this.props),
                                        initialValue: MappingBlock !== null ? MappingBlock.args : ""
                                    })(
                                        <Input
                                            placeholder="Arguments"
                                            addonAfter={<Icon onClick={this.showModal} type="setting" />}
                                            disabled={true}
                                        />,
                                    )}
                                </FormItem>

                            </Col>
                            <Col md={splitClass} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="Color" >
                                    {getFieldDecorator('color', {
                                        rules: getRules(mappingColorField, this.props),
                                        initialValue: MappingBlock !== null ? MappingBlock.color : ""
                                    })(
                                        <Input
                                            placeholder="Color"
                                            disabled={MappingBlockID === 0 ? false : this.props.location.state.readOnly === false ? false : true}
                                        />,
                                    )}
                                </FormItem>

                            </Col>


                            <Col md={splitClass} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="PreviousStatement" >
                                    {getFieldDecorator('previousStatement', {
                                        rules: getRules(previousStatementField, this.props),
                                        initialValue: MappingBlock !== null ? MappingBlock.previousStatement : ""
                                    })(
                                        <Input
                                            placeholder="PreviousStatement"
                                            disabled={MappingBlockID === 0 ? false : this.props.location.state.readOnly === false ? false : true}
                                        />,
                                    )}
                                </FormItem>
                            </Col>

                            <Col md={splitClass} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="NextStatement" >
                                    {getFieldDecorator('nextStatement', {
                                        rules: getRules(nextStatementField, this.props),
                                        initialValue: MappingBlock !== null ? MappingBlock.nextStatement : ""
                                    })(
                                        <Input
                                            placeholder="NextStatement"
                                            disabled={MappingBlockID === 0 ? false : this.props.location.state.readOnly === false ? false : true}
                                        />,
                                    )}
                                </FormItem>

                            </Col>


                            <Col md={splitClass} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="InputsInline" >
                                    {getFieldDecorator('inputsInline', {
                                        rules: getRules(inputsInlineField, this.props),
                                        initialValue: MappingBlock !== null ? (MappingBlock.inputsInline == true ? "1" : "0") : ""
                                    })(


                                        <Select onChange={handleChange} disabled={MappingBlockID === 0 ? false : this.props.location.state.readOnly === false ? false : true}>
                                            <Option value="">Select</Option>
                                            <Option value="0">0</Option>
                                            <Option value="1">1</Option>
                                        </Select>,
                                    )}
                                </FormItem>

                            </Col>
                            <Col md={splitClass} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="Output" >
                                    {getFieldDecorator('output', {
                                        rules: getRules(mappingOutputField, this.props),
                                        initialValue: MappingBlock !== null ? MappingBlock.output : ""
                                    })(
                                        <Input
                                            placeholder="Output"
                                            disabled={MappingBlockID === 0 ? false : this.props.location.state.readOnly === false ? false : true}
                                        />,
                                    )}
                                </FormItem>

                            </Col>
                            <Col md={splitClass} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="Tooltip" >
                                    {getFieldDecorator('tooltip', {
                                        rules: getRules(mappingTooltipField, this.props),
                                        initialValue: MappingBlock !== null ? MappingBlock.tooltip : ""
                                    })(
                                        <Input
                                            placeholder="Tooltip"
                                            disabled={MappingBlockID === 0 ? false : this.props.location.state.readOnly === false ? false : true}
                                        />,
                                    )}
                                </FormItem>

                            </Col>
                            <Col md={splitClass} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="Description" >
                                    {getFieldDecorator('description', {
                                        rules: getRules(mappingDescriptionField, this.props),
                                        initialValue: MappingBlock !== null ? MappingBlock.description : ""
                                    })(
                                        <Input
                                            placeholder="Description"
                                            disabled={MappingBlockID === 0 ? false : this.props.location.state.readOnly === false ? false : true}
                                        />,
                                    )}
                                </FormItem>
                            </Col>
                            <Col md={splitClass} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <FormItem label="ViewCategory" >
                                    {getFieldDecorator('view_category', {
                                        rules: getRules(mappingViewCategoryField, this.props),
                                        initialValue: MappingBlock !== null ? MappingBlock.view_category : ""
                                    })(
                                        <Input
                                            placeholder="ViewCategory"
                                            disabled={MappingBlockID === 0 ? false : this.props.location.state.readOnly === false ? false : true}
                                        />,
                                    )}
                                </FormItem>
                            </Col>

                        </Row>

                        <Row style={rowStyle}>
                            <Col md={24} sm={24} xs={24}>
                                <Button type="danger" style={{ marginRight: 10, float: "left" }} onClick={this.navBack}> Cancel </Button>
                                {MappingBlockID === 0 ? <Button className='ant-btn sc-ifAKCX fcfmNQ ant-btn-default' style={{ float: 'left' }} onClick={this.clearFields}>Clear</Button> : ("")}
                                {typeof this.props.location.state.readOnly === 'undefined' ?
                                    <Button type="primary" className='ant-btn sc-ifAKCX fcfmNQ saveBtn' style={{ float: "right" }} onClick={this.saveMapping} >{getAddButtonText()}</Button>
                                    :
                                    this.props.location.state.readOnly === false ?
                                        <Button type="primary" className='ant-btn sc-ifAKCX fcfmNQ saveBtn' style={{ float: "right" }} onClick={this.checkData} >{getSaveButtonText()}</Button>
                                        :
                                        <div style={{ height: "32px" }}></div>
                                }
                            </Col>
                        </Row>


                        {
                            MappingBlock !== null &&
                            <ConfirmModal loading={this.state.modalLoading} title="Update Mapping" SubmitButtonName="Update" onSubmit={this.updateMapping} visible={this.state.showEditModal} handleCancel={this.handleEditCancel} getFieldDecorator={getFieldDecorator} />
                        }
                        <Modal
                            title="Arguments"
                            visible={this.state.jsonmodalvisible}
                            onOk={() => this.SetMapArguments(setFieldsValue)}
                            onCancel={this.handleCancel}
                            style={{ top: 20 }}
                        >
                            <JSONInput
                                id='mapblockarguments'
                                placeholder={MappingBlock !== null ? JSON.parse(MappingBlock.args) : {}}
                                locale={locale}
                                height='550px'
                                onChange={this.ArgumentsChange}
                                viewOnly={MappingBlockID === 0 ? false : this.props.location.state.readOnly === false ? false : true}
                            />
                        </Modal>
                    </Form>
                </LayoutContent>
            </LayoutContentWrapper>
        )
    }
}
const WrappedApp = Form.create()(AddMappingBlock);
export default WrappedApp;