import React, { useState } from 'react';
import { Form, Row, Input, Col, Icon, Tooltip, TreeSelect, Switch, Button, Divider, Select, message } from 'antd';
import { rowStyle } from '../../../styles/JsStyles/CommonStyles';
import { getRules } from '../../Utility/htmlUtility';
import '../../Utility/browse.css';
import LayoutContent from '../../../components/utility/layoutContent';
import {
    errorModal,
    showProgress,
    hideProgress,
    getProjectRole,
    successModalCallback,
    PostCallWithZoneForDomainCreate,
} from '../../Utility/sharedUtility';
import moment from 'moment-timezone';
import MetaDatasetConfiguration from "./MetaDatasetConfig";
import { ANNOTATION, METADATA_ANNOT, CRF_ANNOT, TRANSFORMATION } from '../../Utility/appConstants';
import {
    ColumnField,
    AnnotFields,
    MappingFields,
    MetaDataset,
    annotateSwitch,
    MetaDatasetPageField,
    rawDatasetField,
    MappingOutputTypeField,
    StandardizedDatasetLocationField,
} from "./MetaDataConfigPageField";

const { SHOW_PARENT } = TreeSelect;

const FormItem = Form.Item;
const splitClass = 12;


export function Annotation(props) {

    const { getFieldDecorator } = props.form;
    const { study,
            status,
            pdfFiles,
            updateData,
            xptLocation,
            rawDatasetLocaton,
            annotationWorkFlows,
            fileRawDatasetSelect,
            transFormationWorkFlows,
           } = props;
    const workflowActivityStatusID = props.study.workflowActivityStatusID;
    const [ShowMetaDataConfig, setShowMetaDataConfig] = useState(false);
    const [MetaDatasetConfig, setMetaDatasetConfig] = useState({});

    ///For RawDatset treeselect 
    //if we choose only one or two file inside the folder instead of choosing whole folder means store the Folder name
    const [RawDatsetFolderName, setRawDatsetFolderName] = useState("");
    let action = ((study.annotationRequired && status.Annot.id !== -1) ||
                  (study.mappingRequried && status.Trans.id !== -1)) ? "Details" : "Create";

    const crfDocumentField =
    {
        controlTypeText: "FileSelect",
        inputTypeText: "ServerBrowse",
        inputRequirementText: props.study.annotationTypeText === CRF_ANNOT || study.defineRequired ? "Mandatory" : "Optional",
        inputTypeErrorMessage: "",
        validationErrorMessage: "",
        requirementErrorMessage: "CRF Document should be selected",
        regExText: null,
        minValue: null,
        maxValue: null
    };
   //get value
    let getValue = (fieldName, Activity) => {
        let obj = updateData.find(va => va.configurationName === fieldName && va.activityText === Activity);
        return obj ? obj.configurationValue : "";
    }
    //get Initial val
    //for placeholder not priniting issue
    let getInitialVal = (fieldName,Activity) =>
    {
        return action === "Details" ? { initialValue: getValue(fieldName, Activity) } : {};
    }

    //create  both Annotation and Mapping(if configured both activities)
    let create = () =>
    {
        const { mappingRequried, annotationRequired, annotationTypeText } = study;

        let field = [];
        annotationRequired && field.push(...Object.keys(AnnotFields));
        mappingRequried && field.push(...Object.keys(MappingFields));

        props.form.validateFields(field, { force: true }, (err, values) =>
        {
            if (!err)
            {
                try
                {
                    if ("RawDatasetLoc" in values && "StandardDatasetLoc" in values &&  values["RawDatasetLoc"] != "" && values["StandardDatasetLoc"] != "" && values["RawDatasetLoc"] == values["StandardDatasetLoc"]) {
                        message.destroy();
                        message.error('Raw Dataset and Output Standardized Dataset Location cannot be same!');
                        return;

                    } 
                    values = annotationTypeText === METADATA_ANNOT ? { ...values, ...MetaDatasetConfig } : values;
                    const zones = moment.tz.guess();
                    let study = props.study;
                    let commonprops = Object.keys(values);
                    let actualData = [];

                    //Set values
                    commonprops.map(function (x)
                    {
                        var data = {};
                        data.StudyID = study.studyID;
                        data.ConfigurationName = x;

                        if (x === "RawDatasetLoc")
                        {
                            //have to send parent folder name to ConfigurationValue
                            //have to send selected file in folder send to 
                            data.ConfigurationValue = RawDatsetFolderName;
                            data.ConfigurationFiles = values[x];

                        } else if (x === "AnnotationRequired") {
                            data.ConfigurationValue = values[x] === "" ? "false" : values[x];

                        } else {
                            data.ConfigurationValue = values[x];

                        }

                        //Differ Annotation and Transformation
                        //If Annotation send ActivityID = 323 else 324
                        let AnnotField = ["MetaDataset", "AnnotationRequired", "CRFDocument", ...MetaDatasetPageField.map((fld) => fld.attributeName),
                            ...ColumnField.map((fld) => fld.attributeName)];

                        data.ActivityID = AnnotField.indexOf(x) !== -1 ? 323 : 324; // 323 : //"Annotation" 324:"Transformation";
                        data.StandardID = study.standardID;
                        data.ProjectID = study.projectID;
                        data.StandardVersionID = study.standardVersionID;
                        data.Timezone = moment.tz(zones).zoneAbbr();
                        data.UpdatedBy = getProjectRole().userProfile.userID;
                        actualData.push(data);
                    });
                    //End

                    //Loader
                    showProgress();
                    PostCallWithZoneForDomainCreate('ActivityConfiguration/CreateActivityConfiguration', actualData).then(
                        function (response) {
                            hideProgress();
                            if (response.status === 0)
                            {
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

    //setSourceDataset
    let setMetaDataset = (metadataset_Config,value) =>
    {
        setMetaDatasetConfig(metadataset_Config);
        setShowMetaDataConfig(false);
        //let SrcData = sourcedataset_val.map(x => x.)
        props.form.setFieldsValue({ "MetaDataset": value })
    }

   let rawdatasetOnChange = (valObj,fileNameObj,node) => {
       let treeNode = node.triggerNode;
       if (treeNode) {
           let parent = treeNode.props.parent;
           setRawDatsetFolderName(parent);
       }
    }

    let OnStandardTreeChange = (value) => {
        props.form.setFieldsValue({ StandardDatasetLocation: value })
        
    }
    return <LayoutContent style={{ wordBreak: 'break-all' }}>
        <Form layout="vertical">
            {props.study.annotationRequired &&
                <>
                    <Row style={rowStyle} >
                        <Col md={12} sm={24} xs={24} style={{ padding: "0px 10px 0px 0px" ,display:"none"}}>
                            <FormItem colon={false} label="Do you want to annotate?" key={"annotateSwitchItem"}>               {/* Annotate the document Field */}
                            {getFieldDecorator(AnnotFields.AnnotationRequired, {
                                    valuePropName: 'checked',
                                rules: getRules(annotateSwitch, props),
                                //initialValue: action === "Details" ? !(getValue(AnnotFields.AnnotationRequired, ANNOTATION) === "" ||
                                //    getValue(AnnotFields.AnnotationRequired, ANNOTATION) === "false") : false
                                initialValue:true
                                })(
                                    <Switch
                                        checkedChildren="Yes"
                                        unCheckedChildren="No"

                                        disabled={action === "Details" || props.isProjectInActive}
                                        key={'annotateSwitch'}
                                        name="AnnotateSwitch"
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col md={12} sm={24} xs={24} style={{ padding: 0 }}>
                            <FormItem label="CRF Document">                                                                    {/* CRF Document Field */}
                            {getFieldDecorator(AnnotFields.CRFDocument, {
                                    rules: getRules(crfDocumentField, props),
                                ...getInitialVal(AnnotFields.CRFDocument,ANNOTATION)
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
                    {study.annotationTypeText == METADATA_ANNOT && <Col md={12} sm={24} xs={24} style={{ padding: 0 }}>
                        <FormItem label="MetaData Configuration">                                                                    {/* CRF Document Field */}
                            <Input.Group compact>
                                {getFieldDecorator(AnnotFields.MetaDataset, {
                                    rules: getRules(MetaDataset, props),
                                    ...getInitialVal(AnnotFields.MetaDataset,ANNOTATION)
                            })(
                                    <Input
                                        disabled={true}

                                        style={{ width: 'calc(100% - 55px)' }}
                                    />
                                    
                            )}
                                <Tooltip>
                                    <Button id="metadataConfigBtn"
                                        onClick={() => setShowMetaDataConfig(true)}
                                    >
                                        <i className="fa fa-cog" />
                                    </Button>
                                </Tooltip>
                            </Input.Group>
                        </FormItem>
                    </Col>}
                    </Row>
                    <Divider style={{ margin: "10px 0" }} />
                </>
            }
            {props.study.mappingRequried &&
                <>
                    <Row style={rowStyle}>
                        <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                            <FormItem label="Mapping Program Language">                                                                    {/* Mapping Output Type Field */}
                                {getFieldDecorator(MappingFields.MappingOutput,
                                    {
                                        rules: getRules(MappingOutputTypeField, props),
                                        ...getInitialVal(MappingFields.MappingOutput,TRANSFORMATION)
                                    })(
                                        <Select
                                            key={'MappingOutputType'}
                                            mode="single"
                                            placeholder="Please Select"
                                            disabled={action === "Details" || props.isProjectInActive}

                                            aria-name="Mapping Output Type"
                                            style={{ width: "100%" }}
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
                            <FormItem label="Raw Dataset">                                                   {/* Raw Dataset Location for SDTM Field */}
                            {getFieldDecorator(MappingFields.RawDatasetLoc, {
                                    rules: getRules(rawDatasetField, props),
                                ...getInitialVal(MappingFields.RawDatasetLoc, TRANSFORMATION)
                                })(
                                    <TreeSelect
                                        tabIndex={0}
                                        showSearch
                                        autoBlur
                                        allowClear
                                        treeCheckable={false}
                                        multiple={false}
                                        mode="single"
                                        style={{ width: "100%" }}
                                        showCheckedStrategy={SHOW_PARENT}
                                        disabled={action === "Details" || props.isProjectInActive}
                                        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                                        placeholder="Please Select"
                                        onChange={rawdatasetOnChange}
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
                            {getFieldDecorator(MappingFields.StandardDatasetLoc, {
                                    rules: getRules(StandardizedDatasetLocationField, props),
                                ...getInitialVal(MappingFields.StandardDatasetLoc,TRANSFORMATION)
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
                                        onChange={OnStandardTreeChange}
                                    >
                                        {xptLocation}
                                    </TreeSelect>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Divider style={{ margin: "10px 0px" }} />
                </>
            }
            {action === "Create" &&
                <Row style={{ width: "100%" }}>

                    <Button
                        key="submit"
                        name="PopupConfirm"
                        onClick={() => create()}
                        style={{ float: "right" }}
                        disabled={props.isProjectInActive || props.study.locked}
                        className='ant-btn sc-ifAKCX fcfmNQ ant-btn-primary'
                    >
                        {"Create"}
                    </Button>
                </Row>
            }
            
        </Form>
        {ShowMetaDataConfig &&
            <MetaDatasetConfiguration
                action={action}
                form={props.form}
                updateData={updateData}
                Show={ShowMetaDataConfig}
                FileList={fileRawDatasetSelect}
                setMetaDataset={setMetaDataset}
                MetaDatasetConfig={MetaDatasetConfig}
                Cancel={() => setShowMetaDataConfig(false)}
            />}
    </LayoutContent>


}