import React from 'react';
import {
    CallServerPost,
    errorModal,
    PostCallWithZone,
    successModalCallback,
    getUserID,
    showProgress,
    hideProgress
} from '../Utility/sharedUtility';
import SingleForm from '../Utility/SingleForm';
import { Modal, Button, Form } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';

let thisObj = {};

export class ADDCustomCodeList extends React.Component {
    constructor(props) {
        super(props);
        this.state =
        {
            responseData:
            {
                formData: {},
                selectOptions: {}
            },
        };

        thisObj = this;

        CallServerPost('CustomCodeList/GetCustomCodeListFormData',
            {
                FormName: "CustomCodeList",
                ActionName: "Create",
            }).then(function (response) {
                const responseData = response.value;

                if (responseData.status == 0) {
                    errorModal(responseData.message);
                }
                else {
                    thisObj.setState({
                        responseData: {
                            ...responseData, selectOptions: {
                                "group": [{
                                    attributeName: "Group", keyValue: 1, literal: "Yes"
                                },
                                { attributeName: "Group", keyValue: 0, literal: "No" }
                                ], "extensible": [{
                                    attributeName: "Extensible", keyValue: 1, literal: "Yes"
                                },
                                { attributeName: "Extensible", keyValue: 0, literal: "No" }
                                ]

                            }
                        }
                    });
                }

            }).catch(error => error);
    }
    handleCustomCodeListCancel = () => {
        thisObj.setState({
            nextProp: true, responseData: { formData: {} }
        });
        thisObj.props.form.resetFields();
        thisObj.props.handleCancel();
    }

    handleCancelEditConfirmationModal = () => {
        this.setState({ showEditConfirmationModal: false, disableBtn: false });
        this.props.form.resetFields(["Change Reason"]);

    }
    views = (customCodeListID, CodeListVersion) => {
        this.handleCustomCodeListCancel();
        this.handleCancelEditConfirmationModal();
        this.setState({ title: "View Custom List", viewCustomList: true, customCodeListID: customCodeListID, CodeListVersion: CodeListVersion, views:true });

    }
    Create = () => {
        const thisObj = this;
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                showProgress();
                let { CodeListVersion } = this.props;

                values["CodeListVersion"] = CodeListVersion;
                values["Extensible"] = values["Extensible"] === "1";
                PostCallWithZone('CustomCodeList/CreateBatch', values)
                    .then(function (response) {
                       
                        hideProgress();
                        if (response.status == 1) {

                            successModalCallback(response.message, () => { thisObj.cancel(); });
                            this.cancel();
                        }
                        else {
                            errorModal(response.message, thisObj.views);
                        }

                    }).catch(error => {
                     hideProgress();
                    }
                );
            }
        });
        
          
       
    }
    cancel = () => {

        this.props.cancel();
    }

    render() {

        let { responseData } = this.state;
        let { getFieldDecorator, resetFields } = this.props.form;

        return (
            <Modal
                visible={this.props.visible}
                title={"Add Custom Code List"}
                maskClosable={false}
                onCancel={this.cancel}
                onOk={this.handleSubmit}
                footer={
                    [
                        <Button key="Cancel" name="Cancel" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={this.cancel}>
                            Cancel
                        </Button>,
                        this.props.readOnly === false ?
                            <>
                                <Button style={{ float: 'left' }} type={"default"} disabled={this.state.disableBtn}
                                    name={"Clear"} onClick={() => { resetFields(); }}>
                                Clear
                            </Button>
                            <Button disabled={this.state.disableBtn}
                                name={"Update"} className='ant-btn sc-ifAKCX fcfmNQ saveBtn' onClick={this.Create}>
                                Create
                            </Button></> : <div style={{ height: '32px' }}></div>,
                    ]}
            >
                <LayoutContentWrapper>
                    {
                        (this.props.action != "") ?
                            Object.keys(responseData.formData).length > 0 && (
                                <SingleForm property={this} props={this} versionID={this.props.stdVersionIDForCreateAndUpdate} responseData={responseData} getFieldDecorator={getFieldDecorator} />) : <div></div>
                    }

                </LayoutContentWrapper>

            </Modal>
        );
    }
}

const WrappedApp = Form.create()(ADDCustomCodeList);

export default WrappedApp;