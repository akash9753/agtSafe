import React from 'react';
import { Modal, Row, Col, Form, Input, Select, TreeSelect, Button, Divider } from 'antd';
import LayoutContent from '../../components/utility/layoutContent';
import { getRules } from '../Utility/htmlUtility';
import {
    validJSON,
    errorModal,
    showProgress,
    hideProgress,
    getProjectRole,
    CallServerPost,
    PostCallWithZone,
    successModalCallback
} from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import moment from 'moment-timezone';
import { errorMessageTooltip } from '../Utility/errorMessageUtility.js';

const TreeNode = TreeSelect.TreeNode;

const splitClass = 12;

const Fields = {
    ProjectID: 'ProjectID',
    ProtocolName: 'ProtocolName',
    SponsorName: 'SponsorName',
    ProtocolDocument: 'ProtocolDocument',
    StudyName: 'StudyName',
    StandardID: 'StandardID',
    StudyCode: 'StudyCode',
    StandardVersionID: 'StandardVersionID',
    CodelistVersionID: 'CodelistVersionID',
    AnnotationType: 'AnnotationType',
    StudyDescription: 'StudyDescription',
    Activitie: "Activities"
};

const projectNameField = {
    controlTypeText: "TextBox",
    inputTypeText: "Alphanumeric",
    inputRequirementText: "Optional",
    requirementErrorMessage: "Project Name is mandatory",
    inputTypeErrorMessage: "Project Name should contain only alphanumeric values",
    validationErrorMessage: "Project Name should be between 2-255 characters",
    regExText: "/^[a-zA-Z0-9-_]+$/",
    minValue: 2,
    maxValue: 255
};
const protocolNameField = {
    controlTypeText: "TextBox",
    inputTypeText: "Alphanumeric",
    inputRequirementText: "Mandatory",
    requirementErrorMessage: "Protocol Name is mandatory",
    inputTypeErrorMessage: "Protocol Name should contain only alphanumeric values",
    validationErrorMessage: "Protocol Name should be between 2-255 characters",
    regExText: "/^(?!.*  )[A-Za-z0-9 ]+$/",
    minValue: 2,
    maxValue: 255
};

const sponsorNameField = {
    controlTypeText: "TextBox",
    inputTypeText: "Alphanumeric",
    inputRequirementText: "Optional",
    inputTypeErrorMessage: "Sponsor Name should contain only alphanumeric values and special characters(._-)",
    validationErrorMessage: "Sponsor Name should be between 2-100 characters",
    requirementErrorMessage: "Sponsor Name is mandatory",
    regExText: "/^(?!.*  )[a-zA-Z0-9-_\. ]+$/",
    minValue: 2,
    maxValue: 100
};

const protocolDocumentField = {
    controlTypeText: "FileSelect",
    inputTypeText: "ServerBrowse",
    inputRequirementText: "Optional",
    inputTypeErrorMessage: "",
    validationErrorMessage: "",
    requirementErrorMessage: "Protocol Document should be selected",
    regExText: null,
    minValue: null,
    maxValue: null
};

const studyNameField = {
    attributeName: "StudyName",
    controlTypeText: "TextBox",
    inputTypeText: "Alphanumeric",
    inputRequirementText: "Mandatory",
    inputTypeErrorMessage: "Study Name should contain only alphanumeric values and underscore",
    validationErrorMessage: "Study Name should be between 2-20 characters",
    requirementErrorMessage: "Study Name is mandatory",
    regExText: "/^[a-zA-Z0-9_]*$/",
    minValue: 2,
    maxValue: 20
};

const standardNameField = {
    controlTypeText: "MultipleDropdown",
    inputTypeText: "Alphanumeric",
    inputRequirementText: "Mandatory",
    inputTypeErrorMessage: "",
    validationErrorMessage: "",
    requirementErrorMessage: "Standard Name should be selected",
    regExText: null,
    minValue: null,
    maxValue: null
};

