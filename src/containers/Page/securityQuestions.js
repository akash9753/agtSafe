import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/uielements/button';
import IntlMessages from '../../components/utility/intlMessages';
import ForgotPasswordStyleWrapper from './securityQuestions.style';
import Select, { SelectOption } from '../../components/uielements/select';
import { Form, message } from 'antd';
import { checkSelect } from '../Utility/validator';
import { Modal, Spin, Col, Input, Row, Icon } from 'antd';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import { CallServerPost, showProgress, hideProgress, errorModal, resetPasswordSuccessModal, getSaveButtonText, PASS_KEY_UI, SEC_ANS_UI, encryptSensitiveData } from '../Utility/sharedUtility';
import SingleForm from '../Utility/SingleForm';
import { checkPassword, dynamicValidation } from '../Utility/validator';
import { errorMessageTooltip } from '../Utility/errorMessageUtility.js';

const FormItem = Form.Item;
const Option = SelectOption;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var currentObj;
var userID;
var thisObj = {};
var DropList = "";
let validateStatus = "";
class SecurityQuestions extends Component {

    constructor(props) {
        super(props);
        this.handleForgotPassword = this.handleForgotPassword.bind(this);
        this.state = {
            passwordSecurityQuestionList: {},
            loading: false,
            disableBtn: false,
            //current page field list
            responseData: {
                formData: {},
                selectOptions: {}

            },
            questions: null,
            showPassword: false,
            confirmPassword: false,
            password: '',
        }
        thisObj = this;
        this.getQuestionDDL(this.props)
        validateStatus = "";
    }

    getQuestionDDL = (nextProps) =>
    {
        if (nextProps.visible)
        {
                showProgress();
                CallServerPost('PasswordSecurityQuestions/GetAllActivePasswordSecurityQuestions', {})
                    .then(function (response)
                    {
                        hideProgress();
                        if (response.value != null)
                        {
                           
                            thisObj.setState({ questions: response.value });
                        }
                    })
            }
        }
    

    FormList = (value) =>
    {
        let temp = { options1: [], options2: [], options3: [] };

        value.forEach(function (key, index)
        {
            temp.options1.push({ attributeName: "", keyValue: key.passwordSecurityQuestionID, literal: key.questionText });
            temp.options2.push({ attributeName: "", keyValue: key.passwordSecurityQuestionID, literal: key.questionText });
            temp.options3.push({ attributeName: "", keyValue: key.passwordSecurityQuestionID, literal: key.questionText });
        });
        return temp;
    }

    

    handleForgotPassword(e)
    {
        e.preventDefault();
        const thisObj = this;
        thisObj.props.form.validateFields((err, values) =>
        {
            if (!err) 
            {
                thisObj.setState({ disableBtn: true, loading: true });
                userID = this.props.userProfile.userID
                var array = [];
                array[0] = { Question: values["Question1"], Answer: encryptSensitiveData(values["Answer1"], SEC_ANS_UI), TimeZone: "IST", UserID: userID, UpdatedBy: userID }
                array[1] = { Question: values["Question2"], Answer: encryptSensitiveData(values["Answer2"], SEC_ANS_UI), TimeZone: "IST", UserID: userID, UpdatedBy: userID }
                array[2] = { Question: values["Question3"], Answer: encryptSensitiveData(values["Answer3"], SEC_ANS_UI), TimeZone: "IST", UserID: userID, UpdatedBy: userID }
                              
                values["PasswordQuestionAnswer"] = array;                                
                values["TimeZone"] = "IST";
                values["UserID"] = userID;
                values["UserPassword"] = encryptSensitiveData(values["NewPassword"], PASS_KEY_UI);
                values["ChangeReason"] = "Manually updated by the user";
                values["UpdatedBy"] = userID;

                showProgress();
                CallServerPost('PasswordSecurityQuestions/CreatePasswordSecurityQuestion ', values).then(
                    function (response)
                    {
                        hideProgress();
                        if (response.status == 1) {
                            resetPasswordSuccessModal(response.message, thisObj.props, "/");
                        } else {

                            errorModal(response.message);
                        }
                        thisObj.setState({ disableBtn: false, loading: false });
                    }
                ).catch(error => () => {
                    hideProgress();
                    errorModal("Unable to update password security question!");
                });
            }
        });
    }

