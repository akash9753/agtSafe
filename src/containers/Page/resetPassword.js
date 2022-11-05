import React, { Component } from 'react';
import { Breadcrumb, Icon, Col, Row, Select, Form, Modal } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import Button from '../../components/uielements/button';
import { checkPassword } from '../Utility/validator';
//import { CallServerPost, errorModal, successModal, getProjectRole } from '../Utility/sharedUtility';
import { CallServerPost, PostCallWithZone, errorModal, successModal, getProjectRole, PASS_KEY_UI, encryptSensitiveData, updatePasswordSuccessModal, checkPermission, showProgress, hideProgress } from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import SingleForm from '../Utility/SingleForm';
import ConfirmModal from '../Utility/ConfirmModal';
import InformationModal from '../Utility/InformationModal';

const userProfile = JSON.parse(sessionStorage.getItem("userProfile"));
var projectRole = null;

class ResetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);

        const thisObj = this;
        this.state = {
            showEditModal: false,
            showEditInfo: false,
            editForm: true,
            responseData: {
                formData: {},
                selectOptions: {}

            },
            modalLoad: false,
            allValues: {},
        };
        projectRole = getProjectRole();

        CallServerPost('Users/GetFormDataResetPassword', { FormName: "ChangePassword", ActionName: "ChangePassword", ID: projectRole.userProfile.userID, Editable: checkPermission(thisObj.props.permissions, ['self']) <= 1 }).then(
            function (response) {
                //console.log(userProfile);
                const responseData = response.value;
                if (responseData.status == 0) {
                    errorModal(responseData.message);
                } else {
                    //console.log(response);
                    thisObj.setState({ responseData: responseData });
                }

            }).catch(error => error);

    }


    //cancel = () => {

    //    this.props.history.push({
    //        pathname: '/trans'
    //    }
    //    );
    //}

    handleCancel = () => {
        this.setState({ showEditModal: false });
    }

    handleShowInfoModal = () => {
        this.setState({ showEditInfo: true });
    }

    handleCancelInfoModal = () => {
        this.setState({ showEditInfo: false });
    }

    handleSubmit = () => {
        const thisObj = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                thisObj.setState({ showEditModal: true, allValues: values });
            }
        });
    }

    handleUpdate = (ChangeReason) => {
        const thisObj = this;
        let values = thisObj.state.allValues;
        showProgress();
        values["ChangeReason"] = ChangeReason;
        values["UserID"] = projectRole.userProfile.userID;
        values["UserPassword"] = encryptSensitiveData(values["NewPassword"], PASS_KEY_UI);
        PostCallWithZone('Users/UpdateUserPassword', values)
            .then(
                function (response) {
                    hideProgress();
                    if (response.status == 1) {
                        updatePasswordSuccessModal(response.message, thisObj.props, "/trans");
                    } else {
                        thisObj.setState({ modalLoad: false }, () => {
                            errorModal(response.message);
                        });
                    }
                }).catch(error => () => {
                    errorModal("Unable to update password.");
                });

    }
    getValueFromForm = (getFieldsValue, key) => {
        return getFieldsValue([key])[key] !== undefined
            ? getFieldsValue([key])[key]
            : "";
    }

    render() {
        const { responseData } = this.state;
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const permissions = this.props.permissions;
        let newPassword = this.getValueFromForm(getFieldsValue, "NewPassword");
        return (
            <Modal
                visible={this.props.visible}
                maskClosable={false}
                title={"Change Password"}
                style={{ top: 20 }}
                onCancel={this.props.handleCancel}
                width={'80%'}
                footer={[
                ]}
            >

                <LayoutContentWrapper>

                    {
                        Object.keys(responseData.formData).length > 0 &&
                        <SingleForm Editable={checkPermission(permissions, ['self']) <= 1} isCreate={true} property={this} responseData={responseData} props={this} getFieldDecorator={getFieldDecorator} handleCancel={this.props.handleCancel} handleSubmitUpdate={this.handleSubmit} />

                    }
                    <ConfirmModal loading={this.state.modalLoad} title="Change Password" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />

                    <div style={{ textAlign: 'justify', paddingLeft: 10 }}>
                        <h2 style={{ paddingTop: '15px' }}><b>Password Policy:</b></h2>
                        <ul className="PasswordRules" style={{ padding: '10px 0 0 0px' }}>
                            <li className="forgotlimargin"><i
                                style={{
                                    color: (newPassword !== null ? (newPassword.length >= 8 && newPassword.length <= 15 ? "green" : "red") : "red"),
                                    fontSize: "10px"
                                }}
                                className="fa fa-check-circle" aria-hidden="true">
                            </i>
                                <span>Password should be between 8-15 characters.</span>
                            </li>
                            <li> Should contain characters from  three of the following four categories:
                                <ul
                                    className="PasswordRules"
                                    style={{ marginTop: "10px" }}
                                >

                                    <li className="forgotlimargin"
                                        style={{ textAlign: "left", marginBottom: "10px", marginLeft: 20 }}
                                    >
                                        <i
                                            style={{
                                                color: newPassword !== null ? newPassword.match(/[A-Z]/) ? "green" : "red" : "red",
                                                fontSize: "10px"
                                            }}
                                            className="fa fa-check-circle" aria-hidden="true"
                                        >
                                        </i>
                                        <span>Must have at least one upper case character [A-Z]</span>
                                    </li>
                                    <li className="forgotlimargin"
                                        style={{ textAlign: "left", marginBottom: "10px", marginLeft: 20 }}
                                    >
                                        <i
                                            style={{
                                                color: newPassword !== null ? newPassword.match(/[a-z]/) ? "green" : "red" : "red",
                                                fontSize: "10px"
                                            }}
                                            className="fa fa-check-circle"
                                            aria-hidden="true">
                                        </i>
                                        <span>Must have at least one lower case character [a-z]</span>
                                    </li>
                                    <li
                                        className="forgotlimargin"
                                        style={{ textAlign: "left", marginBottom: "10px", marginLeft: 20 }}
                                    >
                                        <i
                                            style={{
                                                color: newPassword !== null ? newPassword.match(/[0-9]/) ? "green" : "red" : "red",
                                                fontSize: "10px"
                                            }}
                                            className="fa fa-check-circle"
                                            aria-hidden="true"
                                        >
                                        </i>
                                        <span>Must have at least one numeric digit [0-9]</span>
                                    </li>
                                    <li
                                        className="forgotlimargin"
                                        style={{ textAlign: "left", marginBottom: "10px", marginLeft: 20 }}
                                    >
                                        <i
                                            style={{
                                                color: newPassword !== null ? newPassword.match(/[`~!@#$%\^&*()+=|;:'",.<>{}[\]_\/?\\\-]/) ? "green" : "red" : "red",
                                                fontSize: "10px"
                                            }}
                                            className="fa fa-check-circle"
                                            aria-hidden="true"
                                        >
                                        </i>
                                        <span>Must have at least one special character.Allowed special characters are [!,@,#,$,%,^,&,*,(,)]</span>                                                      </li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                </LayoutContentWrapper>
            </Modal>
        );
    }
}

const WrappedApp = Form.create()(ResetPassword);

export default WrappedApp;