let Activitie = {
    controlTypeText: "MultipleDropdown",
    inputTypeText: "Alphanumeric",
    inputRequirementText: "Mandatory",
    inputTypeErrorMessage: "",
    validationErrorMessage: "",
    requirementErrorMessage: "Activities should be selected",
    regExText: null,
    minValue: null,
    maxValue: null
};
const studyCodeField = {
    controlTypeText: "TextBox",
    inputTypeText: "Alphanumeric",
    inputRequirementText: "Optional",
    inputTypeErrorMessage: "Study Code should contain only alphanumeric values",
    validationErrorMessage: "Study Code should be between 2-20 characters",
    requirementErrorMessage: "",
    regExText: "/^(?!.*  )[A-Za-z0-9 ]+$/",
    minValue: 2,
    maxValue: 20
};



const studyDescriptionField = {
    controlTypeText: "TextBox",
    inputTypeText: "Alphanumeric",
    inputRequirementText: "Optional",
    inputTypeErrorMessage: "Study Description should contain only alphanumeric values",
    validationErrorMessage: "Study Description should be between 2-255 characters",
    requirementErrorMessage: "",
    regExText: "/^(?!.*  )[A-Za-z0-9 ]+$/",
    minValue: 2,
    maxValue: 255
};

let thisObj = {};
class Create extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            CDISCStandards: -1,
            codeList: [],
            stdVersionOptions: [],
            sendCodeLists: [],
            adamCodeLists: [],
            sdtmCodeLists: [],
            activityOptions: [],
            standardOptions: [],
            omopVersionOptions: [],
            sendVersionOptions: [],
            adamVersionOptions: [],
            sdtmVersionOptions: [],
            annotationType: [],
            annotationTypeCRF:[],
            stateVisible: true,
            studyData: "Not Loaded",
        }

        //have to set Activitie Field to Mandatory if StandardName field have some values
        Activitie.inputRequirementText = "Optional";

        this.initStudyCreateForm();
        thisObj = this;
    }

    initStudyCreateForm = () => {
        const thisObj = this;
        showProgress();
        CallServerPost('Study/GetValuesForCreateStudy',
            {
                FormName: "Study",
                ActionName: "Create",
                ProjectID: this.props.projectId
            }).then(
                function (response) {
                    hideProgress();
                    if (response.status === 0) {
                        errorModal(response.message);
                    }
                    else {
                        const studyData = response.value;
                        var sdtm = 1;
                        var adam = 2;
                        var send = 10;
                        for (var i = 0; i < studyData.cDISCDataStandards.length; i++) {
                            if (studyData.cDISCDataStandards[i].standardName.toLowerCase().includes('sdtm')) {
                                sdtm = studyData.cDISCDataStandards[i].cdiscDataStandardID;
                            } else if (studyData.cDISCDataStandards[i].standardName.toLowerCase().includes('adam')) {
                                adam = studyData.cDISCDataStandards[i].cdiscDataStandardID;
                            } else if (studyData.cDISCDataStandards[i].standardName.toLowerCase().includes('send')) {
                                send = studyData.cDISCDataStandards[i].cdiscDataStandardID;
                            }
                        }

                        const standardOptions = studyData["cDISCDataStandards"].map(function (option) {

                            return (
                                <Select.Option name="Standard Name_Option" key={option['cdiscDataStandardID']}>
                                    {option['standardName']}
                                </Select.Option>
                            );

                        });;
                        const treeLoop = (data, folderOnly) =>
                            data.map(item => {
                                if (item.children) {
                                    return (
                                        <TreeNode selectable={folderOnly && item.folder} key={item.key} value={item.key} title={item.title}>
                                            {treeLoop(item.children, folderOnly)}
                                        </TreeNode>
                                    );
                                }
                                else {
                                    var selectable = true;
                                    if (folderOnly && !item.folder) {
                                        selectable = false;
                                    }
                                    return <TreeNode selectable={selectable} key={item.key} value={item.key} title={item.title} />;
                                }
                            });

                        const protocolDocumentData = treeLoop([studyData["DocumentsTree"].pdfLocation], false);

                        const sdtmVersionOptions = studyData["cDISCDataStdVersions"].map(function (option) {
                            if (option['cdiscDataStandardID'] === 1) {
                                return (
                                    <Select.Option name="SDTM Standard Version_Option" key={option['cdiscDataStdVersionID']}>
                                        {option['stdVersionName']}
                                    </Select.Option>
                                );
                            }

                        });

                        const adamVersionOptions = studyData["cDISCDataStdVersions"].map(function (option) {
                            if (option['cdiscDataStandardID'] === 2) {
                                return (
                                    <Select.Option name="ADAM Standard Version_Option" key={option['cdiscDataStdVersionID']}>
                                        {option['stdVersionName']}
                                    </Select.Option>
                                );
                            }

                        });



                        const sendVersionOptions = studyData["cDISCDataStdVersions"].map(function (option) {
                            if (option['cdiscDataStandardID'] === 3) {
                                return (
                                    <Select.Option name="SEND Standard Version_Option" key={option['cdiscDataStdVersionID']}>
                                        {option['stdVersionName']}
                                    </Select.Option>
                                );
                            }

                        });

                        const omopVersionOptions = studyData["cDISCDataStdVersions"].map(function (option) {
                            if (option['cdiscDataStandardID'] === 4) {
                                return (
                                    <Select.Option name="ADAM Standard Version_Option" key={option['cdiscDataStdVersionID']}>
                                        {option['stdVersionName']}
                                    </Select.Option>
                                );
                            }

                        });

                        const sdtmCodeLists = studyData["nCICodeLists"].map(function (option) {
                            if (option['cdiscDataStandardID'] === 1) {
                                return (
                                    <Select.Option name="SDTM CodeList Version_Option" key={option['nciCodeListID']}>
                                        {option['codeListVersion']}
                                    </Select.Option>
                                );
                            }

                        });

                        //values for Annotation Type DDL
                        const annotationTypeCRF = studyData["annotationType"].map(function (option) {
                            if (option['longValue'] == "CRF Annotation") {
                                return (

                                    <Select.Option name="AnnotaionType_Option" key={option['productcontrolledTermID']}>
                                        {option['longValue']}
                                    </Select.Option>
                                );
                            }
                        });

                        const annotationType = studyData["annotationType"].map(function (option) {
                            return (
                                <Select.Option name="AnnotaionType_Option" key={option['productcontrolledTermID']}>
                                    {option['longValue']}
                                </Select.Option>
                            );
                        });

                        const adamCodeLists = studyData["nCICodeLists"].map(function (option) {
                            if (option['cdiscDataStandardID'] === 2) {
                                return (
                                    <Select.Option name="ADAM CodeList Version_Option" key={option['nciCodeListID']}>
                                        {option['codeListVersion']}
                                    </Select.Option>
                                );
                            }

                        });
                        const sendCodeLists = studyData["nCICodeLists"].map(function (option) {
                            if (option['cdiscDataStandardID'] === 3) {
                                return (
                                    <Select.Option name="SEND CodeList Version_Option" key={option['nciCodeListID']}>
                                        {option['codeListVersion']}
                                    </Select.Option>
                                );
                            }

                        });

                        thisObj.setState({
                            studyData: studyData,
                            sdtmStandardID: sdtm,
                            adamStandardID: adam,
                            sendStandardID: send,
                            sendCodeLists: sendCodeLists,
                            adamCodeLists: adamCodeLists,
                            sdtmCodeLists: sdtmCodeLists,
                            omopVersionOptions: omopVersionOptions,
                            sendVersionOptions: sendVersionOptions,
                            adamVersionOptions: adamVersionOptions,
                            sdtmVersionOptions: sdtmVersionOptions,
                            protocolDocumentData: protocolDocumentData,
                            standardOptions: standardOptions,
                            annotationType: annotationType,
                            annotationTypeCRF: annotationTypeCRF
                        });
                    }

                }).catch(error => error);
    }

 

    //Standard on change
    onStandardNameChange = (value, option) => {
        let {
            sdtmCodeLists,
            adamCodeLists,
            sendCodeLists,
            sdtmVersionOptions,
            adamVersionOptions,
            sendVersionOptions,
            omopVersionOptions
        } = this.state;


        let resetfield = [
            Fields.CodelistVersionID,
            Fields.StandardVersionID,

        ];

        //filter activity option based on CDISC Standards
        let activityOptions = [];

        let ddl = {
            codeList: [],
            stdVersions: []
        };

        switch (value)
        {
            case -1 :
            case "":
            {
                    activityOptions = [];
                    //have to set Activitie Field to Mandatory if StandardName field have some values
                    Activitie.inputRequirementText = "Optional";
                    this.props.form.resetFields(["Activities"]);
            }
            
            break;
            //SDTM
            case "1":
            default:
                {
                    activityOptions = ["Annotation", "Transformation", "Define XML"].map(option => {
                        return <Select.Option
                            name="Standard Name_Option"
                            key={option === "Define XML" ? "Define" : option}
                                  >
                            {option}
                        </Select.Option>
                    });

                    ddl = {
                        codeList: sdtmCodeLists,
                        stdVersions: sdtmVersionOptions
                    }
                    //have to set Activitie Field to Mandatory if StandardName field have some values
                    Activitie.inputRequirementText = "Mandatory";

                    this.props.form.resetFields(["Activities"]);
                }
                break;
            //ADAM
            case "2": {
                activityOptions = ["Transformation", "Define XML"].map(option => {
                    return <Select.Option
                        name="Standard Name_Option"
                        key={option === "Define XML" ? "Define" : option}
                    >
                        {option}
                    </Select.Option>
                });
                ddl = {
                    codeList: adamCodeLists,
                    stdVersions: adamVersionOptions
                }
                //have to set Activitie Field to Mandatory if StandardName field have some values
                Activitie.inputRequirementText = "Mandatory";
                this.props.form.setFieldsValue({ Activities: [] });
            }
                break;
            //SEND
            case "3":
                {
                    activityOptions = ["Transformation", "Define XML"].map(option => {
                        return <Select.Option
                            name="Standard Name_Option"
                            key={option === "Define XML" ? "Define" : option }
                        >
                            {option}
                        </Select.Option>
                    });
                    ddl = {
                        codeList: sendCodeLists,
                        stdVersions: sendVersionOptions
                    }
                    //have to set Activitie Field to Mandatory if StandardName field have some values
                    Activitie.inputRequirementText = "Mandatory";
                    this.props.form.setFieldsValue({ Activities: [] });
                }
                break;
            // OMOP
            case "4":
                {
                    activityOptions = ["Transformation"].map(option => {
                        return <Select.Option
                            name="Standard Name_Option"
                            key={option}
                        >
                            {option}
                        </Select.Option>
                    });
                    ddl = {
                        stdVersions: omopVersionOptions
                    }
                    //have to set Activitie Field to Mandatory if StandardName field have some values
                    Activitie.inputRequirementText = "Mandatory";
                    this.props.form.setFieldsValue({ Activities: [] });
                }
                break;
           
        }

        this.props.form.resetFields(resetfield);
               
        this.setState({
            ...ddl,
            CDISCStandards: value,
            activityOptions: activityOptions,
        })
    }

    //Activities onCHange
    onActivitiesChange = (value, option) =>
    {

        if (!value.some(va => va === "Annotation"))
        {
            thisObj.props.form.resetFields([Fields.AnnotationType]);
        }
    }

    //set values    
    getInt = (value) => {
        var rv = parseInt(value);
        if (isNaN(rv)) {
            return 0;
        }
        return rv;
    }

    setValues = (values) => {

        let { project } = this.state.studyData;
        const projectRole = getProjectRole();
        const zones = moment.tz.guess();
        const timezone = moment.tz(zones).zoneAbbr();
        let updatedBy = projectRole.userProfile.userID;
        values.ProjectID = project.projectID;
        values.Locked = false;
        values.StudyStatusID = 138;
        values.TimeZone = timezone;
        values.UpdatedBy = updatedBy;
        values.AnnotationType = parseInt(values.AnnotationType);
        // values.Activities = values.Activities;


        //set CDISC Standards
        //switch (values.StandardID)
        //{
        //    //SDTM
        //    case "1":
        //            values.SDTMEnabled = true;
        //        break;
        //    //ADAM
        //    case "2":
        //            values.ADAMEnabled = true;
        //        break
        //    //SEND
        //    case "3":
        //            values.SENDEnabled = true;
        //        break;
        //    case "4":

        //            values.OMOPEnabled = true;
        //        break;
        //}

        values.StandardVersionID = this.getInt(values.StandardVersionID);
        values.CodelistVersionID = this.getInt(values.CodelistVersionID);

        return values;
    }

    //Create Function
    create = () =>
    {
        showProgress();
        const thisObj = this;
        thisObj.props.form.validateFields((err, values) =>
        {
            if (!err)
            {
                try
                {
                    values.AnnotationType = values.AnnotationType ? values.AnnotationType : -1;
                    showProgress();
                    values = this.setValues(values);
                    CallServerPost('Study/CreateStudy', values).then(
                        function (response)
                        {
                            hideProgress();
                            if (response.status === 0)
                            {
                                errorModal(response.message);
                            } else {
                                successModalCallback(response.message, thisObj.reload);
                            }
                        });
                }
                catch (e)
                {
                    hideProgress();
                    //console.log(e);
                }
            }
            else
            {
                hideProgress();
            }
        });
    }

    reload = () =>
    {
        thisObj.setState({stateVisible :false})
        thisObj.props.studyListRefresh();

    }
    handleClear = () => {
        var thisObj = this;
        thisObj.props.form.resetFields();
        thisObj.onStandardNameChange(-1);
    }
    changeEvent = (rule, value, callback) =>
    {
     
        if (!value.some(va => va === "Annotation"))
        {
            //Activitie.inputRequirementText = "Optional";
            thisObj.props.form.resetFields([Fields.AnnotationType]);
            callback();
            return;
        } 
        callback();
        return;
    }

    componentDidUpdate() {
        errorMessageTooltip(this.props);
    }

    render() {
        const { props } = this;
        let { stateVisible } = this.state;
        const { visible, handleCancel, projectName } = props;
        const { getFieldDecorator } = props.form;

        const {
            codeList,
            stdVersions,
            studyData,
            CDISCStandards,
            activityOptions,
            standardOptions,
            protocolDocumentData,
            annotationType,
            annotationTypeCRF
        } = this.state;

        let ActivitiesField = this.props.form.getFieldValue("Activities");
        let isAnnot = ActivitiesField && ActivitiesField.indexOf('Annotation') !== -1;
        const project = studyData["project"];

        const standardVersion = {
            controlTypeText: "DropDownWithSearch",
            inputTypeText: "Alphanumeric",
            inputRequirementText: CDISCStandards !== -1 ? "Mandatory" : "Optional",
            inputTypeErrorMessage: "",
            validationErrorMessage: "",
            requirementErrorMessage: "Standard Version should be selected",
            regExText: null,
            minValue: null,
            maxValue: null
        };

        const codeListVersion = {
            controlTypeText: "DropDownWithSearch",
            inputTypeText: "Alphanumeric",
            inputRequirementText: ((CDISCStandards !== -1 && CDISCStandards !== "4")) ? "Mandatory" : "Optional",
            inputTypeErrorMessage: "",
            validationErrorMessage: "",
            requirementErrorMessage: "CodeList Version should be selected",
            regExText: null,
            minValue: null,
            maxValue: null
        };

        const annotationTypes = {
            controlTypeText: "DropDownWithSearch",
            inputTypeText: "Alphanumeric",
            inputRequirementText: ((CDISCStandards === 2 && CDISCStandards === 3) || isAnnot) ? "Mandatory" : "Optional",
            inputTypeErrorMessage: "",
            validationErrorMessage: "",
            requirementErrorMessage: "Annotation Type should be selected",
            regExText: null,
            minValue: null,
            maxValue: null
        };

        let thisObj = this;
        return <>
            {
                studyData !== "Not Loaded" &&
                <Modal
                    className={ "studyModal"}
                    visible={visible && stateVisible}
                    title={"Create Study"}
                    style={{ top: 20, minHeight: 'calc(100vh - 100px)' }}
                    onCancel={handleCancel}
                    width={'80%'}
                    maskClosable={false}
                    footer={[
                        <Button
                            key="back"
                            name="PopupCancel"
                            className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }}
                            onClick={handleCancel}
                        >
                            Cancel
                            </Button>,

                        <Button name="Clear" onClick={() => this.handleClear()} style={{ marginLeft: 8, textAlign: 'left', float: 'left' }} type="default" >
                            Clear
                           </Button>,

                        <Button
                            key="submit"
                            name="PopupConfirm"
                            className='ant-btn sc-ifAKCX fcfmNQ ant-btn-primary'
                            onClick={() => this.create()}>
                            Create
                        </Button>,
                    ]}
                >
                    <React.Fragment>
                        <Form layout="vertical">
                        <Row style={rowStyle} justify="space-between">
                            <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                                <Form.Item label="Project Name" key={"ProjectIDItem"}>               {/* Project Name Field */}
                                    {getFieldDecorator(Fields.ProjectID, {
                                        rules: getRules(projectNameField, props),
                                        initialValue: project ? project.projectName : ""
                                    })(
                                        <Input
                                            placeholder="Project Name"
                                            disabled
                                        />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                                <Form.Item label="Protocol Name" key={"protocolNameItem"}>                                    {/* Protocol Name Field */}
                                    {getFieldDecorator(Fields.ProtocolName, {
                                        rules: getRules(protocolNameField, props),
                                        initialValue: ''
                                    })(
                                        <Input
                                            placeholder="Protocol Name"
                                        />,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row style={rowStyle} justify="space-between">
                            <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                                <Form.Item label="Sponsor Name" key={"SponsorNameItem"}>               {/* Sponsor Name Field */}
                                    {getFieldDecorator(Fields.SponsorName, {
                                        rules: getRules(sponsorNameField, props),
                                        initialValue: project ? project.sponsorName : ""
                                    })(
                                        <Input
                                            disabled
                                        />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                                <Form.Item label="Protocol Document" key={"ProtocolDocumentItem"}>                                   {/* Protocol Document Field */}
                                    {getFieldDecorator(Fields.ProtocolDocument, {
                                        rules: getRules(protocolDocumentField, props),
                                    })(
                                        <TreeSelect
                                            style={{
                                                width: "100%"
                                            }}
                                            tabIndex={0}
                                            showSearch
                                            autoBlur
                                            mode="single"
                                            allowClear
                                            dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                                            placeholder="Please Select"
                                        >
                                            {protocolDocumentData}
                                        </TreeSelect>,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row style={rowStyle} justify="space-between">
                            <Col md={6} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <Form.Item label="Study Name" key={"StudyNameItem"}>                     {/* Study Name Field */}
                                    {getFieldDecorator(Fields.StudyName, {
                                        rules: getRules(studyNameField, { studyData: studyData }),
                                        initialValue: ''
                                    })(
                                        <Input
                                            placeholder="Study Name"
                                        />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col md={6} sm={6} xs={6} style={{ paddingRight: "10px" }}>
                                <Form.Item label="Study Code" key={"StudyCodeItem"}>                                          {/* Study Code Field */}
                                    {getFieldDecorator(Fields.StudyCode, {
                                        rules: getRules(studyCodeField, props),
                                        initialValue: ''
                                    })(
                                        <Input
                                            placeholder="Study Code"
                                        />,
                                    )}
                                </Form.Item>
                                </Col>
                                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                                    <Form.Item label="Study Description" key={"StudyDescriptionItem"}>              {/* Study Description Field */}
                                        {getFieldDecorator(Fields.StudyDescription, {
                                            rules: getRules(studyDescriptionField, props),
                                            initialValue: ''
                                        })(
                                            <Input
                                                placeholder={"Study Description"}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                        </Row>
                        <Row style={rowStyle} justify="space-between">
                            
                                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                                    <Form.Item label="Standard Name" key={"StandardNameItem"}>              {/* Standard Name Field */}
                                        {getFieldDecorator(Fields.StandardID, {
                                            rules: getRules(standardNameField, props),
                                            initialValue: ""
                                        })(
                                            <Select
                                                style={{ width: "100%" }}
                                                placeholder="Please select"
                                                onChange={this.onStandardNameChange}
                                                aria-name="Standard Name"
                                            >
                                                <Select.Option value={""}>--Select--</Select.Option>
                                                {standardOptions}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                                    <Form.Item label="Activities" key={"Activitie"}>
                                        {getFieldDecorator(Fields.Activitie, {
                                            rules: [{
                                                required: Activitie.inputRequirementText === "Mandatory" ? true : false,
                                                message: "Activities should be selected"
                                            }                                        
                                            ],
                                            initialValue: []
                                        })(
                                            <Select
                                                mode="multiple"
                                                style={{ width: "100%" }}
                                                placeholder="Please Select"
                                                aria-name="Test Name"
                                                onChange={this.onActivitiesChange}
                                            >
                                                {activityOptions}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                           
                        </Row>
                        <Row style={rowStyle} justify="space-between">
                                

                                <Col md={6} sm={12} xs={12} style={{
                                    paddingRight: "10px",
                                    display: CDISCStandards === -1 || CDISCStandards === "" ? "none" : "block"
                                }}>
                                    <Form.Item
                                        label="Standard Version"
                                        key={"StandardVersion"}
                                    >             {/*Standard Version Field */}
                                        {getFieldDecorator(Fields.StandardVersionID, {
                                            rules: getRules(standardVersion, props),
                                            initialValue: ""
                                        })(
                                            <Select
                                                style={{ width: "100%" }}
                                                mode="single"
                                                aria-name="Standard Version"
                                            >
                                                <Select.Option value={""}>--Select--</Select.Option>
                                                {stdVersions}
                                            </Select>,
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col md={6} sm={12} xs={12}
                                    style={{
                                        paddingRight: "10px",
                                        display: (CDISCStandards === -1 || CDISCStandards === "4" || CDISCStandards === "") ? "none" : "block"
                                    }}>
                                    <Form.Item label="CodeList Version" key={"codeListVersion"}>             {/*CodeList Version Field */}
                                        {getFieldDecorator(Fields.CodelistVersionID, {
                                            rules: getRules(codeListVersion, props),
                                            initialValue: ""
                                        })(
                                            <Select
                                                style={{ width: "100%" }}
                                                mode="single"
                                                aria-name="CodeList Version"
                                            >
                                                <Select.Option value={""}>--Select--</Select.Option>
                                                {codeList}
                                            </Select>,
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col md={splitClass} sm={24} xs={24}
                                    style={{
                                        paddingRight: "10px",
                                        display: thisObj.props.form.getFieldValue("Activities").indexOf('Annotation') === -1 ? "none" : "block"
                                    }} >
                                    <Form.Item label="Annotation Type" key={"AnnotationType"}>                     {/* Study Name Field */}
                                        {getFieldDecorator(Fields.AnnotationType, {
                                            rules: getRules(annotationTypes, props),
                                            initialValue: ''
                                        })(
                                            <Select
                                                style={{ width: "100%" }}
                                                mode="single"
                                                aria-name="Annotaion Type"
                                            >
                                                <Select.Option value={""}>--Select--</Select.Option>
                                                {thisObj.props.form.getFieldValue("Activities").indexOf("Transformation") === -1 ? annotationTypeCRF : annotationType}
                                            </Select>,
                                        )}
                                    </Form.Item>
                                </Col>
                             </Row>
                        </Form>
                    </React.Fragment>
                </Modal>
            }
        </>
    }

}

const WrappedApp = Form.create()(Create);

export default WrappedApp;