import React, { Component } from 'react';
import {
    CallServerPost,
    dynamicModal,
    successModal,
    getStudyDetails,
    showProgress,
    hideProgress,
    errorModalCallback,
    annotationPermission
} from '../Utility/sharedUtility';
import { Icon, Row, Col, Modal } from 'antd';
import DataContext from "./DataContext";
import { MappingDatas, MappingData } from "./getMappingDatas";
import Box from '../../components/utility/box';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import ContentTab from './contentTab';
import createHistory from 'history/createBrowserHistory'

var datatoclosedoc = "";
const headerStyle = { height: "auto", backgroundColor: '#ffffff', padding: "0px  10px 10px 10px" };
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
var annotationList = [];
var annotationData = [];
var title = "";
let path = "";
var thisObj = "";

export default class TreeView extends Component {

    constructor(props) {
        super(props);
        //this.setLoaderValue = this.setLoaderValue.bind(this);
        let locationState = (props.location && props.location.state) ? props.location.state : {};

        this.state = {
            expandedKeys: [],
            searchValue: '',
            loading: true,
            autoExpandParent: true,
            annotationgData: [],
            annotationDataList: [],
            path: "",
            select: [],
            html: [],
            showHeader: false,
            annotationsWorkflowStatus:locationState.wrkFlowStatus,
            from: locationState.from,
            activityDetails: locationState.allActivityDetails,

        };
        thisObj = this;
    }

    componentWillUnmount() {
        if (document.getElementById("pdfmainscript") !== null) {
            document.getElementById("pdfmainscript").remove();
        }
        window.CloseDoc();

    }


    componentDidMount() {
        const history = createHistory();
    
        //if (history.location.state && history.location.state.by)
        //{
        //    //this will perform when from study page
        //    this.loadPdfViewer();
        //    let state = { ...history.location.state };
        //    delete state.by;
        //    history.replace({ ...history.location, state });
        //} else
        //{
            //this will perform when f5 click
            //get the mapping data when F5 Click 
            showProgress();
            let MappinDatas = new MappingData();
            MappinDatas.CallBack = this.loadPdfViewer;
            MappinDatas.GetInit();
        //}
    }

