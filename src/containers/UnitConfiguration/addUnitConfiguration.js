import React, { Component } from 'react';
import { Breadcrumb, Form } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, errorModal, successModal, getProjectRole, showProgress, hideProgress } from '../Utility/sharedUtility';
import SingleForm from '../Utility/SingleForm';

const projectRole = getProjectRole();
let thisObj;
class AddUnitConfiguration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editForm: false,
            responseData: {
                formData: {},
                selectOptions: {}
            },
        };

        thisObj = this;
        CallServerPost('UnitConfiguration/GetUnitConfigurationFormData', { FormName: "UnitConfiguration", ActionName: "Create" }).then(
            function (response) {

                const responseData = response.value;
                if (responseData.status == 0) {
                    errorModal(responseData.message);
                } else {
                    responseData.selectOptions.studyid = [];
                    let allStudy = [];
                    if (responseData.studies.length > 0) {
                        allStudy = responseData.studies.map(st => {
                            return ({
                                attributeName: "StudyID",
                                keyValue: st.studyID,
                                projectID: st.projectID,
                                literal: st.studyName,
                            })
                        })

                        let projectData = responseData.formData.filter(x => x.attributeName === "ProjectID" && x.defaultValue !== "");

                    }

                    thisObj.setState({ study: allStudy, responseData: responseData });
                }

            }).catch(error => error);

    }

    cancel = () => {

        this.props.history.push({
            pathname: '/trans/UnitConfiguration'
        }
        );
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const thisObj = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values["TimeZone"] = "IST";
                values["UpdatedBy"] = projectRole.userProfile.userID;
                showProgress();
                CallServerPost('UnitConfiguration/Create', values)
                    .then(
                        function (response) {
                            hideProgress();
                            if (response.status == 1) {
                                successModal(response.message, thisObj.props, "/trans/UnitConfiguration");
                            }
                            else {
                                errorModal(response.message);
                            }
                        }).catch(error => error);
            }
        });
    }

    //Load study based on selected project
    projectOnChange = (value) => {
        let { study, responseData } = this.state;
        const { setFieldsValue } = this.props.form;
        responseData.selectOptions.studyid = [];
        setFieldsValue({ "StudyID": null });
        responseData.selectOptions.studyid = study.filter(sty => sty.projectID === parseInt(value));
        thisObj.setState({ responseData: responseData });
    }

    codeListVersionOnChange = (codelistVersion) => {
        let { responseData } = this.state;
        responseData.selectOptions.codelistname = [];
        responseData.selectOptions.targetunit = [];
        this.props.form.setFieldsValue({ "CodeListName": null, "TargetUnit": null });
        if (codelistVersion !== undefined && codelistVersion !== null) {
            showProgress();
            CallServerPost('BulkMappingConfiguration/GetNCICodelistDataForBulkMappingConfig', { CodeListVersion: codelistVersion.toLocaleString() }).then(
                function (response) {

                    if (response.status == 0) {
                        errorModal(response.message);
                    } else {
                        let allCodelist;
                        if (response.value.length > 0) {

                            allCodelist = response.value.filter(x => x.group === true && x.codelistName.indexOf("Unit") !== -1).map(st => {
                                return ({
                                    attributeName: "CodeListName",
                                    keyValue: st.codelistName,
                                    literal: st.cdiscSubmissionValue + '-' + st.codelistName + '-' + st.code
                                });
                            });
                        }
                        responseData.selectOptions.codelistname = allCodelist;
                        thisObj.setState({ responseData: responseData, selectedCodelistData: response.value });
                    }
                    hideProgress();
                }).catch(error => error);
        }
    }

    handleClear = () => {
        let { responseData } = this.state;
        responseData.selectOptions.codelistname = [];
        responseData.selectOptions.targetunit = [];
        responseData.selectOptions.study = [];
        responseData.selectOptions.studyid = [];
        thisObj.setState({
            responseData: responseData
        });
    }

    codeListNameOnChange = (codelistName) => {
        let { responseData, selectedCodelistData } = this.state;
        this.props.form.resetFields(["TargetUnit"]);
        responseData.selectOptions.targetunit = [];
        if (codelistName !== undefined && codelistName !== null) {
            let allTargetValue;
            allTargetValue = selectedCodelistData.filter(x => x.codelistName === codelistName.toLocaleString()).map(st => {
                return ({
                    attributeName: "TargetUnit",
                    keyValue: st.cdiscSubmissionValue,
                    literal: st.cdiscSubmissionValue + '-' + st.codelistName
                });
            });
            responseData.selectOptions.targetunit = allTargetValue;
        }

        thisObj.setState({ responseData: responseData });
    }

    render() {

        const { responseData } = this.state;
        const { getFieldDecorator, setFieldsValue } = this.props.form;

        return (
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-wrench" />
                        <span> Unit Configuration </span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Add
                    </Breadcrumb.Item>
                </Breadcrumb>

                {Object.keys(responseData.formData).length > 0 &&
                    <SingleForm isCreate={true} property={this} props={this} dependencyDropDownFn={{ ProjectID: this.projectOnChange, CodeListVersion: this.codeListVersionOnChange, CodeListName: this.codeListNameOnChange }} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.cancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleSubmit} handleClear={this.handleClear} />
                }
            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(AddUnitConfiguration);

export default WrappedApp;