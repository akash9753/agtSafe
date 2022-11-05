import React, { Component } from 'react';
import { Breadcrumb, Icon, Col, Row, Select, Form, } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import Button from '../../components/uielements/button';
import { CallServerPost, PostCallWithZone, errorModal, successModal } from '../Utility/sharedUtility';
import { getFormItemsLeft, getFormItemsRight } from '../Utility/htmlUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import ConfirmModal from '../Utility/ConfirmModal';
import SingleForm from '../Utility/SingleForm';

class UpdatePasswordSecurityQuestion extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        const thisObj = this;
        this.state = {
            showEditModal: false,
            responseData: {
                formData: {},
                selectOptions: {}
            },
            passwordSecurityQuestionID: null,
            allValues: {},
            modalLoad: false,       
        };
        if (typeof this.props.location.state != 'undefined') {
            
            let passwordSecurityQuestionID = this.props.location.state.PasswordSecurityQuestionID;
            CallServerPost('PasswordSecurityQuestions/GetPasswordSecurityQuestionsFormData', { FormName: "PasswordSecurityQuestion", ActionName: "Update", ID: passwordSecurityQuestionID, Editable: this.props.location.state.readOnly }).then(
                function (response) {
                    const responseData = response.value;
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    }
                    else {
                        thisObj.setState({ responseData: responseData, passwordSecurityQuestionID: passwordSecurityQuestionID  });
                    }

                }).catch(error => error);

        }
    }

    handleUpdate = (ChangeReason) => {
        const thisObj = this;
        const { passwordSecurityQuestionID } = this.state;
        thisObj.setState({ modalLoad: true });
        let values = thisObj.state.allValues;
        values["PasswordSecurityQuestionID"] = passwordSecurityQuestionID;
        values["ChangeReason"] = ChangeReason;
        values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;

        PostCallWithZone('PasswordSecurityQuestions/Update', values)
            .then(
            function (response) {
                    thisObj.setState({ modalLoad: false });
                    if (response.status == 1) {
                        successModal(response.message, thisObj.props, "/trans/PasswordSecurityQuestion");
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

    cancel = () => {

        this.props.history.push({
            pathname: '/trans/PasswordSecurityQuestion'
        }
        );
    }

    handleCancel = () => {
        this.setState({ showEditModal: false });
        this.props.form.resetFields(['Change Reason']);

    }
    render() {
        const { responseData } = this.state;
        const { getFieldDecorator, setFieldsValue } = this.props.form;

        return (
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-question-circle" />
                        <span> Password Security Question</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Edit
                    </Breadcrumb.Item>
                </Breadcrumb>

                {Object.keys(responseData.formData).length > 0 &&
                    <SingleForm Editable={this.props.location.state.readOnly} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.cancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleSubmit} property={this}/>
                }
                <ConfirmModal loading={this.state.modalLoad} title="Update Password Security Question" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(UpdatePasswordSecurityQuestion);

export default WrappedApp;