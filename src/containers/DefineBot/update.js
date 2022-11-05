import React, { Component } from 'react';
import { Button, Select, Layout, Form, Breadcrumb, Icon, Spin } from 'antd';
import LayoutContent from '../../components/utility/layoutContent';
import { CallServerPost, PostCallWithZone, errorModal, successModal, successModalCallback, PostCallWithZoneForDomainCreate } from '../Utility/sharedUtility';
import SingleForm from '../Utility/defineBotForm';
import ChangeReason from './confirmation';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;
var cmnFieldJson = {};
var cmntresponseData = {};
var metdFieldJson = {};
var metdresponseData = {};
var validValues = [];
class AddMethod extends Component {
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
                show: false,
                readOnly: true

            }

        thisObj = this;

        //fn call to get the form field on ready
        thisObj.getFormFieldList(thisObj.props);

    }

    //fn call to get the list on click
    static getDerivedStateFromProps(nextProps) {
        if (thisObj.props.ID != nextProps.ID) {
            thisObj.props.form.resetFields();
            thisObj.props = nextProps;
            thisObj.setState({ show: false, loading: false, display: "flex", responseData: { formData: {} } });
            thisObj.getFormFieldList(nextProps);
        }
    }

    getUrlData = (props, getFor) => {
        switch (props.pageName) {
            case "Method":
                var action = "";
                if (getFor == "form") {
                    return { url: "Method/GetMethodFormData", formData: "formData_method", data: { FormName: "MethodDescription", ActionName: props.action, StudyID: JSON.parse(sessionStorage.studyDetails).studyID, ID: props.ID, StandardName: sessionStorage.standard } }
                }
                else {
                    if (props.action == "Create") {
                        return { url: "Method/CreateMethodData", data: { FormName: "MethodDescription", ActionName: props.action } }

                    }
                    else {
                        return { url: "Method/UpdateMethodData", data: { FormName: "MethodDescription", ActionName: props.action } }
                    }
                }
                break;

            case "Comment":
                if (getFor == "form") {
                    return { url: "Comment/GetCommentFormData", formData: "formData_comment", data: { FormName: "CommentDescription", ActionName: props.action, StudyID: JSON.parse(sessionStorage.studyDetails).studyID, ID: props.ID, StandardName: sessionStorage.standard } }
                }
                else {
                    if (props.action == "Create") {
                        return { url: "Comment/CreateCommentData", data: { FormName: "MethodDescription", ActionName: props.action } }

                    }
                    else {
                        return { url: "Comment/UpdateCommentData", data: { FormName: "MethodDescription", ActionName: props.action } }

                    }
                }
                break;
            default:
                break;

        }
    }

    //fn to get the list
    getFormFieldList = (props) => {

        const { url, action, data, formData } = thisObj.getUrlData(props, "form");
        CallServerPost(url, data).then(
            function (response) {
                var result = response.value;
                //console.log(formData);
                if (result.status == 0) {
                    thisObj.setState({
                        show: false, loading: false, display: "none"
                    });
                    errorModal(result.message);
                } else {
                    if (Object.keys(response.value).length != 0) {
                        thisObj.fnNameReadyValidation(result[formData]);
                        //set state to render the page
                        thisObj.setState({
                            show: true, responseData: ({ formData: result[formData], selectOptions: result.selectOptions }), ConditionOptions: result.ConditionOptions, loading: false, display: "none"
                        });
                    }
                    else {
                        thisObj.setState({
                            show: false, loading: false, display: "none"
                        });
                    }

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

    handleValidate = (e) => {
        e.preventDefault();
        const thisObj = this;

        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                if (thisObj.props.action == "Update") {
                    validValues = values;

                    if (thisObj.MethodCreateFor()) {
                        thisObj.setState({ confirmation: true, });
                    }
                    else {
                        errorModal("Please select anyone of the Reference")
                    }

                }
                else {
                    thisObj.handleUpdate(null);
                }
            }
        })
    }

    MethodCreateFor = () => {
        const thisObj = this;
        let check = false;
        var getFieldValue = thisObj.props.form.getFieldValue;
        if (thisObj.props.pageName == "Comment") {
            if (getFieldValue("ReferenceVariable").length > 0 || getFieldValue("ReferenceValueList").length > 0 || getFieldValue("ReferenceDomain").length > 0 || getFieldValue("ReferenceWhereClause").length > 0) {
                check = true;
            }
        } else if (thisObj.props.pageName == "Method") {
            if (getFieldValue("ReferenceVariable").length > 0 || getFieldValue("ReferenceValueList").length > 0) {
                check = true;
            }
        }

        return check;
    }

    //Validate the current page fields
    handleUpdate = (changeReason) => {

        const thisObj = this;
        var elementID = 0

        //thisObj.setState({ loading: true, display: "flex" });
        var dataString = JSON.stringify(thisObj.state.responseData.formData);
        this.setState({ popupLoading: true })

        thisObj.props.form.validateFields((err, values) => {
            const value = values;
            var formFields = JSON.parse(dataString);
            if (!err) {
                if (thisObj.MethodCreateFor()) {

                    if (changeReason == null) {
                        thisObj.setState({ loading: true, display: "flex" });
                    } else {
                        thisObj.setState({ popupLoading: true, display: "flex" });

                    }


                    formFields.forEach(function (key, index) {
                        const fieldName = key["displayName"].replace(/ /g, "");


                        if (thisObj.props.action == "Create") {
                            key["changed"] = true;

                        }
                        else {
                            if (key["defaultValue"] == "" || key["defaultValue"] == null) {
                                if (value[fieldName] != "" && value[fieldName] != null) {
                                    key["changed"] = true;
                                }
                            }
                            else if (value[fieldName] != key["defaultValue"]) {
                                key["changed"] = true;
                            }
                        }


                        if (key.controlTypeText == "MultipleDropdown") {
                            var temp = thisObj.state.responseData.selectOptions;
                            var val = value[fieldName];
                            var tempvar = [];

                            val.forEach(function (keys, index) {
                                tempvar.push(temp[key.attributeName.toLocaleLowerCase()].filter(obj => obj.keyValue == val[index])[0].literal);
                            });

                            key["defaultText"] = tempvar.toString();
                        }
                        else {
                            key[thisObj.props.pageName.toLocaleLowerCase()] = true;
                        }

                        if (key.attributeName == "leafID") {
                            var temp = thisObj.state.responseData.selectOptions[key.attributeName.toLocaleLowerCase()];
                            (temp || []).forEach(function (keys, index) {
                                if (keys["keyValue"] == value[fieldName]) {
                                    key["defaultValue"] = keys["keyValue"];
                                    key["defaultText"] = null;
                                } else if (value[fieldName] === null){
                                    key["defaultValue"] = null;
                                    key["defaultText"] = null;
                                }
                            });
                        }
                        else {
                            key["defaultValue"] = (value[fieldName] !== null && value[fieldName] !== "") ? value[fieldName].toString() : value[fieldName];
                        }

                        key["timeZone"] = "IST";
                        key["changeReason"] = changeReason;

                        key["updatedBy"] = JSON.parse(sessionStorage.userProfile).userID;
                    })

                    //var data = thisObj.state.responseData.formData.concat(cmnFieldJson, metdFieldJson);
                    const { url, action } = thisObj.getUrlData(thisObj.props, "update");


                    PostCallWithZoneForDomainCreate(url, formFields).then(
                        function (response) {
                            thisObj.setState({ popupLoading: false, loading: false, display: "none", confirmation: false });
                            const responseData = response;
                            if (responseData.status == 0) {

                                errorModal(responseData.message);
                            }
                            else {
                                successModalCallback(responseData.message, thisObj.Cancel);
                            }
                        }).catch(error => error);
                } else {
                    errorModal("Please select anyone of the Reference")
                }
            }
        });
    }


    fnNameReadyValidation = (data) => {
        var temp = data.find(x => x.displayName.toLowerCase().replace(/ /g, "") == "documentname").defaultValue;
        if (temp != "-1" && temp != "" && temp != null && temp != "--Select--") {
            data.forEach(function (key, index) {
                var value = key.attributeName.toLowerCase();
                if (value == "lastpage" || value == "pagerefs" || value == "type" || value == "firstpage") {

                    key.editable = true;
                }
            });
        }
    }

    handleReadOnlyToSave = () => {
        thisObj.setState({ readOnly: false });
    }
    handleSaveToReadOnly = () => {

        thisObj.props.form.resetFields();
        thisObj.setState({ readOnly: true, show: false, loading: true, display: "flex", responseData: { formData: {} } });
        thisObj.getFormFieldList(thisObj.props);

    }

    render() {
        const { show, responseData, loading, display, readOnly } = this.state;
        const { getFieldDecorator, defineActivityWorkflowStatus  } = this.props.form;
        const { action } = this.props;
        return (
            <div style={{ height: "100%", width: "100%" }}>
                {(show) ?
                    (Object.keys(responseData.formData).length > 0) ? (
                        <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                            <Breadcrumb>
                                <Breadcrumb.Item>
                                    <i className="ion-clipboard" />
                                    <span> {this.props.pageName}</span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>{this.props.action === "Create" ? "Add" : "Edit"}

                                </Breadcrumb.Item>
                            </Breadcrumb>
                            <div style={{ overflow: "auto", height: "100%", display: "flex", flexDirection: "column" }}>

                                {(this.props.action == "Create") && <SingleForm defineActivityWorkflowStatus={defineActivityWorkflowStatus}  isCreate={true} property={this} props={this} responseData={responseData} getFieldDecorator={getFieldDecorator} handleSubmit={this.handleValidate} handleCancel={this.props.cancel ? this.Cancel : ""} isStudyLock={this.props.isStudyLock} />}
                                {(this.props.action == "Update") && <SingleForm defineActivityWorkflowStatus={defineActivityWorkflowStatus}  property={this} ReadOnlyToSave={this.handleReadOnlyToSave} SaveToReadOnly={this.handleSaveToReadOnly} readOnly={readOnly} props={this} responseData={responseData} getFieldDecorator={getFieldDecorator} handleSubmit={this.handleValidate} handleCancel={this.props.cancel ? this.Cancel : ""} isStudyLock={this.props.isStudyLock} />}
                            </div>
                        </div>
                    ) : <div className="norecords">No fields are available to show</div> : ""}

                <ChangeReason loading={this.state.popupLoading} title={"Update " + this.props.pageName} onSubmit={this.handleUpdate} visible={this.state.confirmation} handleCancel={this.ConfirmationCancel} getFieldDecorator={getFieldDecorator} />

                {loading && <div className="customLoader" style={{ display: display }}>
                    <Spin indicator={antIcon} style={{ margin: "auto" }} size="default" spinning={true}></Spin>
                </div>}

            </div>
        )
    }
}
const WrappedApp = Form.create()(AddMethod);
export default WrappedApp;


