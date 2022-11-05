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

class UpdateWizard extends Component {

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
            wizardID: null,
            allValues: {},
            modalLoad: false,
        };

        if (typeof this.props.location.state != 'undefined') {

            let wizardID = this.props.location.state.WizardID;
            CallServerPost('Wizard/GetWizardFormData', { FormName: "Wizard", ActionName: "Update", ID: wizardID, Editable: this.props.location.state.readOnly }).then(
                function (response) {
                    const responseData = response.value;
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    }
                    else {
                        thisObj.setState({ responseData: responseData, wizardID: wizardID });
                    }

                }).catch(error => error);

        }
    }

    handleUpdate = (ChangeReason) => {
        const thisObj = this;
        const { wizardID } = this.state;
        let values = thisObj.state.allValues;
        values["ChangeReason"] = ChangeReason;
        values["WizardID"] = wizardID;
        values["FormActionID"] = this.props.location.state.FormActionID;
        values["WizardPosition"] = parseInt(values.WizardPosition);
        values["CancelButton"] = values.CancelButton == "Yes" ? true : false;
        values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;
        thisObj.setState({ modalLoad: true });

        PostCallWithZone('Wizard/Update', values)
            .then(
            function (response) {
                    thisObj.setState({ modalLoad: false });
                if (response.status == 1) {
                    thisObj.setState({ showEditModal: false });
                        successModal(response.message, thisObj.props, "/trans/Wizard");
                } else {
                    thisObj.setState({ showEditModal: false });
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
            pathname: '/trans/Wizard'
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
            <Form>
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                            <i className="fas fa-columns" />
                        <span> Wizard </span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Edit
                    </Breadcrumb.Item>
                </Breadcrumb>

                {Object.keys(responseData.formData).length > 0 &&
                        <SingleForm Editable={this.props.location.state.readOnly} property={this} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.cancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleSubmit} />
                }
                <ConfirmModal title="Update Wizard" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad}/>
                </LayoutContentWrapper>
                </Form>
        );
    }
}

const WrappedApp = Form.create()(UpdateWizard);

export default WrappedApp;