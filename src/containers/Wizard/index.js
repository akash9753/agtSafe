import React, { Component } from 'react';
import { Row, Col } from 'antd';
import Tabs, { TabPane } from '../../components/uielements/tabs';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, errorModal, successModal, getProjectRole, checkPermission, showProgress, hideProgress } from '../Utility/sharedUtility';
import { Icon, Input, Popconfirm, Breadcrumb, Form } from 'antd';
import Button from '../../components/uielements/button';
import TableWrapper from '../../styles/Table/antTable.style';
import ContentHolder from '../../components/utility/contentHolder';
import LayoutContent from '../../components/utility/layoutContent';
import ReactTable from '../Utility/reactTable';
import ConfirmModal from '../Utility/ConfirmModal';
import IntlMessages from '../../components/utility/intlMessages';

import Select, { SelectOption } from '../../components/uielements/select';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';

const Option = SelectOption;
const FormItem = Form.Item;
const dataSource = [];
const margin = {
    margin: '0 5px 0 0'
};

var allDataSource = [];
var thisObj, wizardID, formActionID
var deleteModal;

const projectRole = getProjectRole();

var formIDGlobal = null;
var formNameGlobal = null;
var formActionIDGlobal = null;

class Wizard extends Component {

    constructor(props) {
        super(props);
        const { permissions } = this.props;
        this.handleCancel = this.handleCancel.bind(this);
        this.addWizard = this.addWizard.bind(this);

        this.state = {
            dataSource,
            showEditModal: false,
            wizardID,
            formActionID,
            modalLoad:false,
        };

        thisObj = this;

        if (typeof this.props.location.state != 'undefined') {

           // formIDGlobal = this.props.location.state.FormID;
            formActionIDGlobal = this.props.location.state.FormActionID;
            // this.setState({ formActionIDGlobal: this.props.location.state.FormActionID})

        }
        showProgress();
        CallServerPost('Wizard/GetAllWizard', { FormActionID: formActionIDGlobal})
            .then(
                function (response) {

                    if (response.value != null) {
                        var datas = [];
                        const wizardList = response.value;
                        const perLevel = checkPermission(permissions, ['self']);
                        for (var i = 0; i < wizardList.length; i++) {
                            const wizardid = wizardList[i].wizardID;
                            const formActionid = wizardList[i].formActionID;
                            const editCell = <div>

                                
                                {perLevel >= 1 && wizardid > 35 ? <ButtonWithToolTip
                                    tooltip={perLevel >= 2 ? "Edit" : "View" }
                                    shape="circle"
                                    classname="fas fa-pen"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.editWizard(wizardid, formActionid, permissions)}
                                /> : ""}
                                
                                {perLevel >= 4 && wizardid > 35 ? <ButtonWithToolTip
                                        tooltip="Delete"
                                        shape="circle"
                                        classname="fas fa-trash-alt"
                                        size="small"
                                        style={margin}
                                        onClick={() => thisObj.deleteWizard(wizardid, formActionid)}
                                /> : ""}

                            </div>;
                            datas.push({
                                key: wizardList[i].wizardID,
                                wizardName: wizardList[i].wizardName,
                                wizardPosition: wizardList[i].wizardPosition,
                                cancelButton: wizardList[i].cancelButton == true ? "Yes" : "No",
                                actions: editCell

                            });
                        }
                        allDataSource = datas;
                        thisObj.setState({ dataSource: datas, loading: false, formActionID: formActionID });
                    }
                    hideProgress();
                })
            .catch(error => error);
    }

    backWizard = () => {
        this.props.history.push({
            pathname: '/trans/FormAction'
        }
        );
    }

    editWizard = (wizardID, formActionID, permissions) => {
        this.props.history.push({
            pathname: '/trans/editWizard',
            state: {
                WizardID: wizardID,
                FormActionID: formActionID,
                readOnly: checkPermission(permissions, ['self']) <= 1
            }
        }
        );
    }

    addWizard = () => {
        this.props.history.push({
            pathname: '/trans/addWizard',
            state: {
                loading: true,
                FormActionID: formActionIDGlobal
            }
        }
        );
    }

    deleteWizard = (wizardID) => {
        this.setState({ showEditModal: true, WizardID: wizardID });
    }


    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};

                thisObj.setState({ modalLoad: true });

                values["WizardID"] = thisObj.state.WizardID;
                values["TimeZone"] = "IST";
                values["ChangeReason"] = ChangeReason;
                values["UpdatedBy"] = projectRole.userProfile.userID;
                CallServerPost('Wizard/Delete', values)
                    .then(
                    function (response) {
                            thisObj.setState({ modalLoad: false });
                        if (response.status == 1) {
                            thisObj.setState({ showEditModal: false });
                                successModal(response.message, thisObj.props, "/trans/Wizard");
                        } else {
                            thisObj.setState({ showEditModal: false });
                                errorModal(response.message);
                            }
                        }).catch(error => error);
           
    }

    handleCancel = () => {
        this.setState({ showEditModal: false });
    }

    render() {
        const permissions = this.props.permissions;
        const columns = [
            {
                title: 'Wizard Name',
                dataIndex: 'wizardName',
                key: 'wizardName',
                width: 100,
                sorter: (a, b) => a.wizardName.length - b.wizardName.length,
            },
            {
                title: 'wizard Position',
                dataIndex: 'wizardPosition',
                key: 'wizardPosition',
                width: 100,
                sorter: (a, b) => a.wizardPosition.length - b.wizardPosition.length,
            },
            {
                title: 'Cancel Button',
                dataIndex: 'cancelButton',
                key: 'cancelButton',
                width: 50,
                sorter: (a, b) => a.cancelButton.length - b.cancelButton.length,
            },
            {
                    title: 'Actions',
                    dataIndex: 'actions',
                    key: 'actions',
                    width: 50
            }
        ];

        const { getFieldDecorator } = this.props.form;

        return (

            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-columns" ></i>
                        <span> Wizard </span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent>



                    <ReactTable
                        columns={columns}
                        dataSource={this.state.dataSource}
                        addAction={checkPermission(permissions, ['self']) >= 3 ? this.addWizard : null}
                        scroll={{ y: "calc(100vh - 256px)" }}
                        backButtonHandle={this.backWizard}
                        backButtonTitle="Back"
                    />

                    
                        <ConfirmModal loading={this.state.modalLoad} title="Delete Wizard" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
                   




                </LayoutContent>

            </LayoutContentWrapper>

        );
    }
}

const WrappedApp = Form.create()(Wizard);
export default WrappedApp;






