import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/uielements/button';
import IntlMessages from '../../components/utility/intlMessages';
import ForgotPasswordStyleWrapper from './forgotPassword.style';
import Select, { SelectOption } from '../../components/uielements/select';
import { Form, message } from 'antd';
import { checkSelect } from '../Utility/validator';
import { Modal, Spin, Col, Row, Icon, Progress, Input } from 'antd';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import { CallServerPost, errorModal, successModal, PASS_KEY_UI, encryptSensitiveData, SEC_ANS_UI, showProgress, hideProgress } from '../Utility/sharedUtility';
import { checkPassword, dynamicValidation } from '../Utility/validator';
import { errorMessageTooltip } from '../Utility/errorMessageUtility.js';

const FormItem = Form.Item;

const Option = SelectOption;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
var thisObj;
let validateStatus = "";

class ForgotPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            passwordSecurityQuestionList: {},
            userAnswers: [],
            userID: 0,
            loading: true,
            username: null,
            showPassword: false,
            confirmPassword: false,
            password: '',
            value: ""

        }
        validateStatus = "";
        thisObj = this;
        const currentObj = this;
        const username = this.props.location.state.userName;
        showProgress();
        if (username != null) {
            CallServerPost('PasswordSecurityQuestions/GetAllData', { UserName: username })
                .then(function (response) {
                    if (response.value != null) {
                        const value = response.value;
                        let selectedQuestions = {}


                        currentObj.setState({
                            passwordSecurityQuestionList: value.passwordSecurityQuestionList,
                            userAnswers: value.PasswordSecurityAnswersList, userID: value.users[0].userID
                        }, () => {
                            hideProgress();
                        });

                    } else {
                        hideProgress();
                    }

                })


        } else {
            this.props.history.push({
                pathname: '/signin'
            });
        }
    }
    handleCancelForgotPassword = () => {
        this.props.history.push({
            pathname: '/signin'
        });
    }

    getOptions = (otherValue1, otherValue2) => {
        const { userAnswers } = this.state;
        let ops = [];
        if (userAnswers !== null) {
            userAnswers.map(function (qstn) {
                if (qstn.passwordSecurityQuestionID != otherValue1 && qstn.passwordSecurityQuestionID != otherValue2) {
                    ops.push(<Option key={qstn.passwordSecurityQuestionID} value={qstn.passwordSecurityQuestionID}>{qstn.questionText}</Option>);
                }
            });
        }

        return ops;
    }

    handleForgotPassword = (e) => {
        
        e.preventDefault();
        const thisObj = this;
        const { userID } = this.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                showProgress();
                var array = [];
                array[0] = { Question: values["Question1"], Answer: encryptSensitiveData(values["Answer1"], SEC_ANS_UI), TimeZone: "IST", UserID: userID, UpdatedBy: userID }
                array[1] = { Question: values["Question2"], Answer: encryptSensitiveData(values["Answer2"], SEC_ANS_UI), TimeZone: "IST", UserID: userID, UpdatedBy: userID }
                array[2] = { Question: values["Question3"], Answer: encryptSensitiveData(values["Answer3"], SEC_ANS_UI), TimeZone: "IST", UserID: userID, UpdatedBy: userID }

                values["PasswordQuestionAnswer"] = array;

                values["TimeZone"] = "IST";
                values["UserID"] = userID;
                values["UserPassword"] = encryptSensitiveData(values["NewPassword"], PASS_KEY_UI);//values["NewPassword"];
                values["ChangeReason"] = "Manually updated by the user";
                values["UpdatedBy"] = userID;
                CallServerPost('PasswordSecurityQuestions/UpdateForgotPassword', values).then(
                    function (response) {
                        if (response.status == 1) {
                            successModal(response.message, thisObj.props, "/signin");
                        } else {
                            errorModal(response.message);
                        }
                        hideProgress();
                    }
                ).catch(error => error);
            }
        });
    }




    checkNewPassword = (rule, value, callback) => {
        if (value && value == this.props.form.getFieldValue('Current Password')) {
            callback('New Password should not be same as Current Password');
        } else {
            var regex = /(?=.{8,16})((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$ %^&*()_+ {} | ":?><,.\/;'\=`-])).*/;
            if (value && !regex.test(value)) {
                callback('Enter valid password');

            } else {
                callback();
            }

        }
    }
    checkConfirmPassword = (rule, value, callback) => {
        if (value && value !== this.props.form.getFieldValue('New Password')) {
            callback('Confirm Password should be same as New Password');
        } else {
            callback();
        }
    }

    //when save password validation
    checkPassword = (rule, value, callback) => {
        let password = value
        if (password) {
            let score = 0;



            let regexPositive = [
                "[A-Z]",
                "[a-z]",
                "[0-9]",
                "[$@$!%*#?&\S]",
            ]

            regexPositive.forEach((regex, index) => {
                if (new RegExp(regex).test(password)) {
                    score += 1
                }

            })
            score = (score >= 3) ? (password.length >= 8 && password.length <= 15) ? 3 : 0 : score;

            validateStatus = "";
            switch (score) {

                case 0:
                case 1:
                case 2:
                    {
                        validateStatus = "error";
                        callback("Enter valid password");
                        return;
                    }
                default:
                    callback();

                    return;
            }
        }
        validateStatus = "error";
        callback('');
        return;
    }

    onTogglePassword = () =>
        this.setState(prevState => ({
            showPassword: !prevState.showPassword,
        }));

    onConfirmPassword = () =>
        this.setState(prevState => ({
            confirmPassword: !prevState.confirmPassword,
        }));

    //For FogotPassword
    QuestionAnswer = () => {
        showProgress();
        CallServerPost('PasswordSecurityQuestions/GetPasswordSecurityAnswersByUserID', { userID: thisObj.state.userID })
            .then(function (response) {
                if (response.value !== null) {
                    thisObj.props.form.resetFields(["Question1", "Question2", "Question3"]);
                    let answer = response.value;
                    answer.map((x, y) => {
                        let Question = "Question" + (y + 1);
                        //let Answer = "Answer" + (y + 1);
                        let data = {};
                        data[Question] = x.passwordSecurityQuestionID;

                        thisObj.props.form.setFieldsValue(data);
                    });
                    hideProgress();
                } else {
                    thisObj.props.form.resetFields(["Question1", "Question2", "Question3", "Answer1", "Answer2", "Answer3"]);
                    hideProgress();
                }
            });
    }

    getValueFromForm = (getFieldsValue, key) => {
        return getFieldsValue([key])[key] !== undefined
            ? getFieldsValue([key])[key]
            : "";
    }

    handleKeyDown = e => {
        if (e.key === " ") {
            e.preventDefault();
        }
    }

    getValueFromForm = (getFieldsValue, key) => {
        return getFieldsValue([key])[key] !== undefined
            ? getFieldsValue([key])[key]
            : "";
    }


    handlerCopy = (e) => {
        e.preventDefault();
    }


    splCharacter(e) {
        const re = /[0-9A-Za-z!,@,#,$,%,^,&,*,(,)]+/g;
        if (!re.test(e.key)) {
            e.preventDefault();
        }
    }

    componentDidUpdate() {
        errorMessageTooltip(this.props);
    }

    render() {

        const userName = this.props.location.state.userName;
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const { userAnswers, showPassword, confirmPassword, passwordStrength, password } = this.state;
        const hasAnswers = (userAnswers != null) ? (Object.keys(userAnswers).length > 0) : false;
        const val1 = this.getValueFromForm(getFieldsValue, "Question1");
        const val2 = this.getValueFromForm(getFieldsValue, "Question2");
        const val3 = this.getValueFromForm(getFieldsValue, "Question3");

        const options1 = this.getOptions(val2, val3);
        const options2 = this.getOptions(val1, val3);
        const options3 = this.getOptions(val1, val2);

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        //var passwordSecurityQuestions = hasAnswers ? (passwordSecurityQuestionList.map(function (option) {
        //    return (
        //        <Option key={option.passwordSecurityQuestionID}>
        //            {option.questionText}
        //        </Option>
        //    )
        //})) : null;
        let newPassword = this.getValueFromForm(getFieldsValue, "NewPassword");


        return (
            <div style={{ backgroundColor: '#fff', textAlign: '-webkit-center', paddingBottom: 20 }}>
                <div style={{ padding: 20 }}>

                    <div className="isoFormHeadText" >
                        <h3>
                            <IntlMessages id="page.signInForgotPass" />
                        </h3>
                    </div>

                    <div className="isoResetPassForm" style={{ paddingTop: 10 }}>

                        <Button type="primary" id="LoadQuestion" onClick={() => this.QuestionAnswer()} >Load Questions</Button>

                        <Form layout="vertical">

                            <Row style={rowStyle} >
                                <Col md={10} sm={12} xs={12} >
                                    <FormItem
                                        label={"User Name"}
                                    >
                                        {getFieldDecorator('UserName', {
                                            rules: [{ required: true, message: "UserName is mandatory" },
                                            { update: false, validator: this.checkExistOrNot }],
                                            initialValue: userName
                                        })(<Input style={{ color: '#aaa !important;' }} disabled />)}
                                    </FormItem>
                                </Col>
                                <Col md={2}>
                                </Col>
                                <Col >
                                </Col>
                            </Row>


                            <Row style={rowStyle} >
                                <Col md={10} sm={12} xs={12} >
                                    <FormItem
                                        label="Security Question1"
                                    >{
                                            getFieldDecorator("Question1", {
                                                rules: [{
                                                    required: true,
                                                    message: "Security Question1 should be selected"
                                                }],

                                                initialValue: (userAnswers & 7 & typeof userAnswers === "object") ? userAnswers[0].passwordSecurityQuestionID : null
                                            })(
                                                <Select
                                                    showSearch
                                                    style={{ width: '100%' }}
                                                    onChange={this.props.onProjectChange}
                                                    disabled={(hasAnswers)}
                                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                >
                                                    <option value={null}>--Select--</option>
                                                    {options1}
                                                </Select>

                                            )}
                                    </FormItem>

                                    <FormItem
                                        key={"Answer1"}
                                        label={"Answer1"}
                                    >
                                        {
                                            getFieldDecorator("Answer1", {
                                                rules: [{
                                                    required: true, message: "Answer1 is mandatory"
                                                },
                                                { min: 2, message: 'Answer1 should be between 2-255 characters.' },
                                                { max: 255, message: 'Answer1 should be between 2-255 characters.' },
                                                {
                                                    validator: dynamicValidation, message: "Answer1 should contain only alphanumeric and special characters(-_;,(). )", regExPattern: "/^(?!.*  )[ a-zA-Z0-9-_;,()\.]+$/"
                                                }
                                                ]

                                            })(
                                                <Input style={{ "-webkit-text-security": "disc" }} size="large" placeholder="Answer1" autoComplete="off" />

                                            )}
                                    </FormItem>
                                    <FormItem
                                        label="Security Question2"
                                    >{
                                            getFieldDecorator("Question2", {
                                                rules: [{
                                                    required: true,
                                                    message: "Security Question2 should be selected"
                                                }],
                                                initialValue: (userAnswers & 7 & typeof userAnswers === "object") ? userAnswers[0].passwordSecurityQuestionID : null
                                            })(
                                                <Select
                                                    showSearch
                                                    style={{ width: '100%' }}
                                                    onChange={this.props.onProjectChange}
                                                    disabled={hasAnswers}
                                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                >
                                                    <option value={null}>--Select--</option>
                                                    {options2}
                                                </Select>

                                            )}
                                    </FormItem>
                                    <FormItem
                                        key={"Answer2"}
                                        label={"Answer2"}
                                    >
                                        {
                                            getFieldDecorator("Answer2", {
                                                rules: [{ required: true, message: "Answer2 is mandatory" },
                                                { min: 2, message: 'Answer2 should be between 2-255 characters.' },
                                                { max: 255, message: 'Answer2 should be between 2-255 characters.' },
                                                {
                                                    validator: dynamicValidation, message: "Answer2 should contain only alphanumeric and special characters(-_;,(). )", regExPattern: "/^(?!.*  )[ a-zA-Z0-9-_;,()\.]+$/"
                                                }
                                                ]
                                            })(
                                                <Input style={{ "-webkit-text-security": "disc" }} size="large" placeholder="Answer2" autoComplete="off" />

                                            )}
                                    </FormItem>
                                    <FormItem
                                        label=" Security Question3"
                                    >{
                                            getFieldDecorator("Question3", {
                                                rules: [{
                                                    required: true,
                                                    message: "Security Question3 should be selected"
                                                }],
                                                initialValue: (userAnswers & 7 & typeof userAnswers === "object") ? userAnswers[0].passwordSecurityQuestionID : null
                                            })(
                                                <Select
                                                    showSearch
                                                    style={{ width: '100%' }}
                                                    disabled={hasAnswers}
                                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                >
                                                    <option value={null}>--Select--</option>
                                                    {options3}
                                                </Select>

                                            )}
                                    </FormItem>
                                    <FormItem
                                        key={"Answer3"}
                                        label={"Answer3"}
                                    >
                                        {
                                            getFieldDecorator("Answer3", {
                                                rules: [{ required: true, message: "Answer3 is mandatory" },
                                                { min: 2, message: 'Answer3 should be between 2-255 characters.' },
                                                { max: 255, message: 'Answer3 should be between 2-255 characters.' },
                                                {
                                                    validator: dynamicValidation, message: "Answer3 should contain only alphanumeric and special characters(-_;,(). )", regExPattern: "/^(?!.*  )[ a-zA-Z0-9-_;,()\.]+$/"
                                                }
                                                ]
                                            })(
                                                <Input style={{ "-webkit-text-security": "disc" }} size="large" placeholder="Answer3" autoComplete="off" />

                                            )}
                                    </FormItem>


                                </Col>
                                <Col md={2}>
                                </Col>

                                <Col md={10} sm={12} xs={12} style={{ marginTop: "-60px" }} >

                                    <FormItem
                                        key={"New Password"}
                                        validateStatus={validateStatus}
                                        label={"New Password"}
                                        {...validateStatus ? { validateStatus: validateStatus } : {}}

                                    >
                                        <Form>
                                            {
                                                getFieldDecorator("NewPassword",
                                                    {
                                                        rules:
                                                            [
                                                                {
                                                                    validator: this.checkPassword,
                                                                },
                                                                { required: true, message: "New Password is mandatory" }
                                                            ]
                                                    })(
                                                        <Input size="large"
                                                            onCopy={this.handlerCopy}
                                                            autoComplete="off"
                                                            onKeyPress={(e) => this.splCharacter(e)}
                                                            onPaste={(e) => {
                                                                e.preventDefault()
                                                                return false;
                                                            }} onKeyDown={this.handleKeyDown}
                                                            maxlength="15" type="text"
                                                            style={{ "-webkit-text-security": "disc" }}
                                                            placeholder="New Password"
                                                            onKeyUp={(e) => this.props.form.resetFields(["ConfirmPassword"])} />
                                                    )}
                                        </Form>
                                    </FormItem>
                                    <FormItem
                                        key={"Confirm Password"}
                                        label={"Confirm Password"}
                                    >
                                        <Form>
                                            {
                                                getFieldDecorator("ConfirmPassword", {
                                                    rules: [{ required: true, message: "Confirm Password is mandatory" },
                                                    {
                                                        validator: checkPassword, message: "Password is not the same", props: this,
                                                        regExPattern: "/^(?=.{7,})((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*\\d)(?=.*[a-zA-Z])(?=.*[\\W_])|(?=.*[a-z])(?=.*[A-Z])(?=.*[a-z]))(?!.*[\\s]).*/",
                                                    }
                                                    ]

                                                })(

                                                    <Input onPaste={(e) => {
                                                        e.preventDefault()
                                                        return false;
                                                    }}
                                                        autoComplete="off"
                                                        onCopy={this.handlerCopy}
                                                        onKeyPress={(e) => this.splCharacter(e)}
                                                        onKeyDown={this.handleKeyDown} size="large"
                                                        maxlength="15" type="text"
                                                        style={{ "-webkit-text-security": "disc" }}
                                                        placeholder="Confirm Password" />

                                                )}
                                        </Form>
                                    </FormItem>
                                    <div style={{ textAlign: 'justify', paddingLeft: 10 }}>
                                        <h2>Password Policy</h2>

                                        <ul
                                            className="PasswordRules"
                                            style={{ marginLeft: 15 }}
                                        >
                                            {/*<li*/}
                                            {/*    className="forgotlimargin"*/}
                                            {/*    style={{ textAlign: "left", marginBottom: "10px" }}*/}
                                            {/*>*/}
                                            {/*    <i*/}
                                            {/*        style={{*/}
                                            {/*            color: newPassword.length >= "8" ? "green" : "red",*/}
                                            {/*            fontSize: "10px"*/}
                                            {/*        }}*/}
                                            {/*        className="fa fa-check-circle" aria-hidden="true">*/}
                                            {/*    </i>*/}
                                            {/*        Should be atleast EIGHT characters in length*/}
                                            {/*   </li>*/}
                                            <li
                                                className="forgotlimargin"
                                                style={{ textAlign: "left", marginBottom: "10px" }}
                                            >
                                                <i
                                                    style={{
                                                        color: (newPassword.length >= 8 && newPassword.length <= 15) ? "green" : "red",
                                                        fontSize: "10px"
                                                    }}
                                                    className="fa fa-check-circle" aria-hidden="true">
                                                </i>
                                                <span>Password should be between 8-15 characters.</span>
                                            </li>

                                            {/*<li*/}
                                            {/*    classNameName="forgotlimargin"*/}
                                            {/*    style={{ textAlign: "left", marginBottom: "10px" }}*/}
                                            {/*>*/}
                                            {/*    <i*/}
                                            {/*        style={{*/}
                                            {/*            color: newPassword.match(/^\S*$/) ? "green" : "red",*/}
                                            {/*            fontSize: "10px"*/}
                                            {/*        }}*/}
                                            {/*        className="fa fa-check-circle"*/}
                                            {/*        aria-hidden="true">*/}
                                            {/*    </i>*/}
                                            {/*        Space is not allowed*/}
                                            {/*    </li>*/}


                                            <li
                                                className="forgotlimargin"
                                                style={{ textAlign: "left", marginBottom: "10px" }}
                                            >
                                                Should contain characters from  three of the following four catagories:
                                                <ul
                                                    className="PasswordRules"
                                                    style={{ marginTop: "10px" }}
                                                >

                                                    <li className="forgotlimargin"
                                                        style={{ textAlign: "left", marginBottom: "10px", marginLeft: 20 }}
                                                    >
                                                        <i
                                                            style={{
                                                                color: newPassword.match(/[A-Z]/) ? "green" : "red",
                                                                fontSize: "10px"
                                                            }}
                                                            className="fa fa-check-circle" aria-hidden="true"
                                                        >
                                                        </i>
                                                        <span>Must have at least one upper case character [A-Z]</span>
                                                    </li>
                                                    <li className="forgotlimargin"
                                                        style={{ textAlign: "left", marginBottom: "10px", marginLeft: 20 }}
                                                    >
                                                        <i
                                                            style={{
                                                                color: newPassword.match(/[a-z]/) ? "green" : "red",
                                                                fontSize: "10px"
                                                            }}
                                                            className="fa fa-check-circle"
                                                            aria-hidden="true">
                                                        </i>
                                                        <span>Must have at least one lower case character [a-z]</span>
                                                    </li>
                                                    <li
                                                        className="forgotlimargin"
                                                        style={{ textAlign: "left", marginBottom: "10px", marginLeft: 20 }}
                                                    >
                                                        <i
                                                            style={{
                                                                color: newPassword.match(/[0-9]/) ? "green" : "red",
                                                                fontSize: "10px"
                                                            }}
                                                            className="fa fa-check-circle"
                                                            aria-hidden="true"
                                                        >
                                                        </i>
                                                        <span>Must have at least one numeric digit [0-9]</span>
                                                    </li>
                                                    <li
                                                        className="forgotlimargin"
                                                        style={{ textAlign: "left", marginBottom: "10px", marginLeft: 20 }}
                                                    >
                                                        <i
                                                            style={{
                                                                color: newPassword.match(/[`~!@#$%\^&*()+=|;:'",.<>{}[\]_\/?\\\-]/) ? "green" : "red",
                                                                fontSize: "10px"
                                                            }}
                                                            className="fa fa-check-circle"
                                                            aria-hidden="true"
                                                        >
                                                        </i>
                                                        <span>Must have at least one special character. Allowed special characters are [!,@,#,$,%,^,&,*,(,)]</span>                                                       </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                    <Button type="danger" style={{ float: "right", marginRight: "62px" }} htmlType="cancel" onClick={this.handleCancelForgotPassword}>Cancel</Button>

                                    <Button type="primary" htmlType="submit" style={{ float: "right", marginRight: "20px" }} onClick={this.handleForgotPassword}>Change Password</Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Form.create()(ForgotPassword);
