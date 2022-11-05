import React, { Component } from 'react';
import { Breadcrumb, Icon, Col, Row, Divider, Form, } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import Button from '../../components/uielements/button';
import { CallServerPost, PostCallWithZone, errorModal, successModal, showProgress, hideProgress } from '../Utility/sharedUtility';
import { getFormItemsLeft, getFormItemsRight } from '../Utility/htmlUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import ConfirmModal from '../Utility/ConfirmModal';
import SingleForm from '../Utility/SingleForm';

var projectID;
class UpdateProject extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        const thisObj = this;
        this.state = {
            responseData: {
                formData: {},
                selectOptions: {}
            },
            showEditModal: false,
            projectID,
            allValues: {},
            modalLoad: false,
        };
        projectID = this.props.projectID;
        showProgress();
        CallServerPost('Project/GetProjectFormData', { FormName: "Project", ActionName: "Update", ID: projectID, Editable: this.props.readOnly }).then(
            function (response) {
                const responseData = response.value;
                let rootpath = "";
                if ("projectConfig" in responseData && responseData.projectConfig != null) {
                    rootpath = responseData.projectConfig.configurationValue;
                }
                responseData.formData.push({
                    "formFieldAttributeID": 420,
                    "attributeName": "RootPath",
                    "displayName": "Project RootPath",
                    "formID": 3,
                    "formActionID": 5,
                    "inputRequirementID": 8,
                    "inputTypeID": 16,
                    "controlTypeID": 11,
                    "minValue": 2,
                    "maxValue": 255,
                    "defaultValue": rootpath,
                    "tabIndex": 7,
                    "regExID": 25,
                    "inputTypeErrorMessage": "",
                    "validationErrorMessage": "Project RootPath should be between 2-255 characters",
                    "requirementErrorMessage": "Project RootPath is mandatory",
                    "formText": "Projects",
                    "formActionText": "Create",
                    "inputRequirementText": "Mandatory",
                    "inputTypeText": "Alphanumeric",
                    "controlTypeText": "TextBox",
                    "regExText": null,
                    "editable": false,
                    "wizardID": -1,
                    "xpath": null,
                    "elementType": null,
                    "id": 0,
                    "updatedDateTime": "2019-10-04T14:52:16",
                    "updatedDateTimeText": null,
                    "timeZone": "IST",
                    "recordStatus": 2,
                    "updatedBy": 1,
                    "changeReason": "tabindex updated",
                    "updatedUser": "admin"
                });
                if (responseData.formData.filter(x => x.attributeName == "ProjectStatusID")[0].defaultValue === "6") {
                    responseData.formData.filter(x => x.attributeName === "ProjectCode" || x.attributeName === "ProjectDescription").
                        map(function (obj) {
                            obj.editable = false;
                        });
                }
                if (responseData.status == 0) {

                    hideProgress();
                    errorModal(responseData.message);
                }
                else {
                    thisObj.setState({ responseData: responseData }, () => {
                        hideProgress();
                    });
                }

            }).catch(error => {
                hideProgress();
            });
    }


    handleUpdate = (ChangeReason) => {
        const thisObj = this;
        let values = thisObj.state.allValues;
        var datas = {};
        datas["ProjectCode"] = values["ProjectCode"];
        datas["ProjectDescription"] = values["ProjectDescription"];
        datas["ProjectID"] = projectID;
        datas["ProjectName"] = values["ProjectName"];
        datas["ProjectStatusID"] = values["ProjectStatusID"];
        datas["SponsorName"] = values["SponsorName"];
        datas["ChangeReason"] = ChangeReason;
        datas["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;

        thisObj.setState({ modalLoad: true });
        var tempArr = [];
        thisObj.state.responseData.userAssignList.map(function (obj) {
            if (!values.UserID.includes(obj.userID.toString())) {
                tempArr.push({ UserID: obj.userID.toString(), ActionFor: 2, UserAssignmentID: obj.userAssignmentID });
            }
        })
        values.UserID.map(function (obj) {
            if (!thisObj.state.responseData.userAssignList.map(x => x.userID.toString()).includes(obj)) {
                tempArr.push({ UserID: obj, ActionFor: 1 });

            }
        })
        datas["UserAssignmentList"] = tempArr;
        PostCallWithZone('Project/Update', datas)
            .then(
                function (response) {
                    thisObj.setState({ modalLoad: false, showEditModal: false });
                    if (response.status == 1) {
                        successModal(response.message, thisObj.props.rootprops, "/trans/project");
                    } else {
                        errorModal(response.message);
                    }
                }).catch(error => error);

    }

    handleSubmit = () => {
        const thisObj = this;
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                thisObj.setState({ showEditModal: true, allValues: values });
            }
        });
    }

    handleCancel = () => {
        this.setState({ showEditModal: false });
        this.props.form.resetFields(['Change Reason']);
    }

    render() {
        const { responseData } = this.state;
        const { getFieldDecorator, setFieldsValue, getFieldValue } = this.props.form;
        const projectStatusValue = responseData.formData.length > 0 ? getFieldValue(responseData.formData[4].attributeName) ? getFieldValue(responseData.formData[4].attributeName) : responseData.formData[4].defaultValue : "";
        //console.log("gh", projectStatusValue);
        return (
            <LayoutContentWrapper className="divHeight">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-tasks"></i>
                        <span> Project</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Edit
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Divider className="divider-cs" />
                {Object.keys(responseData.formData).length > 0 &&
                    <SingleForm Editable={this.props.readOnly} property={this} projectUserAssignField={true} projectUserAssignFieldStatus={projectStatusValue === "6"} responseData={responseData} getFieldDecorator={getFieldDecorator} setFieldsValue={setFieldsValue} handleSubmit={this.handleSubmit} handleCancel={this.props.FormCancel} />
                }
                {this.state.showEditModal &&
                    <ConfirmModal loading={this.state.modalLoad} title="Update Project" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
                }
            </LayoutContentWrapper>
        );
    }

}

const WrappedApp = Form.create()(UpdateProject);

export default WrappedApp;