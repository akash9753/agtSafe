import React, { Component } from 'react';
import { Button, Form, message, Modal, Icon, Spin } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { CallServerPost, PostCallWithZone, errorModal, successModalCallback, getAddButtonText, getSaveButtonText } from '../Utility/sharedUtility';
import ConfirmModal from '../Utility/ConfirmModal';
import SingleForm from '../Utility/SingleForm';
import Input from '../../components/uielements/input';
import { clear } from '../Utility/SingleForm';


const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;
class AddListPageConfiguration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            responseData: {
                formData: {},
            },
            modalLoad: false,
            showEditConfirmationModal: false,
            disableBtn: false
        }
        thisObj = this;
        thisObj.getFormData(thisObj.props)
    }
    getFormData = (data) => {
        if (data.action != "" && data.action != "Delete") {
            thisObj.setState({ loading: true });
            CallServerPost('ListPageConfiguration/GetListPageConfigFormData', { FormName: "ListPageConfiguration", ActionName: data.action, ID: data.listPageConfigurationID, Editable: (data.action === "Update") ? (data.readOnly) : false }).then(
                function (response) {
                    thisObj.setState({ loading: false });
                    const responseData = response.value;
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    } else {
                        thisObj.setState({ responseData: responseData, loading: false });
                    }
                }).catch(error => error);
        }
    }

    addListPageConfigCancel = () => {
        thisObj.setState({
           responseData: { formData: {} }
        });
        thisObj.props.form.resetFields();
        thisObj.props.handleCancel();
    }

    handleCreateUpdate = (val) => {

        const thisObj = this;
        thisObj.props.form.validateFields({ force: true }, (err, values) => {
            if (!err) {
                thisObj.setState({ loading: true, disableBtn: true, modalLoad: true });
                var url = "ListPageConfiguration/" + thisObj.props.action;
                if (thisObj.props.action == "Update") {
                    values["ChangeReason"] = val;
                    values["ListPageConfigurationID"] = thisObj.props.listPageConfigurationID;
                    values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;
                }
                values["FormID"] = thisObj.props.formID;
                //values["TableName"] = thisObj.props.tableName;
                PostCallWithZone(url, values)
                    .then(
                    function (response) {
                        if (response.status == 1) {
                            successModalCallback(response.message, thisObj.addListPageConfigCancel);
                            thisObj.setState({ loading: false, disableBtn: false, modalLoad: false  });
                        }
                        else {
                            thisObj.setState({ loading: false, disableBtn: false });
                            errorModal(response.message);
                        }
                    }).catch(error => error);
            }
        });       
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const thisObj = this; 
        if (thisObj.props.action == "Update") {
            thisObj.props.form.validateFields({ force: true }, (err, values) => {
                if (!err) {
                    thisObj.setState({ showEditConfirmationModal: true});
                }
            });
        }
        else if (thisObj.props.action == "Create") {            
                    thisObj.handleCreateUpdate();
        }
    }

    handleCancelEditConfirmationModal = () => {
        this.setState({ showEditConfirmationModal: false });
        this.props.form.resetFields(["Change Reason"]);
    }

    render() {

        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { responseData, loading, disableBtn } = this.state;
        const { action } = this.props;

        return (
            <Modal
                visible={this.props.visible}
                title={this.props.title}
                maskClosable={false}
                onCancel={disableBtn ? null : this.addListPageConfigCancel}
                onOk={this.handleSubmit}
                footer={[
                    <Button disabled={disableBtn} className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={this.addListPageConfigCancel}>
                        Cancel
                    </Button>,
                    (action == "Create") &&
                    <Button disabled={disableBtn} className='ant-btn sc-ifAKCX fcfmNQ ant-btn-default' style={{ float: 'left' }} onClick={clear}>
                        Clear
                    </Button>,
                    (action === "Create") ?
                        (< Button disabled={disableBtn} className='ant-btn sc-ifAKCX fcfmNQ saveBtn' onClick={this.handleSubmit} > {getAddButtonText()}</Button>)
                        :
                        (this.props.readOnly === false ?
                            (<Button disabled={disableBtn} className='ant-btn sc-ifAKCX fcfmNQ saveBtn' onClick={this.handleSubmit} >{getSaveButtonText()}</Button >)
                            :
                            (<div style={{ height: '30px' }}></div>)
                        )
                ]}
            >
                <Spin indicator={antIcon} spinning={loading}>

                    <LayoutContentWrapper>
                        {

                            (this.props.action != "") ?
                                Object.keys(responseData.formData).length > 0 && (
                                    <SingleForm property={this} props={this} responseData={responseData} getFieldDecorator={getFieldDecorator} />) : <div></div>

                        }


                    </LayoutContentWrapper>
                </Spin>
                <ConfirmModal title="Update List Page Configuration" SubmitButtonName="Update" onSubmit={this.handleCreateUpdate} visible={this.state.showEditConfirmationModal} handleCancel={this.handleCancelEditConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />

            </Modal>
        );
    }
}

const WrappedApp = Form.create()(AddListPageConfiguration);
export default WrappedApp;