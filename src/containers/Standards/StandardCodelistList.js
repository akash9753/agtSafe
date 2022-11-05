import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import AddStandardCodeList from './addStandardCodeList.js';
import ConfirmModal from '../Utility/ConfirmModal';
import ReactTable from '../Utility/reactTable';
import { Icon, Spin, Form, Breadcrumb } from 'antd';
import Button from '../../components/uielements/button';
import { CallServerPost, PostCallWithZone, successModal, successModalCallback, errorModal, checkPermission } from '../Utility/sharedUtility';
import { stringSorter } from '../Utility/htmlUtility';
//Importing ButtonWithToolTip for Edit and Delete Icon
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';

const dataSource = [];
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;

class StandardCodelistList extends Component {

    constructor(props) {
        super(props);

        this.addStandardCodeList = this.addStandardCodeList.bind(this);

        this.state = {
            loading: true,
            title: null,

            showDeleteConfirmationModal: false,
            action: "",
            modalLoading: false,            
            showCDISCDataStdRoleList: false,
            showAddCDISCDataStdRoleModal: false,
            standardCodeListID: 0,
            showStandardCodeList: false,
            showAddStandardCodeListModal: false,
            modalLoad:false,
        };


        thisObj = this;
        thisObj.getList(thisObj.props);


    }

    componentWillReceiveProps(nextProps) {
        //console.log(nextProps);
        thisObj.setState({ loading: true });
        thisObj.getList(nextProps);

    }

    getList = (data) => {
        CallServerPost('StandardCodeList/GetAllStandardCodeList', { CDISCDataStdVersionID: data.cDISCDataStdVersionID })
            .then(
            function (response) {
                if (response.value != null) {
                    thisObj.setState({ loading: false });
                    thisObj.standardCodeListList(response);
                }
                else {
                    thisObj.setState({ dataSource: [], loading: false });
                }

            });
    }

    addStandardCodeList = () => {
        this.setState({ title: "Add Standard Codelist", showAddCDISCDataStdRoleModal: false, showAddStandardCodeListModal: true, action: 'Create', standardCodeListID: 0 })

    }

    editStandardCodeList = (standardCodeListID) => {
        this.setState({ title: "Edit Standard Codelist", showAddCDISCDataStdRoleModal: false, showAddStandardCodeListModal: true, action: 'Update', standardCodeListID: standardCodeListID })

    }

    handleAddStandardCodeListCancel = () => {
        thisObj.getList(thisObj.props);
        this.setState({ action: "", showAddStandardCodeListModal: false });
    }

    handleCancelDeleteConfirmationModal = () => {
        this.setState({ showDeleteConfirmationModal: false });
        this.props.form.resetFields(["Change Reason"]);

    }

    deleteStandardCodeList = (standardCodeListID) => {

        this.setState({ showDeleteConfirmationModal: true, action: 'Delete', standardCodeListID: standardCodeListID });
    }

    refreshStandardCodeList = () => {
        thisObj.setState({ action: "", showAddStandardCodeListModal: false });
        thisObj.handleCancelDeleteConfirmationModal();
        thisObj.setState({ modalLoading: false });
        thisObj.setState({ action: "" });
        thisObj.getList(thisObj.props);

    }


    handleDelete = (ChangeReason) => {

        const thisObj = this;
        let values = {};

                thisObj.setState({ modalLoad: true });
                values["StandardCodeListID"] = thisObj.state.standardCodeListID;
                values["ChangeReason"] = ChangeReason;

                PostCallWithZone('StandardCodeList/Delete', values)
                    .then(
                    function (response) {
                        thisObj.setState({ modalLoad: false });
                        if (response.status == 1) {
                            thisObj.setState({ showDeleteConfirmationModal: false });
                            successModalCallback(response.message, thisObj.refreshStandardCodeList);
                        } else {
                            thisObj.setState({ showDeleteConfirmationModal: false });
                            errorModal(response.message);
                        }
                    }).catch(error => error);
           
    }

