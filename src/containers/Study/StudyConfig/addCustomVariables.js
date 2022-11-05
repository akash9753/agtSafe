import React, { Component } from 'react';
import { Breadcrumb, Col, Button, Row, Select, Form, Steps, message, Modal, Icon, Spin } from 'antd';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import LayoutContent from '../../../components/utility/layoutContent';
import { CallServerPost, PostCallWithZone, errorModal, successModal, successModalCallback, showProgress, hideProgress, checkPermission, getAddButtonText, getSaveButtonText } from '../../Utility/sharedUtility';
import { rowStyle } from '../../../styles/JsStyles/CommonStyles';
import ConfirmModal from '../../Utility/ConfirmModal';
import SingleForm from '../../Utility/SingleForm';
import Input from '../../../components/uielements/input';
import { clear } from '../../Utility/SingleForm';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;
class AddCustomVariable extends Component {

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
            CallServerPost('CDISCDataStdVariableMetadata/GetVariableFormData', { FormName: "CustomVariable", ActionName: data.action, ID: data.CDISCDataStdVariableMetadataID, Editable: (data.action === "Update") ? (data.readOnly) : false }).then(
                function (response) {
                    thisObj.setState({ loading: false });
                    const responseData = response.value;
                    responseData.selectOptions.role = responseData.selectOptions.role.filter(x => x.cDISCDataStdVersionID === parseInt(thisObj.props.allParents["CDISCDataStdVersion"]));
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    } else {
                        let allStudy = [];
                        let studyCodeListVer = {
                                
                            keyValue: thisObj.props.property.parentprops.study.codelistVersionText,
                            literal: thisObj.props.property.parentprops.study.codelistVersionText
                        }
                        responseData.selectOptions.codelistversion.push(studyCodeListVer);
                        responseData.selectOptions.studyid = [];
                        responseData.formData.filter(x => x.attributeName === "ProjectID").map(function (fd) {
                            fd.defaultValue = thisObj.props.property.parentprops.study.projectText;
                            fd.editable = false;
                        });
                        responseData.formData.filter(x => x.attributeName === "StudyID").map(function (fd) {
                            fd.defaultValue = thisObj.props.property.parentprops.study.studyName;
                            fd.editable = false;
                        });
                        //format
                        let codeListVersionData = responseData.formData.filter(x => x.attributeName === "CodeListVersion" && x.defaultValue !== null && x.defaultValue !== "" );
                        if (codeListVersionData.length > 0) {
                            thisObj.getNCICodeListData(codeListVersionData[0].defaultValue.toLocaleString(), responseData, false);
                        }
                        thisObj.setState({ study: allStudy, nextProp: false, responseData: responseData, loading: false });
                    }
                }).catch(error => error);
        }
    }

    getNCICodeListData = (codelistVersion, responseData, onchange) => {
        showProgress();
        CallServerPost('NCICodeList/GetGroupByVersion', { CodeListVersion: codelistVersion }).then(
            function (response) {
                hideProgress();
                if (response.status == 0) {
                    errorModal(response.message);
                } else {
                    let allCodelist;
                    if (response.value.length > 0) {

                        allCodelist = response.value.filter(x => x.group === true).map(st => {
                            return ({
                                attributeName: "Format",
                                keyValue: st.cdiscSubmissionValue,
                                literal: st.cdiscSubmissionValue + ' - ' + st.codelistName 
                            });
                        });
                    }
                    responseData.selectOptions.format = allCodelist;
                    
                    thisObj.setState({ responseData: responseData});
                }

            }).catch(error => error);

    }

    codeListVersionOnChange = (codelistVersion) => {
        let { responseData } = this.state;
        if (codelistVersion != null) {
            responseData.selectOptions.format = [];
            this.props.form.setFieldsValue({ "CodeListName": null, "Format": null });
            thisObj.getNCICodeListData(codelistVersion.toLocaleString(), responseData, true);
        } else {
            this.props.form.setFieldsValue({ "CodeListName": null, "Format": null });
            responseData.selectOptions.format = [];
            thisObj.setState({ responseData: responseData });
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
            thisObj.props.form.validateFields({ force: true }, (err, values) => {
                if (!err) {
                    thisObj.setState({
                        showEditConfirmationModal: true,
                       
                    });
                }
            });
        }
        else if (thisObj.props.action == "Create") {
            thisObj.props.form.validateFields({ force: true }, (err, values) => {
                if (!err) {

                    values["CDISCDataStdDomainMetadataID"] = parseInt(thisObj.props.CDISCDataStdDomainMetadataID);
                    values["CDISCDataStdDomainClassID"] = parseInt(thisObj.props.cdiscDataStdDomainClassID);
                    values["CDISCDataStdVersionID"] = parseInt(thisObj.props.allParents["CDISCDataStdVersion"]);
                    values["ProjectID"] = values["ProjectID"] == null ? 0 : thisObj.props.property.parentprops.study.projectID;
                    values["StudyID"] = values["StudyID"] == null ? 0 : thisObj.props.property.parentprops.study.studyID;

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
        let variableList = this.props.parentproperties;
        let values = {};
        values = thisObj.props.form.getFieldsValue();
        values["CDISCDataStdDomainClassID"] = parseInt(thisObj.props.cdiscDataStdDomainClassID);
        values["CDISCDataStdDomainMetadataID"] = parseInt(thisObj.props.CDISCDataStdDomainMetadataID);
        values["CDISCDataStdVersionID"] = parseInt(thisObj.props.allParents["CDISCDataStdVersion"]);
        values["ProjectID"] = values["ProjectID"] == null ? 0 : thisObj.props.property.parentprops.study.projectID;
        values["StudyID"] = values["StudyID"] == null ? 0 : thisObj.props.property.parentprops.study.studyID;
        values["ChangeReason"] = ChangeReason;
        values["CDISCDataStdVariableMetadataID"] = parseInt(thisObj.props.CDISCDataStdVariableMetadataID);
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
                width={850}
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
                                    <SingleForm property={this} codeListVersionOnChange={this.codeListVersionOnChange } responseData={responseData} getFieldDecorator={getFieldDecorator} />) : <div></div>
                        }
                    </LayoutContentWrapper>
                </Spin>
                <ConfirmModal title="Update Variable" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditConfirmationModal} handleCancel={this.handleCancelEditConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />
            </Modal>
        );
    }
}

const WrappedApp = Form.create()(AddCustomVariable);
export default WrappedApp;
