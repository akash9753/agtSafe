import React, { Component } from 'react';
import { Breadcrumb, Form, Modal } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, errorModal, successModal, PostCallWithZone } from '../Utility/sharedUtility';
import SingleForm from '../Utility/SingleForm';
import ConfirmModal from '../Utility/ConfirmModal';

var thisObj;
class EditUIElementModal extends Component {

    constructor(props) {
        super(props);
        //Binding function with 'this' object
        this.handleUpdate = this.handleUpdate.bind(this);


        //Initializing state 
        this.state = {
            showEditModal: false,
            responseData: {
                formData: {},
                wizardData: {},
                selectOptions: {}
            },
            modalLoad: false,
            allValues: {},
            visible: true,
            disableBtn: false
        };
        thisObj = this;
        this.loadUiElementId(props);
        //To get UI Element form data
        //console.log(this)

        
        

    }

    loadUiElementId = (nextProps) => {
        if (nextProps.uiElementId !== '') {
            let UIElementID = nextProps.uiElementId;
            CallServerPost('UIElement/GetUIElementFormData', { FormName: "UIElements", ActionName: "Update", ID: UIElementID, Editable: nextProps.readOnly }).then(
                function (response) {
                    const responseData = response.value;
                    //console.log(response)
                    if (responseData.status === 0) {
                        errorModal(responseData.message);
                    } else {
                        thisObj.setState({ responseData: responseData });
                    }
                }).catch(error => error);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.visible && !nextProps.visible) {

            //console.log("Modal Closed");
        } else if (!this.props.visible && nextProps.visible) {

            //console.log("Modal Opened");
            this.loadUiElementId(nextProps);

        }
    }

    cancel = () => {
        this.props.hideEditUIElementsModal();
    }
    handleCancel = () => {

        this.setState({ showEditModal: false});
    }
    handleUpdate = (values) => {

        const thisObj = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                thisObj.setState({ showEditModal: true, allValues: values });
            }
        });
    }

    handleChangeReason = (ChangeReason) => {

        const thisObj = this;
        let values = thisObj.state.allValues;
        values["UIElementID"] = thisObj.props.uiElementId;
        values["ChangeReason"] = ChangeReason;
        values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;
        thisObj.setState({ modalLoad: true, disableBtn: true });

                PostCallWithZone('UIElement/Update', values)
                    .then(
                    function (response) {                        
                        if (response.status === 1) {
                            successModal(response.message, thisObj.props, "/trans/UIElements");
                        } else {
                            errorModal(response.message);
                        }
                        thisObj.setState({ modalLoad: false, disableBtn: false, showEditModal: false });
                    }).catch(error => error);
    }


    render() {

        const { getFieldDecorator, setFieldsValue, validateFields } = this.props.form;
        const { responseData, disableBtn } = this.state;

        return (<Modal
            visible={this.props.visible}
            maskClosable={false}
            style={{ top: 20, height: "calc(100vh - 45px)" }}
            title={"Edit UI Element"}
            width={'80%'}
            onCancel={disableBtn ? null : this.cancel}
            footer={null}
            ref="modal"
            >
                <LayoutContentWrapper>
                    {
                    Object.keys(responseData.formData).length > 0 && (
                        <SingleForm Editable={this.props.readOnly} property={this} responseData={responseData} handleCancel={this.cancel} setFieldsValue={setFieldsValue} getFieldDecorator={getFieldDecorator} validateFields={validateFields} handleSubmit={this.handleUpdate} />)

                    }
                    <ConfirmModal loading={this.state.modalLoad} title="Update UI Element" SubmitButtonName="Update" onSubmit={this.handleChangeReason} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />

                </LayoutContentWrapper>

        </Modal>);
    }
}

const WrappedApp = Form.create()(EditUIElementModal);

export default WrappedApp;