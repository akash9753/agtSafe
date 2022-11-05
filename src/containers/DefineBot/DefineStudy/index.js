import React, { Component } from 'react';
import { Card, Button, Modal, Form, Spin, Icon } from 'antd';
import {
    DownloadFileWithPostData,
    errorModal,
    PostCallWithZone,
    showProgress, hideProgress, definePermission
} from '../../Utility/sharedUtility';
import LayoutContent from '../../../components/utility/layoutContent';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import XMLGeneration from '../../Study/xmlGenerationVersionModal';
import Confirmation from '../confirmation';
import ImportFile from '../../Study/import.js';
import ViewImport from './ViewImport';
import { Switch, Route } from 'react-router-dom';
import Progress from '../../Utility/ProgressBar';
const { confirm } = Modal;


const Btncss = {

    margin: '0px 5px 0px 0px',
    borderRadius: 3

}

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

let schemavalidation = [];
let metadatavalidation = [];
let datavalidation = [];
var thisObj, studyID;
var schemaValidationTitle, noOfSchemaErrors, dataValidationTitle, noOfDataValidationErrors, showSchemaValidation;
export default class DefineStudy extends Component {
    constructor(props) {
        super(props);

        this.state = {
            studyID,
            showSchemaValidation: false,
            schemaDataSource: [],
            schemaValidationTitle: "",
            dataValidationDataSource: [],
            metaDataSource: [],
            loading: false,
            generateXMLPopUp: false,
            preValidation: false,
            confirmation: false,
            popupLoading: false,
            showImport: false,
            projectStudyName: JSON.parse(sessionStorage.studyDetails).projectText + "_" + JSON.parse(sessionStorage.studyDetails).studyName,
            refreshFor: "",
            load: 1,
            confirmationTitle: "",
            viewImport: false,
            progress:"",

        };

        thisObj = this;
    }

    fnForXML = (studyID) => {
        thisObj.setState({ generateXMLPopUp: true, load: 1, preValidation: false });

    }

    fnForPreCheck = (studyID) => {
        thisObj.setState({ generateXMLPopUp: true, load: 1, preValidation: true });

    }

    exportDataAsExcel = (studyID, exportFileName) => {
        showProgress();
        DownloadFileWithPostData('Study/ExportExcelbyXSLT', exportFileName + "_export.xls", { StudyID: studyID }).then(function () {
            hideProgress();
        });
    }
    import = (studyID, directoryName) => {

        thisObj.setState({ studyID: studyID, projectStudyName: directoryName, showImport: true });
    }


    //fnForRefresh = (studyID, refreshFor) => {
    //    var confirmationTitle = "";
    //    if (refreshFor == "data") {
    //        confirmationTitle = "Dataset Refresh";
    //    } else if (refreshFor == "crf") {
    //        confirmationTitle = "CRF Refresh";
    //    }
    //    thisObj.setState({ refreshFor: refreshFor, confirmation: true, studyID: studyID, confirmationTitle: confirmationTitle })

    //}


    fnForRefresh = (studyID, refreshFor) =>
    {
        var confirmationTitle = "";
        if (refreshFor == "data")
        {
            confirmationTitle = "Dataset Refresh";
            //confirm({
            //    title: 'Dataset Refresh',
            //    content: 'Do you want to update dataset refresh',
            //    onOk: function () {
            //        return new Promise((resolve, reject) => {
            //            thisObj.serverCallForRefresh();
            //            setTimeout(Math.random() > 0.5 ? resolve : reject, 3000);
            //        }).catch(() => //console.log('Oops errors!'));
            //    },
            //    onCancel() {
            //        //console.log('Cancel');
            //    },
            //});
        } else if (refreshFor == "crf") {
            confirmationTitle = "CRF Refresh";
            //confirm({
            //    title: 'CRF Refresh',
            //    content: 'Do you want to update crf refresh',
            //    onOk: function () {
            //        return new Promise((resolve, reject) => {
            //            thisObj.serverCallForRefresh();
            //            setTimeout(Math.random() > 0.5 ? resolve : reject, 4500);
            //        }).catch(() => //console.log('Oops errors!'));
            //    },
            //    onCancel() {
            //        //console.log('Cancel');
            //    },
            //});
        }
        thisObj.setState({ refreshFor: refreshFor, confirmation: true, studyID: studyID, confirmationTitle: confirmationTitle })

    }

    handsontable = () => {
        this.setState({ viewImport: true })
        this.props.viewImport();

    }
    cancel = () => {
        this.setState({ viewImport: false });
        this.props.viewImport();

    }
    stopLoading = () => {
        this.setState({
            loading: false,
            load: -1
        })
    }

    getURL = (refreshFor) =>
    {
        switch (refreshFor)
        {
            case "data":
                return "Study/XPTRefresh";
            case "crf":
                return "Study/CRFRefresh";
        }

    }

