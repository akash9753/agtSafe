import React, { Component } from 'react';
import { Button, Select, Breadcrumb, Form, Icon, Spin } from 'antd';
import { CallServerPost, PostCallWithZone, errorModal, successModal, successModalCallback, PostCallWithZoneForDomainCreate } from '../../Utility/sharedUtility';
import SingleForm from '../../Utility/defineBotForm';
import DomainCmntPopUp from '../domainCmntPopUp.js';
import LayoutContent from '../../../components/utility/layoutContent';
import Confirmation from '../confirmation';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;

class AddDefineDomain extends Component {
    constructor(props) {
        super(props);
        this.state =
        {

            responseData: {
                formData: {},
                selectOptions: {}
            },

            cmntresponseData: {
                formData: {},
                selectOptions: {}
            },

            //for cmnt popup 
            visible: false,
            title: "",

            //validate fields are saved to this variable @see the handle Validate fn
            validValues: [],

            //ChangeReason popup visible and loader attribute
            confirmation: false,
            popupLoading: false,

            //for loader purpose 
            display: "flex",
            loading: true,
            show: false,
            readOnly: true
        }


        thisObj = this;


        //fn call to get the form field on ready
        thisObj.getFormFieldList(thisObj.props);

    }

    getFormFieldList = (props) => {

        //Get the required field to form the page
        CallServerPost('Domain/GetDomainFormData', { FormName: "Domain", ActionName: "Update", ID: props.ID, StudyID: JSON.parse(sessionStorage.studyDetails).studyID, StandardName: sessionStorage.standard }).then(
            function (response) {
                const result = response.value;
                if (result.status == 0) {
                    thisObj.setState({
                        responseData: { formData: [] }, loading: false
                    });
                    errorModal(result.message);
                } else {


                    //For Custom Domain purpose if custom domain is true the following list should be enable else no need
                    if (response.value.formData_domain.find(x => x.attributeName == "CustomDomain").defaultValue != "0") {
                        var keyToEnable = ["AliasName", "Context", "TranslatedText", "Class", "IsReferenceData", "Structure", "KeyVariable", "Repeating", "Purpose"];
                        response.value.formData_domain.forEach(function (key, index) {

                            if (keyToEnable.indexOf(key.attributeName) != -1) {
                                key.editable = true;
                                key.inputRequirementID = 8;
                                key.inputRequirementText = "Mandatory";
                            }
                        })
                    }
                    //set state to render the page
                    thisObj.setState({
                        show: true,
                        responseData: { formData: result.formData_domain, keySequence: result.formData_keysequence , selectOptions: result.selectOptions },
                        cmntresponseData: { formData: result.formData_comment, selectOptions: result.selectOptions },
                        loading: false, display: "none"

                    });

                    //Onclick fn to that comment button
                    (function () {
                        document.getElementById("CommentDescriptionConfirm").onclick = function () {
                            thisObj.cmntPopUp();
                        };
                    })();

                }
            }).catch(error => error);
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
        var { readOnly, responseData, show, loading, visible, cmntresponseData, title, display } = this.state;
        const { getFieldDecorator, getFieldValue, defineActivityWorkflowStatus } = this.props.form;

        return (
            <div style={{ height: "100%", width: "100%" }}>
                {
                    (show) ?
                        (Object.keys(responseData.formData).length > 0) ? (
                            <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                                <Breadcrumb>
                                    <Breadcrumb.Item>
                                        <i className="ion-clipboard" />
                                        <span> Domain</span>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>Edit </Breadcrumb.Item>
                                </Breadcrumb>
                                <div style={{ overflow: "auto", height: "100%", display: "flex", flexDirection: "column" }}>
                                    <SingleForm defineActivityWorkflowStatus={defineActivityWorkflowStatus} property={this} props={this} ReadOnlyToSave={this.handleReadOnlyToSave} SaveToReadOnly={this.handleSaveToReadOnly} readOnly={readOnly} responseData={responseData} getFieldDecorator={getFieldDecorator} handleSubmit={this.handleValidate} handleCancel={this.DomainCancel} isStudyLock={this.props.isStudyLock} />
                                </div>
                                <DomainCmntPopUp defineActivityWorkflowStatus={defineActivityWorkflowStatus} title={title} data={cmntresponseData} cmntSubmit={this.cmntSave} visible={visible} handleCancel={this.handleCommentCancel} getFieldDecorator={getFieldDecorator} />
                                <Confirmation loading={this.state.popupLoading} title="Update Domain" onSubmit={this.handleUpdate} visible={this.state.confirmation} handleCancel={this.ConfirmationCancel} getFieldDecorator={getFieldDecorator} />
                            </div>
                        ) : <div className="norecords">No fields are available to show</div> : ""}

                {loading && <div className="customLoader" style={{ display: display }}>
                    <Spin indicator={antIcon} style={{ margin: "auto" }} size="default" spinning={true}></Spin>
                </div>}
            </div>
        );
    }


