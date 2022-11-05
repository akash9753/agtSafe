import React, { Component } from 'react';
import { Tabs, Icon } from 'antd';
import { Annotation } from '.././ActivityConfig/Annotation';
import { DefineGeneration } from '../ActivityConfig/Define';
import ConfirmWithEsign from '../confirmationWithEsign';
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
    dynamicModal
} from '../../Utility/sharedUtility';
import {
    TreeNode
} from '../../../components/uielements/tree';
import moment from 'moment-timezone';
import WorkflowStatus from '../ActivityConfig/WorkflowStatus';
import Progress from '../../Utility/ProgressBar';


let offProgress = false;

const { TabPane } = Tabs;

const tabStyle = { height: "calc(100vh - 99px)", overflow: "auto" };
var thisObj;
export default class ActivityConfig extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ModalText: 'Content of the modal',
            screen: "",
            home: false,
            esign: false,
            pdfFiles: [],
            esignText: "",
            xptLocation: [],
            progress:"",
            selectedStatus: "",
            changeReason: false,
            defineWorkFlows: [],
            rawDatasetLocaton: [],
            fileRawDatasetSelect: [],
            workFlowDataToUpdate: [],
            annotationWorkFlows: [],
            transFormationWorkFlows: [],
            defineOutputTypeDropDown: [],
            activityConfigStatusDetails: [],
            ActivityConfigStatusDetailsList: [],
            updateData: [],
            status: this.initialiseStatus(),
            activeKey: "workflow_key"
        };
        thisObj = this;
        this.getGetActivityConfigurationByStudyID();
        this.getDDL();

    }

    initialiseStatus = () => {
        return {
            Annot: { text: "Not yet configured", id: -1 },
            Trans: { text: "Not yet configured", id: -1 },
            Define: { text: "Not yet configured", id: -1 },
        }
    }

    static getDerivedStateFromProps(newProps, currentState) {
        let { activeKey } = newProps;
        if (activeKey !== "Activity Configuration" && currentState.updateData.length > 0) {
            return {
                annotationWorkFlows: [],
                transFormationWorkFlows: [],
                defineOutputTypeDropDown: [],
                activityConfigStatusDetails: [],
                ActivityConfigStatusDetailsList: [],
                updateData: [], activeKey: "workflow_key"
            }
        }
    }

    //workflow Start
    //Before update
    beforeUpdateTheWorkFlow = (targetStatusID, Activitie) => {

        //Selcted study workflow obj
        let { study, workflowObj } = thisObj.props;

        let { ActivityConfigStatusDetailsList } = this.state;


        let changedWorkflowToUpdate = Activitie && Activitie.find(wrkflo => wrkflo.targetStatusID === targetStatusID);
        let selectedActivityWorkflow = changedWorkflowToUpdate && ActivityConfigStatusDetailsList.find(wf => wf.workflowActivityStatusID == changedWorkflowToUpdate.sourceStatusID);
        let { workflowActivityID, workflowActivityStatusID } = selectedActivityWorkflow;

        let data =
        {
            studyID: study.studyID,
            projectID: study.projectID,
            workflowActivityID: workflowActivityID,
            //targetStatusID means selected Workflow workflowActivityStatusID
            workflowActivityStatusID: targetStatusID,
            changeReason: changedWorkflowToUpdate.targetStatusText,
            workflowActivityStatusTransitionID: changedWorkflowToUpdate.workflowActivityStatusTransitionID,
            updatedDateTime: selectedActivityWorkflow.updatedDateTime,
            StudyWorkFlowID: selectedActivityWorkflow.studyWorkflowID
        }
        dynamicModal({
            title: "Confirmation",
            icon: "exclamation-circle",
            msg: "Do you want to change the status?",
            className: "UserAssignedPop",

            onOk: () => {
                if (changedWorkflowToUpdate.eSignRequired) {
                    showProgress();
                    thisObj.setState({
                        esign: true,
                        workFlowDataToUpdate: data,
                        esignText: thisObj.esignText(changedWorkflowToUpdate.targetStatusText.replace(/\s/g, ''))
                    });
                    this.props.UpdateStudyList();
                    hideProgress();
                }
                else {
                    thisObj.updateWorkFlow(data);
                }
            },
            onCancel: () => {
                thisObj.props.form.resetFields();
            }
        });

    }


    //After Esifn verify
    afterEsignVerfied = () => {
        let { workFlowDataToUpdate } = thisObj.state;
        workFlowDataToUpdate["eSignVerified"] = true;
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


        if (data.workflowActivityStatusTransitionID == 23)
        {
            thisObj.setState({ progress: "active" });

        }
        else {
            showProgress();
        }
        PostCallWithZone("StudyWorkflow/UpdateWFAStatus", data).then(
            function (response) {
                hideProgress();
                if (response.status == 1) 
                {
                    thisObj.setState({ esign: false, progress: "exception"  });
                    successModalCallback(response.message, () => { thisObj.reload() });
                }
                else {
                    thisObj.setState({ esign: false, progress: "exception" });

                    thisObj.props.form.resetFields();
                    thisObj.setState({ esign: false });
                    errorModalCallback(response.message, () => {
                        thisObj.props.form.resetFields();
                    });
                }
            })
    }


    cancelEsign = (studyID) => {
        thisObj.props.form.resetFields();
        this.setState({ esign: false });
    }


    //getGetActivityConfigurationByStudyID
    getGetActivityConfigurationByStudyID = (screen = "") => {
        const thisObj = this;
        let { study, workflowObj } = thisObj.props;

        //for filter the dropdown values of Annotation,Transformation,Define
        let { StudyWorkflow, WorkflowActivityStatusTransition } = workflowObj;
        //Selcted study workflow obj
        let currentWrkflwOfStudy = StudyWorkflow.find(w => w.studyID === study.studyID);
        //selected study workflowActivityStatusID
        let currentWorkflowActivityStatusID = currentWrkflwOfStudy && currentWrkflwOfStudy.workflowActivityStatusID;

        showProgress();

        CallServerPost('ActivityConfiguration/GetActivityConfigurationByStudyID',
            {
                FormName: "Study",
                ActionName: "Create",
                StudyID: study.studyID,
                ProjectID: this.props.projectID
            }).then(function (response) {
                //Maintain offProgress why because we are calling two controller simultaneously
                offProgress && hideProgress();
                offProgress = !offProgress;

                if (response.status === 1) {
                    let data = response.value;
                    if (data && typeof data === "object") {
                        let status = thisObj.initialiseStatus();
                        let annotationWorkFlows, transFormationWorkFlows, defineWorkFlows;
                        //Set the Status of Annotation,transformation and Define
                        (data.ActivityConfigStatusDetailsList || []).map(activitie => {
                            switch (activitie.workflowActivityID) {
                                //Annotation
                                case 2:
                                    {
                                        let AnnotWrkFlw = data.annotationStatus;

                                        let AnnotStaus = AnnotWrkFlw && AnnotWrkFlw.find(x => x.workflowActivityStatusID === activitie.workflowActivityStatusID);

                                        status.Annot =
                                        {
                                            text: AnnotStaus && AnnotStaus.displayText,
                                            id: AnnotStaus && AnnotStaus.workflowActivityStatusID && AnnotStaus.workflowActivityStatusID
                                        }
                                        //filter workflow based on current activitie workflowActivityStatusID                   
                                        annotationWorkFlows = WorkflowActivityStatusTransition.filter(wrkFlo => {
                                            return wrkFlo.sourceStatusID === activitie.workflowActivityStatusID
                                        });

                                    }
                                    break;
                                //Transformation
                                case 3:
                                    {
                                        let TransWrkFlw = data.transformationStatus;
                                        let TransStaus = TransWrkFlw && TransWrkFlw.find(x => x.workflowActivityStatusID === activitie.workflowActivityStatusID);
                                        status.Trans =
                                        {
                                            text: TransStaus && TransStaus.displayText,
                                            id: TransStaus && TransStaus.workflowActivityStatusID && TransStaus.workflowActivityStatusID
                                        }
                                        //filter workflow based on current activitie workflowActivityStatusID                       
                                        transFormationWorkFlows = WorkflowActivityStatusTransition.filter(wrkFlo => {
                                            return wrkFlo.sourceStatusID === activitie.workflowActivityStatusID
                                        });
                                    }
                                    break;
                                //Define
                                case 4:
                                    {
                                        let DefineWrkFlw = data.defineStatus;
                                        let DefineStaus = DefineWrkFlw && DefineWrkFlw.find(x => x.workflowActivityStatusID === activitie.workflowActivityStatusID);
                                        status.Define =
                                        {
                                            text: DefineStaus && DefineStaus.displayText,
                                            id: DefineStaus && DefineStaus.workflowActivityStatusID && DefineStaus.workflowActivityStatusID
                                        }

                                        //filter workflow based on current activitie workflowActivityStatusID                       
                                        defineWorkFlows = WorkflowActivityStatusTransition.filter(wrkFlo => {
                                            return wrkFlo.sourceStatusID === activitie.workflowActivityStatusID
                                        });
                                    }
                                    break;
                            }

                        });

                        //the following line is used only for when save the activity config
                        //have to reset the selected dropdown values
                        thisObj.props.form.resetFields();
                        //end

                        thisObj.setState({

                            status,
                            //screen: "Home",
                            updateData: data.ActivityConfigList,
                            defineWorkFlows: defineWorkFlows,
                            annotationWorkFlows: annotationWorkFlows,
                            transFormationWorkFlows: transFormationWorkFlows,
                            ActivityConfigStatusDetailsList: data.ActivityConfigStatusDetailsList,
                        });
                    }
                }
                else {
                    hideProgress();
                    thisObj.setState({
                        screen: "Home",
                        updateData: [],
                        defineWorkFlows: [],
                        annotationWorkFlows: [],
                        transFormationWorkFlows: [],
                        status: thisObj.initialiseStatus(),
                        ActivityConfigStatusDetailsList: [],
                    });
                }
            });
    }

    getDDL() {
        const thisObj = this;
        let { study } = thisObj.props;
        showProgress();

        CallServerPost('ActivityConfiguration/GetValuesForCreateActivityConfiguration', {
            FormName: "Study",
            ActionName: "Create",
            StudyID: study.studyID,
            ProjectID: this.props.projectID
        }).then(
            function (response) {
                //console.log(response);
                //Maintain offProgress why because we are calling two controller simultaneously
                offProgress && hideProgress();
                offProgress = !offProgress;

                if (response.status === 1) {
                    const studyData = response.value;
                    const treeLoop = (data, folderOnly, parent = -1, isRaw = false) =>
                        data.map(item => {
                            if (item.children) {
                                var notRaw = isRaw ? item.children.filter(ch => ch.folder === false).length > 0 : true;
                                return (
                                    <TreeNode selectable={folderOnly && item.folder && notRaw}
                                        key={item.key}
                                        value={item.key}
                                        title={item.title}
                                        parent={item.key}
                                    >
                                        {treeLoop(item.children, folderOnly, item.key,isRaw)}
                                    </TreeNode>
                                );
                            }
                            else {
                                var selectable = true;
                                if (folderOnly && !item.folder) {
                                    selectable = false;
                                }
                                if (item.key !== studyData["protocolDoc"]) {
                                    return <TreeNode parent={parent} selectable={selectable} key={item.key} value={item.key} title={item.title} />;
                                }
                            }
                        });


                    //Annotatoin,TransFormation,Define Dropdown values

                    //for Annotation CRFDocument
                    const pdfFiles = treeLoop([studyData["DocumentsTree"].pdfLocation], false);

                    //for transformation Output Standardized Dataset Location
                    //for Define Standardized Dataset Location
                    const xptLocation = treeLoop([studyData["DocumentsTree"].xptLocation], true);


                    //for Transformation Raw Dataset Location
                    const fileRawDatasetSelect = treeLoop([studyData["DocumentsTree"].sas7BdatLocation], false);

                    //for Transformation Raw Dataset Location
                    const rawDatasetLocaton = treeLoop([studyData["DocumentsTree"].sas7BdatLocation], true,-1,true);

                    thisObj.setState(
                        {
                            screen: "Home",
                            pdfFiles: pdfFiles,
                            xptLocation: xptLocation,
                            rawDatasetLocaton: rawDatasetLocaton,
                            fileRawDatasetSelect: fileRawDatasetSelect,
                            defineOutputTypeDropDown: studyData.defineOutputType,
                        });
                }
                else {
                    thisObj.setState(
                        {
                            screen: "Home",
                            pdfFiles: [],
                            xptLocation: [],
                            rawDatasetLocaton: [],
                            fileRawDatasetSelect: [],
                            defineOutputTypeDropDown: [],
                        });
                }
            }).catch(error => error);
    }

    reload = () => {
        offProgress = true;
        this.getGetActivityConfigurationByStudyID();
        this.props.UpdateStudyList();
    }

    onTabChange = (activeKey) => {
        this.setState({ activeKey: activeKey });
    };

    render() {
        var property = { ...this.props };
        let { progress } = this.state;
        return (
            <div style={tabStyle}>
                <Tabs activeKey={this.state.activeKey}
                    onChange={this.onTabChange}
                >
                    <TabPane
                        tab={
                            <span>
                                <Icon type="line-chart" />
                                Workflow Status
                            </span>
                        }
                        key="workflow_key"
                    >
                        {
                            <WorkflowStatus
                                {...property}
                                {...thisObj.state}
                                reload={this.reload}
                                beforeUpdateTheWorkFlow={this.beforeUpdateTheWorkFlow}
                            />}
                    </TabPane>
                    {(property.study.annotationRequired || property.study.mappingRequried) && <TabPane
                        tab={
                            <span>
                                <Icon type="apple" />
                                Transformation
                            </span>
                        }
                        key="transformation_key"
                    >
                            <Annotation
                                {...property}
                                {...thisObj.state}
                                reload={this.reload}
                                beforeUpdateTheWorkFlow={this.beforeUpdateTheWorkFlow} />

                    </TabPane>}
                    {property.study.defineRequired &&
                        <TabPane
                            tab={
                                <span>
                                    <Icon type="android" />
                                    Define XML
                                </span>
                            }
                        key="define_key"
                        >
                            <DefineGeneration {...property} {...thisObj.state} reload={this.reload} beforeUpdateTheWorkFlow={this.beforeUpdateTheWorkFlow} />
                        </TabPane>
                    }
                </Tabs>
                {this.state.esign &&
                    <ConfirmWithEsign
                        visible={this.state.esign}
                        studyPage={this}
                        defaultValue={""}
                        esignText={this.state.esignText}
                        cancelEsign={this.cancelEsign}
                        onSubmit={this.afterEsignVerfied}
                    />
                }
               { <Progress progress={progress} NoInitialPercent={true} />}

            </div>)
    }
}