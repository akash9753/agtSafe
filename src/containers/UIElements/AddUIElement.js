import React, { Component } from 'react';
import { Breadcrumb, Form, Modal, Spin, Icon } from 'antd';
import { CallServerPost, errorModal, successModal, PostCallWithZone } from '../Utility/sharedUtility';
import SingleForm from '../Utility/SingleForm';

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

class AddUIElementModal extends Component {

    constructor(props) {
        super(props);
        //Binding function with 'this' object
        this.handleSubmit = this.handleSubmit.bind(this);


        const thisObj = this;
        //Initializing state 
        this.state = {
            responseData: {
                formData: {},
                wizardData: {},
                selectOptions: {}
            },
            disableBtn: false,
            loading: false
        };
        //To get UI Element form data
        CallServerPost('UIElement/GetUIElementFormData', { FormName: "UIElements", ActionName: "Create" }).then(
            function (response) {
                const responseData = response.value;
                if (responseData.status === 0) {
                    errorModal(responseData.message);
                } else {
                    thisObj.setState({ responseData: responseData });
                }
            }).catch(error => error);

    }

    cancel = () => {

        this.props.hideAddUIElementsModal();
    }

    handleSubmit = (values) => {

        const thisObj = this;
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                thisObj.setState({ disableBtn: true, loading: true });
                PostCallWithZone('UIElement/Create', values)
                    .then(
                        function (response) {
                            if (response.status === 1) {
                                successModal(response.message, thisObj.props, "/trans/UIElements");
                            } else {
                                errorModal(response.message);
                            }
                            thisObj.setState({ disableBtn: false, loading: false  });
                        }).catch(error => error);
            }
        });
    }



    render() {

        const { getFieldDecorator, setFieldsValue, validateFields } = this.props.form;
        const { responseData, disableBtn, loading } = this.state;

        return (
            <Modal
                visible={this.props.visible}
                maskClosable={false}
                style={{ top: 20, height: "calc(100vh - 45px)" }}
                title={"Add UI Element"}
                width={'80%'}
                onCancel={disableBtn ? null : this.cancel}
                footer={null}
                ref="modal"
            >
                    <Spin indicator={antIcon} style={{ position: 'fixed' }} spinning={loading}>
                    {
                        Object.keys(responseData.formData).length > 0 && (
                            <SingleForm isCreate={true} property={this} responseData={responseData} handleCancel={this.cancel} setFieldsValue={setFieldsValue} getFieldDecorator={getFieldDecorator} validateFields={validateFields} handleSubmit={this.handleSubmit} />)
                        }
                    </Spin>


            </Modal>);
    }
}

const WrappedApp = Form.create()(AddUIElementModal);

export default WrappedApp;