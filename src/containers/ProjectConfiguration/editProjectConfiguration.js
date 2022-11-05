import React, { Component } from 'react';
import { Breadcrumb, Icon, Col, Row, Select, Form, } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import Button from '../../components/uielements/button';
import { CallServerPost, PostCallWithZone, errorModal, successModal, successModalCallback } from '../Utility/sharedUtility';
import { getFormItemsLeft, getFormItemsRight } from '../Utility/htmlUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import ConfirmModal from '../Utility/ConfirmModal';
import SingleForm from '../Utility/SingleForm';

class UpdateProjectConfiguration extends Component {

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
            projectConfigurationID: null,
            projectID: null,
            allValues: {},
            modalLoad: false,

        };
        

            
            const { projectConfigurationID } = this.props;

        CallServerPost('ProjectConfiguration/GetProjectConfigurationFormData', { FormName: "ProjectConfiguration", ActionName: "Update", ID: projectConfigurationID, Editable: this.props.readOnly }).then(
                function (response) {
                    const responseData = response.value;
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    }
                    else {
                        thisObj.setState({ responseData: responseData, projectConfigurationID: projectConfigurationID });
                    }

                }).catch(error => error);

        
    }

    handleUpdate = (ChangeReason) => {
        const thisObj = this;
        const { projectConfigurationID } = this.props;
        const { projectID } = this.props;
        let values = thisObj.state.allValues;
        values["ChangeReason"] = ChangeReason;   
        values["ProjectID"] = projectID;
        values["ProjectConfigurationID"] = projectConfigurationID;
        values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;
        thisObj.setState({ modalLoad: true });

        PostCallWithZone('ProjectConfiguration/Update', values)
            .then(
            function (response) {
                thisObj.setState({ modalLoad: false });
                if (response.status == 1) {
                    //successModal(response.message, thisObj.props, "/trans/ProjectConfiguration");
                    successModalCallback(response.message, thisObj.props.handleSave);
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

        this.props.handleCancel();
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

                {Object.keys(responseData.formData).length > 0 &&
                    <SingleForm Editable={this.props.readOnly} property={this} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.cancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleSubmit} />
                }
                <ConfirmModal loading={this.state.modalLoad} title="Update Project Configuration" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(UpdateProjectConfiguration);

export default WrappedApp;