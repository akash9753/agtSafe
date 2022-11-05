import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import AddCustomCodeList from './addCustomCodeList.js';
import EditCustomCodeList from './editCustomCodeList.js';
import ConfirmModal from '../Utility/ConfirmModal';
import ReactTable from '../Utility/reactTable';
import { Icon, Spin, Form, Breadcrumb, Col, Row } from 'antd';
import Button from '../../components/uielements/button';
import { DownloadFileWithPostData, CallServerPost, PostCallWithZone, successModal, successModalCallback, errorModal, checkPermission, showProgress, hideProgress } from '../Utility/sharedUtility';
import { stringSorter } from '../Utility/htmlUtility';
import ViewCustomList from './ViewCustomList.js';
//Importing ButtonWithToolTip for Edit and Delete Icon
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
export const splitClass = 24;
export const SM_SPLIT = 24;
export const PADDING_RIGHT_10 = { paddingRight: "10px" };

const dataSource = [];
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
const FormItem = Form.Item;
const validData = ["Code", "Extensible", "CodeListName", "CDISCSubmissionValue", "CDISCSynonym", "CDISCDefinition", "PreferredTerm","ShortName","Group"];
var thisObj = [];
var thisObj;

class CustomCodeList extends Component {

    constructor(props) {
        super(props);

        this.addCustomCodeList = this.addCustomCodeList.bind(this);

        this.state = {
            loading: true,
            title: null,
            showAddStandardModal: false,
            showDeleteConfirmationModal: false,
            action: "",
            cdiscDataStandardID: 0,  
            isCustom: 0,
            showCustomCodeList: false,
            showAddCustomCodeListModal: false,
            customCodeListID: 0,
            CodeListVersion:0,
            rowNum:0,
            modalLoad: false,
            viewCustomList: false,
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
     
        CallServerPost('NCICodeList/GetAllNCICodeList', { CDISCDataStandardID: data.cdiscDataStandardID, isCustom: 1})
            .then(
                function (response) {
                    if (response.value != null) {
                        thisObj.setState({ loading: false });
                        thisObj.customCodeList(response);
                    }
                    else {
                        thisObj.setState({ dataSource: [], loading: false, action: "" });
                    }

                });
    }

    addCustomCodeList = () => {
        this.setState({ title: "Add Custom Codelist", showAddCustomCodeListModal: true, action: 'Create', customCodeListID: 0 })

    }

    editCustomCodeList = (customCodeListID) => {
        this.setState({ title: "Edit Custom Codelist", showAddCustomCodeListModal: true, action: 'Update', rowNum: customCodeListID})

    }

    handleAddCustomCodeListCancel = () => {
        thisObj.getList(thisObj.props);
        this.setState({ action: "", showAddCustomCodeListModal: false });
    }

    handleCancelDeleteConfirmationModal = () => {
        this.setState({ showDeleteConfirmationModal: false });
        this.props.form.resetFields(["Change Reason"]);

    }

    deleteCustomCodeList = (nciCodeListID) => {

        this.setState({ showDeleteConfirmationModal: true, action: 'Delete', nciCodeListID: nciCodeListID });
    }

    views = (customCodeListID, CodeListVersion) => {
        this.setState({ title: "View Custom List", viewCustomList: true, customCodeListID: customCodeListID, CodeListVersion: CodeListVersion  });

    }

    cancelView = () => {
        this.setState({ viewCustomList: false });
    }

    refreshCustomCodeList = () => {
        thisObj.setState({ action: "", showAddCustomCodeListModal: false });
        thisObj.handleCancelDeleteConfirmationModal();
        thisObj.setState({ modalLoading: false });
        thisObj.setState({ action: "" });
        thisObj.getList(thisObj.props);
    }

    excelDownloadTemplate = (name) => {
        showProgress();
        DownloadFileWithPostData("CustomCodeList/DownloadTemplate", name + "_Template.xlsx", {}).then(
            function (success) {
                hideProgress();
            }).catch(error => {
                hideProgress();
            });
    }

    handleDelete = (ChangeReason) => {

        const thisObj = this;
        let values = {};
        thisObj.setState({ modalLoad: true });
        values["CustomCodeListID"] = thisObj.state.nciCodeListID;
        values["ChangeReason"] = ChangeReason;

        PostCallWithZone('CustomCodeList/Delete', values)
            .then(
                function (response) {
                    thisObj.setState({ modalLoad: false });
                    if (response.status == 1) {
                        thisObj.setState({ showDeleteConfirmationModal: false });
                        successModalCallback(response.message, thisObj.refreshCustomCodeList);
                    } else {
                        thisObj.setState({ showDeleteConfirmationModal: false });
                        errorModal(response.message);
                    }
                }).catch(error => error);

    }

    thisObj = this;
    customCodeList = (response) => {
        //console.log(thisObj)
        var datas = [];
        const customCodeList = response.value
        const { rowNum, showEditModal, action } = this.state;
        const permissions = this.props.permissions;
        const perLevel = checkPermission(permissions, ["self"]);

        // Loop to create table datasource
        for (var i = 0; i < customCodeList.length; i++) {

            const nciCodeListID = customCodeList[i].nciCodeListID;
            const customcodeList = customCodeList[i];

            const editCell = <div>

                {perLevel >= 2 /*&& nCICodeListID > 91*/ ? <ButtonWithToolTip
                    name={customCodeList[i].customCodeListID + "_Delete"}
                    style={{ marginRight: 5 }}
                    tooltip='Delete'
                    shape="circle"
                    classname="fas fa-trash-alt"
                    size="small"
                    onClick={() => thisObj.deleteCustomCodeList(nciCodeListID)}
                /> : ""}
                <ButtonWithToolTip
                    tooltip="View"
                    shape="circle"
                    size="small"
                    classname="fas fa-clipboard-list"
                    onClick={() => thisObj.views(nciCodeListID, customcodeList.codeListVersion)}

                />

            </div>;
            //console.log(datas);
            datas.push({
                key: customCodeList[i].customCodeListID,
                codeListVersion: customCodeList[i].codeListVersion,
                actions: editCell
            });
        }

        //Setting values to state for re-rendering
        thisObj.setState({ dataSource: datas, loading: false });
    }
    render() {

        const columns = [
            {
                title: 'CodeList Version',
                dataIndex: 'codeListVersion',
                key: 'codeListVersion',
                sorter: (a, b) => stringSorter(a, b, 'codeListVersion'),
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
        const { showAddCustomCodeListModal, action, cdiscDataStandardID, title, showCustomCodeList, customCodeListID, CodeListVersion, viewCustomList } = this.state;
        const permissions = this.props.permissions;

        return (
            <LayoutContentWrapper>
                <LayoutContent>
            

                    {
                       (!viewCustomList) ?
                            <>
                                <Breadcrumb>
                                    <Breadcrumb.Item>
                                        <i className="fas fa-list-ul" />
                                        <span> Custom CodeList</span>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        List
                                    </Breadcrumb.Item>
                                </Breadcrumb>

                                <ReactTable
                                    columns={columns}
                                    dataSource={this.state.dataSource}
                                    addAction={checkPermission(permissions, ["self"]) >= 3 ? this.addCustomCodeList : null}
                                    customCodeListDownloadTemplate={() => this.excelDownloadTemplate("Custom CodeList")}
                                    scroll={{ y: "calc(100vh - 314px)" }}
                                />
                            </> :
                            <ViewCustomList
                                title={title}
                                visible={viewCustomList}
                                permissions={permissions}
                                cancelView={this.cancelView}
                                history={this.refreshCustomCodeList}
                                customCodeListID={customCodeListID}
                                CodeListVersion={CodeListVersion}
                                action={action} />
                    }
                    {(action == "Update" || action == "Create") && <AddCustomCodeList readOnly={checkPermission(permissions, ["self"]) <= 1} visible={showAddCustomCodeListModal} title={this.state.title} stdIDForCreateAndUpdate={thisObj.props.cdiscDataStandardID} handleCancel={this.handleAddCustomCodeListCancel} history={this.refreshCustomCodeList} customCodeListID={customCodeListID} action={action} />}
                    {(action == "Delete") && <ConfirmModal title="Delete Custom Codelist" history={this.props.history} SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteConfirmationModal} handleCancel={this.handleCancelDeleteConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />}
                </LayoutContent>

            </LayoutContentWrapper>
        );
    }
}

const WrappedApp = Form.create()(CustomCodeList);
export default WrappedApp;


