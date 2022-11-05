import React, { Component } from 'react';
import { Breadcrumb, Form } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, PostCallWithZone, errorModal, successModal } from '../Utility/sharedUtility';
import ConfirmModal from '../Utility/ConfirmModal';
import SingleForm from '../Utility/SingleForm';

var thisObj;

class EditDefineFormConfiguration extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

        this.state = {
            showModal: false,
            responseData: {
                formData: {},
                selectOptions: {}
            },
            defineFormConfigurationID: '',
            allValues: {},
            modalLoad: false,
        };

        thisObj = this;

        if (typeof this.props.location.state != 'undefined') {

            let defineFormConfigurationID = this.props.location.state.defineFormConfigurationID;

            CallServerPost('DefineFormConfiguration/GetStandardFormData', { FormName: "DefineFormConfiguration", ActionName: "Update", ID: defineFormConfigurationID, Editable: this.props.location.state.readOnly }).then(
                function (response) {
                    const responseData = response.value;
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    }
                    else {
                        thisObj.setState({ responseData: responseData, defineFormConfigurationID: defineFormConfigurationID });
                    }

                }).catch(error => error);

        }

    }

    handleUpdate = (ChangeReason) => {
        const thisObj = this;
        const { defineFormConfigurationID } = this.state;
        let values = thisObj.state.allValues;
        values["ChangeReason"] = ChangeReason;
        values["defineFormConfigurationID"] = defineFormConfigurationID;
        values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;
        thisObj.setState({ modalLoad: true });
        PostCallWithZone('DefineFormConfiguration/Update', values)
            .then(
                function (response) {
                    thisObj.setState({ modalLoad: false });
                    if (response.status == 1) {
                        successModal(response.message, thisObj.props, "/trans/DefineFormConfiguration");
                    } else {
                        errorModal(response.message);
                    }
                }).catch(error => error);

    }

    handleSubmit = () => {
        const thisObj = this;
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                thisObj.setState({ showModal: true, allValues: values });
            }
        });
    }

    cancel = () => {

        this.props.history.push({
            pathname: '/trans/DefineFormConfiguration'
        }
        );
    }

    handleCancel = () => {
        this.setState({ showModal: false });
        this.props.form.resetFields(['ChangeReason']);

    }

    render() {
        const { responseData } = this.state;
        const { getFieldDecorator, setFieldsValue } = this.props.form;

        return (
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-code-branch" />
                        <span> Define Form Configuration</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Edit
                    </Breadcrumb.Item>
                </Breadcrumb>

                {Object.keys(responseData.formData).length > 0 &&
                    <SingleForm Editable={this.props.location.state.readOnly} property={this} props={this} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.cancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleSubmit} />
                }
                <ConfirmModal loading={this.state.modalLoad} title="Update Define Form Configuration" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(EditDefineFormConfiguration);

export default WrappedApp;