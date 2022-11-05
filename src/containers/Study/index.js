import React, { Component } from 'react';
import {
    validJSON,
    showProgress,
    hideProgress,
    CallServerPost,
    errorModal,
    errorModalCallback,
    successModalCallback,
    successModal,
    PostCallWithZone,
    DownloadFileWithPostData,
    checkPermission,
    getProjectRole,
    dynamicModal,
    getUserID,
} from '../Utility/sharedUtility';
import { Modal, Icon, Breadcrumb, Form, Skeleton, Divider, Menu, Dropdown, Button, message } from 'antd';
import ConfirmModal from '../Utility/ConfirmModal';
import ReactTable from '../Utility/reactTable';
import LayoutContent from '../../components/utility/layoutContent';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import UpdateStudyModal from './editStudy';
import Version from './versionjs';
import { stringSorter } from '../Utility/htmlUtility';
import ImportFile from './import.js';
import XMLGeneration from './xmlGenerationVersionModal';
import Create from './Create';
import RoleAssignment from './roleAssignment';
import WorkFlow from './workFlow';
import { WorkflowDropdown } from './workflowDropdown'
import ActivityConfiguration from './ActivityConfig/ActivityConfiguration';
import StudyConfigModal from './StudyConfig';
import StudyInfo from './StudyConfig/StudyInfo';
//Importing ButtonWithToolTip for Actions
import { CSSTransition } from "react-transition-group";
import { setHeader } from '../Topbar/Topbar';
import moment from 'moment-timezone';

import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
//SwitchToolTip Importing
import SwitchToolTip from '../Tooltip/SwitchToolTip';
import ConfirmWithEsign from './confirmationWithEsign';
import TreeView from '../TreeView';
import { createBrowserHistory } from 'history';
import Progress from '../Utility/ProgressBar';
import { ActivityWorkspace } from './ActivityWorkspace';
import { NOTYETCONFIGURED } from '../Utility/appConstants';

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
const margin = {
    margin: '0 3px 0 0'
};

let schemavalidation = [];
let metadatavalidation = [];
let datavalidation = [];
var studyID;
var showEditModal, showEditStudy, showAddStudyModal, ShowStudyList, showSchemaValidation;
var showConfirmModalForStudyLockStatus, ProjectID, Locked;

let thisObj = {};
const projectRole = getProjectRole();
class StudyIndex extends Component {

    constructor(props) {
        super(props);

        this.state = {
            generateXMLPopUp: false,
            popUpLoading: false,
            dataSource: [],
            showEditModal: false,
            studyID,
            showEditStudy: false,
            showAddStudyModal: false,
            ShowStudyList: false,
            showSchemaValidation: false,
            schemaDataSource: [],
            schemaValidationTitle: "",
            dataValidationDataSource: [],
            dataValidationTitle: "",
            metaDataSource: [],
            metaDataValidationTitle: "",
            showConfirmModalForStudyLockStatus: false,
            ProjectID,
            Locked,
            actionName: "index",
            modalLoad: false,
            showImport: false,
            loading: false,
            load: 1,
            projectStudyName: "",
            showAddStudyModalNew: false,
            commentFlag: false,
            esign: false,
            esignText: "",
            defaultValue: "",
            mappingRequired: false,
            annotationRequired: false,
            defineRequired: false,
            disableBtn: false,
            adamEnabled: false,
            TreeViewVisble: false,
            projectStatus: false,
            studyStatus: 0,
            standardName: "",
            fromDashBoard: false,
            workflowActivityStatusID: -1,
            isAnnotVisible: false,
            studyName: "",
            study: {},
            autoOpenTreeview: false,
            workflowObj: [],
            studyConfigModal: false,
            progress: false,
            studyInfoModal: false
        };

        this.addStudy = this.addStudy.bind(this);
        //this.editStudy = this.editStudy.bind(this);
        ShowStudyList = this.props.visible;
        thisObj = this;

        thisObj.getList(this.props);

        ////If from mapping 
        //if (props.from === "mapping") {
        //    let study = JSON.parse(sessionStorage.getItem("studyDetails"));

        //    thisObj.studyActions(study.studyID, JSON.parse(props.isProjectInActive), study.studyLocked, study.standardName, study.workflowActivityStatusID);
        //}
        window.addEventListener('resize', this.Render);

    }

   
 
    
    refreshList = () => {
        this.getList(this.props);
    }

