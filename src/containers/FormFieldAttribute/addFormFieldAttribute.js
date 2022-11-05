import React, { Component } from 'react';
import { Breadcrumb, Icon, Col, Row, Select, Form, Modal, Spin } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import Button from '../../components/uielements/button';
import { CallServerPost, errorModal, successModal, getProjectRole } from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import SingleForm from '../Utility/SingleForm';

const projectRole = getProjectRole();

class AddFormFieldAttribute extends Component {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            loading: false,
            editForm: false,
            responseData: {
                formData: {},
                selectOptions: {}
            },
            formID: null,
            formActionID: null,
            visible: false,
        };

        const thisObj = this;

        var formID = thisObj.props.location.state.FormID;
        var formActionID = thisObj.props.location.state.FormActionID;

        //alert('formIDGlobal: ' + formID);
        //alert('formActionIDGlobal: ' + formActionID);

        CallServerPost('FormFieldAttribute/GetFormFieldAttributeFormData', { FormName: "FormFieldAttribute", ActionName: "Create" }).then(
            function (response) {

                const responseData = response.value;
                if (responseData.status == 0) {
                    errorModal(responseData.message);
                } else {
                    thisObj.setState({ responseData: responseData, FormID: formID, FormActionID: formActionID });
                }

            }).catch(error => error);

    }

        
    handleCancel = () => {
        this.props.history.push({
            pathname: '/trans/FormFieldAttribute'
        }
        );
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const thisObj = this;
        const { FormID } = this.state;
        const { FormActionID } = this.state;

        this.props.form.validateFields((err, values) => {
            if (!err) {
                values["FormID"] = FormID;
                values["FormActionID"] = FormActionID;
                values["TimeZone"] = "IST";
                values["UpdatedBy"] = projectRole.userProfile.userID;
                                
                if (values["RegExID"] != null && values["RegExID"] == "--Select--") {
                    values["RegExID"] = null;
                }
                if (values["WizardID"] != null && values["WizardID"] == "--Select--") {
                    values["WizardID"] = null;
                }

                CallServerPost('FormFieldAttribute/Create', values)
                    .then(
                    function (response) {
                        if (response.status == 1) {
                            successModal(response.message, thisObj.props, "/trans/FormFieldAttribute");
                        } else {
                            errorModal(response.message);
                        }
                    }).catch(error => error);
            }
        });
    }


    render() {

        const { responseData, loading } = this.state;
        const { getFieldDecorator, setFieldsValue } = this.props.form;

        return (
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Icon type="form" />
                        <span> Form Field Attribute </span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Add
                    </Breadcrumb.Item>
                </Breadcrumb>

                {Object.keys(responseData.formData).length > 0 &&
                    <SingleForm isCreate={true} property={this} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.handleCancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleSubmit} />
                }
            </LayoutContentWrapper>
        );
        
    }
}

const WrappedApp = Form.create()(AddFormFieldAttribute);

export default WrappedApp;