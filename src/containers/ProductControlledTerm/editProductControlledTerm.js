import React, { Component } from 'react';
import { Breadcrumb, Icon, Col, Row, Select, Form, } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import Button from '../../components/uielements/button';
import { CallServerPost, showProgress, successModalCallback, PostCallWithZone, errorModal, hideProgress } from '../Utility/sharedUtility';
import { getFormItemsLeft, getFormItemsRight } from '../Utility/htmlUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import ConfirmModal from '../Utility/ConfirmModal';
import SingleForm from '../Utility/SingleForm';

let thisObj = {};
let productControlledTermID = 0;

class UpdateProductControlledTerm extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.state = {
            showEditModal: false,
            responseData: {
                formData: {},
                selectOptions: {}
            },
            productControlledTermID: null,
            allValues: {},
            modalLoad: false,
        };
        thisObj = this;
    }
        static getDerivedStateFromProps(newProps, currState) {
            if (newProps.productControlledTermID !== productControlledTermID)
            {
            productControlledTermID = newProps.productControlledTermID;
            showProgress();
            CallServerPost('ProductControlledTerm/GetProductControlledTermFormData', {
                FormName: "ProductControlledTerm",
                ActionName: "Update",
                ID: newProps.productControlledTermID,
                Editable: thisObj.props.readOnly
            }).then(function (response) {
                hideProgress();
                const responseData = response.value;
                if (responseData.status == 0) {
                    errorModal(responseData.message);
                } else {
                    thisObj.setState({ responseData: responseData, productControlledTermID: newProps.productControlledTermID });
                }
            }).catch(error => error);
        }
    }
           



cancel = () => {
    productControlledTermID = 0;
    thisObj.props.handleCancel();
}

handleUpdate = (ChangeReason) => {
    const thisObj = this;
    const { productControlledTermID } = this.state;

    let values = thisObj.state.allValues;
    values["productControlledTermID"] = productControlledTermID;
    values["ChangeReason"] = ChangeReason;
    values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;
    showProgress();
    PostCallWithZone('ProductControlledTerm/Update', values)
        .then(
            function (response) {
                hideProgress();
                if (response.status == 1) {
                    successModalCallback(response.message,  thisObj.cancel());
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
                        <i className="fas fa-wrench" />
                        <span> Product Controlled Term</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Edit
                    </Breadcrumb.Item>
                </Breadcrumb>

                {Object.keys(responseData.formData).length > 0 &&
                    <SingleForm Editable={this.props.readOnly} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.cancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleSubmit} property={this} />
                }
                <ConfirmModal loading={this.state.modalLoad} title="Update Product Controlled Term" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(UpdateProductControlledTerm);

export default WrappedApp;