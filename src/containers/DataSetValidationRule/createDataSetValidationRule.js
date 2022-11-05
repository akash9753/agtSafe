import React, { Component } from 'react';
import { Breadcrumb, Icon, Col, Row, Select, Form } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import Button from '../../components/uielements/button';
import { CallServerPost, errorModal, successModal, getProjectRole } from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import SingleForm from '../Utility/SingleForm';
import ConfirmModal from '../Utility/ConfirmModal';

const projectRole = getProjectRole();

class AddDataSetValidationRule extends Component {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            editForm: false,
            responseData: {
                formData: {},
                selectOptions: {},
               
            },
            dataSetValidationRuleID: this.props.location.state.DataSetValidationRuleID,
            actionName: this.props.location.state.ActionName,
            showConfirmationPop: false,
            allValues: null,
            modalLoad:false
        };

        const thisObj = this;
        CallServerPost('DataSetValidationRule/GetFormFieldAttributeFormData', { FormName: "DataSetValidationRule", ActionName: thisObj.props.location.state.ActionName, ID: thisObj.props.location.state.DataSetValidationRuleID, Editable: thisObj.props.location.state.readOnly }).then(
            function (response) {

                const responseData = response.value;
                if (responseData.status == 0) {
                    thisObj.setState({ responseData: response.value, loading: false });
                } else {
                    thisObj.setState({ responseData: responseData });
                }

            }).catch(error => error);
    }

    cancel = () => {

        this.props.history.push({
            pathname: '/trans/DataSetValidationRule'
        }
        );
    }
    

    handleSubmit = (e) => {
        e.preventDefault();
        const thisObj = this;
        
            thisObj.props.form.validateFields((err, values) => {
                if (!err) {
                    values.CDISCDataStdDomainClassID = values.CDISCDataStdDomainClassID.toString();
                    values.CDISCDataStdDomainMetadataID = values.CDISCDataStdDomainMetadataID.toString();
                    values.RuleApplicableLevel = values.RuleApplicableLevel.toString();

                    if (thisObj.state.actionName == "Update") {
                        const thisObj = this;
                        thisObj.setState({ showConfirmationPop: true, modalLoad: false, allValues: values });
                    } else {
                        var url = "DataSetValidationRule/Create";
                        this.fnToCreateAndUpdate(url, values);
                    }
                }
            });       
    }

    handleUpdate = (ChangeReason) => {
        var url = "DataSetValidationRule/Update";
        let values = this.state.allValues;
        values["ChangeReason"] = ChangeReason;
        values["DataSetValidationRuleID"] = this.state.dataSetValidationRuleID;
        values["UpdatedDateTimeText"] = this.state.responseData.updatedDateTimeText;

        this.fnToCreateAndUpdate(url, values);
    }
    fnToCreateAndUpdate = (url,values) => {
        const thisObj = this;
        thisObj.setState({ modalLoad: true });

                values["TimeZone"] = "IST";
                values["UpdatedBy"] = projectRole.userProfile.userID;
                CallServerPost(url, values)
                    .then(
                    function (response) {
                        thisObj.setState({ showConfirmationPop: false, modalLoad: false });

                            if (response.status == 1) {
                                successModal(response.message, thisObj.props, "/trans/DataSetValidationRule");
                            } else {
                                errorModal(response.message);
                            }
                        }).catch(error => error);
            }
     

    handleCancel = () => {
        this.setState({ showConfirmationPop: false });
        this.props.form.resetFields(['Change Reason']);

    }
    render() {

        const { responseData, dataSetValidationRuleID } = this.state;
        const { getFieldDecorator, setFieldsValue } = this.props.form;

        return (
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-sliders-h" />
                        <span> Dataset Validation Rule</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {dataSetValidationRuleID > 0 ? "Edit" : "Add"}
                    </Breadcrumb.Item>
                </Breadcrumb>

                {Object.keys(responseData.formData).length > 0 &&
                    <SingleForm Editable={dataSetValidationRuleID > 0 ? false : this.props.location.state.readOnly} isCreate={dataSetValidationRuleID > 0 ? false : true}  props={this} property={this} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.cancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleSubmit} />
                }
                <ConfirmModal loading={this.state.modalLoad} title="Update Role" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showConfirmationPop} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />

            </LayoutContentWrapper>
        );
    }
}


const WrappedApp = Form.create()(AddDataSetValidationRule);
export default WrappedApp;
