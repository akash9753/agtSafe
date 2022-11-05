import React, { Component } from 'react';
import { Breadcrumb, Button, Col, Row, Select, Form, Steps, message, Modal, Icon, Spin } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { CallServerPost, PostCallWithZone, errorModal, successModal, successModalCallback, checkPermission, getAddButtonText, getSaveButtonText } from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import ConfirmModal from '../Utility/ConfirmModal';
import SingleForm from '../Utility/SingleForm';
import Input from '../../components/uielements/input';
import { clear } from '../Utility/SingleForm';


const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;

class AddStandardCodeList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            showEditConfirmationModal: false,
            VariableName: null,
            CodeListName: null,
            responseData: {
                formData: {},
            },
            nextProp: true,
            modalLoad: false,
            disableBtn: false
        }

        thisObj = this;
        thisObj.getFormData(thisObj.props)
    }
    getFormData = (data) => {
        if (data.action != "" && data.action != "Delete") {
            CallServerPost('StandardCodeList/GetStandardCodeListFormData', { FormName: "StandardCodeList", ActionName: data.action, ID: data.standardCodeListID, Editable: (data.action === "Update") ? (data.readOnly) : false }).then(
                function (response) {
                    thisObj.setState({ loading: false });
                    const responseData = response.value;
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    } else {
                        thisObj.setState({ nextProp: false, responseData: responseData, loading: false });
                    }
                }).catch(error => error);
        }
    }


    componentWillReceiveProps(nextProps) {

        if (thisObj.state.nextProp && nextProps.action != "" && nextProps.action != "Delete") {
            thisObj.setState({
                nextProp: false
            });
            thisObj.getFormData(nextProps);
        }
    }

    handleStandardCodeListCancel = () => {
        thisObj.setState({
            nextProp: true, responseData: { formData: {} }
        });
        thisObj.props.form.resetFields();
        thisObj.props.handleCancel();
    }

    handleCancelEditConfirmationModal = () => {
        this.setState({ showEditConfirmationModal: false });
        this.props.form.resetFields(["Change Reason"]);

    }

    showListPage = () => {
        this.handleStandardCodeListCancel();
        this.handleCancelEditConfirmationModal();
        this.setState({ modalLoading: false });
        this.setState({ title: "Standard CodeList", cdiscDataStandardID: thisObj.props.standardIDForCreateAndUpdate, cdiscDataStdVersionID: thisObj.props.stdVersionIDForCreateAndUpdate, showStandardCodeList: true })
    }



    handleSubmit = (e) => {
        e.preventDefault();
        const thisObj = this;

        if (thisObj.props.action == "Update") {
            thisObj.props.form.validateFields(["VariableName", "CodeListName"], { force: true }, (err, values) => {
                if (!err) {
                    thisObj.setState({ showEditConfirmationModal: true, VariableName: values.VariableName, CodeListName: values.CodeListName });
                }
            });
        }
        else if (thisObj.props.action == "Create") {
            thisObj.props.form.validateFields(["VariableName", "CodeListName"], { force: true }, (err, values) => {
                if (!err) {
                    thisObj.setState({ loading: true, disableBtn: true });

                    values["CDISCDataStandardID"] = thisObj.props.standardIDForCreateAndUpdate;
                    values["CDISCDataStdVersionID"] = thisObj.props.stdVersionIDForCreateAndUpdate;

                    PostCallWithZone('StandardCodeList/Create', values)
                        .then(
                        function (response) {
                            if (response.status == 1) {
                                successModalCallback(response.message, thisObj.showListPage);
                            }
                            else {
                                errorModal(response.message);
                            }
                            thisObj.setState({ loading: false, disableBtn: false });
                        }).catch(error => error);
                }
            });
        }
    }

    handleUpdate = (ChangeReason) => {
        
        const thisObj = this;
        let values = {};
        values["ChangeReason"] = ChangeReason;
                values["StandardCodeListID"] = thisObj.props.standardCodeListID;
                values["CDISCDataStandardID"] = thisObj.props.standardIDForCreateAndUpdate;
                values["CDISCDataStdVersionID"] = thisObj.props.stdVersionIDForCreateAndUpdate;
                values["VariableName"] = thisObj.state.VariableName;
                values["CodeListName"] = thisObj.state.CodeListName;
                values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;
                thisObj.setState({ loading: true, modalLoad: true, disableBtn: true });

                PostCallWithZone('StandardCodeList/Update', values)
                    .then(
                    function (response) {
                        if (response.status == 1) {
                            thisObj.props.handleCancel();
                            successModalCallback(response.message, thisObj.showListPage);

                        } else {
                            errorModal(response.message);
                        }
                        thisObj.setState({ loading: false, modalLoad: false, disableBtn: false, showEditConfirmationModal: false });
                    }).catch(error => error);
            
    }

    render() {

        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { action } = this.props;
        const { responseData, loading, disableBtn } = this.state;


        return (
            <Modal
                visible={this.props.visible}
                title={this.props.title}
                maskClosable={false}
                onCancel={disableBtn ? null : this.handleStandardCodeListCancel}
                onOk={this.handleSubmit}
                footer={[
                    <Button key="Cancel" name="Cancel" disabled={disableBtn} className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={this.handleStandardCodeListCancel}>
                        Cancel
                    </Button>,
                     (action == "Create") &&
                     <Button key="Clear" name="Clear" disabled={disableBtn} className='ant-btn sc-ifAKCX fcfmNQ ant-btn-default' style={{ float: 'left' }} onClick={clear}>
                        Clear
                    </Button>,
                    this.props.readOnly === false ? 
                        <Button disabled={disableBtn} name={action === "Create" ? getAddButtonText() : getSaveButtonText()} className='ant-btn sc-ifAKCX fcfmNQ saveBtn' onClick={this.handleSubmit}>
                        {action === "Create" ? getAddButtonText() : getSaveButtonText()}
                    </Button> : <div style={{ height: '32px' }}></div>,
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
                <ConfirmModal title="Update Standard CodeList" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditConfirmationModal} handleCancel={this.handleCancelEditConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />

            </Modal>
        );
    }
}

const WrappedApp = Form.create()(AddStandardCodeList);
export default WrappedApp;
