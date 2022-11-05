import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from '../../components/uielements/button';
import authAction from '../../redux/auth/actions';
import IntlMessages from '../../components/utility/intlMessages';
import SignInStyleWrapper from './signin.style';
import { Form, message, Input, Icon, Spin } from 'antd';
import { UserLogin, CallServerPost, errorModal, PASS_KEY_UI, encryptSensitiveData, showProgress, hideProgress } from '../../containers/Utility/sharedUtility';
import { checkExistOrNot } from '../../containers/Utility/validator';
import RoleSelect from '../Dashboard/roleSelect';
import SecurityQuestions from './securityQuestions';
import TransBotLogo from '../../image/TransBot-logos_transparent.png';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

const { login } = authAction;
var thisObj = {};
class SignIn extends Component
{
    constructor(props) {
        super(props);


        this.state = {
            redirectToReferrer: false,
            loading: false,
            showRoleSelection: false,
            showSecurityQuestions: false,
            projects: [],
            roles: [],
            userProfile: null,
            token: null,
            action: "signin",
            onPassword: false,
            showForgot: false
        };
        thisObj = this;
      
    }

    static getDerivedStateFromProps(nextProps) {

        if (thisObj.props.isLoggedIn === true) {
            thisObj.setState({ redirectToReferrer: true });
        }
    }
    onProjectChange = (e) => {
        this.props.form.resetFields(['RoleID']);
    }
    hideSecurityModal = () => {
        this.setState({action:"signin", showSecurityQuestions: false, showRoleSelection: false });
    }
    handleCancelProjectRoleModal() {
        this.setState({ action: "signin",showRoleSelection: false, showSecurityQuestions: false });
    }
    setProjectRole = () => {
        const thisObj = this;
        const { login } = this.props;
        const { projects } = this.state;
        this.props.form.validateFields(['ProjectID', 'RoleID'], { force: true }, (err, values) => {
            if (!err) {
                CallServerPost("Permission/GetPermissionLevelsForRole", { RoleID: parseInt(values.RoleID) })
                    .then(function (response) {
                        let selectedProject = projects.filter((project) => project.projectID == values.ProjectID);
                        const roles = thisObj.state.roles[values.ProjectID];
                        let selectedRole = roles.filter((role) => role.roleID == values.RoleID);

                        sessionStorage.setItem("project", JSON.stringify({ ProjectID: selectedProject[0].projectID, ProjectName: selectedProject[0].projectName }));
                        sessionStorage.setItem("role", JSON.stringify({ RoleID: selectedRole[0].roleID, RoleName: selectedRole[0].roleName }));
                        sessionStorage.setItem("userProfile", JSON.stringify(thisObj.state.userProfile));
                        window.userParam = thisObj.state.userProfile;
                        if (response.status === 1) {
                            login({ success: true, idToken: thisObj.state.token, profile: thisObj.state.userProfile, permissions: response.value.permissions });
                        } else {
                            login({ success: true, idToken: thisObj.state.token, profile: thisObj.state.userProfile, permissions: [] });
                        }
                        thisObj.props.history.push('/trans');
                    })
            }
        });
    }

    setAdminRole = (roleID) => {
        const { login } = this.props;
        const thisObj = this;
        //CallServerPost("Permission/GetMasterAdminPermissions", {})
        //    .then(function (response) {

        //        if (response.status === 1) {
        //            login({ success: true, idToken: thisObj.state.token, profile: thisObj.state.userProfile, permissions: response.value });
        //        } else {
        //            login({ success: true, idToken: thisObj.state.token, profile: thisObj.state.userProfile, permissions: [] });
        //        }

        //        thisObj.props.history.push('/trans');
        //    });
        showProgress();
        CallServerPost("Permission/GetPermissionLevelsForRole", { RoleID: roleID })
            .then(function (response) {
                if (response.status === 1) {
                    login({ success: true, idToken: thisObj.state.token, profile: thisObj.state.userProfile, permissions: response.value.permissions });
                } else {
                    login({ success: true, idToken: thisObj.state.token, profile: thisObj.state.userProfile, permissions: [] });
                }
                hideProgress();
                thisObj.props.history.push('/trans');
            });
    
    }


