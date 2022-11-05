import React, { Component } from 'react';
import { CallServerPost, errorModal, successModalCallback, PostCallWithZone, successModal, getProjectRole, showProgress, hideProgress } from '../Utility/sharedUtility';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { Form, Modal, Steps, Row, Col, Spin, Icon, Input, TreeSelect } from 'antd';
import Button from '../../components/uielements/button';
import StepsStyleWrapper from '../Utility/wizardStyles';
import moment from 'moment-timezone';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import { Step1, Step1Fields } from './createStudyStep1';
import { Step2, Step2Fields } from './createStudyStep2';
import { Step3, Step3Fields } from './createStudyStep3';
import { Step4, Step4Fields } from './createStudyStep4';
import { Step5, Step5Fields } from './createStudyStep5';
import { Step6, Step6Fields } from './createStudyStep6';
import { OMOPStep, OMOPFields } from './OMOPStep';
import StudyRelDoc from './studyRelDoc';
import { errorMessageTooltip } from '../Utility/errorMessageUtility.js';

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
const { Step } = Steps;
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
const SDTM = 'SDTM';
const ADAM = 'ADAM';
const SEND = 'SEND';
var thisObj = "";
const emptyDoc = { FileLocation: '', Title: '', DocumentTypeID: '', DocumentType: '', DestinationType: '' };
class CreateNewStudyModal extends Component {
   constructor(props) {
       super(props);
       this.state = {
           currentStep: 0,
           loading: true,
           allData: null,
           sdtmStandardID: 1,
           adamStandardID: 2,
           sendStandardID:10,
           //showSDTMRelDoc: false,
           //showADAMRelDoc: false,
           //showSENDRelDoc: false,
           sdtmDocDataSource: [],
           adamDocDataSource: [],
           sendDocDataSource:[],
           selectedNode: null,
           currentDoc: emptyDoc,
           docEditIndex:-1
       };
       thisObj = this;
       this.initStudyCreateForm();
    }
    componentDidUpdate() {
        errorMessageTooltip(this.props);
    }

    initStudyCreateForm = () => {
        const thisObj = this;
        showProgress();
        CallServerPost('Study/GetValuesForCreateStudy', { FormName: "Study", ActionName: "Create", ProjectID: this.props.projectId }).then(
            function (response) {
                if (response.status === 0) {
                    errorModal(response.message);
                } else {
                    const allData = response.value;
                    var sdtm = 1;
                    var adam = 2;
                    var send = 10;
                    for (var i = 0; i < allData.cDISCDataStandards.length; i++) {
                        if (allData.cDISCDataStandards[i].standardName.toLowerCase().includes('sdtm')) {
                            sdtm = allData.cDISCDataStandards[i].cdiscDataStandardID;
                        } else if (allData.cDISCDataStandards[i].standardName.toLowerCase().includes('adam')) {
                            adam = allData.cDISCDataStandards[i].cdiscDataStandardID;
                        } else if (allData.cDISCDataStandards[i].standardName.toLowerCase().includes('send')) {
                            send = allData.cDISCDataStandards[i].cdiscDataStandardID;
                        } 
                    }
                    thisObj.setState({ loading: false, allData: allData, sdtmStandardID: sdtm, adamStandardID: adam, sendStandardID: send });
                }
                hideProgress();
            }).catch(error => error);
    }
    handleCancel = () => {
        this.props.handleCancel();
    }
    handleSDTM = () => {
        this.setState({ sdtmDocDataSource: [] });
    }
    handleSEND = () => {
        this.setState({ sendDocDataSource: [] });
    }

    handleADAM = () => {
        this.setState({ adamDocDataSource: [] });
    }
    
