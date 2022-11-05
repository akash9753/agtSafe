import React, { Component } from 'react';
import { Card, Button, Modal, Form, Spin, Icon } from 'antd';
import {
    DownloadFileWithPostData,
    errorModal,
    PostCallWithZone,
    showProgress, hideProgress, definePermission, DefinePermissionCompleted
} from '../../Utility/sharedUtility';
import LayoutContent from '../../../components/utility/layoutContent';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import XMLGeneration from '../../Study/xmlGenerationVersionModal';
import Confirmation from '../confirmation';
import ImportFile from '../../Study/import.js';
import { Switch, Route } from 'react-router-dom';
import Progress from '../../Utility/ProgressBar';
import { DefineContext } from '../context';

const { confirm } = Modal;


const Btncss = {

    margin: '0px 2px 0px 0px',
    borderRadius: 3

}

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

let schemavalidation = [];
let metadatavalidation = [];
let datavalidation = [];
var thisObj, studyID;
var schemaValidationTitle, noOfSchemaErrors, dataValidationTitle, noOfDataValidationErrors, showSchemaValidation;

export default class DefineStudy extends Component {
    static contextType = DefineContext;

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
            progress: "",

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


    fnForRefresh = (studyID, refreshFor) => {
        var confirmationTitle = "";
        if (refreshFor == "data") {
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

    //handsontable = () => {
    //    this.setState({ viewImport: true })
    //    this.props.viewImport();

    //}
    //cancel = () => {
    //    this.setState({ viewImport: false });
    //    this.props.viewImport();

    //}
    stopLoading = () => {
        this.setState({
            loading: false,
            load: -1
        })
    }

    getURL = (refreshFor) => {
        switch (refreshFor) {
            case "data":
                return "Study/XPTRefresh";
            case "crf":
                return "Study/CRFRefresh";
        }

    }

    serverCallForRefresh = (Reason) => {
        let data = {};
        data["StudyID"] = thisObj.state.studyID;
        data["ChangeReason"] = Reason;
        let url = thisObj.getURL(thisObj.state.refreshFor);
        //showProgress();
        thisObj.setState({ progress: "active" });

        PostCallWithZone(url, data).then(
            function (response) {
                const responseData = response;
                hideProgress();
                thisObj.setState({ progress: "success" });
                if (responseData.status == 0) {

                    errorModal(responseData.message);
                }
                else {
                    Modal.success({
                        title: "It's Done",
                        content: response.message,
                        onOk: function () {
                            thisObj.setState({ refreshFor: "" }, () => { thisObj.props.reload(); });


                        }

                    });
                }
            }).catch(error => error);
    }


    handleCancel = () => {
        this.setState({ generateXMLPopUp: false, showImport: false, });
    }
    ConfirmationCancel = () => {
        this.setState({ confirmation: false, refreshFor: "" });
    }
    render() {
        const { StudyID, projectStudyLockStatus, projectInActive, history, defineActivityWorkflowStatus, wrkFlowStatus } = this.context;
        const { refreshFor, progress } = this.state;
        return (


            <LayoutContentWrapper style={{ width: "100%", height: "100%" }}>

                {<div style={{ margin: "auto" }}>
                    <Spin indicator={antIcon} spinning={this.state.loading}>
                        <Button style={Btncss} className="reacTable-addbtn" disabled={!definePermission(defineActivityWorkflowStatus)} onClick={() => thisObj.fnForRefresh(StudyID, "data")} name="Dataset Refresh">
                            <Icon type="file" theme="outlined" /><span>Dataset Refresh</span>
                        </Button>

                        <Button style={Btncss} className="reacTable-addbtn" onClick={() => thisObj.fnForPreCheck(StudyID)} name="Precheck" disabled={!DefinePermissionCompleted(defineActivityWorkflowStatus)}>
                            <Icon type="check-square" theme="outlined" /><span>Precheck</span>
                        </Button>

                        <Button style={Btncss} className="reacTable-addbtn" onClick={() => thisObj.fnForXML(StudyID)} name="Generate Define" disabled={!DefinePermissionCompleted(defineActivityWorkflowStatus)}>
                            <Icon type="snippets" theme="outlined" /><span>Generate Define</span>
                        </Button>

                        <Button style={Btncss} className="reacTable-addbtn" disabled={!definePermission(defineActivityWorkflowStatus)} onClick={() => thisObj.fnForRefresh(StudyID, "crf")} name="CRF Refresh">
                            <Icon type="file-sync" theme="outlined" /><span>CRF Refresh</span>
                        </Button>

                        <Button style={Btncss} className="reacTable-addbtn"
                            onClick={() => thisObj.exportDataAsExcel(StudyID, JSON.parse(sessionStorage.studyDetails).projectText + "_" + JSON.parse(sessionStorage.studyDetails).studyName)} name="ExportAsExcel"
                            disabled={!DefinePermissionCompleted(defineActivityWorkflowStatus)}>
                            <Icon type="export" theme="outlined" /><span>  Export Data in Excel</span>
                        </Button>

                        <Button style={Btncss}
                            className="reacTable-addbtn"
                            disabled={!definePermission(defineActivityWorkflowStatus)}
                            onClick={() => thisObj.import(StudyID, JSON.parse(sessionStorage.studyDetails).databaseName)} name="Import">
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

                <Form>

                    <XMLGeneration stopLoading={this.stopLoading} load={this.state.load} projectStudyName={this.state.projectStudyName} studyID={StudyID} visible={this.state.generateXMLPopUp} handleCancel={this.handleCancel} preValidation={this.state.preValidation} />

                    <Confirmation loading={this.state.popupLoading} title={"Update " + this.state.confirmationTitle} onSubmit={this.serverCallForRefresh} visible={this.state.confirmation} handleCancel={this.ConfirmationCancel} />

                </Form>
                {
                    refreshFor !== ""  && <Progress progress={ progress } NoInitialPercent={true} />
                }
            </LayoutContentWrapper>


        );
    }


}