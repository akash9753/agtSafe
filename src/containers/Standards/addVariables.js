import React, { Component } from 'react';
import { Breadcrumb, Col, Button, Row, Select, Form, Steps, message, Modal, Icon, Spin } from 'antd';
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

class AddVariable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            showEditConfirmationModal: false,
            VariableName: null,
            VariableLabel: null,
            DataType: null,
            Origin: null,
            Format: null,
            Role: null,
            Core: null,
            ProjectID: null,
            StudyID: null,
            OrderNumber: 0,
            nextProp: true,
            responseData: {
                formData: {},
            },
            modalLoad: false,
            disableBtn: false,
            study: []
        }

        thisObj = this;
        thisObj.getFormData(thisObj.props)
    }

    getFormData = (data) => {
        if (data.action != "" && data.action != "Delete") {
            CallServerPost('CDISCDataStdVariableMetadata/GetVariableFormData', { FormName: "CDISCDataStdVariableMetadata", ActionName: data.action, ID: data.CDISCDataStdVariableMetadataID, Editable: (data.action === "Update") ? (data.readOnly) : false }).then(
                function (response) {
                    thisObj.setState({ loading: false });
                    const responseData = response.value;
                    responseData.selectOptions.role = responseData.selectOptions.role.filter(x => x.cDISCDataStdVersionID === parseInt(thisObj.props.allParents["CDISCDataStdVersion"]));
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    } else {
                        thisObj.setState({ study: [], nextProp: false, responseData: responseData, loading: false });
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

    handleStdVariableCancel = () => {
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
        this.setState({
            showEditConfirmationModal: false
        });
        this.props.form.resetFields();
        this.props.history();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const thisObj = this;

        if (thisObj.props.action == "Update") {
            thisObj.props.form.validateFields(["VariableName", "VariableLabel", "DataType", "Origin", "Format", "Role", "Core", "OrderNumber", "ProjectID", "StudyID"], { force: true }, (err, values) => {
                if (!err) {
                    thisObj.setState({
                        showEditConfirmationModal: true,
                        VariableName: values.VariableName,
                        VariableLabel: values.VariableLabel,
                        DataType: values.DataType,
                        Origin: values.Origin,
                        Format: values.Format,
                        Role: values.Role,
                        Core: values.Core,
                        OrderNumber: values.OrderNumber,
                        ProjectID: "0",
                        StudyID: "0"
                    });
                }
            });
        }
        else if (thisObj.props.action == "Create") {
            thisObj.props.form.validateFields(["VariableName", "VariableLabel", "DataType", "Origin", "Format", "Role", "Core", "OrderNumber", "ProjectID", "StudyID"], { force: true }, (err, values) => {
                if (!err) {

                    values["CDISCDataStdDomainMetadataID"] = thisObj.props.CDISCDataStdDomainMetadataID;
                    values["CDISCDataStdVersionID"] = thisObj.props.allParents["CDISCDataStdVersion"];
                    values["ProjectID"] = values["ProjectID"] == null ? "0" : values["ProjectID"];
                    values["StudyID"] = values["StudyID"] == null ? "0" : values["StudyID"];

                    thisObj.setState({ loading: true, disableBtn: true });

                    PostCallWithZone('CDISCDataStdVariableMetadata/Create', values)
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
        values["CDISCDataStdVariableMetadataID"] = thisObj.props.CDISCDataStdVariableMetadataID;
        values["CDISCDataStdDomainMetadataID"] = thisObj.props.CDISCDataStdDomainMetadataID;
        values["CDISCDataStdVersionID"] = thisObj.props.allParents.CDISCDataStdVersion;
        values["VariableName"] = thisObj.state.VariableName;
        values["VariableLabel"] = thisObj.state.VariableLabel;
        values["DataType"] = thisObj.state.DataType;
        values["Origin"] = thisObj.state.Origin;
        values["Format"] = thisObj.state.Format;
        values["Role"] = thisObj.state.Role;
        values["Core"] = thisObj.state.Core;
        values["ProjectID"] = "0";
        values["StudyID"] = "0";
        values["OrderNumber"] = thisObj.state.OrderNumber;
        values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;
        thisObj.setState({ modalLoad: true, loading: true, disableBtn: true });

        PostCallWithZone('CDISCDataStdVariableMetadata/Update', values)
            .then(
                function (response) {
                    thisObj.setState({ modalLoad: false, loading: false, disableBtn: false, showEditConfirmationModal: false });
                    if (response.status == 1) {
                        thisObj.props.handleCancel();
                        successModalCallback(response.message, thisObj.refreshTree);
                        thisObj.handleStandardCancel();
                    }
                    else {
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
                style={{ top: '5vh' }}
                maskClosable={false}
                title={this.props.title}
                cancelType='danger'
                onCancel={disableBtn ? null : this.handleStdVariableCancel}
                onOk={this.handleSubmit}
                footer={[
                    <Button key="Cancel" name="Cancel" disabled={disableBtn} className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={this.handleStdVariableCancel}>
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
                                    <SingleForm props={this} property={this}  responseData={responseData} getFieldDecorator={getFieldDecorator} />) : <div></div>
                        }
                    </LayoutContentWrapper>
                </Spin>
                <ConfirmModal title="Update Variable" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditConfirmationModal} handleCancel={this.handleCancelEditConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />
            </Modal>
        );
    }
}

const WrappedApp = Form.create()(AddVariable);
export default WrappedApp;
