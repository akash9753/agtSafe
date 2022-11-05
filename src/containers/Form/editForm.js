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

class UpdateForm extends Component {

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
            formID: null,
            modalLoad: false,
            allValues: {},

        };

        
        if (typeof this.props.location.state != 'undefined') {
            
            let formID = this.props.location.state.FormID;
            CallServerPost('Form/GetFormFormData', { FormName: "Form", ActionName: "Update", ID: formID, Editable: this.props.location.state.readOnly }).then(
                function (response) {
                    const responseData = response.value;
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    }
                    else {
                        thisObj.setState({ responseData: responseData, formID: formID });
                    }

                }).catch(error => error);

        }
        
    }

    handleUpdate = (ChangeReason) => {
        const thisObj = this;
        const { formID } = this.state;
        let values = thisObj.state.allValues;

        thisObj.setState({ modalLoad: true });
        values["FormID"] = formID;
        values["ChangeReason"] = ChangeReason;
        values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;

            PostCallWithZone('Form/Update', values)
                .then(
                function (response) {
                    if (response.status == 1) {
                        thisObj.setState({ modalLoad: false });
                        successModal(response.message, thisObj.props, "/trans/form");
                    } else {
                        thisObj.setState({ modalLoad: false });

                        errorModal(response.message);
                    }
                }).catch(error => error);
    }

    handleSubmit = () => {
        const thisObj = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                thisObj.setState({ showEditModal: true, allValues: values });
            }
        });
    }

    cancel = () => {

        this.props.history.push({
            pathname: '/trans/form'
        }
        );
    }

    handleCancel = () => {
        this.setState({ showEditModal: false });
        this.props.form.resetFields(['Change Reason']);

    }

    //handleCancel = () => {
    //    this.setState({ showEditModal: false });
    //}

    render() {
        const { responseData } = this.state;
        const { getFieldDecorator, setFieldsValue } = this.props.form;

        return (
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-file-code" />
                        <span> Form</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Edit
                    </Breadcrumb.Item>
                </Breadcrumb>

                {Object.keys(responseData.formData).length > 0 &&
                    <SingleForm Editable={this.props.location.state.readOnly} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.cancel} setFieldsValue={setFieldsValue} property={this} handleSubmit={this.handleSubmit} />
                }
                <ConfirmModal loading={this.state.modalLoad} title="Update Form" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(UpdateForm);

export default WrappedApp;