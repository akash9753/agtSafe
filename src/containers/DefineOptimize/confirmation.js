import React, { Component } from 'react';
import { Input, Modal, Button, Form, Spin, Icon } from 'antd';
import { dynamicValidation } from '../Utility/validator';
import { showProgress } from '../Utility/sharedUtility';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;
class Confirmation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,        
            loopControl:false,
        }
        thisObj = this;
        
    }

    componentWillMount() {
        thisObj.props.form.resetFields(['Change Reason']);
    }


    //Get the required field to form the pop up
    static getDerivedStateFromProps (nextProps)
    {
        if (!thisObj.state.loopControl && nextProps.visible) {
            thisObj.props.form.resetFields(['Change Reason']);

            thisObj.setState({
                loopControl: true, visible: nextProps.visible, loading: nextProps.loading
            });
        } else if(!nextProps.visible){
            thisObj.props.form.resetFields(['Change Reason']);
        }
    }


    onSubmit = () => {

        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                //showProgress();
                this.props.onSubmit(values["Change Reason"]);
               // this.setState({ loading: true })
            }
        })
    }

    cancel = () => {
        this.props.handleCancel();
        thisObj.props.form.resetFields(['Change Reason']);
    }

    render() {

        const { getFieldDecorator } = this.props.form;
        var { responseData } = this.state;
        const { title, loading, visible } = this.props;

        return (

            <div>
                <Modal
                    visible={visible}
                    maskClosable={false}
                    title={title}
                    style={{ top: "30vh" }}
                    onCancel={this.cancel}
                    footer={null}
                >
                    <Spin indicator={antIcon} spinning={loading}>

                        <FormItem
                            label="Change Reason"
                        >{
                                getFieldDecorator("Change Reason", {
                                    rules: [{ required: true },
                                        { min: 2, message: 'Change Reason should be between 2-255 characters.' },
                                        { max: 255, message: 'Change Reason should be between 2-255 characters.' },

                                    {
                                        validator: dynamicValidation, message: "Change Reason should contain only alphanumeric and special characters(-_;,(). )", regExPattern: "/^(?!.*  )[ a-zA-Z0-9-_;,()\.]+$/"
                                    }
                                    ]
                                })(
                                    <Input placeholder="Change Reason" id="ChangeReason" />

                                )}
                        </FormItem>
                        <hr style={{ border: "0.3px solid #e8e8e8", margin:"0px -10px 10px -10px" }} />
                        <div style={{width:"100%",height:"33px"}}>
                            <button type="button" class="ant-btn ant-btn sc-ifAKCX fcfmNQ ant-btn-danger" name="PopupCancel" onClick={this.cancel}><span>Cancel</span></button>
                            <button type="button" class="ant-btn ant-btn sc-ifAKCX fcfmNQ ant-btn-primary" style={{ float: "right" }} name="PopupConfirm" onClick={this.onSubmit}><span>Confirm</span></button>
                        </div>
                    </Spin>
                </Modal>
            </div>
        );
    }
}

const WrappedApp = Form.create()(Confirmation);
export default WrappedApp;
