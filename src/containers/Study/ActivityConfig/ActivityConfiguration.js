import React, { Component } from 'react';
import {
    Col,
    Row,
    Modal,
    Card,
    Form,
    Select
} from 'antd';
import {
    TreeNode
} from '../../../components/uielements/tree';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import LayoutWrapper from '../../../components/utility/layoutWrapper';
import {
    errorModal,
    showProgress,
    hideProgress,
    dynamicModal,
    CallServerPost,
    getProjectRole,
    PostCallWithZone,
    successModalCallback,
    errorModalCallback,
} from '../../Utility/sharedUtility';
import ConfirmWithEsign from '../confirmationWithEsign';
import Box from '../../../components/utility/box';
import {
    CSSTransition
} from 'react-transition-group';
import { Annotation } from './Annotation';
import { DefineGeneration } from './Define';
import { Transformation } from './Transformation';
import moment from 'moment-timezone';


const flexDisplay = { display: "flex", flexDirection: "column", padding: "6px 0px 10px 0px" };
let thisObj = {};
let offProgress = false;

class ActivityConfiguration extends Component {
    constructor(props) {
        super(props);

        this.state =
        {
            screen: "",
            home: false,
            esign: false,
            pdfFiles: [],
            esignText: "",
            xptLocation: [],
            selectedStatus: "",
            changeReason: false,
            defineWorkFlows: [],
            rawDatasetLocaton: [],
            workFlowDataToUpdate: [],
            annotationWorkFlows: [],
            transFormationWorkFlows: [],
            defineOutputTypeDropDown: [],
            activityConfigStatusDetails: [],
            status: this.initialiseStatus(),
            ActivityConfigStatusDetailsList: [],
        };
        thisObj = this;

    }

