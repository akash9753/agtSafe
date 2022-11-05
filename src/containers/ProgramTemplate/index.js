import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, errorModal, PostCallWithZone, successModal,successModalCallback, checkPermission, showProgress, hideProgress } from '../Utility/sharedUtility';
import { Breadcrumb, Form } from 'antd';
import Button from '../../components/uielements/button';
import LayoutContent from '../../components/utility/layoutContent';
import ReactTable from '../Utility/reactTable';
import ConfirmModal from '../Utility/ConfirmModal';
import { stringSorter } from '../Utility/htmlUtility';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import AddProgramTemplate from './addProgramTemplate.js';
import { error } from 'util';

const FormItem = Form.Item;
const margin = {
    margin: '0 5px 0 0'
};
var thisObj;

class ProgramTemplate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            title: null,
            showAddProgramTemplateModal: false,
            programTemplateID: 0,
            action: "",
            modalLoad: false,
            showDeleteConfirmationModal: false
        };
        thisObj = this;
        thisObj.getList();
    }
    getList = () => {
        showProgress();
        CallServerPost('ProgramTemplate/GetAll', {})
            .then(
                function (response) {
                    if (response.value != null) {
                        if (response.value != null) {
                            var datas = [];
                            const programTemplateList = response.value;
                            const permissions = thisObj.props.permissions;
                            const perLevel = checkPermission(permissions, ['self']);
                            for (var i = 0; i < programTemplateList.length; i++) {
                                const programTemplateID = programTemplateList[i].programTemplateID;
                                const editCell = <div>



                                    {perLevel >= 1  ? <ButtonWithToolTip
                                        style={{ marginRight: 5 }}
                                        tooltip={perLevel >= 2 ? "Edit" : "View"}
                                        shape="circle"
                                        classname="fas fa-pen"
                                        size="small"
                                        onClick={() => thisObj.editProgramTemplate(programTemplateID)}
                                    /> : ""}


                                    {perLevel >= 4  ? <ButtonWithToolTip
                                        tooltip="Delete"
                                        shape="circle"
                                        classname="fas fa-trash-alt"
                                        size="small"
                                        style={margin}
                                        onClick={() => thisObj.deleteProgramTemplate(programTemplateID)}
                                    /> : ""}

                                </div>;
                                datas.push({
                                    key: programTemplateList[i].programTemplateID,
                                    programName: programTemplateList[i].name,
                                    label: programTemplateList[i].label,
                                    programDescription: programTemplateList[i].programDescription,
                                    programType: programTemplateList[i].programTypeText,
                                    actions: editCell
                                });
                            }
                            thisObj.setState({ dataSource: datas });
                        }
                    }
                    else {
                        thisObj.setState({ dataSource: [] });
                    }
                    hideProgress();
                });
    }

    addProgramTemplate = () => {
        this.setState({ title: "Add Program Template", showAddProgramTemplateModal: true, action: 'Create', programTemplateID: 0 })

    }
    handleAddProgramTemplateCancel = () => {
        thisObj.getList(thisObj.props);
        this.setState({ action: "", showAddProgramTemplateModal: false });

    }

    deleteProgramTemplate = (programTemplateID) => {
        const thisObj = this;
        CallServerPost('ProgramTemplate/GetProgramTemplateIDInMacroTemplate', { ProgramTemplateID: programTemplateID })
            .then(function (response) {
                if (response.status === 1) {
                    thisObj.setState({ showDeleteConfirmationModal: true, action: 'Delete', programTemplateID: programTemplateID });
                } else {
                    errorModal("Please first delete the macro template using this program template.");
                }
            });
    }

    editProgramTemplate = (programTemplateID) => {
        this.setState({ title: "Edit Program Template", showAddProgramTemplateModal: true, action: 'Update', programTemplateID: programTemplateID })

    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};
        thisObj.setState({ modalLoad: true });
        values["ProgramTemplateID"] = thisObj.state.programTemplateID;
        values["ChangeReason"] = ChangeReason;

        PostCallWithZone('ProgramTemplate/Delete', values)
            .then(
                function (response) {
                    if (response.status == 1) {
                        successModal(response.message, thisObj.props,"/trans/ProgramTemplate");
                    } else {
                        errorModal(response.message);
                    }
                    thisObj.setState({ modalLoad: false, showDeleteConfirmationModal: false });
                }).catch(error => error);

    }

    refreshProgramTemplate = () => {
        thisObj.handleCancelDeleteConfirmationModal();
        thisObj.getList();
        thisObj.setState({ action: "", showAddProgramTemplateModal: false, modalLoad: false, showDeleteConfirmationModal: false });

    }
    handleCancelDeleteConfirmationModal = () => {
        this.setState({ showDeleteConfirmationModal: false });
        this.props.form.resetFields(["Change Reason"]);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { showAddProgramTemplateModal, action, programTemplateID, title, dataSource } = this.state;
        const columns = [
            {
                title: 'Program Name',
                dataIndex: 'programName',
                key: 'programName',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'programName'),
            },
            {
                title: 'Label',
                dataIndex: 'label',
                key: 'label',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'label'),
            },
            {
                title: 'Program Description',
                dataIndex: 'programDescription',
                key: 'programDescription',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'programDescription'),
            },
            {
                title: 'Program Type',
                dataIndex: 'programType',
                key: 'programType',
                width: 50,
                sorter: (a, b) => stringSorter(a, b, 'programType'),
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 50
            }
        ];
        const permissions = this.props.permissions;
        return (

            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-file-powerpoint" ></i>
                        <span>Program Template</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent style={{ wordBreak: 'break-all' }}>

                    <ReactTable
                        columns={columns}
                        dataSource={dataSource}
                        addAction={checkPermission(permissions, ['self']) >= 3 ? this.addProgramTemplate : null}
                        scroll={{ y: "calc(100vh - 256px)" }}
                    />
                    {showAddProgramTemplateModal && <AddProgramTemplate readOnly={checkPermission(permissions, ['self']) <= 1} visible={showAddProgramTemplateModal} title={title} handleCancel={this.handleAddProgramTemplateCancel} programTemplateID={programTemplateID} action={action} />}
                    {this.state.showDeleteConfirmationModal && <ConfirmModal title="Delete Program Template" history={this.props.history} SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteConfirmationModal} handleCancel={this.handleCancelDeleteConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />}

                </LayoutContent>

            </LayoutContentWrapper>

        );
    }

}

const WrappedApp = Form.create()(ProgramTemplate);
export default WrappedApp;

