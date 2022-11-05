import React, { Component } from 'react';
import {  Form, Modal } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import Button from '../../components/uielements/button';
import { CallServerPost, PostCallWithZone, errorModal, successModalCallback, showProgress, hideProgress } from '../Utility/sharedUtility';
import SingleForm from '../Utility/SingleForm';


let thisObj;
class editCustomCodeList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showEditModal: false,
            responseData:
            {
                formData: {},
                selectOptions: {}
            },

            rowNum: -1,
            allValues: {},
            modalLoad: false,
        };
        thisObj = this;

        let { rowNum, CodeListVersion } = this.props;
        CallServerPost('CustomCodeList/GetCustomCodeListFormData', {
            FormName: "CustomCodeList",
            ActionName: "Update",
            ID: rowNum,
            CodeListVersion: CodeListVersion
        }).then(function (response) {
            const responseData = response.value;
            if (responseData.status == 0) {
                errorModal(responseData.message);
            }
            else {
                thisObj.setState({
                    responseData: {
                        ...responseData, selectOptions: {
                            "group":
                            [{
                                attributeName: "Group", keyValue: "True", literal: "Yes"
                            },
                            { attributeName: "Group", keyValue: "False", literal: "" }
                            ],
                            "extensible": [{
                                attributeName: "Extensible", keyValue: "True", literal: "Yes"
                            },
                                { attributeName: "Extensible", keyValue: "False", literal: "No" }]

                        }
                    }
                });
            }

        }).catch(error => error);



    }

    handleSubmit = () => {
        const thisObj = this;
        
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                showProgress();
                let { rowNum, CodeListVersion } = this.props;
                values["CodeListVersion"] = CodeListVersion;
                values["RowNum"] = rowNum;


                PostCallWithZone('CustomCodeList/UpdateBatch', values)
                    .then(
                        function (response) { 
                            hideProgress();
                            if (response.status == 1) {
                                successModalCallback(response.message,  thisObj.cancel);
                            }
                            else {
                                errorModal(response.message);
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
        let { getFieldDecorator } = this.props.form;
        
        return (<Modal
            visible={this.props.visible}
            title={"Edit Custom Code List"}
            maskClosable={false}
            onCancel={this.cancel}
            onOk={this.handleSubmit}
            footer={[
                <Button key="Cancel" name="Cancel" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={this.cancel}>
                    Cancel
                </Button>,
                this.props.readOnly === false ?


                    <Button disabled={this.state.disableBtn} name={"Update"} className='ant-btn sc-ifAKCX fcfmNQ saveBtn' onClick={this.handleSubmit}>
                        Update
                    </Button>
                    : <div style={{ height: '32px' }}></div>,
            ]}
        >

            <LayoutContentWrapper>
                {
                    (this.props.action != "") ?
                        Object.keys(responseData.formData).length > 0 && (
                            <SingleForm property={this} props={this} versionID={this.props.stdVersionIDForCreateAndUpdate} responseData={responseData} getFieldDecorator={getFieldDecorator}/>) : <div></div>

                }
            </LayoutContentWrapper>


        </Modal>)
    }
}

const WrappedApp = Form.create()(editCustomCodeList);

export default WrappedApp;