    thisObj = this;
    standardCodeListList = (response) => {
        //console.log(thisObj)
        var datas = [];
        const standardCodeListList = response.value
        const permissions = thisObj.props.permissions;
        const perLevel = checkPermission(permissions, ["self"]);

        // Loop to create table datasource
        for (var i = 0; i < standardCodeListList.length; i++) {

            const standardCodeListID = standardCodeListList[i].standardCodeListID;
            
            const editCell = <div>

                {perLevel >= 2 ? <ButtonWithToolTip
                    name={standardCodeListList[i].codeListName + "_Edit"}
                    style={{ marginRight: 5 }}
                    tooltip={perLevel >= 2 ? "Edit" : "View"}
                    shape="circle"
                    classname="fas fa-pen"
                    size="small"
                    onClick={() => thisObj.editStandardCodeList(standardCodeListID)}
                /> : ""}
        
                {perLevel >= 4 ? <ButtonWithToolTip
                        name={standardCodeListList[i].codeListName + "_Delete"}
                        style={{ marginRight: 5 }}
                        tooltip='Delete'
                        shape="circle"
                        classname="fas fa-trash-alt"
                        size="small"
                        onClick={() => thisObj.deleteStandardCodeList(standardCodeListID)}
                /> : ""}

            </div>;

            datas.push({
                key: standardCodeListList[i].standardCodeListID,
                variableName: standardCodeListList[i].variableName,
                codeListName: standardCodeListList[i].codeListName,
                cdiscDataStandardID: standardCodeListList[i].cdiscDataStandardID,
                cdiscDataStandardText: standardCodeListList[i].cdiscDataStandardText,
                cdiscDataStdVersionID: standardCodeListList[i].cdiscDataStdVersionID,
                cdiscDataStdVersionText: standardCodeListList[i].cdiscDataStdVersionText,
                actions: editCell
            });
        }

        //Setting values to state for re-rendering
        thisObj.setState({ dataSource: datas, loading: false });
    }
    render() {

        const permissions = this.props.permissions;

        const columns = [
            {
                title: 'Standard',
                dataIndex: 'cdiscDataStandardText',
                key: 'cdiscDataStandardText',
                sorter: (a, b) => stringSorter(a, b, 'cdiscDataStandardText'),
                width: 100
            },
            {
                title: 'Standard Version',
                dataIndex: 'cdiscDataStdVersionText',
                key: 'cdiscDataStdVersionText',
                sorter: (a, b) => stringSorter(a, b, 'cdiscDataStdVersionText'),
                width: 100
            },
            {
                title: 'Variable Name',
                dataIndex: 'variableName',
                key: 'variableName',
                sorter: (a, b) => stringSorter(a, b, 'variableName'),
                width: 100
            },
            {
                title: 'CodeList Name',
                dataIndex: 'codeListName',
                key: 'codeListName',
                sorter: (a, b) => stringSorter(a, b, 'codeListName'),
                width: 100
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 100
            }
        ];
        const { getFieldDecorator } = this.props.form;
        const { showAddStandardCodeListModal, action, cDISCDataStandardID, cDISCDataStdVersionID, title, showCDISCDataStdRoleList, showStandardCodeList, standardCodeListID } = this.state;

        return (
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-list-ul" />
                        <span> Standard Codelist</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent>

                    <Spin indicator={antIcon} spinning={this.state.loading}>

                        <ReactTable
                            columns={columns}
                            dataSource={this.state.dataSource}
                            addAction={checkPermission(permissions, ["self"]) >= 3 ? this.addStandardCodeList : null}
                            scroll={{ y: "calc(100vh - 314px)" }}
                        />
                    </Spin>
                    {(action == "Update" || action == "Create") && <AddStandardCodeList readOnly={checkPermission(permissions, ["self"]) <= 1} visible={showAddStandardCodeListModal} title={this.state.title} standardIDForCreateAndUpdate={thisObj.props.cDISCDataStandardID} stdVersionIDForCreateAndUpdate={thisObj.props.cDISCDataStdVersionID} handleCancel={this.handleAddStandardCodeListCancel} history={this.refreshStandardCodeList} standardCodeListID={standardCodeListID} action={action} />}
                    {(action == "Delete") && <ConfirmModal title="Delete Standard Codelist" history={this.props.history} SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteConfirmationModal} handleCancel={this.handleCancelDeleteConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />}
                </LayoutContent>

            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(StandardCodelistList);
export default WrappedApp;

