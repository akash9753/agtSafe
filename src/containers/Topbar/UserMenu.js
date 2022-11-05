import React, { Component } from 'react';
import { Form, Modal, Button, Result } from 'antd';
import { connect } from 'react-redux';
import Popover from '../../components/uielements/popover';
import IntlMessages from '../../components/utility/intlMessages';
import {
    CallServerPost,
    errorModal,
    getProjectRole,
    setProjestRoleSubmit,
    fnLogout,
    checkPermission,
    validJSON
} from '../Utility/sharedUtility';
import userpic from '../../image/user1.png';
import authAction from '../../redux/auth/actions';
import { Link } from 'react-router-dom';
import ChangeRole from '../../containers/UserSettings/changeRole';
import TopbarDropdownWrapper from './topbarDropdown.style';
import RoleSelect from '../Dashboard/roleSelect.js';
import AssignmentDetails from '../UserSettings/assignmentDetails';
import ResetPassword from '../Page/resetPassword';
import UpdateSecurityQuestions from '../Page/updateSecurityQuestions';

import MyProfile from '../UserSettings/myProfile';

import Menu from '../../components/uielements/menu';


const { logout, login } = authAction;
const iconStyle = {
    marginLeft: 10
};
class UserMenu extends Component {
    constructor(props) {
        super(props);
        this.handleVisibleChange = this.handleVisibleChange.bind(this);
        this.handleShowRoleSelectionModal = this.handleShowRoleSelectionModal.bind(this);
        this.handleCancelRoleSelectionModal = this.handleCancelRoleSelectionModal.bind(this);
        this.handleShowProjectRoleSelectionModal = this.handleShowProjectRoleSelectionModal.bind(this);
        this.handleCancelProjectRoleSelectionModal = this.handleCancelProjectRoleSelectionModal.bind(this);
        this.setProjectRole = this.setProjectRole.bind(this);

        this.hide = this.hide.bind(this);

        this.state = {
            showRoleSelectionModal: false,
            showProjectRoleSelectionModal: false,
            visible: false,
            projects: [],
            roles: [],
            userProfile: null,
            token: null,
            myProfileVisible: false,
            resetPasswordVisible: false,
            securityVisible: false,
            CurrentRoleID: JSON.parse(sessionStorage.role).RoleID.toString(),
            assignmentVisible: false,
            helpModal: false
        };

    }


    hide() {
        this.setState({ visible: false });
    }

    handleVisibleChange() {
        this.setState({ visible: !this.state.visible });
    }

