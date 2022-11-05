import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import AddStdDomainClass from './addStandardDomainClass.js';
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

class StandardDomainClassList extends Component {

    constructor(props) {
        super(props);

        this.addStandardDomainClass = this.addStandardDomainClass.bind(this);

        this.state = {
            title: null,
            modalLoading: false,
            showAddStdDomainClass: false,
            showDeleteConfirmationModal: false,
            action: "",
            cDISCDataStdDomainClassID: 0,
            loading: true,
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
        CallServerPost('CDISCDataStdDomainClass/GetCDISCDataStdDomainClassByStdVersionID', { CDISCDataStdVersionID: data.currentTreeNodeObject.dataRef.key })
            .then(
                function (response) {
                    if (response.value != null) {
                        thisObj.domainClassList(response);
                        thisObj.setState({ loading: false });
                    }
                    else {
                        thisObj.setState({ dataSource: [], loading: false });
                    }
                });
    }
    addStandardDomainClass = () => {
        this.setState({ title: "Add Domain Class", showAddStdDomainClass: true, action: 'Create', cDISCDataStdDomainClassID: 0 })

    }

    editStandardDomainClass = (cDISCDataStdDomainClassID) => {
        this.setState({ title: "Edit Domain Class", showAddStdDomainClass: true, action: 'Update', cDISCDataStdDomainClassID: cDISCDataStdDomainClassID })
    }

    handleAddStdDomainClassCancel = () => {
        this.setState({ action: "", showAddStdDomainClass: false });
    }

    handleCancelDeleteConfirmationModal = () => {
        this.setState({ showDeleteConfirmationModal: false });
        this.props.form.resetFields(["Change Reason"]);

    }

    deleteStandardDomainClass = (cdiscDataStdDomainClassID) => {
        this.setState({ showDeleteConfirmationModal: true, action: 'Delete', cDISCDataStdDomainClassID: cdiscDataStdDomainClassID });
    }

    refreshTree = () => {
        thisObj.props.history();
        thisObj.setState({ modalLoading: false, action: '', showDeleteConfirmationModal: false, showAddStdDomainClass: false })
    }

    moveOneStepUp = (cdiscDataStdDomainClassID, cdiscDataStdVersionID, updatedDateTimeText) => {

        PostCallWithZone('CDISCDataStdDomainClass/UpdateOrderNumber', { MoveUp: 1, CDISCDataStdDomainClassID: cdiscDataStdDomainClassID, CDISCDataStdVersionID: cdiscDataStdVersionID, ChangeReason: "OrderNumber update", UpdatedDateTimeText: updatedDateTimeText })
            .then(
                function (response) {
                    if (response.status == 1) {
                        thisObj.setState({ loading: false });
                        successModalCallback(response.message, thisObj.refreshTree);
                    } else {
                        thisObj.setState({ loading: false });
                        errorModal(response.message);
                    }
                }).catch(error => error);
    }

    moveOneStepDown = (cdiscDataStdDomainClassID, cdiscDataStdVersionID, updatedDateTimeText) => {

        PostCallWithZone('CDISCDataStdDomainClass/UpdateOrderNumber', { MoveUp: 0, CDISCDataStdDomainClassID: cdiscDataStdDomainClassID, CDISCDataStdVersionID: cdiscDataStdVersionID, ChangeReason: "OrderNumber update", UpdatedDateTimeText: updatedDateTimeText })
            .then(
                function (response) {
                    if (response.status == 1) {
                        thisObj.setState({ loading: false });
                        successModalCallback(response.message, thisObj.refreshTree);
                    } else {
                        thisObj.setState({ loading: false });
                        errorModal(response.message);
                    }
                }).catch(error => error);
    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {}
        thisObj.setState({ modalLoad: true });

        values["CDISCDataStdDomainClassID"] = thisObj.state.cDISCDataStdDomainClassID;
        values["ChangeReason"] = ChangeReason;

        PostCallWithZone('CDISCDataStdDomainClass/Delete', values)
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
    domainClassList = (response) => {


        var datas = [];
        const domainClassList = response.value;
        const permissions = thisObj.props.permissions;
        const perLevel = checkPermission(permissions, ["self"]);
        // Loop to create table datasource


        for (var i = 0; i < domainClassList.length; i++) {

            const cdiscDataStdDomainClassID = domainClassList[i].cdiscDataStdDomainClassID;
            const cdiscDataStdVersionID = domainClassList[i].cdiscDataStdVersionID;
            const currentList = domainClassList[i];
            const updatedDateTimeText = domainClassList[i].updatedDateTimeText;


            const editCell = <div>

                {perLevel >= 2 /*&& cdiscDataStdDomainClassID > 29*/ ? <ButtonWithToolTip
                    name={domainClassList[i].domainClassName + "_Edit"}
                    style={{ marginRight: 5 }}
                    tooltip={perLevel >= 2 ? "Edit" : "View"}
                    shape="circle"
                    classname="fas fa-pen"
                    size="small"
                    onClick={() => thisObj.editStandardDomainClass(cdiscDataStdDomainClassID)}
                /> : ""}

                {perLevel >= 4 /*&& cdiscDataStdDomainClassID > 29*/ ? <ButtonWithToolTip
                    name={domainClassList[i].domainClassName + "_Delete"}
                    style={{ marginRight: 5 }}
                    tooltip="Delete"
                    shape="circle"
                    classname="fas fa-trash-alt"
                    size="small"
                    onClick={() => thisObj.deleteStandardDomainClass(cdiscDataStdDomainClassID)}
                /> : ""}

                {perLevel >= 2 ? <ButtonWithToolTip
                    name={domainClassList[i].domainClassName + "_Step Up"}
                    style={{ marginRight: 5 }}
                    tooltip={((i - 1) != -1) ? "Move One Step Up" : null}
                    shape="circle"
                    classname="fas fa-arrow-up"
                    size="small"
                    disabled={((i - 1) != -1) ? false : true}
                    onClick={() => thisObj.moveOneStepUp(cdiscDataStdDomainClassID, cdiscDataStdVersionID, updatedDateTimeText)}
                /> : ""}

                {perLevel >= 2 ? <ButtonWithToolTip
                    name={domainClassList[i].domainClassName + "_Step Down"}
                    tooltip={((i + 1) == domainClassList.length) ? null : "Move One Step Down"}
                    shape="circle"
                    classname="fas fa-arrow-down"
                    size="small"
                    disabled={((i + 1) == domainClassList.length) ? true : false}
                    onClick={() => thisObj.moveOneStepDown(cdiscDataStdDomainClassID, cdiscDataStdVersionID, updatedDateTimeText)}
                /> : ""}

            </div>

            datas.push({
                key: domainClassList[i].cdiscDataStdDomainClassID,
                domainClassName: domainClassList[i].domainClassName,
                actions: editCell
            });
        }

        //Setting values to state for re-rendering
        thisObj.setState({ dataSource: datas, loading: false });
    }

    sorting = (a, b, sortorder) => {
        //console.log(sortorder);
    }

    render() {

        const columns = [
            {
                title: 'Domain Class Name',
                dataIndex: 'domainClassName',
                key: 'domainClassName',
                sorter: (a, b) => stringSorter(a, b, 'domainClassName'),
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
        const { showAddStdDomainClass, action, title, cDISCDataStdDomainClassID } = this.state;
        const permissions = this.props.permissions;

        return (
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-list-ul" />
                        <span> Domain Class</span>
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
                            addAction={checkPermission(permissions, ["self"]) >= 3 ? this.addStandardDomainClass : null}
                            scroll={{ y: "calc(100vh - 314px)" }}
                        />
                    </Spin>

                    {(action == "Update" || action == "Create") && <AddStdDomainClass readOnly={checkPermission(permissions, ["self"]) <= 1} title={title} visible={showAddStdDomainClass} versionIDForCreateAndUpdate={this.props.currentTreeNodeObject.dataRef.key} handleCancel={this.handleAddStdDomainClassCancel} history={this.refreshTree} cDISCDataStdDomainClassID={cDISCDataStdDomainClassID} action={action} />}
                    {(action == "Delete") && <ConfirmModal loading={this.state.modalLoad} title="Delete Domain Class" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteConfirmationModal} handleCancel={this.handleCancelDeleteConfirmationModal} getFieldDecorator={getFieldDecorator} />}

                </LayoutContent>

            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(StandardDomainClassList);
export default WrappedApp;

