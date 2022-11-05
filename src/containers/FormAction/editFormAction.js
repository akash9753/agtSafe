import React, { Component } from 'react';
import { Breadcrumb, Icon, Col, Row, Select, Form, Modal, Spin } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import Button from '../../components/uielements/button';
import { CallServerPost, PostCallWithZone, errorModal, successModal } from '../Utility/sharedUtility';
import { getFormItemsLeft, getFormItemsRight } from '../Utility/htmlUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import ConfirmModal from '../Utility/ConfirmModal';
import SingleForm from '../Utility/SingleForm';


var formID = null;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

class UpdateFormAction extends Component {


    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        const thisObj = this;

        this.state = {
            loading: false,
            responseData: {
                formData: {},
                selectOptions: {}
            },
            formActionID: null,
            formID: null,
            allValues: {},
            showEditModal: false
        };

        this.getFormData(this.props);
    }

    getFormData = (props) => {
        const thisObj = this;
        if (typeof props.FormID != "undefined" && props.FormID != null && props.action === "Update" && props.visible) {
            CallServerPost('FormAction/GetFormActionFormData', { FormName: "FormAction", ActionName: "Update", ID: props.FormActionID, Editable: props.readOnly }).then(
                function (response) {
                    const responseData = response.value;
                    if (response.status == 0) {
                        errorModal(responseData.message);
                    }
                    else {
                        thisObj.setState({ responseData: responseData, formActionID: props.FormActionID, formID: props.FormID});
                    }
                }).catch(error => error);
        }
    }

    handleUpdate = (ChangeReason) => {
        const thisObj = this;
        const { formActionID, formID } = this.state;
        let values = thisObj.state.allValues;
        values["FormID"] = formID;
        values["FormActionID"] = formActionID;
        values["ChangeReason"] = ChangeReason;
        values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;
        thisObj.setState({ loading: true });
        PostCallWithZone('FormAction/Update', values)
            .then(
                function (response) {
                    thisObj.setState({ loading: false });
                    if (response.status == 1) {
                        successModal(response.message, thisObj.props, "/trans/formAction");
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

    handleCancel = () => {
        this.props.handleCancel();
    }

    handleConfirmModalCancel = () => {
        this.props.form.resetFields(['Change Reason']);
        this.setState({ showEditModal: false, loading: false });
    }

    render() {
        const { responseData, loading } = this.state;
        const { getFieldDecorator, setFieldsValue } = this.props.form;

        return (

            <Modal
                visible={this.props.visible}
                title={"Edit Form Action"}
                style={{ top: 20 }}
                onCancel={this.handleCancel}
                width={'80%'}
                maskClosable={false}
                footer={null}
            >

                <Spin indicator={antIcon} spinning={loading}>
                    {Object.keys(responseData.formData).length > 0 &&
                        <SingleForm Editable={this.props.readOnly} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.handleCancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleSubmit} property={this} />
                    }
                    <ConfirmModal loading={loading} title="Update Form Action" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditModal} handleCancel={this.handleConfirmModalCancel} getFieldDecorator={getFieldDecorator} />
                </Spin>

            </Modal>

        );
    }
}

const WrappedApp = Form.create()(UpdateFormAction);

export default WrappedApp;