    handleClear = () => {
        var fieldsToReset = [];
        switch (this.state.currentStep) {
            case 0:
                Object.entries(Step1Fields).forEach(([, value]) => {
                    fieldsToReset.push(value);
                });
                this.props.form.resetFields(fieldsToReset);
                this.setState({ sdtmDocDataSource: [], adamDocDataSource: [] });
                break;
            case 1:
                const standardkey = Step1Fields.StandardID;
                const { getFieldsValue } = this.props.form;
                const sdtmEnabled = getFieldsValue([standardkey])[standardkey] !== undefined && getFieldsValue([standardkey])[standardkey].indexOf(this.state.sdtmStandardID.toString()) > -1;
                const adamEnabled = getFieldsValue([standardkey])[standardkey] !== undefined && getFieldsValue([standardkey])[standardkey].indexOf(this.state.adamStandardID.toString()) > -1;

                if (sdtmEnabled) {
                    Object.entries(Step4Fields).forEach(([, value]) => {
                        fieldsToReset.push(value);
                    });
                    this.props.form.resetFields(fieldsToReset);
                    this.setState({ sdtmDocDataSource: [] });
                } else if (adamEnabled){
                    Object.entries(Step5Fields).forEach(([, value]) => {
                        fieldsToReset.push(value);
                    });
                    this.props.form.resetFields(fieldsToReset);
                    this.setState({ adamDocDataSource: [] });
                } else {
                    Object.entries(Step6Fields).forEach(([, value]) => {
                        fieldsToReset.push(value);
                    });
                    this.props.form.resetFields(fieldsToReset);
                    this.setState({ sendDocDataSource: [] });
                }

                break;
            case 2:
                Object.entries(Step5Fields).forEach(([, value]) => {
                    fieldsToReset.push(value);
                });
                this.props.form.resetFields(fieldsToReset);
                this.setState({ adamDocDataSource: [] });
                break;
            default:
                break;
        }
    }

  
    validateStudyName = (fieldsToValidate, thisObj) => {
        thisObj.props.form.validateFields(fieldsToValidate, (err, values) => {
            if (!err) {
                thisObj.setState({
                    loading: true
                });
                showProgress();
                CallServerPost('Study/StudyNameExistCheck', { StudyName: values[Step1Fields.StudyName], ProjectID: thisObj.props.projectId }).then(
                    function (response) {
                        
                        if (response.status === 0) {
                            thisObj.setState({
                                loading: false
                            });
                            errorModal(response.message);
                        } else {
                            thisObj.setState({
                                currentStep: thisObj.state.currentStep + 1,
                                loading: false
                            });
                        }
                        hideProgress();
                    }).catch(error => error);
            } 
        });
        
    }
    next() {
        const thisObj = this;
        var fieldsToValidate = [];
        const { getFieldsValue } = this.props.form;
        if (this.state.currentStep === 0) {
            Object.entries(Step1Fields).forEach(([, value]) => {
                if (value !== Step1Fields.ProjectID && value !== Step1Fields.SponsorName) {
                    fieldsToValidate.push(value);
                }
            });
            
            this.validateStudyName(fieldsToValidate, thisObj);
            return;
        }
        switch (this.state.currentStep) {
            case 1:
                Object.entries(Step2Fields).forEach(([, value]) => {
                    fieldsToValidate.push(value);
                });
                break;
            case 2:
                Object.entries(Step3Fields).forEach(([, value]) => {
                    fieldsToValidate.push(value);
                });
                break;
            case 3:
                const standardkey = Step1Fields.StandardID;
              
                const sdtmEnabled = getFieldsValue([standardkey])[standardkey] !== undefined && getFieldsValue([standardkey])[standardkey].indexOf(this.state.sdtmStandardID.toString()) > -1;

                if (sdtmEnabled) {
                    Object.entries(Step4Fields).forEach(([, value]) => {
                        fieldsToValidate.push(value);
                    });
                } else {
                    Object.entries(Step5Fields).forEach(([, value]) => {
                        fieldsToValidate.push(value);
                    });
                }

                break;
            case 4:
                Object.entries(Step5Fields).forEach(([, value]) => {
                    fieldsToValidate.push(value);
                });
            case 5:
                Object.entries(Step6Fields).forEach(([, value]) => {
                    fieldsToValidate.push(value);
                });
                break;
            default:
                break;
        }
        this.props.form.validateFields(fieldsToValidate,(err, values) => {
            if (!err) {
                const currentStep = thisObj.state.currentStep + 1;
                thisObj.setState({ currentStep });
            }
        });
       
    }

    prev() {
        const currentStep = this.state.currentStep - 1;
        this.setState({ currentStep });
    }

