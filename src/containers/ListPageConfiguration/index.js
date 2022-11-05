import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, errorModal, PostCallWithZone, successModalCallback, checkPermission, showProgress, hideProgress } from '../Utility/sharedUtility';
import { Breadcrumb, Form } from 'antd';
import Button from '../../components/uielements/button';
import LayoutContent from '../../components/utility/layoutContent';
import ReactTable from '../Utility/reactTable';
import ConfirmModal from '../Utility/ConfirmModal';
import { stringSorter } from '../Utility/htmlUtility';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import AddListPageConfiguration from './addListPageConfiguration.js';

const FormItem = Form.Item;
const margin = {
    margin: '0 5px 0 0'
};
var thisObj;

class ListPageConfiguration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            title: null,
            showAddListPageConfigModal: false,
            listPageConfigurationID: 0,
            action: "",
            modalLoad: false,
        };
        thisObj = this;
        thisObj.getList();
    }
    getList = () => {
        let values = {};
        values["FormID"] = this.props.location.state.FormID;
        values["Visibility"] = true;
        showProgress();
        CallServerPost('ListPageConfiguration/GetAllByFormID', values)
            .then(
            function (response) {
                if (response.value != null) {
                    thisObj.setState({ loading: false });
                    if (response.value != null) {
                        var datas = [];
                        const listPageConfigurastionList = response.value;
                        const permissions = thisObj.props.permissions;
                        const perLevel = checkPermission(permissions, ['self']);
                        for (var i = 0; i < listPageConfigurastionList.length; i++) {
                            const listPageConfigurationID = listPageConfigurastionList[i].listPageConfigurationID;
                            const updatedDateTimeText = listPageConfigurastionList[i].updatedDateTimeText;
                            const editCell = <div>


                                {perLevel >= 1 && listPageConfigurationID > 102 ? <ButtonWithToolTip
                                    style={{ marginRight: 5 }}
                                    tooltip={perLevel >= 2 ? "Edit" : "View"}
                                    shape="circle"
                                    classname="fas fa-pen"
                                    size="small"
                                    onClick={() => thisObj.editListPageConfiguration(listPageConfigurationID)}
                                /> : ""}
                                {perLevel >= 2 ? <ButtonWithToolTip
                                    style={{ marginRight: 5 }}
                                    tooltip={((i - 1) != -1) ? "Move One Step Up" : null}
                                    shape="circle"
                                    classname="fas fa-arrow-up"
                                    size="small"
                                    disabled={((i - 1) != -1) ? false : true}
                                    onClick={() => thisObj.moveOneStepUp(listPageConfigurationID, updatedDateTimeText)}
                                /> : ""}

                                {perLevel >= 2 ? <ButtonWithToolTip
                                    style={{ marginRight: 5 }}
                                    tooltip={((i + 1) == listPageConfigurastionList.length) ? null : "Move One Step Down"}
                                    shape="circle"
                                    classname="fas fa-arrow-down"
                                    size="small"
                                    disabled={((i + 1) == listPageConfigurastionList.length) ? true : false}
                                    onClick={() => thisObj.moveOneStepDown(listPageConfigurationID, updatedDateTimeText)}
                                />	: ""}

                                {perLevel >= 4 && listPageConfigurationID > 102 ? <ButtonWithToolTip
                                    style={{ marginRight: 5 }}
                                    tooltip="Delete"
                                    shape="circle"
                                    classname="fas fa-trash-alt"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.deleteListPageConfiguration(listPageConfigurationID)}
                                /> : ""}             
                            </div>;
                            datas.push({
                                key: listPageConfigurationID,
                                columnName: listPageConfigurastionList[i].columnName,
                                columnType: listPageConfigurastionList[i].columnTypeText,
                                displayOrder: listPageConfigurastionList[i].displayOrder,
                                visibility: listPageConfigurastionList[i].visibilityText,
                                xpath: listPageConfigurastionList[i].xpath,
                                parentXpath: listPageConfigurastionList[i].parentxpath,
                                actions: editCell
                            });
                        }
                        thisObj.setState({ dataSource: datas, loading: false });
                    }
                }
                else {
                    thisObj.setState({ dataSource: [], loading: false });
                }
                hideProgress();
            });    
    }

    moveOneStepUp = (listPageConfigurationID, updatedDateTimeText) => {

        PostCallWithZone('ListPageConfiguration/UpdateDisplayOrder', { MoveUp: 1, ListPageConfigurationID: listPageConfigurationID, ChangeReason: "Display Order Number update", UpdatedDateTimeText: updatedDateTimeText })
            .then(
            function (response) {
                if (response.status == 1) {
                    thisObj.setState({ loading: false });
                    successModalCallback(response.message, thisObj.getList);
                } else {
                    thisObj.setState({ loading: false });
                    errorModal(response.message);
                }
            }).catch(error => error);
    }

    moveOneStepDown = (listPageConfigurationID, updatedDateTimeText) => {

        PostCallWithZone('ListPageConfiguration/UpdateDisplayOrder', { MoveUp: 0, ListPageConfigurationID: listPageConfigurationID, ChangeReason: "Display Order Number update", UpdatedDateTimeText: updatedDateTimeText })
            .then(
            function (response) {
                if (response.status == 1) {
                    thisObj.setState({ loading: false });
                    successModalCallback(response.message, thisObj.getList);
                } else {
                    thisObj.setState({ loading: false });
                    errorModal(response.message);
                }
            }).catch(error => error);
    }
    addListPageConfiguration = () => {
        this.setState({ title: "Add List Page Configuration", showAddListPageConfigModal: true, action: 'Create', listPageConfigurationID: 0 })

    }
    handleAddListPageConfigurationCancel = () => {
        thisObj.getList(thisObj.props);
        this.setState({ action: "", showAddListPageConfigModal: false });
    }

    deleteListPageConfiguration = (listPageConfigurationID) => {

        this.setState({ showDeleteConfirmationModal: true, action: 'Delete', listPageConfigurationID: listPageConfigurationID });
    }

    editListPageConfiguration = (listPageConfigurationID) => {
        this.setState({ title: "Edit List Page Configuration", showAddListPageConfigModal: true, action: 'Update', listPageConfigurationID: listPageConfigurationID })

    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};
        thisObj.setState({ modalLoad: true });
        values["ListPageConfigurationID"] = thisObj.state.listPageConfigurationID;
        values["ChangeReason"] = ChangeReason;

        PostCallWithZone('ListPageConfiguration/Delete', values)
            .then(
            function (response) {
                thisObj.setState({ modalLoad: false });
                if (response.status == 1) {
                    thisObj.setState({ showDeleteConfirmationModal: false });
                    successModalCallback(response.message, thisObj.refreshListPageConfig);
                } else {
                    thisObj.setState({ showDeleteConfirmationModal: false });
                    errorModal(response.message);
                }
            }).catch(error => error);

    }
    refreshListPageConfig = () => {        
        thisObj.handleCancelDeleteConfirmationModal();       
        thisObj.getList();
        thisObj.setState({ action: "", showAddListPageConfigModal: false, modalLoad: false});
    }
    handleCancelDeleteConfirmationModal = () => {
        this.setState({ showDeleteConfirmationModal: false });
        this.props.form.resetFields(["Change Reason"]);
    }

    backAction = () => {
        this.props.history.push({
            pathname: '/trans/Form'
        }
        );
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { showAddListPageConfigModal, action, listPageConfigurationID, title, dataSource } = this.state;
        
        const columns = [
            {
                title: 'Column Name',
                dataIndex: 'columnName',
                key: 'columnName',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'columnName'),
            },
            {
                title: 'Column Type',
                dataIndex: 'columnType',
                key: 'columnType',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'columnType'),
            }, 
            //{
            //    title: 'Display Order',
            //    dataIndex: 'displayOrder',
            //    key: 'displayOrder',
            //    width: 100,
            //    sorter: (a, b) => stringSorter(a, b, 'displayOrder'),
            //}, 
            {
                title: 'Visibility',
                dataIndex: 'visibility',
                key: 'visibility',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'visibility'),
            },
            {
                title: 'Xpath',
                dataIndex: 'xpath',
                key: 'xpath',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'xpath'),
            },
            {
                title: 'Parent Xpath',
                dataIndex: 'parentXpath',
                key: 'parentXpath',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'parentXpath'),
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 100
            }
        ];
        
        return (

            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-file-alt" ></i>
                        <span>{this.props.location.state.FormDesc}</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent style={{ wordBreak: 'break-all'}}>
                    
                    <ReactTable
                        columns={columns}
                        dataSource={dataSource}
                        addAction={checkPermission(this.props.permissions, ['self']) >= 3 ? this.addListPageConfiguration : null}
                        scroll={{ y: "calc(100vh - 256px)" }}
                        backButtonHandle={this.backAction}
                        backButtonTitle="Back"
                    />
                    {(action == "Create" || action == "Update") && <AddListPageConfiguration readOnly={checkPermission(this.props.permissions, ['self']) <= 1} visible={showAddListPageConfigModal} title={title} handleCancel={this.handleAddListPageConfigurationCancel} listPageConfigurationID={listPageConfigurationID} action={action} formID={this.props.location.state.FormID} tableName={this.props.location.state.FormName}/>}
                    {(action == "Delete") && <ConfirmModal title="Delete ListPageConfiguration" history={this.props.history} SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteConfirmationModal} handleCancel={this.handleCancelDeleteConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />}

                </LayoutContent>

            </LayoutContentWrapper>

        );
    }

}

const WrappedApp = Form.create()(ListPageConfiguration);
export default WrappedApp;

