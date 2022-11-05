import React, { Component } from 'react';
import { Breadcrumb, Icon, Col, Row, Select, Form, Modal, Button } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { CallServerPost, getProjectRole, successModalCallback, errorModal, PostCallWithZone, hideProgress, showProgress, getConfirmButtonText, SEC_ANS_UI, encryptSensitiveData } from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import ConfirmModal from '../Utility/ConfirmModal';
import { dynamicValidation } from '../Utility/validator';
import Input from '../../components/uielements/input';
import { errorMessageTooltip } from '../Utility/errorMessageUtility.js';


const FormItem = Form.Item;
var thisObj;
const { Option } = Select;
const splitClass = 12;

class updateSecurityQuestions extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            
            userID: JSON.parse(sessionStorage.getItem("userProfile")).userID,
            responseData: {},
            values: {},
            passwordSecurityQuestionList: {},
            visible: false,
            questions: null,
            answer: [],
        }
        thisObj = this;

    }
    static getDerivedStateFromProps(newProps, currentState)
    {
        let { visible, userID } = thisObj.state;
        if (!visible && newProps.visible) {
            thisObj.setState({ visible: true }, thisObj.getQuestionDDL(),
                thisObj.getPasswordSecurityAnswersByUserID(userID));
        } 
    }

    getQuestionDDL = (nextProps) => {

            thisObj = this;

            CallServerPost('PasswordSecurityQuestions/GetAllActivePasswordSecurityQuestions', {})
                .then(function (response) {
                    hideProgress();
                    if (response.value !== null) {
                        thisObj.setState({ visible:true,questions: response.value });
                    }
                })
        }
    
    getPasswordSecurityAnswersByUserID = (userID) => {
        thisObj = this;
        showProgress();
        CallServerPost('PasswordSecurityQuestions/GetPasswordSecurityAnswersByUserID', { userID: userID })
            .then(function (response) {
                if (response.value !== null) {
                   let  answers = response.value;
                    answers.map((x, y) => {
                        let Question = "Question" + (y + 1);
                        let Answer = "Answer" + (y + 1);
                        let data = {};
                        data[Question] = x.passwordSecurityQuestionID;
                        data[Answer] = x.answerText;

                        thisObj.props.form.setFieldsValue(data);
                    });
                    thisObj.setState({ answer: response.value });
                }
                hideProgress();
            }).catch(error => {
                //Loader Hide
                hideProgress();
            });
    }

    handleCancel = () => {
        this.setState({ visible: false, showConfirmation:false }, this.props.handleCancel())
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

    //Submit
    handleSubmit = () => {
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {                
                thisObj.setState({ saveValues: values, showConfirmation: true })

            }
        });
    }

    saveWithChageReason = (reason) => {
        let { answer, userID } = thisObj.state;

        let { saveValues } = this.state;
        saveValues["ChangeReason"] = reason;
        var array = [];
        let data = {};
        const projectRole = getProjectRole();

        array = answer.map((x, y) => {
            return {
                PasswordSecurityAnswerID: x.passwordSecurityAnswerID,
                PasswordSecurityQuestionID: saveValues["Question" + (y + 1)],
                AnswerText: encryptSensitiveData(saveValues["Answer" + (y + 1)], SEC_ANS_UI),
                UpdatedDateTimeText: x.updatedDateTimeText,
                PasswordQuestionAnswer: array,
                UserID: userID,
                TimeZone: "IST",
                ChangeReason: reason,
                UpdatedBy:projectRole.userProfile.userID
            };
        })
        data["PasswordQuestionAnswer"] = array;

        showProgress();
        PostCallWithZone("PasswordSecurityQuestions/UpdatePasswordSecurityQuestionAndAnswer", data).then(
            function (response) {
                const responseData = response;
                if (responseData.status === 0) {
                    errorModal(response.message);
                }
                else {
                    successModalCallback(response.message, () => thisObj.handleCancel());

                }
                hideProgress();
            }).catch(error => {
                //Loader Hide
                hideProgress();
            });
    }

    componentDidUpdate() {
        errorMessageTooltip(this.props);
    }

    onProjectChange = (questionText) => {

        let { form } = this.props;
        if (questionText === "Question1") {
            form.setFieldsValue({ 'Answer1': "" });
        } else if (questionText === "Question2") {
            form.setFieldsValue({ 'Answer2': "" });
        } else if (questionText === "Question3") {
            form.setFieldsValue({ 'Answer3': "" });
        }
    }


    render() {
        const { getFieldDecorator, getFieldsValue, resetFields } = this.props.form;
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

        return (
            <Modal
                visible={this.props.visible}
                maskClosable={false}
                title={"Update Password Security Questions and Answers"}
                style={{ top: 55 }}
                onCancel={this.props.handleCancel}
                width={'90%'}
                footer={[
                    <Button key="back" name="PopupCancel" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={this.handleCancel}>Cancel</Button>,
                    <Button key="submit" name="PopupConfirm" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-primary' onClick={this.handleSubmit}>
                        {getConfirmButtonText()}
                    </Button>,
                ]}
            >
                <React.Fragment>

                <Form layout="vertical">
                    <Row style={rowStyle} justify="space-between">
                        <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                            <Form.Item label="Security Question1">               
                                {
                                    getFieldDecorator("Question1", {
                                        rules: [{
                                            required: true,
                                            message: "Question1 should be selected"
                                        }],

                                        initialValue: null
                                    })(
                                        <Select
                                            showSearch
                                            style={{ width: '100%' }}
                                            onChange={() => this.onProjectChange("Question1")}
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            {options1}
                                        </Select>

                                    )}
                            </Form.Item>
                        </Col>
                        <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                            <Form.Item label={"Answer1"}>                                  
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
                            </Form.Item>
                        </Col>
                        </Row>

                        <Row style={rowStyle} justify="space-between">
                            <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                                <Form.Item label="Security Question2">               
                                    {
                                        getFieldDecorator("Question2", {
                                            rules: [{
                                                required: true,
                                                message: "Question2 should be selected"
                                            }],
                                            initialValue: null
                                        })(
                                            <Select
                                                showSearch
                                                style={{ width: '100%' }}
                                                onChange={() => this.onProjectChange("Question2")}
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            >
                                                {options2}
                                            </Select>

                                )}
                        </Form.Item>
                    </Col>
                  
                       <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }} >
                        <Form.Item
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
                                </Form.Item>
                            </Col>
                        </Row>



                        <Row style={rowStyle} justify="space-between">
                            <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                                <Form.Item label="Security Question3">
                                    {
                                        getFieldDecorator("Question3", {
                                            rules: [{
                                                required: true,
                                                message: "Question3 should be selected"
                                            }],
                                            initialValue: null
                                        })(
                                            <Select
                                                showSearch
                                                style={{ width: '100%' }}
                                                onChange={() => this.onProjectChange("Question3")}
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            >
                                                {options3}
                                            </Select>

                                )}
                        </Form.Item>
                            </Col>

                      <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }} >
                        <Form.Item
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

                                        )
                                    }
                                </Form.Item>
                            </Col>
                        </Row>

                    </Form>
                </React.Fragment>
                <Form>
                    <ConfirmModal
                        loading={false}
                        title="Update Password Security Questions and Answers"
                        SubmitButtonName="Delete"
                        onSubmit={this.saveWithChageReason}
                        visible={this.state.showConfirmation}
                        handleCancel={() => this.setState({ showConfirmation: false })} />
                </Form>

            </Modal>

            )

    }

}
const WrappedApp = Form.create()(updateSecurityQuestions);

export default WrappedApp;