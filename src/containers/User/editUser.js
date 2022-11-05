import React, { Component } from 'react';
import { Breadcrumb, Col, Row, Select, Form, Steps, message, Modal, Icon } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { CallServerPost, PostCallWithZone, errorModal, successModalCallback, checkPermission, UserAssignedPop, getProjectRole, showProgress, hideProgress } from '../Utility/sharedUtility';
import WizardForm from '../Utility/wizardForm';
import ConfirmModal from '../Utility/ConfirmModal';
import SingleForm from '../Utility/SingleForm';

const Option = Select.Option;
const FormItem = Form.Item;
const Step = Steps.Step;


var userID;

class EditUser extends Component {

    constructor(props) {
        super(props);
        //Binding function with 'this' object
        this.handleEditSubmit = this.handleEditSubmit.bind(this);


        const thisObj = this;
        //Initializing state 
        this.state = {
            responseData: {
                formData: {},
                wizardData: {},
                selectOptions: {},
                countryDetails: []
            },
            userID,
            showEditModal: false,
            current: 0,
            update: 1,
            allValues: {},
            modalLoad: false,
        };
        //To get user form data
        this.state.userID = this.props.userID;
        const { userID } = this.props;
        const projectRole = getProjectRole();
        CallServerPost('Users/GetUserFormData', { FormName: "Users", ActionName: "Update", ID: this.state.userID, Editable: this.props.readOnly }).then(
            function (response) {
                const responseData = response.value;
                if (responseData.status == 0) {
                    errorModal(responseData.message);
                } else {
                    if (responseData.formData.filter(fd => fd.attributeName == "AdminType")[0].defaultValue == "127") {
                        responseData.formData.filter(fd => fd.attributeName == "AdminType")[0].defaultValue = true;
                        if (userID == projectRole.userProfile.userID) {
                            responseData.formData.filter(fd => fd.attributeName == "AdminType")[0].editable = false;
                        }
                    }
                    thisObj.setState({ responseData: responseData });
                }
            }).catch(error => error);


    }

    cancel = () => {
        let { switchUser } = this.props;
        this.props.cancel(!switchUser);
    }

    handleReset = () => {
        this.props.form.resetFields();
    }

    handleCancel = () => {
        this.setState({ showEditModal: false });
        this.props.form.resetFields(['Change Reason']);

    }
    UpdateAnyway = (ChangeReason) => {

        this.handleUpdate(ChangeReason, true);

    }

    handleUpdate = (ChangeReason, isOverride) => {

        const thisObj = this;
        let values = thisObj.state.allValues;

        values["UserID"] = this.state.userID;
        values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;
        values["ChangeReason"] = ChangeReason;
        values["isOverride"] = isOverride !== undefined ? isOverride : false;
        thisObj.setState({ modalLoad: true });
        if (values["AdminType"] === true) {
            values["AdminType"] = 127;
        } else if (values["AdminType"] === false) {
            values["AdminType"] = 128;
        }
        PostCallWithZone('Users/Update', values)
            .then(
                function (response) {
                    if (response.status === 0 && response.message.includes("assigned") && thisObj.props.actionName === "Edit") {
                        thisObj.setState({ modalLoad: false });
                        UserAssignedPop({
                            title: "Users",
                            msg: response.message,
                            action: "Update",
                            onOk: () => { thisObj.UpdateAnyway(ChangeReason) },
                            onCancel: () => { thisObj.cancel() }
                        });
                    } else if (response.status === 1) {
                        thisObj.setState({ actionNmae: "Index", modalLoad: false, showEditModal: false });

                        successModalCallback(response.message, thisObj.cancel);
                    } else {
                        thisObj.setState({ modalLoad: false, showEditModal: false });

                        errorModal(response.message);
                    }
                }).catch(error => error);


    }

    handleEditSubmit = () => {
        const thisObj = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                thisObj.setState({ showEditModal: true, allValues: values });
            }
        });
    }


    setDisplayName = (result) => {
        let getValue = this.props.form.getFieldValue;
        let firstName = getValue("FirstName");
        let lastName = getValue("LastName");
        let DisplayName = (firstName ? firstName + " " : "") + (lastName ? lastName : "");
        this.props.form.setFieldsValue({ DisplayName });
    }

    setUserName = (result) => {
        let getValue = this.props.form.getFieldValue;
        let emailAddress = getValue("EmailAddress");
        let UserName = (emailAddress ? emailAddress : "");
        this.props.form.setFieldsValue({ UserName });
    }

    render() {

        const { getFieldDecorator, setFieldsValue, validateFields } = this.props.form;
        const { responseData, current, update } = this.state;
        const { permissions } = this.props;

        return (
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-user" />
                        <span> User</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Edit
                    </Breadcrumb.Item>
                </Breadcrumb>
                {
                    Object.keys(responseData.formData).length > 0 && (
                        <SingleForm Editable={false } setDisplayName={this.setDisplayName} setUserName={this.setUserName} property={this} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.cancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleEditSubmit} />)


                }

                <ConfirmModal loading={this.state.modalLoad} title="Update User" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />

            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(EditUser);

export default WrappedApp;