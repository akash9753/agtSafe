import React, { Component } from 'react';
import { dynamicValidation, checkNullorbalnk } from '../Utility/validator';
import { Checkbox, Input, Modal, Button, Form, Spin, Icon } from 'antd';
import { PASS_KEY_UI, encryptSensitiveData, CallServerPost, getProjectRole } from '../Utility/sharedUtility';


const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
var thisObj;

class ConfirmWithEsign extends Component {
    constructor(props) {
        super(props);
        //console.log(this);
        this.state = this.initialState();


        thisObj = this;
    }

    initialState = () => {
        return ({
            loading: false,
            visible: false,
            loopControl: false,
            type: "password",
            title: "Esignature",
            isEsignverified: false,
            defaultValue: "",
        });
    }

    cancel = () => {
        this.props.form.resetFields();
        this.setState(thisObj.initialState(), () => {
            this.props.cancelEsign();
        });
    }
    static getDerivedStateFromProps(props, state) {
        //thisObj.props = props;
        //if (!props.visible && state.visible) {
        //    thisObj.props.form.resetFields();
        //    return thisObj.initialState();

        //} else if (props.visible && !state.visible) {
        //    thisObj.props.form.resetFields();
        //    return ({ visible: true });
        //}
    }
    checkPassword = (rule, value, callback) => {
        if (checkNullorbalnk(value)) {
            callback();
            return;
        }

        const projectRole = getProjectRole();
        let data = { UserPassword: encryptSensitiveData(value, PASS_KEY_UI), UserName: projectRole.userProfile.userName };
        CallServerPost("Users/CheckUserPassword", data).then(
            function (response) {
                if (response.value !== 0 && response.value !== -1) {
                    callback(response.message);
                    return;
                }
                else {
                    callback();
                    return;
                }
            }).catch(error => error);

    }

    checkCheckBox = (rule, value, callback) => {
        if (!value) {
            callback('Please check to continue');
        } else {
            callback();
        }
    }

    onSubmit = () => {
        const thisObj = this;
        const { validateFields } = this.props.form;
        var { type } = this.state;

        validateFields(["Iagree", type+"Reason"], (err, values) => {
            if (!err) {

                if (!thisObj.state.isEsignverified) {

                    //    thisObj.setState({
                    //        isEsignverified: true,
                    //        defaultValue: thisObj.props.defaultValue,
                    //        type: "text",
                    //        title: "Change Reason",
                    //        rules: [
                    //            { required: true, message: "Change Reason is required" },
                    //            {
                    //                validator: dynamicValidation, message: "Change Reason should contain only alphanumeric and special characters(.,-;_())", regExPattern: "/^(?!.*  )[0-9A-Za-z.,-;_)( ]+$/"
                    //            }
                    //        ]
                    //    });
                    //} else {
                    //thisObj.setState({
                    //    loading: true
                    //});
                    thisObj.props.onSubmit(values.textReason, thisObj.props.studyPage);
                }
            }

        })
    }

    handleKeyDown = e => {
        if (e.key === " ") {
            e.preventDefault();
        }
    }

    render() {

        const { getFieldDecorator } = this.props.form;
        var { type, title, loading, defaultValue } = this.state;
        var { visible, esignText } = this.props;

        return (

            <div>
                <Form>
                    <Modal
                        visible={visible}
                        wrapClassName='Confirm'
                        maskClosable={false}
                        title={title}
                        style={{ top: 20 }}
                        onCancel={loading ? null : this.cancel}
                        footer={[
                            <Button key="back"
                                disabled={loading}
                                name="PopupCancel"
                                className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger'
                                style={{ float: 'left' }}
                                onClick={this.cancel}>Cancel</Button>,
                            <Button key="submit" disabled={loading} name="PopupSave" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-primary' onClick={this.onSubmit}>
                                Update
                            </Button>,
                        ]}
                    >
                        <Spin indicator={antIcon} spinning={loading}>
                            <FormItem
                                label={title}
                            >
                                {
                                    getFieldDecorator(type + "Reason", {
                                        initialValue: defaultValue,
                                        rules: [
                                            { required: true, message: "Esignature is mandatory" },
                                            {
                                                validator: this.checkPassword, message: "Password is incorrect",
                                            }
                                        ]
                                    })(
                                        <Input onPaste={(e) => {
                                            e.preventDefault();
                                            return false;
                                        }} onKeyDown={this.handleKeyDown}
                                            maxlength="15"
                                            autoComplete="off"
                                            type={type} placeholder={title} id="ChangeReason" />

                                    )}
                            </FormItem>
                            <FormItem className="EsignCheckBoxLabel">
                            {
                                getFieldDecorator("Iagree", {
                                    rules: [{ validator: this.checkCheckBox }],
                                    valuePropName: 'checked',
                                })(
                                    <Checkbox className={"EsignCheck"} ></Checkbox>
                                )}
                                <label className='EsignLabel'> By enabling this box, I certify that {esignText}</label>
                            </FormItem>


                        </Spin>
                    </Modal>
                </Form>
            </div>
        );
    }
}

const WrappedApp = Form.create()(ConfirmWithEsign);
export default WrappedApp;
