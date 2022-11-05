import React, { Component } from 'react';
import { Button, Select, Layout, Form, Breadcrumb, Icon, Spin, Tooltip } from 'antd';
import LayoutContent from '../../../components/utility/layoutContent';
import { CallServerPost, PostCallWithZone, errorModal, successModal, successModalCallback, PostCallWithZoneForDomainCreate } from '../../Utility/sharedUtility';
import SingleForm from '../../Utility/defineBotForm';
import Confirmation from '../confirmation';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;
var cmnFieldJson = {};
var cmntresponseData = {};
var metdFieldJson = {};
var metdresponseData = {};

class ExternalCodeList extends Component {
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
    getFormFieldList = (props) => {
        //console.log(props);
        CallServerPost('CodeList/GetExternalCodeListFormData', { FormName: "ExternalCodeList", ActionName: props.action, ID: props.ID, studyID: JSON.parse(sessionStorage.studyDetails).studyID, StandardName: sessionStorage.standard  }).then(
            function (response) {
                //console.log(response);
                var result = response.value;
                const responseData = response.value;
                if (responseData.status == 0) {
                    thisObj.setState({
                       loading: false, display: "none"
                    });
                    errorModal(responseData.message);
                } else {

                    //set state to render the page
                    thisObj.setState({
                        show: true, responseData: ({ formData: result.formData_codelist, selectOptions: result.selectOptions }), loading: false, display: "none"
                    });

                }
            }).catch(error => error);
    }

    //fn for GetCodeListGroupData
    GetCodeListGroupData = (key) => {
        CallServerPost('CodeList/GetExternalCodeListGroupData', { FormName: "ExternalCodeList", ActionName: "Create", ID: key }).then(
            function (response) {
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
    handleUpdate = (changeReason) => {
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

            key["defaultValue"] = (validValues[fieldName] != null && validValues[fieldName] != "") ? validValues[fieldName].toString() : validValues[fieldName];
            key["timeZone"] = "IST";
            key["changeReason"] = changeReason;
            key["updatedBy"] = JSON.parse(sessionStorage.userProfile).userID;
        })

        var data = thisObj.state.responseData.formData.concat(cmnFieldJson, metdFieldJson);
        var url = "CodeList/UpdateExternalCodeListData";
        
        PostCallWithZoneForDomainCreate(url, thisObj.state.responseData.formData.concat(cmnFieldJson)).then(
            function (response) {
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

    render() {
        var { responseData, loading, display, show,readOnly } = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { toHide, defineActivityWorkflowStatus } = this.props;
        return (
            <div style={{ height: "100%", width: "100%" }}>
                {
                    (show) ?
                        (Object.keys(responseData.formData).length > 0) ? (
                            <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                                <Breadcrumb>
                                    <Breadcrumb.Item>
                                        <i className="ion-clipboard" />
                                        <span> External Codelist</span>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>Edit          
                                        {
                                            <span style={{ float: 'right' }}>
                                                {(toHide != "left" && toHide != "both") && <Tooltip title="Prev"><Icon className={"defineRightLeftIcon"} type="caret-left" theme="outlined" id='left' style={{ cursor: "pointer", fontSize: "20px" }} onClick={this.props.move} /></Tooltip>}
                                                {(toHide != "right" && toHide != "both") && <Tooltip title="Next"> <Icon className={"defineRightLeftIcon"} type="caret-right" theme="outlined" id='right' style={{ cursor: "pointer", fontSize: "20px" }} onClick={this.props.move} /> </Tooltip>}
                                            </span> 
                                        }
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                                <div style={{ overflow: "auto", height: "100%", display: "flex", flexDirection: "column" }}>
                                    <SingleForm defineActivityWorkflowStatus={defineActivityWorkflowStatus} ReadOnlyToSave={this.handleReadOnlyToSave} SaveToReadOnly={this.handleSaveToReadOnly} readOnly={readOnly} property={this} props={this} responseData={responseData} getFieldDecorator={getFieldDecorator} handleSubmit={this.handleValidate} handleCancel={this.props.cancel ? this.Cancel : ""} isStudyLock={this.props.isStudyLock}/>
                                    <Confirmation loading={this.state.popupLoading} title="Update External CodeList" onSubmit={this.handleUpdate} visible={this.state.confirmation} handleCancel={this.ConfirmationCancel} getFieldDecorator={getFieldDecorator} />
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
const WrappedApp = Form.create()(ExternalCodeList);
export default WrappedApp;


