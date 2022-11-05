import React, { Component } from 'react';
import { Icon, Button, Spin, Form, Breadcrumb, Modal } from 'antd';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import LayoutContent from '../../../components/utility/layoutContent';
import { CallServerPost, PostCallWithZone, errorModal, successModal, successModalCallback, checkPermission, getAddButtonText, getSaveButtonText, showProgress, hideProgress } from '../../Utility/sharedUtility';
import ConfirmModal from '../../Utility/ConfirmModal';
import SingleForm from '../../Utility/SingleForm';
import Input from '../../../components/uielements/input';
import { clear } from '../../Utility/SingleForm';

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;

class AddCustomDomain extends Component {
    constructor(props) {

        super(props);
        this.state = {
            loading: false,
            showEditConfirmationModal: false,
            Domain: null,
            DomainDescription: null,
            Structure: null,
            Purpose: null,
            KeyVariables: null,
            Location: null,
            Repeating: null,
            ReferenceData: null,
            ProjectID: null,
            StudyID: null,
            responseData: {
                formData: {},
            },
            nextProp: true,
            modalLoad: false,
            disableBtn: false,
            selectOpt: "{}",
            study: []

        }
        thisObj = this;

        thisObj.getFormData(thisObj.props)
    }
    thisObj = this;


    getFormData = (data) => {
        if (data.action != "" && data.action != "Delete") {
            showProgress();
            CallServerPost('CDISCDataStdDomainMetadata/GetStandardFormData', { FormName: "CustomDomain", ActionName: data.action, ID: data.cDISCDataStdDomainMetadataID, Editable: (data.action === "Update") ? (data.readOnly) : false }).then(
                function (response) {
                    hideProgress();
                    const responseData = response.value;
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    } else {
                        let selectOpt = JSON.stringify(responseData.selectOptions);
                        responseData.selectOptions.studyid = [];
                        responseData.formData.filter(x => x.attributeName === "ProjectID").map(function (fd) {
                            fd.defaultValue = thisObj.props.property.parentprops.study.projectText;
                            fd.editable = false;
                        });
                        responseData.formData.filter(x => x.attributeName === "StudyID").map(function (fd) {
                            fd.defaultValue = thisObj.props.property.parentprops.study.studyName;
                            fd.editable = false;
                        });
                        let allStudy = [];
                        if (responseData.studies.length > 0) {
                            allStudy = responseData.studies.map(st => {
                                return ({
                                    attributeName: "StudyID",
                                    keyValue: st.studyID,
                                    projectID: st.projectID,
                                    literal: st.studyName,
                                })
                            })

                            let projectData = responseData.formData.filter(x => x.attributeName === "ProjectID" && x.defaultValue !== "");
                            if (data.action == "Update" && projectData.length > 0) {
                                responseData.selectOptions.studyid = allStudy.filter(x => x.projectID === parseInt(projectData[0].defaultValue));
                            }
                        }
                        thisObj.setState({ study: allStudy, selectOpt: selectOpt, nextProp: false, responseData: responseData, loading: false });
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

    handleStdDomainCancel = () => {
        thisObj.setState({
            nextProp: true, responseData: { formData: {} }
        });
        thisObj.props.form.resetFields();
        thisObj.props.handleCancel();
    }

    handleCancelEditConfirmationModal = () => {
        thisObj.setState({ showEditConfirmationModal: false });
        thisObj.props.form.resetFields(["Change Reason"]);

    }
    refreshTree = () => {
        thisObj.props.history();
        thisObj.handleStdDomainCancel();
        thisObj.handleCancelEditConfirmationModal();
        thisObj.setState({ loading: false });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const thisObj = this;

        if (thisObj.props.action == "Update") {
            thisObj.props.form.validateFields( { force: true }, (err, values) => {
                if (!err) {
                    thisObj.setState({
                        showEditConfirmationModal: true,
                        
                    });
                }
            });
        }
        else if (thisObj.props.action == "Create") {
            thisObj.props.form.validateFields( { force: true }, (err, values) => {
                if (!err) {
                    values["CDISCDataStdDomainClassID"] = parseInt(thisObj.props.cDISCDataStdDomainClassID.replace("class",""));
                    values["CDISCDataStdVersionID"] = parseInt(thisObj.props.cDISCDataStdVersionID);
                    values["ProjectID"] = values["ProjectID"] == null ? 0 : thisObj.props.property.parentprops.study.projectID;
                    values["StudyID"] = values["StudyID"] == null ? 0 : thisObj.props.property.parentprops.study.studyID;
                    values["Purpose"] = parseInt(values["Purpose"]);
                    values["Repeating"] = parseInt(values["Repeating"]);
                    values["ReferenceData"] = parseInt(values["ReferenceData"]);
                    thisObj.setState({ loading: true, disableBtn: true });
                    PostCallWithZone('CDISCDataStdDomainMetadata/Create', values)
                        .then(
                            function (response) {
                                thisObj.setState({ loading: false, disableBtn: false });
                                if (response.status == 1) {
                                    successModalCallback(response.message, thisObj.refreshTree);
                                    this.handleStdDomainCancel();
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
       
        values = thisObj.props.form.getFieldsValue();
        values["ChangeReason"] = ChangeReason;
        values["CDISCDataStdDomainClassID"] = parseInt(thisObj.props.cDISCDataStdDomainClassID.replace("class", ""));
        values["CDISCDataStdDomainMetadataID"] = parseInt(thisObj.props.cDISCDataStdDomainMetadataID);
        values["CDISCDataStdVersionID"] = parseInt(thisObj.props.cDISCDataStdVersionID);
        values["ProjectID"] = values["ProjectID"] == null ? 0 : thisObj.props.property.parentprops.study.projectID;
        values["StudyID"] = values["StudyID"] == null ? 0 : thisObj.props.property.parentprops.study.studyID;
        values["Purpose"] = parseInt(values["Purpose"]);
        values["Repeating"] = parseInt(values["Repeating"]);
        values["ReferenceData"] = parseInt(values["ReferenceData"]);
        values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;
        thisObj.setState({ modalLoad: true, loading: true, disableBtn: true });

        PostCallWithZone('CDISCDataStdDomainMetadata/Update', values)
            .then(
                function (response) {
                    thisObj.setState({ modalLoad: false, loading: false, disableBtn: false, showEditConfirmationModal: false });
                    if (response.status == 1) {
                        thisObj.props.handleCancel();
                        successModalCallback(response.message, thisObj.refreshTree);
                        thisObj.handleStdDomainCancel();
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
                title={this.props.title}
                width={850}
                maskClosable={false}
                style={{ top: "5vh" }}
                onCancel={disableBtn ? null : this.handleStdDomainCancel}
                onOk={this.handleSubmit}
                footer={[
                    <Button key="Cancel" name="Cancel" disabled={disableBtn} className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={this.handleStdDomainCancel}>
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
                                    <SingleForm property={this} responseData={responseData} getFieldDecorator={getFieldDecorator} />) : <div></div>
                        }

                        <ConfirmModal title="Update Domain" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditConfirmationModal} handleCancel={this.handleCancelEditConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />

                    </LayoutContentWrapper>

                </Spin>

            </Modal>
        );
    }
}
const WrappedApp = Form.create()(AddCustomDomain);
export default WrappedApp;