    //handleDocCancel = () => {
    //    this.setState({ showSDTMRelDoc: false, showSENDRelDoc: false, showADAMRelDoc: false, docEditIndex: -1, currentDoc: emptyDoc });
    //}


  
    //handleDocSubmit = (value, standard) => {
    //    if (standard === SDTM) {
    //        var sdtmsDocs = thisObj.state.sdtmDocDataSource;
    //        const { docEditIndex } = thisObj.state;
    //        if (docEditIndex === -1) {
    //            sdtmsDocs.push(value);
    //        } else {
    //            sdtmsDocs[docEditIndex] = value;
    //        }
    //        this.setState({ /*showSDTMRelDoc: false,*/ sdtmDocDataSource: sdtmsDocs, docEditIndex: -1, currentDoc: emptyDoc });
    //    } else if (standard === ADAM) {
    //        var adamDocs = this.state.adamDocDataSource;
    //        const { docEditIndex } = this.state;
    //        if (docEditIndex === -1) {
    //            adamDocs.push(value);
    //        } else {
    //            adamDocs[docEditIndex] = value;
    //        }
    //        this.setState({/* showADAMRelDoc: false,*/ adamDocDataSource: adamDocs, docEditIndex: -1, currentDoc: emptyDoc });
    //    } else if (standard === SEND) {
    //        var sendDocs = this.state.sendDocDataSource;
    //        const { docEditIndex } = this.state;
    //        if (docEditIndex === -1) {
    //            sendDocs.push(value);
    //        } else {
    //            sendDocs[docEditIndex] = value;
    //        }
    //        this.setState({ /*showSENDRelDoc: false,*/ sendDocDataSource: sendDocs, docEditIndex: -1, currentDoc: emptyDoc });
    //    }
    //}

    //showDoc = (standard) => {
    //    if (standard === ADAM) {
    //        this.setState({
    //            showADAMRelDoc: true
    //        });
    //    } else if (standard === SEND) {
    //        this.setState({
    //            showSENDRelDoc: true
    //        });
    //    } else {
    //        this.setState({
    //            showSDTMRelDoc: true
    //        });
    //    }
       
    //}

    //editDoc = (standard, index, isDelete) => {
    //    if (standard === SDTM) {
    //        if (isDelete) {
    //            const { sdtmDocDataSource } = this.state;
    //            var newDocs = [];
    //            for (var id = 0; id < sdtmDocDataSource.length; id++) {
    //                if (index !== id) {
    //                    newDocs.push(sdtmDocDataSource[id]);
    //                }
    //            }
    //            this.setState({
    //                sdtmDocDataSource: newDocs
    //            });
    //        } else {
    //            this.setState({
    //                showSDTMRelDoc: true,
    //                currentDoc: this.state.sdtmDocDataSource[index],
    //                docEditIndex: index
    //            });
    //        }
            
    //    } else if (standard === ADAM) {
    //        if (isDelete) {
    //            const { adamDocDataSource } = this.state;
    //            var adamDocs = [];
    //            for (var i = 0; i < adamDocDataSource.length; i++) {
    //                if (index !== i) {
    //                    adamDocs.push(adamDocDataSource[i]);
    //                }
    //            }
    //            this.setState({
    //                adamDocDataSource: adamDocs
    //            });
    //        } else {
    //            this.setState({
    //                showADAMRelDoc: true,
    //                currentDoc: this.state.adamDocDataSource[index],
    //                docEditIndex: index
    //            });
    //        }
    //    } else if (standard === SEND) {
    //        if (isDelete) {
    //            const { sendDocDataSource } = this.state;
    //            var sendDocs = [];
    //            for (var i = 0; i < sendDocDataSource.length; i++) {
    //                if (index !== i) {
    //                    sendDocs.push(sendDocDataSource[i]);
    //                }
    //            }
    //            this.setState({
    //                sendDocDataSource: sendDocs
    //            });
    //        } else {
    //            this.setState({
    //                showSENDRelDoc: true,
    //                currentDoc: this.state.sendDocDataSource[index],
    //                docEditIndex: index
    //            });
    //        }
    //    }

        
    //}

