import React, { Component } from 'react';
import { Breadcrumb, Icon, Col, Row, Select, Form, Modal, Spin } from 'antd';
import { CallServerPost, errorModal, successModal, getProjectRole } from '../Utility/sharedUtility';
import SingleForm from '../Utility/SingleForm';

const projectRole = getProjectRole();
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

class CopyRolePermission extends Component {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            editForm: false,
            responseData: {
                formData: {},
                selectOptions: {}
            },
            loading: true,
            disableBtn: false,
            CopiedPermissionRoleID: this.props.roleID
        };
        const thisObj = this;
        CallServerPost('Roles/GetRolesFormData', { FormName: "Roles", ActionName: "Create" }).then(
            function (response) {

                const responseData = response.value;
                if (responseData.status == 0) {
                    errorModal(responseData.message);
                } else {
                    thisObj.setState({ responseData: responseData, loading: false});
                }

            }).catch(error => error);

    }

    cancel = () => {
        this.props.form.resetFields();
        this.props.handleCancel();
    }

    handleSubmit = () => {
        const thisObj = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                thisObj.setState({ loading: true, disableBtn: true });
                values["RoleID"] = thisObj.state.CopiedPermissionRoleID;
                values["TimeZone"] = "IST";
                values["UpdatedBy"] = projectRole.userProfile.userID;
                CallServerPost('Roles/CreateRolesPermission', values)
                    .then(
                        function (response) {
                            if (response.status == 1) {
                                successModal(response.message, thisObj.props, "/trans/roles");
                            } else {
                                errorModal(response.message);
                            }
                            thisObj.setState({ loading: false, disableBtn: false });
                        }).catch(error => error);
            }
        });
    }


    render() {

        const { responseData } = this.state;
        const { getFieldDecorator, setFieldsValue } = this.props.form;

        return (
            <Modal
                visible={this.props.visible}
                maskClosable={false}
                style={{ top: 20, height: "calc(100vh - 45px)" }}
                title={"Copy Role Permissions"}
                width={'80%'}
                onCancel={this.state.disableBtn ? null : this.cancel}
                footer={null}
                ref="modal"
            >
                <Spin indicator={antIcon} style={{ background: "rgba(255, 255, 255, 0.7)" }} spinning={this.state.loading} >
                        {Object.keys(responseData.formData).length > 0 &&
                        <SingleForm /*permissions={this.props.permissions}*/ isCreate={true} property={this} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.cancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleSubmit} />
                        }
                    </Spin>
            </Modal>
        );
    }
}

const WrappedApp = Form.create()(CopyRolePermission);

export default WrappedApp;