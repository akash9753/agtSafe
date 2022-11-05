import React, { Component } from 'react';
import { Breadcrumb, Button, Col, Row, Select, Form, Steps, message, Modal, Icon, Spin } from 'antd';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import LayoutContent from '../../../components/utility/layoutContent';
import { CallServerPost, PostCallWithZone, errorModal, successModal, successModalCallback, checkPermission, getAddButtonText, getSaveButtonText } from '../../Utility/sharedUtility';
import { rowStyle } from '../../../styles/JsStyles/CommonStyles';
import ConfirmModal from '../../Utility/ConfirmModal';
import SingleForm from '../../Utility/SingleForm';
import Input from '../../../components/uielements/input';
import { clear } from '../../Utility/SingleForm';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;

class AddStdDomainClass extends Component {
    constructor(props) {

        super(props);
        this.state = {
            loading: true,
            showEditConfirmationModal: false,
            DomainClassName: [],
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
            CallServerPost('CDISCDataStdDomainClass/GetStandardFormData', { FormName: "CDISCDataStdDomainClass", ActionName: data.action, ID: data.cDISCDataStdDomainClassID, Editable: (data.action === "Update") ? (data.readOnly) : false }).then(
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

    handleStdDomainClassCancel = () => {
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
        this.handleStdDomainClassCancel();
        this.handleCancelEditConfirmationModal();
        this.setState({ loading: false });
        this.props.history();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const thisObj = this;

        if (thisObj.props.action == "Update") {
            thisObj.props.form.validateFields(["DomainClassName"], { force: true }, (err, values) => {
                if (!err) {
                    if (values.DomainClassName === thisObj.props.domClass.domainClassName) {
                        errorModal("Nothing to update!")
                    } else {
                        thisObj.setState({ showEditConfirmationModal: true, DomainClassName: values.DomainClassName, OrderNumber: values.OrderNumber });
                    }
                    
                }
            });
        }
        else if (thisObj.props.action == "Create") {
            thisObj.props.form.validateFields(["DomainClassName"], { force: true }, (err, values) => {
                if (!err) {
                    values["CDISCDataStdVersionID"] = thisObj.props.versionIDForCreateAndUpdate;
                    values["ProjectID"] = thisObj.props.property.parentprops.study.projectID;
                    values["StudyID"] = thisObj.props.property.parentprops.study.studyID;
                    thisObj.setState({ loading: true, disableBtn: true });
                    PostCallWithZone('CDISCDataStdDomainClass/Create', values)
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
        values["CDISCDataStdDomainClassID"] = thisObj.props.domClass.cdiscDataStdDomainClassID;
        values["CDISCDataStdVersionID"] = thisObj.props.domClass.cdiscDataStdVersionID;
        values["ProjectID"] = thisObj.props.property.parentprops.study.projectID;
        values["StudyID"] = thisObj.props.property.parentprops.study.studyID;
        values["DomainClassName"] = thisObj.state.DomainClassName;
        values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;
        thisObj.setState({ loading: true, disableBtn: true, modalLoad: true });
        PostCallWithZone('CDISCDataStdDomainClass/Update', values)
            .then(
                function (response) {
                    thisObj.setState({ loading: false, disableBtn: false, modalLoad: false, showEditConfirmationModal: false });
                    if (response.status == 1) {
                        thisObj.props.handleCancel();
                        successModalCallback(response.message, thisObj.refreshTree);
                        thisObj.handleStandardCancel();
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
                title={this.props.title}
                style={{ top: "30vh" }}
                maskClosable={false}
                onCancel={disableBtn ? null : this.handleStdDomainClassCancel}
                onOk={this.handleSubmit}
                footer={[
                    <Button key="Cancel" name="Cancel" disabled={disableBtn} className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={this.handleStdDomainClassCancel}>
                        Cancel
                    </Button>,
                    (action == "Create") &&
                    <Button key="Clear" name="Clear" disabled={disableBtn} className='ant-btn sc-ifAKCX fcfmNQ ant-btn-default' style={{ float: 'left' }} onClick={clear}>
                        Clear
                    </Button>,
                    this.props.readOnly == false ?
                        <Button disabled={disableBtn} name={action === "Create" ? getAddButtonText() : getSaveButtonText()} className='ant-btn sc-ifAKCX fcfmNQ saveBtn' onClick={this.handleSubmit}>
                            {action === "Create" ? getAddButtonText() : getSaveButtonText()}
                        </Button> : <div style={{ height: '32px' }}></div>,
                ]}
            >
                <Spin indicator={antIcon} spinning={loading}>

                    <LayoutContentWrapper>
                        {

                            (this.props.action == "Create" || this.props.action == "Update") ?
                                Object.keys(responseData.formData).length > 0 && (
                                    <SingleForm property={this} versionID={this.props.versionIDForCreateAndUpdate} responseData={responseData} getFieldDecorator={getFieldDecorator} />) : <div></div>
                        }
                        <ConfirmModal title="Update Domain Class" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditConfirmationModal} handleCancel={this.handleCancelEditConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />

                    </LayoutContentWrapper>

                </Spin>

            </Modal>
        );
    }
}


const WrappedApp = Form.create()(AddStdDomainClass);
export default WrappedApp;
