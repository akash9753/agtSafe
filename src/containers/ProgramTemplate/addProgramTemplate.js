import React, { Component } from 'react';
import { Button, Form, message, Modal, Icon, Spin } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { CallServerPost, PostCallWithZone, errorModal, successModalCallback, getAddButtonText, getSaveButtonText } from '../Utility/sharedUtility';
import ConfirmModal from '../Utility/ConfirmModal';
import SingleForm from '../Utility/SingleForm';
import Input from '../../components/uielements/input';
import { clear } from '../Utility/SingleForm';


const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;
class AddProgramTemplate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            disableBtn: false,
            responseData: {
                formData: {},
            },
            modalLoad: false,
            showEditConfirmationModal: false,
        }
        thisObj = this;
        thisObj.getFormData(thisObj.props)
    }
    getFormData = (data) => {
        if (data.action != "" && data.action != "Delete") {
            thisObj.setState({ loading: true });
            CallServerPost('ProgramTemplate/GetProgramTemplateFormData', { FormName: "ProgramTemplate", ActionName: data.action, ID: data.programTemplateID, Editable: (data.action === "Update") ? (data.readOnly) : false }).then(
                function (response) {
                    thisObj.setState({ loading: false });
                    const responseData = response.value;
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    } else {
                        thisObj.setState({ responseData: responseData, loading: false });
                    }
                }).catch(error => error);
        }
    }

    addProgramTemplateCancel = () => {
        thisObj.setState({
            responseData: { formData: {} }
        });
        thisObj.props.form.resetFields();
        thisObj.props.handleCancel();
    }

    handleCreateUpdate = (val) => {

        const thisObj = this;
        thisObj.props.form.validateFields({ force: true }, (err, values) => {

            var minArgs = thisObj.props.form.getFieldValue(["MinArgument"]);
            var maxArgs = thisObj.props.form.getFieldValue(["MaxArgument"]);
            if ((minArgs.nArgument !== null || maxArgs.xArgument !== null) && !(parseInt(minArgs.nArgument) < parseInt(maxArgs.xArgument))) {
                thisObj.props.form.setFields({ MinArgument: { value: minArgs.nArgument, errors: [new Error('Min Argument should be less than Max Argument')] } });
                thisObj.props.form.setFields({ MaxArgument: { value: maxArgs.xArgument, errors: [new Error('Max Argument should be Greater than Min Argument')] } });
                err = true;
            }

            if (!err) {
                thisObj.setState({ loading: true, disableBtn: true, modalLoad: true });
                var url = "ProgramTemplate/" + thisObj.props.action;
                if (thisObj.props.action == "Update") {
                    values["ChangeReason"] = val;
                    values["ProgramTemplateID"] = thisObj.props.programTemplateID;
                    values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;
                }
                PostCallWithZone(url, values)
                    .then(
                        function (response) {
                            if (response.status == 1) {
                                successModalCallback(response.message, thisObj.addProgramTemplateCancel);
                            }
                            else {
                                errorModal(response.message);
                            }
                            thisObj.setState({ loading: false, disableBtn: false, modalLoad: false });
                        }).catch(error => error);
            }
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const thisObj = this;
        if (thisObj.props.action == "Update") {
            thisObj.props.form.validateFields({ force: true }, (err, values) => {

                var minArgs = thisObj.props.form.getFieldValue(["MinArgument"]);
                var maxArgs = thisObj.props.form.getFieldValue(["MaxArgument"]);
                if ((minArgs.nArgument !== null || maxArgs.xArgument !== null) && !(parseInt(minArgs.nArgument) < parseInt(maxArgs.xArgument))) {
                    thisObj.props.form.setFields({ MinArgument: { value: minArgs.nArgument, errors: [new Error('Min Argument should be less than Max Argument')] } });
                    thisObj.props.form.setFields({ MaxArgument: { value: maxArgs.xArgument, errors: [new Error('Max Argument should be Greater than Min Argument')] } });
                    err = true;
                }

                if (!err) {
                    thisObj.setState({ showEditConfirmationModal: true });
                }
            });
        }
        else if (thisObj.props.action == "Create") {

            thisObj.handleCreateUpdate();
        }
    }

    handleCancelEditConfirmationModal = () => {
        this.setState({ showEditConfirmationModal: false });
        this.props.form.resetFields(["Change Reason"]);
    }

    render() {

        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { responseData, loading } = this.state;
        const { action } = this.props;

        return (
            <Modal
                visible={this.props.visible}
                title={this.props.title}
                width={'80%'}
                style={{ top: 25 }}
                maskClosable={false}
                onCancel={this.state.disableBtn ? null : this.addProgramTemplateCancel}
                onOk={this.handleSubmit}
                footer={[
                    <Button disabled={this.state.disableBtn} className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={this.addProgramTemplateCancel}>
                        Cancel
                    </Button>,
                    (action == "Create") &&
                    <Button disabled={this.state.disableBtn} className='ant-btn sc-ifAKCX fcfmNQ ant-btn-default' style={{ float: 'left' }} onClick={clear}>
                        Clear
                    </Button>,
                    this.props.readOnly === false ? < Button disabled={this.state.disableBtn} className='ant-btn saveBtn sc-ifAKCX fcfmNQ' onClick={this.handleSubmit} >
                        {action === "Create" ? getAddButtonText() : getSaveButtonText()}
                    </Button> : <div style={{ height: "32px" }}></div>,
                ]}
            >
                <Spin indicator={antIcon} spinning={loading}>

                    <LayoutContentWrapper>
                        {

                            (this.props.action != "") ?
                                Object.keys(responseData.formData).length > 0 && (
                                    <SingleForm property={this} props={this} responseData={responseData} getFieldDecorator={getFieldDecorator} />) : <div></div>

                        }


                    </LayoutContentWrapper>
                </Spin>
                {this.state.showEditConfirmationModal && <ConfirmModal title="Update Program Template" SubmitButtonName="Update" onSubmit={this.handleCreateUpdate} visible={this.state.showEditConfirmationModal} handleCancel={this.handleCancelEditConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />}

            </Modal>
        );
    }
}

const WrappedApp = Form.create()(AddProgramTemplate);
export default WrappedApp;