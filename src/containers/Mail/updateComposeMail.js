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
    successModalCallback
} from "../Utility/sharedUtility";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.core.css";
import QuillEditor from "../../components/uielements/styles/editor.style";
import ConfirmModal from '../Utility/ConfirmModal';
import {
    dynamicValidation
} from "../Utility/validator";
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

const projectRole = getProjectRole();

class ComposeMail extends Component {
    constructor(props) {
        super(props);

        let property = props.location ? props.location.state : {};
        let emailTemplateID = typeof property === "object" ? property.EmailTemplateID : 0;
        this.state = {
            editorState: null,
            mailType: [],
            bodyValue: "",
            formdata: [],
            showEditModal:false,
            emailTemplateID: emailTemplateID,
            active: [{ key: 1, name: "Active" }, { key: 0, name: "InActive" }]
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

        //Get FormData
            const thisObj = this;
        
        //showProgress(); 
        CallServerPost("EmailTemplate/GetemailTemplate", {
            emailTemplateID: this.state.emailTemplateID,

            })
                .then(function (response) {
                    if (response.status == 1 && response.value != null) {
                        thisObj.setState({
                            formdata: response.value
                        });
                    } else {
                        errorModal(response.message);
                    }
                    hideProgress();
                })
                .catch((error) => error);
        
    }

        //Get Dropdown values
        loadPCT = () => {
            const thisObj = this;

            showProgress();
            CallServerPost("ProductControlledTerm/GetProductControlledTermByTermName", {
                TermName: "EmailTriggerEvent",

            }).then(function (response)
                {
                if (response.status == 1 && response.value != null)
                {
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

/*Update */
/*ChangeReson*/
    askChangeReason = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ showEditModal: true, storeValue: values });
            }
        });
    }
    closeChangeReasonPop = () => {
        this.setState({ showEditModal: false, storeValue: {} });
    }

    handleUpdate = (changereason) => {
        const thisObj = this;

        const { storeValue, mailType, active } = thisObj.state;

        let values = storeValue;

                //get text of dropdown by selected id for Active and TriggerType
                let sel_triggerEventobj = mailType && mailType.length > 0 && mailType.find(mtyp => mtyp.productcontrolledTermID === values.triggerEventID);
                values.triggerEventText = (sel_triggerEventobj && typeof sel_triggerEventobj === "object") ? sel_triggerEventobj.longValue : -1;
                let sel_activeObj = active && active.length > 0 && active.find(act => act.key === values.active);
                values.activeText = (sel_activeObj && typeof sel_activeObj === "object") ? sel_activeObj.name : -1;
                values.emailTemplateID = thisObj.state.emailTemplateID;
                values.changeReason = changereason;
                values.TimeZone = "IST";
                values.UpdatedBy = projectRole.userProfile.userID;

                //Loader
                showProgress();
                PostCallWithZone('EmailTemplate/Update', values)
                    .then(
                        function (response) {
                            hideProgress();
                            if (response.status == 1) {
                                successModalCallback(response.message, thisObj.loadEmailTemplate)
                            }
                            else {

                                errorModal(response.message);
                            }
                        }).catch(error => error);
            }
        


    /*Validation for email body*/
    fnvalidation = (rule, va, cb) => {
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
        const { mailType, active, formdata, showEditModal } = this.state;
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


        return (
            <LayoutContentWrapper className="emailtemp_layoutcontwraper">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-envelope"></i>
                        <span> Email Template</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Edit</Breadcrumb.Item>
                </Breadcrumb>
                <LayoutContent className="emailtemplate_layoutcontent">
                    {formdata.length != 0 && <Form className="emailtemplate_form">
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
                                                    message: "Template Name should contain only alphanumeric values and underscore",
                                                    regExPattern: "/^(?!.*  )[A-Za-z0-9\_ ]+$/"
                                                }
                                            ],
                                            initialValue: formdata.templateName
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
                                            initialValue: formdata.emailSubject

                                        })(<Input />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row justify="center" gutter={{ xs: 8, sm: 16, md: 12, lg: 12 }} align="top">
                                <Col span={12}>
                                    <FormItem label={"Trigger Type"} key={"TriggerTypeInput"}>
                                        {getFieldDecorator("triggerEventID", {
                                            rules: [
                                                {

                                                    required: true,
                                                    message: "Please select Trigger Type!",
                                                },

                                            ],
                                            initialValue: formdata.triggerEventID

                                        })(
                                            <Select  style={{ width: "100%", marginBottom: "10px" }} placeholder="--Select--">
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
                                    <FormItem label={"Status"} key={"Active"}>
                                        {getFieldDecorator("active", {
                                            rules: [
                                                {

                                                    required: true,
                                                    message: "Please select Status!",
                                                },
                                            ],
                                            initialValue: Number(formdata.active)

                                        })(
                                            <Select disabled style={{ width: "100%", marginBottom: "10px" }} placeholder="--Select--">
                                                {active.map((opt) => (<Option key={opt.key} value={opt.key}>{opt.name}</Option>))}

                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row className="flex_focus_div">
                                <Col span={24} className="flex_focus_child">
                                    <QuillEditor className="Custom_ReactQuill flex_focus_child">

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
                                                initialValue: formdata.emailBody,

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
                                            onClick={this.askChangeReason}
                                            className="saveBtn"
                                        >
                                            {"Update"}
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </ComposeForm>
                    </Form>}
                    <ConfirmModal loading={false} title="Update Email Template"  onSubmit={this.handleUpdate} visible={showEditModal} handleCancel={this.closeChangeReasonPop} />
                </LayoutContent>
            </LayoutContentWrapper>
        );
    }
}

const WrappedComposeMail = Form.create({ name: "EmailTemplateAdd" })(
    ComposeMail
);

export default WrappedComposeMail;
