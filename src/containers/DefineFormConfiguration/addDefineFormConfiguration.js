import React, { Component } from 'react';
import { Breadcrumb, Form } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, errorModal, successModal, getProjectRole } from '../Utility/sharedUtility';
import SingleForm from '../Utility/SingleForm';

const projectRole = getProjectRole();
var thisObj;

class AddDefineFormConfiguration extends Component {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            editForm: false,
            responseData: {
                formData: {},
                selectOptions: {}
            },
        };

        thisObj = this;

        CallServerPost('DefineFormConfiguration/GetStandardFormData', { FormName: "DefineFormConfiguration", ActionName: "Create" }).then(
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

        this.props.history.push({
            pathname: '/trans/DefineFormConfiguration'
        }
        );
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const thisObj = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values["TimeZone"] = "IST";
                values["UpdatedBy"] = projectRole.userProfile.userID;

                CallServerPost('DefineFormConfiguration/Create', values)
                    .then(
                        function (response) {
                            if (response.status == 1) {
                                successModal(response.message, thisObj.props, "/trans/DefineFormConfiguration");
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
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-code-branch" />
                        <span> Define Form Configuration</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Add
                    </Breadcrumb.Item>
                </Breadcrumb>

                {Object.keys(responseData.formData).length > 0 &&
                    <SingleForm isCreate={true} property={this} props={this} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.cancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleSubmit} />
                }
            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(AddDefineFormConfiguration);

export default WrappedApp;