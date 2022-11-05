import React, { Component } from 'react';
import { CallServerPost, errorModal, successModal, successModalCallback, PostCallWithZone, DownloadFileWithPostData, getUserID } from '../Utility/sharedUtility';
import { Modal, Icon, Input, Popconfirm, Breadcrumb, Form ,span} from 'antd';
import DefineValidationModal from './defineValidation';
import DefinePreValidationModal from './definePreValidation';
import Button from '../../components/uielements/button';
import Progress from '../Utility/ProgressBar';

let thisObj;


class XMLGeneration extends Component {
    constructor(props) {
        super(props);
        //console.log("props here");
        //console.log(props);
        this.state = {
            visible: false,
            preValidation:false,
            studyID: -1,
            showSchemaValidation: false,
            showPreValidation:false,
            schemaDataSource: [],
            schemaValidationTitle: "",
            dataValidationDataSource: [],
            metaDataSource: [],
            loading: false,
            progress:false
        };
        thisObj = this;
        

    }
    componentWillReceiveProps(nextProps) {
        thisObj.props = nextProps;
        if (nextProps.load == 1) {
            thisObj.setState({ visible: nextProps.visible, studyID: nextProps.studyID, preValidation: nextProps.preValidation });
            if (nextProps.visible) {
                thisObj.generateXML();
            }
        }
    }   

    getSchemavalidation = (studyID, SDTMEnabled, ADaMEnabled) => {
        CallServerPost('Study/GetDefineXMLValidationResults', { StudyID: studyID, SDTMEnabled: SDTMEnabled, ADaMEnabled: ADaMEnabled, UserID: getUserID() })
            .then(
            function (response) {
                    thisObj.setState({ progress: "success" });

                    if (response.status == 1) {

                    thisObj.openVallidationModal({ progress: "success",data: response.value, StudyID: studyID, show: true, Title: response.message });
                }
                    else {

                    thisObj.openVallidationModal({ progress: "success",data: { nciCodeListValidation: [], dataSetvalidation:[], dataValidation: [], metaDataValidation: [], schemaValidation: [] }, StudyID: studyID, show: true, Title: "Define XML Validation Results" });

                }

            }).catch(error => error);
    }

    getPrevalidation = (studyID) =>
    {
        
        thisObj.socket_open();
        CallServerPost('Study/GetDefinePreValidationResults', { StudyID: studyID, UserID: getUserID() })
            .then(
            function (response) {
                    thisObj.setState({ progress: "success" });
                    if (response.status == 1)
                    {
                        thisObj.openPreVallidationModal({
                            data: response.value,
                            StudyID: studyID,
                            show: true,
                            Title: response.message,
                            progress:"success"
                        });
                    }
                    else {
                        thisObj.openPreVallidationModal({
                            data: { dataSetvalidation: [], metaDataValidation: [] },
                            StudyID: studyID,
                            show: true,
                            Title: "Define XML Validation Results",
                            progress: "error"

                        });
                        thisObj.setState({ progress: "exception" });

                    }

            }).catch(error => error);
    }

    openVallidationModal = (result) => {

        thisObj.setState({
            showSchemaValidation: result.show, StudyID: result.StudyID,
            schemaDataSource: (result.data.schemaValidation != undefined && result.data.schemaValidation != null) ? result.data.schemaValidation : [],
            schemaValidationTitle: result.Title,
            dataValidationDataSource: (result.data.dataValidation != undefined && result.data.dataValidation != null) ? result.data.dataValidation : [],
            metaDataSource: (result.data.metaDataValidation != undefined && result.data.metaDataValidation != null) ? result.data.metaDataValidation : [],
            nciCodeListDataSource: (result.data.nciCodeListValidation != undefined && result.data.nciCodeListValidation != null) ? result.data.nciCodeListValidation : [],
            dataSetDataSource: (result.data.dataSetValidation != undefined && result.data.dataSetValidation != null) ? result.data.dataSetValidation : [],
            popUpLoading: false, visible: false
        });
        thisObj.props.stopLoading();
    }

    openPreVallidationModal = (result) => {

        thisObj.setState({
            showPreValidation: result.show, StudyID: result.StudyID,
            schemaValidationTitle: result.Title,
            metaDataSource: (result.data.metaDataValidation != undefined && result.data.metaDataValidation != null) ? result.data.metaDataValidation : [],
            dataSetDataSource: (result.data.dataSetValidation != undefined && result.data.dataSetValidation != null) ? result.data.dataSetValidation : [],
            popUpLoading: false, visible: false
        });
        thisObj.props.stopLoading();

    }
    handleCancel = () => {
        this.setState({ showSchemaValidation: false, showPreValidation:false });
        this.props.handleCancel();
    }
    generateXML = () => {
        const thisObj = this;

        if (thisObj.props.visible) {
            if (thisObj.props.preValidation)
            {
                thisObj.setState({ loading: true });

                thisObj.getPrevalidation(thisObj.props.studyID);
            }
            else {
                //var data = (version == "2.0") ? { StudyID: thisObj.props.studyID } : {};
                thisObj.socket_open();
                var data = { StudyID: thisObj.props.studyID, UserID: getUserID() };
                CallServerPost('Study/GenerateDefineXml', data).then(
                    function (response) {
                        const responseData = response;
                        if (responseData.status == 0) {
                            thisObj.props.stopLoading();
                            thisObj.setState({ progress: "exception" });

                            errorModal(responseData.message);
                        }
                        else {
                            thisObj.getSchemavalidation(thisObj.props.studyID, thisObj.props.STDMEnabled, thisObj.props.ADaMEnabled);

                        }
                    }).catch(error => error);
            }
        } 
     }

    socket_open = () =>
    {
        thisObj.setState({ progress: "active" })
    }



    render()
    {
        const { showSchemaValidation, showPreValidation, progress } = this.state;
        return (
            
            <div>            
                {
                    showSchemaValidation ? <DefineValidationModal title={this.props.projectStudyName} studyID={this.state.StudyID} parentRootProps={this.props.rootprops} visible={this.state.showSchemaValidation} handleCancel={this.handleCancel} dataSetDataSource={this.state.dataSetDataSource} nciCodeListDataSource={this.state.nciCodeListDataSource} schemaDataSource={this.state.schemaDataSource} metaDataSource={this.state.metaDataSource} dataValidationDataSource={this.state.dataValidationDataSource} />:

                    showPreValidation && <DefinePreValidationModal title={this.props.projectStudyName} studyID={this.state.StudyID} parentRootProps={this.props.rootprops} visible={this.state.showPreValidation} handleCancel={this.handleCancel} dataSetDataSource={this.state.dataSetDataSource} metaDataSource={this.state.metaDataSource} />
                }      
                
                {<Progress progress={progress} NoInitialPercent={true} />}
                
            </div>
        )
    }
}

const WrappedApp = Form.create()(XMLGeneration);

export default WrappedApp;

