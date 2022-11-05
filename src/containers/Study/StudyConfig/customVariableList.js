import React, { Component } from 'react';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import LayoutContent from '../../../components/utility/layoutContent';
import AddCustomVariable from './addCustomVariables.js';
import ConfirmModal from '../../Utility/ConfirmModal';
import ReactTable from '../../Utility/reactTable';
import { Icon, Spin, Form, Breadcrumb } from 'antd';
import { CallServerPost, PostCallWithZone, successModal, successModalCallback, errorModal, checkPermission, showProgress, hideProgress } from '../../Utility/sharedUtility';
//Importing ButtonWithToolTip for Edit and Delete Icon
import ButtonWithToolTip from '../../Tooltip/ButtonWithToolTip';
import { stringSorter } from '../../Utility/htmlUtility';

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
const dataSource = [];
var thisObj;

class CustomVariableList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: null,
            modalLoading: false,
            showAddVariable: false,
            showDeleteConfirmationModal: false,
            action: "",
            CDISCDataStdVariableMetadataID: 0,
            CDISCDataStdDomainMetadataID: 0,
            CDISCDataStdVersionID: 0,
            loading: true,
        };
        thisObj = this;
        thisObj.getList(thisObj.props);
    }

    componentWillReceiveProps(nextProps) {
        if (parseInt(nextProps.currentTreeNodeObject.dataRef.key.replace("domain", "")) !== parseInt(this.props.currentTreeNodeObject.dataRef.key.replace("domain", ""))) {
            thisObj.setState({ loading: true });
            thisObj.getList(nextProps);
        }

    }

    getList = (data) => {
        CallServerPost('CDISCDataStdVariableMetadata/GetStdVariableByDomainID', {
            CDISCDataStdDomainMetadataID: parseInt(data.currentTreeNodeObject.dataRef.key.replace("domain", "")),
            StudyID: thisObj.props.parentprops.study.studyID
        })
            .then(
                function (response) {
                    if (response.value != null) {

                        thisObj.VariableList(response);
                        thisObj.setState({ loading: false, action: "" });
                    }
                    else {
                        thisObj.setState({ dataSource: [], loading: false, action: "" });
                    }
                });
    }

    VariableList = (response) => {
        var datas = [];

        const VariableList = response.value
        // Loop to create table datasource
        const permissions = this.props.permissions;
        const perLevel = checkPermission(permissions, ["self"]);

        for (var i = 0; i < VariableList.length; i++) {

            const cDISCDataStdDomainMetadataID = VariableList[i].cdiscDataStdVariableMetadataID;
            const currentList = VariableList[i];


            const editCell = <div>


                {perLevel >= 2 ? <ButtonWithToolTip
                    name={VariableList[i].variableName + "_Edit"}
                    style={{ marginRight: 5 }}
                    tooltip={perLevel >= 2 ? "Edit" : "View"}
                    shape="circle"
                    disabled={!(thisObj.props.checkAvailability())}
                    classname="fas fa-pen"
                    size="small"
                    onClick={() => thisObj.editVariable(cDISCDataStdDomainMetadataID)}
                /> : ""}
                {perLevel >= 4 && currentList.projectID === thisObj.props.parentprops.study.projectID && currentList.studyID === thisObj.props.parentprops.study.studyID ? <ButtonWithToolTip
                    name={VariableList[i].variableName + "_Delete"}
                    style={{ marginRight: 5 }}
                    tooltip="Delete"
                    disabled={!(thisObj.props.checkAvailability())}
                    shape="circle"
                    classname="fas fa-trash-alt"
                    size="small"
                    onClick={() => thisObj.deleteVariable(cDISCDataStdDomainMetadataID)}
                /> : ""}

            </div>

            datas.push({
                key: VariableList[i].cdiscDataStdVariableMetadataID,
                variableName: VariableList[i].variableName,
                variableLabel: VariableList[i].variableLabel,
                dataType: VariableList[i].dataTypeText,
                origin: VariableList[i].origin,
                format: VariableList[i].format,
                role: VariableList[i].role,
                core: VariableList[i].core,
                project: VariableList[i].projectName,
                study: VariableList[i].studyName,
                actions: editCell
            });
        }

        //Setting values to state for re-rendering
        thisObj.setState({ dataSource: datas, loading: false });
    }

    addVariable = () => {
        this.setState({ showAddVariable: true, title: "Add Variable", action: 'Create', CDISCDataStdVariableMetadataID: 0 })

    }

    deleteVariable = (cDISCDataStdDomainMetadataID) => {
        this.setState({ showDeleteConfirmationModal: true, action: 'Delete', CDISCDataStdVariableMetadataID: cDISCDataStdDomainMetadataID });
    }

    handleCancelDeleteConfirmationModal = () => {
        this.setState({ action: "", showDeleteConfirmationModal: false });
        this.props.form.resetFields(["Change Reason"]);
    }

    editVariable = (cDISCDataStdDomainMetadataID) => {
        this.setState({ showAddVariable: true, title: "Edit Variable", action: 'Update', CDISCDataStdVariableMetadataID: cDISCDataStdDomainMetadataID })
    }

    handleAddVariableCancel = () => {
        this.props.form.resetFields();
        this.setState({ action: "", showAddVariable: false });
    }

    refreshTree = () => {
        thisObj.handleAddVariableCancel();
        thisObj.handleCancelDeleteConfirmationModal();
        thisObj.props.form.resetFields();
        thisObj.getList(thisObj.props);
        thisObj.props.getList(thisObj.props);
        thisObj.setState({ modalLoading: false, action: "" });
    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {}
        showProgress();
        thisObj.setState({ modalLoading: true });

        values["CDISCDataStdVariableMetadataID"] = thisObj.state.CDISCDataStdVariableMetadataID;
        values["ChangeReason"] = ChangeReason;

        PostCallWithZone('CDISCDataStdVariableMetadata/Delete', values)
            .then(
                function (response) {
                    if (response.status == 1) {
                        thisObj.setState({ loading: false, showDeleteConfirmationModal: false });
                        hideProgress();
                        successModalCallback(response.message, thisObj.refreshTree);
                    } else {
                        hideProgress();
                        thisObj.setState({ modalLoading: false, showDeleteConfirmationModal: false });
                        errorModal(response.message);
                    }
                }).catch(error => () => {
                    hideProgress();
                });

    }

    render() {

        const columns = [
            {
                title: 'Variable Name',
                dataIndex: 'variableName',
                key: 'variableName',
                sorter: (a, b) => stringSorter(a, b, 'variableName'),
                width: 100
            },
            {
                title: 'Variable Label',
                dataIndex: 'variableLabel',
                key: 'variableLabel',
                sorter: (a, b) => stringSorter(a, b, 'variableLabel'),
                width: 100
            },
            {
                title: 'Data Type',
                dataIndex: 'dataType',
                key: 'dataType',
                sorter: (a, b) => stringSorter(a, b, 'dataType'),
                width: 50
            },
            {
                title: 'Format',
                dataIndex: 'format',
                key: 'format',
                sorter: (a, b) => stringSorter(a, b, 'format'),
                width: 50
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 50
            }
        ];

        const { getFieldDecorator } = this.props.form;
        const { allParents } = this.props;
        const { showAddVariable, action, title, CDISCDataStdVariableMetadataID } = this.state;
        const permissions = this.props.permissions;

        return (
            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-list-ul" />
                        <span> Variable</span>
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
                            addAction={checkPermission(permissions, ["self"]) >= 3 && this.props.checkAvailability() ? this.addVariable : null}
                            scroll={{ y: "calc(100vh - 319px)" }}
                        />
                    </Spin>
                    {(action == "Update" || action == "Create") && <AddCustomVariable readOnly={checkPermission(permissions, ["self"]) <= 1} allParents={allParents} property={this.props} title={title} visible={showAddVariable} parentproperties={this.props.parentproperties} CDISCDataStdVersionID={this.props.currentTreeNodeObject.parentKey} CDISCDataStdDomainMetadataID={this.props.currentTreeNodeObject.dataRef.key} CDISCDataStdVariableMetadataID={CDISCDataStdVariableMetadataID} handleCancel={this.handleAddVariableCancel} history={this.refreshTree} action={action} cdiscDataStdDomainClassID={this.props.cdiscDataStdDomainClassID} />}
                    {(action == "Delete") && <ConfirmModal title="Delete Custom Variable" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteConfirmationModal} handleCancel={this.handleCancelDeleteConfirmationModal} getFieldDecorator={getFieldDecorator} /*loading={this.state.modalLoad}*/ />}

                </LayoutContent>
            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(CustomVariableList);
export default WrappedApp;