    handleShowRoleSelectionModal() {

        if (!this.state.showChangeRoleModal) {
            const thisObj = this;
            CallServerPost("UserAssignment/GetUserRole", { UserID: JSON.parse(sessionStorage.userProfile).userID, ProjectID: JSON.parse(sessionStorage.project).ProjectID })
                .then(function (response) {
                    const responseData = response.value;
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    }
                    else {
                        thisObj.setState({ roles: responseData.roles });
                        thisObj.setState({ showRoleSelectionModal: true, visible: false });

                    }
                }).catch(error => error);
        }
    }

    handleCancelRoleSelectionModal() {
        this.setState({ showRoleSelectionModal: false, });
        this.props.form.resetFields(['RoleID']);
        this.props.reset();
    }
    handleCancelProjectRoleSelectionModal() {
        this.setState({ showProjectRoleSelectionModal: false, });
        this.setState({ CurrentRoleID: JSON.parse(sessionStorage.role).RoleID.toString() });
        this.props.form.resetFields(['RoleID', 'ProjectID']);
        this.props.reset();
    }
    handleShowProjectRoleSelectionModal() {

        if (!this.state.showProjectChangeRoleModal) {
            const thisObj = this;
            CallServerPost("UserAssignment/GetUserProjectRole", { UserID: JSON.parse(sessionStorage.userProfile).userID })
                .then(function (response) {
                    const responseData = response.value;
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    }
                    else {
                        thisObj.setState({ CurrentRoleID: JSON.parse(sessionStorage.role).RoleID.toString(), token: sessionStorage.id_token, projects: response.value.projects, roles: response.value.roles, userProfile: JSON.parse(sessionStorage.userProfile) });
                        thisObj.setState({
                            showProjectRoleSelectionModal: true, visible: false
                        });

                    }
                }).catch(error => error);
        }
    }



    showAssignmentDetails = (e) => {
        this.setState({ assignmentVisible: true, visible: false });
    }

    hideAssignmentDetails = (e) => {
        this.setState({ assignmentVisible: false });
    }

    //my Profile modal visible and close
    showMyProfileDetails = () => {
        this.setState({ myProfileVisible: true });
    }
    hideMyProfileDetails = () => {
        this.setState({ myProfileVisible: false });
    }

    //security questions modal visible and close
    showSecurityQuestions = () => {
        this.setState({ securityVisible: true });
    }

    hideSecurityQuestions = () => {
        this.setState({ securityVisible: false });
    }

    //resetPassword modal visible and close
    showResetPasswordDetails = () => {
        this.setState({ resetPasswordVisible: true });
    }
    hideResetPasswordDetails = () => {
        this.setState({ resetPasswordVisible: false });
    }

    getInitials = (uname) => {
        var str = uname;
        var matches = str.match(/\b(\w)/g);
        return matches.join('').toUpperCase();
    }

    setProjectRole(thisObj) {
        let project = [];
        let tempProject = this.state.projects.filter(role => role.projectID == this.props.form.getFieldValue('ProjectID'));
        project = ({ ProjectID: tempProject[0].projectID, ProjectName: tempProject[0].projectName });

        if (this.props.form.getFieldValue('ProjectID') != JSON.parse(sessionStorage.project).ProjectID) {

            setProjestRoleSubmit(this, project, this.state.roles[this.props.form.getFieldValue('ProjectID')])
        }
        else if (this.props.form.getFieldValue('RoleID') != JSON.parse(sessionStorage.role).RoleID) {
            setProjestRoleSubmit(this, project, this.state.roles[this.props.form.getFieldValue('ProjectID')])
        }
        else {
            this.handleCancelProjectRoleSelectionModal();
        }
    }
    handleCancel = () => {
        this.setState({ helpModal: false });
    }
    handleOk = () => {
        this.setState({ helpModal: false });
    }
    helpFaq = () => {
        this.setState({ helpModal: true })
    }

    render() {
        const { helpModal } = this.state;
        let userProfile = JSON.parse(sessionStorage.getItem("userProfile"));
        //console.log(userProfile)
        const permissions = validJSON(sessionStorage.getItem("permissions"));
        let UserMenuPermission = permissions.UserMenu;
        const projectRole = getProjectRole();
        const content = (
            <TopbarDropdownWrapper style={{ width: '100%', padding: 0, margin: 0, boxShadow: 'unset' }} className="isoUserDropdown">
                <Menu selectedKeys={[this.state.current]} mode="inline" style={{ borderRight: 'unset' }} onClick={this.hide}>
                    {
                        checkPermission(UserMenuPermission, ['MyProfile']) == 4  &&
                        <Menu.Item>
                            <a onClick={this.showMyProfileDetails}>
                                <span onClick={this.hide}>
                                    <i className="fas fa-user-circle" style={{ width: 20, fontSize: 12 }}></i>
                                    <span style={iconStyle}>
                                        <IntlMessages id="topbar.myprofile" />
                                    </span>
                                </span>
                            </a>
                        </Menu.Item>
                    }

                    {
                        checkPermission(UserMenuPermission, ['SecurityQuestion']) == 4   &&

                        <Menu.Item>
                            <a onClick={this.showSecurityQuestions}>
                                <span onClick={this.hide}>
                                    <i className="fas fa-question" style={{ width: 20, fontSize: 12 }}></i>
                                    <span style={iconStyle}>
                                        <IntlMessages id="topbar.securityquestion" />
                                    </span>
                                </span>
                            </a>
                        </Menu.Item>
                    }


                    {
                        checkPermission(UserMenuPermission, ['ChangePassword']) == 4  &&

                        <Menu.Item>
                            <a onClick={this.showResetPasswordDetails}>
                                <span onClick={this.hide}>
                                    <i className="fas fa-key" style={{ width: 20, fontSize: 12 }}></i>
                                    <span style={iconStyle}>
                                        <IntlMessages id="topbar.changepassword" />
                                    </span>
                                </span>
                            </a>
                        </Menu.Item>
                    }

                    {
                        checkPermission(UserMenuPermission, ['AssignmentDetails']) == 4  &&
                        <Menu.Item>
                            <a onClick={this.showAssignmentDetails}>
                                <i className="fas fa-clipboard-list" style={{ width: 20, fontSize: 12 }}></i>
                                <span style={iconStyle}>
                                    <IntlMessages id="topbar.assignmentdetails" />
                                </span>
                            </a>
                        </Menu.Item>
                    }

                    {
                        checkPermission(UserMenuPermission, ['RoleSelection']) == 4  &&

                        <Menu.Item>
                            <a onClick={this.handleShowRoleSelectionModal}>
                                <i className="fas fa-user-friends" style={{ width: 20, fontSize: 12 }}></i>
                                <span style={iconStyle}>
                                    <IntlMessages id="topbar.roleselection" />
                                </span>
                            </a>
                        </Menu.Item>
                    }

                    {
                        checkPermission(UserMenuPermission, ['RoleSelection']) == 4  &&
                        <Menu.Item>
                            <a onClick={this.handleShowProjectRoleSelectionModal}>
                                <i className="fas fa-user-check" style={{ width: 20, fontSize: 12 }}></i>
                                <span style={iconStyle}>
                                    <IntlMessages id="topbar.projectroleselection" />
                                </span>
                            </a>
                        </Menu.Item>

                    }
                    <Menu.Item>
                        <a onClick={() => this.helpFaq()}>
                            <i className="fas fa-question-circle" style={{ width: 20, fontSize: 12 }}></i>
                            <span style={iconStyle}>
                                <IntlMessages id="topbar.help" />
                            </span>
                        </a>
                    </Menu.Item>
                    <Menu.Item>
                        <a onClick={() => fnLogout()} name="Logout" >
                            <i className="fas fa-sign-out-alt" style={{ width: 20, fontSize: 12 }}></i>
                            <span style={iconStyle}>
                                <IntlMessages id="topbar.logout" />
                            </span>
                        </a>
                    </Menu.Item>

                </Menu>
            </TopbarDropdownWrapper>
        );

        const { showRoleSelectionModal, showProjectRoleSelectionModal, projects, roles, assignmentVisible, CurrentRoleID, myProfileVisible } = this.state;
        const { getFieldDecorator, getFieldValue, resetFields } = this.props.form;

        return (
            <div>

                <Modal
                    title="Help"
                    maskClosable={false}
                    style={{ top: '10px' }}
                    visible={helpModal}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="Cancel" name="Cancel" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={this.handleCancel}>
                            Cancel
                        </Button>,
                        <Button name="Save" className='ant-btn sc-ifAKCX fcfmNQ saveBtn' style={{ color: "#ffffff" }} onClick={this.handleOk}>
                            OK
                        </Button>
                    ]}
                >

                    <Result
                        status="403"
                        subTitle="Sorry, this page is under construction." />

                </Modal>

                <Popover
                    content={content}
                    trigger="click"
                    visible={this.state.visible}
                    onVisibleChange={this.handleVisibleChange}
                    arrowPointAtCenter={true}
                    placement="bottomLeft"
                >
                    <div className="isoImgWrapper" id="topBarDisplayName" title={typeof userProfile === "object" ? userProfile.userName : ""}>
                        {typeof userProfile === "object" &&
                            <span className="displayNameSpan" >{this.getInitials(userProfile.firstName + " " + userProfile.lastName)}</span>
                        }
                        <span className="userActivity online" />
                    </div>

                </Popover>
                {
                    showProjectRoleSelectionModal &&
                    <RoleSelect visible={showProjectRoleSelectionModal} okText={"Change"} handleCancel={this.handleCancelProjectRoleSelectionModal} form={this.props.form} projects={projects} roles={roles} getFieldDecorator={getFieldDecorator} getFieldValue={getFieldValue} resetFields={resetFields} setProjectRole={() => this.setProjectRole(this)} setCurrentRoleID={CurrentRoleID} byLoginPage={0} />
                }

                {
                    showRoleSelectionModal &&
                    <ChangeRole history={this.props.history} visible={showRoleSelectionModal} handleCancel={this.handleCancelRoleSelectionModal} roles={roles} userProfile={projectRole.userProfile} project={projectRole.project} resetFields={resetFields} />
                }

                {
                    assignmentVisible &&
                    <AssignmentDetails visible={assignmentVisible} handleCancel={this.hideAssignmentDetails} userId={JSON.parse(sessionStorage.userProfile).userID} />
                }

                {
                    myProfileVisible &&
                    <MyProfile visible={myProfileVisible} history={this.props.history} handleCancel={this.hideMyProfileDetails} userId={JSON.parse(sessionStorage.userProfile).userID} permissions={permissions["MyProfile"]} />
                }
                {
                    this.state.resetPasswordVisible &&
                    <ResetPassword visible={this.state.resetPasswordVisible} handleCancel={this.hideResetPasswordDetails} userId={JSON.parse(sessionStorage.userProfile).userID} permissions={permissions["ChangePassword"]} />
                }
                {
                    this.state.securityVisible &&
                    <UpdateSecurityQuestions visible={this.state.securityVisible} handleCancel={this.hideSecurityQuestions} />
                }


            </div>


        );
    }
}

const WrappedApp = Form.create()(UserMenu);
export default connect(
    state => ({
        isLoggedIn: state.Auth.get('idToken') !== null ? true : false,
    }),
    { login, logout }
)(WrappedApp);