    selectDependencyChange = (value, id) =>
    {
        let tempvalue = JSON.parse(DropList);
        let temp = { "question1": [], "question2": [], "question3": [] };
        let ids = {
            "Question1": thisObj.props.form.getFieldValue("Question1"),
            "Question2": thisObj.props.form.getFieldValue("Question2"),
            "Question3": thisObj.props.form.getFieldValue("Question3")
        };

        ids[id] = value;
        
        tempvalue.forEach(function (key, index)
        {
            if (key.passwordSecurityQuestionID == value)
            {
                temp[id.toLowerCase()].push({ attributeName: "", keyValue: key.passwordSecurityQuestionID, literal: key.questionText });
            }
            else
            {
                if (key.passwordSecurityQuestionID != ids.Question2 && key.passwordSecurityQuestionID != ids.Question3){
                    temp.question1.push({ attributeName: "", keyValue: key.passwordSecurityQuestionID, literal: key.questionText });
                }
                if (key.passwordSecurityQuestionID != ids.Question1 && key.passwordSecurityQuestionID != ids.Question3) {
                    temp.question2.push({ attributeName: "", keyValue: key.passwordSecurityQuestionID, literal: key.questionText });
                }
                if (key.passwordSecurityQuestionID != ids.Question1 && key.passwordSecurityQuestionID != ids.Question2) {
                    temp.question3.push({ attributeName: "", keyValue: key.passwordSecurityQuestionID, literal: key.questionText });
                }
            }
        });
    }
    getOptions = (otherValue1, otherValue2) => {
        const { questions } = this.state;
        let ops = [];
        if (questions !== null) {
            questions.map(function (qstn) {
                if (qstn.passwordSecurityQuestionID != otherValue1 && qstn.passwordSecurityQuestionID != otherValue2) {
                    ops.push(<Option title={qstn.questionText} key={qstn.passwordSecurityQuestionID} value={qstn.passwordSecurityQuestionID}>{qstn.questionText}</Option>);
                }
            });
        }

        return ops;
    }
    getValueFromForm = (getFieldsValue, key) => {
        return getFieldsValue([key])[key] !== undefined
            ? getFieldsValue([key])[key]
            : "";
    }

