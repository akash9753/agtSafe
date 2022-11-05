import React, { Component } from 'react';
import { Tooltip, Col, Row, Spin, Icon, Card, Modal, Empty } from 'antd';
import Tree, { TreeNode } from '../../components/uielements/tree';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { InputSearch } from '../../components/uielements/input';
import Button from '../../components/uielements/button';
import ContentTab from './contentTab';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import Box from '../../components/utility/box';
import {
    errorModal,
    showProgress,
    hideProgress,
    validJSON,
    CallServerPost,
    getStudyDetails,
    checkPermission,
} from '../Utility/sharedUtility';
import { METADATA_ANNOT, CRF_ANNOT } from '../Utility/appConstants';
import { MappingData, MappingDatas } from './getMappingDatas';
import {  CSSTransition } from 'react-transition-group';

const headerStyle = { height: "auto", backgroundColor: '#ffffff', padding: "0px  10px 10px 10px" };
const flexDisplay = { display: "flex", flexDirection: "column", padding: "6px 0px 10px 0px" };
let thisObj = {};


export default class TreeView extends Component {
    constructor(props) {
        super(props);

       
        this.fnToHideShowTreeView = this.fnToHideShowTreeView.bind(this);
        this.state = {
            studyID: 0,
            home: true,
            screen:false,
            loaded: false,
            define: false,
            loading: false,
            program: false,
            showHeader: true,
            displayDiv: null,
            viewImport: false,
            annotation: false,
            treeVisible: false,
            scriptElement: null,
            contentTabOpen: false,   
            defineActivity: false,
            annotationActivity: false,
            transformationActivity: false,
            status: this.initialiseStatus(),
            allActivityDetails: [],
            allActivityStatusDetails: []

        };
        thisObj = this;

    }

    initialiseStatus = () => {
        return {
            Annot:"Not yet configured",
            Trans:  "Not yet configured",
            Define:  "Not yet configured",
        }
    }
   
    componentWillUnmount() {
        sessionStorage.removeItem("projectInActive")
    }

    componentDidMount()
    {
        //Get Activity Configuration ByStudyID
        //For to check the study is configured 
        //If study is not configured means ,user allow to enter into the workspace
        const thisObj = this;
        let  study  = JSON.parse(sessionStorage.studyDetails);
        //loader
        showProgress();
        CallServerPost('ActivityConfiguration/GetActivityConfigurationByStudyID',
            {
                FormName: "Study",
                ActionName: "Create",
                StudyID: study.studyID,
                ProjectID: study.projectID
            }).then(function (response)
            {
                thisObj.initData();
                if (response.status === 1)
                {
                    let data = response.value;

                    if (data && typeof data === "object")
                    {
                        let status = thisObj.initialiseStatus();

                        let activity = data.ActivityConfigList;
                        let activitystatusdetails = data.ActivityConfigStatusDetailsList;

                        //Set the Status of Annotation,transformation and Define
                        (data.ActivityConfigStatusDetailsList || []).map(currentStatus =>
                        {
                            switch (currentStatus.workflowActivityID)
                            {
                                //Annotation
                                case 2:
                                    {
                                        let AnnotWrkFlw = data.annotationStatus;

                                        let AnnotStaus = AnnotWrkFlw && AnnotWrkFlw.find(x => x.workflowActivityStatusID === currentStatus.workflowActivityStatusID);

                                        status.Annot = AnnotStaus && AnnotStaus.displayText;
                                       
                                    }
                                    break;
                                //Transformation
                                case 3:
                                    {
                                        let TransWrkFlw = data.transformationStatus;

                                        let TransStaus = TransWrkFlw && TransWrkFlw.find(x => x.workflowActivityStatusID === currentStatus.workflowActivityStatusID);

                                        status.Trans = TransStaus && TransStaus.displayText;
                                      
                                    }
                                    break;
                                //Define
                                case 4:
                                    {
                                        let DefineWrkFlw = data.defineStatus;

                                        let DefineStaus = DefineWrkFlw && DefineWrkFlw.find(x => x.workflowActivityStatusID === currentStatus.workflowActivityStatusID);

                                        status.Define = DefineStaus && DefineStaus.displayText;
                                    }
                                    break;
                            }

                        });
                        thisObj.setState({
                            status,                          
                            screen: true,
                            allActivityDetails: activity,
                            allActivityStatusDetails: activitystatusdetails
                        });
                    }
                }
            
            });
       

    }

