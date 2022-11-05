import React, { Component } from 'react';
import { Form, Icon, Spin, Row, Col, Breadcrumb, Button, Select, Input, Modal } from 'antd';
import { showProgress, hideProgress, CallServerPost, PostCallWithZone, Message, getSesssionValue, antIcon, SM_SPLIT, PADDING_RIGHT_10, CANCEL, UPDATE, encryptSensitiveData, SEC_ANS_UI } from '../Utility/sharedUtility';
import { getValueFromForm } from '../Utility/commonUtils';
import { getRules } from '../Utility/htmlUtility';
import PasswordPolicy from '../Utility/PasswordPolicy';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { icon } from '../Utility/icon';


var thisObj = [];
const FormItem = Form.Item;
const { Option } = Select;
let loopControl = true;
let answers = [];
class PasswordSecurityAnswersCrud extends Component {

    constructor(props) {
        super(props);

        let prop = (props.location !== undefined) ? props.location.state : props;
        this.state = {
            property: prop,
            userID: prop.userID,
            responseData: {},
            values: {},
            passwordSecurityQuestionList: {},
            visible: false,
            questions: null,
            answer: []
        };
        thisObj = this;
        this.getQuestionDDL();
        this.getPasswordSecurityAnswersByUserID(prop.userID);
        loopControl = false;
        answers = [];
    }



    componenWillUnmount() {
        loopControl = true;
    }

    getQuestionDDL = () => {
        thisObj = this;
        showProgress();
        CallServerPost('PasswordSecurityQuestions/GetAllActivePasswordSecurityQuestions', {})
            .then(function (response) {
                if (response.value !== null) {
                    thisObj.setState({ questions: response.value });
                }
                hideProgress();
            }).catch(error => {
                //Loader Hide
                hideProgress();
            });
    }

    getPasswordSecurityAnswersByUserID = (userID) => {
        thisObj = this;
        showProgress();
        CallServerPost('PasswordSecurityQuestions/GetPasswordSecurityAnswersByUserID', { userID: userID })
            .then(function (response) {
                if (response.value !== null) {
                    answers = response.value;
                    thisObj.setState({ answer: response.value });
                }
                hideProgress();
            }).catch(error => {
                //Loader Hide
                hideProgress();
            });
    }

    componentDidMount() {
        loopControl = true;
    }

    componentDidUpdate() {
        if (loopControl && answers.length > 0) {
            loopControl = false;

            thisObj.setField(answers);
        }
    }

    setField = (answer) => {

        answer.map((x, y) => {
            let Question = "Question" + (y + 1);
            let Answer = "Answer" + (y + 1);
            let data = {};
            data[Question] = x.passwordSecurityQuestionID;
            data[Answer] = x.answerText;

            thisObj.props.form.setFieldsValue(data);
        });
    }

