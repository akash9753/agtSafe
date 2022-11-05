import React, { Component } from 'react';
import { Input, Select, Breadcrumb, Col, Row, Form, Steps, message, Modal, Icon, Tooltip, Spin } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import Button from '../../components/uielements/button';
import { CallServerPost, errorModal, successModalCallback, setProjestRoleSubmit, PostCallWithZone, getConfirmButtonText } from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import ConfirmModal from '../Utility/ConfirmModal';
import { checkSelect } from '../Utility/validator';
import authAction from '../../redux/auth/actions';
import createHistory from '../../helpers/auth0/history';
import { connect } from 'react-redux';
const Option = Select.Option;

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
const { permissionRefresh } = authAction;


class ChangeRole extends Component {
    constructor(props) {
        super(props);
        this.setRole = this.setRole.bind(this);

        this.state = {
            project: sessionStorage.project != null ? JSON.parse(sessionStorage.project) : {},
            role: {},
            loading: false,
            disableBtn: false
        };

    }

    setProjestRoleSubmit = ( project, role) => {
        const thisObj = this;
        const userProfile = JSON.parse(sessionStorage.userProfile);


        thisObj.props.form.validateFields(['RoleID'], { force: true }, (err, values) => {
            if (!err) {
                thisObj.setState({ loading: true, disableBtn: true });
                CallServerPost("Permission/GetPermissionLevelsForRole", { RoleID: parseInt(values.RoleID) })
                    .then(function (response) {
                        thisObj.setState({ loading: false, disableBtn: false });
                        let Project = project;
                        const Role = role;
                        let selectedRole = Role.filter(role => role.roleID == values.RoleID);

                        sessionStorage.setItem("project", JSON.stringify({ ProjectID: Project.ProjectID, ProjectName: Project.ProjectName }));
                        sessionStorage.setItem("role", JSON.stringify({ RoleID: selectedRole[0].roleID, RoleName: selectedRole[0].roleName }));
                        sessionStorage.setItem('permissions', JSON.stringify(response.value.permissions));
                        sessionStorage.setItem("userProfile", JSON.stringify(userProfile));
                        if (thisObj.props.handleCancel !== undefined) {
                            thisObj.props.handleCancel();
                        }
                        else {
                            thisObj.handleCancelProjectRoleSelectionModal();

                        }
                       // permissionRefresh({ permissions: response.value.permissions });
                        thisObj.props.history.push({
                            pathname: '/trans'
                        });
                    });
            }
        });

    }

    setRole = (project,role) => {
    if(this.props.form.getFieldValue('RoleID') != JSON.parse(sessionStorage.role).RoleID){
        this.setProjestRoleSubmit( project, role)
        }
        else{
            this.props.handleCancel();
        }
    }
    render() {

        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { loading, disableBtn } = this.state;

        var deafultOption = [(<Option disabled key="--Select--" >--Select--</Option>)];
        var roleOptions = [];

        if (this.props.roles.length != 0) {
            roleOptions = this.props.roles[JSON.parse(sessionStorage.project).ProjectID].map(function (option) {

                return (

                    <Option key={option.roleID} >
                        {option.roleName}
                    </Option>
                )


            });

        }
        roleOptions = deafultOption.concat(roleOptions);
        return (

            <Modal
                visible={this.props.visible}
                title={"Role Selection"}
                onCancel={disableBtn ? null : this.props.handleCancel}
                afterClose={this.removeAll}
                maskClosable={false}
                footer={[
                    <Button key="back" disabled={disableBtn} size="default" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={this.props.handleCancel}>Cancel</Button>,
                    <Button key="submit" disabled={disableBtn} className='ant-btn sc-ifAKCX fcfmNQ ant-btn-primary' size="default" onClick={() => this.setRole(this.state.project, this.props.roles[JSON.parse(sessionStorage.project).ProjectID])}>{getConfirmButtonText()}</Button>,

                ]}
            >
                <Spin indicator={antIcon} spinning={loading}>
                <Row>
                    <Col span={24}>
                        <FormItem
                            label="Roles"
                        >{
                                getFieldDecorator("RoleID", {
                                    rules: [{
                                        required: true,
                                        message: "Role should be selected"
                                    }, { validator: checkSelect, message: "Role should be selected" }],
                                    initialValue: roleOptions.filter(x => x.key === JSON.parse(sessionStorage.role).RoleID.toString()).length !== 0 ? JSON.parse(sessionStorage.role).RoleID.toString() : ""
                                })(
                                    <Select
                                        showSearch
                                        style={{ width: '100%' }}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {roleOptions}
                                    </Select>

                                    )}
                        </FormItem>
                    </Col>
                    </Row>
                </Spin>
            </Modal>
        );
    }
}

const WrappedApp = Form.create()(ChangeRole);
export default connect(
    null,
    { permissionRefresh }
)(WrappedApp);
