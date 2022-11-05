import React, { Component } from "react";
import LayoutContentWrapper from "../../components/utility/layoutWrapper";
import { Breadcrumb, Row, Col } from "antd";
import LayoutContent from "../../components/utility/layoutContent";
import Async from "../../helpers/asyncComponent";
import Button from "../../components/uielements/button";
import Input from "../../components/uielements/input";
import ComposeAutoComplete from "./composeAutoComplete";
import notification from "../../components/notification";
import IntlMessages from "../../components/utility/intlMessages";
import ComposeForm from "./composeMail.style";
import Select, { SelectOption } from "../../components/uielements/select";
import basicStyle from "../../settings/basicStyle";
import Form from "../../components/uielements/form";
import {
    CallServerPost,
    errorModal,
    successModal,
    getProjectRole,
    checkPermission,
    showProgress,
    hideProgress,
    PostCallWithZone,
    successModalCallback, 
} from "../Utility/sharedUtility";
import {
  dynamicValidation
} from "../Utility/validator";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.core.css";
import QuillEditor from "../../components/uielements/styles/editor.style";

const Option = SelectOption;
const FormItem = Form.Item;
const Editor = (props) => (
    <Async
        load={import(
      /* webpackChunkName: "compose-mAIL--editor" */ "../../components/uielements/editor"
        )}
        componentProps={props}
    />
);