    initialiseStatus = () => {
        return {
            Annot: { text: "Not yet configured", id: -1 },
            Trans: { text: "Not yet configured", id: -1 },
            Define: { text: "Not yet configured", id: -1 },
        }
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

                if (response.status === 1)
                {
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
                            screen: "Home",
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

        //console.log("Sometimes Values are not coming for options");
        //console.log(study.studyID);
        //console.log(this.props.projectID);

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
                                if (item.key !== studyData["protocolDoc"]) {
                                    return <TreeNode selectable={selectable} key={item.key} value={item.key} title={item.title} />;
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
                    const rawDatasetLocaton = treeLoop([studyData["DocumentsTree"].sas7BdatLocation], true);

                    thisObj.setState(
                        {
                            screen: "Home",
                            pdfFiles: pdfFiles,
                            xptLocation: xptLocation,
                            rawDatasetLocaton: rawDatasetLocaton,
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
                            defineOutputTypeDropDown: [],
                        });
                }
            }).catch(error => error);
    }

    //this code to cancel the popup when click cancel
    static getDerivedStateFromProps(newProp, currentState) {
        let { visible } = newProp;

        if (visible && !currentState.home) {
            thisObj.props = newProp;
            thisObj.getGetActivityConfigurationByStudyID();
            thisObj.getDDL();
            return {
                home: true
            }
        }
    }


    //Cancel
    cancel = () => {
        let { screen } = this.state;
        switch (screen) {
            case "Home":
                return this.props.handleCancel();
            default:
                return thisObj.setState({ screen: "Home" });
        }
    }

    //reload 
    //this will used by Annotation, Transformation and Define when succesfully saved
    reload = () => {
        offProgress = true;
       this.getGetActivityConfigurationByStudyID("Home")
    }




    //workflow Start
    //Before update
    beforeUpdateTheWorkFlow = (targetStatusID, Activitie) => {

        //Selcted study workflow obj
        let { study, workflowObj } = thisObj.props;

        let { ActivityConfigStatusDetailsList } = this.state;

        // current workflow of study
        //Current study workflowActivityID, workflowActivityStatusID
        //let { StudyWorkflow, WorkflowActivityStatusTransition } = workflowObj;

        //let selctedStudyWorkflow = StudyWorkflow.find(wf => wf.studyID === study.studyID);

        //let { workflowActivityID, workflowActivityStatusID } = selctedStudyWorkflow;

        //Workflow going to change to
        //Get workflowActivityStatusTransitionID
        //wrkflo.sourceStatusID means workflowActivityStatusID

        //let changedWorkflowToUpdate = WorkflowActivityStatusTransition.find(wrkflo => wrkflo.targetStatusID === targetStatusID);

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
            workflowActivityStatusTransitionID: changedWorkflowToUpdate.workflowActivityStatusTransitionID
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

        showProgress();
        PostCallWithZone("StudyWorkflow/UpdateWFAStatus", data).then(
            function (response) {
                hideProgress();
                if (response.status == 1) {

                    thisObj.setState({ esign: false });
                    successModalCallback(response.message, () => { thisObj.reload() });
                }
                else {
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
    render() {
        let {
            home,
            esign,
            status,
            screen,
            pdfFiles,
            esignText,
            updateData,
            xptLocation,
            changeReason,
            defineWorkFlows,
            rawDatasetLocaton,
            annotationWorkFlows,
            transFormationWorkFlows,
            defineOutputTypeDropDown,
        } = this.state;

        let { Annot, Trans, Define } = status;
        let { study } = this.props;

        let { annotationRequired, mappingRequried, defineRequired, workflowActivityStatusID} = study;

        let { getFieldDecorator } = this.props.form;

        let title = this.props.studyName + " - Activity Configuration " + (screen !== "Home" ? ("- " + screen) : "");

        return (<>
            { screen !== "" &&
                <Modal
                    visible={home}
                    title={title}
                    onCancel={this.cancel}
                    maskClosable={false}
                    style={{ top: 20, minHeight: 400 }}
                    centered
                    width={screen === "Home" ? 'auto' : "70%"}
                    footer={null}
                >
                    <LayoutWrapper id="treeview_layout" >

                        {screen === "Home" &&

                            <Box style={{ minWidth: 700, ...flexDisplay }}>
                                {
                                    <Row style={{ display: "flex", flexDirection: "column", height: '100%' }}>
                                        <Col style={{ height: "100%" }}>
                                            <LayoutContentWrapper style={{ height: "100%", width: "100%" }} >
                                                {
                                                    <div style={{ background: '#ECECEC', padding: '50px', height: "100%", width: '100%' }}>
                                                        <Row gutter={16}>
                                                            {
                                                                annotationRequired &&
                                                                <Col span={(annotationRequired && mappingRequried && defineRequired) ? 8 : 12}>
                                                                    <div style={{ display: "inline-block", height: "100%", width: "100%", minHeight: 100, minWidth: 300 }} >
                                                                        <CSSTransition
                                                                            in={true}
                                                                            timeout={500}
                                                                            classNames="alert"
                                                                            unmountOnExit
                                                                            appear
                                                                        >
                                                                            <Card
                                                                                title="Annotation"
                                                                                bordered={false}
                                                                                className={"activityconfigcard"}
                                                                                extra={
                                                                                    <i
                                                                                        className="fa fa-cog"
                                                                                        aria-hidden="true"
                                                                                        onClick={() => this.setState({ screen: "Annotation" })}
                                                                                    >
                                                                                    </i>}
                                                                            >
                                                                                <div className={"activitycardtext"}>
                                                                                    Status : {Annot.text}
                                                                                </div>
                                                                                <div className={"activitycarddrop"}>
                                                                                    {
                                                                                        getFieldDecorator("AnnotationStatus", {
                                                                                            initialValue: -1
                                                                                        }
                                                                                        )(<Select
                                                                                            style={{ width: "100%" }}
                                                                                            placeholder="Select Status"
                                                                                            disabled={
                                                                                                !annotationWorkFlows ||
                                                                                                this.props.study.locked ||
                                                                                                workflowActivityStatusID === 15 ||
                                                                                                this.props.isProjectInActive ||
                                                                                                annotationWorkFlows.length === 0 ||
                                                                                                (updateData &&
                                                                                                 !updateData.some(va => va.configurationName === "AnnotationRequired" &&
                                                                                                va.configurationValue === "true"))
                                                                                                }
                                                                                            onChange={(value) => {
                                                                                                return value !== -1 ?
                                                                                                    this.beforeUpdateTheWorkFlow(value, annotationWorkFlows) :
                                                                                                    false
                                                                                            }}
                                                                                        >
                                                                                            <Select.Option

                                                                                                value={-1}
                                                                                            >
                                                                                                --Select--
                                                                                            </Select.Option>
                                                                                            {(annotationWorkFlows || []).map((status) => {
                                                                                                return <Select.Option
                                                                                                    title={status.targetStatusText}
                                                                                                    value={status.targetStatusID}
                                                                                                >
                                                                                                    {status.targetStatusText}
                                                                                                </Select.Option>
                                                                                            })
                                                                                            }
                                                                                        </Select>)}
                                                                                </div>
                                                                            </Card>
                                                                        </CSSTransition>
                                                                    </div>
                                                                </Col>
                                                            }
                                                            {
                                                                mappingRequried &&
                                                                <Col span={(annotationRequired && mappingRequried && defineRequired) ? 8 : 12}>
                                                                    <div style={{ display: "inline-block", height: "100%", width: "100%", minHeight: 100, minWidth: 300 }} >
                                                                        <CSSTransition
                                                                            in={true}
                                                                            timeout={550}
                                                                            classNames="list-transition"
                                                                            unmountOnExit
                                                                            appear
                                                                        >
                                                                            <Card
                                                                                title="Transformation"
                                                                                bordered={false}
                                                                                className={"activityconfigcard"}
                                                                                extra={<i
                                                                                    className="fa fa-cog"
                                                                                    aria-hidden="true"
                                                                                    onClick={() => this.setState({ screen: "Transformation" })}
                                                                                ></i>}
                                                                            >
                                                                                <div className={"activitycardtext"}>
                                                                                    Status : {Trans.text}
                                                                                </div>
                                                                                <div className={"activitycarddrop"}>
                                                                                    {
                                                                                        getFieldDecorator("TransformationStatus", {
                                                                                            initialValue: -1
                                                                                        }
                                                                                        )(<Select
                                                                                            style={{ width: "100%" }}
                                                                                            placeholder="Select Status"
                                                                                            disabled={!transFormationWorkFlows ||
                                                                                                transFormationWorkFlows.length === 0 ||
                                                                                                this.props.isProjectInActive ||
                                                                                                this.props.study.locked ||
                                                                                                workflowActivityStatusID === 15
                                                                                            }
                                                                                            onChange={(value) => {
                                                                                                return value !== -1 ?
                                                                                                    this.beforeUpdateTheWorkFlow(value, transFormationWorkFlows) : false
                                                                                            }
                                                                                            }>
                                                                                            <Select.Option

                                                                                                value={-1}
                                                                                            >
                                                                                                --Select--
                                                                                          </Select.Option>
                                                                                            {
                                                                                                (transFormationWorkFlows || []).map((status) => {
                                                                                                    return <Select.Option
                                                                                                        title={status.targetStatusText}
                                                                                                        value={status.targetStatusID}
                                                                                                    >
                                                                                                        {status.targetStatusText}
                                                                                                    </Select.Option>
                                                                                                })
                                                                                            }
                                                                                        </Select>)}
                                                                                </div>
                                                                            </Card>
                                                                        </CSSTransition>
                                                                    </div>
                                                                </Col>
                                                            }
                                                            {
                                                                defineRequired &&
                                                                <Col span={(annotationRequired && mappingRequried && defineRequired) ? 8 : 12}>
                                                                    <div style={{ display: "inline-block", height: "100%", width: "100%", minHeight: 100, minWidth: 300 }} >
                                                                        <CSSTransition
                                                                            in={true}
                                                                            timeout={600}
                                                                            classNames="alert"
                                                                            unmountOnExit
                                                                            appear
                                                                        >
                                                                            <Card
                                                                                title="Define XML"
                                                                                bordered={false}
                                                                                className={"activityconfigcard"}
                                                                                extra={<i
                                                                                    className="fa fa-cog"
                                                                                    aria-hidden="true"
                                                                                    onClick={() => this.setState({ screen: "Define XML" })}
                                                                                >
                                                                                </i>}>
                                                                                <div className={"activitycardtext"}>
                                                                                    Status : {Define.text}
                                                                                </div>
                                                                                <div className={"activitycarddrop"}>
                                                                                    {
                                                                                        getFieldDecorator("DefineStatus", {
                                                                                            initialValue: -1
                                                                                        }
                                                                                        )(<Select
                                                                                            style={{ width: "100%" }}
                                                                                            placeholder="Select Status"
                                                                                            disabled={
                                                                                                !defineWorkFlows ||
                                                                                                defineWorkFlows.length === 0 ||
                                                                                                this.props.isProjectInActive ||
                                                                                                this.props.study.locked ||
                                                                                                workflowActivityStatusID === 15 
}
                                                                                            onChange={(value) => {
                                                                                                return value !== -1 ?
                                                                                                    this.beforeUpdateTheWorkFlow(value, defineWorkFlows) : false
                                                                                            }
                                                                                            }>
                                                                                            <Select.Option
                                                                                                value={-1}
                                                                                            >
                                                                                                --Select--
                                                                                             </Select.Option>
                                                                                            {
                                                                                                (defineWorkFlows || []).map((status) => {
                                                                                                    return <Select.Option
                                                                                                        title={status.targetStatusText}
                                                                                                        value={status.targetStatusID}
                                                                                                    >
                                                                                                        {status.targetStatusText}
                                                                                                    </Select.Option>
                                                                                                })
                                                                                            }
                                                                                        </Select>)}
                                                                                </div>
                                                                            </Card>
                                                                        </CSSTransition>
                                                                    </div>
                                                                </Col>
                                                            }
                                                        </Row>
                                                    </div>
                                                }
                                            </LayoutContentWrapper>
                                        </Col>
                                    </Row>
                                }
                            </Box>
                        }
                        {
                            screen === "Annotation" &&

                            <Annotation
                                study={study}
                                isProjectInActive={this.props.isProjectInActive}
                                pdfFiles={pdfFiles}
                                reload={this.reload}
                                cancel={this.cancel}
                                form={this.props.form}
                                updateData={updateData}
                                workflowActivityStatusID={Annot.id}
                            />
                        }
                        {
                            screen === "Transformation" &&
                            <Transformation
                                study={study}
                                isProjectInActive={this.props.isProjectInActive}
                                reload={this.reload}
                                cancel={this.cancel}
                                updateData={updateData}
                                form={this.props.form}
                                xptLocation={xptLocation}
                                workflowActivityStatusID={Trans.id}
                                rawDatasetLocaton={rawDatasetLocaton}
                            />
                        }
                        {
                            screen === "Define XML" &&
                            <DefineGeneration
                                study={study}
                                isProjectInActive={this.props.isProjectInActive}
                                reload={this.reload}
                                cancel={this.cancel}
                                xptLocation={xptLocation}
                                updateData={updateData}
                                form={this.props.form}
                                defineOutputType={defineOutputTypeDropDown}
                                workflowActivityStatusID={Define.id}

                            />
                        }
                    </LayoutWrapper>
                </Modal>
            }
            {
                esign && <ConfirmWithEsign
                    visible={esign}
                    studyPage={this}
                    defaultValue={""}
                    esignText={esignText}
                    cancelEsign={this.cancelEsign}
                    onSubmit={this.afterEsignVerfied}
                />
            }
        </>
        );
    }
}

const WrappedApp = Form.create()(ActivityConfiguration);

export default WrappedApp;