    //fn for comment button to show the comment popup
    cmntPopUp = () => {

        thisObj.state.cmntresponseData.formData[0].defaultValue = document.getElementById("CommentDescription").value;

        thisObj.setState({ visible: true, cmntresponseData: thisObj.state.cmntresponseData, title: "Comment" });

        //description value to fill the pop up description field 
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

    //fn for Update
    handleUpdate = (changeReason) => {
        const thisObj = this;
        var elementID = 0;
        var validValues = thisObj.state.validValues;
        this.setState({ popupLoading: true })

        thisObj.state.responseData.formData.forEach(function (key, index) {
            const fieldName = key["displayName"].replace(/ /g, "");

            if (index < thisObj.state.cmntresponseData.formData.length) {
                if (thisObj.state.cmntresponseData.formData[index].displayName.toLowerCase() == 'description') {
                    thisObj.state.cmntresponseData.formData[index].defaultValue = thisObj.props.form.getFieldValue("CommentDescription");
                }
                thisObj.state.cmntresponseData.formData[index].comment = true;
            }

            if (key["defaultValue"] == "" || key["defaultValue"] == null) {
                if (validValues[fieldName] != "" && validValues[fieldName] != null) {
                    key["changed"] = true;
                }
            }
            else if (validValues[fieldName] != key["defaultValue"]) {
                key["changed"] = true;
            }

            key["defaultValue"] = (validValues[fieldName] != null && validValues[fieldName] != "") ? validValues[fieldName].toString() : validValues[fieldName];

            if (fieldName == "CommentDescription") {
                key["comment"] = true;
                key["parentElementID"] = elementID;
            }

            if (key["displayName"] == "Name") {
                elementID = key["elementID"]
            }

            if (fieldName == "KeyVariable") {
                key["elementID"] = elementID;
            }

            key["timeZone"] = "IST";
            key["changeReason"] = changeReason;
            key["updatedBy"] = JSON.parse(sessionStorage.userProfile).userID;
        });
        thisObj.state.responseData.formData.map(function (x, indexitem) {
            if (thisObj.state.responseData.formData[indexitem].wizardID === null) {
                thisObj.state.responseData.formData[indexitem].wizardID = -1;
            }
        });
        var formData = [...thisObj.state.responseData.keySequence, ...thisObj.state.responseData.formData];
        PostCallWithZoneForDomainCreate('Domain/UpdateDomainData', formData).then(
            function (response) {
                const responseData = response;
                if (responseData.status == 0) {
                    thisObj.setState({ loading: false, popupLoading: false, confirmation: false });
                    errorModal(responseData.message);
                }
                else {
                    thisObj.setState({ popupLoading: false, confirmation: false });
                    successModalCallback(responseData.message, thisObj.DomainCancel);
                }
            }).catch(error => error);
    }

    //fn for Domain Cancel
    DomainCancel = () => {
        thisObj.setState({ readOnly: true, loading: true, display: "flex" });

        thisObj.props.refresh(false);
    }

    //fn to cancel the comment popup
    handleCommentCancel = () => {
        this.setState({ visible: false });
    }

    //Cancel confirmation popup
    ConfirmationCancel = (e) => {

        thisObj.props.form.resetFields(["Change Reason"])
        thisObj.setState({ confirmation: false })
    }
}
const WrappedApp = Form.create()(AddDefineDomain);
export default WrappedApp;


