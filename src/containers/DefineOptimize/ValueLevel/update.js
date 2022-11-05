import React, { Component } from 'react';
import { Button, Select, Breadcrumb, Form, Icon, Spin, Tooltip } from 'antd';
import LayoutContent from '../../../components/utility/layoutContent';
import { CallServerPost, PostCallWithZone, errorModal, successModal, successModalCallback, PostCallWithZoneForDomainCreate, showProgress, hideProgress } from '../../Utility/sharedUtility';
import SingleForm from '../../Utility/defineBotForm';
import DomainCmntPopUp from '../domainCmntPopUp.js';
import Confirmation from '../confirmation';
import { fnLoadOrigin } from '../../DefineBot/supportValidation.js';
import { DefineContext } from '../context';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;

class Update extends Component
{
    static contextType = DefineContext;

    constructor(props) {
        super(props);
        this.state =
            {
                stringData: "",
                //current page field list
                responseData: {
                    formData: {},
                    selectOptions: {}

                },

                //Comment Description pop up field list
                cmnFieldJson: {},
                cmntresponseData: {
                    formData: {},
                    selectOptions: {}
                },

                //Comment Description pop up field list
                metdFieldJson: {},
                metdresponseData: {
                    formData: {},
                    selectOptions: {}

                },
                //popupFields
                popupFields: {},
                //For Comment and Method pop up visible var
                showCmntMtdPop: false,

                //Title for both @Comment and @Method description
                title: "",
                validValues: [],
                confirmation: false,
                show: false,
                readOnly: true


            }

        thisObj = this;

        //fn call to get the form field on ready
        thisObj.getFormFieldList(thisObj.props);

    }

    //fn call to get the list on click
    static getDerivedStateFromProps(nextProps)
    {
        if (thisObj.props.ID != nextProps.ID)
        {
            thisObj.props.form.resetFields();

            thisObj.props = nextProps;
            thisObj.setState({ readOnly: true, responseData: { formData: {} } });
            thisObj.getFormFieldList(nextProps);
        }
    }

    //fn to get the list
    getFormFieldList = (props) =>
    {
        showProgress();
        CallServerPost('ValueLevelMetaData/GetValueLevelFormData',
            {
            FormName: "ValueLevelMetaData",
            ActionName: "Update",
            ID: props.ID,
            StudyID: JSON.parse(sessionStorage.studyDetails).studyID,
            StandardName: sessionStorage.standard
        }).then(
            function (response)
            {
                hideProgress();
                const result = response.value;
                if (response.status == 1)
                {
                    //fnLoadOrigin(result.formData_domain.find(x => x.attributeName === "Origin").defaultValue ,result.formData_domain)
                    //set state to render the page
                    thisObj.setState({
                        show: true,
                        stringData: JSON.stringify(result.formData_domain),
                        responseData: { formData: result.formData_domain, selectOptions: result.selectOptions },
                        cmntresponseData: { formData: result.formData_comment, selectOptions: result.selectOptions },
                        metdresponseData: { formData: result.formData_method, selectOptions: result.selectOptions },
                        loading: false, display: "none",
                        ConditionOptions: result.ConditionOptions
                    });
                    fnLoadOrigin(result.formData_domain.find(x => x.attributeName === "Origin").defaultValue, result.formData_domain, thisObj);

                    //Onclick fn to that comment button
                    (function () {
                        document.getElementById("CommentDescriptionConfirm").onclick = function () {
                            thisObj.cmntPopUp();
                        };
                        document.getElementById("MethodDescriptionConfirm").onclick = function () {
                            thisObj.metdPopUp();
                        };

                    })();


                } else {
                    errorModal(result.message);
                }
            }).catch(error => error);
    }


    //fn for Comment button to show the comment popup for @CommentDecription
    cmntPopUp = () =>
    {

        // Value of @TranslatedText is should be the value of @CommentDescription while open the Comment Pop up 
        thisObj.state.cmntresponseData.formData.find(x => x.attributeName === "TranslatedText").defaultValue = document.getElementById("CommentDescription").value;

        thisObj.setState({ title: "Comment", showCmntMtdPop: true, popupFields: thisObj.state.cmntresponseData });

    }


    metdPopUp = () =>
    {

        // Value of @TranslatedText is should be the value of @MethodDecription while open the Comment Pop up

        thisObj.state.metdresponseData.formData.find(x => x.attributeName === "TranslatedText").defaultValue = document.getElementById("MethodDescription").value;

        thisObj.setState({ title: "Method", showCmntMtdPop: true, popupFields: thisObj.state.metdresponseData });

    }

    //fn to cancel the comment popup
    handleCommentCancel = () =>
    {
        this.setState({ showCmntMtdPop: false });
    }

    //fn for Domain Cancel
    Cancel = () =>
    {
        thisObj.props.refresh(thisObj.props.directClick);
    }

