import React, { Component } from 'react';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import LayoutContent from '../../../components/utility/layoutContent';
import AddStdDomainClass from './addCustomDomainClass.js';
import ConfirmModal from '../../Utility/ConfirmModal';
import ReactTable from '../../Utility/reactTable';
import { Icon, Spin, Form, Breadcrumb } from 'antd';
import { CallServerPost, PostCallWithZone, successModal, successModalCallback, errorModal, checkPermission } from '../../Utility/sharedUtility';
import { stringSorter } from '../../Utility/htmlUtility';
//Importing ButtonWithToolTip for Edit and Delete Icon
import ButtonWithToolTip from '../../Tooltip/ButtonWithToolTip';

const dataSource = [];
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
var thisObj;

class DomainClassList extends Component {

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
            domClass:null
        };


        //Getting version list by standard id

        thisObj = this;
        thisObj.getList(thisObj.props);

    }

    componentWillReceiveProps(nextProps) {
        thisObj.getList(nextProps);
    }
    getList = (data) => {
        CallServerPost('CDISCDataStdDomainClass/GetCDISCDataStdDomainClassByStdVersionIDAndStudyID', { CDISCDataStdVersionID: this.props.stdVersionID, ProjectID: thisObj.props.parentprops.study.projectID, StudyID: thisObj.props.parentprops.study.studyID })
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

    editStandardDomainClass = (cDISCDataStdDomainClassID, domClass) => {
        this.setState({ title: "Edit Domain Class", showAddStdDomainClass: true, action: 'Update', cDISCDataStdDomainClassID: cDISCDataStdDomainClassID, domClass: domClass })
    }

    handleAddStdDomainClassCancel = () => {
        this.setState({ action: "", showAddStdDomainClass: false });
        this.props.form.resetFields(["Change Reason"]);
    }

    handleCancelDeleteConfirmationModal = () => {
        this.setState({ showDeleteConfirmationModal: false });
        this.props.form.resetFields(["Change Reason"]);

    }

    deleteStandardDomainClass = (cdiscDataStdDomainClassID) => {
        this.setState({ showDeleteConfirmationModal: true, action: 'Delete', cDISCDataStdDomainClassID: cdiscDataStdDomainClassID });
    }

    refreshTree = () => {
        thisObj.handleAddStdDomainClassCancel();
        thisObj.handleCancelDeleteConfirmationModal();
        thisObj.props.form.resetFields();
        thisObj.getList(thisObj.props);
        thisObj.props.getList();
        thisObj.setState({ modalLoading: false, action: '', showDeleteConfirmationModal: false, showAddStdDomainClass: false })
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
            const domClass = domainClassList[i];

            const editCell = <div>

                {perLevel >= 2 && currentList.projectID === thisObj.props.parentprops.study.projectID && currentList.studyID === thisObj.props.parentprops.study.studyID ? <ButtonWithToolTip
                    name={domainClassList[i].domainClassName + "_Edit"}
                    style={{ marginRight: 5 }}
                    tooltip={perLevel >= 2 ? "Edit" : "View"}
                    shape="circle"
                    disabled={!(thisObj.props.checkAvailability())}
                    classname="fas fa-pen"
                    size="small"
                    onClick={() => thisObj.editStandardDomainClass(cdiscDataStdDomainClassID, domClass)}
                /> : ""}

                {perLevel >= 4 && currentList.projectID === thisObj.props.parentprops.study.projectID && currentList.studyID === thisObj.props.parentprops.study.studyID ? <ButtonWithToolTip
                    name={domainClassList[i].domainClassName + "_Delete"}
                    style={{ marginRight: 5 }}
                    tooltip="Delete"
                    shape="circle"
                    disabled={!(thisObj.props.checkAvailability())}
                    classname="fas fa-trash-alt"
                    size="small"
                    onClick={() => thisObj.deleteStandardDomainClass(cdiscDataStdDomainClassID)}
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
                            addAction={checkPermission(permissions, ["self"]) >= 3 && this.props.checkAvailability() ? this.addStandardDomainClass : null}
                            scroll={{ y: "calc(100vh - 319px)" }}
                        />
                    </Spin>

                    {(action == "Update" || action == "Create") && <AddStdDomainClass domClass={this.state.domClass} readOnly={checkPermission(permissions, ["self"]) <= 1} title={title} property={this.props} visible={showAddStdDomainClass} versionIDForCreateAndUpdate={this.props.stdVersionID} handleCancel={this.handleAddStdDomainClassCancel} history={this.refreshTree} cDISCDataStdDomainClassID={cDISCDataStdDomainClassID} action={action} />}
                    {(action == "Delete") && <ConfirmModal loading={this.state.modalLoad} title="Delete Domain Class" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteConfirmationModal} handleCancel={this.handleCancelDeleteConfirmationModal} getFieldDecorator={getFieldDecorator} />}

                </LayoutContent>

            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(DomainClassList);
export default WrappedApp;

