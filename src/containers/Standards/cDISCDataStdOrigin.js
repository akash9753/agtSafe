import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import AddCDISCDataStdOrigin from './addCDISCDataStdOrigin.js';
import ConfirmModal from '../Utility/ConfirmModal';
import ReactTable from '../Utility/reactTable';
import { Icon, Spin, Form, Breadcrumb } from 'antd';
import Button from '../../components/uielements/button';
import { CallServerPost, PostCallWithZone, successModal, successModalCallback, errorModal, checkPermission } from '../Utility/sharedUtility';
import { stringSorter, intSorter } from '../Utility/htmlUtility';
//Importing ButtonWithToolTip for Edit and Delete Icon
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';

const dataSource = [];
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;

class CDISCDataStdOrigin extends Component {

    constructor(props) {
        super(props);

        this.addCDISCDataStdOrigin = this.addCDISCDataStdOrigin.bind(this);

        this.state = {
            loading: true,
            title: null,

            showDeleteConfirmationModal: false,
            action: "",
            cdiscDataStdVersionID: 0,
            showCDISCDataStdOriginList: false,
            showAddCDISCDataStdOriginModal: false,
            cDISCDataStdOriginID: 0,
            modalLoad: false,
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
        CallServerPost('CDISCDataStdOrigin/GetAllCDISCDataStdOrigin', { CDISCDataStdVersionID: data.cDISCDataStdVersionID })
            .then(
                function (response) {
                    if (response.value != null) {
                        thisObj.setState({ loading: false });
                        thisObj.cDISCDataStdOrigin(response);
                    }
                    else {
                        thisObj.setState({ dataSource: [], loading: false });
                    }

                });
    }

    addCDISCDataStdOrigin = () => {
        this.setState({ title: "Add Data Standard Origin", showAddCDISCDataStdOriginModal: true, action: 'Create', cDISCDataStdOriginID: 0 })

    }

    editCDISCDataStdOrigin = (cDISCDataStdOriginID) => {
        this.setState({ title: "Edit Data Standard Origin", showAddCDISCDataStdOriginModal: true, action: 'Update', cDISCDataStdOriginID: cDISCDataStdOriginID })

    }

    handleAddCDISCDataStdOriginCancel = () => {
        thisObj.getList(thisObj.props);
        this.setState({ action: "", showAddCDISCDataStdOriginModal: false });
    }

    handleCancelDeleteConfirmationModal = () => {
        this.setState({ showDeleteConfirmationModal: false });
        this.props.form.resetFields(["Change Reason"]);

    }

    deleteCDISCDataStdOrigin = (cDISCDataStdOriginID) => {

        this.setState({ showDeleteConfirmationModal: true, action: 'Delete', cDISCDataStdOriginID: cDISCDataStdOriginID });
    }

    refreshCDISCDataStdOrigin = () => {
        thisObj.setState({ action: "", showAddCDISCDataStdOriginModal: false });
        thisObj.handleCancelDeleteConfirmationModal();
        thisObj.setState({ modalLoading: false });
        thisObj.setState({ action: "" });
        thisObj.getList(thisObj.props);
    }


    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {}


        thisObj.setState({ modalLoad: true });
        values["CDISCDataStdOriginID"] = thisObj.state.cDISCDataStdOriginID;
        values["ChangeReason"] = ChangeReason;

        PostCallWithZone('CDISCDataStdOrigin/Delete', values)
            .then(
                function (response) {
                    thisObj.setState({ modalLoad: false });
                    if (response.status == 1) {
                        thisObj.setState({ showDeleteConfirmationModal: false });
                        successModalCallback(response.message, thisObj.refreshCDISCDataStdOrigin);
                    } else {
                        thisObj.setState({ showDeleteConfirmationModal: false });
                        errorModal(response.message);
                    }
                }).catch(error => error);

    }

    thisObj = this;
    cDISCDataStdOrigin = (response) => {
        var datas = [];
        const cDISCDataStdOrigin = response.value
        const permissions = this.props.permissions;
        const perLevel = checkPermission(permissions, ["self"]);
        //console.log(cDISCDataStdOrigin);

        // Loop to create table datasource
        for (var i = 0; i < cDISCDataStdOrigin.length; i++) {

            const cDISCDataStdOriginID = cDISCDataStdOrigin[i].cdiscDataStdOriginID;

            const editCell = <div>

                {perLevel >= 2 ? <ButtonWithToolTip
                    name={cDISCDataStdOrigin[i].dataStdOriginName + "_Edit"}
                    style={{ marginRight: 5 }}
                    tooltip={perLevel >= 2 ? "Edit" : "View"}
                    shape="circle"
                    classname="fas fa-pen"
                    size="small"
                    onClick={() => thisObj.editCDISCDataStdOrigin(cDISCDataStdOriginID)}
                /> : ""}

                {perLevel >= 4 ? <ButtonWithToolTip
                    name={cDISCDataStdOrigin[i].dataStdOriginName + "_Delete"}
                    style={{ marginRight: 5 }}
                    tooltip='Delete'
                    shape="circle"
                    classname="fas fa-trash-alt"
                    size="small"
                    onClick={() => thisObj.deleteCDISCDataStdOrigin(cDISCDataStdOriginID)}
                /> : ""}

            </div>;
            //console.log(datas);
            datas.push({
                key: cDISCDataStdOrigin[i].cdiscDataStdOriginID,
                originName: cDISCDataStdOrigin[i].originName,
                cdiscDataStdVersionID: cDISCDataStdOrigin[i].cdiscDataStdVersionID,
                cdiscDataStdVersionText: cDISCDataStdOrigin[i].cdiscDataStdVersionText,
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
                title: 'Data Standard Origin Name',
                dataIndex: 'originName',
                key: 'originName',
                sorter: (a, b) => stringSorter  (a, b, 'originName'),
                width: 100
            },
            {
                title: 'Data Standard Version',
                dataIndex: 'cdiscDataStdVersionText',
                key: 'cdiscDataStdVersionText',
                sorter: (a, b) => intSorter(a, b, 'cdiscDataStdVersionText'),
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
        const { showAddCDISCDataStdOriginModal, action, cDISCDataStdVersionID, title, showCDISCDataStdOriginList, cDISCDataStdOriginID } = this.state;

        return (
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-list-ul" />
                        <span>CDISC Data Standard Origin</span>
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
                            addAction={checkPermission(permissions, ["self"]) >= 3 ? this.addCDISCDataStdOrigin : null}
                            scroll={{ y: "calc(100vh - 314px)" }}
                        />
                    </Spin>
                    {(action == "Update" || action == "Create") && <AddCDISCDataStdOrigin readOnly={checkPermission(permissions, ["self"]) <= 1} visible={showAddCDISCDataStdOriginModal} title={this.state.title} stdVersionIDForCreateAndUpdate={thisObj.props.cDISCDataStdVersionID} handleCancel={this.handleAddCDISCDataStdOriginCancel} history={this.refreshCDISCDataStdOrigin} cDISCDataStdOriginID={cDISCDataStdOriginID} action={action} />}
                    {(action == "Delete") && <ConfirmModal title="Delete Data Standard Origin" history={this.props.history} SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteConfirmationModal} handleCancel={this.handleCancelDeleteConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />}
                </LayoutContent>

            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(CDISCDataStdOrigin);
export default WrappedApp;