    checkNewPassword = (rule, value, callback) =>
    {
        if (value && value == this.props.userProfile.userPassword)
        {
            callback('New Password should not be same as Current Password');
        } else
        {
            var regex = /(?=.{8,16})((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$ %^&*()_+ {} | ":?><,.\/;'\=`-])).*/;
            if (value && !regex.test(value))
            {
                callback('Enter valid password');

            } else
            {
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
    onTogglePassword = () =>
        this.setState(prevState => ({
            showPassword: !prevState.showPassword,
        }));

    onConfirmPassword = () =>
        this.setState(prevState => ({
            confirmPassword: !prevState.confirmPassword,
        }));

    handleKeyDown = e => {
        if (e.key === " ") {
            e.preventDefault();
        }
    }

    //when save password validation
    checkPassword = (rule, value, callback) =>
    {
        let password = value
        if (password) {
            let score = 0
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

    onQuestionChange = (questionText) => {

        let { form } = this.props;
        if (questionText === "Question1") {
            form.setFieldsValue({ 'Answer1': "" });
        } else if (questionText === "Question2") {
            form.setFieldsValue({ 'Answer2': "" });
        } else if (questionText === "Question3") {
            form.setFieldsValue({ 'Answer3': "" });
        }
    }

    render()
    {
        const{
            showPassword,
            confirmPassword
        } = this.state;
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const { visible } = this.props;
        
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

        const val1 = this.getValueFromForm(getFieldsValue, "Question1");
        const val2 = this.getValueFromForm(getFieldsValue, "Question2");
        const val3 = this.getValueFromForm(getFieldsValue, "Question3");

        const options1 = this.getOptions(val2, val3);
        const options2 = this.getOptions(val1, val3);
        const options3 = this.getOptions(val1, val2);

        let newPassword = this.getValueFromForm(getFieldsValue,"NewPassword");
        
        return (           
                <Modal
                    visible={ visible }
                    maskClosable={false}
                    title="Password Security Question"
                    width="85%"
                    style={{ top: 5 }}
                    onCancel={this.state.disableBtn ? null : this.props.cancelCallback}
                    footer={[
                        <Button key="back" disabled={this.state.disableBtn} className="ant-btn-danger" onClick={this.props.cancelCallback}>Cancel</Button>,
                        <Button key="submit" disabled={this.state.disableBtn} className="saveBtn"  onClick={this.handleForgotPassword}>
                            {getSaveButtonText()}
                       </Button>,
                    ]}
                >
                      <div
                        style={{
                            backgroundColor: '#fff',
                            textAlign: '-webkit-center',
                            paddingBottom: 20
                        }}>

                    <div style={{ padding: 5 }}>
                            <div
                                className="isoResetPassForm"
                                
                        >
                            <Form layout="vertical">
                                <Row style={rowStyle} >
                                    <Col md={10} sm={12} xs={12} >
                                        <FormItem
                                            label="Security Question1"
                                        >
                                            {
                                                getFieldDecorator("Question1", {
                                                    rules: [{
                                                        required: true,
                                                        message: "Security Question1 should be selected"
                                                    }],
                                                    initialValue: null
                                                })(
                                                    <Select
                                                        showSearch
                                                        style={{ width: '100%' }}
                                                        onChange={() => this.onQuestionChange("Question1")}
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
                                                getFieldDecorator("Answer1",
                                                    {
                                                        rules:
                                                            [
                                                            {
                                                                  required: true, message: "Answer1 is mandatory"
                                                           },
                                                            { min: 2, message: 'Answer1 should be between 2-255 characters.' },

                                                            { max: 255, message: 'Answer1 should be between 2-255 characters.' },

                                                            {
                                                                validator: dynamicValidation,
                                                                message: "Answer1 should contain only alphanumeric and special characters(-_;,(). )", regExPattern: "/^(?!.*  )[ a-zA-Z0-9-_;,()\.]+$/"
                                                            }
                                                        ]
                                                    }
                                            )(
                                                <Input style={{ "-webkit-text-security": "disc" }} size="large" placeholder="Answer1" autoComplete="off" />
                                                )}
                                        </FormItem>
                                        <FormItem
                                            label="Security Question2"
                                        >{
                                                getFieldDecorator("Question2",
                                                    {
                                                        rules: [{
                                                            required: true,
                                                            message: "Security Question2 should be selected"
                                                        }],
                                                        initialValue: null
                                                    }
                                                )(
                                                    <Select
                                                        showSearch
                                                        style={{ width: '100%' }}
                                                        onChange={() => this.onQuestionChange("Question2")}
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
                                                getFieldDecorator("Answer2",
                                                    {
                                                        rules: [{ required: true, message: "Answer2 is mandatory" },
                                                            { min: 2, message: 'Answer2 should be between 2-255 characters.' },
                                                            { max: 255, message: 'Answer2 should be between 2-255 characters.' },
                                                            {
                                                                validator: dynamicValidation, message: "Answer2 should contain only alphanumeric and special characters(-_;,(). )", regExPattern: "/^(?!.*  )[ a-zA-Z0-9-_;,()\.]+$/"
                                                            }]
                                                    }
                                                )(
                                                    <Input style={{ "-webkit-text-security": "disc" }} size="large" placeholder="Answer2" autoComplete="off" />
                                                )}
                                        </FormItem>
                                        <FormItem
                                            label=" Security Question3"
                                        >{
                                                getFieldDecorator("Question3",
                                                    {
                                                        rules: [{
                                                            required: true,
                                                            message: "Security Question3 should be selected"
                                                        }],
                                                        initialValue: null
                                                    }
                                                )(
                                                    <Select
                                                        showSearch
                                                        style={{ width: '100%' }}
                                                        onChange={() => this.onQuestionChange("Question3")}
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
                                                getFieldDecorator("Answer3",
                                                    {
                                                        rules: [{ required: true, message: "Answer3 is mandatory" },
                                                            { min: 2, message: 'Answer3 should be between 2-255 characters.' },
                                                            { max: 255, message: 'Answer3 should be between 2-255 characters.' },
                                                            {
                                                                validator: dynamicValidation, message: "Answer3 should contain only alphanumeric and special characters(-_;,(). )", regExPattern: "/^(?!.*  )[ a-zA-Z0-9-_;,()\.]+$/"
                                                            }]
                                                    }
                                                )(
                                                    <Input style={{ "-webkit-text-security": "disc" }} size="large" placeholder="Answer3" autoComplete="off" />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col md={2}>
                                    </Col>
                                    <Col md={10} sm={12} xs={12} >
                                        <FormItem
                                            key={"New Password"}
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
                                                                { required: true, message: "New Password is mandatory" },

                                                        ]
                                                    }
                                                )(
                                                    <Input
                                                        size="large"
                                                        onKeyDown={this.handleKeyDown}
                                                        onKeyPress={(e) => this.splCharacter(e)}
                                                        onPaste={(e) => {
                                                            e.preventDefault()
                                                            return false;
                                                        }}
                                                        autoComplete="off"
                                                        onCopy={this.handlerCopy}
                                                        maxlength="15" type="text"
                                                        style={{ "-webkit-text-security": "disc" }}
                                                        placeholder="New Password"  onKeyUp={(e) => this.props.form.resetFields(["ConfirmPassword"])} />
                                                )}
                                            </Form>
                                        </FormItem>
                                        <FormItem
                                            key={"Confirm Password"}
                                            label={"Confirm Password"}
                                        >
                                            <Form>
                                                {
                                                    getFieldDecorator("ConfirmPassword",
                                                        {
                                                            rules:
                                                                [
                                                                    { required: true, message: "Confirm Password is mandatory" },
                                                                    {
                                                                        validator: checkPassword, message: "Password is not the same", props: this,
                                                                        regExPattern: "/^(?=.{7,})((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*\\d)(?=.*[a-zA-Z])(?=.*[\\W_])|(?=.*[a-z])(?=.*[A-Z])(?=.*[a-z]))(?!.*[\\s]).*/",
                                                                    }
                                                                ]
                                                        }
                                                    )(
                                                        <Input
                                                            onKeyDown={this.handleKeyDown}
                                                            onKeyPress={(e) => this.splCharacter(e)}
                                                            onCopy={this.handlerCopy}
                                                            onPaste={(e) => {
                                                                e.preventDefault()
                                                                return false;
                                                            }}
                                                            autoComplete="off"
                                                            size="large" maxlength="15"
                                                            type="text"
                                                            style={{ "-webkit-text-security": "disc" }}
                                                            placeholder="Confirm Password"
                                                        />
                                                    )}
                                            </Form>
                                        </FormItem>
                                        <div
                                            style={{ textAlign: 'justify', paddingLeft: 10 }}>
                                            <h2>Password Policy</h2>
                                            <ul
                                                className="PasswordRules"
                                                style={{marginLeft:15}}
                                            >
                                               {/* <li*/}
                                               {/*     className="forgotlimargin"*/}
                                               {/*     style={{ textAlign: "left", marginBottom: "10px" }}*/}
                                               {/* >*/}
                                               {/*     <i*/}
                                               {/*         style={{*/}
                                               {/*             color: newPassword.length >= "8" ? "green" : "red",*/}
                                               {/*             fontSize: "10px"*/}
                                               {/*         }}*/}
                                               {/*         className="fa fa-check-circle" aria-hidden="true">*/}
                                               {/*     </i>*/}
                                               {/*     Should be atleast EIGHT characters in length*/}
                                               {/*</li>*/}
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
                                                {/*    Space is not allowed*/}
                                                {/*</li>*/}


                                                <li
                                                    className="forgotlimargin"
                                                    style={{ textAlign: "left", marginBottom: "10px"}}
                                                > 
                                                    Should contain characters from  three of the following four categories:
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
                                                                    color: newPassword.match(/[0-9]/) ? "green" :"red",
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
                                                                    color: newPassword.match(/[`~!@#$%\^&*()+=|;:'",.<>\/?{}_[\]\\\-]/) ? "green" :"red",
                                                                    fontSize: "10px"
                                                                }}
                                                                className="fa fa-check-circle"
                                                                aria-hidden="true"
                                                            >
                                                            </i>
                                                            <span>Must have at least one special character. Allowed special characters are [!,@,#,$,%,^,&,*,(,)]</span>

                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                            </div>
                    </div>
                </div>
            </Modal>

        );


    }


} 



export default Form.create()(SecurityQuestions);

