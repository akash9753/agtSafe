import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Breadcrumb, Icon, Modal, Form, Dropdown,Menu} from 'antd';
import { Link } from 'react-router-dom';
import Box from '../../components/utility/box';
import Button from '../../components/uielements/button';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import moment from 'moment-timezone';
import ContentHolder from '../../components/utility/contentHolder';
import IntlMessages from '../../components/utility/intlMessages';
import ReactTable from '../Utility/reactTable';
import { getProjectRole } from '../Utility/sharedUtility';
import { stringSorter } from "../Utility/htmlUtility";
import {
    CallServerPost,
    errorModal,
    showProgress,
    hideProgress,
    validJSON,
    dynamicModal,
    checkPermission,
    PostCallWithZone,
    errorModalCallback,
    successModalCallback
} from '../Utility/sharedUtility';
import authAction from '../../redux/auth/actions';
//import { workflowActionButton, afterEsignVerfied } from '../Study/WorkFlowBtn';
import ConfirmWithEsign from '../Study/confirmationWithEsign';
import CommentModal from '../TreeView/comments.js'
import Notifications from './Notifications';
import TreeView from '../TreeView';
import { setHeader } from '../Topbar/Topbar';
import createHistory from 'history/createBrowserHistory';
import { WorkflowDropdown } from './../Study/workflowDropdown';
import { ActivityWorkspace } from '../Study/ActivityWorkspace';

import { NOTYETCONFIGURED } from '../Utility/appConstants';
const antIcon = <Icon type="loading" style={{ padding:"0px !important",fontSize: 24, color: '#17242c' }} spin />;
const { logout } = authAction;

