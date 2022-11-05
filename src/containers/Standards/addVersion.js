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

class AddVersion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            showEditConfirmationModal: false,
            StdVersionName: null,
            StdVersionDescription: null,
            responseData: {
                formData: {},
            },
            nextProp: true,
            allValues: {},
            modalLoad: false,
            disableBtn: false
        }

        thisObj = this;
        thisObj.getFormData(thisObj.props)
    }
    getFormData = (data) => {
        if (data.action != "" && data.action != "Delete") {
            CallServerPost('CDISCDataStdVersion/GetVersionFormData', { FormName: "CDISCDataStdVersion", ActionName: data.action, ID: data.cDISCDataStdVersionID, Editable: (data.action === "Update") ? (data.readOnly) : false }).then(
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
    

    componentWillReceiveProps(nextProps) 
    {
       
        if (thisObj.state.nextProp && nextProps.action != "" && (nextProps.action == "Create" || nextProps.action == "Update")) {
            thisObj.setState({
                nextProp: false
            });
                thisObj.getFormData(nextProps);            
        }
    }

    handleStdVersionCancel = () => {
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

    refreshTree = () => {
        this.handleStdVersionCancel();
        this.handleCancelEditConfirmationModal();
        this.setState({ loading: false }); 
        this.props.history();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const thisObj = this;

        if (thisObj.props.action == "Update") {
            thisObj.props.form.validateFields(["StdVersionName", "StdVersionDescription"], { force: true }, (err, values) => {
                if (!err) {
                    thisObj.setState({ showEditConfirmationModal: true, StdVersionName: values.StdVersionName, StdVersionDescription: values.StdVersionDescription });
                }
            });
        }
        else if (thisObj.props.action == "Create") {
            thisObj.props.form.validateFields(["StdVersionName","StdVersionDescription"], { force: true }, (err, values) => {
                if (!err) {
                    thisObj.setState({ loading: true, disableBtn: true }); 

                    values["CDISCDataStandardID"] = thisObj.props.stdIDForCreateAndUpdate;
                    PostCallWithZone('CDISCDataStdVersion/Create', values)
                        .then(
                        function (response) {
                            thisObj.setState({ loading: false, disableBtn: false }); 
                            if (response.status == 1) {
                                successModalCallback(response.message, thisObj.refreshTree);
                            }
                            else {
                                errorModal(response.message);
                            }
                        }).catch(error => error);
                }
            });
        }
    }

    handleUpdate = (ChangeReason) => {
        const thisObj = this;
        let values = {};
        values["ChangeReason"] = ChangeReason;
        values["CDISCDataStdVersionID"] = thisObj.props.cDISCDataStdVersionID;
        values["CDISCDataStandardID"] = thisObj.props.stdIDForCreateAndUpdate;
        values["StdVersionName"] = thisObj.state.StdVersionName;
        values["StdVersionDescription"] = thisObj.state.StdVersionDescription;
        values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;
        thisObj.setState({ loading: true, disableBtn: true, modalLoad: true }); 

        PostCallWithZone('CDISCDataStdVersion/Update', values)
            .then(
            function (response) {
                thisObj.setState({ loading: false, disableBtn: false, modalLoad: false, showEditConfirmationModal: false }); 
                if (response.status == 1) {
                    thisObj.props.handleCancel();
                    successModalCallback(response.message, thisObj.refreshTree);
                    this.handleStandardCancel();
                } else {
                    errorModal(response.message);
                }
            }).catch(error => error);
            
    }

    render() {

        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { responseData, loading, disableBtn } = this.state;
        const { action } = this.props;

        return (
            <Modal
                visible={this.props.visible}
                maskClosable={false}
                title={this.props.title}
                onCancel={disableBtn ? null : this.handleStdVersionCancel}
                onOk={this.handleSubmit}
                style={{ top: "25vh" }}
                footer={[
                    <Button key="Cancel" disabled={disableBtn} name="Cancel" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{float:'left'}} onClick={this.handleStdVersionCancel}>
                        Cancel
                    </Button>,
                    (action == "Create") &&
                    <Button key="Clear" disabled={disableBtn} name="Clear" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-default' style={{ float: 'left' }} onClick={clear}>
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
                                    <SingleForm property={this} responseData={responseData} getFieldDecorator={getFieldDecorator} />) : <div></div>

                        }


                    </LayoutContentWrapper>
                </Spin>
                <ConfirmModal loading={this.state.modalLoad} title="Update Version" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditConfirmationModal} handleCancel={this.handleCancelEditConfirmationModal} getFieldDecorator={getFieldDecorator} />

            </Modal>
        );
    }
}

const WrappedApp = Form.create()(AddVersion);
export default WrappedApp;
