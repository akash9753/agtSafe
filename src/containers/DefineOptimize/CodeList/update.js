import React, { Component } from 'react';
import { Form, Breadcrumb, Icon, Tooltip } from 'antd';
import {
    CallServerPost,
    errorModal,
    successModalCallback,
    PostCallWithZoneForDomainCreate,
    showProgress, hideProgress,
    errorModalCallback
} from '../../Utility/sharedUtility';
import SingleForm from '../../Utility/defineBotForm';
import Confirmation from '../confirmation';

import { DefineContext } from '../context';


var thisObj;


class Update extends Component {
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
                action:"Update",            
                validValues: [],

                confirmation: false,
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
        CallServerPost('CodeList/GetCodeListFormData',
        {
            FormName: "CodeList",
            ActionName: "Update",
            ID: props.ID,
            studyID: JSON.parse(sessionStorage.studyDetails).studyID,
            StandardName: sessionStorage.standard
        }).then(
            function (response)
            {
                hideProgress();

                var result = response.value;
                if (response.status == 0) {
                    errorModalCallback(response.message, props.backToList);
                  
                }
                else
                {
                    
                        let CodeList = result.formData_codelist;
                        if (CodeList.find(x => x.attributeName === "CodeListType").defaultValue === "CodeListItem" &&
                            CodeList.find(x => x.attributeName === "TranslatedText"))
                        {
                           
                                result.formData_codelist.find(x => x.attributeName === "TranslatedText").editable = true;
                                result.formData_codelist.find(x => x.attributeName === "TranslatedText").inputRequirementID = 8;
                                result.formData_codelist.find(x => x.attributeName === "TranslatedText").inputRequirementText = "Mandatory";
                            
                        }
                        else if (CodeList.find(x => x.attributeName === "TranslatedText"))
                        {
                            
                            if (result.formData_codelist.find(x => x.attributeName === "TranslatedText")) {
                                result.formData_codelist.find(x => x.attributeName === "TranslatedText").editable = false;
                                result.formData_codelist.find(x => x.attributeName === "TranslatedText").inputRequirementID = 9;
                                result.formData_codelist.find(x => x.attributeName === "TranslatedText").inputRequirementText = "Optional";
                            }
                        }

                        thisObj.setState({
                            responseData: ({ formData: result.formData_codelist, selectOptions: result.selectOptions }), show: true, loading: false, display: "none"
                        });
                    
                }
            }).catch(error => {

                hideProgress();
            });
    }

    //fn for GetCodeListGroupData
    GetCodeListGroupData = (key, responseData) => {
        key = (key === null) ? -1 : key;
        showProgress();
        CallServerPost('CodeList/GetCodeListGroupData',
            {
                FormName: "CodeList",
                ActionName: "Update",
                ID: key,
                studyID: JSON.parse(sessionStorage.studyDetails).studyID,
                StandardName: sessionStorage.standard
            }).then(
                function (response) {
                    hideProgress();


                    if (response.status == 1) {
                        if (responseData != undefined) {

                            thisObj.props.form.setFieldsValue({ "CodeListName": key });
                        }

                        if (response.value) {

                            let CodeList = responseData.formData;

                            // if CodeListType === "CodeListItem" ? enable Translated Text(Decoded Value) else disable 

                            if (response.value["CodeListType"] === "CodeListItem" &&
                                CodeList.find(x => x.attributeName === "TranslatedText")) {
                                if (responseData.formData.find(x => x.attributeName === "TranslatedText")) {
                                    responseData.formData.find(x => x.attributeName === "TranslatedText").editable = true;
                                    responseData.formData.find(x => x.attributeName === "TranslatedText").inputRequirementID = 8;
                                    responseData.formData.find(x => x.attributeName === "TranslatedText").inputRequirementText = "Mandatory";
                                }

                            }
                            else if (CodeList.find(x => x.attributeName === "TranslatedText")) {

                                if (responseData.formData.find(x => x.attributeName === "TranslatedText")) {
                                    responseData.formData.find(x => x.attributeName === "TranslatedText").editable = false;
                                    responseData.formData.find(x => x.attributeName === "TranslatedText").inputRequirementID = 9;
                                    responseData.formData.find(x => x.attributeName === "TranslatedText").inputRequirementText = "Optional";
                                }
                            }
                            thisObj.props.form.setFieldsValue(response.value);

                        }
                    }

                    //    hideProgress();
                }).catch(error => {
                    hideProgress();
                });

    }

    //fn for Domain Cancel
    Cancel = () =>
    {
        thisObj.props.backToList();
    }

    //Cancel confirmation popup
    ConfirmationCancel = (e) =>
    {
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
                if (thisObj.state.action == "Update") {
                    thisObj.setState({ confirmation: true, validValues: values })
                }
                else {
                    thisObj.handleUpdate(values);
                }
            }
        });
    }



    //fn for Domain Create
    handleUpdate = (data) => {


        const thisObj = this;

        var validValues = (thisObj.state.action == "Update") ? thisObj.state.validValues : data;
        //thisObj.setState({popupLoading: true});
        this.setState({ popupLoading: true })

        thisObj.state.responseData.formData.forEach(function (key, index)
        {
            const fieldName = key["displayName"].replace(/ /g, "");


            if (key["defaultValue"] == "" || key["defaultValue"] == null) {
                if (validValues[fieldName] != "" && validValues[fieldName] != null) {
                    key["changed"] = true;
                }
            }
            else if (validValues[fieldName] != key["defaultValue"]) {
                key["changed"] = true;
            }


            key["defineVersionID"] = JSON.parse(sessionStorage.studyDetails).defineOutputType;
            key["studyID"] = JSON.parse(sessionStorage.studyDetails).studyID;
            key["defaultValue"] = (validValues[fieldName] != null && validValues[fieldName] != "") ? validValues[fieldName].toString() : validValues[fieldName];
            key["timeZone"] = "IST";
            if (thisObj.state.action == "Update") {
                key["changeReason"] = data;
            } else {
                if (fieldName == "CodeListName") {
                    //key.id = validValues[fieldName];
                }
            }
            key["updatedBy"] = JSON.parse(sessionStorage.userProfile).userID;
        })
        thisObj.state.responseData.formData.map(function (x, indexitem) {
            if (thisObj.state.responseData.formData[indexitem].wizardID === null) {
                thisObj.state.responseData.formData[indexitem].wizardID = -1;
            }
            if (thisObj.state.responseData.formData[indexitem].regExID === null) {
                thisObj.state.responseData.formData[indexitem].regExID = -1;
            }
            if (thisObj.state.responseData.formData[indexitem].id === null) {
                thisObj.state.responseData.formData[indexitem].id = -1;
            }   
        });
        var url = "CodeList/UpdateCodeListData";
        showProgress();

        PostCallWithZoneForDomainCreate(url, thisObj.state.responseData.formData).then(
            function (response)
            {
                hideProgress();
                thisObj.setState({ confirmation: false });
                const responseData = response;
                if (responseData.status == 0)
                {
                    errorModal(responseData.message);
                }
                else {
                  
                    successModalCallback(responseData.message, thisObj.props.refresh);
                }
            }).catch(error => { hideProgress(); });
       
    }

    handleReadOnlyToSave = () =>
    {
        thisObj.setState({ readOnly: false });
    }

    handleSaveToReadOnly = () =>
    {
        thisObj.props.form.resetFields();
        thisObj.setState({ readOnly: true,responseData: { formData: {} } });
        thisObj.getFormFieldList(thisObj.props);
    }

    navigate = (navigate) =>
    {
        let { navigateByPrevNext } = this.context;
        let { ID } = this.props;
        navigateByPrevNext(navigate, ID);
    }

    render() {
        var { readOnly, responseData } = this.state;
        const { getFieldDecorator } = this.props.form;

        const { back, defineActivityWorkflowStatus } = this.context;
        const { prev, next, backToList } = this.props;

        return (
            <div style={{ height: "100%", width: "100%" }}>
                {
                        (Object.keys(responseData.formData).length > 0) && (
                            <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                                <Breadcrumb>
                                    <Breadcrumb.Item>
                                        <i className="ion-clipboard" />
                                        <span> Codelist</span>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>{"Edit"}
                                        {
                                                <span style={{ float: 'right' }}>
                                                    {prev && <Tooltip title="Prev"> <Icon type="caret-left" theme="outlined" id='left' className={"defineRightLeftIcon"} style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => this.navigate("prev")} /></Tooltip>}
                                                    {next && <Tooltip title="Next"><Icon type="caret-right" theme="outlined" id='right' className={"defineRightLeftIcon"} style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => this.navigate("next")} /></Tooltip>}
                                                </span> 
                                        }
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                                <div style={{ overflow: "auto", height: "100%", display: "flex", flexDirection: "column" }}>
                                    {
                                    <SingleForm
                                        defineActivityWorkflowStatus={defineActivityWorkflowStatus} property={this}
                                        ReadOnlyToSave={this.handleReadOnlyToSave}
                                        SaveToReadOnly={this.handleSaveToReadOnly}
                                        readOnly={readOnly}
                                        props={this}
                                        responseData={responseData}
                                        getFieldDecorator={getFieldDecorator}
                                        handleSubmit={this.handleValidate}
                                        handleCancel={back ? this.props.backToList : ""}
                                        isStudyLock={this.props.isStudyLock} />
                                    }
                                    <Confirmation loading={false} title="Update Codelist" onSubmit={this.handleUpdate} visible={this.state.confirmation} handleCancel={this.ConfirmationCancel} getFieldDecorator={getFieldDecorator} />
                                </div>
                            </div>
                        )}

               

            </div>
        )
    }
}
const WrappedApp = Form.create()(Update);
export default WrappedApp;


