import React, { Component } from 'react';
import { Breadcrumb, Icon, Col, Row, Select, Form } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import Button from '../../components/uielements/button';
import { CallServerPost, errorModal, successModal, successModalCallback, getProjectRole } from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import SingleForm from '../Utility/SingleForm';

const projectRole = getProjectRole();

class AddProjectConfiguration extends Component {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            editForm: false,
            responseData: {
                formData: {},
                selectOptions: {}
            },
            projectID: 0,
        };

        const thisObj = this;

        

        CallServerPost('ProjectConfiguration/GetProjectConfigurationFormData', { FormName: "ProjectConfiguration", ActionName: "Create" }).then(
            function (response) {

                const responseData = response.value;
                if (responseData.status == 0) {
                    errorModal(responseData.message);
                } else {
                    thisObj.setState({ responseData: responseData });
                }

            }).catch(error => error);

    }
    

    cancel = () => {

        this.props.handleCancel();
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const thisObj = this;
        const { projectID } = this.props;

        this.props.form.validateFields((err, values) => {
            if (!err) {
                values["ProjectID"] = projectID;
                values["TimeZone"] = "IST";
                values["UpdatedBy"] = projectRole.userProfile.userID;
                CallServerPost('ProjectConfiguration/Create', values)
                    .then(
                    function (response) {
                        if (response.status == 1) {
                            successModalCallback(response.message, thisObj.props.handleSave);
                        } else {
                            errorModal(response.message);
                        }
                    }).catch(error => error);
            }
        });
    }


    render() {

        const { responseData } = this.state;
        const { getFieldDecorator, setFieldsValue } = this.props.form;

        return (
            <LayoutContentWrapper>                

                {Object.keys(responseData.formData).length > 0 &&
                    <SingleForm isCreate={true} property={this}  responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.cancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleSubmit} />
                }
            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(AddProjectConfiguration);

export default WrappedApp;