const rowStyle = {
    width: '100%',
    display: 'flex',
    flexFlow: 'row wrap',

};
const colStyle = {
    height: 200,
    marginBottom:8
};
const box = {
    borderColor: "#ddd",
    borderRadius: "5px",
    border: "1px solid rgb(221, 221, 221)",
    background: "#fff",
    padding: "10px",
    marginBottom:10,
}
const gutter = 8;
const mainDivStyles = {
    width: '100%',
    height: '100%'
};
const centerDivStyles = {
    textAlign: 'center',
    marginTop: 50,
    fontSize:30
};
const margin = {
    margin: '0 5px 5px 0'
};
var userRole;
var thisObj = "";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        const projectRole = getProjectRole();

        var workflowActivityStatusID, projectStudyLockStatus, standardName;

        //following line is for open selected study popup when from workspace
        let locationState = props.history.location ? props.history.location.state : {};
        let isOpenSelectedStudy = locationState ? locationState.openSelectedStudy : false;

        if (isOpenSelectedStudy && locationState)
        {
            let selStudy = JSON.parse(sessionStorage.studyDetails);
            if (selStudy && typeof selStudy === "object") {
                const studyLocked = selStudy.locked;
                const projectInActive = selStudy.projectStatusID = 5 ? false : true;

                projectStudyLockStatus = projectInActive ? true : (selStudy.studyStatus ? true : false);
                standardName = sessionStorage.getItem("standard");
                workflowActivityStatusID = selStudy.workflowActivityStatusID;
            }
        }

        this.state =
        {
            esign:false,
            datasource: [],
            userRole: projectRole.role.RoleName,
            commentFlag: false,
            permissions: props.permissions,
            studyID: -1,
            projectID: -1,
            esignText: "",
            studyList: [],
            TreeViewVisble: isOpenSelectedStudy,
            workflowActivityStatusID: workflowActivityStatusID,
            projectStudyLockStatus: projectStudyLockStatus,
            standardName: standardName,
            studyName:""

        };
        thisObj = this;
        thisObj.getList();

        if (!isOpenSelectedStudy)
        {
            setHeader(false);
        }

    }
    componentDidMount() {
        const history = createHistory();
        if (history.location.state && history.location.state.openSelectedStudy) {
            let state = { ...history.location.state };
            delete state.openSelectedStudy;
            history.replace({ ...history.location, state });
        }

    }
    getList = () => {
        const projectRole = getProjectRole();
        showProgress();

        CallServerPost('Study/GetStudyListForDashBoard ', { UserID: projectRole.userProfile.userID, ProjectID: projectRole.project.ProjectID, RoleID: projectRole.role.RoleID })
            .then(
                function (response) {
                    //console.log(response);
                    if (response.value !== null) {
                        const resObj = response.value
                        var datas = [];
                        const {
                            StudyList,
                            StudyWorkflow,
                            WorkflowActivityStatusTransition,
                            ActivityWorkflowByProject
                        } = resObj;

                        //get studyWorkFlow for the study 

                        const permissions = thisObj.props.permissions;

                        for (var i = 0; i < StudyList.length; i++) {

                            const study = StudyList[i];
                            const studyid = study.studyID;
                            const studyWorkFlow = StudyWorkflow.find(wrkFlo => wrkFlo.studyID === studyid);

                            if (!studyWorkFlow) {
                                continue;
                            }


                            const standardName = study.standardText;  //to pass standardName to workspace
                            const studyLocked = StudyList[i].locked;
                            const studyName = StudyList[i].studyName;
                            const workflowActivityStatusID = StudyList[i].workflowActivityStatusID;
                            const directoryName = StudyList[i].projectText + "_" + StudyList[i].studyName;
                            const projectInActive = StudyList[i].projectStatusID = 5 ? false : true;

                            //Filter Activity Workflow By Study
                            // Variable ActivityWorkflowByProject contains all WFS by project
                            const ActivityWorkStatusflowByStudy = ActivityWorkflowByProject.filter(wf => wf.studyID === studyid);
                            //Get the current WF status
                            let status =
                            {
                                Annotation: NOTYETCONFIGURED,
                                Mapping: NOTYETCONFIGURED,
                                Program: NOTYETCONFIGURED,
                                Define: NOTYETCONFIGURED
                            }

                            ActivityWorkStatusflowByStudy.map(wfs => {
                                switch (wfs.workflowActivityID) {
                                    //Annotation
                                    case 2:
                                        status.Annotation = wfs.studyText;
                                        return;
                                    //Transformation
                                    case 3:
                                        status.Mapping = wfs.studyText;
                                        status.Program = wfs.studyText;
                                        return;
                                    //Define
                                    case 4:
                                        status.Define = wfs.studyText;
                                        return;
                                }
                            });

                            let workspcaePermission = permissions.StudyWorkSpace;

                            const workspaceMenu = (
                                <Menu onClick={(e) => {
                                    status[e.key] !== NOTYETCONFIGURED &&
                                        thisObj.workspace(study, ActivityWorkStatusflowByStudy, e.key);
                                }}>
                                    {
                                        study.annotationRequired && checkPermission(workspcaePermission, ['Annotation']) >= 1  &&
                                        <Menu.Item key="Annotation">
                                            <Icon type="file-text" />
                                            Annotation - {status.Annotation}
                                        </Menu.Item>
                                    }
                                    {
                                        study.mappingRequried && checkPermission(workspcaePermission, ['Mapping']) >= 1 &&
                                        <Menu.Item key="Mapping">
                                            <Icon type="code" />
                                                Mapping -  {status.Mapping}
                                        </Menu.Item>
                                    }
                                    {
                                        study.mappingRequried && checkPermission(workspcaePermission, ['Mapping']) >= 1 &&
                                        <Menu.Item key="Program">
                                            <Icon type="file-done" />
                                                Output Generation -  {status.Mapping}
                                        </Menu.Item>
                                    }
                                    {
                                        study.defineRequired &&  checkPermission(workspcaePermission, ['Define']) >= 1 &&
                                        <Menu.Item key="Define">
                                            <Icon type="read" />
                                            Define XML -  {status.Define}
                                        </Menu.Item>
                                    }
                                </Menu>

                            );

                            const studyWorkSpaceCell = checkPermission(permissions, ['StudyWorkSpace']) >= 1 ?
                                <Dropdown overlay={workspaceMenu}>
                                    <Button
                                        size="small"
                                        shape="round"
                                        style={margin}
                                        name={StudyList[i].studyName + "_StudyWorkSpace"}
                                    >
                                        <i className="fas fa-external-link-alt" />
                                    </Button>
                                </Dropdown> : null;
                                                    

    

                            //Get Workflow Column actions
                            //const { updateWorkFlow, fnToViewComment } = thisObj;
                            //Paremeters
                            //Study
                            //StudyWorkflow,
                            //WorkflowActivityStatusTransition
                            //Fn for both workflow onchange and comment click
                            let parameters = {
                                study: study,
                                permissions: thisObj.props.permissions,
                                isProjectInActive: projectInActive,
                                studyWorkFlow: studyWorkFlow,
                                WorkflowActivityStatusTransition: WorkflowActivityStatusTransition,
                                fnForWorkflow: thisObj.beforeUpdateTheWorkFlow,
                                fnForComment: thisObj.fnToViewComment,
                                MappingStatus: status.Mapping,
                                ActivityWorkStatusflowByStudy: ActivityWorkStatusflowByStudy
                            };

                            const workflowCell = WorkflowDropdown(parameters);

                            datas.push({
                                key: StudyList[i].studyID,
                                workSpace: studyWorkSpaceCell,
                                studyName: StudyList[i].studyName,
                                sponsorName: StudyList[i].sponsorName,
                                // needs to done properly, temporary hardcoding
                                activityName: studyWorkFlow.workflowActivityID == 2 ? "Annotation" : studyWorkFlow.workflowActivityID == 3 ? "Transformation" : studyWorkFlow.workflowActivityID == 4 ? "Define XML" : "",
                                workflowActivityStatusText: StudyList[i].workflowActivityStatusText,
                                actions: workflowCell
                            });
                        }

                        thisObj.setState({
                            studyList: StudyList,
                            datas: datas,
                            dataSource: datas,
                            loading: false, esign: false
                        });
                    }
                    else {
                        thisObj.setState({ studyList: [], dataSource: [], loading: false });
                    }
                    hideProgress();

                }).catch(error => hideProgress());
    }

    //open workspace pop
    workspace = (study, ActivityWorkFlowStatus, ActivityName) => {
        //Is project active or inactive
        let projectStatus = study.isProjectInActive;
        //Session storage
        sessionStorage.setItem("studyDetails", JSON.stringify(study));
        sessionStorage.setItem("standard", study.standardName);
        sessionStorage.setItem("projectStudyLockStatus", projectStatus || study.locked);
        sessionStorage.setItem("workflowActivityStatusID", study.workflowActivityStatusID);
        const permissions = this.props.permissions;

        let projectStudyLockStatus = projectStatus ? true : (study.locked ? true : false);
        try {
            //Loader
            showProgress();
            CallServerPost('ActivityConfiguration/GetActivityConfigurationDetailsByStudyID',
                {
                    FormName: "Study",
                    ActionName: "Create",
                    ProjectID: study.projectID,
                    StudyID: study.studyID,
                })
                .then(function (res) {
                    if (res.status === 1) {
                        let { ActivityConfigList } = res.value;

                        let ActivityWorkSpace = new ActivityWorkspace(ActivityName);
                        ActivityWorkSpace.history = thisObj.props.history;

                        ActivityWorkSpace.data =
                        {
                            study: study,
                            by: "manual",
                            from: "Project",
                            projectInActive: projectStatus,
                            allActivityDetails: ActivityConfigList,
                            ActivityWorkFlowStatus: ActivityWorkFlowStatus,
                            permissions: permissions.StudyWorkSpace[ActivityName],
                            projectStudyLockStatus: projectStudyLockStatus
                        }

                        //Here functionn will fire
                        ActivityWorkSpace.GoToActivityWorkspace();

                        //set topbar header
                        setHeader();
                        //end
                    }
                    else {
                        hideProgress();
                    }
                });
        }
        catch (e) {
            hideProgress();
        }
    }

    //workflow staus update Start
    //Before update
    beforeUpdateTheWorkFlow = (targetStatusID, study, studyWorkFlow, availableWorkflows) => {
        //studyWorkFlow parameter means current workflow of study
        //Current study workflowActivityID, workflowActivityStatusID
        let { workflowActivityID, workflowActivityStatusID } = studyWorkFlow;

        //Workflow going to change to
        //Get workflowActivityStatusTransitionID
        //wrkflo.sourceStatusID means workflowActivityStatusID
        let changedWorkflowToUpdate = availableWorkflows.find(wrkflo => wrkflo.targetStatusID === targetStatusID);


        let data =
        {
            studyID: study.studyID,
            projectID: study.projectID,
            workflowActivityID: workflowActivityID,
            //targetStatusID means selected Workflow workflowActivityStatusID
            workflowActivityStatusID: targetStatusID,
            changeReason: changedWorkflowToUpdate.targetStatusText,
            workflowActivityStatusTransitionID: changedWorkflowToUpdate.workflowActivityStatusTransitionID
        }
        dynamicModal({
            title: "Confirmation",
            icon: "exclamation-circle",
            msg: "Do you want to change the status?",
            onOk: () => {
                if (changedWorkflowToUpdate.eSignRequired) {
                    showProgress();
                    thisObj.setState({
                        esign: true,
                        workFlowDataToUpdate: data,
                        esignText: thisObj.esignText(changedWorkflowToUpdate.targetStatusText.replace(/\s/g, ''))
                    })
                    hideProgress();

                } else {
                    thisObj.updateWorkFlow(data);
                }
            },
            onCancel: () =>
            {
                new Promise((res, rej) => {
                    thisObj.setState({ esign: false, dataSource: [] }, res());
                }).then(() => {
                    thisObj.setState({ dataSource: thisObj.state.datas });
                });
            }
        });

    }


    //After Esifn verify
    afterEsignVerfied = () => {
        let { workFlowDataToUpdate } = thisObj.state;
        thisObj.updateWorkFlow(workFlowDataToUpdate);
    }

    //Get Manual Esign text
    esignText = (WorkFlow) => {
        let text =
        {
            AnnotationReviewCompleted: "I have reviewed this annotated document.",
            TransformationReviewCompleted: "I have reviewed the mapping logic and verified the transformed output.",
            DefineGenerationReviewCompleted: "I have reviewed generated define XML.",
            StudyCompleted: "all the information that are present in the study is reviewed and completed without any errors.",
        }
        return text[WorkFlow];
    }


    //Final
    updateWorkFlow = (data) => {

        const projectRole = getProjectRole();
        const zones = moment.tz.guess();
        const timezone = moment.tz(zones).zoneAbbr();
        let updatedBy = projectRole.userProfile.userID;
        data.TimeZone = timezone;
        data.UpdatedBy = updatedBy;

        showProgress();
        PostCallWithZone("StudyWorkflow/UpdateWFAStatus", data).then(
            function (response) {
                hideProgress();
                if (response.status == 1) {
                    thisObj.setState({ esign: false, dataSource:[]});
                    successModalCallback(response.message, () => thisObj.getList(thisObj.props));
                }
                else {
                    thisObj.setState({ esign: false });
                    errorModalCallback(response.message, () => {
                        new Promise((res, rej) => {
                            thisObj.setState({ esign: false, dataSource: [] }, res());
                        }).then(() => {
                            thisObj.setState({ dataSource: thisObj.state.datas });
                        });
                    });
                }
            })
    }


    cancelEsign = (studyID) => {
        new Promise((res, rej) => {
            thisObj.setState({ esign: false, dataSource: [] }, res());
        }).then(() => {
            thisObj.setState({ dataSource: thisObj.state.datas });
        });
    }
    //End
    cancelPop = () => {
        thisObj.setState({ esign: false, commentFlag: false});
    }
    fnToViewComment = (study) => {
        // let currentStudy = JSON.parse(study);
        thisObj.setState({ studyID: study.studyID, projectID: study.projectID, commentFlag: true, studyName: study.studyName });
    }

    studyActions = (study, projectStatus, studyStatus, standardName, workflowActivityStatusID) =>
    {
        sessionStorage.setItem("studyDetails", JSON.stringify(study));
        sessionStorage.setItem("standard", standardName);
        sessionStorage.setItem("projectStudyLockStatus", projectStatus || studyStatus);
        let role = sessionStorage.getItem("role");
        let roleID = validJSON(role).RoleID;
        //showHeader
        setHeader();
        //end
        if (workflowActivityStatusID != 2 && workflowActivityStatusID != 6 && workflowActivityStatusID != 10) {
  
            thisObj.setState({
                study: study,
                projectStudyLockStatus: projectStatus ? true : (studyStatus ? true : false),
                standardName: standardName,
                workflowActivityStatusID: workflowActivityStatusID,
                TreeViewVisble: true
            });
        }
        else
        {
            errorModal("Please update the Workflow Activity Status!");
        }
    }

    studyActionss = (study) => {
        sessionStorage.setItem("studyDetails", JSON.stringify(study));
        sessionStorage.setItem("standard", "SDTM");
        this.props.history.push({
            pathname: '/trans/treeview',
            state: {
                projectInActive: false,
            }
        }
        );    }

