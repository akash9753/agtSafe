import React, { Component } from 'react';
import { Breadcrumb, Icon, Col, Row, Select, Form, Modal, Spin } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import Button from '../../components/uielements/button';
import { CallServerPost, errorModal, successModal, getProjectRole } from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import SingleForm from '../Utility/SingleForm';

const projectRole = getProjectRole();
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

class AddFormAction extends Component {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            loading: false,
            responseData: {
                formData: {},
                selectOptions: {}
            },
            formID: null,
            formName: null,
            disableBtn: false
        };
        this.getFormData(this.props);
    }

        

    getFormData = (props) => {

        if (typeof props.FormID != "undefined" && props.FormID != null && props.action === "Create" && props.visible) {
            const thisObj = this;            
            let formID = props.FormID;
            var formName = props.FormName;            
            CallServerPost('FormAction/GetFormActionFormData', { FormName: "FormAction", ActionName: "Create" }).then(
                function (response) {
                    const responseData = response.value;
                    if (response.status == 0) {
                        errorModal(responseData.message);
                    } else {
                        thisObj.setState({ responseData: responseData, formID: formID });
                    }

                }).catch(error => error);
        }
    }

    handleCancel = () => {
        this.props.handleCancel();
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        const thisObj = this;
        const { formID } = this.state;
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                values["FormID"] = formID;
                values["TimeZone"] = "IST";
                values["UpdatedBy"] = projectRole.userProfile.userID;
                thisObj.setState({ loading: true , disableBtn: true});
                CallServerPost('FormAction/Create', values)
                    .then(
                    function (response) {
                        if (response.status == 1) {
                            thisObj.setState({ loading: false, disableBtn: false });
                            successModal(response.message, thisObj.props, "/trans/FormAction");
                        } else {
                            thisObj.setState({ loading: false, disableBtn: false });
                            errorModal(response.message);
                        }
                    }).catch(error => error);
            }
        });
    }


    render() {

        const { responseData, loading } = this.state;
        const { getFieldDecorator, setFieldsValue } = this.props.form;

        return (
            
            <Modal
                visible={this.props.visible}
                title={"Add Form Action"}
                style={{ top: 20 }}
                onCancel={this.state.disableBtn ? null : this.handleCancel}
                width={'80%'}
                maskClosable={false}
                footer={null}
            >

                <Spin indicator={antIcon} spinning={loading}>
                    {Object.keys(responseData.formData).length > 0 &&
                        <SingleForm isCreate={true} property={this}  responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.handleCancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleSubmit} />
                    }
                    
                </Spin>

            </Modal>

                
            
        );
    }
}

const WrappedApp = Form.create()(AddFormAction);

export default WrappedApp;