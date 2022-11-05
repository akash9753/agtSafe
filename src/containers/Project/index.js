import React, { Component } from 'react';
import { Form, Row, Col, Icon, Input, Layout, Menu, Breadcrumb, Tooltip, Skeleton } from 'antd';
import Button from '../../components/uielements/button';
import IntlMessages from '../../components/utility/intlMessages';
import { ContactsWrapper } from '../../styles/JsStyles/projects.style';
import { CallServerPost, DownloadFileWithPostData, PostCallWithZone, errorModal, successModal, getProjectRole, DownloadFile, checkPermission, showProgress, hideProgress } from '../Utility/sharedUtility';
import { ContactListWrapper } from '../../styles/JsStyles/projectList.style';
import { InputSearch } from '../../components/uielements/input';
import ConfirmModal from '../Utility/ConfirmModal';
import StudyList from '../Study/index'
import AddProject from './addProject';
import EditProject from './editProject';
import ProjectConfiguration from '../ProjectConfiguration/index';
import { setHeader, clearHeader } from '../Topbar/Topbar';
import createHistory from 'history/createBrowserHistory';
import ConfirmWithEsign from '../Study/confirmationWithEsign';

//Added ToolTip for Add Button
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import ProjectConfigModal from './configModal';
import Progress from '../Utility/ProgressBar';

const { Content, Sider } = Layout;
const { SubMenu } = Menu;
const FormItem = Form.Item;

const margin = {
    margin: '10px',
    float: 'right'
};


function filterProjects(projectList, search) {
    search = search.toUpperCase();
    return search
        ? projectList.filter(project => (project.projectName.toUpperCase().includes(search) || project.sponsorName.toUpperCase().includes(search)))
        : projectList;
}


const styleForActiveStatus = {
    borderLeftColor: "rgb(126, 211, 33)",
    borderLeftStyle: "solid",
    borderLeftWidth: "4px"
};

const styleForInActiveStatus = {
    borderLeftColor: "rgb(255, 144, 9)",
    borderLeftStyle: "solid",
    borderLeftWidth: "4px"
};

var showEditModal, ShowStudyList, ShowAddProject, ShowEditProject, ShowProjectConfiguration;
const projectRole = getProjectRole();
const projectList = [];

let thisObj = {};
let from = "";
export class Projects extends Component {
    constructor(props) {

        super(props);
        var projectId, projectStatus, projectName, sponsorName, active;

        //following line is for open selected study popup when from workspace
        let locationState = props.location.state;
        let isOpenSelectedStudy = locationState ? locationState.openSelectedStudy : false;

        if (isOpenSelectedStudy && locationState) {
            let selProject = JSON.parse(sessionStorage.project);
            if (selProject && typeof selProject === "object") {
                projectId = selProject.ProjectID;
                projectName = selProject.ProjectName;
                sponsorName = selProject.sponsorName;
                active = true;
                projectStatus = selProject.projectStatus;
            }
        }


        this.state =
        {
            search: '',
            projectList,
            showEditModal: false,
            ShowStudyList: false,
            ShowAddProject: false,
            ShowEditProject: false,
            ShowDeleteProject: false,
            ShowProjectConfiguration: false,
            active: active,
            projectId, projectName, sponsorName,
            userID: projectRole.userProfile.userID,
            modalLoad: false,
            actionName: "",
            projectStatus: projectStatus,
            isAutoOpen: isOpenSelectedStudy,
            esign: false,
            esignText: "",
            changeReason: "",
            progress: false
        };
        thisObj = this;
        thisObj.getAllProject();

        //set topbar header
        //following line should not not call when from workspace
        //isOpenSelectedStudy ? from workspace
        setHeader(isOpenSelectedStudy, true);       
      
        //end    
    }



    componentDidMount() {
        const history = createHistory();
        if (history.location.state && history.location.state.openSelectedStudy) {
            let state = { ...history.location.state };
            delete state.openSelectedStudy;
            history.replace({ ...history.location, state });
        }
    }
    componentWillUnmount() {
        
        clearHeader();
    }
    //componentDidMount() {

    //    if (typeof sessionStorage === 'object' && sessionStorage.studyDetails) {
    //        try {
    //            let study = JSON.parse(sessionStorage.studyDetails);
    //            thisObj.changeProject(study.projectID, study.projectName, study.sponsorName, study.projectStatus);
    //            thisObj.changeProject(study.projectID, study.projectName, study.sponsorName, study.projectStatus);

    //        } catch (e) {
    //            return false;
    //        }
    //    }


    //}

