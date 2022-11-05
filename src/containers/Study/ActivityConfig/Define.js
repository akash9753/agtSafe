import React from 'react';
import { Form, Row, Col, Button, TreeSelect, Select, Divider } from 'antd';
import { rowStyle } from '../../../styles/JsStyles/CommonStyles';
import { getRules } from '../../Utility/htmlUtility';
import '../../Utility/browse.css';
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
import { ANNOTATION, DEFINE } from '../../Utility/appConstants';

const FormItem = Form.Item;
const splitClass = 12;

//Field Creation
export const Fields = {
    StandardDatasetLoc: "StandardDatasetLoc", 
    DefineOutputType: "DefineOutputType",
    CRFDocument:"CRFDocument"
};
const crfDocumentField =
{
    controlTypeText: "FileSelect",
    inputTypeText: "ServerBrowse",
    inputRequirementText:  "Mandatory",
    inputTypeErrorMessage: "",
    validationErrorMessage: "",
    requirementErrorMessage: "CRF Document should be selected",
    regExText: null,
    minValue: null,
    maxValue: null
};
const DefineOutputTypeField =
{
    controlTypeText: "DropDownWithSearch",
    inputTypeText: "Alphanumeric",
    inputRequirementText: "Mandatory",
    inputTypeErrorMessage: "",
    validationErrorMessage: "",
    requirementErrorMessage: "Define Output Type should be selected",
    regExText: null,
    minValue: null,
    maxValue: null
};

const StandardizedDatasetLocationField =
{
    controlTypeText: "FileSelect",
    inputTypeText: "ServerBrowse",
    inputRequirementText: "Mandatory",
    inputTypeErrorMessage: "",
    validationErrorMessage: "",
    requirementErrorMessage: "Standardized Dataset Location should be selected",
    regExText: null,
    minValue: null,
    maxValue: null
};

export function DefineGeneration(props) {

    const { getFieldDecorator, getFieldsValue } = props.form;
    const { pdfFiles,
            xptLocation,
            defineOutputTypeDropDown,
            updateData,
            status,
            study,
            ActivityConfigStatusDetailsList
    } = props;


    let action = status.Define.id !== -1 ? "Details" : "Create";
    const workflowActivityStatusID = study.workflowActivityStatusID;


    //create
    let create = () =>
    {

        let fld = ["StandardDatasetLoc", "DefineOutputType"];
        //if !study.annotationRequired
        !study.annotationRequired && fld.push("CRFDocument");

        props.form.validateFields(fld,{ force: true }, (err, values) =>
        {
            if (!err) {
                    try {
                        //Set values
                        const zones = moment.tz.guess();
                        let study = props.study;
                        let commonprops = Object.keys(values);
                        let actualData = [];
                        commonprops.map(function (x) {
                            var data = {};
                            data.StudyID = study.studyID;
                            data.ConfigurationName = x;
                            data.ConfigurationValue = values[x];
                            data.ActivityID = x == "CRFDocument" ? 323 : 325;//325 -"Define"; 323 - Annot
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

    //get value
    let getValue = (field,activity) => {
        let obj = updateData.find(va => va.configurationName === field && va.activityText === activity);
        return obj ? obj.configurationValue : "";
    }
    //get Initial val
    //for placeholder not priniting issue
    let getInitialVal = (field,Activity) => {
        if (field === "StandardDatasetLoc")
        {
            return (action === "Create" || (study.mappingRequried && status.Trans.id !== -1)) ?
                {
                    initialValue: getValue(field, "Transformation")
                } :
                action === "Details" ?
                    { initialValue: getValue(field, Activity) } :
                {};
        }
        return action === "Details" ?
            {
                initialValue: getValue(field, Activity)
        } : {};
    }

    //Diable define until transformation to inprogress
    let transformationWFS = (ActivityConfigStatusDetailsList || []).find(sta => sta.workflowActivityID === 3);
    let defineWFS = (ActivityConfigStatusDetailsList || []).find(sta => sta.workflowActivityID === 4);
    return (
            <LayoutContent style={{ wordBreak: 'break-all' }}>
            <Form layout="vertical">
                <Row style={rowStyle}>
                    {!study.annotationRequired && <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                        <FormItem label="CRF Document">                                                                    {/* CRF Document Field */}
                            {getFieldDecorator(Fields.CRFDocument, {
                                rules: getRules(crfDocumentField, props),
                                ...getInitialVal(Fields.CRFDocument, ANNOTATION)
                            })(
                                <TreeSelect
                                    tabIndex={0}
                                    showSearch
                                    autoBlur
                                    mode="single"
                                    allowClear
                                    style={{ width: "100%" }}
                                    placeholder="Please Select"
                                    disabled={action === "Details" || props.isProjectInActive}
                                    dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}

                                >
                                    {pdfFiles}
                                </TreeSelect>
                            )}
                        </FormItem>
                    </Col>
                    }
                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                    <FormItem label="Define Output Type">                                                                    {/* Define Output Type Field */}
                        {getFieldDecorator(Fields.DefineOutputType, {
                            rules: getRules(DefineOutputTypeField, props),
                            ...getInitialVal(Fields.DefineOutputType, DEFINE)
                        })(

                            <Select
                                key={'DefineOutputType'}
                                mode="single"
                                disabled={action === "Details" || props.isProjectInActive}
                                aria-name="Define Output Type"
                                style={{ width: "100%" }}
                                placeholder="Please Select"

                            >
                                {(defineOutputTypeDropDown || []).map(function (option) {
                                    return (
                                        <Select.Option name="Define Output Type SDTM_Option" key={option['productcontrolledTermID']}>
                                            {option['shortValue']}
                                        </Select.Option>
                                    )
                                })}
                            </Select>,
                        )}
                    </FormItem>
                </Col>

                    <Col md={splitClass} sm={24} xs={24} className={study.mappingRequried ? "dependencyoftransformationdrop" : "nodependency"}>
                    <FormItem label="Standardized Dataset Location">                                                                    {/* Standardized Dataset Field */}
                        {getFieldDecorator(Fields.StandardDatasetLoc, {
                            rules: getRules(StandardizedDatasetLocationField, props),
                            ...getInitialVal(Fields.StandardDatasetLoc,DEFINE)
                        })(
                            <TreeSelect
                                tabIndex={0}
                                showSearch
                                autoBlur
                                mode="single"
                                allowClear
                                disabled={action === "Details" || props.isProjectInActive || study.mappingRequried}
                                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                                style={{ width: "100%" }}
                                placeholder="Please Select"
                            >
                                {xptLocation}
                            </TreeSelect>
                        )}
                    </FormItem>
                </Col>
            </Row>
                <Divider style={{ margin: "10px 0" }} />
                {action === "Create" &&
                    <Row style={{ width: "100%" }}>

                        <Button
                            key="submit"
                            name="PopupConfirm"
                            onClick={() => create() }
                            style={{ float: "right" }}
                            disabled={props.isProjectInActive || props.study.locked || (study.mappingRequried && status.Trans.id === -1)}
                            className='ant-btn sc-ifAKCX fcfmNQ ant-btn-primary'
                        >
                            {"Create"}
                        </Button>
                    </Row>
                }

                
            </Form>
        </LayoutContent>
    );

}