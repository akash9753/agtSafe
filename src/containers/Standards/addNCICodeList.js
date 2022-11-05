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
import { fnUploadFiles, fnUploadCancel } from '../Topbar/Upload';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;
class AddNCICodeList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pageName:"NCICodeList",
            loading: true,
            format:".xml",
            showEditConfirmationModal: false,
            CodeListVersion: null,
            CodeListFilePath: null,
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
            CallServerPost('NCICodeList/GetNCICodeListFormData', { FormName: "NCICodeList", ActionName: data.action, ID: data.nCICodeListID, Editable: (data.action === "Update") ? (data.readOnly) : false}).then(
                function (response) {
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

    handleNCICodeListCancel = () => {
        thisObj.setState({
            nextProp: true, responseData: { formData: {} }
        });
        fnUploadCancel();
        thisObj.props.form.resetFields();
        thisObj.props.handleCancel();
    }

    handleCancelEditConfirmationModal = () => {
        this.setState({ showEditConfirmationModal: false, disableBtn: false });
        this.props.form.resetFields(["Change Reason"]);

    }

    showListPage = () => {
        this.handleNCICodeListCancel();
        this.handleCancelEditConfirmationModal();
        this.setState({ title: "NCI Code List", showAddStandardModal: false, cdiscDataStandardID: thisObj.props.stdIDForCreateAndUpdate, showNCICodeList: true })
    }

    

    handleSubmit = (e) => {     
        e.preventDefault();
        const thisObj = this;

        if (thisObj.props.action == "Update") {
            thisObj.props.form.validateFields(["CodeListVersion", "CodeListFilePath"], { force: true }, (err, values) => {
                if (!err) {
                    thisObj.setState({ showEditConfirmationModal: true, CodeListVersion: values.CodeListVersion, CodeListFilePath: values.CodeListFilePath, disableBtn: true });
                }
            });
        }
        else if (thisObj.props.action == "Create") {
            thisObj.props.form.validateFields(["CodeListVersion", "CodeListFilePath"], { force: true }, (err, values) => {
                if (!err) {
                    thisObj.setState({ loading: true, disableBtn: true });
                    values["CDISCDataStandardID"] = thisObj.props.stdIDForCreateAndUpdate;
                    fnUploadFiles(values, thisObj.handleCreateUpdate, thisObj.onCancelIfErrorOccur);
                   
                }
            });
        }
    }

    onCancelIfErrorOccur = () => {
        this.setState({ modalLoad: false, disableBtn: false, loading: false });
    }

    handleCreateUpdate = (values) => {

        const thisObj = this;
        var url = "NCICodeList/" + thisObj.props.action;

        PostCallWithZone(url, values)
            .then(
            function (response) {
                thisObj.setState({ modalLoad: false, disableBtn: false, loading: false });
                if (response.status == 1) {
                    fnUploadCancel();
                    successModalCallback(response.message, thisObj.showListPage);
                }
                else {
                    errorModal(response.message);
                }
            }).catch(error => error);
    }

    handleUpdate = (ChangeReason) => {
        const thisObj = this;
    
        let values = {};
        values["ChangeReason"] = ChangeReason;
        thisObj.setState({ modalLoad: true, diableBtn: true, showEditConfirmationModal: false });

                values["NCICodeListID"] = thisObj.props.nCICodeListID;
                values["CDISCDataStandardID"] = thisObj.props.stdIDForCreateAndUpdate;
                values["CodeListVersion"] = thisObj.state.CodeListVersion;
                values["CodeListFilePath"] = thisObj.state.CodeListFilePath;
                values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;
                fnUploadFiles(values, thisObj.handleCreateUpdate, thisObj.onCancelIfErrorOccur);

           
    }

    render() {

        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { responseData, loading, disableBtn } = this.state;
        const { action } = this.props;


        return (
            <Modal
                visible={this.props.visible}
                title={this.props.title}
                maskClosable={false}
                onCancel={disableBtn ? null : this.handleNCICodeListCancel}
                onOk={this.handleSubmit}
                footer={[
                    <Button key="Cancel" name="Cancel" disabled={disableBtn} className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={this.handleNCICodeListCancel}>
                        Cancel
                    </Button>,
                     (action == "Create") &&
                     <Button key="Clear" name="Clear" disabled={disableBtn} className='ant-btn sc-ifAKCX fcfmNQ ant-btn-default' style={{ float: 'left' }} onClick={clear}>
                        Clear
                    </Button>,
                    this.props.readOnly === false ? 
                        <Button className='ant-btn sc-ifAKCX fcfmNQ saveBtn' name={action === "Create" ? getAddButtonText() : getSaveButtonText()} disabled={disableBtn} onClick={this.handleSubmit}>
                        {action === "Create" ? getAddButtonText() : getSaveButtonText()}
                    </Button> : <div style={{ height: '32px' }}></div>,
                ]}
            >
                <Spin indicator={antIcon} spinning={loading}>

                    <LayoutContentWrapper>
                        {

                            (this.props.action != "") ?
                                Object.keys(responseData.formData).length > 0 && (
                                    <SingleForm  property={this} props={this} responseData={responseData} getFieldDecorator={getFieldDecorator} />) : <div></div>

                        }


                    </LayoutContentWrapper>
                </Spin>
                <ConfirmModal title="Update NCI CodeList" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditConfirmationModal} handleCancel={this.handleCancelEditConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad}/>

            </Modal>
        );
    }
}

const WrappedApp = Form.create()(AddNCICodeList);
export default WrappedApp;
