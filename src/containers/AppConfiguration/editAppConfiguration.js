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

class UpdateAppConfiguration extends Component {

    constructor(props) {
        super(props);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        const thisObj = this;
        this.state = {
            showEditModal: false,
            responseData: {
                formData: {},
                selectOptions: {}
            },
            appConfigID: null,
            allValues: {},
            modalLoad: false,
        };
        if (typeof this.props.location.state != 'undefined') {
            let appConfigID = this.props.location.state.AppConfigurationID;
            CallServerPost('AppConfiguration/GetAppConfigFormData', { FormName: "AppConfiguration", ActionName: "Update", ID: appConfigID, Editable: this.props.location.state.readOnly }).then(
                function (response) {
                    const responseData = response.value;
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    }
                    else {
                        thisObj.setState({ responseData: responseData, appConfigID: appConfigID });
                    }

                }).catch(error => error);

        }
    }

    handleChangeReason = (ChangeReason) => {

        const thisObj = this;
        let values = thisObj.state.allValues;

        const { appConfigID } = this.state;

        thisObj.setState({ modalLoad: true });

        values["AppConfigurationID"] = appConfigID;
        values["ChangeReason"] = ChangeReason;
        values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;

                PostCallWithZone('AppConfiguration/Update', values)
                    .then(
                        function (response) {
                            if (response.status == 1) {
                                thisObj.setState({ showEditModal: false, modalLoad: false });

                                successModal(response.message, thisObj.props, "/trans/appConfiguration");
                            } else {
                                thisObj.setState({ modalLoad: false });

                                errorModal(response.message);
                            }
                        }).catch(error => error);
           
    }

    handleUpdate = () => {
        const thisObj = this;
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                thisObj.setState({ showEditModal: true, allValues: values });
            }
        });
    }
  

    cancel = () => {

        this.props.history.push({
            pathname: '/trans/appConfiguration'
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
                        <i className="fas fa-sliders-h" />
                        <span> App Configuration</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Edit
                    </Breadcrumb.Item>
                </Breadcrumb>

                {Object.keys(responseData.formData).length > 0 &&
                    <SingleForm Editable={this.props.location.state.readOnly} property={this} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.cancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleUpdate} />
                }
                <ConfirmModal loading={this.state.modalLoad} title="Update App Configuration" SubmitButtonName="Update" onSubmit={this.handleChangeReason} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(UpdateAppConfiguration);

export default WrappedApp;