    getAllProject = () => {
        const thisObj = this;
        var projectRole1 = getProjectRole()
        var values = { UserID: projectRole1.userProfile.userID, RoleID: projectRole1.role.RoleID, ProjectID: projectRole1.project !== null ? projectRole1.project.ProjectID : 0 };
        showProgress();
        CallServerPost('Project/GetprojectByRoleUser', values)
            .then(
                function (response) {
                    hideProgress();
                    if (response.value != null) {
                        thisObj.setState({
                            projectList: response.value, ShowStudyList: thisObj.state.isAutoOpen
                        }, () => {
                                if (response.value.length > 0)
                                {
                                    //If navigate from workspace
                                    //check isOpenSelectedStudy 
                                    let locationState = thisObj.props.location.state;
                                    let isOpenSelectedStudy = locationState ? locationState.openSelectedStudy : false;
                                    if (!isOpenSelectedStudy) {
                                        const projObj = response.value[0];
                                        thisObj.changeProject(projObj.projectID, projObj.projectName, projObj.sponsorName, projObj.projectStatusID)
                                    }
                                }
                        });
                    }

                })
            .catch(error => error);
    }

    addProject = () => {
        this.setState({ ShowAddProject: true, ShowStudyList: false, ShowEditProject: false, ShowDeleteProject: false, ShowProjectConfiguration: false });
    }

    getFile = () => {
        DownloadFile('Project/GetFile', "something.pdf");
    }

    listAllProjects = (project) => {

        const activeClass = (this.state.active && project.projectID == this.state.projectId ? ('active') : (''));
        const permissions = this.props.permissions;
        const perLevel = checkPermission(permissions, ['self']);
        return (

            <div className={`isoSingleContact ${activeClass}`} key={project.projectID} style={project.projectStatusID == 5 ? styleForActiveStatus : styleForInActiveStatus}>


                <div className="isoNoteBGColor" style={{}}>

                </div>
                <div className="isoNoteText"
                    key={project.projectID}
                    onClick={() =>
                        this.changeProject(project.projectID, project.projectName, project.sponsorName, project.projectStatusID)
                    }
                >
                    <h3 name={project.projectName + "_List"}>{project.projectName ? project.projectName : 'No Name'}</h3>

                    <span className="isoNoteCreatedDate">
                        {project.sponsorName}
                    </span>
                </div>
                {activeClass === "active" && < div style={{ display: "inline-flex", alignItems: "center" }}>

                    {perLevel >= 1 ? <ButtonWithToolTip
                        name={project.projectName + '_Edit'}
                        tooltip={perLevel >= 2 ? "Edit" : "View"}
                        classname="fas fa-pen isoEditBtn"
                        style={{ border: "unset", backgroundColor: "transparent", padding: "0 5px", fontSize: 10 }}
                        type="button"
                        onClick={() => this.editProject(project.projectID)}
                    /> : ""}


                    {perLevel >= 4 ? <ButtonWithToolTip
                        tooltip="Delete"
                        name={project.projectName + '_Delete'}
                        classname="fas fa-trash isoDeleteBtn"
                        style={{ border: "unset", backgroundColor: "transparent", padding: "0 5px", fontSize: 10 }}
                        type="button"
                        onClick={() => this.deleteProject(project.projectID)}
                    /> : ""}

                    {checkPermission(permissions, ["ProjectConfiguration"]) >= 1 ? <ButtonWithToolTip
                        tooltip="Project Configuration"
                        name={project.projectName + '_Configuration'}
                        classname="fas fa-cog isoConfigBtn"
                        style={{ border: "unset", backgroundColor: "transparent", padding: "0 5px", fontSize: 14 }}
                        type="button"
                        onClick={() => this.projectConfiguration(project.projectID, project.projectStatusID)}
                    /> : ""}

                    {checkPermission(permissions, ["ProjectConfiguration"]) >= 1 ?
                        <ButtonWithToolTip
                            name={project.projectName + "_AuditLog Download"}
                            tooltip={"AuditLogDownload"}
                            classname="fas fa fa-history isoAudit"
                            style={{ border: "unset", backgroundColor: "transparent", padding: "0 5px", fontSize: 14 }}
                            onClick={() => thisObj.fnToDownloadAuditLog(project.projectID, project.projectName)}
                        /> : ""}

                </div>}
            </div>

        );
    }