    genRandomID = () => {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    loadPdfViewer = (resolve = () => { }, reject = () => { }) => {
        showProgress();
        let userName = JSON.parse(sessionStorage.getItem("userProfile")).userName;
        userName = userName ? userName.replace(/@/g, "") : "";
        userName = userName ? userName.replaceAll(".", ""): "";
        const studyID = JSON.parse(sessionStorage.getItem("studyDetails")).studyID;
        const controlID = userName + "_" + studyID + this.genRandomID();
        sessionStorage.setItem("controlID", controlID);
        const docuViewareConfiguration = {
            SessionId: controlID,
            ControlId: controlID,
            AllowPrint: false,
            EnablePrintButton: false,
            AllowUpload: false,
            EnableFileUploadButton: false,
            CollapsedSnapIn: false,
            ShowAnnotationsSnapIn: false,
            EnableRotateButtons: false,
            EnableZoomButtons: true,
            EnablePageViewButtons: false,
            EnableMultipleThumbnailSelection: false,
            EnableMouseModeButtons: false,
            EnableFormFieldsEdition: false,
            EnableTwainAcquisitionButton: false,
            EnableDocumentsDrop: false,
            EnableTextSelection: false,
            EnableLoadFromUriButton: false,
            ShowAnnotationsCommentsSnapIn: true,
            ForceScrollBars: true,
            EnableFullScreenButton: true,
            EnableMarqueeZoomModeButton: false,
            EnableSaveButton: false,
            EmbedJQuery: false,
            EnablePanModeButton: false,
            CollapseSnapinOnDocumentClosed: false,
        };

        //Loader
        showProgress();
        CallServerPost('Study/GetCRFORProtocolDocumentPath', { StudyID: JSON.parse(sessionStorage.getItem("studyDetails")).studyID, ActivityID: 323, RoleID: JSON.parse(sessionStorage.role).RoleID })
            .then(
                function (response) {
                    if ((response !== null && response.value != null) ? (Object.keys(response.value).length > 0) ? true : false : false) {
                        sessionStorage.pdfDetails = JSON.stringify(response.value);
                        docuViewareConfiguration.PathName = response.value.docTempPath;
                        thisObj.LoadPdf(thisObj, docuViewareConfiguration, controlID, resolve, reject);
                    }
                    else if (response.value == null && response.status == 0) {
                        hideProgress();
                        sessionStorage.pdfDetails = null;
                        errorModalCallback(response.message, thisObj.back);
                        reject();
                    } else {
                        hideProgress();
                    }
                }).catch((error) => {
                    //Loader
                    hideProgress();
                });

    }



    LoadPdf = (thisObj, docuViewareConfiguration, controlID, resolve, reject) => {
        //Getting all users from server        
        showProgress();
        CallServerPost('Pdf/InitPdfViewer', docuViewareConfiguration)
            .then(
                function (response) {
                    //Loader
                    hideProgress();
                    if (response.value !== null) {
                        const pdfhtml = response.value;
                        var res = pdfhtml.slice(pdfhtml.indexOf("<script>") + 8, pdfhtml.indexOf("</script>"));
                        if (document.getElementById("pdfmainscript") !== null) {
                            document.getElementById("pdfmainscript").remove();
                        }
                        const s = document.createElement('script');
                        s.async = true;
                        s.innerHTML = res;
                        s.id = "pdfmainscript";
                        thisObj.setState({ html: <div style={{ height: '100%', width: '100%' }} id={controlID} dangerouslySetInnerHTML={{ __html: pdfhtml.replace(res, "") }} /> });
                        const mds = MappingDatas;
                        let allDomianVars = (mds.Standards.Variable || []).map(function (variable) {
                            let filData = mds.Standards.Domain.filter(x => x.cdiscDataStdDomainMetadataID == variable.cdiscDataStdDomainMetadataID);
                            if (filData.length > 0) {
                                return {
                                    label: filData[0].domain + "." + variable.variableName,
                                    data: { StdDomainMetadataID: variable.cdiscDataStdDomainMetadataID, StdVariableMetadataID: variable.cdiscDataStdVariableMetadataID }
                                };
                            }
                        });
                        let allSrcVars = (MappingDatas.SourceDataset.Variable || []).map(function (srcDomain) {
                            return srcDomain.TABLE_NAME + "." + srcDomain.COLUMN_NAME;
                        });

                        s.innerHTML = s.innerHTML + 'var allDomianVars =  ' + JSON.stringify(allDomianVars) + ';' +
                            'var allSrcVars =  ' + JSON.stringify(allSrcVars) + ';' + 'addAutoComplete();';
                        document.body.appendChild(s);
                        window.initButtons(controlID);

                        //Resolve
                        resolve();

                    } else {
                        reject();
                    }

                }).catch((error) => {
                    //Loader
                    hideProgress();
                });
    }

    back = () => {
        let { from } = this.state;
        if (from === "Dashboard") {
            thisObj.props.history.push("/trans", { openSelectedStudy: true })
        } else {
            thisObj.props.history.push("/trans/project", { openSelectedStudy: true })

        }
    }

    fnToHideShowTreeView = () => {
        this.setState({ treeVisible: !this.state.treeVisible });
    }
    toggleContent = (toggle) => {
        thisObj.setState({ showHeader: toggle });
    }
    render() {
        return <LayoutWrapper id="treeview_layout" >
           
                <Box style={{ display: "flex", flexDirection: "column", padding: "6px 0px 10px 0px", height: 'calc(100vh - 80px)' }}>
                {this.state.showHeader && <Row style={{ display: "flex", flexDirection: "column" }}>
                    <Col span={24} >
                        <ContentTab
                            projectInActive={this.props.projectInActive}
                            history={this.props.history}
                            projectStudyLockStatus={this.props.projectStudyLockStatus}
                            fromDashboard={this.props.fromDashboard}
                            actidetails={this.state.activityDetails}
                        />
                    </Col>
                </Row>}
                    <Row id="pdfDivRow" style={{ display: "flex", flexDirection: "column", height: '100%' }}>
                        <Col id="pdfDiv" className={"AnnotStyle"} style={{ height: "100%" }}>
                            {this.state.html}
                        </Col>
                      </Row>
            </Box>
        </LayoutWrapper>
    }
}