    getProjectRoles = (userProfile, token) => {
        const thisObj = this;
        showProgress();
        CallServerPost("UserAssignment/GetUserProjectRole", { UserID: userProfile.userID })
            .then(function (response) {
                hideProgress();
                if (response.status === 1) {

                    thisObj.setState({ token: token, action: "roles", showRoleSelection: true, loading: false, projects: response.value.projects, roles: response.value.roles, userProfile: userProfile });
                } else {
                    thisObj.setState({ loading: false });
                    login({ success: false });
                    errorModal(response.message);
                }
            });
    }

    getSecurityQuestion = (userProfile, token) => {
        const thisObj = this;
        //CallServerPost("UserAssignment/GetUserProjectRole", { UserID: userProfile.userID })
        //    .then(function (response) {
        //        if (response.status == 1) {
        //console.log(response);
        thisObj.setState({ action: "security",showSecurityQuestions: true, userProfile: userProfile, loading: false });
        //    } else {
        //        thisObj.setState({ loading: false });
        //        login({ success: false });
        //        message.error(response.message);
        //    }
        //})
    }

    handleLogin = () => {
        const { login } = this.props;
        const thisObj = this;
        showProgress();
        this.props.form.validateFields(['UserName', 'UserPassword'], { force: true }, (err, values) => {
            if (!err) {
                var signInDetails = {};
                signInDetails["UserName"] = values['UserName'].replace(" ", "~``"); //Replacing Space to prevent "sql server not considering space in username or password"
                signInDetails["UserPassword"] = encryptSensitiveData(values['UserPassword'].replace(" ", "~``"), PASS_KEY_UI);
                UserLogin(signInDetails)
                    .then(function (response) {
                        //console.log(response);
                        //console.log(response.message);
                        if (response.status === 1) {

                            if (response.value.userProfile.userStatusText == "Active") {

                                sessionStorage.setItem("timeout", response.value.timeout); //Should be fetched from server while login

                                var token = 'Bearer ' + response.value.token;

                                sessionStorage.setItem("authorizeToken", token);
                                sessionStorage.setItem("websocketIP", response.value.websocketIP);


                                if (response.value.userProfile.adminType == 127)
                                {
                                    if (response.value.IsSecurityQuestionAdded) {
                                        sessionStorage.setItem("role", JSON.stringify({ RoleID: 2, RoleName: "System Admin" }));
                                        sessionStorage.setItem("userProfile", JSON.stringify(response.value.userProfile));
                                        window.userParam = response.value.userProfile;

                                        thisObj.setState({ token: token, userProfile: response.value.userProfile });
                                        thisObj.setAdminRole(2);
                                    }
                                    else {
                                        thisObj.getSecurityQuestion(response.value.userProfile, response.value.token);
                                    }
                                    // System administrator
                                    
                                }
                                else if (response.value.userProfile.adminType == 126)
                                {
                                    // Super administrator                                    
                                    sessionStorage.setItem("role", JSON.stringify({ RoleID: 1, RoleName: "Super Admin" }));
                                    sessionStorage.setItem("userProfile", JSON.stringify(response.value.userProfile));
                                    window.userParam = response.value.userProfile;
                                    thisObj.setState({ token: token, userProfile: response.value.userProfile });
                                    thisObj.setAdminRole(1);
                                    
                                }
                                else
                                {
                                    if (response.value.IsSecurityQuestionAdded) {
                                        thisObj.getProjectRoles(response.value.userProfile, response.value.token);
                                    }
                                    else {
                                        thisObj.getSecurityQuestion(response.value.userProfile, response.value.token);
                                    }
                                }  
                            } else {
                                login({ success: false });
                                errorModal('User is Inactive');
                            }

                            hideProgress();
                        } else {
                            hideProgress();
                            login({ success: false });
                            message.destroy();
                            errorModal(response.message);
                        }
                    }).catch(error => {
                        hideProgress();
                        login({ success: false });
                        message.destroy();
                        errorModal("Unable to login. Please Try Later!");
                    });


            } {
                hideProgress();
            }
        });

    };


    handleForgotPassword = () => {
        const thisObj = this;
        this.props.form.validateFields(['UserName'], { force: true }, (err, values) => {
            if (!err) {
                                
                CallServerPost('PasswordSecurityQuestions/GetUserByUserName', { UserName: values["UserName"] })
                    .then(function (response) {
                        if (response.status == 1) {
                        if (response.value != null) {
                            if (response.value.users[0].userStatusText == "Active") {
                                thisObj.props.history.push({
                                    pathname: '/forgotPassword',
                                    state: {
                                        userName: values["UserName"],
                                        loading: true,

                                    }
                                });
                            } else {
                                thisObj.setState({ loading: false });
                                login({ success: false });
                                errorModal('User is Inactive');
                            }


                        } else {

                            thisObj.setState({ loading: false });
                            login({ success: false });
                            errorModal('Username is invalid');
                        }
                    }
                        else {
                            errorModal(response.message)
                    }

                    });
               

            }
        });
    }