    //get Mapping Datas
    initData = () =>
    {
        const permissions = this.props.permissions;
        const studyDetails = getStudyDetails();
        const showMapping = () =>
        {
            if (studyDetails !== null && studyDetails.mappingRequried)
            {
                return true;
            }

            return false;
        };

        if (showMapping())
        {
            showProgress();
            let MappinDatas = new MappingData();
            MappinDatas.CallBack = () =>
            {
                hideProgress();
            }
            MappinDatas.GetInit();
        } else {
            hideProgress();
        }
    }

    fnToHideShowTreeView = () => {
        this.setState({ treeVisible: !this.state.treeVisible });
    }

    //Meta Data Annotation workspace
    annotation = () => {

        const {
            from,
            projectInActive,
            projectStudyLockStatus,
        } = this.props;

        const {
            status,
            allActivityDetails,
            allActivityStatusDetails
        } = this.state;
        const study = getStudyDetails();

        //Check Study is configured with Annotation
        let annotationRequiredField = allActivityDetails.find(acti => acti.configurationName === "AnnotationRequired");
        if (status.Annot !== "Not yet configured" && (annotationRequiredField && annotationRequiredField.configurationValue === "true" || study.annotationTypeText === METADATA_ANNOT)) {
            const permissions = this.props.permissions;
            if (study.annotationTypeText === METADATA_ANNOT) {
                showProgress();
                this.props.history.push("/trans/metadataAnnotation", {
                    permissions: permissions.Annotation,
                    projectStudyLockStatus: projectStudyLockStatus,
                    projectInActive: projectInActive,
                    by: "manual",
                    allActivityDetails: allActivityDetails,
                    AnnotActvtyList: allActivityDetails.filter(ac => ac.activityID === 323),
                    wrkFlowStatus: (allActivityStatusDetails || []).find(sta => sta.workflowActivityID === 2),
                    from: from
                });
            } else if (study.annotationTypeText == CRF_ANNOT) {
                showProgress();
                this.props.history.push("/trans/annotation", {
                    permissions: permissions.Annotation,
                    projectStudyLockStatus: projectStudyLockStatus,
                    projectInActive: projectInActive,
                    by: "manual",
                    allActivityDetails: allActivityDetails,
                    wrkFlowStatus: (allActivityStatusDetails || []).find(sta => sta.workflowActivityID === 2),
                    from: from
                });
            }
        }
    }

    //Mapping workspace
    mapping = () => {

        const {
            status,
            allActivityDetails,
            allActivityStatusDetails

        } = this.state;

        //Check Study is configured with Transformation
        if (status.Trans !== "Not yet configured")
        {
            const { from } = this.props;
            showProgress();

            this.props.history.push("/trans/mapping",
                {
                    projectInActive: getStudyDetails().projectInActive,
                    allActivityDetails: allActivityDetails,
                    from: from,
                    wrkFlowStatus: (allActivityStatusDetails || []).find(sta => sta.workflowActivityID === 3),

                });
        }
    }

    //Program Generation workspace
    programGeneration = () => {
        const {
            status,
            allActivityDetails,
            allActivityStatusDetails

        } = this.state;

        //Check Study is configured with Transformation
        if (status.Trans !== "Not yet configured")
        {
            const { from } = this.props;
            const permissions = this.props.permissions;
            showProgress();

            this.props.history.push("/trans/program",
                {
                    permissions: permissions.Program,
                    projectInActive: getStudyDetails().projectInActive,
                    allActivityDetails: allActivityDetails,
                    from: from,
                    wrkFlowStatus: (allActivityStatusDetails || []).find(sta => sta.workflowActivityID === 3),

                });
        } 
    }

