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
import MacroArguments from './arguments';

const FormItem = Form.Item;
const margin = {
    margin: '0 5px 0 0'
};
var thisObj;

class MacroTemplate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            title: null,
            showDeleteConfirmationModal: false,
            macroTemplateID: 0,
            action: "",
            modalLoad: false,
            argumentsVisibility: false,
            macroArgs: null
        };
        thisObj = this;
        thisObj.getList();
    }
    getList = () => {
        showProgress();
        CallServerPost('MacroTemplate/GetAllMacroTemplate', {})
            .then(
                function (response) {
                    if (response.value != null) {
                        thisObj.setState({ loading: false });
                        if (response.value != null) {
                            var datas = [];
                            const macroTemplateList = response.value;
                            const permissions = thisObj.props.permissions;
                            const perLevel = checkPermission(permissions, ['self']);
                            for (var i = 0; i < macroTemplateList.length; i++) {
                                const macroTemplateID = macroTemplateList[i].macroTemplateID;
                                const args = macroTemplateList[i].arguments;
                                const editCell = <div>

                                    {perLevel >= 1 ? <ButtonWithToolTip
                                        style={{ marginRight: 5 }}
                                        tooltip='View Arguments'
                                        shape="circle"
                                        classname="fas fa-th-list"
                                        size="small"
                                        onClick={() => thisObj.showArguments(args)}
                                    /> : ""}

                                    {perLevel >= 1 && macroTemplateID > 0 ? <ButtonWithToolTip
                                        style={{ marginRight: 5 }}
                                        tooltip={perLevel >= 2 ? "Edit" : "View"}
                                        shape="circle"
                                        classname="fas fa-pen"
                                        size="small"
                                        onClick={() => thisObj.editMacroTemplate(macroTemplateID, /*programTemplateID,*/ permissions)}
                                    /> : ""}

                                    {perLevel >= 4 && macroTemplateID > 0 ? <ButtonWithToolTip
                                            tooltip="Delete"
                                            shape="circle"
                                            classname="fas fa-trash-alt"
                                            size="small"
                                            style={margin}
                                            onClick={() => thisObj.deleteMacroTemplate(macroTemplateID)}
                                    /> : ""}
                                    
                                </div>;
                                datas.push({
                                    key: macroTemplateList[i].macroTemplateID,
                                    macroDisplayName: macroTemplateList[i].macroDisplayName,
                                    macroName: macroTemplateList[i].macroName,
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

    showArguments = (args) => {
        this.setState({ argumentsVisibility: !this.state.argumentsVisibility, macroArgs: JSON.parse(args) });
    }

    AddMacroTemplate = () => {
        this.props.history.push({
            pathname: '/trans/ModifyMacroTemplate',
            state: {
                macroTemplateID: 0
            }
        });
    }

    deleteMacroTemplate = (macroTemplateID) => {

        this.setState({ showDeleteConfirmationModal: true, action: 'Delete', macroTemplateID: macroTemplateID });
    }

    editMacroTemplate = (macroTemplateID, permissions) => {
        this.props.history.push({
            pathname: '/trans/ModifyMacroTemplate',
            state: {
                macroTemplateID: macroTemplateID,
                readOnly: checkPermission(permissions, ['self']) <= 1
            }
        });

    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};
        thisObj.setState({ modalLoad: true });
        values["MacroTemplateID"] = thisObj.state.macroTemplateID;
        values["ChangeReason"] = ChangeReason;

        PostCallWithZone('MacroTemplate/Delete', values)
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
        const { action, macroTemplateID, title, dataSource, argumentsVisibility, macroArgs } = this.state;
        const columns = [
            {
                title: 'Macro Display Name',
                dataIndex: 'macroDisplayName',
                key: 'macroDisplayName',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'macroDisplayName'),
            },
            {
                title: 'Macro Name',
                dataIndex: 'macroName',
                key: 'macroName',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'macroName'),
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 30
            }
        ];
        const permissions = this.props.permissions;
        return (

            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-microchip" ></i>
                        <span>Macro Template</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent style={{ wordBreak: 'break-all' }}>

                    <ReactTable
                        columns={columns}
                        dataSource={dataSource}
                        addAction={checkPermission(permissions, ['self']) >= 3 ? this.AddMacroTemplate : null}
                        scroll={{ y: "calc(100vh - 256px)" }}
                    />
                    {(action == "Delete") && <ConfirmModal title="Delete Macro Template" history={this.props.history} SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteConfirmationModal} handleCancel={this.handleCancelDeleteConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />}

                   
                    {
                        argumentsVisibility &&
                        <MacroArguments visible={argumentsVisibility} argTypes={[]} handleCancel={this.toogleArguments} macroArguments={macroArgs} viewOnly={true} />
                    }
                        
                    
                </LayoutContent>

            </LayoutContentWrapper>

        );
    }

}

const WrappedApp = Form.create()(MacroTemplate);
export default WrappedApp;

