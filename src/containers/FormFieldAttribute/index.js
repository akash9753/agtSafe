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
import UpdateFormActionModal from './editFormFieldAttribute';
import AddFormActionModal from './addFormFieldAttribute';
import Select, { SelectOption } from '../../components/uielements/select';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import { stringSorter } from '../Utility/htmlUtility';

const Option = SelectOption;
const FormItem = Form.Item;
const dataSource = [];
const margin = {
    margin: '0 5px 0 0'
};

var allDataSource = [];
var thisObj, formFieldAttributeID, formActionID
var deleteModal, showEditModal, showUpdateModal, showAddModal;;

const projectRole = getProjectRole();

var formIDGlobal = null;
var formNameGlobal = null;
var formActionIDGlobal = null;

class FormFieldAttribute extends Component {

    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.addFormFieldAttribute = this.addFormFieldAttribute.bind(this);

        this.state = {
            dataSource,
            showEditModal: false,
            formFieldAttributeID,
            formActionID,
            formIDGlobal,
            formActionIDGlobal,
            modalLoad: false,
        };

        thisObj = this;

        if (typeof this.props.location.state != 'undefined') {

            formIDGlobal = this.props.location.state.FormID;
            formActionIDGlobal = this.props.location.state.FormActionID;
            // this.setState({ formActionIDGlobal: this.props.location.state.FormActionID})
            //alert('formIDGlobal: ' + formIDGlobal);
            //alert('formActionIDGlobal: ' + formActionIDGlobal);
        }
        showProgress();
        CallServerPost('FormFieldAttribute/GetAllFormFieldAttribute', { FormActionID: formActionIDGlobal })
            .then(
                function (response) {

                    if (response.value != null) {
                        var datas = [];
                        const formFieldAttributeList = response.value;
                        const permissions = thisObj.props.permissions;
                        const perLevel = checkPermission(permissions, ["self"]);
                        for (var i = 0; i < formFieldAttributeList.length; i++) {
                            const formFieldAttributeid = formFieldAttributeList[i].formFieldAttributeID;
                            const formActionid = formFieldAttributeList[i].formActionID;
                            const editCell = <div>


                                {perLevel >= 1 && formFieldAttributeid > 10852 ? <ButtonWithToolTip
                                    tooltip={perLevel >= 2 ? "Edit" : "View"}
                                    shape="circle"
                                    classname="fas fa-pen"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.editFormFieldAttribute(formFieldAttributeid, formActionid, permissions)}
                                /> : ""}

                                {perLevel >= 4 && formFieldAttributeid > 10852 ? <ButtonWithToolTip
                                    tooltip="Delete"
                                    shape="circle"
                                    classname="fas fa-trash-alt"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.deleteFormFieldAttribute(formFieldAttributeid, formActionid)}
                                /> : ""}

                                {perLevel >= 1 ? <ButtonWithToolTip
                                    tooltip="Drop Down Field Config"
                                    shape="circle"
                                    classname="fas fa-receipt"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.dropDownFieldConfig(formFieldAttributeid, formActionid)}
                                /> : ""}


                            </div>;
                            datas.push({
                                key: formFieldAttributeList[i].formFieldAttributeID,
                                formText: formFieldAttributeList[i].formText,
                                formActionText: formFieldAttributeList[i].formActionText,
                                attributeName: formFieldAttributeList[i].attributeName,
                                displayName: formFieldAttributeList[i].displayName,
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

    backFormFieldAttribute = () => {
        this.props.history.push({
            pathname: '/trans/FormAction'
        }
        );
    }

    editFormFieldAttribute = (formFieldAttributeID, formActionID, permissions) => {
        this.props.history.push({
            pathname: '/trans/editFormFieldAttribute',
            state: {
                FormID: formIDGlobal,
                FormActionID: formActionID,
                FormFieldAttributeID: formFieldAttributeID,
                readOnly: checkPermission(permissions, ['self']) <= 1
            }
        }
        );
    }

    addFormFieldAttribute = () => {
        this.props.history.push({
            pathname: '/trans/addFormFieldAttribute',
            state: {
                loading: true,
                FormID: formIDGlobal,
                FormActionID: formActionIDGlobal
            }
        }
        );
    }

    dropDownFieldConfig = (formFieldAttributeID, formActionID) => {
        this.props.history.push({
            pathname: '/trans/DropDownFieldConfig',
            state: {
                FormFieldAttributeID: formFieldAttributeID,
                FormActionID: formActionID
            }
        }
        );
    }


    deleteFormFieldAttribute = (formFieldAttributeID) => {
        this.setState({ showEditModal: true, FormFieldAttributeID: formFieldAttributeID });
    }


    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};

        thisObj.setState({ modalLoad: true });

        values["FormFieldAttributeID"] = thisObj.state.FormFieldAttributeID;
        values["TimeZone"] = "IST";
        values["UpdatedBy"] = projectRole.userProfile.userID;
        values["ChangeReason"] = ChangeReason;

        CallServerPost('FormFieldAttribute/Delete', values)
            .then(
                function (response) {
                    thisObj.setState({ modalLoad: false });
                    if (response.status == 1) {
                        successModal(response.message, thisObj.props, "/trans/FormFieldAttribute");
                    } else {
                        errorModal(response.message);
                    }
                }).catch(error => error);


    }

    handleCancel = () => {
        this.setState({ showEditModal: false });
    }

    render() {
        const columns = [
            {
                title: 'Form Name',
                dataIndex: 'formText',
                key: 'formText',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'formText'),
            },
            {
                title: 'Form Action',
                dataIndex: 'formActionText',
                key: 'formActionText',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'formActionText'),
            },
            {
                title: 'Attribute Name',
                dataIndex: 'attributeName',
                key: 'attributeName',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'attributeName'),
            },
            {
                title: 'Display Name',
                dataIndex: 'displayName',
                key: 'displayName',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'displayName'),
            },

            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 100
            }
        ];

        const { getFieldDecorator } = this.props.form;
        const permissions = this.props.permissions;

        return (

            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Icon type="form" />
                        <span> Form Field Attribute </span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent>



                    <ReactTable
                        columns={columns}
                        dataSource={this.state.dataSource}
                        addAction={checkPermission(permissions, ['self']) >= 3 ? this.addFormFieldAttribute : null}
                        scroll={{ y: "calc(100vh - 256px)" }}
                        backButtonHandle={this.backFormFieldAttribute}
                        backButtonTitle="Back"
                    />


                    <ConfirmModal loading={this.state.modalLoad} title="Delete FormFieldAttribute" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />





                </LayoutContent>

            </LayoutContentWrapper>

        );
    }
}

const WrappedApp = Form.create()(FormFieldAttribute);
export default WrappedApp;






