import React, { Component } from 'react';
import { Breadcrumb, Form, } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, PostCallWithZone, errorModal, successModal, showProgress, hideProgress } from '../Utility/sharedUtility';
import ConfirmModal from '../Utility/ConfirmModal';
import SingleForm from '../Utility/SingleForm';
let thisObj;
let selectedCodelistData = [];
let tergetUnits = [];

class UpdateUnitConfiguration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showEditModal: false,
            responseData: {
                formData: {},
                selectOptions: {}
            },
            unitConfigurationID: null,
            allValues: {},
            modalLoad: false,
        };
        thisObj = this;
        thisObj.getFormData();

    }

    getFormData = () => {
        if (typeof this.props.location.state != 'undefined') {
            let unitConfigurationID = this.props.location.state.UnitConfigurationID;
            CallServerPost('UnitConfiguration/GetUnitConfigurationFormData', { FormName: "UnitConfiguration", ActionName: "Update", ID: unitConfigurationID, Editable: this.props.location.state.readOnly }).then(
                function (response) {
                    const responseData = response.value;
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    }
                    else {
                        responseData.selectOptions.studyid = [];
                        let allStudy = responseData.studies.map(st => {
                            return ({
                                attributeName: "StudyID",
                                keyValue: st.studyID,
                                projectID: st.projectID,
                                literal: st.studyName,
                            })
                        })
                        let projectData = responseData.formData.filter(x => x.attributeName === "ProjectID" && x.defaultValue !== "");
                        if (projectData.length > 0) {
                            responseData.selectOptions.studyid = allStudy.filter(x => x.projectID === parseInt(projectData[0].defaultValue));
                        }
                        //codelistname
                        let codeListVersionData = responseData.formData.filter(x => x.attributeName === "CodeListVersion" && x.defaultValue !== "");
                        if (codeListVersionData.length > 0) {
                            thisObj.getNCICodeListData(codeListVersionData[0].defaultValue.toLocaleString(), responseData, false);
                            //targetunit
                            let codeListNameData = responseData.formData.filter(x => x.attributeName === "CodeListName" && x.defaultValue !== "");
                            if (codeListNameData.length > 0 && !onchange) {
                                thisObj.getTargetUnit(codeListNameData[0].defaultValue);
                            }
                            responseData.selectOptions.targetunit = tergetUnits;

                        }

                        thisObj.setState({ study: allStudy, responseData: responseData, unitConfigurationID: unitConfigurationID });

                    }

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

                        allCodelist = response.value.filter(x => x.group === true && x.codelistName.indexOf("Unit") !== -1).map(st => {
                            return ({
                                attributeName: "CodeListName",
                                keyValue: st.codelistName,
                                literal: st.cdiscSubmissionValue + '-' + st.codelistName + '-' + st.code
                            });
                        });
                    }
                    responseData.selectOptions.codelistname = allCodelist;
                    selectedCodelistData = response.value;
                   
                    thisObj.setState({ responseData: responseData, selectedCodelistData: response.value });
                }

            }).catch(error => error);

    }

    handleChangeReason = (ChangeReason) => {

        const thisObj = this;
        let values = thisObj.state.allValues;

        const { unitConfigurationID } = this.state;

        thisObj.setState({ modalLoad: true });

        values["UnitConfigurationID"] = unitConfigurationID;
        values["ChangeReason"] = ChangeReason;
        values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;

        PostCallWithZone('UnitConfiguration/Update', values)
            .then(
                function (response) {
                    if (response.status == 1) {
                        thisObj.setState({ showEditModal: false, modalLoad: false });

                        successModal(response.message, thisObj.props, "/trans/unitConfiguration");
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
            pathname: '/trans/UnitConfiguration'
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

    codeListVersionOnChange = (codelistVersion) => {
        let { responseData } = this.state;
        tergetUnits = [];
        selectedCodelistData = [];
        responseData.selectOptions.codelistname = [];
        responseData.selectOptions.targetunit = [];
        this.props.form.setFieldsValue({ "CodeListName": null, "TargetUnit": null });
        if (codelistVersion !== undefined && codelistVersion !== null) {
            thisObj.getNCICodeListData(codelistVersion.toLocaleString(), responseData);
        }
        thisObj.setState({ responseData });
    }
    getTargetUnit = (codelistName) => {

        let allTargetUnit = [];
        if (codelistName !== undefined && codelistName !== null) {
            allTargetUnit = selectedCodelistData.filter(x => x.codelistName === codelistName.toLocaleString()).map(st => {
                return ({
                    attributeName: "TargetUnit",
                    keyValue: st.cdiscSubmissionValue,
                    literal: st.cdiscSubmissionValue + '-' + st.codelistName
                });
            });
        }
        tergetUnits = allTargetUnit;
    }

    codeListNameOnChange = (codelistName) =>
    {
        let { responseData } = this.state;

        if (codelistName && codelistName != "")
        {
            responseData.selectOptions.targetunit = [];
            thisObj.props.form.setFieldsValue({ "TargetUnit": null });
            thisObj.getTargetUnit(codelistName);
            responseData.selectOptions.targetunit = tergetUnits;
            thisObj.setState({ responseData });
        }
        else
        {
            responseData.selectOptions.targetunit = [];
            thisObj.props.form.setFieldsValue({ "TargetUnit": null });
            thisObj.setState({ responseData });
        }
    }

    render() {
        const { responseData } = this.state;
        const { getFieldDecorator, setFieldsValue } = this.props.form;

        return (
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-wrench" />
                        <span> Unit Configuration</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Edit
                    </Breadcrumb.Item>
                </Breadcrumb>

                {Object.keys(responseData.formData).length > 0 &&
                    <SingleForm dependencyDropDownFn={{ ProjectID: this.projectOnChange, CodeListVersion: this.codeListVersionOnChange, CodeListName: this.codeListNameOnChange }} props={this} Editable={this.props.location.state.readOnly} property={this} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.cancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleUpdate} />
                }
                <ConfirmModal loading={this.state.modalLoad} title="Update Unit Configuration" SubmitButtonName="Update" onSubmit={this.handleChangeReason} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(UpdateUnitConfiguration);

export default WrappedApp;