import React, { Component } from 'react';
import { Breadcrumb, Form } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, errorModal, successModal, getProjectRole, getTimeZone, showProgress, hideProgress } from '../Utility/sharedUtility';
import SingleForm from '../Utility/SingleForm';

const projectRole = getProjectRole();
let thisObj;
class AddBulkMappingConfiguration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editForm: false,
            responseData: {
                formData: {},
                selectOptions: {}
            },
            targetVariables: [],
            targetDomains: [],
            selectedCodelistData: []
        };
        thisObj = this;
        thisObj.getFormData();
    }

    getFormData = () => {
        showProgress();
        CallServerPost('BulkMappingConfiguration/GetBulkMappingConfigFormData', { FormName: "BulkMappingConfiguration", ActionName: "Create" }).then(
            function (response) {
                const responseData = response.value;
                if (responseData.status == 0) {
                    errorModal(responseData.message);
                } else {
                    responseData.selectOptions.studyid = [];
                    responseData.selectOptions.targetvariable = [];
                    let allStudy = [];
                    if (responseData.studies.length > 0) {
                        allStudy = responseData.studies.map(st => {
                            return ({
                                attributeName: "StudyID",
                                keyValue: st.studyID,
                                projectID: st.projectID,
                                literal: st.studyName,
                            })
                        });
                    }

                    thisObj.setState({ study: allStudy, responseData: responseData });
                }
                hideProgress();
            }).catch(error => error);

    }

    cancel = () => {

        this.props.history.push({
            pathname: '/trans/BulkMappingConfig'
        }
        );
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const thisObj = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values["TimeZone"] = getTimeZone();
                values["UpdatedBy"] = projectRole.userProfile.userID;
                CallServerPost('BulkMappingConfiguration/Create', values)
                    .then(
                        function (response) {
                            if (response.status == 1) {
                                successModal(response.message, thisObj.props, "/trans/BulkMappingConfig");
                            } else {
                                errorModal(response.message);
                            }
                        }).catch(error => error);
            }
        });
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
        this.props.form.setFieldsValue({ "TargetVariable": null });
        responseData.selectOptions.targetvariable = [];
        if (targetDomain !== undefined && targetDomain !== null) {
            responseData.selectOptions.targetvariable = responseData.targetVariables.filter(tv => tv.parentKeyValue === targetDomain.toLocaleString());
        }
        thisObj.setState({ responseData: responseData });
    }

    codeListVersionOnChange = (codelistVersion) => {
        let { responseData } = this.state;
        responseData.selectOptions.codelistname = [];
        responseData.selectOptions.targetvalue = [];
        this.props.form.setFieldsValue({ "CodeListName": null, "TargetValue": null });
        responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeID = 342;
        responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeText = "AutoComplete";
        if (codelistVersion !== undefined && codelistVersion !== null) {
            showProgress();
            CallServerPost('BulkMappingConfiguration/GetNCICodelistDataForBulkMappingConfig', { CodeListVersion: codelistVersion.toLocaleString() }).then(
                function (response) {
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
                        responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeID = 124;
                        responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeText = "DropDownWithSearch";
                        responseData.selectOptions.codelistname = allCodelist;                        
                        thisObj.setState({ responseData: responseData, selectedCodelistData: response.value });
                    }                    
                    hideProgress();
                }).catch(error => error);
        }
    }

    codeListNameOnChange = (codelistName) => {
        let { responseData, selectedCodelistData } = this.state;
        this.props.form.setFieldsValue({ "TargetValue": null });
        responseData.selectOptions.targetvalue = [];
        if (codelistName !== undefined && codelistName !== null) {
            let allTargetValue;
            allTargetValue = selectedCodelistData.filter(x => x.codelistName === codelistName.toLocaleString()).map(st => {
                return ({
                    attributeName: "TargetValue",
                    keyValue: st.cdiscSubmissionValue,
                    literal: st.cdiscSubmissionValue + '-' + st.codelistName
                });
            });
            responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeID = 124;
            responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeText = "DropDownWithSearch";
            responseData.selectOptions.targetvalue = allTargetValue;
        } else {
            if (this.props.form.getFieldValue('CodeListVersion') !== undefined && this.props.form.getFieldValue('CodeListVersion') !== null) {
                responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeID = 124;
                responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeText = "DropDownWithSearch";
            } else {
                responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeID = 342;
                responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeText = "AutoComplete";
            }
        }
        thisObj.setState({ responseData: responseData });
    }

    handleClear = () => {
        let { responseData } = this.state;
        responseData.selectOptions.codelistname = [];
        responseData.selectOptions.targetvalue = [];
        responseData.selectOptions.targetvariable = [];
        responseData.selectOptions.study = [];
        responseData.selectOptions.studyid = [];
        responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeID = 342;
        responseData.formData.filter(x => x.attributeName == "TargetValue")[0].controlTypeText = "AutoComplete";
        thisObj.setState({
            responseData: responseData
        });
    }

    render() {

        const { responseData } = this.state;
        const { getFieldDecorator, setFieldsValue } = this.props.form;

        return (
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-cubes" />
                        <span> Bulk Mapping Configuration </span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Add
                    </Breadcrumb.Item>
                </Breadcrumb>

                {Object.keys(responseData.formData).length > 0 &&
                    <SingleForm isCreate={true} props={this} property={this} dependencyDropDownFn={{ ProjectID: this.projectOnChange, TargetDomainID: this.targetDomainOnChange, CodeListVersion: this.codeListVersionOnChange, CodeListName: this.codeListNameOnChange }} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.cancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleSubmit} loadTargetVariable={this.loadTargetVariable} handleClear={this.handleClear} />
                }
            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(AddBulkMappingConfiguration);

export default WrappedApp;