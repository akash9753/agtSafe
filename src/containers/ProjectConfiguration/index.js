import React, { Component } from 'react';
import Tabs, { TabPane } from '../../components/uielements/tabs';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, errorModal, successModal, successModalCallback, getProjectRole, checkPermission, showProgress, hideProgress } from '../Utility/sharedUtility';
import { Icon, Input, Popconfirm, Breadcrumb, Form } from 'antd';
import Button from '../../components/uielements/button';
import TableWrapper from '../../styles/Table/antTable.style';
import ContentHolder from '../../components/utility/contentHolder';
import LayoutContent from '../../components/utility/layoutContent';
import ReactTable from '../Utility/reactTable';
import ConfirmModal from '../Utility/ConfirmModal';
import IntlMessages from '../../components/utility/intlMessages';
import AddProjectConfig from './addProjectConfiguration';
import EditProjectConfig from './editProjectConfiguration';
import { stringSorter } from "../Utility/htmlUtility";
import Select, { SelectOption } from '../../components/uielements/select';

//ButtonWithToolTip Importing
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';

const Option = SelectOption;
const FormItem = Form.Item;
const dataSource = [];
const margin = {
    margin: '0 5px 0 0'
};

var allDataSource = [];
var thisObj, projectConfigurationID;
var deleteModal;

const projectRole = getProjectRole();
var projectIDGlobal = null;

class ProjectConfiguration extends Component {

    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.addProjectConfiguration = this.addProjectConfiguration.bind(this);

        this.state = {
            dataSource,
            showEditModal: false,            
            projectConfigurationID,
            showIndex:false,
            showAddProjectConfig: false,
            showEditProjectConfig: false,
            modalLoad: false,
            action: "index",
            getBreadCrumb: "List"
        };

        thisObj = this;

        thisObj.getList(this.props);   