//        validateRoleWithStatusID = () => {
//    let roleID = JSON.parse(sessionStorage.role).RoleID;

//    //return id's are workflow statusID
//        switch (roleID) {

//        //Data Annotator
//            case 5:                
//                return [2,3]; 
//        //Annotation Reviwer
//            case 6:
//                return [4];
//        //Mapping Programmer
//        case 7:            
//                return [6,7];
//        //Mapping Reviewer
//        case 8:
//                return [8, 10];
//        // Data Analyst
//        case 9:        
//                return [12,13,14];
//        default:
//            return [-1];

//    }
//}

    fnTreeViewCancel = () => {
        //set topbar header
         sessionStorage.removeItem("studyDetails")
         setHeader();
        //end
        this.setState({ TreeViewVisble: !this.state.TreeViewVisble });

    }
    render() {
        let roleID = JSON.parse(sessionStorage.role).RoleID;
        const { study, workflowActivityStatusID, projectStudyLockStatus, standardName, TreeViewVisble, studyList, esign, esignText, userRole, dataSource, commentFlag, permissions, projectID, studyID, studyName } = this.state;
        
        const columns = [{
            title: 'Work Space',
            dataIndex: 'workSpace',
            key: 'workSpace',
            width: 50,
        },
            {
            title: 'Study Name',
            dataIndex: 'studyName',
            key: 'studyName',
            width: 75,
            sorter: (a, b) => stringSorter(a, b, 'studyName'),
        },
        {
            title: 'Sponsor Name',
            dataIndex: 'sponsorName',
            key: 'sponsorName',
            sorter: (a, b) => stringSorter(a, b, 'sponsorName'),
            width: 75,

            },
            {
                title: 'Activity Name',
                dataIndex: 'activityName',
                key: 'activityName',
                sorter: (a, b) => stringSorter(a, b, 'activityName'),
                width: 75,

            },
            {
                title: 'Activity Status',
                dataIndex: 'workflowActivityStatusText',
                key: 'workflowActivityStatusText',
                sorter: (a, b) => stringSorter(a, b, 'workflowActivityStatusText'),
                width: 85,

            },{
            title: 'Workflow Activity Status',
            dataIndex: 'actions',
            key: 'actions',
            width: 100,


            }];

        return (        

                <Row>
                    <Col span={6}>
                        <div style={{ padding: '-30px' }}>

                        <Col span={24}><Notifications studyList={studyList} /></Col>

                        </div>
                    </Col>
                <Col span={18}>
                            {

                                (this.state.actionName != "Version" && this.state.actionName != "Reload") &&
                                <ReactTable
                                    searchText=""
                                    columns={columns}
                                    dataSource={this.state.dataSource}
                                    //addAction={(isProjectInActive) ? null : this.addStudy}
                                    scroll={{ y: "calc(100vh - 213px)" }}
                                />
                            }
                                <Form>
                                    {
                                        this.state.commentFlag && <Modal
                                            visible={this.state.commentFlag}
                                            maskClosable={false}
                                            style={{ top: 20, height: 'calc(100vh - 120px)' }}
                                            title={this.state.studyName + " - Comment"}
                                            width='85%'
                                            onCancel={this.cancelPop}
                                            footer={null}
                                            ref="modal"
                                        >

                                        <CommentModal permissions={permissions} isProjectInActive={false} projectID={this.state.projectID} studyID={this.state.studyID} />
                                        </Modal>
                                    }
                            
                    </Form>
                                {(TreeViewVisble) && <Form>
                                    

                                        <TreeView
                                            from={"Dashboard"}
                                            study={study}
                                            visible={true}
                                            projectStudyLockStatus={projectStudyLockStatus}
                                            projectInActive={this.props.isProjectInActive}
                                            standardName={standardName}
                                            history={this.props.history}
                                            workflowActivityStatusID={workflowActivityStatusID}
                                            TreeView={TreeView}
                                            permissions={permissions.StudyWorkSpace}
                                            cancel={this.fnTreeViewCancel}
                                            updateWhenAnnotationView={this.updateWhenAnnotationView}
                                        />
                                

                                        </Form>
                    }
                    {esign &&
                        <ConfirmWithEsign
                            esignText={esignText}
                            studyPage={this}
                            cancelEsign={this.cancelEsign}
                            visible={esign}
                            onSubmit={this.afterEsignVerfied} defaultValue={""} />
                    }

                        
                     </Col>
                </Row>                
        );
    }
}

export default connect(null, { logout })(Dashboard);