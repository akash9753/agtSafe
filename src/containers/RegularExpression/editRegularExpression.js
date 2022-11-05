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

class UpdateRegularExpression extends Component {

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
            regularExpressionID: null,
            allValues: {},
            modalLoad: false,
        };

        if (typeof this.props.location.state != 'undefined') {

            let regularExpressionID = this.props.location.state.RegularExpressionID;
            CallServerPost('RegularExpression/GetRegularExpressionFormData', { FormName: "RegularExpression", ActionName: "Update", ID: regularExpressionID, Editable: this.props.location.state.readOnly }).then(
                function (response) {
                    const responseData = response.value;
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    }
                    else {
                        thisObj.setState({ responseData: responseData, regularExpressionID: regularExpressionID });
                    }

                }).catch(error => error);

        }
    }

    handleUpdate = (ChangeReason) => {
        const thisObj = this;
        const { regularExpressionID } = this.state;
        let values = thisObj.state.allValues;
        values["RegularExpressionID"] = regularExpressionID;
        values["ChangeReason"] = ChangeReason;
        values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;
        thisObj.setState({ modalLoad: true });
        PostCallWithZone('RegularExpression/Update', values)
            .then(
            function (response) {
                    thisObj.setState({ modalLoad: false });
                    if (response.status == 1) {
                        successModal(response.message, thisObj.props, "/trans/RegularExpression");
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
            pathname: '/trans/RegularExpression'
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
                        <i className="fas fa-code" />
                        <span> Regular Expression</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Edit
                    </Breadcrumb.Item>
                </Breadcrumb>

                {Object.keys(responseData.formData).length > 0 &&
                    <SingleForm Editable={this.props.location.state.readOnly} loading={this.state.modalLoad} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.cancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleSubmit} property={this}/>
                }
                <ConfirmModal loading={this.state.modalLoad} title="Update RegularExpression" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(UpdateRegularExpression);

export default WrappedApp;