    //By clicking Enter to Login

    keyPressed = (event) => {
        if (event.key === "Enter") {
            this.handleLogin();
        }
    }

    handleKeyDown = e => {
        if (e.key === " ") {
            e.preventDefault();
        }
    }

    handlerCopy = (e) => {
        e.preventDefault();
    }

    userPassword = () =>
        this.setState(prevState => ({
            onPassword: !prevState.onPassword,
        }));

    changeShowForgot = (res) => {
        if (res !== this.state.showForgot) {
            this.setState({ showForgot: res });
        }
    }

    render() {
        const from = { pathname: '/trans' };
        const { redirectToReferrer, onPassword } = this.state;

        if (redirectToReferrer) {
            return <Redirect to={from} />;
        }
        const { getFieldDecorator, getFieldValue, resetFields } = this.props.form;
        const { action,showRoleSelection, projects, roles, showSecurityQuestions } = this.state;
        return (

            <Form>
                <SignInStyleWrapper className="isoSignInPage">

                    <div className="isoLoginContentWrapper">
                        <div className="isoLoginContent">
                            <Spin indicator={antIcon} spinning={this.state.loading}>
                                <div className="isoLogoWrapper">
                                    <Link to="/trans">
                                        <img style={{width:"300px"} } src={require("../../image/TransBot-logos_transparent.png")} />
                                    </Link>
                                </div>
                                <div className="isoSignInForm">


                                    <FormItem
                                        key={"UserName"}
                                    >
                                        {
                                            getFieldDecorator("UserName", {
                                                rules: [{ required: true, message: "Username is required" }, { validator: checkExistOrNot, current: this }]
                                            })(
                                                <Input size="large" placeholder="Username" />

                                                )}
                                    </FormItem>

                                    <FormItem
                                        key={"UserPassword"}
                                    >
                                        {
                                            getFieldDecorator("UserPassword", {
                                                rules: [{ required: true, message: "Password is required" }]
                                            })(
                                                <Input
                                                    onKeyPress={this.keyPressed}
                                                    type="text" style={{ "-webkit-text-security": "disc" }}
                                                    autoComplete="off"
                                                    onCopy={this.handlerCopy}
                                                    onPaste={(e) => {
                                                        e.preventDefault()
                                                        return false;
                                                    }}
                                                    onKeyDown={this.handleKeyDown}
                                                maxlength="15"
                                                    size="large"
                                                placeholder="Password" />
                                                )}
                                    </FormItem>
                                    



                                     <div className="isoInputWrapper isoLeftRightComponent">

                                        <Button name="SignIn" type="primary" onClick={this.handleLogin}>
                                            <IntlMessages id="page.signInButton" />
                                        </Button>
                                        {this.state.showForgot &&
                                            <a name="ForgotPassword" onClick={this.handleForgotPassword} >
                                                <IntlMessages id="page.signInForgotPass" />
                                            </a>
                                        }
                                    </div>

                                </div>


                            </Spin>
                        </div>
                    </div>
                </SignInStyleWrapper>
                {
                (action == "roles")?
                        <RoleSelect visible={showRoleSelection} okText={"OK"} handleCancel={this.hideSecurityModal} form={this.props.form} projects={projects} roles={roles} getFieldDecorator={getFieldDecorator} getFieldValue={getFieldValue} resetFields={resetFields} setProjectRole={this.setProjectRole} byLoginPage={1} />:
                (action == "security")?
                    <SecurityQuestions visible={showSecurityQuestions} handleCancel={this.hideSecurityModal} cancelCallback={this.hideSecurityModal} getFieldDecorator={getFieldDecorator} getFieldValue={getFieldValue} resetFields={resetFields} userProfile={this.state.userProfile} />:""
                }
                      
               
                
            </Form>
        );
    }
}



const WrappedApp = Form.create()(SignIn);
export default connect(
    state => ({
        isLoggedIn: state.Auth.get('idToken') !== null ? true : false,
    }),
    { login }
)(WrappedApp);
