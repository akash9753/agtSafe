import React, { Component } from 'react';
import ActionBarModal from './actionBarModal';
import Spin from '../../styles/spin.style';
import { CallServerPost, getStudyDetails, errorModal, successModal, PostCallWithZone, showProgress, hideProgress } from '../Utility/sharedUtility';
import StdSpecModalContent from './StdSpecModalContent';
import Button from '../../components/uielements/button';
import { MappingDatas } from './getMappingDatas';
import Box from '../../components/utility/box';
const flexDisplay = { height: 'calc(100% - 26px) !important', display: "flex", flexDirection: "column", padding: "6px 0px 0px 0px" };

var allDataSource = [];
var dataSource = [];
var currentObj;
const style1 = {
    fontSize: 15,
    textAlign: 'start',
    textOverflow: 'ellipsis',
    width: "100%",
 
}
const style2 = {
    fontSize: 15,
    textAlign: 'center',
    textOverflow: 'ellipsis',    
    left: 0,
    right: 0,
    top: '5px'
}
export default class ContentTab extends Component {
    constructor(props) {
        super(props);
        this.setLoaderValue = this.setLoaderValue.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.state = {
            showStudyModal: false,
            modal: "",
            title: "",
            flag: false,
            loading: false,
            iconClassChange: true,
            allDataSource: [],
            dataSource: [],
            fileName: "",
            filePath: ""
        }
    }
    fnToViewStudy = (e) => {
        currentObj = this;
        allDataSource = [];
        dataSource = [];
        let modalValue = e.target.innerText;
        if (modalValue == "Std Spec") {
            /*Std Spec modal*/
            CallServerPost('StandardDomainMetadata/GetAllStdSpecificationDomainByStudyID', { StudyID: JSON.parse(sessionStorage.getItem("studyDetails")).studyID })
                .then(
                    function (response) {
                        if (response.value != null) {
                            currentObj.setState({ showStudyModal: true, modal: modalValue, title: modalValue, loading: true,flag: true, allDataSource: response.value.domainList, dataSource: response.value.variableList });
                        }

                    });

        } else if (modalValue == "Source Dataset")
        {
            let study = getStudyDetails();
            /*Source Dataset modal*/
            if (study &&
                typeof study === "object" &&
                "mappingRequried" in study &&
                study.mappingRequried)
            {
                currentObj.setState({ showStudyModal: true, modal: modalValue, title: modalValue, loading: true, flag: true, allDataSource: MappingDatas.SourceDataset.Domain, dataSource: MappingDatas.SourceDataset.Variable });
            } else {
                errorModal("No source dataset available")
            }
        }
        else if (modalValue == "View Study") {
        /*View Study modal*/
            showProgress();
            CallServerPost('Study/GetAllSourceDataSetMetaData', { StudyID: JSON.parse(sessionStorage.getItem("studyDetails")).studyID })
                .then(
                    function (response) {
                        if (response.value != null) {
                            currentObj.setState({ showStudyModal: true, modal: modalValue, title: modalValue, loading: true, flag: true, allDataSource: response.value.DomainMetadata, dataSource: response.value.VariableMetadata });
                        }
                        //hideProgress();
                    });
        }
        else if (modalValue == "Protocol Document") {
            showProgress();
            CallServerPost('Study/GetDocumentPath', { StudyID: JSON.parse(sessionStorage.getItem("studyDetails")).studyID, ActivityID: 322, RoleID: JSON.parse(sessionStorage.role).RoleID })
                .then(
                    function (response) {
                        if ((response !== null && response.value != null) ? (Object.keys(response.value).length > 0) ? true : false : false) {
                            currentObj.setState({ showStudyModal: true, modal: modalValue, title: modalValue, loading: true,fileName: response.value.docTempName, filePath: response.value.docTempPath, flag: true });
                        }
                        hideProgress();
                    });
            ///
            /*Protocol Document modal*/

        }
        else if (modalValue == "Annotated CRF") {
            showProgress();
            CallServerPost('Study/GetDocumentPath', { StudyID: JSON.parse(sessionStorage.getItem("studyDetails")).studyID, ActivityID: 323, RoleID: JSON.parse(sessionStorage.role).RoleID })
                .then(
                    function (response) {
                        if ((response !== null && response.value != null) ? (Object.keys(response.value).length > 0) ? true : false : false) {
                            currentObj.setState({ showStudyModal: true, modal: modalValue, title: modalValue, loading: true,fileName: response.value.docTempName, filePath: response.value.docTempPath, flag: true });
                        }
                        hideProgress();
                    });
         
        }
        else if (modalValue == "Configuration") {
            /*Configuration modal*/
            CallServerPost('Study/GetAllSourceDataSetMetaData', { StudyID: JSON.parse(sessionStorage.getItem("studyDetails")).studyID })
                .then(
                    function (response) {
                        if (response.value != null) {
                            currentObj.setState({
                                showStudyModal: true,
                                modal: modalValue,
                                title: modalValue,
                                loading: true,
                                flag: true,
                                allDataSource: response.value.DomainMetadata,
                                dataSource: response.value.VariableMetadata
                            });
                        }
                    });
        }
        else if (modalValue == "Comment") {
            /*Comment modal*/
            //CallServerPost('Study/GetAllSourceDataSetMetaData', { StudyID: JSON.parse(sessionStorage.getItem("studyDetails")).studyID })
            //    .then(
            //        function (response) {
            //            if (response.value != null) {
            //                currentObj.setState({ flag: true, allDataSource: response.value.DomainMetadata, dataSource: response.value.VariableMetadata });
            //            }
            //        });
            currentObj.setState({
                showStudyModal: true,
                modal: modalValue,
                title: modalValue, loading: true, flag: true
            });
        }
    }
    handleCancel = () => {
        currentObj = this;
        if (currentObj.state.modal == "Annotated CRF" || currentObj.state.modal == "Protocol Document") {
            PostCallWithZone('Study/DeleteCRFOrProtocolFiles', { FileLocation: currentObj.state.filePath })
                .then(
                    function (response) {
                        currentObj.setState({ flag: false, showStudyModal: false, fileName: "" });

                    }).catch(error => error);
        } else {
            currentObj.setState({  showStudyModal: false, fileName: "" });

        }

    }