                //following function to use progress in annotation.js page
window.showProgress = () => {
    showProgress();
}
window.hideProgress = () => {
    hideProgress();
}
window.pdf = function (pdfhtml) {
    thisObj.props.renderCallback(<div style={{ height: '100%', width: '100%' }} id={sessionStorage.controlID} dangerouslySetInnerHTML={{ __html: pdfhtml }} />);
}
window.initButtons = function (controlID) {
    window.initDoc();
    let {
        annotationsWorkflowStatus
    } = thisObj.state;
    if (annotationPermission(annotationsWorkflowStatus))
    {
        window.DocuViewareAPI.RegisterOnAnnotationEdited(controlID, window.UpdateAnnotation);
        window.DocuViewareAPI.RegisterOnAnnotationAdded(controlID, window.CreateAnnotation);
        window.DocuViewareAPI.RegisterOnAnnotationDeleted(controlID, window.fnToDeleteAnnot);
        window.DocuViewareAPI.RegisterOnAreaSelected(controlID, window.getSelectedAreaText);
        window.DocuViewareAPI.SetAnnotPropertiesToDisplay(controlID, 8, ["annotText", "annot_foreColor", "annot_fillColor", "annot_strokeColor"]);
        window.DocuViewareAPI.SetAnnotPropertiesToDisplay(controlID, 3, ["annot_strokeColor"]);
        window.DocuViewareAPI.SetAnnotPropertiesToDisplay(controlID, 6, ["annot_fillColor", "annot_strokeColor", "fill", "opacity"]);
        window.DocuViewareAPI.SetAnnotPropertiesToDisplay(controlID, 1, ["annot_fillColor", "annot_strokeColor", "fill", "opacity"]);
        window.DocuViewareAPI.CollapseSnapInPanel(controlID);

        window.allPdfComp.Internal.Annotations.defaultProperties[8]["annotText"] = "Text";
        window.allPdfComp.Internal.Annotations.defaultProperties[8]["annot_fillColor"] = "#FFFFFF";
        window.allPdfComp.Internal.Annotations.defaultProperties[8]["annot_foreColor"] = "#0000FF";
        window.allPdfComp.Internal.Annotations.defaultProperties[8]["annot_strokeColor"] = "#0000FF";
        window.allPdfComp.Internal.Annotations.defaultProperties[3]["annot_strokeColor"] = "#0000FF";
        window.allPdfComp.Internal.Annotations.defaultProperties[6]["annot_fillColor"] = "#FFFFFF";
        window.allPdfComp.Internal.Annotations.defaultProperties[6]["annot_strokeColor"] = "#0000FF";
        window.allPdfComp.Internal.Annotations.defaultProperties[1]["annot_fillColor"] = "#FFFFFF";
        window.allPdfComp.Internal.Annotations.defaultProperties[1]["annot_strokeColor"] = "#0000FF";
        window.addAutoComplete();
        window.addHyperLinkSnapIn();
        window.addToolBarSnapIn();
        window.addButtonsToSnapIn();
        window.fnDesktopViewCustomBtn();
        window.fnMobileViewCustomBtn();
        window.fnToGetLinkList();
    }
    else
    {
        window.isLockedfnDesktopViewCustomBtn();
        window.isLockedfnMobileViewCustomBtn();
        window.addHyperLinkSnapIn();
        window.fnForCloseHtml();
    }
}
window.annotationPermission = function (controlID) {
    let {
        annotationsWorkflowStatus
    } = thisObj.state;
    return annotationPermission(annotationsWorkflowStatus)
}
function closeDoc() {
    window.CloseDoc();
    //if (document.getElementById(controlID.getAttribute("name"))) {
    //    document.getElementById(controlID.getAttribute("name")).remove();
    //    sessionStorage.removeItem("controlID", controlID);

    //}
    let { from } = thisObj.state;

    if (from === "Dashboard") {
        thisObj.props.history.push("/trans", { openSelectedStudy: true });
    }
    else {
        thisObj.props.history.push("/trans/project", { openSelectedStudy: true });
    }
}
window.CloseDocuoment = function (Save = () => { }) {
    Modal.confirm({
        title: <span name='AlertTitle'>Confirmation</span>,
        icon: "exclamation-circle",
        content: <span name='AlertMessage'>Do you want to save the document?</span>,
        cancelButtonProps: {
            type: "danger",
        },
        className: "dynamicModal",
        okType: 'sc-ifAKCX fcfmNQ saveBtn rightBtnPop ',
        okText:"Save",
        onOk: function () {
            Save({
                msg: false,
                cb: () => {
                    closeDoc()

                }
            });
        },
        okButtonProps: {
            'name': 'AlertOK'
        },
        onCancel: function () {
            closeDoc();
        }
    });

}

//
//To initialize PDF After Save
window.initializePDF = function (resolve, reject) {
    thisObj.loadPdfViewer(resolve, reject);
}

//Toggle Header Content
window.ToggleHeader = function (toggle) {
    thisObj.toggleContent(toggle);
}

//backToTreeview
window.backToTreeview = function () {
    let { from } = thisObj.state;

    if (from === "Dashboard") {
        thisObj.props.history.push("/trans", { openSelectedStudy: true });
    }
    else {
        thisObj.props.history.push("/trans/project", { openSelectedStudy: true });
    }
}