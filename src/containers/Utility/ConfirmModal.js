import React, { Component } from 'react';
import { Input,Modal, Button, Form, Spin, Icon } from 'antd';
import { dynamicValidation } from './validator';
import { getConfirmButtonText } from '../Utility/sharedUtility';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;
var open = false;
class ConfirmModal extends Component { t
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            open: true,
        }
        thisObj = this;
    }

    handleCancel = () => {
        thisObj.setState({ open: false });
        thisObj.props.form.resetFields(['Change Reason']);
        thisObj.props.handleCancel();
    }
    handleSave = () => {
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                thisObj.props.onSubmit(values["Change Reason"]);
            }
        });
    }

    static getDerivedStateFromProps(props, state) {//removed componentWillReceiveProps
        thisObj.props = props;
        if (!state.open && props.visible) {
            thisObj.props.form.resetFields(['Change Reason']);
            return {
                open: true,
                visible: props.visible,
                loading: (props.loading !== undefined ? props.loading :false)
            };
        }
        else if (!props.visible) {
            return {
                open: false,
                loading: (props.loading !== undefined ? props.loading : false)
            };
        }
        else {
            return {
                loading: (props.loading !== undefined ? props.loading : false)
            };
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const { title, SubmitButtonName, visible } = this.props;
        const { loading } = this.state;

        return (

            <div>
                <Modal
                    visible={visible}
                    wrapClassName='Confirm'
                    maskClosable={false}
                    title={title}
                    style={{ top: "30vh" }}
                    onCancel={loading ? null : this.props.handleCancel}
                    footer={[
                        <Button key="back" name="PopupCancel" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} disabled={loading ? true : false} onClick={this.handleCancel}>Cancel</Button>,
                        <Button key="submit" name="PopupConfirm" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-primary' disabled={loading ? true : false} onClick={this.handleSave}>
                            {getConfirmButtonText()}
                       </Button>,
                    ]}
                >
                    <Spin indicator={antIcon} spinning={this.state.loading}>
                        <FormItem
                            label="Change Reason"
                        >{
                                getFieldDecorator("Change Reason", {
                                    rules: [{ required: true },
                                        { min: 2, message: 'Change Reason should be between 2-255 characters.' },
                                        { max: 255, message: 'Change Reason should be between 2-255 characters.' },
                                        {
                                            validator: dynamicValidation, message: "Change Reason should contain only alphanumeric and special characters(-_;,(). )", regExPattern: "/^(?!.*  )[ a-zA-Z0-9-_;,()\.]+$/"
                                        }]
                                })(
                                    <Input type="text" placeholder="Change Reason" id="ChangeReason" />

                                    )}
                        </FormItem>
                    </Spin>
                </Modal>
            </div>
        );
    }
}

const WrappedApp = Form.create()(ConfirmModal);
export default WrappedApp;
