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

class AddXsltConfiguratinFile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            format: ".xslt",
            showEditConfirmationModal: false,
            responseData: {
                formData: {},
            },
            //nextProp: true,
            modalLoad: false,
            disableBtn: false
        }
        thisObj = this;
        thisObj.getFormData(thisObj.props)
    }
    getFormData = (data) => {
        if (data.action != "" && data.action != "Delete") {
            thisObj.setState({ loading: true });
            CallServerPost('XsltConfigurationFiles/GetXsltConfigurationFileFormData', { FormName: "XsltConfigurationFiles", ActionName: data.action, ID: data.xsltConfigurationFileID, Editable: (data.action === "Update") ? (data.readOnly) : false }).then(
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

    xsltConfigurationFilesCancel = () => {
        thisObj.setState({
           responseData: { formData: {} }
        });
        fnUploadCancel();
        thisObj.props.form.resetFields();
        thisObj.props.handleCancel();
    }

    showListPage = () => {
        this.xsltConfigurationFilesCancel();
    }


    handleCreateUpdate = (values) => {
        const thisObj = this;
        var url = "XsltConfigurationFiles/" + thisObj.props.action;

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

    onCancelIfErrorOccur = () => {
        this.setState({ modalLoad: false, disableBtn: false, loading: false });
    }

    handleSubmit = (e) => {
        const thisObj = this;
        if (thisObj.props.action == "Update") {
            thisObj.props.form.validateFields(["StandardName", "DefineVersionID", "XsltFile","XsltFileType"], { force: true }, (err, values) => {
                if (!err) {
                    thisObj.setState({ showEditConfirmationModal : true });
                }
            });
        }
        else if (thisObj.props.action == "Create") {
            let Val = {};
            thisObj.props.form.validateFields(["StandardName", "DefineOutputType", "XsltFile","XsltFileType"], { force: true }, (err, values) => {
                if (!err) {
                    thisObj.setState({ loading: true, disableBtn: true });
                    values["CDISCDataStandardID"] = values["StandardName"];
                    values["DefineVersionID"] = values["DefineOutputType"];
                    fnUploadFiles(values, thisObj.handleCreateUpdate, thisObj.onCancelIfErrorOccur);
                }
            });
        }
    }

    handleUpdate = (ChangeReason) => {
        const thisObj = this;
        const getStandardID = (text) => {
            var getID = "";
            thisObj.state.responseData.selectOptions.standardname.map(function (val, keys) {
                if (val.literal == text) {
                    getID = val.keyValue;
                }
            });
            return getID;
        }
        let values = {};

        thisObj.props.form.validateFields(["StandardName", "DefineVersionID", "XsltFile", "XsltFileType"], { force: true }, (err, values) => {
            const checkIntOrString = parseInt(values["StandardName"]);
            if (!err) {
                thisObj.setState({ modalLoad: true, disableBtn: true });
                values["XsltConfigurationFileID"] = thisObj.props.xsltConfigurationFileID;
                values["CDISCDataStandardID"] = isNaN(checkIntOrString) ? getStandardID(values["StandardName"]) : values["StandardName"];
                values["ChangeReason"] = ChangeReason;
                values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;
                fnUploadFiles(values, thisObj.handleCreateUpdate, thisObj.onCancelIfErrorOccur);
            }
        });      

    }
    handleCancelEditModal = () => {
        thisObj.setState({ showEditConfirmationModal: false });
        thisObj.props.form.resetFields();
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
                onCancel={disableBtn ? null : this.xsltConfigurationFilesCancel}
                onOk={this.handleSubmit}
                footer={[
                    <Button className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={this.xsltConfigurationFilesCancel}>
                        Cancel
                    </Button>,
                    (action === "Create") &&
                    <Button className='ant-btn sc-ifAKCX fcfmNQ ant-btn-default' style={{ float: 'left' }} onClick={clear}>
                        Clear
                    </Button>,
                    (this.props.readOnly === false ? <Button className="ant-btn saveBtn sc-ifAKCX fcfmNQ" onClick={this.handleSubmit}>
                        {action === "Create" ? getAddButtonText() : getSaveButtonText() }
                    </Button> : <div style={{ height: '32px' }}></div>),
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
                <ConfirmModal title="Update Xslt Configuration" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditConfirmationModal} handleCancel={this.handleCancelEditModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />
            </Modal>
        );
    }
}

const WrappedApp = Form.create()(AddXsltConfiguratinFile);
export default WrappedApp;