class ComposeMail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: null,
            loading: false,
            iconLoading: false,
            mailType: [],
            bodyValue: "",
            active: [{ key: 1, name: "Active" }, { key: 0, name: "InActive"}]
        };
        this.quillModules = {
            toolbar: {
                container: [
                    [{ header: [1, 2, false] }, { font: [] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                    ],
                    ["link"],
                    ["clean"],
                ],
            },
        };
        this.loadPCT();
    }
    componentDidMount() {
        hideProgress();
    }
    loadPCT = () => {
        const thisObj = this;
        let values = {};

        showProgress();
        CallServerPost("ProductControlledTerm/GetProductControlledTermByTermName", {
            TermName: "EmailTriggerEvent",
        })
            .then(function (response) {
                if (response.status == 1 && response.value != null) {
                    thisObj.setState({ mailType: response.value });
                }
                hideProgress();
            })
            .catch((error) => error);
    };

    loadEmailTemplate = () => {
        this.props.history.push({
            pathname: "/trans/EmailTemplate",
            state: {
                loading: true,
            },
        });
    };
    handleChange = (html) => {
        this.setState({ bodyValue: html });
    }
    /*create */
    handleCreate = () => {
        const thisObj = this;

        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { mailType ,active} = thisObj.state;

                //get text of dropdown by selected id for Active and TriggerType
                let sel_triggerEventobj = mailType && mailType.length > 0 && mailType.find(mtyp => mtyp.productcontrolledTermID === values.triggerEventID);
                values.triggerEventText = (sel_triggerEventobj && typeof sel_triggerEventobj === "object") ? sel_triggerEventobj.longValue : -1;
                let sel_activeObj = active && active.length > 0 && active.find(act => act.key === values.active);
                values.activeText = (sel_activeObj && typeof sel_activeObj === "object") ? sel_activeObj.name : -1;

                showProgress();
                PostCallWithZone('EmailTemplate/Create', values)
                    .then(
                        function (response) {
                            hideProgress();
                            if (response.status == 1)
                            {
                                successModalCallback(response.message, thisObj.loadEmailTemplate)
                            }
                            else
                            {

                                errorModal(response.message);
                            }
                }).catch(error => error);
            }
        })
    }


    /*Validation for email body*/
    fnvalidation = (rule,va,cb) => {
        if (va === "<p><br></p>") {

            cb('');

            return;
        }
        else {
            
            cb();

            return;
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { mailType, active } = this.state;
        const { rowStyle, colStyle, gutter } = basicStyle;
        const onEditorStateChange = (editorState) => {
            this.setState({ editorState });
        };
        const options = {
            theme: "snow",
            formats: Editor.formats,
            placeholder: "Write Something",
            onKeyUp: this.handleChange,
            modules: this.quillModules,
        };

        const editorOption = {
            style: { width: "90%", height: "70%" },
            editorState: this.state.editorState,
            toolbarClassName: "home-toolbar",
            wrapperClassName: "home-wrapper",
            editorClassName: "home-editor",
            onEditorStateChange: onEditorStateChange,
            bodyValue: this.state.bodyValue,
        };
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

        return (
            <LayoutContentWrapper className="emailtemp_layoutcontwraper">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-envelope"></i>
                        <span> Email Template</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Add</Breadcrumb.Item>
                </Breadcrumb>
                <LayoutContent className="emailtemplate_layoutcontent">
                    <Form className="emailtemplate_form">
                        <ComposeForm className="isoComposeMailWrapper email_isoComposeMailWrapper">
                            <Row justify="center" gutter={{ xs: 8, sm: 16, md: 12, lg: 12 }} align="top">
                                <Col span={12}>
                                    <Form.Item label="Template Name">
                                        {getFieldDecorator("templateName", {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: "Please input Template Name!",
                                                },
                                                { min: 2, message: "Template Name should be between 2-255 characters" },
                                                { man: 255, message: "Template Name should be between 2-255 characters" },
                                                {
                                                    validator: dynamicValidation,
                                                    message:"Template Name should contain only alphanumeric values and underscore",
                                                    regExPattern: "/^(?!.*  )[A-Za-z0-9\_ ]+$/"
                                                }

                                            ],
                                        })(<Input />)}
                                    </Form.Item>
                                    
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Subject">
                                        {getFieldDecorator("emailSubject", {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: "Please input Subject!",
                                                },
                                                { min: 2, message: "Subject should be between 2-255 characters" },
                                                { max: 255, message: "Subject should be between 2-255 characters" },
                                                {
                                                    validator: dynamicValidation,
                                                    message: "Subject should contain only alphanumeric values and special characters(._-)",
                                                    regExPattern: "/^(?!.*  )[a-zA-Z0-9-_\. ]+$/"
                                                }
                                            ],
                                        })(<Input />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row justify="center" gutter={{ xs: 8, sm: 16, md: 12, lg: 12 }} align="top">
                                <Col span={12}>
                                    <FormItem label={"Trigger Type"} key={"TriggerTypeInput"} >
                                        {getFieldDecorator("triggerEventID", {
                                            rules: [
                                                {

                                                    required: true,
                                                    message: "Please select Trigger Type!",
                                                }
                                            ],

                                        })(
                                            <Select style={{ width: "100%", marginBottom: "10px" }} placeholder="--Select--">
                                                {mailType.map((opt) => (
                                                    <Option
                                                        value={opt.productcontrolledTermID}
                                                        key={opt.productcontrolledTermID}
                                                    >
                                                        {opt.longValue}
                                                    </Option>
                                                ))}
                                            </Select>
                                        )}
                                    </FormItem>
                                    
                                </Col>
                                <Col span={12}>
                                    <FormItem label={"Status"} key={"Status"}>
                                        {getFieldDecorator("active", {
                                            rules: [
                                                {

                                                    required: true,
                                                    message: "Please select Status!",
                                                },

                                            ],

                                        })(
                                            <Select style={{ width: "100%", marginBottom: "10px" }} placeholder="--Select--">
                                                {active.map((opt) => (<Option key={opt.key} value={opt.key}>{opt.name}</Option>))}

                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row className="flex_focus_div">
                                <Col span={24} className="flex_focus_child">
                                    <QuillEditor className="Custom_ReactQuill flex_focus_child" >

                                        <Form.Item label="" className="formitem_reactQuill_wrap flex_focus_child">

                                            {getFieldDecorator("emailBody", {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: "Please input Email Body!",
                                                },
                                                { min: 2, message: "Email Body should be between 2-5000 characters" },
                                                { max: 5000, message: "Email Body should be between 2-5000 characters" },
                                                { validator: this.fnvalidation, message: "Please input Email Body!" }
                                            ],
                                            initialValue: "",

                                        })(
                                            <ReactQuill {...options} />)}</Form.Item>
                                        </QuillEditor>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <div className="isoComposeMailBtnWrapper">
                                        <Button
                                            type="danger"
                                            onClick={() => {
                                                this.loadEmailTemplate();
                                            }}
                                        >
                                            {"Cancel"}
                                        </Button>

                                        <Button
                                            onClick={this.handleCreate}
                                            className="saveBtn"
                                        >
                                            {"Save"}
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </ComposeForm>
                    </Form>
                </LayoutContent>
            </LayoutContentWrapper>
        );
    }
}

const WrappedComposeMail = Form.create({ name: "EmailTemplateAdd" })(
    ComposeMail
);

export default WrappedComposeMail;
