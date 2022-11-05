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
import PyArguments from './arguments';

const FormItem = Form.Item;
const margin = {
    margin: '0 5px 0 0'
};
var thisObj;

class PyTemplate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            title: null,
            showDeleteConfirmationModal: false,
            pyTemplateID: 0,
            action: "",
            modalLoad: false,
            argumentsVisibility: false,
            pyArgs: null
        };
        thisObj = this;
        thisObj.getList();
    }
    getList = () => {
        showProgress();
        CallServerPost('PyTemplate/GetAllPyTemplate', {})
            .then(
                function (response) {
                        thisObj.setState({ loading: false });
                        if (response.value !== null) {
                            var datas = [];
                            const pyTemplateList = response.value;
                            const permissions = thisObj.props.permissions;
                            const perLevel = checkPermission(permissions, ['self']);
                            for (var i = 0; i < pyTemplateList.length; i++) {
                                const pyTemplateID = pyTemplateList[i].pyTemplateID;
                                const args = pyTemplateList[i].arguments;
                                const editCell = <div>

                                    {perLevel >= 1 ? <ButtonWithToolTip
                                        style={{ marginRight: 5 }}
                                        tooltip='View Arguments'
                                        shape="circle"
                                        classname="fas fa-th-list"
                                        size="small"
                                        onClick={() => thisObj.showArguments(args)}
                                    /> : ""}

                                    {perLevel >= 1 && pyTemplateID > 10 ? <ButtonWithToolTip
                                        style={{ marginRight: 5 }}
                                        tooltip={perLevel >= 2 ? "Edit" : "View"}
                                        shape="circle"
                                        classname="fas fa-pen"
                                        size="small"
                                        onClick={() => thisObj.editPyTemplate(pyTemplateID, permissions)}
                                    /> : ""}

                                    {perLevel >= 4 && pyTemplateID > 10 ? <ButtonWithToolTip
                                            tooltip="Delete"
                                            shape="circle"
                                            classname="fas fa-trash-alt"
                                            size="small"
                                            style={margin}
                                            onClick={() => thisObj.deletePyTemplate(pyTemplateID)}
                                    /> : ""}
                                    
                                </div>;
                                datas.push({
                                    key: pyTemplateList[i].pyTemplateID,
                                    name: pyTemplateList[i].name,
                                    programTemplateText: pyTemplateList[i].programTemplateText,
                                    actions: editCell
                                });
                            }
                            thisObj.setState({ dataSource: datas, loading: false });
                        }
                    else {
                        thisObj.setState({ dataSource: [], loading: false });
                    }
                    hideProgress();
                });
    }

    showArguments = (args) => {
        this.setState({ argumentsVisibility: !this.state.argumentsVisibility, pyArgs: JSON.parse(args) });
    }

    AddPyTemplate = () => {
        this.props.history.push({
            pathname: '/trans/ModifyPyTemplate',
            state: {
                pyTemplateID: 0
            }
        });
    }

    deletePyTemplate = (pyTemplateID) => {
        this.setState({ showDeleteConfirmationModal: true, action: 'Delete', pyTemplateID: pyTemplateID });
    }

    editPyTemplate = (pyTemplateID, permissions) => {
        this.props.history.push({
            pathname: '/trans/ModifyPyTemplate',
            state: {
                pyTemplateID: pyTemplateID,
                readOnly: checkPermission(permissions, ['self']) <= 1
            }
        });

    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};
        thisObj.setState({ modalLoad: true });
        values["PyTemplateID"] = thisObj.state.pyTemplateID;
        values["ChangeReason"] = ChangeReason;

        PostCallWithZone('PyTemplate/Delete', values)
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

    toogleArguments = () => {
        this.setState({argumentsVisibility : !this.state.argumentsVisibility});
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { action, title, dataSource, argumentsVisibility, pyArgs } = this.state;
        const columns = [
            {
                title: 'Python Template Name',
                dataIndex: 'name',
                key: 'name',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'name'),
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 100
            }
        ];
        const permissions = this.props.permissions;
        return (

            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-microchip" ></i>
                        <span>Python Template</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent style={{ wordBreak: 'break-all' }}>

                    <ReactTable
                        columns={columns}
                        dataSource={dataSource}
                        addAction={checkPermission(permissions, ['self']) >= 3 ? this.AddPyTemplate : null}
                        scroll={{ y: "calc(100vh - 256px)" }}
                    />
                    {(action == "Delete") && <ConfirmModal title="Delete Python Template" history={this.props.history} SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteConfirmationModal} handleCancel={this.handleCancelDeleteConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />}

                   
                    {
                        argumentsVisibility &&
                        <PyArguments visible={argumentsVisibility} argTypes={[]} handleCancel={this.toogleArguments} pyArgs={pyArgs} viewOnly={true} />
                    }
                        
                    
                </LayoutContent>

            </LayoutContentWrapper>

        );
    }

}

const WrappedApp = Form.create()(PyTemplate);
export default WrappedApp;

