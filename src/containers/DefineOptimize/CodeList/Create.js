import React, { Component } from 'react';
import { Button, Select, Layout, Form, Breadcrumb, Icon, Spin, Tooltip } from 'antd';
import LayoutContent from '../../../components/utility/layoutContent';
import { CallServerPost, PostCallWithZone, errorModal, successModal, successModalCallback, PostCallWithZoneForDomainCreate, showProgress, hideProgress } from '../../Utility/sharedUtility';
import SingleForm from '../../Utility/defineBotForm';
import Confirmation from '../confirmation';
import { DefineContext } from '../context';



var thisObj;


class AddCodeList extends Component
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

            validValues: [],

            confirmation: false,
            readOnly: true

        }

        thisObj = this;

       

    }

    componentDidMount() {
        thisObj.getFormFieldList();
    }
    //fn to get the list
    getFormFieldList = () =>
    {
         let { node } = thisObj.context;
       

        showProgress();
        CallServerPost('CodeList/GetCodeListFormData',
            {
                FormName: "CodeList",
                ActionName: "Create",
                ID: 0,
                studyID: JSON.parse(sessionStorage.studyDetails).studyID,
                StandardName: sessionStorage.standard
            }).then(
                function (response) {

                    var result = response.value;
                    if (response.status == 0)
                    {
                        hideProgress();
                        errorModal(response.message);
                        thisObj.props.backToList();
                    }
                    else
                    {
                        thisObj.setState({
                            responseData: { formData: result.formData_codelist, selectOptions: result.selectOptions }
                        });

                        //if selected node type is codelist means no need to call and get data from controller
                        if (node.type != "Codelist" && node.type == "CodeListGroupDetails")
                        {
                            let temp = result.selectOptions.codelistname;

                            let codelist = (temp || []).find(x => x.keyValue === node.nodeKey);
                            thisObj.GetCodeListGroupData(codelist.keyValue, ({ formData: result.formData_codelist, selectOptions: result.selectOptions }));
                        }
                        else
                        {
                           
                            hideProgress();
                        }
                        
                    }
                }).catch(error => {

                    hideProgress()
                });
    }

    //fn for GetCodeListGroupData
    GetCodeListGroupData = (key, responseData) =>
    {
        key = (key === null) ? -1 : key;

        showProgress();
        CallServerPost('CodeList/GetCodeListGroupData',
            {
                FormName: "CodeList",
                ActionName: "Create",
                ID: key,
                studyID: JSON.parse(sessionStorage.studyDetails).studyID,
                StandardName: sessionStorage.standard
            }).then(
                function (response)
                {
                    hideProgress();


                    if (response.status == 1)
                    {
                        if (responseData != undefined)
                        {
                           
                            thisObj.props.form.setFieldsValue({ "CodeListName": key });
                        }

                        if (response.value)
                        {

                            let CodeList = responseData.formData;

                            // if CodeListType === "CodeListItem" ? enable Translated Text(Decoded Value) else disable 

                            if (response.value["CodeListType"] === "CodeListItem" &&
                                CodeList.find(x => x.attributeName === "TranslatedText"))
                            {
                                if (responseData.formData.find(x => x.attributeName === "TranslatedText"))
                                {
                                    responseData.formData.find(x => x.attributeName === "TranslatedText").editable = true;
                                    responseData.formData.find(x => x.attributeName === "TranslatedText").inputRequirementID = 8;
                                    responseData.formData.find(x => x.attributeName === "TranslatedText").inputRequirementText = "Mandatory";
                                }

                            }
                            else if (CodeList.find(x => x.attributeName === "TranslatedText"))
                            {
                               
                                if (responseData.formData.find(x => x.attributeName === "TranslatedText"))
                                {
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
                if (thisObj.props.action == "Update") {
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

        var validValues = (thisObj.props.action == "Update") ? thisObj.state.validValues : data;
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


            key["defineVersionID"] = JSON.parse(sessionStorage.studyDetails).defineOutputType;
            key["studyID"] = JSON.parse(sessionStorage.studyDetails).studyID;
            key["defaultValue"] = (validValues[fieldName] != null && validValues[fieldName] != "") ? validValues[fieldName].toString() : validValues[fieldName];
            key["timeZone"] = "IST";
            if (thisObj.props.action == "Update") {
                key["changeReason"] = data;
            } else {
                if (fieldName == "CodeListName") {
                    key.id = validValues[fieldName];
                }
            }
            key["updatedBy"] = JSON.parse(sessionStorage.userProfile).userID;
        })

        var url = (thisObj.props.action == "Update") ? "CodeList/UpdateCodeListData" : "CodeList/CreateCodeListData";
        showProgress();

        PostCallWithZoneForDomainCreate(url, thisObj.state.responseData.formData).then(
            function (response)
            {
                hideProgress();
                const responseData = response;
                if (responseData.status == 0) {
                    errorModal(responseData.message);
                }
                else {
                    thisObj.setState({ popupLoading: false, confirmation: false });
                    successModalCallback(responseData.message, () => { thisObj.props.treeref(); thisObj.props.refresh(); });
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
        var { responseData } = this.state;
        const { getFieldDecorator } = this.props.form;
        const { defineActivityWorkflowStatus } = this.props;



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
                                <Breadcrumb.Item>{"Add"}
                                    
                                </Breadcrumb.Item>
                            </Breadcrumb>
                            <div style={{ overflow: "auto", height: "100%", display: "flex", flexDirection: "column" }}>
                                {
                                    <SingleForm
                                        defineActivityWorkflowStatus={defineActivityWorkflowStatus}
                                        property={this} props={this} responseData={responseData}
                                        getFieldDecorator={getFieldDecorator}
                                        handleSubmit={this.handleValidate}
                                        handleCancel={this.props.backToList} isStudyLock={this.props.isStudyLock} />
                                }
                            </div>
                        </div>
                    )}



            </div>
        )
    }
}
const WrappedApp = Form.create()(AddCodeList);
export default WrappedApp;