    //Define workspace
    define = () =>
    {
        const {
            status,
            allActivityDetails,
            allActivityStatusDetails
        } = this.state;

        let currActivityStatus = allActivityStatusDetails && allActivityStatusDetails.find(x => x.workflowActivityID === 4);
        let currActivityID = currActivityStatus && currActivityStatus.workflowActivityStatusID;
        //Check Study is configured with Define
        if (status.Define !== "Not yet configured")
        {
            showProgress();

            const { projectStudyLockStatus, projectInActive, fromDashboard, workflowActivityStatusID, from } = this.props;
            const permissions = this.props.permissions;

            this.props.history.push("/trans/define", {
                permissions: permissions.Program,
                projectStudyLockStatus: projectStudyLockStatus,
                projectInActive: projectInActive,
                workflowActivityStatusID: currActivityID,
                allActivityDetails: allActivityDetails,
                from: from,
                wrkFlowStatus: (allActivityStatusDetails || []).find(sta => sta.workflowActivityID === 4),

            });
        }
    }

    checkPermission = (cardName) => {
        const permissions = this.props.permissions;
        const studyDetails = getStudyDetails();
        if (studyDetails) {
            switch (cardName) {
                case "Annotation":
                    {
                        const {
                            status,
                            allActivityDetails,
                            allActivityStatusDetails
                        } = this.state;

                        //Check Study is configured with Annotation
                        let annotationRequiredField = allActivityDetails.find(acti => acti.configurationName === "AnnotationRequired");
                        return checkPermission(permissions, ['Annotation']) >= 1 &&
                            (status.Annot === "Not yet configured" || studyDetails.annotationTypeText === METADATA_ANNOT || annotationRequiredField && annotationRequiredField.configurationValue === "true")
                    }
                case "Mapping":
                    return checkPermission(permissions, ['Mapping']) >= 1 &&
                        studyDetails.mappingRequried;

                case "Program":
                    return checkPermission(permissions, ['Program']) >= 1 &&
                        studyDetails.mappingRequried;
                case "Define":
                    return checkPermission(permissions, ['Define']) >= 1 &&
                        studyDetails.defineRequired;
            }
        } else {
            return false;
        }
    }

