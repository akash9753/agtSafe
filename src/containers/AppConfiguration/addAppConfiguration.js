import React, { Component } from 'react';
import { Breadcrumb, Icon, Col, Row, Select, Form } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import Button from '../../components/uielements/button';
import { CallServerPost, errorModal, successModal, getProjectRole } from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import SingleForm from '../Utility/SingleForm';

const projectRole = getProjectRole();

class AddAppConfiguration extends Component {

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

        const thisObj = this;
        CallServerPost('AppConfiguration/GetAppConfigFormData', { FormName: "AppConfiguration", ActionName: "Create" }).then(
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
            pathname: '/trans/AppConfiguration'
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
                CallServerPost('AppConfiguration/Create', values)
                    .then(
                        function (response) {
                            if (response.status == 1) {
                                successModal(response.message, thisObj.props, "/trans/AppConfiguration");
                            } else {
                                errorModal(response.message);
                            }
                        }).catch(error => error);
            }
        });
    }    

    //handleSubmit = (e) => {
    //    e.preventDefault();
    //    const thisObj = this;
    //    this.props.form.validateFields((err, values) => {
    //        if (!err) {
    //            values["TimeZone"] = "IST";
    //            values["UpdatedBy"] = projectRole.userProfile.userID;
    //            CallServerPost('AppConfiguration/Create', values)
    //                .then(
    //                    function (response) {
    //                        if (response.status == 1) {
    //                            successModal(response.message, thisObj.props, "/trans/appConfiguration");
    //                        } else {
    //                            errorModal(response.message);
    //                        }
    //                    }).catch(error => error);
    //        }
    //    });
    //}    

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
                        Add
                    </Breadcrumb.Item>
                </Breadcrumb>

                {Object.keys(responseData.formData).length > 0 &&
                    <SingleForm isCreate={true} property={this} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.cancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleSubmit} />
                }
            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(AddAppConfiguration);

export default WrappedApp;