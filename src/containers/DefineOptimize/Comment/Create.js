import React, { Component } from 'react';
import { Form, Breadcrumb, Icon, Spin } from 'antd';
import {
    CallServerPost,
    PostCallWithZone,
    errorModal,
    successModal,
    getStudyID,
    successModalCallback, PostCallWithZoneForDomainCreate, hideProgress, showProgress
} from '../../Utility/sharedUtility';
import SingleForm from '../../Utility/defineBotForm';
import ChangeReason from '../confirmation';

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;

class AddMethod extends Component {
    constructor(props) {
        super(props);
        this.state =
        {
            //current page field list
            responseData: {
                formData: {},
            },
            //
            validValues: [],

            confirmation: false,
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
            thisObj.setState({ responseData: { formData: {} } });
            thisObj.getFormFieldList(nextProps);
        }
    }

    //fn to get the list
    getFormFieldList = (props) => {
        let data = {
            FormName: "CommentDescription",
            ActionName: "Create",
            StudyID: getStudyID(),
            ID: props.ID,
            StandardName: sessionStorage.standard
        }

        showProgress();
        CallServerPost("Comment/GetCommentFormData", data).then(
            function (response) {
                hideProgress();
                var result = response.value;
                //console.log(formData);
                if (result.status == 0) {

                    errorModal(result.message);
                }
                else {

                    thisObj.fnNameReadyValidation(result["formData_comment"]);
                    //set state to render the page
                    thisObj.setState({
                        responseData: ({ formData: result["formData_comment"], selectOptions: result.selectOptions }), ConditionOptions: result.ConditionOptions
                    });

                }
            }).catch(error => error);
    }

    handleValidate = (e) =>
    {
        e.preventDefault();
        const thisObj = this;
        var dataString = JSON.stringify(thisObj.state.responseData.formData);
        showProgress();
        thisObj.props.form.validateFields((err, value) => {
            if (!err) {

                var formFields = JSON.parse(dataString);

                if (thisObj.MethodCreateFor()) {
                    formFields.forEach(function (key, index) {
                        const fieldName = key["displayName"].replace(/ /g, "");
                        key["changed"] = true;
                        //get text of the dropdown option 
                        if (key.controlTypeText == "MultipleDropdown") {
                            var temp = thisObj.state.responseData.selectOptions;
                            var val = value[fieldName];
                            var tempvar = [];

                            val.forEach(function (keys, index) {
                                tempvar.push(temp[key.attributeName.toLocaleLowerCase()].filter(obj => obj.keyValue == val[index])[0].literal);
                            });

                            key["defaultText"] = tempvar.toString();
                        }
                        else
                        {
                            key["comment"] = true;
                        }

                        if (key.attributeName == "leafID") {
                            var temp = thisObj.state.responseData.selectOptions[key.attributeName.toLocaleLowerCase()];
                            (temp || []).forEach(function (keys, index)
                            {
                                if (keys["keyValue"] == value[fieldName])
                                {
                                    key["defaultValue"] = keys["keyValue"];
                                    key["defaultText"] = null;
                                }
                                else if (value[fieldName] === null) {
                                    key["defaultValue"] = null;
                                    key["defaultText"] = null;
                                }
                            });
                        }
                        else {
                            key["defaultValue"] = value[fieldName] ? value[fieldName].toString() : value[fieldName];
                        }

                        key["timeZone"] = "IST";
                        key["changeReason"] = "Create";

                        key["updatedBy"] = JSON.parse(sessionStorage.userProfile).userID;
                    });

                    //var data = thisObj.state.responseData.formData.concat(cmnFieldJson, metdFieldJson);

                    PostCallWithZoneForDomainCreate("Comment/CreateCommentData", formFields).then(
                        function (response) {
                            hideProgress()
                            thisObj.setState({ popupLoading: false, loading: false, display: "none", confirmation: false });
                            const responseData = response;
                            if (responseData.status == 0) {

                                errorModal(responseData.message);
                            }
                            else {
                                successModalCallback(responseData.message, thisObj.props.refresh);
                            }
                        }).catch(error => error);
                }
                else {
                    hideProgress();
                    errorModal("Please select anyone of the Reference")
                }


            }
            else {
                hideProgress();
            }
        })
    }

    MethodCreateFor = () =>
    {
        const thisObj = this;
        let check = false;
        var getFieldValue = thisObj.props.form.getFieldValue;

            if (getFieldValue("ReferenceVariable").length > 0 || getFieldValue("ReferenceValueList").length > 0 || getFieldValue("ReferenceDomain").length > 0 || getFieldValue("ReferenceWhereClause").length > 0) {
                check = true;
            }
       

        return check;
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


    render() {
        const {  responseData } = this.state;
        const { getFieldDecorator, defineActivityWorkflowStatus } = this.props.form;

        return (
            <div style={{ height: "100%", width: "100%" }}>
                {
                    (Object.keys(responseData.formData).length > 0) && (
                        <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                            <Breadcrumb>
                                <Breadcrumb.Item>
                                    <i className="ion-clipboard" />
                                    <span> Comment</span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item> Add
                                </Breadcrumb.Item>
                            </Breadcrumb>
                            <div style={{ overflow: "auto", height: "100%", display: "flex", flexDirection: "column" }}>
                                {
                                    <SingleForm
                                        defineActivityWorkflowStatus={defineActivityWorkflowStatus}
                                        isCreate={true}
                                        property={this}
                                        props={this}
                                        responseData={responseData}
                                        getFieldDecorator={getFieldDecorator}
                                        handleSubmit={this.handleValidate}
                                        handleCancel={thisObj.props.backToList}
                                        isStudyLock={this.props.isStudyLock}
                                    />
                                }
                            </div>
                        </div>
                    )}

            </div>
        )
    }
}
const WrappedApp = Form.create()(AddMethod);
export default WrappedApp;


