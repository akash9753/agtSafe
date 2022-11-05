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

class UpdateStandardValueLevelConfiguration extends Component {

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
            standardValueLevelConfigurationID: null,
            allValues: {},
            modalLoad: false,
        };


        if (typeof this.props.location.state != 'undefined') {

            let standardValueLevelConfigurationID = this.props.location.state.StandardValueLevelConfigurationID;
            CallServerPost('StandardValueLevelConfiguration/GetStandardValueLevelConfigurationFormData', { FormName: "StandardValueLevelConfiguration", ActionName: "Update", ID: standardValueLevelConfigurationID, Editable: this.props.location.state.readOnly  }).then(
                function (response) {
                    const responseData = response.value;
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    }
                    else {
                        thisObj.setState({ responseData: responseData, standardValueLevelConfigurationID: standardValueLevelConfigurationID });
                    }

                }).catch(error => error);

        }

    }

    handleUpdate = (ChangeReason) => {
        const thisObj = this;
        const { standardValueLevelConfigurationID } = thisObj.state;
        let values = thisObj.state.allValues;
        values["ChangeReason"] = ChangeReason;
        values["StandardValueLevelConfigurationID"] = standardValueLevelConfigurationID;
        values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;
        thisObj.setState({ modalLoad: true });
        
                PostCallWithZone('StandardValueLevelConfiguration/Update', values)
                    .then(
                    function (response) {
                        thisObj.setState({ modalLoad: false });
                        if (response.status == 1) {
                            thisObj.setState({ showEditModal: false });
                            successModal(response.message, thisObj.props, "/trans/StandardValueLevelConfiguration");
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
            pathname: '/trans/StandardValueLevelConfiguration'
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
                        <i className="fas fa-cogs" />
                        <span> Standard Value Level Configuration</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Edit
                    </Breadcrumb.Item>
                </Breadcrumb>

                {Object.keys(responseData.formData).length > 0 &&
                    <SingleForm Editable={this.props.location.state.readOnly}  property={this} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.cancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleSubmit} />
                }
                <ConfirmModal title="Update Standard Value Level Configuration" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad}/>
            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(UpdateStandardValueLevelConfiguration);

export default WrappedApp;