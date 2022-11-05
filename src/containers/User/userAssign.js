import React, { Component } from 'react';
import { Input, Select, Breadcrumb, Col, Row, Form, Steps, message, Modal, Icon, Tooltip, Spin } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import Button from '../../components/uielements/button';
import { CallServerPost, errorModal, successModalCallback, PostCallWithZone, checkPermission } from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import ConfirmModal from '../Utility/ConfirmModal';
import { checkSelect } from '../Utility/validator';
//Importing ButtonWithToolTip for Actions
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';

const Option = Select.Option;
const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

let uuid = 0;
let keys = [];
let locUserID = -1;
const divCenter = { textAlign: 'center', color: '#788195', fontSize: 13, fontWeight: 'bold' };
const iconCenter = { textAlign: 'center', color: '#788195', fontSize: 13, fontWeight: 'bold', marginTop: 5 };
const msgCenter = { textAlign: 'center', color: '#788195', fontSize: 20, fontWeight: 'bold', marginTop: 25 };
var scrollFlag = false;

class UserAssign extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: 0,
            projects: [],
            studies: [],
            roles: [],
            userAssigns: [],
            newAdded: false,
            editIndex: -1,
            deleteIndex: -1,
            showEditModal: false,
            showDeleteModal: false,
            loading: true,
            modalLoad: false,
            actionName: "",
            allValues: {},
            projectChangeState: false,
            dropDownObjList: [],
            currentProjectIndex: ''
        };

        this.getList(props);

    }
    getList = (props) => {
        const thisObj = this;
        CallServerPost('UserAssignment/GetUserAssignData', { UserID: props.userId })
            .then(
                function (response) {
                    var uAssignlist = [];
                    if (response.value.userAssignList != null) {
                        uAssignlist = response.value.userAssignList;
                    }
                    thisObj.setState({ modalLoad: false, showEditModal: false, showDeleteModal: false, userID: props.userId, projects: response.value.projectList, studies: response.value.studyList, roles: response.value.rolesList, userAssigns: uAssignlist, dropDownObjList: uAssignlist, loading: false });

                }).catch(error => error);
    }

    onProjectChange = (k) => {
        this.props.form.setFieldsValue({
            ["studySelectItem" + k]: undefined,
            ["rolesSelectItem" + k]: undefined
        });
        this.setState({ projectChangeState: true, currentProjectIndex: k });
    }
    remove = (k) => {
        keys = keys.filter(key => key !== k);
        uuid--;
        this.setState({ newAdded: false });
        this.props.form.resetFields();
    }

    showDeleteModal = (k) => {
        this.setState({ actionName: "delete", showDeleteModal: true, deleteIndex: k });
    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;

        const postValue = {
            UserAssignmentID: thisObj.state.userAssigns[this.state.deleteIndex].userAssignmentID,
            ChangeReason: ChangeReason
        };
        thisObj.setState({ modalLoad: true });
        PostCallWithZone('UserAssignment/Delete', postValue)
            .then(
                function (response) {
                    if (response.status == 1) {
                        locUserID = -1;
                        keys = [];
                        uuid = 0;

                        successModalCallback(response.message, thisObj.reloadDelete);
                    } else {
                        thisObj.setState({ modalLoad: false, showDeleteModal: false });

                        errorModal(response.message);
                    }
                }).catch(error => error);

    }
    reloadDelete = () => {

        this.getList(this.props);
    }

    editUserAssign = (k) => {
        this.setState({ editIndex: k });
    }
    cancelUserAssign = (k) => {
        if (this.state.newAdded) {
            this.remove(k);
        } else {
            this.props.form.resetFields();
            this.setState({ editIndex: -1 });
        }
        this.setState({ projectChangeState: false, currentProjectIndex: '' });
    }

    removeAll = () => {
        locUserID = -1;
        keys = [];
        uuid = 0;
        this.setState({ userAssigns: null, editIndex: -1, showEditModal: false, showDeleteModal: false, newAdded: false, deleteIndex: -1 });
        this.props.handleCancel();
    }

    componentDidUpdate() {
        var scrollDiv = document.getElementById("userassignment-wrapper");
        if (scrollDiv !== null && scrollFlag) {
            scrollDiv.scrollTop = scrollDiv.scrollHeight;
            scrollFlag = false;
        }
    }

    add = () => {
        keys = keys.concat(uuid);
        uuid++;
        this.setState({ newAdded: true });
        scrollFlag = true;
    }

    handleSubmit = (k) => {
        const thisObj = this;
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                if (thisObj.state.editIndex >= 0) {
                    thisObj.setState({ actionName: "edit", showEditModal: true, allValues: values, projectChangeState: false, currentProjectIndex: "" });
                } else {
                    const postValue = { UserID: thisObj.state.userID, ProjectID: values["projectSelectItem" + k], StudyID: values["studySelectItem" + k], RoleIDs: values["rolesSelectItem" + k].join() };
                    thisObj.setState({ modalLoad: true, projectChangeState: false, currentProjectIndex: ""  });
                    PostCallWithZone('UserAssignment/Create', postValue)
                        .then(
                            function (response) {
                                thisObj.setState({ modalLoad: false });

                                if (response.status == 1) {
                                    successModalCallback(response.message, thisObj.reloadModal);
                                } else {
                                    errorModal(response.message);
                                }
                            }).catch(error => error);
                }

            }
        });
    }

    reloadModal = () => {
        uuid = 0;
        keys = [];
        locUserID = -1;
        this.setState({ userAssigns: null, editIndex: -1, showEditModal: false, showDeleteModal: false, newAdded: false, deleteIndex: -1 });
        this.props.form.resetFields();
        this.getList(this.props);
    }

    handleUpdate = (ChangeReason) => {
        const thisObj = this;
        var editIndex = this.state.editIndex;
        let values = thisObj.state.allValues;

        thisObj.setState({ modalLoad: true });
        const postValue = {
            ChangeReason: ChangeReason,
            UserAssignmentID: thisObj.state.userAssigns[editIndex].userAssignmentID,
            UserID: thisObj.state.userID,
            ProjectID: values["projectSelectItem" + editIndex],
            StudyID: values["studySelectItem" + editIndex],
            RoleIDs: values["rolesSelectItem" + editIndex].join(),
            UpdatedDateTimeText: thisObj.state.userAssigns[editIndex].updatedDateTimeText
        };
        //console.log(postValue);
        PostCallWithZone('UserAssignment/Update', postValue)
            .then(
                function (response) {

                    if (response.status == 1) {
                        thisObj.setState({ actionNmae: "Index", modalLoad: false, showEditModal: false });

                        successModalCallback(response.message, thisObj.reloadModal);
                    } else {
                        thisObj.setState({ modalLoad: false, showEditModal: false });

                        errorModal(response.message);
                    }
                }).catch(error => error);

    }
    handleCancel = () => {
        this.setState({ showEditModal: false, showDeleteModal: false });
    }
    render() {

        const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;
        const { studies, roles, userAssigns, editIndex, newAdded, projects, projectChangeState, dropDownObjList, currentProjectIndex } = this.state;
        //const permissions = this.props.permissions;
        //const perLevel = checkPermission(permissions, ["self"]);
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };
        const topRow = (<Row style={{ padding: "5px", background: "linear-gradient(to left, #3A6073, #16222A)" }}>
            <Col span={6}>
                <div style={divCenter}>
                    <span style={{ color: "#fff" }}>Project</span>
                </div>
            </Col>
            <Col span={8}>
                <div style={divCenter}>
                    <span style={{ color: "#fff" }}>Study</span>
                </div>
            </Col>
            <Col span={8}>
                <div style={divCenter}>
                    <span style={{ color: "#fff" }}>Roles</span>
                </div>
            </Col>
            <Col span={2}>
                <div style={divCenter}>
                    <span style={{ color: "#fff" }}>Actions</span>
                </div>
            </Col>
        </Row>);
        if (userAssigns != null && uuid == 0) {
            for (var i = 0; i < userAssigns.length; i++) {
                keys.push(i);
                uuid++;
            }
        }

        const getElems = (objs) => {

            for (var i = 0; i < dropDownObjList.length; i++) {
                objs.map(function (option, index) {
                    if (option.studyID === parseInt(dropDownObjList[i].studyID) && option.projectID === dropDownObjList[i].projectID) {
                        objs.splice(index, 1);
                    }
                });
            }

            return objs;
        }

        const getFilteredOptionList = (k) => {
            var filteredArr = [];
            filteredArr.push((getElems(studies[k])).map(function (option) {
                return (
                    <Option key={option.studyID}>
                        {option.studyName}
                    </Option>
                )
            }));
            return filteredArr;
        }

        //getFieldDecorator('keys', { initialValue: initvalues });
        // const keys = getFieldValue('keys');
        var deafultOption = [(<Option disabled key="--Select--" >--Select--</Option>)];
        var projectOptions = this.state.projects.map(function (option) {
            //if (option.projectStatusID !== 6) {
            return (
                <Option key={option.projectID} disabled={option.projectStatusID === 6}>
                    {option.projectName}
                </Option>
            )
            //}
        });
        projectOptions = deafultOption.concat(projectOptions);
        const formItems = userAssigns != null && keys.map((k, index) => {
            var currProject = "";
            if (k < userAssigns.length) {
                currProject = projects[projects.findIndex(x => x.projectID === userAssigns[k].projectID && x.projectStatusID === 6)];
            }

            return (
                <Row gutter={16} key={k}>
                    <Col key={'projectCol' + k} span={6} style={{bottom: 4 }}>
                        <FormItem
                            required={false}
                            key={'formitem' + k}
                        >
                            {getFieldDecorator('projectSelectItem' + k, {
                                rules: [{
                                    required: true,
                                    message: "Please Select Project",
                                }, { validator: checkSelect, message: "Please Select Project" }],
                                initialValue: k < userAssigns.length ? userAssigns[k].projectID.toString() : "--Select--",
                            })(
                                <Select
                                    tabIndex="0"
                                    showSearch
                                    placeholder="Select Project"
                                    disabled={k < userAssigns.length && k != editIndex}
                                    onChange={() => this.onProjectChange(k)}
                                    key={'projectSelect' + k}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {projectOptions}
                                </Select>
                            )}

                        </FormItem>
                    </Col>
                    <Col key={'studyCol' + k} span={8}>
                        <FormItem
                            required={false}
                            key={'formitem' + k}
                        >
                            {getFieldDecorator('studySelectItem' + k, {
                                rules: [{
                                    required: true,
                                    message: "Please Select Study",
                                }],
                                initialValue: k < userAssigns.length ? userAssigns[k].studyID.toString() : [],
                            })(
                                <Select tabIndex="0" disabled={(k < userAssigns.length && k != editIndex) || getFieldValue('projectSelectItem' + k) == "--Select--"} placeholder="Please Select Study" key={'studySelect' + k}>
                                    {
                                        getFieldValue('projectSelectItem' + k) != "--Select--" ? (projectChangeState === true && currentProjectIndex === k ? getFilteredOptionList(getFieldValue('projectSelectItem' + k)) : (studies[getFieldValue('projectSelectItem' + k)] || []).map(function (option) {
                                            return (
                                                <Option key={option.studyID}>
                                                    {option.studyName}
                                                </Option>
                                            )
                                        })) : ("")
                                    }
                                </Select>
                            )}

                        </FormItem>
                    </Col>
                    <Col key={'rolesCol' + k} span={8}>
                        <FormItem
                            required={false}
                            key={'formitem' + k}
                        >
                            {getFieldDecorator('rolesSelectItem' + k, {
                                rules: [{
                                    required: true,
                                    message: "Please Select Role",
                                }],
                                initialValue: k < userAssigns.length ? userAssigns[k].roleIDs.split(",") : [],
                            })(
                                <Select className="rolesSelect" tabIndex="0" disabled={k < userAssigns.length && k != editIndex} placeholder="Select Roles" mode="multiple" key={'rolesSelect' + k}>
                                    {roles.map(function (option) {
                                        return (
                                            <Option key={option.roleID}>
                                                {option.roleName}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            )}

                        </FormItem>
                    </Col>
                    {
                        k < userAssigns.length && k != editIndex ?
                            (<Col>
                                <div style={iconCenter} title={(currProject != "" && currProject != undefined) ? currProject.projectDescription + " is InActive" : ""}>

                                    
                                        <ButtonWithToolTip
                                            tabIndex="0"
                                            tooltip={"Edit"}
                                            shape="circle"
                                            classname="ion-edit"
                                            size="small"
                                            disabled={(currProject != undefined && currProject != "" && currProject.projectStatusID === 6)}
                                            style={{ fontSize: '14px', marginLeft: 5 }}
                                            onClick={() => this.editUserAssign(k)}
                                        />
                                        <ButtonWithToolTip
                                            tabIndex="0"
                                            tooltip="Delete"
                                            shape="circle"
                                            classname="ion-android-delete"
                                            size="small"
                                            disabled={(currProject != undefined && currProject != "" && currProject.projectStatusID === 6)}
                                            style={{ fontSize: '14px', color: '#FF0000', marginLeft: 5 }}
                                            onClick={() => this.showDeleteModal(k)}
                                        />


                                </div>
                            </Col>) :
                            (<Col key={'actionsCol' + k} span={2}>
                                <div style={iconCenter}>

                                    <ButtonWithToolTip
                                        tabIndex="0"
                                        tooltip="Save"
                                        shape="circle"
                                        classname="icon ion-checkmark"
                                        size="small"
                                        style={{ fontSize: '14px', color: "green" }}
                                        onClick={() => this.handleSubmit(k)}
                                    />


                                    {
                                        k != editIndex && !newAdded ? (

                                            <ButtonWithToolTip
                                                tabIndex="0"
                                                tooltip="Delete"
                                                shape="circle"
                                                classname="ion-android-delete"
                                                size="small"
                                                style={{ fontSize: '14px', marginLeft: 15, color: "#FF0000" }}
                                                onClick={() => this.remove(k)}
                                            />) : (
                                                <ButtonWithToolTip
                                                    tabIndex="0"
                                                    tooltip="Cancel"
                                                    shape="circle"
                                                    classname="ion-close-round"
                                                    size="small"
                                                    style={{ fontSize: '14px', marginLeft: 5, color: "#FF0000" }}
                                                    onClick={() => this.cancelUserAssign(k)}
                                                />)

                                    }

                                </div>
                            </Col>)
                    }

                </Row>
            );
        });
        return (

            <Modal
                visible={this.props.visible}
                title={"User Assignment"}
                style={{ top: 20 }}
                onCancel={this.props.handleCancel}
                width={'80%'}
                afterClose={this.removeAll}
                maskClosable={false}
                footer={[
                    <Button key="submit" disabled={this.state.editIndex >= 0 || this.state.newAdded} type="primary" size="large" onClick={this.add}>
                        Add Project
                    </Button>,
                ]}
            >
                <Spin indicator={antIcon} spinning={this.state.loading}>
                    {uuid != 0 && topRow}

                    {uuid == 0 && <div style={msgCenter}>
                        <span>No Assignments yet!</span>
                    </div>}
                    <div style={{ maxHeight: "calc(100vh - 210px)", overflowX: "hidden" }}>
                        <Form style={{ marginTop: 16 }} onSubmit={this.handleSubmit}>
                            {formItems}
                            {(this.state.actionName == "edit") ? <ConfirmModal loading={this.state.modalLoad} title="Update User Assignment" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} /> :
                                (this.state.actionName == "delete") ? <ConfirmModal loading={this.state.modalLoad} title="Delete User Assignment" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} /> : ""
                            }
                        </Form>
                    </div>
                </Spin>
            </Modal>
        );
    }
}

const WrappedApp = Form.create()(UserAssign);

export default WrappedApp;