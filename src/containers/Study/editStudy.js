import React, { Component } from 'react';
import { CallServerPost, errorModal, successModalCallback, PostCallWithZone, successModal } from '../Utility/sharedUtility';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { Form, Modal, Steps, Row } from 'antd';
import { DynamicForm } from '../Utility/htmlUtility';
import Button from '../../components/uielements/button';
import Spin from '../../styles/spin.style';
import WizardForm from '../Utility/wizardForm';

const Step = Steps.Step;
var thisObj;

class UpdateStudyModal extends Component {
    constructor(props) {
        super(props);
       
        this.state = {
            responseData: {
                formData: {},
                wizardData: {},
                selectOptions: {}
            },
            current: 0
        };
        thisObj = this;
        this.loadFormData(props);
        //console.log("props");
        //console.log(props);
    }
    loadFormData = (nextProps) => {
        if (nextProps.action === "Update") {
        const thisObj = this;
        CallServerPost('Study/GetFormDataStudy', { FormName: "Study", ActionName: "Update", ID: nextProps.studyID, ProjectID: nextProps.projectId, Editable: nextProps.readOnly }).then(
            function (response) {
                const responseData = response.value;
                if (responseData.status == 0) {
                    errorModal(responseData.message);
                } else {
                    thisObj.setState({ responseData: responseData });
                }
            }).catch(error => error);
    }
    }
    static getDerivedStateFromProps(nextProps, currentstate) {
        if (currentstate.visible && !nextProps.visible) {
            //console.log("Modal Closed");

        } else if (!currentstate.visible && nextProps.visible) {

            //console.log("Modal Opened");
        }
        return
        this.loadFormData(nextProps)
    }
   /* componentWillReceiveProps(nextProps) {
        if (this.props.visible && !nextProps.visible) {

            //console.log("Modal Closed");
        } else if (!this.props.visible && nextProps.visible) {

            //console.log("Modal Opened");
            
            this.loadFormData(nextProps);
           
        }
    }*/
    saveStudy = (formValues) => {
        formValues["StudyStatusID"] = 5;
        const props = this.props.parentRootProps;
        PostCallWithZone('Study/CreateNewStudy', formValues).then(
            function (response) {
                if (response.status == 0) {
                    errorModal(response.message);
                } else {
                    successModal(response.message, props, "/trans/project");
                }
            }).catch(error => error);


    }
    getTitleFrFile = () => {

    }
    handleReset = () => {
        this.props.form.resetFields();
    }

    switchfn = (result, id) => {
        var thisobject = this;
        var field = "";
        if (id != "AnnotationRequired") {
            switch (id) {

                case "MappingRequried":
                    field = ["RawDatasetLoc"];
                    break;
                case "DefineRequired":
                    field = ["StandardDatasetLoc", "StudyRelatedDocument", "DefineOutputType"];
                    break;
            }
            field.forEach(function (key) {
                thisobject.state.responseData.formData.find(x => x.attributeName === key).inputRequirementID = (result) ? 8 : 9;
                thisobject.state.responseData.formData.find(x => x.attributeName === key).inputRequirementText = (result) ? "Mandatory" : "Optional"
                thisobject.state.responseData.formData.find(x => x.attributeName === key).editable = (result) ? true : false;

                if (!result) {
                    thisObj.props.form.resetFields([key]);
                }
            });
        }

    }

    render() {
        const { visible, handleCancel } = this.props;
        const { getFieldDecorator, setFieldsValue, validateFields, resetFields } = this.props.form;
        const { responseData, current } = this.state;
        // const steps = DynamicForm(responseData.formData, responseData.wizardData, responseData.selectOptions, getFieldDecorator, setFieldsValue);
        return (
            <Modal
                visible={visible}
                title={"Update Study"}
                style={{ top: 20 }}
                onCancel={handleCancel}
                width={'80%'}
                maskClosable={false}
                footer={null}
            >
                <LayoutContentWrapper style={{padding:0}}>
                    {
                        Object.keys(responseData.formData).length > 0 && (
                            <WizardForm /*permissions={this.props.permissions}*/ property={this} getTitleFrFile={this.getTitleFrFile} switchfn={this.switchfn} props={this} responseData={responseData} handleCancel={handleCancel} handleReset={this.handleReset} setFieldsValue={setFieldsValue} getFieldDecorator={getFieldDecorator} validateFields={validateFields} saveCallBack={this.saveStudy} />)
                    }

                </LayoutContentWrapper>
            </Modal>
        );
    }
}

const WrappedApp = Form.create()(UpdateStudyModal);

export default WrappedApp;