    getInt = (value) => {
        var rv = parseInt(value);
        if (isNaN(rv)) {
            return 0;
        }
        return rv;
    }
    fnSaveStudy = () => {
        const thisObj = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const standardkey = Step1Fields.StandardID;
                const sdtmEnabled = values[standardkey].indexOf(thisObj.state.sdtmStandardID.toString()) > -1;
                const adamEnabled = values[standardkey].indexOf(thisObj.state.adamStandardID.toString()) > -1;
                const sendEnabled = values[standardkey].indexOf(thisObj.state.sendStandardID.toString()) > -1;
                const omopEnabled = values[standardkey].indexOf("4") > -1;
                const projectRole = getProjectRole();

                const zones = moment.tz.guess();
                const timezone = moment.tz(zones).zoneAbbr();
                var studyFiles = [];

                var studyObj = {
                    "ProjectID": thisObj.props.projectId,
                    "StudyName": values[Step1Fields.StudyName],
                    "ProtocolName": values[Step1Fields.ProtocolName],
                    "StudyCode": values[Step1Fields.StudyCode],
                    "StudyDescription": values[Step1Fields.StudyDescription],
                    "SponsorName": thisObj.props.sponsorName,
                    "Locked": false,
                    "SDTMEnabled": sdtmEnabled,
                    "ADAMEnabled": adamEnabled,
                    "SENDEnabled": sendEnabled,
                    "DatabaseName": "",
                    "BaseOutputPath": omopEnabled ? values[OMOPFields.OMOPStandardDatasetLoc1] : "",
                    "BaseInputPath": omopEnabled ? values[OMOPFields.OMOPRawDatasetLoc] : "",
                    "TimeZone": timezone,
                    "UpdatedBy": projectRole.userProfile.userID,
                    "StudyStatusID": 138,
                    "OMOPEnabled": omopEnabled
                };
                if (omopEnabled) {
                    studyObj["SandardID"] = this.getInt(values[Step1Fields.StandardID]);
                    studyObj["StandardVersionID"] = this.getInt(values[Step1Fields.OMOPStandardVersionID]);
                    studyObj["MappingRequired"] = true;
                    studyObj["DefineOutputType"] = this.getInt(values[OMOPFields.OMOPMappingOutput]);
                    studyFiles.push({            // Raw Dataset Location for OMOP
                        FileTypeID: 55,
                        FileLocation: values[OMOPFields.OMOPRawDatasetLoc],
                        LocationType: 1,
                        "TimeZone": timezone,
                        "UpdatedBy": projectRole.userProfile.userID
                    });
                    studyFiles.push({            // Standard Dataset Location for OMOP
                        FileTypeID: 56,
                        FileLocation: values[OMOPFields.OMOPStandardDatasetLoc1],
                        LocationType: 1,
                        "TimeZone": timezone,
                        "UpdatedBy": projectRole.userProfile.userID
                    });
                }
               
                var SDTMStudyProperty = !sdtmEnabled ? null : {
                    "CDISCDataStandardID": this.state.sdtmStandardID,
                    "SDTMAnnotationRequired": values[Step4Fields.AnnotationRequired],
                    "SDTMMappingRequried": values[Step4Fields.SDTMMappingRequried],
                    "SDTMDefineRequired": values[Step4Fields.SDTMDefineRequired],
                    "SDTMDefineOutputTypeID": this.getInt(values[Step4Fields.SDTMDefineOutputType]),
                    "CDISCDataStdVersionID": this.getInt(values[Step1Fields.SDTMStandardVersionID]),
                    "NCICodeListID": this.getInt(values[Step1Fields.SDTMCodelistVersionID]),
                    "TimeZone": timezone,
                    "UpdatedBy": projectRole.userProfile.userID
                };
                if (sdtmEnabled && values[Step3Fields.SDTMMappingRequried]) {
                    studyObj["VersionID"] = this.getInt(values[Step4Fields.SDTMMappingOutput]);
                }

                var ADAMStudyProperty = !adamEnabled ? null : {
                    "CDISCDataStandardID": this.state.adamStandardID,
                    "ADAMMappingRequried": values[Step5Fields.ADAMMappingRequried],
                    "ADAMDefineRequired": values[Step5Fields.ADAMDefineRequired],
                    "CDISCDataStdVersionID": this.getInt(values[Step1Fields.ADAMStandardVersionID]),
                    "ADAMDefineOutputTypeID": this.getInt(values[Step5Fields.ADAMDefineOutputType]),
                    "NCICodeListID": this.getInt(values[Step1Fields.ADAMCodelistVersionID]),
                    "TimeZone": timezone,
                    "UpdatedBy": projectRole.userProfile.userID
                };
                

                var SENDStudyProperty = !sendEnabled ? null : {
                    "CDISCDataStandardID": this.state.sendStandardID,
                    "SENDMappingRequried": values[Step3Fields.SENDMappingRequried],
                    "SENDDefineRequired": values[Step6Fields.SENDDefineRequired],
                    "CDISCDataStdVersionID": this.getInt(values[Step1Fields.SENDStandardVersionID]),
                    "NCICodeListID": this.getInt(values[Step1Fields.SENDCodelistVersionID]),
                    "TimeZone": timezone,
                    "UpdatedBy": projectRole.userProfile.userID,
                    "SENDDefineOutputTypeID": this.getInt(values[Step6Fields.SENDDefineOutputType])
                };

                var OMOPStudyProperty = !omopEnabled ? null : {
                    "CDISCDataStandardID": this.state.omopStandardID,
                    "OMOPMappingRequried": values[OMOPFields.OMOPMappingRequried],
                    "CDISCDataStdVersionID": this.getInt(values[OMOPFields.OMOPStandardVersionID]),
                    "NCICodeListID": this.getInt(values[OMOPFields.OMOPCodelistVersionID]),
                    "TimeZone": timezone,
                    "UpdatedBy": projectRole.userProfile.userID,
                    "OMOPDefineOutputTypeID": this.getInt(values[OMOPFields.OMOPDefineOutputType])
                };
               
                studyFiles.push({            // ProtocolDocument
                    FileTypeID: 53,
                    FileLocation: values[Step1Fields.ProtocolDocument],
                    LocationType: 0,
                    "TimeZone": timezone,
                    "UpdatedBy": projectRole.userProfile.userID
                });

                if (sdtmEnabled) {
                    if (values[Step2Fields.CRFDocument] !== '') {
                        studyFiles.push({            // SDTM CRF Document
                            FileTypeID: 54,
                            FileLocation: values[Step2Fields.CRFDocument],
                            LocationType: 0,
                            "TimeZone": timezone,
                            "UpdatedBy": projectRole.userProfile.userID
                        });
                    }
                    if (values[Step4Fields.SDTMMappingRequried]) {
                        studyFiles.push({            // Raw Dataset Location for SDTM
                            FileTypeID: 55,
                            FileLocation: values[Step4Fields.SDTMRawDatasetLoc],
                            LocationType: 1,
                            "TimeZone": timezone,
                            "UpdatedBy": projectRole.userProfile.userID
                        });
                    }
                    if (values[Step4Fields.SDTMDefineRequired]) {
                        studyFiles.push({            // Standard Dataset Location for SDTM
                            FileTypeID: 56,
                            FileLocation: values[Step4Fields.SDTMStandardDatasetLoc2],
                            LocationType: 1,
                            "TimeZone": timezone,
                            "UpdatedBy": projectRole.userProfile.userID
                        });
                    } else if (values[Step4Fields.SDTMMappingRequried]) {
                        studyFiles.push({           // Standard Dataset Location for SDTM
                            FileTypeID: 56,
                            FileLocation: values[Step4Fields.SDTMStandardDatasetLoc1],
                            LocationType: 1,
                            "TimeZone": timezone,
                            "UpdatedBy": projectRole.userProfile.userID
                        });
                    }
                    //const sdtmDocDataSource = thisObj.state.sdtmDocDataSource;
                                       
                    //for (var i = 0; i < sdtmDocDataSource.length; i++) {                        
                    //    studyFiles.push({            // Study Related Documents for SDTM
                    //        FileTypeID: this.getInt(sdtmDocDataSource[i].DocumentTypeID),
                    //        FileLocation: sdtmDocDataSource[i].FileLocation,
                    //        LocationType: 0,
                    //        DestinationType: sdtmDocDataSource[i].DestinationType,
                    //        Title: sdtmDocDataSource[i].Title,
                    //        "TimeZone": timezone,
                    //        "UpdatedBy": projectRole.userProfile.userID
                    //    });
                    //}
                }

                if (adamEnabled) {
                    if (values[Step3Fields.ADAMMappingRequried]) {
                        studyFiles.push({            // Raw Dataset Location for ADAM
                            FileTypeID: 236,
                            FileLocation: values[Step3Fields.ADAMRawDatasetLoc],
                            LocationType: 1,
                            "TimeZone": timezone,
                            "UpdatedBy": projectRole.userProfile.userID
                        });
                    }
                    if (values[Step5Fields.ADAMDefineRequired]) {
                        studyFiles.push({            // Standard Dataset Location for ADAM
                            FileTypeID: 238,
                            FileLocation: values[Step5Fields.ADAMStandardDatasetLoc2],
                            LocationType: 1,
                            "TimeZone": timezone,
                            "UpdatedBy": projectRole.userProfile.userID
                        });
                    }
                    //const adamDocDataSource = thisObj.state.adamDocDataSource;
                    //for (var j = 0; j < adamDocDataSource.length; j++) {
                    //    studyFiles.push({            // Raw Dataset Location for SDTM
                    //        FileTypeID: this.getInt(adamDocDataSource[j].DocumentTypeID),
                    //        FileLocation: adamDocDataSource[j].FileLocation,
                    //        LocationType: 0,
                    //        DestinationType: adamDocDataSource[j].DestinationType,
                    //        Title: adamDocDataSource[j].Title,
                    //        "TimeZone": timezone,
                    //        "UpdatedBy": projectRole.userProfile.userID
                    //    });
                    //}
                }
                if (sendEnabled) {
                    if (values[Step3Fields.SENDMappingRequried]) {
                        studyFiles.push({            // Raw Dataset Location for SEND
                            FileTypeID: 264,
                            FileLocation: values[Step3Fields.SENDRawDatasetLoc],
                            LocationType: 1,
                            "TimeZone": timezone,
                            "UpdatedBy": projectRole.userProfile.userID
                        });
                    }
                    if (values[Step6Fields.SENDDefineRequired]) {
                        studyFiles.push({            // Standard Dataset Location for SEND
                            FileTypeID: 265,
                            FileLocation: values[Step6Fields.SENDStandardDatasetLoc2],
                            LocationType: 1,
                            "TimeZone": timezone,
                            "UpdatedBy": projectRole.userProfile.userID
                        });
                    }
                    //const sendDocDataSource = thisObj.state.sendDocDataSource;
                    //for (var j = 0; j < sendDocDataSource.length; j++) {
                    //    studyFiles.push({            // Raw Dataset Location for SEND
                    //        FileTypeID: this.getInt(sendDocDataSource[j].DocumentTypeID),
                    //        FileLocation: sendDocDataSource[j].FileLocation,
                    //        LocationType: 0,
                    //        DestinationType: sendDocDataSource[j].DestinationType,
                    //        Title: sendDocDataSource[j].Title,
                    //        "TimeZone": timezone,
                    //        "UpdatedBy": projectRole.userProfile.userID
                    //    });
                    //}
                }
                
                //studyObj['SDTMStudyProperty'] = SDTMStudyProperty;
                //studyObj['ADAMStudyProperty'] = ADAMStudyProperty;
                //studyObj['SENDStudyProperty'] = SENDStudyProperty;
                //studyObj['OMOPStudyProperty'] = OMOPStudyProperty;
                studyObj['StudyFiles'] = studyFiles;
                //if (SDTMStudyProperty !== null && !SDTMStudyProperty.SDTMAnnotationRequired && !SDTMStudyProperty.SDTMMappingRequried && !SDTMStudyProperty.SDTMDefineRequired) {
                //    errorModal("Please select Alteast one of Annotation, Mapping or Define");
                //    return;
                //}
                //if (ADAMStudyProperty !== null && !ADAMStudyProperty.ADAMMappingRequried && !ADAMStudyProperty.ADAMDefineRequired) {
                //    errorModal("Please select Alteast one of Mapping or Define ");
                //    return;
                //}
                //if (SENDStudyProperty !== null && !SENDStudyProperty.SENDMappingRequried && !SENDStudyProperty.SENDDefineRequired) {
                //    errorModal("Please select Alteast one of Mapping or Define ");
                //    return;
                //}

                //if (OMOPStudyProperty !== null && !OMOPStudyProperty.OMOPMappingRequried) {
                //    errorModal("Please select Alteast one of Mapping ");
                //    return;
                //}
                
                    thisObj.setState({
                        loading: true
                    });
                    showProgress();
                    CallServerPost('Study/CreateStudy', studyObj).then(
                        function (response) {
                            thisObj.setState({
                                loading: false
                            });
                            if (response.status === 0) {
                                errorModal(response.message);
                            } else {
                                successModalCallback(response.message, thisObj.props.studyListRefresh);
                            }
                            hideProgress();
                        });
                
           
              
                    
                //console.log(studyObj);
                

            }
        });
    }

    fnToShowErrTooltip = (e) => {
        if (e.target.offsetWidth !== e.target.scrollWidth && e.target.className === "ant-form-explain") {
            e.target.classList.add("errorMsgTooltip");
        }
    }


    onStandardNameChange = (value, option) => {
       
        var fieldsToReset = [];
        if (value.indexOf("1") < 0) {   //SDTM Disabled
            fieldsToReset.push(
                Step1Fields.SDTMStandardVersionID,
                Step1Fields.SDTMCodelistVersionID,
                Step4Fields.AnnotationRequired,
                Step4Fields.SDTMMappingRequried,
                Step4Fields.SDTMRawDatasetLoc
            );
            this.props.form.resetFields(fieldsToReset);
            this.setState({ sdtmDocDataSource: [] });
        }
        if (value.indexOf("2") < 0) { //ADAM Disabled
            fieldsToReset.push(
                Step1Fields.ADAMStandardVersionID,
                Step1Fields.ADAMCodelistVersionID,
                Step3Fields.ADAMMappingRequried,
                Step3Fields.ADAMRawDatasetLoc
            );
            this.props.form.resetFields(fieldsToReset);
            this.setState({ adamDocDataSource: [] });
        }
        if (value.indexOf("10") < 0) { //ADAM Disabled
            fieldsToReset.push(
                Step1Fields.SENDStandardVersionID,
                Step1Fields.SENDCodelistVersionID,
                Step3Fields.SENDMappingRequried,
                Step3Fields.SENDRawDatasetLoc
            );
            this.props.form.resetFields(fieldsToReset);
            this.setState({ adamDocDataSource: [] });
        }
        if (value.indexOf("4") < 0) { //OMOP Disabled
            fieldsToReset.push(
                OMOPFields.OMOPMappingOutput,
                OMOPFields.OMOPRawDatasetLoc,
                OMOPFields.OMOPStandardDatasetLoc1
            );
            this.props.form.resetFields(fieldsToReset);
        }
        if (value.length == 1 ? value[0] == "2" ? true : true : false) {
            fieldsToReset.push("StandardID");
            thisObj.props.form.resetFields(fieldsToReset);

        }
    }
    
    getSteps = (sdtmEnabled, sendEnabled, adamEnabled, omopEnabled, form, allData) => {
        var protocolDocumentData = null;
        var xptlocationTreeData = null;
        var rawDatasetTreeData = null;
        if (allData !== null) {
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
            protocolDocumentData = treeLoop([allData["DocumentsTree"].pdfLocation], false);
            xptlocationTreeData = treeLoop([allData["DocumentsTree"].xptLocation], true);
            rawDatasetTreeData = treeLoop([allData["DocumentsTree"].sas7BdatLocation], true);
        }
        const step1 = <Step1 form={form} protocolDocumentData={protocolDocumentData} onStandardNameChange={this.onStandardNameChange} allData={allData} sdtmEnabled={sdtmEnabled} sendEnabled={sendEnabled} adamEnabled={adamEnabled} omopEnabled={omopEnabled}/>;
        //const step2 = <Step2 form={form} pdfDocumentData={protocolDocumentData} allData={allData} sdtmEnabled={sdtmEnabled} adamEnabled={adamEnabled}/>;
        //const step3 = <Step3 form={form} rawDatasetTreeData={rawDatasetTreeData} xptlocationTreeData={xptlocationTreeData} allData={allData} sdtmEnabled={sdtmEnabled} adamEnabled={adamEnabled} />;
        const step4 = <Step4 form={form} rawDatasetTreeData={rawDatasetTreeData} handleSDTM={this.handleSDTM} /*docDataSource={this.state.sdtmDocDataSource}*/ /*editDoc={this.editDoc} */pdfDocumentData={protocolDocumentData} showSDTMDoc={this.showDoc} xptlocationTreeData={xptlocationTreeData} allData={allData} sdtmEnabled={sdtmEnabled} sendEnabled={sendEnabled} adamEnabled={adamEnabled} /*handleSDTMDocChange={this.handleSDTMDocChange}*/ />;
        const step5 = <Step5 form={form} /*docDataSource={this.state.adamDocDataSource}*/ handleADAM={this.handleADAM} /*editDoc={this.editDoc}*/ pdfDocumentData={protocolDocumentData} showADAMDoc={this.showDoc} xptlocationTreeData={xptlocationTreeData} allData={allData} sdtmEnabled={sdtmEnabled} sendEnabled={sendEnabled} adamEnabled={adamEnabled} /*handleADAMDocChange={this.handleADAMDocChange}*/ />;
        const step6 = <Step6 form={form} /*docDataSource={this.state.sendDocDataSource}*/ handleSEND={this.handleSEND} /*editDoc={this.editDoc}*/ pdfDocumentData={protocolDocumentData} showSENDDoc={this.showDoc} xptlocationTreeData={xptlocationTreeData} allData={allData} sdtmEnabled={sdtmEnabled} sendEnabled={sendEnabled} adamEnabled={adamEnabled} /*handleSENDDocChange={this.handleSENDDocChange}*/ />;
        const omopStep = <OMOPStep form={form} xptlocationTreeData={xptlocationTreeData} omopEnabled={omopEnabled} rawDatasetTreeData={rawDatasetTreeData} />;

        var steps = [
            {
                title: 'General',
                content: step1
            }
        ];
        if (sdtmEnabled) {
            steps.push({
                title: 'SDTM',
                content: step4
            });
        }
        if (sendEnabled) {
            steps.push({
                title: 'SEND',
                content: step6
            });
        }
        if (adamEnabled) {
            steps.push({
                title: 'ADAM',
                content: step5
            });
        }
        if (omopEnabled) {
            steps.push({
                title: 'OMOP',
                content: omopStep
            });
        }
      
        return {
            steps: steps,
            protocolDocumentData: protocolDocumentData
        };
    }
    render() {
        const { visible, handleCancel, form } = this.props;
        const { getFieldDecorator, getFieldsValue } = form;
        const { currentStep, loading, step1Settings, allData, sdtmStandardID, adamStandardID, sendStandardID, showSDTMRelDoc, showSENDRelDoc, showADAMRelDoc, currentDoc, docEditIndex } = this.state;
        const splitClass = 12;
        const standardkey = Step1Fields.StandardID;
        const sdtmEnabled = getFieldsValue([standardkey])[standardkey] !== undefined && getFieldsValue([standardkey])[standardkey].indexOf(sdtmStandardID.toString()) > -1;
        const adamEnabled = getFieldsValue([standardkey])[standardkey] !== undefined && getFieldsValue([standardkey])[standardkey].indexOf(adamStandardID.toString()) > -1;
        const sendEnabled = getFieldsValue([standardkey])[standardkey] !== undefined && getFieldsValue([standardkey])[standardkey].indexOf(sendStandardID.toString()) > -1;
        const omopEnabled = getFieldsValue([standardkey])[standardkey] !== undefined && getFieldsValue([standardkey])[standardkey].indexOf("4") > -1;

        const stepsData = this.getSteps(sdtmEnabled, sendEnabled, adamEnabled, omopEnabled, form, allData);
        const steps = stepsData.steps;
        const protocolDocumentData = stepsData.protocolDocumentData;
        return (
           <div>
                <Modal
                    visible={visible}
                    title={"Create Study"}
                    style={{ top: 20 }}
                    onCancel={loading ? null : handleCancel}
                    width={'80%'}
                    maskClosable={false}
                    footer={null}
                    className={"studyCreation"}
                >
                    <LayoutContentWrapper>
                        <LayoutContent style={{padding:0}}>
                                <StepsStyleWrapper>
                                    <Steps current={currentStep}>
                                        {steps.map(item => 
                                            <Step key={item.title} title={item.title} />
                                        )}
                                    </Steps>
                                    <Form layout="vertical" style={{ maxHeight: 'calc(100vh - 220px)', overflow: 'auto', margin: '10px 0' }}>
                                        {steps.map((item, i) =>
                                            <div key={'studyStepsKey' + i} style={{ display: i === currentStep ? '' : 'none' }} className="steps-content">{steps[i].content}</div>
                                        )}

                                    </Form>
                                    {
                                        allData !== null && 
                                        <Row style={rowStyle} justify="space-between">
                                        <Col md={12} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                                                <Button disabled={loading} name="Cancel" type="danger" onClick={() => this.handleCancel()}>
                                                Cancel
                                            </Button>
                                                <Button disabled={loading} name="Clear" onClick={() => this.handleClear()} style={{ marginLeft: 8, textAlign: 'left' }} type="default" >
                                                Clear
                                            </Button>
                                        </Col>
                                        <Col md={12} sm={24} xs={24} style={{ textAlign: 'right' }}>
                                            {currentStep > 0 &&
                                                  <Button disabled={loading} name="Previous" className="ant-btn-primary" style={{ marginRight: 8 }} onClick={() => this.prev()}>
                                                    Previous
                                                </Button>
                                            }
                                            {currentStep < steps.length - 1 &&
                                                    <Button disabled={loading} name="Next" style={{ marginRight: 8 }} type="primary" onClick={() => this.next()}>
                                                    Next
                                                </Button>
                                            }
                                            {currentStep === steps.length - 1 &&
                                                    <Button disabled={loading} name="Add" className="saveBtn" onClick={() => this.fnSaveStudy()} >
                                                    Add
                                                </Button>
                                            }
                                        </Col>
                                    </Row>
                                    }
                                
                                </StepsStyleWrapper>

                       
                        

                        </LayoutContent>
                    </LayoutContentWrapper>

            </Modal>
     
            </div>
        );
    }
}

const WrappedApp = Form.create()(CreateNewStudyModal);

export default WrappedApp;