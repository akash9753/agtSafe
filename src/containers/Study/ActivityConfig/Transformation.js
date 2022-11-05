import React from 'react';
import { Form, Row, Col, Button, TreeSelect, Select, Divider } from 'antd';
import { rowStyle } from '../../../styles/JsStyles/CommonStyles';
import { getRules } from '../../Utility/htmlUtility';
import '../../Utility/browse.css';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import LayoutContent from '../../../components/utility/layoutContent';

import {
    errorModal,
    showProgress,
    hideProgress,
    getProjectRole,
    getStudyDetails,
    PostCallWithZone,
    successModalCallback
} from '../../Utility/sharedUtility';
import moment from 'moment-timezone';

const FormItem = Form.Item;
const splitClass = 12;
export const Fields = {
    StandardDatasetLoc: "StandardDatasetLoc",
    RawDatasetLoc: "RawDatasetLoc",
    MappingOutput: "MappingOutput"
};


const MappingOutputTypeField = {
    controlTypeText: "DropDownWithSearch",
    inputTypeText: "Alphanumeric",
    inputRequirementText: "Mandatory",
    inputTypeErrorMessage: "",
    validationErrorMessage: "",
    requirementErrorMessage: "Mapping Program Language should be selected",
    regExText: null,
    minValue: null,
    maxValue: null
};
const rawDatasetField = {
    controlTypeText: "FileSelect",
    inputTypeText: "ServerBrowse",
    inputRequirementText: "Mandatory",
    inputTypeErrorMessage: "",
    validationErrorMessage: "",
    requirementErrorMessage: "Raw Dataset Location should be selected",
    regExText: null,
    minValue: null,
    maxValue: null
};
const StandardizedDatasetLocationField = {
    controlTypeText: "FileSelect",
    inputTypeText: "ServerBrowse",
    inputRequirementText: "Mandatory",
    inputTypeErrorMessage: "",
    validationErrorMessage: "",
    requirementErrorMessage: "Output Standardized Dataset Location should be selected",
    regExText: null,
    minValue: null,
    maxValue: null
};


export function Transformation(props) {
 
    const { getFieldDecorator, getFieldsValue } = props.form;
    const { xptLocation, rawDatasetLocaton, updateData, workflowActivityStatusID } = props;

    let action = workflowActivityStatusID !== -1 ? "Details" : "Create";

    //get value
    let getValue = (field) => {
        let obj = updateData.find(va => va.configurationName === field && va.activityText === "Transformation");
        return obj ? obj.configurationValue : "";
    }

    //get Initial val
    //for placeholder not priniting issue
    let getInitialVal = (field) => {
        return action === "Details" ? { initialValue: getValue(field) } : {};
    }

    //create both Annotation and Mapping(if configured both activities)
    let create = () => {
        props.form.validateFields({ force: true }, (err, values) => {
            if (!err) {
                try {
                    const zones = moment.tz.guess();
                    let study = props.study;
                    let commonprops = Object.keys(values);
                    let actualData = [];

                    //Set values
                    commonprops.map(function (x) {
                        var data = {};
                        data.StudyID = study.studyID;
                        data.ConfigurationName = x;
                        data.ConfigurationValue = values[x];
                        data.ActivityID = 324;//"Transformation";
                        data.ProjectID = study.projectID;
                        data.StandardID = study.standardID;
                        data.StandardVersionID = study.standardVersionID;
                        data.Timezone = moment.tz(zones).zoneAbbr();
                        data.UpdatedBy = getProjectRole().userProfile.userID;
                        actualData.push(data);
                    });
                    //End

                    //Loader
                    showProgress();
                    PostCallWithZone('ActivityConfiguration/CreateActivityConfiguration', actualData).then(
                        function (response) {
                            hideProgress();
                            if (response.status === 0) {
                                errorModal(response.message);
                            } else {
                                successModalCallback(response.message, props.reload);
                            }
                        });
                }
                catch (e) {
                    hideProgress();
                    //console.log(e);
                }
            }
        });
    }


    return (
        <LayoutContent style={{ wordBreak: 'break-all' }}>
            <Form layout="vertical">
            <Row style={rowStyle}>
                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                    <FormItem label="Mapping Program Language">                                                                    {/* Mapping Output Type Field */}
                        {getFieldDecorator(Fields.MappingOutput,
                        {
                            rules: getRules(MappingOutputTypeField, props),
                            ...getInitialVal(Fields.MappingOutput)
                        })(
                            <Select
                                key={'MappingOutputType'}
                                mode="single"
                                placeholder="Please Select"
                                disabled={action === "Details" || props.isProjectInActive}

                                aria-name="Mapping Output Type"
                                style={{width:"100%"}}
                            >
                                <Select.Option name="Mapping Output Type SDTM_Select.Option" key={"1"}>
                                    Python
                                </Select.Option>
                                <Select.Option name="Mapping Output Type SDTM_Select.Option" key={"2"}>
                                    SAS
                                </Select.Option>
                            </Select>,
                        )}
                    </FormItem>

                </Col>
                <Col md={splitClass} sm={24} xs={24} >
                    <FormItem label="Raw Dataset Location">                                                   {/* Raw Dataset Location for SDTM Field */}
                            {getFieldDecorator(Fields.RawDatasetLoc, {
                            rules: getRules(rawDatasetField, props),
                            ...getInitialVal(Fields.RawDatasetLoc)
                        })(
                            <TreeSelect
                                tabIndex={0}
                                showSearch
                                autoBlur
                                mode="single"
                                allowClear
                                style={{ width: "100%" }}
                                disabled={action === "Details" || props.isProjectInActive}
                                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                                placeholder="Please Select"
                            >
                                {rawDatasetLocaton}
                            </TreeSelect>
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row style={rowStyle}>
                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                 
                    <FormItem label="Output Standardized Dataset Location">                                                                    {/* Standardized Dataset Field */}
                        {getFieldDecorator(Fields.StandardDatasetLoc, {
                            rules: getRules(StandardizedDatasetLocationField, props),
                            ...getInitialVal(Fields.StandardDatasetLoc)
                        })(
                            <TreeSelect
                                tabIndex={0}
                                showSearch
                                autoBlur
                                mode="single"
                                allowClear
                                style={{ width: "100%" }}
                                disabled={action === "Details" || props.isProjectInActive}
                                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                                placeholder="Please Select"
                            >
                                {xptLocation}
                            </TreeSelect>
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Divider style={{ margin: "10px 0px" }} />
            <Row style={{ width: "100%" }}>
                <Button
                    key="back"
                    name="PopupCancel"
                    className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }}
                    onClick={props.cancel}
                >
                    Cancel
            </Button>
            <Button
                key="submit"
                name="PopupConfirm"
                onClick={() => action === "Create" ? create() : props.cancel()}
                    style={{ float: "right" }}
                    disabled={props.isProjectInActive || props.study.locked}
                className='ant-btn sc-ifAKCX fcfmNQ ant-btn-primary'
            >
                {action === "Create" ? "Create" : "OK"}
           </Button>
                </Row>
            </Form>
        </LayoutContent>
    );
    
}