    permissionCheck = (btnName, study, permissions) => {
        if (checkPermission(permissions, [btnName]) >= 1) {
            if (!study.locked) {
                return true;
            }
        }
        return false;
    }
    //Study List from controller
    getList = (props) =>
    {
        showProgress();
        CallServerPost('Study/GetStudyByProjectRoleUser ',
            {
                UserID: JSON.parse(sessionStorage.userProfile).userID,
                ProjectID: props.projectId,
                RoleID: JSON.parse(sessionStorage.role).RoleID
            })
            .then(
                function (response)
                {
                    hideProgress();
                    let isProjectInActive = props.isProjectInActive;
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

                            const standardName = study.standardText;  //to pass standardName to workspace
                            const studyLocked = StudyList[i].locked;
                            const studyName = StudyList[i].studyName;
                            const workflowActivityStatusID = StudyList[i].workflowActivityStatusID;
                            const directoryName = StudyList[i].projectText + "_" + StudyList[i].studyName;

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

                            let workspcaePermission = permissions.StudyWorkSpace;

                            ActivityWorkStatusflowByStudy.map(wfs =>
                            {
                                switch (wfs.workflowActivityID)
                                {
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

                            const workspaceMenu = (
                                <Menu onClick={(e) => {
                                    if (status[e.key] !== NOTYETCONFIGURED) {
                                        thisObj.CheckAndGoToWorkSpace(study, ActivityWorkStatusflowByStudy, e.key);
                                    } else {
                                        message.destroy();
                                        message.error("Activity not configured!");
                                    }
                                }}>
                                    {
                                        study.annotationRequired && checkPermission(workspcaePermission, ['Annotation']) >= 1 &&
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
                                        study.defineRequired && checkPermission(workspcaePermission, ['Define']) >= 1 &&
                                        <Menu.Item key="Define">
                                            <Icon type="read" />
                                            Define XML -  {status.Define}
                                        </Menu.Item>
                                    }
                                    </Menu>
                                
                            );
                            const editCell = <div /*style={{ margin: '0 auto', display: 'table' }}*/>

                                {checkPermission(permissions, ['StudyWorkSpace']) >= 1 ?
                                    //<ButtonWithToolTip
                                    //    size="small"
                                    //    shape="round"
                                    //    style={margin}
                                    //    tooltip="Study Workspace"
                                    //    classname="fas fa-external-link-alt"
                                    //    name={StudyList[i].studyName + "_StudyWorkSpace"}
                                    //    onClick={() => thisObj.studyActions(study, JSON.parse(props.isProjectInActive), studyLocked, standardName, workflowActivityStatusID)}
                                    ///> : null}
                                    <Dropdown overlay={workspaceMenu}>
                                        <Button
                                            size="small"
                                            shape="round"
                                            style={margin}
                                            name={StudyList[i].studyName + "_StudyWorkSpace"}
                                        >
                                            <i className="fas fa-external-link-alt" />
                                        </Button>
                                    </Dropdown> : null

                                }

                                {<ButtonWithToolTip
                                    tooltip="Study Configuration"
                                    shape="round"
                                    size="small"
                                    style={margin}
                                    classname="fa fa-cogs"
                                    onClick={() => thisObj.studyConfiguration(study, studyName)}
                                />}

                                {<ButtonWithToolTip
                                    tooltip="Study Info"
                                    shape="round"
                                    size="small"
                                    style={margin}
                                    classname="fa fa-chart-line"
                                    onClick={() => thisObj.studyInfo(study, studyName)}
                                />}

                                {checkPermission(permissions, ['AuditLog']) >= 1 ?
                                    <ButtonWithToolTip
                                        name={StudyList[i].studyName + "_AuditLogDownload"}
                                        tooltip="Auditlog Download"
                                        shape="round"
                                        icon="audit"
                                        size="small"
                                        style={margin}
                                        onClick={() => thisObj.fnToDownloadAuditLog(studyid, directoryName)}
                                    /> : null}


                                {checkPermission(permissions, ['self']) >= 4 ?
                                    <ButtonWithToolTip
                                        name={StudyList[i].studyName + "_Delete"}
                                        tooltip="Delete"
                                        shape="round"
                                        classname="fas fa-trash-alt"
                                        size="small"
                                        disabled={workflowActivityStatusID !== 1 && workflowActivityStatusID !== 15}
                                        style={margin}
                                        onClick={() => thisObj.deleteStudy(studyid)}
                                    /> : null
                                }

                                {checkPermission(permissions, ['StudyLock']) >= 2 ? <SwitchToolTip
                                    name={StudyList[i].studyName + "_Unlock"}
                                    switchtooltip={StudyList[i].locked == 1 ? "Lock" : "Unlock"}
                                    onChange={(e) => { thisObj.updateStudyLockStatus(studyid, props.projectId, e) }}
                                    studyID={studyid} thisObj={thisObj} checkedChildren={<Icon type="check" />}
                                    unCheckedChildren={<Icon type="cross" />}
                                    checked={StudyList[i].locked == 1 ? false : true}
                                    style={margin}
                                    disabled={JSON.parse(props.isProjectInActive)}

                                /> : null}





                            </div>;

                            //Get Workflow Column actions
                            const { updateWorkFlow } = thisObj;
                            //Paremeters
                            //Study
                            //StudyWorkflow,
                            //WorkflowActivityStatusTransition
                            //Fn for both workflow onchange and comment click
                            const { getFieldDecorator } = thisObj.props.form;

                            let parameters = {
                                study: study,
                                permissions: permissions,
                                studyWorkFlow: studyWorkFlow,
                                getFieldDecorator: getFieldDecorator,
                                isProjectInActive: props.isProjectInActive,
                                WorkflowActivityStatusTransition: WorkflowActivityStatusTransition,
                                fnForWorkflow: thisObj.beforeUpdateTheWorkFlow,
                            };

                            const workflowCell = WorkflowDropdown(parameters);

                            datas.push({
                                key: StudyList[i].studyID,
                                actions: editCell,
                                studyName: StudyList[i].studyName,
                                studyStatus: StudyList[i].workflowActivityStatusText,
                                sponsorName: StudyList[i].sponsorName,
                                standardText: StudyList[i].standardText + " " + StudyList[i].standardVersionText,
                                workflowActions: workflowCell
                            });

                        }

                        thisObj.setState({
                            datas: datas,
                            dataSource: datas,
                            modalLoad: false,
                            WorkFlowModal: false,
                            showEditStudy: false,
                            actionName: "Index",
                            workflowObj:
                            {
                                StudyWorkflow: StudyWorkflow,
                                WorkflowActivityStatusTransition: WorkflowActivityStatusTransition
                            },
                            RoleAssignmentModal: false,
                            showAddStudyModalNew: false,
                            showConfirmModalForStudyLockStatus: false,

                        });

                    }
                    else {
                        thisObj.setState({
                            RoleAssignmentModal: false,
                            WorkFlowModal: false,
                            showEditStudy: false,
                            showAddStudyModalNew: false,
                            actionName: "Index",
                            dataSource: [],
                            datas: [],
                            loading: false,
                            modalLoad: false,
                            showConfirmModalForStudyLockStatus: false
                        });
                    }


                }).catch(error => error
                );
    }

    //Second time render
    //Update
    static getDerivedStateFromProps(nextProps) {
        let { isAutoOpen, isProjectInActive } = thisObj.props;
        let { TreeViewVisble, autoOpenTreeview } = thisObj.state;

        if ((typeof nextProps.projectId != "undefined" &&
            nextProps.projectId != null &&
            thisObj.props.projectId != nextProps.projectId) ||
            thisObj.state.actionName == "Version") {
            thisObj.props = nextProps;
            thisObj.setState({
                actionName: "Reload"
            })
            thisObj.getList(nextProps);
        } else if (isAutoOpen && !TreeViewVisble && !autoOpenTreeview) {
            //autoOpenTreeview for open the pop up when from workspace
            let study = JSON.parse(sessionStorage.getItem("studyDetails"));
            let standardName = sessionStorage.setItem("standard", standardName);
            thisObj.setState({
                autoOpenTreeview: true,
                study: study,
                TreeViewVisble: true,
                standardName: standardName,
                workflowActivityStatusID: study.workflowActivityStatusID,
                projectStudyLockStatus: isProjectInActive ? true : (study.locked ? true : false),
            });
        }
    }

    //Edit Study
    editStudy = (studyID) => {
        this.setState({ showEditStudy: true, studyID: studyID, actionName: "Update" });
    }

    //Add study
    addStudy = () => {
        // if (JSON.parse(sessionStorage.userProfile).userID === 20124) {
        this.showNewAddStudyModal();
        //} else {
        //    this.setState({ showAddStudyModal: true, actionName: "Create" });
        //}

    }

    //Delete Study
    deleteStudy = (studyID) =>
    {
        const configCallBack = (valueObj) => {
            thisObj.setState({ actionName: "Delete", showEditModal: true, studyID: valueObj.studyID });
        }
        this.CheckStudyFolderPermissions(configCallBack, { studyID: studyID});

        
    }


    CheckAndGoToWorkSpace = (study, ActivityWorkFlowStatus, ActivityName) => {
        

        const configCallBack = (valueObj) => {
            thisObj.workspace(valueObj.study, valueObj.ActivityWorkFlowStatus, valueObj.ActivityName);
        }
        this.CheckStudyFolderPermissions(configCallBack, { study: study, ActivityWorkFlowStatus: ActivityWorkFlowStatus, ActivityName: ActivityName });
    }

    //open workspace pop
    workspace = (study, ActivityWorkFlowStatus,ActivityName) =>
    {
        //Is project active or inactive
        let projectStatus = JSON.parse(this.props.isProjectInActive);
       //Session storage
        sessionStorage.setItem("studyDetails", JSON.stringify(study));
        sessionStorage.setItem("standard", study.standardName);
        sessionStorage.setItem("projectStudyLockStatus", projectStatus || study.locked);
        sessionStorage.setItem("workflowActivityStatusID", study.workflowActivityStatusID);
        const permissions = this.props.permissions;

        let projectStudyLockStatus = projectStatus ? true : (study.locked ? true : false);
        try
        {
                //Loader
                showProgress();
                CallServerPost('ActivityConfiguration/GetActivityConfigurationDetailsByStudyID',
                    {
                        FormName: "Study",
                        ActionName: "Create",
                        ProjectID: study.projectID,
                        StudyID: study.studyID,
                    })
                    .then(function (res)
                    {
                        if (res.status === 1)
                            {
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
                        else 
                        {
                            hideProgress();
                        }
                });
        }
        catch (e)
        {
            hideProgress();
        }
    }
    //Lock
    updateStudyLockStatus = (studyID, projectID, isLocked) => {

        const configCallBack = (valueObj) => {
            thisObj.setState({ actionName: "LockStatus", showConfirmModalForStudyLockStatus: true, studyID: valueObj.studyID, ProjectID: valueObj.projectID, Locked: valueObj.isLocked ? false : true });
        }
        this.CheckStudyFolderPermissions(configCallBack, { studyID: studyID, projectID: projectID, isLocked: isLocked });

    }
    //Version list
    fnForVersionList = (studyID) => {
        this.setState({ actionName: "Version", studyID: studyID });

    }
    //Cacel pop
    cancelPops = () => {
        this.setState({
            actionName: "Index",
            RoleAssignmentModal: false,
            WorkFlowModal: false,
            activityModal: false,
            studyConfigModal: false,
            studyInfoModal: false
        });

    }

    //Role Assignment
    showRoleAssignModal = (studyID, projectId, isLocked, workflowActivityStatusID, studyName) => {
        showProgress();
        CallServerPost('ActivityConfiguration/CheckAllActivityConfiguredByStudyID', { StudyID: studyID }).then(function (res) {
            if (res.status === 1) {
                CallServerPost('ActivityConfiguration/GetActivityConfigurationByStudyID',
                    {
                        FormName: "Study",
                        ActionName: "Create",
                        StudyID: studyID,
                        ProjectID: projectId
                    }).then(function (response) {
                        hideProgress();
                        if (response.status === 1) {

                            let activity = response.value.ActivityConfigList || [];
                            if (activity.length > 0) {
                                thisObj.setState({
                                    studyName: studyName,
                                    actionName: "RoleAssignment",
                                    ProjectID: projectId,
                                    RoleAssignmentModal: true,
                                    studyID: studyID,
                                    Locked: isLocked ? true : false,
                                    workflowActivityStatusID: workflowActivityStatusID
                                });

                            }
                            else {
                                hideProgress();

                                errorModal("Please configure the study activities before going into user assignment!");
                            }
                        }
                        else {
                            hideProgress();
                            errorModal("Please configure the study activities before going into user assignment!");
                        }
                    });
            } else {
                hideProgress();
                errorModal(res.message);
            }
        }
        );
    }

    //Activity config
    activityConfiguration = (study, studyName) => {
        this.setState({
            study: study,
            activityModal: true,
            actionName: "ActivityConfiguration",
            studyName: studyName
        })
    }

    CheckStudyFolderPermissions = (callback, valueObj) => {
        const thisObj = this;
        CallServerPost('Users/CheckUserPermissions',
            {
                ProjectID: thisObj.props.projectId,
                UserText: JSON.parse(sessionStorage.userProfile).emailAddress
            }).then(function (response) {
                hideProgress();
                if (response.status === 1) {
                    hideProgress();
                    callback(valueObj);
                }
                else {
                    hideProgress();
                    errorModal(response.message);
                }
            });
    }

    //Study config
    studyConfiguration = (study, studyName) =>
    {
        const thisObj = this;

        const configCallBack = (valueObj) => {
            sessionStorage.setItem("studyDetails", JSON.stringify(valueObj.study));
            thisObj.setState({
                study: valueObj.study,
                studyConfigModal: true,
                actionName: "StudyConfiguration",
                studyName: valueObj.studyName
            });
        }
        this.CheckStudyFolderPermissions(configCallBack, { study: study, studyName: studyName });
    }

    //Study info
    studyInfo = (study, studyName) => {

        const thisObj = this;

        const configCallBack = (valueObj) => {
            sessionStorage.setItem("studyDetails", JSON.stringify(valueObj.study));

            thisObj.setState({
                study: valueObj.study,
                studyInfoModal: true,
                actionName: "StudyInfo",
                studyName: valueObj.studyName
            })
        }
        this.CheckStudyFolderPermissions(configCallBack, { study: study, studyName: studyName });
        
    }

    workFlow = (studyID, projectId, studyName) =>
    {
        this.setState({
            actionName: "WorkFlow",
            WorkFlowModal: true,
            ProjectID: projectId,
            studyID: studyID,
            studyName: studyName
        });
    }


    generateXMLPopUpCancel = () => {
        thisObj.setState({ generateXMLPopUp: false });
    }


    //workflow Start
    //Before update
    beforeUpdateTheWorkFlow = (targetStatusID, study, studyWorkFlow, availableWorkflows) => {
        //studyWorkFlow parameter means current workflow of study
        //Current study workflowActivityID, workflowActivityStatusID
        let { workflowActivityID, workflowActivityStatusID } = studyWorkFlow;

        //Changed worflow by selected workflow in Dropdown
        //following variable is object of selected workflow in dropn
        //Get workflowActivityStatusTransitionID
        //wrkflo.sourceStatusID means workflowActivityStatusID
        let changedWorkflowToUpdate = availableWorkflows.find(wrkflo => wrkflo.targetStatusID === targetStatusID);


        let data =
        {
            studyID: study.studyID,
            projectID: study.projectID,
            workflowActivityID: workflowActivityID,
            //targetStatusID means  workflowActivityStatusID of selected Workflow in dropdown
            workflowActivityStatusID: targetStatusID,
            changeReason: changedWorkflowToUpdate.targetStatusText,
            workflowActivityStatusTransitionID: changedWorkflowToUpdate.workflowActivityStatusTransitionID,
            updatedDateTime: studyWorkFlow.updatedDateTime,
            StudyWorkFlowID: studyWorkFlow.studyWorkflowID
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
                        actionName: "UpdateStatus",
                        workFlowDataToUpdate: data,
                        esignText: thisObj.esignText(changedWorkflowToUpdate.targetStatusText.replace(/\s/g, ''))
                    })
                    hideProgress();

                } else {
                    thisObj.updateWorkFlow(data);
                }
            },
            onCancel: () => {
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

    deleteStudyAfterEsignVerified = () => {
        let values = {};
        thisObj.setState({ modalLoad: true });
        values["StudyID"] = thisObj.state.studyID;
        values["ChangeReason"] = thisObj.state.changeReason;
        values["TimeZone"] = "IST";
        showProgress();
        CallServerPost('Study/Delete', values)
            .then(
                function (response) {
                    hideProgress();
                    if (response.status === 1) {
                        thisObj.setState({ actionName: "index", modalLoad: false, showEditModal: false, esign: false });

                        successModalCallback(response.message, thisObj.getList(thisObj.props));
                    } else {
                        thisObj.setState({ modalLoad: false, showEditModal: false, esign: false });
                        errorModal(response.message);
                    }
                }).catch(error => error);
    }

    //Cancel Esign pop
    cancelEsign = (studyID) => {
        const { datas } = this.state;

        new Promise((res, rej) => {
            thisObj.setState({ esign: false, showEditModal: false, dataSource: [] }, res());
        }).then(() => {
            thisObj.setState({ dataSource: datas });
        });
    }
    //Final
    updateWorkFlow = (data) => {
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
                    thisObj.setState({ esign: false, dataSource: [] });
                    successModalCallback(response.message, thisObj.getList(thisObj.props));
                }
                else {
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

    //Get Manual Esign text
    esignText = (WorkFlow) => {
        let text = {

            StudyInProgress: "I am fully aware of my actions to make changes in a study that is already completed.",
            StudyCompleted: "all the information that are present in the study is reviewed and completed without any errors."
        }
        return text[WorkFlow];
    }

    //END

    //Auditlog
    fnToDownloadAuditLog = (studyID, directoryName) => {

      

        const configCallBack = (valueObj) => {
            var today = new Date(),
                date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '_' + today.getHours() + ':' + today.getMinutes();
            //showProgress();
            thisObj.socket_open();
            DownloadFileWithPostData('Study/GetAuditLogReport', valueObj.directoryName + "_AuditLog_" + date + ".pdf", { StudyID: valueObj.studyID }, "application/pdf").then(function () {
                thisObj.setState({ progress: "exception" });
                /* hideProgress();*/

            });
        }
        this.CheckStudyFolderPermissions(configCallBack, { studyID: studyID, directoryName: directoryName });


        //thisObj.setState({ loading: true });
        
    }


    socket_open = () => {
        thisObj.setState({ progress: "active" })
    }


    handleDelete = (changeReason) => {
        const thisObj = this;
        thisObj.setState({
            esign: true,
            changeReason: changeReason,
            showEditModal: false,
            esignText: "I have confirmed that this study needs to be deleted!"
        });
    }



    handleCancel = () => {
        this.setState({ showImport: false, showEditModal: false, showAddStudyModal: false, showEditStudy: false, showSchemaValidation: false, showConfirmModalForStudyLockStatus: false, commentFlag: false });
    }

    stopLoading = () => {
        this.setState({
            loading: false,
            load: -1
        });
    }
    refresh = () => {
        thisObj.getList(thisObj.props);

    }
    handleUpdateStudyLock = (ChangeReason) => {
        const thisObj = this;
        let values = {};

        values["ProjectID"] = this.state.ProjectID;
        values["StudyID"] = this.state.studyID;
        values["Locked"] = this.state.Locked;
        values["ChangeReason"] = ChangeReason;
        values["UpdatedBy"] = projectRole.userProfile.userID;;

        thisObj.setState({ modalLoad: true });
        PostCallWithZone('Study/UpdateStudyLockStatus', values)
            .then(
                function (response) {
                    if (response.status == 1) {
                        successModalCallback(response.message, thisObj.getList(thisObj.props));
                    } else {
                        thisObj.setState({ modalLoad: false, showConfirmModalForStudyLockStatus: false });
                        errorModal(response.message);
                    }
                }).catch(error => error);

    }

    showNewAddStudyModal = () => {
        this.setState({
            showAddStudyModalNew: true,
            actionName: "Create"
        });

    }

    cancelNewAddStudyModal = () => {
        this.setState({
            showAddStudyModalNew: false
        });
    }

    setModalCancel = (enable) => {
        this.setState({ disableBtn: enable });
    }

    fnTreeViewCancel = () => {
        let { isAutoOpen } = thisObj.props;

        //set topbar header
        sessionStorage.removeItem("studyDetails")
        setHeader();
        //end
        if (isAutoOpen) {
            this.props.isAutoOpenUpdate();
        }

        this.setState({
            TreeViewVisble: !this.state.TreeViewVisble,
            study: {}
        });
    }

    //Study Configuration 
    //When we successfully configured have to update study list
    //When we successfully change the status have to update study list
    StudyConfigPage_UpdateStudyList = () =>
    {
        thisObj.getList(thisObj.props);
    }

    render() {

        const { getFieldDecorator } = this.props.form;
        const { isProjectInActive } = this.props;
        const {
            esign,
            progress,
            esignText,
            workflowObj,
            defaultValue,
            RoleAssignmentModal,
            WorkFlowModal,
            activityModal,
            studyID,
            dataSource,
            Locked,
            workflowActivityStatusID,
            isAnnotVisible,
            study,
            studyName,
            studyConfigModal
        } = this.state;
        const permissions = this.props.permissions;

        const columns = [

            {
                title: 'Study Name',
                dataIndex: 'studyName',
                key: 'studyName',
                width: 50,
                sorter: (a, b) => stringSorter(a, b, 'studyName')
            },
            {
                title: 'Standard',
                dataIndex: 'standardText',
                key: 'standardText',
                width: 50,
                sorter: (a, b) => stringSorter(a, b, 'standardText')
            },
            //{
            //    title: 'Study Status',
            //    dataIndex: 'studyStatus',
            //    key: 'studyStatus',
            //    width: 170,
            //    sorter: (a, b) => stringSorter(a, b, 'studyStatus')

            //},

            {
                title: 'Study Workflow Status',
                dataIndex: 'workflowActions',
                width: 50,
                key: 'workflowActions'
            },
            {
                title: 'Study Actions',
                dataIndex: 'actions',
                width: 100,
                key: 'actions'
            }
        ];
        var showActions = true;
        //if (dataSource.length > 0) {
        //    dataSource.map(value => {
        //        value.actions.props.children.props.children.map(actions => {
        //            if (actions !== null) {
        //                showActions = true;
        //                return;
        //            }
        //        });
        //        if (showActions) {
        //            return;
        //        }
        //    });
        //}
        if (!showActions) {
            columns.shift(); // Removes Actions Co which contains all define actions
        }

        return (
            ShowStudyList ? (
                <React.Fragment>
                    <LayoutContentWrapper style={{ display: isAnnotVisible ? "none" : "block" }} >
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <i className="fas fa-clipboard-list" />
                                <span>{(this.state.actionName != "Version") ? "Study" : "Version"}</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                List
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <Divider className="divider-cs" />
                        <LayoutContent className={'studyList'}>

                            {
                                (this.state.actionName != "Version" && this.state.actionName != "Reload") &&
                                <ReactTable
                                    searchText=""
                                    columns={columns}
                                    dataSource={dataSource}
                                    id={"studyList"}
                                    addAction={(isProjectInActive) ? null : JSON.parse(sessionStorage.role).RoleID > 3 ? null : this.addStudy}
                                    scroll={{ y: "calc(100vh - 314px)", x: columns.length * 200 }}
                                />
                            }
                            {
                                this.state.actionName == "Reload" &&
                                <Skeleton
                                    active
                                    paragraph={{ rows: 10 }}
                                />
                            }
                            {
                                this.state.showAddStudyModalNew &&
                                <Create title="Add Study" action={this.state.actionName} studyListRefresh={this.refresh} projectId={this.props.projectId} parentRootProps={this.props.rootprops} visible={this.state.showAddStudyModalNew} handleCancel={this.cancelNewAddStudyModal} projectName={this.props.projectName} sponsorName={this.props.sponsorName} />
                            }
                            
                            {
                                (this.state.actionName === "Delete") ? <ConfirmModal loading={this.state.modalLoad} title="Delete Study" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} /> :
                                    (this.state.actionName === "LockStatus") ? < ConfirmModal loading={this.state.modalLoad} title="Update Study Lock Status" SubmitButtonName="Update" onSubmit={this.handleUpdateStudyLock} visible={this.state.showConfirmModalForStudyLockStatus} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} /> : ""

                            }
                           
                            {
                                (studyConfigModal) &&
                                <StudyConfigModal
                                    study={study}
                                    isProjectInActive={this.props.isProjectInActive}
                                    configVisible={studyConfigModal}
                                    workflowObj={workflowObj}
                                    handleCancel={this.cancelPops}
                                    form={this.props.form}
                                    projectID={this.props.projectId}
                                    studyName={thisObj.state.studyName}
                                    refreshList={this.refreshList}
                                    permissions={this.props.permissions}
                                    UpdateStudyList={this.StudyConfigPage_UpdateStudyList}
                                />
                            }

                            {
                                (this.state.studyInfoModal) &&
                                <StudyInfo
                                    study={study}
                                    isProjectInActive={this.props.isProjectInActive}
                                    configVisible={this.state.studyInfoModal}
                                    workflowObj={workflowObj}
                                    handleCancel={this.cancelPops}
                                    form={this.props.form}
                                    projectID={this.props.projectId}
                                    studyName={thisObj.state.studyName}
                                    refreshList={this.refreshList}
                                    permissions={this.props.permissions}
                                    UpdateStudyList={this.StudyConfigPage_UpdateStudyList}
                                />
                            }

                            
                            {esign && <ConfirmWithEsign
                                esignText={esignText}
                                studyPage={this}
                                defaultValue={defaultValue}
                                cancelEsign={this.cancelEsign}
                                visible={esign}
                                buttonName={this.state.actionName}
                                onSubmit={this.state.actionName === "Delete" ? this.deleteStudyAfterEsignVerified : this.afterEsignVerfied}
                            />}

                            {<Progress progress={progress}/>}


                        </LayoutContent>

                    </LayoutContentWrapper>

                </React.Fragment>) : (null)
        );
    }

}

const WrappedApp = Form.create()(StudyIndex);

export default WrappedApp;








