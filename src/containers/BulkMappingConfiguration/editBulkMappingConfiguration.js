import React, { Component } from 'react';
import { Breadcrumb, Form, } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, PostCallWithZone, errorModal, successModal, showProgress, hideProgress } from '../Utility/sharedUtility';
import ConfirmModal from '../Utility/ConfirmModal';
import SingleForm from '../Utility/SingleForm';

let thisObj;
let selectedCodelistData = [];
let tergetValues = [];
class UpdateBulkMappingConfiguration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showEditModal: false,
            responseData: {
                formData: {},
                selectOptions: {}
            },
            bulkMappingConfigurationID: null,
            allValues: {},
            modalLoad: false,
            targetVariables: [],
            targetDomains: []
        };
        thisObj = this;
        thisObj.getFormData();

    }
    getFormData = () => {
        if (typeof this.props.location.state != 'undefined') {
            showProgress();
            let bulkMappingConfigurationID = this.props.location.state.bulkMappingConfigurationID;
            CallServerPost('BulkMappingConfiguration/GetBulkMappingConfigFormData', { FormName: "BulkMappingConfiguration", ActionName: "Update", ID: bulkMappingConfigurationID, Editable: this.props.location.state.readOnly }).then(
                function (response) {
                    const responseData = response.value;
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    }
                    else {
                        responseData.selectOptions.studyid = [];
                        //codelistname
                        let codeListVersionData = responseData.formData.filter(x => x.attributeName === "CodeListVersion" && x.defaultValue !== "");
                        if (codeListVersionData.length > 0) {
                            thisObj.getNCICodeListData(codeListVersionData[0].defaultValue.toLocaleString(), responseData, false);
                        }
                        else {
                            hideProgress();
                        }
                        let allStudy = responseData.studies.map(st => {
                            return ({
                                attributeName: "StudyID",
                                keyValue: st.studyID,
                                projectID: st.projectID,
                                literal: st.studyName,
                            })
                        })
                        //study
                        let projectData = responseData.formData.filter(x => x.attributeName === "ProjectID" && x.defaultValue !== "");
                        if (projectData.length > 0) {
                            responseData.selectOptions.studyid = allStudy.filter(x => x.projectID === parseInt(projectData[0].defaultValue));
                        }
                        //targetVar
                        let targetDomainData = responseData.formData.filter(x => x.attributeName === "TargetDomain" && x.defaultValue !== "");
                        if (targetDomainData.length > 0) {
                            responseData.selectOptions.targetvariable = responseData.targetVariables.filter(x => x.parentKeyValue === targetDomainData[0].defaultValue);
                        }

                        thisObj.setState({ study: allStudy, responseData: responseData, bulkMappingConfigurationID: bulkMappingConfigurationID });

                    }
                    //hideProgress();
                }).catch(error => error);

        }
    }

    getNCICodeListData = (codelistVersion, responseData, onchange) => {
        showProgress();
        CallServerPost('BulkMappingConfiguration/GetNCICodelistDataForBulkMappingConfig', { CodeListVersion: codelistVersion }).then(
            function (response) {
                hideProgress();
                if (response.status == 0) {
                    errorModal(response.message);
                } else {
                    let allCodelist;
                    if (response.value.length > 0) {

                        allCodelist = response.value.filter(x => x.group === true).map(st => {
                            return ({
                                attributeName: "CodeListName",
                                keyValue: st.codelistName,
                                literal: st.cdiscSubmissionValue + '-' + st.codelistName + '-' + st.code
                            });
                        });
                    }
                    responseData.selectOptions.codelistname = allCodelist;
                    selectedCodelistData = response.value;
                    //targetval
                    let codeListNameData = responseData.formData.filter(x => x.attributeName === "CodeListName" && x.defaultValue !== "");
                    if (codeListNameData.length > 0 && !onchange) {
                        thisObj.getTargetData(codeListNameData[0].defaultValue);                       
                    }
                    responseData.selectOptions.targetvalue = tergetValues;
                    responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeID = 124;
                    responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeText = "DropDownWithSearch";
                    thisObj.setState({ responseData: responseData, selectedCodelistData: response.value });
                }

            }).catch(error => error);

    }
    handleChangeReason = (ChangeReason) => {

        const thisObj = this;
        let values = thisObj.state.allValues;

        const { bulkMappingConfigurationID } = thisObj.state;

        thisObj.setState({ modalLoad: true });

        values["BulkMappingConfigurationID"] = bulkMappingConfigurationID;
        values["ChangeReason"] = ChangeReason;
        values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;

        PostCallWithZone('BulkMappingConfiguration/Update', values)
            .then(
                function (response) {
                    if (response.status == 1) {
                        thisObj.setState({ showEditModal: false, modalLoad: false });

                        successModal(response.message, thisObj.props, "/trans/BulkMappingConfig");
                    } else {
                        thisObj.setState({ modalLoad: false });

                        errorModal(response.message);
                    }
                }).catch(error => error);

    }

    handleUpdate = () => {
        const thisObj = this;
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                thisObj.setState({ showEditModal: true, allValues: values });
            }
        });
    }


    cancel = () => {

        this.props.history.push({
            pathname: '/trans/BulkMappingConfig'
        }
        );
    }

    handleCancel = () => {
        this.setState({ showEditModal: false });
        this.props.form.resetFields(['Change Reason']);

    }

    //Losd study based on selected project
    projectOnChange = (value) => {
        let { study, responseData } = this.state;
        this.props.form.setFieldsValue({ "StudyID": null });
        responseData.selectOptions.studyid = [];
        responseData.selectOptions.studyid = study.filter(sty => sty.projectID === parseInt(value));
        thisObj.setState({ responseData: responseData });
    }


    //Load targetVariables based on selected targetdomain
    targetDomainOnChange = (targetDomain) => {
        let { responseData } = this.state;
        const { setFieldsValue } = this.props.form;
        setFieldsValue({ "TargetVariable": null });
        responseData.selectOptions.targetvariable = [];
        if (targetDomain !== undefined && targetDomain !== null) {
            responseData.selectOptions.targetvariable = responseData.targetVariables.filter(tv => tv.parentKeyValue === targetDomain.toLocaleString());
        }
        thisObj.setState({ responseData: responseData });
    }

    codeListVersionOnChange = (codelistVersion) => {
        let { responseData } = this.state;
        tergetValues = [];
        selectedCodelistData = [];
        responseData.selectOptions.codelistname = [];
        responseData.selectOptions.targetvalue = [];
        this.props.form.setFieldsValue({ "CodeListName": null, "TargetValue": null });
        responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeID = 342;
        responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeText = "AutoComplete";
        if (codelistVersion !== undefined && codelistVersion !== null) {
            thisObj.getNCICodeListData(codelistVersion.toLocaleString(), responseData, true);
        }
        thisObj.setState({ responseData });
    }

    getTargetData = (codelistName) => {

        let allTargetValue = [];
        if (codelistName !== undefined && codelistName !== null) {
            allTargetValue = selectedCodelistData.filter(x => x.codelistName === codelistName.toLocaleString()).map(st => {
                return ({
                    attributeName: "TargetValue",
                    keyValue: st.cdiscSubmissionValue,
                    literal: st.cdiscSubmissionValue + '-' + st.codelistName
                });
            });
        }
        tergetValues = allTargetValue;
    }

    codeListNameOnChange = (codelistName) => {
        let { responseData } = this.state;
        responseData.selectOptions.targetvalue = [];
        thisObj.props.form.setFieldsValue({ "TargetValue": null });
        thisObj.getTargetData(codelistName, responseData);
        responseData.selectOptions.targetvalue = tergetValues;
        if (codelistName !== undefined && codelistName !== null) {
            responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeID = 124;
            responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeText = "DropDownWithSearch";
        } else {
            if (this.props.form.getFieldValue('CodeListVersion') !== undefined && this.props.form.getFieldValue('CodeListVersion') !== null) {
                responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeID = 124;
                responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeText = "DropDownWithSearch";
            } else {
                responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeID = 342;
                responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeText = "AutoComplete";
            }
        }

        thisObj.setState({ responseData });
    }


    render() {
        const { responseData } = this.state;
        const { getFieldDecorator, setFieldsValue } = this.props.form;

        return (
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-cubes" />
                        <span> Bulk Mapping Configuration</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Edit
                    </Breadcrumb.Item>
                </Breadcrumb>

                {Object.keys(responseData.formData).length > 0 &&
                    <SingleForm props={this} dependencyDropDownFn={{ ProjectID: this.projectOnChange, TargetDomainID: this.targetDomainOnChange }} Editable={this.props.location.state.readOnly} property={this} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.cancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleUpdate} />
                }
                <ConfirmModal loading={this.state.modalLoad} title="Update Bulk Mapping Configuration" SubmitButtonName="Update" onSubmit={this.handleChangeReason} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(UpdateBulkMappingConfiguration);

export default WrappedApp;