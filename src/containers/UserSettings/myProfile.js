import React, { Component } from 'react';
import { Breadcrumb, Icon, Col, Row, Select, Form, Modal } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import Button from '../../components/uielements/button';
//import { CallServerPost, errorModal, successModal, getProjectRole } from '../Utility/sharedUtility';
import { successModalCallback, CallServerPost, PostCallWithZone, errorModal, successModal, getProjectRole, checkPermission,resetPasswordSuccessModal } from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import SingleForm from '../Utility/SingleForm';
import ConfirmModal from '../Utility/ConfirmModal';

var projectRole = null;

class MyProfile extends Component {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            showEditModal: false,
            editForm: false,
            responseData: {
                formData: {},
                selectOptions: {},
                countryDetails: []
            },
            modalLoad: false,
            allValues: {},
            viewOnly: true
        };
        const thisObj = this;
        projectRole = getProjectRole();
        thisObj.setState({ modalLoad: true });
        CallServerPost('MyProfile/GetMyProfileFormData', { FormName: "MyProfile", ActionName: "Create", ID: projectRole.userProfile.userID, Editable: checkPermission(thisObj.props.permissions, ['self']) <= 1 }).then(
            function (response)
            {
                thisObj.setState({ modalLoad: false });
                const responseData = response.value;
                if (responseData.status == 0) {
                    errorModal(responseData.message);
                } else {
                    thisObj.setState({ responseData: responseData });
                }

            }).catch(error => error);

    }


    cancel = () => {

        this.props.history.push({
            pathname: '/trans'
        }
        );
    }

    handleCancel = () => {

        this.setState({ showEditModal: false });

    }
    editForm = () => {
        const { viewOnly } = this.state;
        var responseData = this.state.responseData;
        responseData.formData = this.state.responseData.formData.map(formField => {
            if (formField.attributeName !== "UserName" && formField.attributeName !== "DisplayName" && formField.attributeName !== "EmailAddress") {
                formField.editable = viewOnly ? 1 : 0;
            }
            return formField;
        });
        this.setState({ responseData: responseData, viewOnly: !viewOnly });
        if (!viewOnly) {
            this.props.form.resetFields();
        }
    }

    handleSubmit = () => {
        const thisObj = this;
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                thisObj.setState({ showEditModal: true, allValues: values });
            }
        });
    }

    handleUpdate = (ChangeReason) => {

        const thisObj = this;
        let values = thisObj.state.allValues;
        let { responseData } = thisObj.state
        thisObj.setState({ modalLoad: true });
        values["UserID"] = projectRole.userProfile.userID;
        values["ChangeReason"] = ChangeReason;
        values["UserStatusID"] = projectRole.userProfile.userStatusID;

        PostCallWithZone('MyProfile/Update', values)
            .then(
                function (response) {
                    thisObj.setState({ modalLoad: false });

                    if (response.status == 1) {
                        thisObj.setState({ showEditModal: false });
                        if (responseData.formData && typeof responseData.formData === "object" &&
                            responseData.formData.find(x => x.attributeName === "EmailAddress").defaultValue !== values.EmailAddress) {
                            resetPasswordSuccessModal(response.message, thisObj.props, "/trans");
                        }
                        else {
                            successModalCallback(response.message,() => thisObj.props.handleCancel());

                        }
                    } else {
                        thisObj.setState({ showEditModal: false });
                        errorModal(response.message);
                    }
                }).catch(error => error);

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

        const { responseData, viewOnly } = this.state;
        const { getFieldDecorator, setFieldsValue, validateFields } = this.props.form;
        const permissions = this.props.permissions;
        return (
        <div>
            {
                Object.keys(responseData.formData).length > 0 &&
                    <Modal
                        visible={this.props.visible}
                        maskClosable={false}
                        title={"My Profile"}
                        style={{ top: 20 }}
                        onCancel={this.props.handleCancel}
                        width={'80%'}
                        footer={[
                        ]}
                    >
                        <SingleForm
                            form={this.props.form}
                            Editable={false}
                            property={this}
                            responseData={responseData}
                            editForm={viewOnly}
                            getFieldDecorator={getFieldDecorator}
                            handleEdit={this.editForm}
                            handleCancel={viewOnly ? this.props.handleCancel : this.editForm}
                            setFieldsValue={setFieldsValue}
                            handleSubmit={this.handleSubmit}
                            validateFields={validateFields}
                            country={responseData.countryDetails}
                            setDisplayName={this.setDisplayName}
                            setUserName={this.setUserName}
                        />
                        <ConfirmModal loading={this.state.modalLoad} title="Update My Profile" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />

                    </Modal>
                }
            </div>

        );
    }
}

const WrappedApp = Form.create()(MyProfile);

export default WrappedApp;