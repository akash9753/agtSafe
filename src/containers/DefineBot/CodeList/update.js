import React, { Component } from 'react';
import { Button, Select, Layout, Form, Breadcrumb, Icon, Spin, Tooltip } from 'antd';
import LayoutContent from '../../../components/utility/layoutContent';
import { CallServerPost, PostCallWithZone, errorModal, successModal, successModalCallback, PostCallWithZoneForDomainCreate, showProgress, hideProgress } from '../../Utility/sharedUtility';
import SingleForm from '../../Utility/defineBotForm';
import Confirmation from '../confirmation';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;
var cmnFieldJson = {};
var cmntresponseData = {};
var metdFieldJson = {};
var metdresponseData = {};

class AddCodeList extends Component {
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
            thisObj.setState({ readOnly: true, show: false, loading: true, display: "flex", responseData: { formData: {} } });
            thisObj.getFormFieldList(nextProps);
        }
    }

    //fn to get the list
    getFormFieldList = (props) => {
        CallServerPost('CodeList/GetCodeListFormData', {
            FormName: "CodeList", ActionName: props.action, ID: props.ID, studyID: JSON.parse(sessionStorage.studyDetails).studyID, StandardName: sessionStorage.standard
        }).then(
            function (response) {
                var result = response.value;
                const responseData = response.value;
                if (response.status == 0) {
                    thisObj.setState({
                        show: false, loading: false, display: "none"
                    });
                    errorModal(response.message);
                    props.handleCancel();
                } else {
                    
                    if (thisObj.props.action != "Update") {

                        if (thisObj.props.parentPageName === "codelist") {
                            thisObj.GetCodeListGroupData(result.formData_codelist.find(x => x.attributeName === "CodeListName").defaultValue, ({ formData: result.formData_codelist, selectOptions: result.selectOptions }));

                        } else {
                            let temp = result.selectOptions.codelistname;
                            let codelist = (temp || []).find(x => x.keyValue === thisObj.props.selectedKey[0]);
                            thisObj.GetCodeListGroupData(codelist.keyValue, ({ formData: result.formData_codelist, selectOptions: result.selectOptions }));
                        }
                        
                    } else
                    {
                        let CodeList = result.formData_codelist;
                        if (CodeList.find(x => x.attributeName === "CodeListType").defaultValue === "CodeListItem" &&
                            (CodeList.find(x => x.attributeName === "Decoded Value") || CodeList.find(x => x.attributeName === "TranslatedText"))) {
                            if (result.formData_codelist.find(x => x.attributeName === "Decoded Value") !== undefined) {
                                result.formData_codelist.find(x => x.attributeName === "Decoded Value").editable = true;
                                result.formData_codelist.find(x => x.attributeName === "Decoded Value").inputRequirementID = 8;
                                result.formData_codelist.find(x => x.attributeName === "Decoded Value").inputRequirementText = "Mandatory";
                            }
                            //
                            if (result.formData_codelist.find(x => x.attributeName === "TranslatedText") !== undefined) {
                                result.formData_codelist.find(x => x.attributeName === "TranslatedText").editable = true;
                                result.formData_codelist.find(x => x.attributeName === "TranslatedText").inputRequirementID = 8;
                                result.formData_codelist.find(x => x.attributeName === "TranslatedText").inputRequirementText = "Mandatory";
                            }
                        } else if ((CodeList.find(x => x.attributeName === "Decoded Value") || CodeList.find(x => x.attributeName === "TranslatedText"))) {
                            if (result.formData_codelist.find(x => x.attributeName === "Decoded Value") !== undefined) {
                                result.formData_codelist.find(x => x.attributeName === "Decoded Value").editable = false;
                                result.formData_codelist.find(x => x.attributeName === "Decoded Value").inputRequirementID = 9;
                                result.formData_codelist.find(x => x.attributeName === "Decoded Value").inputRequirementText = "Optional";
                            }
                            //
                            if (result.formData_codelist.find(x => x.attributeName === "TranslatedText") !== undefined) {
                                result.formData_codelist.find(x => x.attributeName === "TranslatedText").editable = false;
                                result.formData_codelist.find(x => x.attributeName === "TranslatedText").inputRequirementID = 9;
                                result.formData_codelist.find(x => x.attributeName === "TranslatedText").inputRequirementText = "Optional";
                            }
                        }

                        thisObj.setState({
                            responseData: ({ formData: result.formData_codelist, selectOptions: result.selectOptions }), show: true, loading: false, display: "none"
                        });
                    }
                }
            }).catch(error => {

                thisObj.setState({
                    show: true, loading: false, display: "none"
                });
            });
    }

    //fn for GetCodeListGroupData
    GetCodeListGroupData = (key, responseData) => {
        //showProgress();
        key = (key === null) ? -1 : key;
        if (thisObj.props.action != "Update") {
            CallServerPost('CodeList/GetCodeListGroupData', { FormName: "CodeList", ActionName: "Create", ID: key, studyID: JSON.parse(sessionStorage.studyDetails).studyID, StandardName: sessionStorage.standard }).then(
                function (response)
                {
                    if (response.status == 1)
                    {
                        if (responseData != undefined) {
                            thisObj.setState({
                                responseData: responseData, show: true, loading: false, display: "none"
                            });
                            thisObj.props.form.setFieldsValue({ "CodeListName": key });
                        }
                        if (response.value == null) {
                            thisObj.props.form.resetFields(["FullName", "Term", "DataType", "SASFormatName", "NCICodeListCode"])
                        }
                        else
                        {
                          
                            let CodeList = responseData.formData;

                            if (response.value["CodeListType"] === "CodeListItem" &&
                                (CodeList.find(x => x.attributeName === "Decoded Value") || CodeList.find(x => x.attributeName === "TranslatedText"))) {
                                if (responseData.formData.find(x => x.attributeName === "Decoded Value") !== undefined) {
                                    responseData.formData.find(x => x.attributeName === "Decoded Value").editable = true;
                                    responseData.formData.find(x => x.attributeName === "Decoded Value").inputRequirementID = 8;
                                    responseData.formData.find(x => x.attributeName === "Decoded Value").inputRequirementText = "Mandatory";
                                }
                                //
                                if (responseData.formData.find(x => x.attributeName === "TranslatedText") !== undefined) {
                                    responseData.formData.find(x => x.attributeName === "TranslatedText").editable = true;
                                    responseData.formData.find(x => x.attributeName === "TranslatedText").inputRequirementID = 8;
                                    responseData.formData.find(x => x.attributeName === "TranslatedText").inputRequirementText = "Mandatory";
                                }

                            } else if (CodeList.find(x => x.attributeName === "Decoded Value") || CodeList.find(x => x.attributeName === "TranslatedText")) {
                                if (responseData.formData.find(x => x.attributeName === "Decoded Value") !== undefined) {
                                    responseData.formData.find(x => x.attributeName === "Decoded Value").editable = false;
                                    responseData.formData.find(x => x.attributeName === "Decoded Value").inputRequirementID = 9;
                                    responseData.formData.find(x => x.attributeName === "Decoded Value").inputRequirementText = "Optional";
                                }

                                //
                                if (responseData.formData.find(x => x.attributeName === "TranslatedText") !== undefined) {
                                    responseData.formData.find(x => x.attributeName === "TranslatedText").editable = false;
                                    responseData.formData.find(x => x.attributeName === "TranslatedText").inputRequirementID = 9;
                                    responseData.formData.find(x => x.attributeName === "TranslatedText").inputRequirementText = "Optional";
                                }
                            }
                            thisObj.props.form.setFieldsValue(response.value);
                        }
                        
                    }
                    else {
                        thisObj.setState({
                            show: true, loading: false, display: "none"
                        });
                        //errorModal(responseData.message);
                    }
                //    hideProgress();
                }).catch(error => {
                        thisObj.setState({
                            show: true, loading: false, display: "none"
                        });
                });
        }
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
                    thisObj.setState({ popupLoading: false });
                    errorModal(responseData.message);
                }
                else {
                    thisObj.setState({ popupLoading: false, confirmation: false });
                    successModalCallback(responseData.message, thisObj.Cancel);
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
        var { readOnly, responseData, loading, display, show } = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { action, toHide,defineActivityWorkflowStatus} = this.props;



        return (
            <div style={{ height: "100%", width: "100%" }}>
                {
                    (show) ?
                        (Object.keys(responseData.formData).length > 0) ? (
                            <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                                <Breadcrumb>
                                    <Breadcrumb.Item>
                                        <i className="ion-clipboard" />
                                        <span> Codelist</span>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>{this.props.action === "Create" ? "Add" : "Edit"}
                                        {
                                            (action != "Create") ?
                                                <span style={{ float: 'right' }}>
                                                    {(toHide != "left" && toHide != "both") && <Tooltip title="Prev"> <Icon type="caret-left" theme="outlined" id='left' className={"defineRightLeftIcon"} style={{ cursor: "pointer", fontSize: "20px" }} onClick={this.props.move} /></Tooltip>}
                                                    {(toHide != "right" && toHide != "both") && <Tooltip title="Next"><Icon type="caret-right" theme="outlined" id='right' className={"defineRightLeftIcon"} style={{ cursor: "pointer", fontSize: "20px" }} onClick={this.props.move} /></Tooltip>}
                                                </span> : ""
                                        }
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                                <div style={{ overflow: "auto", height: "100%", display: "flex", flexDirection: "column" }}>
                                    {
                                        (action == "Create") ?
                                            <SingleForm defineActivityWorkflowStatus={defineActivityWorkflowStatus} property={this} props={this} responseData={responseData} getFieldDecorator={getFieldDecorator} handleSubmit={this.handleValidate} handleCancel={this.props.cancel ? this.Cancel : ""} isStudyLock={this.props.isStudyLock} /> :
                                            <SingleForm defineActivityWorkflowStatus={defineActivityWorkflowStatus}property={this} ReadOnlyToSave={this.handleReadOnlyToSave} SaveToReadOnly={this.handleSaveToReadOnly} readOnly={(action == "Create") ? false : readOnly} props={this} responseData={responseData} getFieldDecorator={getFieldDecorator} handleSubmit={this.handleValidate} handleCancel={this.props.cancel ? this.Cancel : ""} isStudyLock={this.props.isStudyLock} />
                                    }
                                    <Confirmation loading={false} title="Update Codelist" onSubmit={this.handleUpdate} visible={this.state.confirmation} handleCancel={this.ConfirmationCancel} getFieldDecorator={getFieldDecorator} />
                                </div>
                            </div>
                        ) : <div className="norecords">No fields are available to show</div> : ""}

                {loading && <div className="customLoader" style={{ display: display }}>
                    <Spin indicator={antIcon} style={{ margin: "auto" }} size="default" spinning={true}></Spin>
                </div>}

            </div>
        )
    }
}
const WrappedApp = Form.create()(AddCodeList);
export default WrappedApp;