        //if (typeof this.props.location.state != 'undefined') {
        //    projectIDGlobal = this.props.location.state.ProjectID;            
        //}

        
    }

    getList = (props) => {
        showProgress();
        CallServerPost('ProjectConfiguration/GetAllProjectConfiguration', { ProjectID: props.projectID })
            .then(
            function (response) {

                if (response.value != null) {
                    var datas = [];
                    const projectConfigurationList = response.value;
                    const permissions = thisObj.props.permissions;
                    const perLevel = checkPermission(permissions, ['self']);
                    for (var i = 0; i < projectConfigurationList.length; i++) {

                        const projectid = projectConfigurationList[i].projectID;
                        const projectconfigurationid = projectConfigurationList[i].projectConfigurationID;
                        

                        const editCell = <div>
                            
                            {perLevel >= 1 ? <ButtonWithToolTip
                                tooltip={perLevel >= 2 ? "Edit" : "View"}
                                name={projectConfigurationList[i].configurationText + "_Edit"}
                                shape="circle"
                                classname="fas fa-pen"
                                size="small"
                                style={margin}
                                disabled={thisObj.props.projectStatusID === 6}
                                onClick={() => thisObj.editProjectConfiguration(projectid, projectconfigurationid)}
                            /> : ""}
                            
                            {/*{perLevel >= 4 ? <ButtonWithToolTip*/}
                            {/*    tooltip="Delete"*/}
                            {/*    name={projectConfigurationList[i].configurationText + "_Delete"}*/}
                            {/*    shape="circle"*/}
                            {/*    classname="fas fa-trash-alt"*/}
                            {/*    size="small"*/}
                            {/*    disabled={thisObj.props.projectStatusID === 6}*/}
                            {/*    style={margin}*/}
                            {/*    onClick={() => thisObj.deleteProjectConfiguration(projectconfigurationid)}*/}
                            {/*/> : ""}*/}


                        </div>;
                        datas.push({
                            key: projectConfigurationList[i].projectConfigurationID,
                            projectText: projectConfigurationList[i].projectText,
                            configurationText: projectConfigurationList[i].configurationText,
                            configurationValue: projectConfigurationList[i].configurationValue,
                            actions: editCell
                        });
                    }
                    allDataSource = datas;
                    thisObj.setState({ getBreadCrumb:"List", action: "index", dataSource: datas, loading: false, showIndex: true });
                }
                hideProgress();
            })
            .catch(error => error);

    }

    componentWillReceiveProps(nextProps) {
        if (typeof nextProps.projectId != "undefined" && nextProps.projectId != null && this.props.projectId != nextProps.projectId) {
            thisObj.props = nextProps;
            thisObj.getList(nextProps);
        }
    }

    
    deleteProjectConfiguration = (projectConfigurationID) => {
        this.setState({ action: "delete",showEditModal: true, ProjectConfigurationID: projectConfigurationID, showIndex: true, showEditProjectConfig: false });
    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};
        
               thisObj.setState({ modalLoad: true });
                values["ProjectConfigurationID"] = thisObj.state.ProjectConfigurationID;
                values["ChangeReason"] = ChangeReason;
                values["TimeZone"] = "IST";
                values["UpdatedBy"] = projectRole.userProfile.userID;
                CallServerPost('ProjectConfiguration/Delete', values)
                    .then(
                    function (response) {
                        thisObj.setState({ modalLoad: false });
                        if (response.status == 1) {
                            thisObj.setState({ loading: false, showEditModal: false });                            
                            successModalCallback(response.message, thisObj.save);
                        } else {
                            errorModal(response.message);
                        }
                    }).catch(error => error);
           

    }

    handleCancel = () => {
        this.setState({ action: "index", showEditModal: false, showAddProjectConfig: false, showEditProjectConfig: false, showIndex: true, getBreadCrumb: "List" });
    }

    addProjectConfiguration = () => {

        thisObj.setState({ action: "add", showAddProjectConfig: true, showIndex: false, showEditProjectConfig: false, getBreadCrumb: "Add" });

    }

    save = () => {
        this.setState({ getBreadCrumb: "List",showAddProjectConfig: false, showEditProjectConfig: false, showIndex:true});
        thisObj.getList(thisObj.props);

    }

    

    editProjectConfiguration = (projectID, projectConfigurationID) => {
        thisObj.setState({ action: "edit", showIndex: false, showAddProjectConfig: false, showEditProjectConfig: true, projectConfigurationID: projectConfigurationID, getBreadCrumb: "Edit" });

    }

    render() {
        
        const { projectConfigurationID, showAddProjectConfig, showEditProjectConfig, showIndex, action, getBreadCrumb} = this.state;
        const { projectID } = this.props;

        const columns = [
            {
                title: 'Project Name',
                dataIndex: 'projectText',
                key: 'projectText',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'projectText'),
            },
            {
                title: 'Name',
                dataIndex: 'configurationText',
                key: 'configurationText',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'configurationText'),
            },
            {
                title: 'Value',
                dataIndex: 'configurationValue',
                key: 'configurationValue',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'configurationValue'),
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 100
            }
        ];

        const { getFieldDecorator } = this.props.form;
        const permissions = this.props.permissions;
        return (

            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-tasks"></i>
                        <span> Project Configuration</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {getBreadCrumb}
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent>
                    {

                        (action != "edit" && action != "add") &&
                        <ReactTable
                            columns={columns}
                            dataSource={this.state.dataSource}
                            //addAction={checkPermission(permissions, ['self']) >= 3 && thisObj.props.projectStatusID === 5 ? this.addProjectConfiguration : null}
                            scroll={{ y: "calc(100vh - 256px)" }}

                        />
                    }
                    {
                    (action == "add") ?
                        <AddProjectConfig projectID={projectID} handleCancel={this.handleCancel} handleSave={this.save} getFieldDecorator={getFieldDecorator} /> :
                            (action == "edit") ?
                                <EditProjectConfig readOnly={checkPermission(permissions, ['self']) <= 1} projectID={projectID} projectConfigurationID={projectConfigurationID} handleCancel={this.handleCancel} handleSave={this.save} getFieldDecorator={getFieldDecorator} /> :
                            (action == "delete") ?
                                <ConfirmModal loading={this.state.modalLoad} title="Delete Project Configuration" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} /> : ""
                    }
    
                 
                </LayoutContent>

            </LayoutContentWrapper>

        );
    }

}

const WrappedApp = Form.create()(ProjectConfiguration);
export default WrappedApp;