    setLoaderValue = loaderVal => {
        if (loaderVal) {
            this.setState({ loading: false });
        }

    };

    //Icon ClassName Change Func when SideToggle Button clicked
    arrowChangeFunc = () => {
        this.setState({ iconClassChange: !this.state.iconClassChange });
    }

    //Check IS ProtocolConfigured
    //Check IS Crf document configured
    isConfigured = (ActivityName) => {
        let { actidetails } = this.props;

        return actidetails.some(ad => ad.configurationName === ActivityName && ad.configurationValue && ad.configurationValue != "");
    }
    //configuration btn is commented if you want copy and paste inside the return div
    //<div role="tab" aria-disabled="false" aria-selected="true" className="ant-tabs-tab" onClick={this.fnToViewStudy} >Configuration</div>
    render() {
        let { page, backBtn, from} = this.props;
        return (
            <div style={this.props.backBtn === true ? style1 : style2} >
                <Box className="boxwrappercontenttab" style={{ padding: 5}}>

                {
                    page === "home" && <Button  className="sideToggleBtn" onClick={(e) =>
                    {
                        
                        showProgress();
                        if (from === "Dashboard") {
                            this.props.history.push("/trans", { openSelectedStudy: true });
                        } else {
                            this.props.history.push("/trans/project",{ openSelectedStudy: true });
                        }
                        
                            e.stopPropagation();
                    }}
                    
                    >
                        <i className="fas fa-arrow-left" />
                    </Button>
                }{
                    this.props.showToggleIcon === true ? (<Button style={{ float: "left" }} className="sideToggleBtn" onClick={() => { this.props.sideToggle(); this.arrowChangeFunc(); }}>
                        <i style={{ fontSize: "18px", marginTop: "10px" }} className={this.state.iconClassChange ? " fas fa-chevron-circle-left" : "fas fa-chevron-circle-right"} />
                    </Button>) : ("")
                    }
                    <div className="ant-tabs-nav ant-tabs-nav-animated" style={{ padding: 5, border: "#375b6d", borderStyle: "solid", borderRadius: "20px", borderWidth:"1px" }} >
                        <div role="tab" aria-disabled="false" aria-selected="true" className="ant-tabs-tab contentTabPadding" onClick={this.fnToViewStudy} >View Study</div>
                        <div role="tab" aria-disabled="false" aria-selected="true" className="ant-tabs-tab contentTabPadding" onClick={this.fnToViewStudy} style={{ display: this.isConfigured("ProtocolDocumentLocation") ? "inline-block" :"none"}} >Protocol Document</div>
                        <div role="tab" aria-disabled="false" aria-selected="true" className="ant-tabs-tab contentTabPadding" onClick={this.fnToViewStudy}  >Std Spec</div>
                    <div role="tab" aria-disabled="false" aria-selected="true" className="ant-tabs-tab contentTabPadding" onClick={this.fnToViewStudy} >Source Dataset</div>
                        <div role="tab" aria-disabled="false" aria-selected="true" className="ant-tabs-tab contentTabPadding" onClick={this.fnToViewStudy} style={{ display: this.isConfigured("CRFDocument") ? "inline-block" : "none" }} >Annotated CRF</div>
                    <div role="tab" aria-disabled="false" aria-selected="true" className="ant-tabs-tab contentTabPadding" onClick={this.fnToViewStudy} >Comment</div>
                    </div>
                </Box>
                {
                    this.state.flag &&
                    <ActionBarModal handleCancel={this.handleCancel} visible={this.state.showStudyModal} modal={this.state.modal} title={this.state.title} sourceData={this.state.allDataSource} valueData={this.state.dataSource} fileName={this.state.fileName} />
                }
            </div>

        );
    }
}
