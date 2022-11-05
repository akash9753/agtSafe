import React, { Component } from 'react';
import { Modal, Button, Form } from 'antd';
import Input from '../../components/uielements/input';
const FormItem = Form.Item;

export default class InformationModal extends Component {
    state = {
        loading: false,
        visible: false,
    }

    handleOk = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 3000);
    }

    render() {
        const { loading } = this.state;
        const { title, SubmitButtonName, visible } = this.props;
        return (

            <div>
                <Modal
                    visible={visible}
                    maskClosable={false}
                    title={title}
                    style={{ top: 20 }}
                    onCancel={this.props.handleCancel}
                    footer={[
                        <Button key="submit" type="primary" size="large" loading={loading} onClick={this.props.onSubmit}>
                            {SubmitButtonName}
                        </Button>,
                    ]}
                >
                    <FormItem >
                        <ul>
                            <li>Should be atleast EIGHT characters in length</li>
                            <li>
                                Should contain characters from  three of the following four catagories:
                                <ul>
                                    <li > English uppercase characters (A through Z) </li>

                                    <li > English lowercase characters (a through z) </li>

                                    <li > Base digits (0 through 9) </li>

                                    <li > Non-alphabetic characters (for example !,$,#,%) </li>

                                </ul>
                            </li>
                        </ul>
                    </FormItem>
                </Modal>
            </div>
        );
    }
}