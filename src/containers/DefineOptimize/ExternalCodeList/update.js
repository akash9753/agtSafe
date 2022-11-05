import React, { Component } from 'react';
import { Form, Breadcrumb, Icon, Spin, Tooltip } from 'antd';
import {
    CallServerPost,
    errorModal,
    successModalCallback,
    PostCallWithZoneForDomainCreate,
    showProgress,
    hideProgress,
    errorModalCallback
} from '../../Utility/sharedUtility';
import SingleForm from '../../Utility/defineBotForm';
import Confirmation from '../confirmation';
import { DefineContext } from '../context';


var thisObj;
var cmnFieldJson = {};
var metdFieldJson = {};

class ExternalCodeList extends Component
{
    static contextType = DefineContext;

    constructor(props) {
        super(props);
        this.state =
            {
                loading: true,
                //current page field list
                responseData: {
                    formData: {},
                },

                //
                validValues: [],

                confirmation: false,
                popupLoading: false,
                display: "flex",
                readOnly:true,
                show: false
            }

        thisObj = this;

        //fn call to get the form field on ready
        thisObj.getFormFieldList(thisObj.props);

    }

    //fn call to get the list on click
    static getDerivedStateFromProps (nextProps) {
        if (thisObj.props.ID != nextProps.ID) {
            thisObj.props.form.resetFields();

            thisObj.props = nextProps;
            thisObj.setState({ readOnly: true,show: false, loading: true, display: "flex", responseData: { formData: {} } });
            thisObj.getFormFieldList(nextProps);
        }
    }

    //fn to get the list
    getFormFieldList = (props) =>
    {

        showProgress();
        CallServerPost('CodeList/GetExternalCodeListFormData',
            {
                FormName: "ExternalCodeList",
                ActionName: "Update",
                ID: props.ID,
                studyID: JSON.parse(sessionStorage.studyDetails).studyID, StandardName: sessionStorage.standard
            }).then(
            function (response)
            {
                hideProgress();

                //console.log(response);
                    var result = response.value;
                    if (response.status == 0 || (result.formData_codelist &&
                        typeof result.formData_codelist === "object" &&
                        Object.keys(result.formData_codelist).length === 0))
                    {
                        let msg = response.message;
                        errorModalCallback(msg ? msg : "No fields are available to show", () => thisObj.props.backToList());
                    }
                    else
                    {
                        //set state to render the page
                        thisObj.setState({
                            show: true, responseData: ({ formData: result.formData_codelist, selectOptions: result.selectOptions })
                        });
                    }
            }).catch(error => error);
    }

    //fn for GetCodeListGroupData
    GetCodeListGroupData = (key) =>
    {
        showProgress();
        CallServerPost('CodeList/GetExternalCodeListGroupData', { FormName: "ExternalCodeList", ActionName: "Create", ID: key }).then(
            function (response)
            {
                hideProgress();
                if (response.status == 1) {

                    thisObj.props.form.setFieldsValue(response.value)

                }
                else {
                    //errorModal(responseData.message);
                }
            }).catch(error => error);
    }

    //fn for Domain Cancel
    Cancel = () => {
        thisObj.setState({ readOnly: true, loading: true, display: "flex" });
        thisObj.props.refresh(thisObj.props.directClick);
    }

    //Cancel confirmation popup
    ConfirmationCancel = (e) => {
        thisObj.props.form.resetFields(["Change Reason"])
        thisObj.setState({ confirmation: false })
    }

