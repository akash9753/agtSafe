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

const FormItem = Form.Item;
const margin = {
    margin: '0 5px 0 0'
};
var thisObj;

class MappingBlock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            title: null,
            showDeleteConfirmationModal: false,
            MappingBlockID: 0,
            action: "",
            modalLoad: false
        };
        thisObj = this;
        thisObj.getList();
    }
    getList = () => {
        showProgress();
        CallServerPost('MappingBlock/GetAllMappingBlock', {})
            .then(
            function (response) {
                if (response.value != null) {
                    thisObj.setState({ loading: false });
                    if (response.value !== null) {
                        var datas = [];
                        const MappingBlockList = response.value;
                        const permissions = thisObj.props.permissions;
                        const perLevel = checkPermission(permissions, ['self']);
                        for (var i = 0; i < MappingBlockList.length; i++) {
                            const MappingBlockID = MappingBlockList[i].mappingBlockID;
                            const editCell = <div>

                                {perLevel >= 1 ? <ButtonWithToolTip
                                    style={{ marginRight: 5 }}
                                    tooltip={perLevel >= 2 ? "Edit" : "View"}
                                    shape="circle"
                                    classname="fas fa-pen"
                                    size="small"
                                    onClick={() => thisObj.editMappingBlock(MappingBlockID, permissions)}
                                /> : ""}

                                {perLevel >= 4 ? <ButtonWithToolTip
                                    tooltip="Delete"
                                    shape="circle"
                                    classname="fas fa-trash-alt"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.deleteMappingBlock(MappingBlockID)}
                                /> : ""}

                            </div>;
                            datas.push({
                                key: MappingBlockList[i].MappingBlockID,
                                name: MappingBlockList[i].name,
                                type: MappingBlockList[i].type,
                                category: MappingBlockList[i].category,
                                view_category: MappingBlockList[i].view_category,
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

    AddMappingBlock = () => {
        this.props.history.push({
            pathname: '/trans/ModifyMappingBlock',
            state: {
                MappingBlockID: 0
            }
        });
    }

    deleteMappingBlock = (MappingBlockID) => {

        this.setState({ showDeleteConfirmationModal: true, action: 'Delete', MappingBlockID: MappingBlockID });
    }

    editMappingBlock = (MappingBlockID, permissions) => {
        this.props.history.push({
            pathname: '/trans/ModifyMappingBlock',
            state: {
                MappingBlockID: MappingBlockID,
                loding: true,
                ActionName: "Update",
                readOnly: checkPermission(permissions, ['self']) <= 1
            }
        });

    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};
        thisObj.setState({ modalLoad: true });
        values["MappingBlockID"] = thisObj.state.MappingBlockID;
        values["ChangeReason"] = ChangeReason;

        PostCallWithZone('MappingBlock/Delete', values)
            .then(
                function (response) {
                    thisObj.setState({ modalLoad: false });
                    if (response.status == 1) {
                        thisObj.setState({ showDeleteConfirmationModal: false });
                        successModalCallback(response.message, thisObj.refreshProgramTemplate);
                    } else {
                        thisObj.setState({ showDeleteConfirmationModal: false });
                        errorModal(response.message);
                    }
                }).catch(error => error);

    }
    refreshProgramTemplate = () => {
        thisObj.handleCancelDeleteConfirmationModal();
        thisObj.getList();
        thisObj.setState({ action: "", modalLoad: false });
    }
    handleCancelDeleteConfirmationModal = () => {
        this.setState({ showDeleteConfirmationModal: false });
        this.props.form.resetFields(["Change Reason"]);
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const { action, MappingBlockID, title, dataSource } = this.state;
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'name'),
            },
            {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'type'),
            },
            {
                title: 'Category',
                dataIndex: 'category',
                key: 'category',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'category'),
            },
            {
                title: 'ViewCategory',
                dataIndex: 'view_category',
                key: 'view_category',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'view_category'),
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 50,
            }
        ];
        const permissions = this.props.permissions;
        return (

            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-microchip" ></i>
                        <span>Mapping Block</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent style={{ wordBreak: 'break-all' }}>

                    <ReactTable
                        columns={columns}
                        dataSource={this.state.dataSource}
                        addAction={checkPermission(permissions, ['self']) >= 3 ? this.AddMappingBlock : null}
                        scroll={{ y: "calc(100vh - 256px)" }}
                    />
                    {(action == "Delete") && <ConfirmModal title="Delete Mapping Block" history={this.props.history} SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteConfirmationModal} handleCancel={this.handleCancelDeleteConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />}
                    


                </LayoutContent>

            </LayoutContentWrapper>

        );
    }

}

const WrappedApp = Form.create()(MappingBlock);
export default WrappedApp;