    FormList = (value) => {
        let temp = { "question1": [], "question2": [], "question3": [] };

        value.forEach(function (key, index) {
            temp.question1.push({ attributeName: "", keyValue: key.passwordSecurityQuestionID, literal: key.questionText });
            temp.question2.push({ attributeName: "", keyValue: key.passwordSecurityQuestionID, literal: key.questionText });
            temp.question3.push({ attributeName: "", keyValue: key.passwordSecurityQuestionID, literal: key.questionText });
        });
        return temp;

    }
    handleSubmit = () => {
        let { answer } = thisObj.state;
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                let userID = JSON.parse(getSesssionValue("userProfile")).userID;
                var array = [];

                array = answer.map((x, y) => {
                    return {
                        PasswordSecurityAnswerID: x.passwordSecurityAnswerID,
                        Question: values["Question" + (y + 1)],
                        Answer: encryptSensitiveData(values["Answer" + (y + 1)], SEC_ANS_UI),
                        UpdatedDateTimeText: x.updatedDateTimeText
                    };
                })

                values["PasswordQuestionAnswer"] = array;
                values["UserID"] = userID;
                values["TimeZone"] = timezone;
                values["ChangeReason"] = "Manually updated by the user";
                showProgress();
                PostCallWithZone("PasswordSecurityQuestions/UpdatePasswordSecurityQuestionAndAnswer", values).then(
                    function (response) {
                        const responseData = response;
                        if (responseData.status === 0) {
                            Message.error({ title: "Security Questions", msg: response.message, onOk: () => thisObj.Cancel() });
                        }
                        else {
                            Message.success({ title: "Security Questions", msg: response.message, onOk: () => thisObj.Cancel() });
                        }
                        hideProgress();
                    }).catch(error => {
                        //Loader Hide
                        hideProgress();
                    });
            }
        });
    }

    Cancel = () => {
        //remove highlight of topbarusermenu
        var element = document.getElementById("securityQuestion");
        if (element) {
            element.className = element.className.replace(/\ant-menu-item-selected\b/g, "");
        }

        loopControl = true;
        this.props.history.push("/dvsg/dashboard");
    }


    getOptions = (otherValue1, otherValue2) => {
        const { questions } = this.state;
        let ops = [];
        if (questions !== null) {
            questions.map(function (qstn) {
                if (qstn.passwordSecurityQuestionID != otherValue1 && qstn.passwordSecurityQuestionID != otherValue2) {
                    ops.push(<Option key={qstn.passwordSecurityQuestionID} value={qstn.passwordSecurityQuestionID}>{qstn.questionText}</Option>);
                }
            });
        }

        return ops;
    }



    render() {

        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const { questions, visible, pageName, property } = this.state;
        const val1 = getFieldsValue("Question1");
        const val2 = getFieldsValue("Question2");
        const val3 = getFieldsValue("Question3");

        const options1 = this.getOptions(val2, val3);
        const options2 = this.getOptions(val1, val3);
        const options3 = this.getOptions(val1, val2);

        return (
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className={icon.PasswordSecurityQuestions} />
                    &nbsp;<span>{pageName}</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Update
                </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent>
                    {
                        <Form layout="vertical">
                            <div id="middleDiv" >
                                <Row>
                                    <Col md={12} sm={SM_SPLIT} xs={SM_SPLIT} className="PADDING_RIGHT_10">
                                        <FormItem
                                            key={"Question1"}
                                            label={"Question1"}
                                        >
                                            {getFieldDecorator('Question1', {
                                                rules: [{ required: true, message: "Question1 should be selected" }],
                                            })(<Select>
                                                {options1}
                                            </Select>)}
                                        </FormItem>
                                    </Col>
                                    <Col md={12} sm={SM_SPLIT} xs={SM_SPLIT} >
                                        <FormItem
                                            key={"Answer1"}
                                            label={"Answer1"}
                                        >
                                            {getFieldDecorator('Answer1', {
                                                rules: getRules({
                                                    required: true, min: 2, max: 255, regx: "/^(?!.*  )[A-Za-z0-9 ]+$/",
                                                    validMsg: "Answer1 should be between 2-255 characters",
                                                    inputValidMsg: "Answer1 should contain only alphanumeric values",
                                                    reqMsg: "Answer1 is mandatory"
                                                }, "Answer1"),
                                            })(<Input autoComplete="off" />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12} sm={SM_SPLIT} xs={SM_SPLIT} className="PADDING_RIGHT_10">
                                        <FormItem
                                            key={"Question2"}
                                            label={"Question2"}
                                        >
                                            {getFieldDecorator('Question2', {
                                                rules: [{ required: true, message: "Question2 should be selected" }],
                                            })(<Select>
                                                {options2}
                                            </Select>)}
                                        </FormItem>
                                    </Col>
                                    <Col md={12} sm={SM_SPLIT} xs={SM_SPLIT} >
                                        <FormItem
                                            key={"Answer2"}
                                            label={"Answer2"}
                                        >
                                            {getFieldDecorator('Answer2', {
                                                rules: getRules({
                                                    required: true, min: 2, max: 255, regx: "/^(?!.*  )[A-Za-z0-9 ]+$/",
                                                    validMsg: "Answer2 should be between 2-255 characters",
                                                    inputValidMsg: "Answer2 should contain only alphanumeric values",
                                                    reqMsg: "Answer2 is mandatory"
                                                }, "Answer2"),
                                            })(<Input autoComplete="off" />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12} sm={SM_SPLIT} xs={SM_SPLIT} className="PADDING_RIGHT_10">
                                        <FormItem
                                            key={"Question3"}
                                            label={"Question3"}
                                        >
                                            {getFieldDecorator('Question3', {
                                                rules: [{ required: true, message: "Question3 should be selected" }],
                                            })(<Select >
                                                {options3}
                                            </Select>)}
                                        </FormItem>
                                    </Col>
                                    <Col md={12} sm={SM_SPLIT} xs={SM_SPLIT} >
                                        <FormItem
                                            key={"Answer3"}
                                            label={"Answer3"}
                                        >
                                            {getFieldDecorator('Answer3', {
                                                rules: getRules({
                                                    required: true, min: 2, max: 255, regx: "/^(?!.*  )[A-Za-z0-9 ]+$/",
                                                    validMsg: "Answer3 should be between 2-255 characters",
                                                    inputValidMsg: "Answer3 should contain only alphanumeric values",
                                                    reqMsg: "Answer3 is mandatory"
                                                }, "Answer3"),
                                            })(<Input autoComplete="off" />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Button type="danger" size="medium" name="Cancel" style={{ marginRight: 10, float: "left" }} onClick={() => this.Cancel()}> {CANCEL} </Button>

                                    <Button style={{ float: "right" }} size="medium" name="Save" className="saveBtn" onClick={() => { this.handleSubmit() }} >{UPDATE}</Button>
                                </Row>
                            </div>
                        </Form>
                    }
                </LayoutContent>
            </LayoutContentWrapper>
        )

    }
}
const WrappedApp = Form.create()(PasswordSecurityAnswersCrud);
export default WrappedApp;