    //Validate the current page fields
    handleValidate = (e) => {
        e.preventDefault();
        const thisObj = this;
        var elementID = 0;
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                thisObj.setState({ confirmation: true, validValues: values })
            }
        });
    }

    handleReadOnlyToSave = () => {
        thisObj.setState({ readOnly: false });
    }

    handleSaveToReadOnly = () => {

        thisObj.props.form.resetFields();
        thisObj.setState({ readOnly: true, show: false, loading: true, display: "flex", responseData: { formData: {} } });
        thisObj.getFormFieldList(thisObj.props);

    }
    //fn for Domain Create
    handleUpdate = (changeReason) =>
    {
        const thisObj = this;
        var validValues = thisObj.state.validValues;
        //thisObj.setState({popupLoading: true});
        this.setState({ popupLoading: true })

        thisObj.state.responseData.formData.forEach(function (key, index) {
            const fieldName = key["displayName"].replace(/ /g, "");

            if (key["defaultValue"] == "" || key["defaultValue"] == null) {
                if (validValues[fieldName] != "" && validValues[fieldName] != null) {
                    key["changed"] = true;
                }
            }
            else if (validValues[fieldName] != key["defaultValue"]) {
                key["changed"] = true;
            }

            key["defaultValue"] = validValues[fieldName] ? validValues[fieldName].toString() : validValues[fieldName];
            key["timeZone"] = "IST";
            key["changeReason"] = changeReason;
            key["updatedBy"] = JSON.parse(sessionStorage.userProfile).userID;
        })

        var url = "CodeList/UpdateExternalCodeListData";
        showProgress();
        PostCallWithZoneForDomainCreate(url, thisObj.state.responseData.formData.concat(cmnFieldJson)).then(
            function (response)
            {
                hideProgress();
                const responseData = response;
                if (responseData.status == 0) {
                    thisObj.setState({ popupLoading: false });
                    errorModal(responseData.message);
                }
                else {
                    thisObj.setState({ popupLoading: false, confirmation: false });
                    successModalCallback(responseData.message, thisObj.props.refresh);
                }
            }).catch(error => error);
    }

    navigate = (navigate) => {
        let { navigateByPrevNext } = this.context;
        let { ID } = this.props;
        navigateByPrevNext(navigate, ID);
    }

    render() {
        var { responseData, loading, display, show,readOnly } = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { prev, next, backToList } = this.props;
        let { defineActivityWorkflowStatus,back } = this.context;

        return (
            <div style={{ height: "100%", width: "100%" }}>
                {
                    (show) &&
                    (Object.keys(responseData.formData).length > 0) && (
                        <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                            <Breadcrumb>
                                <Breadcrumb.Item>
                                    <i className="ion-clipboard" />
                                    <span> External Codelist</span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>Edit
                                        {
                                        <span style={{ float: 'right' }}>
                                            {prev &&
                                                <Tooltip title="Prev"> <Icon type="caret-left" theme="outlined" id='left' className={"defineRightLeftIcon"} style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => this.navigate("prev")} /></Tooltip>}
                                            {next &&
                                                <Tooltip title="Next"><Icon type="caret-right" theme="outlined" id='right' className={"defineRightLeftIcon"} style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => this.navigate("next")} /></Tooltip>}
                                        </span> 
                                    }
                                </Breadcrumb.Item>
                            </Breadcrumb>
                            <div style={{ overflow: "auto", height: "100%", display: "flex", flexDirection: "column" }}>
                                <SingleForm defineActivityWorkflowStatus={defineActivityWorkflowStatus}
                                    ReadOnlyToSave={this.handleReadOnlyToSave}
                                    SaveToReadOnly={this.handleSaveToReadOnly}
                                    readOnly={readOnly}
                                    property={this} props={this}
                                    responseData={responseData}
                                    getFieldDecorator={getFieldDecorator}
                                    handleSubmit={this.handleValidate}
                                    handleCancel={back ? backToList : ""}
                                    isStudyLock={this.props.isStudyLock} />
                                <Confirmation loading={this.state.popupLoading}
                                    title="Update External CodeList"
                                    onSubmit={this.handleUpdate}
                                    visible={this.state.confirmation}
                                    handleCancel={this.ConfirmationCancel}
                                    getFieldDecorator={getFieldDecorator}
                                />
                            </div>
                        </div>
                    )}
            </div>
        )
    }
}
const WrappedApp = Form.create()(ExternalCodeList);
export default WrappedApp;