    //Cancel confirmation popup
    ConfirmationCancel = (e) =>
    {

        thisObj.props.form.resetFields(["Change Reason"]);
        thisObj.setState({ confirmation: false });
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

    //fn for Domain Create
    handleUpdate = (changeReason) =>
    {

        var validValues = thisObj.state.validValues;
        var elementID = 0;
        var itemRefID = 0;
        var formData = JSON.parse(thisObj.state.stringData);

        formData.forEach(function (key, index)
        {
            const fieldName = key["displayName"].replace(/ /g, "");
            if (index < thisObj.state.cmntresponseData.formData.length)
            {
                thisObj.state.cmntresponseData.formData[index].comment = true;
                thisObj.state.cmntresponseData.formData[index].changeReason = changeReason;
                if (thisObj.state.cmntresponseData.formData[index].displayName.toLowerCase() == 'description') {

                    thisObj.state.metdresponseData.formData[index].defaultValue = thisObj.props.form.getFieldValue("CommentDescription");
                }
            }

            if (index < thisObj.state.metdresponseData.formData.length) {
                if (thisObj.state.metdresponseData.formData[index].displayName.toLowerCase() == 'description') {
                    thisObj.state.metdresponseData.formData[index].defaultValue = thisObj.props.form.getFieldValue("MethodDescription");
                }
                thisObj.state.metdresponseData.formData[index].changeReason = changeReason;
                thisObj.state.metdresponseData.formData[index].method = true;
            }

            if (key["defaultValue"] == "" || key["defaultValue"] == null) {
                if (validValues[fieldName] != "" && validValues[fieldName] != null) {
                    key["changed"] = true;
                }
            }
            else if (validValues[fieldName] != key["defaultValue"]) {
                key["changed"] = true;
            }

            if (key["displayName"] == "Mandatory") {
                itemRefID = key["elementID"]
            }
            else if (key["displayName"] == "ValueLevel Name") {
                elementID = key["elementID"]
            }

            if (fieldName == "CommentDescription") {
                key["comment"] = true;
                key["parentElementID"] = elementID;
            }
            else if (fieldName == "CodeListName") {
                key["codeList"] = true;
                key.extCom = document.getElementById("CodeListNameCheckBox").checked;
            }
            else if (fieldName == "MethodDescription") {
                key["method"] = true;
                key["parentElementID"] = itemRefID;
            }

            key["defaultValue"] = (validValues[fieldName] != null && validValues[fieldName] != "") ? validValues[fieldName].toString() : validValues[fieldName];
            key["timeZone"] = "IST";
            key["changeReason"] = changeReason;
            key["updatedBy"] = JSON.parse(sessionStorage.userProfile).userID;

        })

        var data = formData;
        showProgress();
        PostCallWithZoneForDomainCreate('ValueLevelMetaData/UpdateValueLevelData', data).then(
            function (response)
            {
                hideProgress();
                const responseData = response;
                if (responseData.status == 0) {
                    thisObj.setState({ popupLoading: false, confirmation: false });
                    errorModal(responseData.message);
                }
                else {
                    thisObj.setState({ popupLoading: false, confirmation: false });
                    successModalCallback(responseData.message, thisObj.props.refresh);
                }
            }).catch(error => error);

    }


    handleReadOnlyToSave = () => {
        thisObj.setState({ readOnly: false });
    }

    handleSaveToReadOnly = () =>
    {
        thisObj.props.form.resetFields();
        thisObj.setState({ readOnly: true, show: false, loading: true, display: "flex", responseData: { formData: {} } });
        thisObj.getFormFieldList(thisObj.props);

    }
    navigate = (navigate) => {
        let { navigateByPrevNext } = this.context;
        let { ID } = this.props;
        navigateByPrevNext(navigate, ID, "ValueLevel");
    }
    render()
    {
        var { readOnly, title, responseData, showCmntMtdPop , popupFields } = this.state;
        const { getFieldDecorator } = this.props.form;
        const { prev, next } = this.props;
        const { back, defineActivityWorkflowStatus } = this.context;


        return (
            <div style={{ height: "100%", width: "100%" }}>
                {
                    (Object.keys(responseData.formData).length > 0) && (
                        <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>

                            <Breadcrumb>
                                <Breadcrumb.Item>
                                    <i className="ion-clipboard" />
                                    <span> Valuelevel</span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>Edit
                                 <span style={{ float: 'right' }}>
                                        {prev && <Tooltip title="Prev">
                                            <Icon
                                                className={"defineRightLeftIcon"}
                                                type="caret-left" theme="outlined"
                                                id='left'
                                                style={{ cursor: "pointer", fontSize: "20px" }}
                                                onClick={() => this.navigate("prev")} />
                                        </Tooltip>}
                                        {next && <Tooltip title="Next">
                                            <Icon
                                                className={"defineRightLeftIcon"}
                                                type="caret-right" theme="outlined"
                                                id='right' style={{ cursor: "pointer", fontSize: "20px" }}
                                                onClick={() => this.navigate("next")} />
                                        </Tooltip>}
                                    </span>
                                </Breadcrumb.Item>
                            </Breadcrumb>

                            <div style={{ overflow: "auto", height: "100%", display: "flex", flexDirection: "column" }}>
                                <SingleForm
                                    defineActivityWorkflowStatus={defineActivityWorkflowStatus}
                                    property={this}
                                    ReadOnlyToSave={this.handleReadOnlyToSave}
                                    SaveToReadOnly={this.handleSaveToReadOnly}
                                    readOnly={readOnly}
                                    responseData={responseData}
                                    props={this}
                                    getFieldDecorator={getFieldDecorator}
                                    handleSubmit={this.handleValidate}
                                    handleCancel={back ? this.backToList : ""}
                                    isStudyLock={this.props.isStudyLock}
                                />
                                <DomainCmntPopUp defineActivityWorkflowStatus={defineActivityWorkflowStatus} title={title} data={popupFields} cmntSubmit={this.cmntSave} visible={showCmntMtdPop} handleCancel={this.handleCommentCancel} getFieldDecorator={getFieldDecorator} />
                                <Confirmation loading={false} title="Update Value Level" onSubmit={this.handleUpdate} visible={this.state.confirmation} handleCancel={this.ConfirmationCancel} getFieldDecorator={getFieldDecorator} />
                            </div>
                        </div>
                    )}

              
            </div>
        );
    }
}
const WrappedApp = Form.create()(Update);
export default WrappedApp;



