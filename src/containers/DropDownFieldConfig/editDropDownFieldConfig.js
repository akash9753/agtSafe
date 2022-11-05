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

class UpdateDropDownFieldConfig extends Component {

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
            dropDownFieldConfigID: null,
            modalLoad: false,
            allValues: {},
        };

        if (typeof this.props.location.state != 'undefined') {

            let dropDownFieldConfigID = this.props.location.state.DropDownFieldConfigID;
            CallServerPost('DropDownFieldConfig/GetDropDownFieldConfigFormData', { FormName: "DropDownFieldConfig", ActionName: "Update", ID: dropDownFieldConfigID, Editable: this.props.location.state.readOnly }).then(
                function (response) {
                    const responseData = response.value;
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    }
                    else {
                        thisObj.setState({ responseData: responseData, dropDownFieldConfigID: dropDownFieldConfigID });
                    }

                }).catch(error => error);

        }
    }

    handleUpdate = (ChangeReason) => {
        const thisObj = this;
        let values = thisObj.state.allValues;
        thisObj.setState({ modalLoad: true });

        values["ChangeReason"] = ChangeReason;
        const { dropDownFieldConfigID } = this.state;
        values["DropDownFieldConfigID"] = dropDownFieldConfigID;
        values["FormFieldAttributeID"] = this.props.location.state.FormFieldAttributeID;
        values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;

                PostCallWithZone('DropDownFieldConfig/Update', values)
                    .then(
                        function (response) {
                            if (response.status == 1) {
                                thisObj.setState({ showEditModal:true, modalLoad: false });

                                successModal(response.message, thisObj.props, "/trans/DropDownFieldConfig");
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
            pathname: '/trans/DropDownFieldConfig'
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
                            <i className="fas fa-receipt" />
                            <span> Drop Down Field Config </span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            Edit
                    </Breadcrumb.Item>
                    </Breadcrumb>

                    {Object.keys(responseData.formData).length > 0 &&
                    <SingleForm Editable={this.props.location.state.readOnly} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.cancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleSubmit} property={this} />
                    }
                    <ConfirmModal loading={this.state.modalLoad} title="Update Wizard" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
                </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(UpdateDropDownFieldConfig);

export default WrappedApp;
