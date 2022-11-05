import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import AddStdDomain from './addStandardDomain.js';
import ReactTable from '../Utility/reactTable';
import { Icon, Spin, Form, Breadcrumb } from 'antd';
import Button from '../../components/uielements/button';
import { CallServerPost, PostCallWithZone, successModal, successModalCallback, errorModal, checkPermission } from '../Utility/sharedUtility';
import ConfirmModal from '../Utility/ConfirmModal';
import { stringSorter } from '../Utility/htmlUtility';
//Importing ButtonWithToolTip for Edit and Delete Icon
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';

const dataSource = [];
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
var thisObj;

class StdDomainList extends Component {

    constructor(props) {
        super(props);

        this.addStdDomain = this.addStdDomain.bind(this);

        this.state = {
            title: null,
            showAddStdDomain: false,
            showDeleteConfirmationModal: false,
            action: "",
            dataSource,
            cDISCDataStdDomainMetadataID: 0,
            cDISCDataStdDomainClassID: 0,
            cDISCDataStdVersionID: 0,
            loading: true,
            modalLoad: false,
        }

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
        CallServerPost('CDISCDataStdDomainMetadata/GetCDISCDataStdDomainMetadataByStdDomainClass', { CDISCDataStdDomainClassID: data.currentTreeNodeObject.dataRef.key })
            .then(
                function (response) {
                    if (response.value != null) {
                        thisObj.doaminList(response);
                        thisObj.setState({ loading: false });
                    }
                    else {
                        thisObj.setState({ dataSource: [], loading: false });
                    }
                });
    }

    doaminList = (response) => {

        var datas = [];
        const domainList = response.value
        const permissions = this.props.permissions;
        const perLevel = checkPermission(permissions, ["self"]);
        // Loop to create table datasource
        for (var i = 0; i < domainList.length; i++) {

            const cdiscDataStdDomainMetadataID = domainList[i].cdiscDataStdDomainMetadataID;
            const currentList = domainList[i];

            const editCell = <div>

                {perLevel >= 2/* && cdiscDataStdDomainMetadataID > 10195*/ ? <ButtonWithToolTip
                    name={domainList[i].domain + "_Edit"}
                    style={{ marginRight: 5 }}
                    tooltip={perLevel >= 2 ? "Edit" : "View"}
                    shape="circle"
                    classname="fas fa-pen"
                    size="small"
                    onClick={() => thisObj.editStdDomain(cdiscDataStdDomainMetadataID)}
                /> : ""}

                {perLevel >= 4 /*&& cdiscDataStdDomainMetadataID > 10195*/ ? <ButtonWithToolTip
                    name={domainList[i].domain + "_Delete"}
                    style={{ marginRight: 5 }}
                    tooltip="Delete"
                    shape="circle"
                    classname="fas fa-trash-alt"
                    size="small"
                    onClick={() => thisObj.deleteDomain(cdiscDataStdDomainMetadataID)}
                /> : ""}

            </div>

            datas.push({
                key: domainList[i].cdiscDataStdDomainMetadataID,
                domain: domainList[i].domain,
                domainDescription: domainList[i].domainDescription,
                structure: domainList[i].structure,
                actions: editCell
            });

        }

        //Setting values to state for re-rendering
        thisObj.setState({ dataSource: datas, loading: false });
    }

    addStdDomain = () => {
        this.setState({ title: "Add Domain", showAddStdDomain: true, action: 'Create', cDISCDataStdDomainMetadataID: 0 })
    }

    editStdDomain = (cdiscDataStdDomainMetadataID) => {
        this.setState({ title: "Edit Domain", showAddStdDomain: true, action: 'Update', cDISCDataStdDomainMetadataID: cdiscDataStdDomainMetadataID })
    }

    deleteDomain = (cdiscDataStdDomainMetadataID) => {
        this.setState({ title: "Delete Domain", showDeleteConfirmationModal: true, cDISCDataStdDomainMetadataID: cdiscDataStdDomainMetadataID, action: "Delete" })
    }

    handleAddStdDomainCancel = () => {
        this.setState({ action: "", showAddStdDomain: false });
    }

    handleCancelDeleteConfirmationModal = () => {
        this.setState({ showDeleteConfirmationModal: false });
        this.props.form.resetFields(["Change Reason"]);
    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {}

        thisObj.setState({ modalLoad: true });
        values["ChangeReason"] = ChangeReason;
        values["CDISCDataStdDomainMetadataID"] = thisObj.state.cDISCDataStdDomainMetadataID;

        PostCallWithZone('CDISCDataStdDomainMetadata/Delete', values)
            .then(
                function (response) {
                    thisObj.setState({ modalLoad: false });
                    if (response.status == 1) {
                        thisObj.setState({ showDeleteConfirmationModal: false });
                        successModalCallback(response.message, thisObj.refreshTree);
                    }
                    else {
                        thisObj.setState({ showDeleteConfirmationModal: false });
                        errorModal(response.message);
                    }
                }).catch(error => error);

    }

    refreshTree = () => {
        thisObj.props.history();
        thisObj.setState({ modalLoading: false, action: '', showDeleteConfirmationModal: false, showAddStdDomain: false })
    }

    render() {
        const columns = [
            {
                title: 'Domain',
                dataIndex: 'domain',
                key: 'domain',
                sorter: (a, b) => stringSorter(a, b, 'domain'),
                width: 50
            },
            {
                title: 'Domain Description',
                dataIndex: 'domainDescription',
                key: 'domainDescription',
                sorter: (a, b) => stringSorter(a, b, 'domainDescription'),
                width: 150
            },
            {
                title: 'Structure',
                dataIndex: 'structure',
                key: 'structure',
                sorter: (a, b) => stringSorter(a, b, 'structure'),
                width: 150
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 50
            }
        ];

        const { getFieldDecorator } = this.props.form;
        const { showAddStdDomain, title, action, cDISCDataStdDomainMetadataID } = this.state;
        const permissions = this.props.permissions;

        return (
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-list-ul" />
                        <span>Domain</span>
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
                            addAction={checkPermission(permissions, ["self"]) >= 3 ? this.addStdDomain : null}
                            scroll={{ y: "calc(100vh - 314px)" }}
                        />
                    </Spin>

                    {(action == "Update" || action == "Create") && <AddStdDomain readOnly={checkPermission(permissions, ["self"]) <= 1} title={title} visible={showAddStdDomain} cDISCDataStdVersionID={this.props.currentTreeNodeObject.parentKey} cDISCDataStdDomainClassID={this.props.currentTreeNodeObject.dataRef.key} cDISCDataStdDomainMetadataID={cDISCDataStdDomainMetadataID} handleCancel={this.handleAddStdDomainCancel} history={this.refreshTree} action={action} />}
                    {(action == "Delete") && <ConfirmModal title="Delete Domain" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteConfirmationModal} handleCancel={this.handleCancelDeleteConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />}

                </LayoutContent>
            </LayoutContentWrapper>
        );
    }
}
const WrappedApp = Form.create()(StdDomainList);
export default WrappedApp;