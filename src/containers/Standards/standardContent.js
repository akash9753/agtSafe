import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import AddStandard from './addStandardjs.js';
import NCICodelistList from './NCICodelistList.js';
import CustomCodeList from './CustomCodeList.js';
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

class StandardList extends Component {

    constructor(props) {
        super(props);

        this.addStandard = this.addStandard.bind(this);

        this.state = {
            loading: true,
            title: null,
            showAddStandardModal: false,
            showDeleteConfirmationModal: false,
            action: "",
            modalLoading: false,
            cdiscDataStandardID: 0,
            customCodeListID:0,
            showNCICodeList: false,
            showCustomCodeList: false,
            modalLoad: false,
        };

        //Getting version list by standard id

        thisObj = this;
        thisObj.getList(thisObj.props);

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.pageRefresh) {
            thisObj.setState({ loading: true });
            thisObj.getList(nextProps);
        }
    }

    getList = (data) => {
        CallServerPost('CDISCDataStandard/GetAllCDISCDataStandard')
            .then(
                function (response) {
                    if (response.value != null) {
                        // if (thisObj.props.isCustom === 0) {                            
                        response.value = response.value.filter(x => x.standardName !== null);
                            thisObj.setState({ loading: false });
                            thisObj.versionList(response);
                        //} else {
                        //    response.value = response.value.filter(x => x.standardName != "SDTM-IG" && x.standardName != "ADAM" && x.standardName !== "SEND-IG" && x.standardName !== "OMOP CDM");
                        //    thisObj.setState({ loading: false });
                        //    thisObj.versionList(response);
                        //}                        
                    }
                    else {
                        thisObj.setState({ showNCICodeList: false, dataSource: [], loading: false, showNCICodeList: false, });
                    }

                });
    }

    addStandard = () => {
        this.setState({ title: "Add Standard", showAddStandardModal: true, action: 'Create', cdiscDataStandardID: 0, showNCICodeList: false, showCustomCodeList: false })

    }

    editStandard = (cdiscDataStandardID) => {
        this.setState({ title: "Edit Standard", showAddStandardModal: true, action: 'Update', cdiscDataStandardID: cdiscDataStandardID, showNCICodeList: false, showCustomCodeList:false })

    }

    handleAddStandardCancel = () => {
        this.setState({ action: "", showAddStandardModal: false });
    }

    handleCancelDeleteConfirmationModal = () => {
        this.setState({ showDeleteConfirmationModal: false });
        this.props.form.resetFields(["Change Reason"]);

    }

    deleteStandard = (cdiscDataStandardID) => {

        this.setState({ showDeleteConfirmationModal: true, action: 'Delete', cdiscDataStandardID: cdiscDataStandardID });
    }


    showNCICodelist = (cdiscDataStandardID) => {
        this.setState({ title: "NCI CodeList", showAddStandardModal: false, cdiscDataStandardID: cdiscDataStandardID, showNCICodeList: true })

    }

    showCustomCodeList = (cdiscDataStandardID) =>
    {
        this.setState({ title: "Custom CodeList", showAddStandardModal: false, cdiscDataStandardID: cdiscDataStandardID, showCustomCodeList: true })

    }


    refreshTree = () => {
        thisObj.props.history();
        thisObj.setState({ modalLoading: false, action: '', showDeleteConfirmationModal: false, showAddStandardModal: false })

    }


    handleDelete = (ChangeReason) => {

        const thisObj = this;
        let values = {};

        thisObj.setState({ modalLoad: true });
        values["ChangeReason"] = ChangeReason;
        values["CDISCDataStandardID"] = thisObj.state.cdiscDataStandardID;

        PostCallWithZone('CDISCDataStandard/Delete', values)
            .then(
                function (response) {
                    thisObj.setState({ modalLoad: false });
                    if (response.status == 1) {
                        thisObj.setState({ showDeleteConfirmationModal: false });
                        successModalCallback(response.message, thisObj.refreshTree);
                    } else {
                        thisObj.setState({ showDeleteConfirmationModal: false });
                        errorModal(response.message);
                    }
                }).catch(error => error);

    }

    thisObj = this;
    versionList = (response) => {
        var datas = [];
        const permissions = thisObj.props.permissions;
        const versionList = response.value;
        const perLevel = checkPermission(permissions, ["self"]);
        // Loop to create table datasource
        for (var i = 0; i < versionList.length; i++) {
            const cdiscDataStandardID = versionList[i].cdiscDataStandardID;
            const editCell = <div>

                {perLevel >= 2 /*&& cdiscDataStandardID > 2*/ ? <ButtonWithToolTip
                    name={versionList[i].standardName + "_Edit"}
                    style={{ marginRight: 5 }}
                    tooltip={perLevel >= 2 ? "Edit" : "View"}
                    shape="circle"
                    classname="fas fa-pen"
                    size="small"
                    onClick={() => thisObj.editStandard(cdiscDataStandardID)}
                /> : null}

                {perLevel >= 4 /*&& cdiscDataStandardID > 2*/ ? <ButtonWithToolTip
                    name={versionList[i].standardName + "_Delete"}
                    style={{ marginRight: 5 }}
                    tooltip='Delete'
                    shape="circle"
                    classname="fas fa-trash-alt"
                    size="small"
                    onClick={() => thisObj.deleteStandard(cdiscDataStandardID)}
                /> : null}

                {perLevel >= 1 ? <ButtonWithToolTip
                    name={versionList[i].standardName + "_NCI CodeList"}
                    style={{ marginRight: 5 }}
                    tooltip='NCI CodeList'
                    shape="circle"
                    classname="fas fa-list-alt"
                    size="small"
                    onClick={() => thisObj.showNCICodelist(cdiscDataStandardID)}
                /> : null}

                {perLevel >= 1 ? <ButtonWithToolTip
                    name={versionList[i].standardName + "_Custom CodeList"}
                    style={{ marginRight: 5 }}
                    tooltip='Custom CodeList'
                    shape="circle"
                    classname="fas fa-atlas"
                    size="small"
                    onClick={() => thisObj.showCustomCodeList(cdiscDataStandardID)}
                /> : null}

            </div>;
            //console.log(datas);
            datas.push({
                key: versionList[i].cdiscDataStandardID,
                standardName: versionList[i].standardName,
                standardDescription: versionList[i].standardDescription,
                actions: editCell
            });
        }

        //Setting values to state for re-rendering
        thisObj.setState({ showNCICodeList: false, dataSource: datas, loading: false, showCustomCodeList: false });
    }
    render() {

        const columns = [
            {
                title: 'Standard Name',
                dataIndex: 'standardName',
                key: 'standardName',
                sorter: (a, b) => stringSorter(a, b, 'standardName'),
                width: 150
            },
            {
                title: 'Standard Description',
                dataIndex: 'standardDescription',
                key: 'standardDescription',
                sorter: (a, b) => stringSorter(a, b, 'standardDescription'),
                width: 150
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 150
            }
        ];
        const { getFieldDecorator } = this.props.form;
        const { showAddStandardModal, action, cdiscDataStandardID, customCodeListID, title, showNCICodeList, showCustomCodeList } = this.state;
        const permissions = this.props.permissions;

        return (
            <LayoutContentWrapper>


                <LayoutContent>
                    {
                        (!showNCICodeList && !showCustomCodeList) ?

                            <Spin indicator={antIcon} spinning={this.state.loading}>

                                <Breadcrumb>
                                    <Breadcrumb.Item>
                                        <i className="fas fa-list-ul" />
                                        <span> Standards</span>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        List
                                   </Breadcrumb.Item>
                                </Breadcrumb>



                                <ReactTable
                                    columns={columns}
                                    dataSource={this.state.dataSource}
                                    addAction={checkPermission(permissions, ["self"]) >= 3 ? this.addStandard : null}
                                    scroll={{ y: "calc(100vh - 314px)" }}
                                    />
                            
                            </Spin> :
                            <>
                                {showCustomCodeList && <CustomCodeList permissions={permissions} title={title} visible={showCustomCodeList} handleCancel={this.handleAddStandardCancel} history={this.refreshTree} cdiscDataStandardID={cdiscDataStandardID} action={action} />}
                                {showNCICodeList && <NCICodelistList permissions={permissions} title={title} visible={showNCICodeList} handleCancel={this.handleAddStandardCancel} history={this.refreshTree} cdiscDataStandardID={cdiscDataStandardID} action={action} />}
                            </>
                           }
                    {(action == "Update" || action == "Create") && <AddStandard readOnly={checkPermission(permissions, ["self"]) <= 1} title={title} visible={showAddStandardModal} handleCancel={this.handleAddStandardCancel} history={this.refreshTree} cdiscDataStandardID={cdiscDataStandardID} action={action} />}
                    {(action == "Delete") && <ConfirmModal title="Delete Standard" history={this.props.history} SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteConfirmationModal} handleCancel={this.handleCancelDeleteConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />}


                </LayoutContent>

            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(StandardList);
export default WrappedApp;