    render() {

        const {
            screen,
            status,
            define,
            program,
            showHeader,
            viewImport
        } = this.state; 
        const { allActivityDetails } = this.state;
        const { projectStudyLockStatus, projectInActive, fromDashboard } = this.props;
        const studyDetails = getStudyDetails();

        return (

            <React.Fragment>
                {screen &&
                    <Modal
                        visible={this.props.visible}
                        maskClosable={false}
                        style={{ top: 20, minHeight: 400 }}
                        centered
                        width='auto'
                        onCancel={this.props.cancel}
                        footer={null}
                    >
                        <LayoutWrapper id="treeview_layout" >

                            <Box style={flexDisplay}>
                                {showHeader &&
                                    <div style={{ ...headerStyle, display: "flex", flexDirection: "column" }} >
                                        <Row style={{ display: "flex", flexDirection: "column" }}>
                                            <Col span={24} >
                                                <ContentTab
                                                studyDetails={studyDetails}
                                                projectInActive={projectInActive}
                                                history={this.props.history}
                                                projectStudyLockStatus={projectStudyLockStatus}
                                                sideToggle={this.fnToHideShowTreeView}
                                                showToggleIcon={((define || program) && !viewImport)}
                                                fromDashboard={fromDashboard}
                                                actidetails={allActivityDetails}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                }
                                {
                                    <Row style={{ display: "flex", flexDirection: "column", height: '100%' }}>
                                        <Col style={{ height: "100%" }}>
                                            <LayoutContentWrapper style={{ height: "100%", width: "100%" }} >

                                                {
                                                    <div style={{ background: '#ECECEC', padding: '50px', height: "100%", width: '100%' }}>
                                                        <Row gutter={16}>
                                                            {
                                                                this.checkPermission("Annotation") &&
                                                                <Col
                                                                    //style={
                                                                    //    {
                                                                    //        display: "inline-block",
                                                                    //        boxShadow: "0 1px 2px 0 rgba(0,0,0,.15)",
                                                                    //        transition: "all .2s ease-in-out",
                                                                    //        ':hover': {
                                                                    //            boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
                                                                    //        }
                                                                    //    }
                                                                    //}
                                                                    span={8}
                                                                >
                                                                    <div style={{ display: "inline-block", height: "100%", width: "100%", minHeight: 100, minWidth: 200 }} >
                                                                        <CSSTransition
                                                                            in={true}
                                                                            timeout={400}
                                                                            classNames="list-transition"
                                                                            unmountOnExit
                                                                            appear

                                                                        >
                                                                            <Card
                                                                                title="Annotation"
                                                                                className={"treeviewCard"}
                                                                                onClick={this.annotation}
                                                                                bordered={false}>
                                                                                <div
                                                                                    onClick={(e) => e.stopPropagation()}
                                                                                    onDoubleClick={(e) => { e.stopPropagation(); this.annotation() }}
                                                                                >
                                                                                    Status : {status.Annot}
                                                                                </div>
                                                                            </Card>
                                                                        </CSSTransition>
                                                                    </div>
                                                                </Col>
                                                            }
                                                            {
                                                                this.checkPermission("Mapping") &&

                                                                <Col span={8}>
                                                                    <div style={{ display: "inline-block", height: "100%", width: "100%", minHeight: 100, minWidth: 200 }} >
                                                                        <CSSTransition
                                                                            in={true}
                                                                            timeout={500}
                                                                            classNames="alert"
                                                                            unmountOnExit
                                                                            appear
                                                                        >
                                                                            <Card
                                                                                title="Mapping"
                                                                                className={"treeviewCard"}
                                                                                onClick={this.mapping}
                                                                                bordered={false}
                                                                            >
                                                                                <div
                                                                                    onClick={(e) => e.stopPropagation()}
                                                                                      onDoubleClick={(e) => { e.stopPropagation(); this.mapping() }}
                                                                                >
                                                                                    Status : {status.Trans}
                                                                                </div>
                                                                            </Card>
                                                                        </CSSTransition>
                                                                    </div>
                                                                </Col>
                                                            }

                                                            {
                                                                this.checkPermission("Mapping") &&
                                                                <Col span={8}>
                                                                <div style={{
                                                                    display: "inline-block",
                                                                    height: "100%", width: "100%", minHeight: 100, minWidth: 200
                                                                }} >
                                                                        <CSSTransition
                                                                            in={true}
                                                                            timeout={550}
                                                                            classNames="list-transition"
                                                                            unmountOnExit
                                                                            appear

                                                                        >

                                                                            <Card title="Output Generation" onClick={this.programGeneration} className={"treeviewCard"} bordered={false}>
                                                                                <div
                                                                                    onClick={(e) => e.stopPropagation()}
                                                                                    onDoubleClick={(e) => { e.stopPropagation(); this.programGeneration() }}
                                                                                >
                                                                                    Status : {status.Trans}
                                                                                </div>
                                                                            </Card>
                                                                        </CSSTransition>
                                                                    </div>
                                                                </Col>
                                                            }
                                                            {
                                                                this.checkPermission("Define") &&
                                                                <Col span={8} >
                                                                    <div style={{ display: "inline-block", height: "100%", width: "100%", minHeight: 100, minWidth: 200 }} >
                                                                        <CSSTransition
                                                                            in={true}
                                                                            timeout={600}
                                                                            classNames="alert"
                                                                            unmountOnExit
                                                                            appear
                                                                        >
                                                                            <Card title="Define XML"
                                                                                className={"treeviewCard"}
                                                                                onClick={this.define}
                                                                                bordered={false}>
                                                                                <div
                                                                                    onClick={(e) => e.stopPropagation()}
                                                                                    onDoubleClick={(e) => { e.stopPropagation(); this.define() }}
                                                                                >
                                                                                    Status : {status.Define}
                                                                                </div>
                                                                            </Card>
                                                                        </CSSTransition>
                                                                    </div>
                                                                </Col>
                                                            }
                                                            {
                                                                !(this.checkPermission("Annotation") || this.checkPermission("Program") || this.checkPermission("Mapping") || this.checkPermission("Define")) &&
                                                                <Empty description={"No Action"} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                                            }
                                                        </Row>
                                                    </div>
                                                }
                                            </LayoutContentWrapper>
                                        </Col>
                                        {
                                            this.state.displayDiv !== null &&
                                            this.state.displayDiv
                                        }
                                    </Row>
                                }




                            </Box>
                        </LayoutWrapper>
                    </Modal>
                }
            </React.Fragment>


        );
    }
}