    CheckStudyFolderPermissions = (projectID, callback, valueObj) => {
        const thisObj = this;
        CallServerPost('Users/CheckUserPermissions',
            {
                ProjectID: projectID,
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

    //Project Auditlog
    fnToDownloadAuditLog = (projectID, directoryName) => {
        

        const configCallBack = (valueObj) => {
            var today = new Date(),
                date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '_' + today.getHours() + ':' + today.getMinutes();
            //showProgress();
            thisObj.socket_open();
            DownloadFileWithPostData('Project/GetAuditLogReport', valueObj.directoryName + "_AuditLog_" + date + ".pdf", { ProjectID: valueObj.projectID }, "application/pdf").then(function () {
                thisObj.setState({ progress: "exception" });
                //hideProgress();
            });
        }
        this.CheckStudyFolderPermissions(projectID, configCallBack, { projectID: projectID, directoryName: directoryName });
    }

    socket_open = () => {
        thisObj.setState({ progress: "active" })
    }

    editProject = (projectId) => {
        this.setState({ projectId: projectId, ShowEditProject: true, ShowAddProject: false, ShowDeleteProject:false, ShowStudyList: false, ShowProjectConfiguration: false, active: true });
    }

    projectConfiguration = (projectId, projectStatusID) => {
        this.setState({ projectId: projectId, projectStatus: projectStatusID, ShowEditProject: false, ShowAddProject: false, ShowStudyList: false, ShowProjectConfiguration: true, active: true });
    }

    //configProject = (projectId) => {
    //    this.setState({ projectId: projectId, ShowConfigProject:true, ShowEditProject: true, ShowAddProject: false, ShowStudyList: false });
    //}

    deleteProject = (projectId) => {

        const configCallBack = (valueObj) => {
            thisObj.setState({ actioName: "Delete", ShowDeleteProject: true, projectId: valueObj.projectId, active: true });
        }
        this.CheckStudyFolderPermissions(projectId, configCallBack, { projectId: projectId });

       
    }
    handleDelete = (changeReason) => {
        const thisObj = this;
        thisObj.setState({
            esign: true,
            changeReason: changeReason,
            ShowDeleteProject: false,
            esignText: "I have confirmed that this project needs to be deleted!"
        });
    }
    deleteProjectAfterEsignVerified = () => {
        const thisObj = this;
        let values = {};

        thisObj.setState({ modalLoad: true });
        values["ProjectID"] = this.state.projectId;
        values["ChangeReason"] = this.state.changeReason;
        showProgress();
        PostCallWithZone('Project/Delete', values)
            .then(
                function (response) {
                    hideProgress();
                    if (response.status == 1) {

                        thisObj.setState({ actioName: "index", modalLoad: false, showEditModal: false, esign: false });
                        successModal(response.message, thisObj.props, "/trans/project");
                    } else {
                        thisObj.setState({ modalLoad: false, showEditModal: false, esign: false });

                        errorModal(response.message);
                    }
                }).catch(error => error);


    }

    //// -- Modal-Cancel [CofirmDelete] --////
    handleCancel = () => {
        this.setState({ ShowDeleteProject: false });
    }

    changeProject = (projectId, projectName, sponsorName, status) => {
        sessionStorage.removeItem("studyDetails");

        sessionStorage.setItem("project",
            JSON.stringify({
                ProjectID: projectId,
                ProjectName: projectName,
                sponsorName: sponsorName,
                projectStatus: status
            }));

       

        this.setState({
            projectStatus: status,
            ShowStudyList: true,
            projectId: projectId,
            projectName: projectName,
            sponsorName: sponsorName,
            ShowEditProject: true,
            ShowAddProject: false,
            active: true,
            isAutoOpen: false
        }, () => {
            //set topbar header
            setHeader();
        //end
        });
    }

    isAutoOpenUpdate = () => {
        thisObj.setState({ isAutoOpen: false });
    }
    //Cancel Esign pop
    cancelEsign = () => {
        const { datas } = this.state;

        new Promise((res, rej) => {
            thisObj.setState({ esign: false, showEditModal: false, dataSource: [] }, res());
        }).then(() => {
            thisObj.setState({ dataSource: datas });
        });
    }

    onChange = (event) => {
        this.setState({ search: event.target.value });
    }
    clearSearch = () => {
        this.setState({ search: "" });
    }
    //Project Refresh
    projectRefresh = () => {
        window.location.reload(false);
        this.setState({ loading: true });
        //    this.getAllProject();
    }

    //// --- Form Cancel [Add and Update] --////
    cancel = () => {

        this.props.history.push({
            pathname: '/trans/project'
        }
        );
    }

    render() {
        const { search, projectStatus, isAutoOpen, progress } = this.state;
        const projectList = filterProjects(this.state.projectList, search);
        const { getFieldDecorator } = this.props.form;
        const permissions = this.props.permissions;

        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-tasks"></i>
                        <span> Project</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>
                <ContactsWrapper
                    className="isomorphicContacts"
                    style={{ padding: 0 }} >
                    <Row style={{ width: "100%" }}>
                        <Col md={6} sm={24}>
                            <div className="isoContactListBar divHeight" style={{ width: "100%", background: "#fff", borderRadius: "5px" }}>

                                <ContactListWrapper className="isoContactListWrapper" style={{ paddingTop: "10px" }}>
                                    <FormItem style={{ marginBottom: "10px" }}>
                                        <Row gutter={8} style={{ display: "table", width: "100%" }}>
                                            <Col span={checkPermission(permissions, ['self']) >= 3 ? 19 : 22} id="projectListSearch" style={{ display: "table-cell" }}>
                                                {
                                                    search !== "" ?
                                                        <Input name="ProjectSearch" tabIndex="0" suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)', float: 'right' }} />} suffix={<Icon onClick={this.clearSearch} type="close" style={{ color: 'rgba(0,0,0,.25)', float: 'right' }} />} style={{ width: '100%' }} value={search} onChange={this.onChange} placeholder="Search" />
                                                        :
                                                        <Input name="ProjectSearch" tabIndex="0" suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)', float: 'right' }} />} style={{ width: '100%' }} value={search} onChange={this.onChange} placeholder="Search" />
                                                }

                                            </Col>
                                            <Col span={2} style={{ display: "table-cell" }}>
                                                <ButtonWithToolTip
                                                    tooltip="Refresh"
                                                    name="Refresh"
                                                    shape="circle"
                                                    icon="reload"
                                                    size="small"
                                                    onClick={() => this.projectRefresh()} />
                                            </Col>
                                            {checkPermission(permissions, ['self']) >= 3 && <Col span={3} style={{ display: "table-cell", textAlign: "right" }}>
                                                {checkPermission(permissions, ['self']) >= 3 && <ButtonWithToolTip name="AddProject" tooltip="Add Project" shape="circle" classname="fas fa-plus" size="small" style={{ marginLeft: "10px" }} onClick={() => this.addProject()} />}
                                            </Col>}

                                        </Row>
                                    </FormItem>
                                    {projectList && projectList.length > 0 ? (
                                        <div className="isoContactList" style={{ height: "calc(100vh - 175px)" }}>
                                            {projectList.map(project => this.listAllProjects(project))}
                                        </div>
                                    ) : (
                                        <span className="isoNoResultMsg">
                                            {<IntlMessages id="Component.projects.noOption" />}
                                        </span>
                                    )}
                                    < Form >
                                        {
                                            (this.state.actioName == "Delete") ?
                                                <ConfirmModal loading={this.state.modalLoad} title="Delete Project" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.ShowDeleteProject} handleCancel={this.handleCancel} /> : ""
                                        }
                                    </Form >
                                </ContactListWrapper>
                            </div>
                        </Col>
                        <Col md={18} sm={24} className="divHeight" style={{ paddingLeft: "5px" }}>
                            <Layout className="isoContactBoxWrapper" style={{ padding: "10px 0 10px 0 !important", background: "#fff", borderRadius: "5px", height:"100%" }}>
                                {this.state.ShowStudyList ?
                                    (
                                        <StudyList
                                            isAutoOpenUpdate={this.isAutoOpenUpdate}
                                            permissions={permissions.Study}
                                            isProjectInActive={(projectStatus == 6) ? true : false}
                                            projectId={this.state.projectId}
                                            projectName={this.state.projectName}
                                            sponsorName={this.state.sponsorName}
                                            history={this.props.history}
                                            visible={this.state.ShowStudyList}
                                            rootprops={this.props}
                                            userID={this.state.userID}
                                        />) :
                                    (this.state.ShowAddProject ?
                                        (<AddProject rootprops={this.props} userID={this.state.userID} FormCancel={this.cancel} />) :
                                        (this.state.ShowEditProject ?
                                            (<EditProject readOnly={checkPermission(permissions, ['self']) <= 1} projectID={this.state.projectId} rootprops={this.props} userID={this.state.userID} FormCancel={this.cancel} />) :
                                            (<div className="divHeight" style={{ width: "100%", padding: "30px" }} ><Skeleton paragraph={{ rows: 10 }} /></div>)
                                        )
                                    )
                                }
                                {this.state.esign && <ConfirmWithEsign
                                    esignText={this.state.esignText}
                                    projectPage={this}
                                    defaultValue={""}
                                    cancelEsign={this.cancelEsign}
                                    visible={this.state.esign}
                                    buttonName={this.state.actionName}
                                    onSubmit={this.state.actioName === "Delete" ? this.deleteProjectAfterEsignVerified : ""}
                                />}

                            </Layout>

                        </Col>
                    </Row>
                    {
                        this.state.ShowProjectConfiguration &&
                        <ProjectConfigModal
                            configVisible={this.state.ShowProjectConfiguration}
                            permissions={permissions.ProjectConfiguration}
                            projectID={this.state.projectId}
                            projectStatusID={projectStatus}
                            rootprops={this.props}
                            userID={this.state.userID}
                            history={this.props.history}
                            project={this.state.projectList.filter(pr => pr.projectID == this.state.projectId)[0]}
                            sponsorName={this.state.sponsorName}
                            FormCancel={this.cancel}
                        />
                    }
                    {<Progress progress={progress}/>}
                </ContactsWrapper>
            </div>
        );
    }
}
const WrappedApp = Form.create()(Projects);

export default WrappedApp;