    serverCallForRefresh = (Reason) =>
    {
        let data = {};
        data["StudyID"] = thisObj.state.studyID;
        data["ChangeReason"] = Reason;
        let url = thisObj.getURL(thisObj.state.refreshFor);
        //showProgress();
        thisObj.setState({ progress:"active" });

        PostCallWithZone(url, data).then(
            function (response)
            {
                const responseData = response;
                hideProgress();
                thisObj.setState({ progress: "success" });
                if (responseData.status == 0) {
                    thisObj.setState({ refreshFor: "", confirmation: false });
                    errorModal(responseData.message);
                }
                else {
                    Modal.success({
                        title: "It's Done",
                        content: response.message,
                        onOk: function ()
                        {
                            thisObj.setState({ refreshFor: "" }, () => { thisObj.props.treeWholeRefresh(); });

                            
                        }

                    });
                }
            }).catch(error => error);
    }


    handleCancel = () => {
        this.setState({ generateXMLPopUp: false, showImport: false, });
    }
    ConfirmationCancel = () => {
        this.setState({ confirmation: false, refreshFor:"" });
    }
    render() {
        const { projectStudyLockStatus, projectInActive, history, defineActivityWorkflowStatus } = this.props;
        const { refreshFor, progress } = this.state;
        return (


            <LayoutContentWrapper style={{ width: "100%", height: "100%" }}>

                {!this.state.viewImport && <div style={{ margin: "auto" }}>
                    <Spin indicator={antIcon} spinning={this.state.loading}>
                        <Button style={Btncss} className="reacTable-addbtn" disabled={!definePermission(defineActivityWorkflowStatus)} onClick={() => thisObj.fnForRefresh(this.props.StudyID, "data")} name="Dataset Refresh">
                            <Icon type="file" theme="outlined" /><span>Dataset Refresh</span>
                        </Button>

                        <Button style={Btncss} className="reacTable-addbtn" onClick={() => thisObj.fnForPreCheck(this.props.StudyID)} name="Precheck" disabled={!definePermission(defineActivityWorkflowStatus)}>
                            <Icon type="check-square" theme="outlined" /><span>Precheck</span>
                        </Button>

                        <Button style={Btncss} className="reacTable-addbtn" onClick={() => thisObj.fnForXML(this.props.StudyID)} name="Generate Define" disabled={!definePermission(defineActivityWorkflowStatus)}>
                            <Icon type="snippets" theme="outlined" /><span>Generate Define</span>
                        </Button>

                        <Button style={Btncss} className="reacTable-addbtn" disabled={!definePermission(defineActivityWorkflowStatus)} onClick={() => thisObj.fnForRefresh(this.props.StudyID, "crf")} name="CRF Refresh">
                            <Icon type="file-sync" theme="outlined" /><span>CRF Refresh</span>
                        </Button>

                        <Button style={Btncss} className="reacTable-addbtn"
                            onClick={() => thisObj.exportDataAsExcel(this.props.StudyID, JSON.parse(sessionStorage.studyDetails).projectText + "_" + JSON.parse(sessionStorage.studyDetails).studyName)} name="ExportAsExcel"
                            disabled={!definePermission(defineActivityWorkflowStatus)}>
                            <Icon type="export" theme="outlined" /><span>  Export Data in Excel</span>
                        </Button>

                        <Button style={Btncss}
                            className="reacTable-addbtn"
                            disabled={!definePermission(defineActivityWorkflowStatus)}
                            onClick={() => thisObj.import(this.props.StudyID, JSON.parse(sessionStorage.studyDetails).databaseName)} name="Import">
                            <Icon type="file-excel" theme="outlined" /><span>   Import Data in Excel</span>
                        </Button>
                        {/*<Button style={Btncss} type="primary" onClick={() => this.handsontable()}>View Import</Button>*/}

                    </Spin>
                </div>
                }
                {
                    this.state.showImport &&
                    <ImportFile handleCancel={this.handleCancel} title={this.state.projectStudyName} studyID={this.state.studyID} visible={this.state.showImport} history={this.refreshTree} action={"Import"} />
                }
                {
                    this.state.viewImport &&
                    <ViewImport cancel={this.cancel} projectStudyLockStatus={projectStudyLockStatus} projectInActive={projectInActive} />
                }
                <Form>

                    <XMLGeneration stopLoading={this.stopLoading} load={this.state.load} projectStudyName={this.state.projectStudyName} studyID={this.props.StudyID} visible={this.state.generateXMLPopUp} handleCancel={this.handleCancel} preValidation={this.state.preValidation} />

                    <Confirmation loading={this.state.popupLoading} title={"Update " + this.state.confirmationTitle} onSubmit={this.serverCallForRefresh} visible={this.state.confirmation} handleCancel={this.ConfirmationCancel} />

                </Form>
                {
                    refreshFor === "data" && <Progress progress={refreshFor === "data" ? progress : ""} NoInitialPercent={true} />
                }
            </LayoutContentWrapper>


        );
    }


}