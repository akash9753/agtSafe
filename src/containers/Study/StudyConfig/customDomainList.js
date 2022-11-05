import React, { Component } from 'react';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import LayoutContent from '../../../components/utility/layoutContent';
import AddCustomDomain from './addCustomDomain.js';
import ReactTable from '../../Utility/reactTable';
import { Icon, Spin, Form, Breadcrumb } from 'antd';
import { CallServerPost, PostCallWithZone, successModal, successModalCallback, errorModal, checkPermission } from '../../Utility/sharedUtility';
import ConfirmModal from '../../Utility/ConfirmModal';
import { stringSorter } from '../../Utility/htmlUtility';
//Importing ButtonWithToolTip for Edit and Delete Icon
import ButtonWithToolTip from '../../Tooltip/ButtonWithToolTip';

const dataSource = [];
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
var thisObj;

class CustomDomainList extends Component {

    constructor(props) {
        super(props);

        this.addCustomDomain = this.addCustomDomain.bind(this);

        this.state = {
            title: null,
            showAddCustomDomain: false,
            showDeleteConfirmationModal: false,
            action: "",
            dataSource,
            cDISCDataStdDomainMetadataID: 0,
            cDISCDataStdDomainClassID: 0,
            cDISCDataStdVersionID: 0,
            loading: true,
            modalLoad: false,
            pageRefresh: false
        }

        thisObj = this;
        thisObj.getList(thisObj.props);

    }

    componentWillReceiveProps(nextProps) {
        if (parseInt(nextProps.currentTreeNodeObject.dataRef.key.replace("class", "")) !== parseInt(this.props.currentTreeNodeObject.dataRef.key.replace("class", ""))) {
            thisObj.setState({ loading: true });
            thisObj.getList(nextProps);
        }
    }

    getList = (data) => {
        CallServerPost('CDISCDataStdDomainMetadata/GetCDISCDataStdDomainMetadataByStdDomainClass', { CDISCDataStdDomainClassID: parseInt(data.currentTreeNodeObject.dataRef.key.replace("class", "")), ProjectID: thisObj.props.parentprops.study.projectID, StudyID: thisObj.props.parentprops.study.studyID })
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

                {perLevel >= 2 && domainList[i].studyID === thisObj.props.parentprops.study.studyID ? <ButtonWithToolTip
                    name={domainList[i].domain + "_Edit"}
                    style={{ marginRight: 5 }}
                    disabled={!(thisObj.props.checkAvailability())}
                    tooltip={perLevel >= 2 ? "Edit" : "View"}
                    shape="circle"
                    classname="fas fa-pen"
                    size="small"
                    onClick={() => thisObj.editStdDomain(cdiscDataStdDomainMetadataID)}
                /> : ""}

                {perLevel >= 4 && domainList[i].studyID === thisObj.props.parentprops.study.studyID ? <ButtonWithToolTip
                    name={domainList[i].domain + "_Delete"}
                    style={{ marginRight: 5 }}
                    tooltip="Delete"
                    disabled={!(thisObj.props.checkAvailability())}
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
                project: domainList[i].projectName,
                study: domainList[i].studyName,
                actions: editCell
            });

        }

        //Setting values to state for re-rendering
        thisObj.setState({ dataSource: datas, loading: false });
    }

    addCustomDomain = () => {
        this.setState({ title: "Add Domain", showAddCustomDomain: true, action: 'Create', cDISCDataStdDomainMetadataID: 0 })
    }

    editStdDomain = (cdiscDataStdDomainMetadataID) => {
        this.setState({ title: "Edit Domain", showAddCustomDomain: true, action: 'Update', cDISCDataStdDomainMetadataID: cdiscDataStdDomainMetadataID })
    }

    deleteDomain = (cdiscDataStdDomainMetadataID) => {
        this.setState({ title: "Delete Domain", showDeleteConfirmationModal: true, cDISCDataStdDomainMetadataID: cdiscDataStdDomainMetadataID, action: "Delete" })
    }

    handleAddCustomDomainCancel = () => {
        this.setState({ action: "", showAddCustomDomain: false });
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
        thisObj.handleAddCustomDomainCancel();
        thisObj.handleCancelDeleteConfirmationModal();
        thisObj.props.form.resetFields();
        thisObj.getList(thisObj.props);
        thisObj.props.getList(thisObj.props);
        thisObj.setState({ modalLoading: false, action: '', showDeleteConfirmationModal: false, showAddCustomDomain: false })
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
        const { showAddCustomDomain, title, action, cDISCDataStdDomainMetadataID } = this.state;
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
                            addAction={checkPermission(permissions, ["self"]) >= 3 && this.props.checkAvailability() ? this.addCustomDomain : null}
                            scroll={{ y: "calc(100vh - 319px)" }}
                        />
                    </Spin>

                    {(action == "Update" || action == "Create") && <AddCustomDomain readOnly={checkPermission(permissions, ["self"]) <= 1} title={title} visible={showAddCustomDomain} cDISCDataStdVersionID={this.props.stdVersionID } cDISCDataStdDomainClassID={this.props.currentTreeNodeObject.dataRef.key} cDISCDataStdDomainMetadataID={cDISCDataStdDomainMetadataID} handleCancel={this.handleAddCustomDomainCancel} history={this.refreshTree} action={action} property={this.props} />}
                    {(action == "Delete") && <ConfirmModal title="Delete Custom Domain" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteConfirmationModal} handleCancel={this.handleCancelDeleteConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />}

                </LayoutContent>
            </LayoutContentWrapper>
        );
    }
}
const WrappedApp = Form.create()(CustomDomainList);
export default WrappedApp;