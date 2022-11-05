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
import { stringSorter } from "../Utility/htmlUtility";
import Select, { SelectOption } from '../../components/uielements/select';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';

const Option = SelectOption;
const FormItem = Form.Item;
const dataSource = [];
const margin = {
    margin: '0 5px 0 0'
};

var allDataSource = [];
var thisObj, dropDownFieldConfigID, formFieldAttributeID
var deleteModal;

const projectRole = getProjectRole();

var formIDGlobal = null;
var formNameGlobal = null;
var formFieldAttributeIDGlobal = null;

class DropDownFieldConfig extends Component {

    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.addDropDownFieldConfig = this.addDropDownFieldConfig.bind(this);

        this.state = {
            dataSource,
            showEditModal: false,
            dropDownFieldConfigID,
            formFieldAttributeID,
            modalLoad:false,
        };

        thisObj = this;

        if (typeof this.props.location.state != 'undefined') {

            // formIDGlobal = this.props.location.state.FormID;
            formFieldAttributeIDGlobal = this.props.location.state.FormFieldAttributeID;
            // this.setState({ formActionIDGlobal: this.props.location.state.FormActionID})

        }
        showProgress();
        CallServerPost('DropDownFieldConfig/GetAllDropDownFieldConfig', { FormFieldAttributeID: formFieldAttributeIDGlobal })
            .then(
                function (response) {

                    if (response.value != null) {
                        var datas = [];
                        const dropDownFieldConfigList = response.value;
                        const permissions = thisObj.props.permissions;
                        const perLevel = checkPermission(permissions, ["self"]);
                        for (var i = 0; i < dropDownFieldConfigList.length; i++) {
                            const dropDownFieldConfigid = dropDownFieldConfigList[i].dropDownFieldConfigID;
                            const formFieldAttributeid = dropDownFieldConfigList[i].formFieldAttributeID;
                            const editCell = <div>

                                {perLevel >= 1 && dropDownFieldConfigid > 10193 ? <ButtonWithToolTip
                                    tooltip={perLevel >= 2 ? "Edit" : "View"}
                                    shape="circle"
                                    classname="fas fa-pen"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.editDropDownFieldConfig(dropDownFieldConfigid, formFieldAttributeid, permissions)}
                                /> : ""}
                                
                                {perLevel >= 4 && dropDownFieldConfigid > 10193 ? <ButtonWithToolTip
                                    tooltip="Delete"
                                    shape="circle"
                                    classname="fas fa-trash-alt"
                                    size="small"
                                    style={margin}
                                    onClick={() => thisObj.deleteDropDownFieldConfig(dropDownFieldConfigid, formFieldAttributeid)}
                                /> : ""}

                        </div>;
                        datas.push({
                            key: dropDownFieldConfigList[i].dropDownFieldConfigID,
                            tableName: dropDownFieldConfigList[i].tableName,
                            textColumn: dropDownFieldConfigList[i].textColumn,
                            valueColumn: dropDownFieldConfigList[i].valueColumn,
                            whereCondition: dropDownFieldConfigList[i].whereCondition,
                            actions: editCell

                        });
                    }
                    allDataSource = datas;
                        thisObj.setState({ dataSource: datas, loading: false, formFieldAttributeID: formFieldAttributeID });
                    }
                    hideProgress();
            })
            .catch(error => error);
    }

    backDropDownFieldConfig = () => {
        this.props.history.push({
            pathname: '/trans/FormFieldAttribute',
        });
    }

    editDropDownFieldConfig = (dropDownFieldConfigID, formFieldAttributeID, permissions) => {
        this.props.history.push({
            pathname: '/trans/editDropDownFieldConfig',
            state: {
                DropDownFieldConfigID: dropDownFieldConfigID,
                FormFieldAttributeID: formFieldAttributeID,
                readOnly: checkPermission(permissions, ["self"]) <= 1
            }
        }
        );
    }

    addDropDownFieldConfig = () => {
        this.props.history.push({
            pathname: '/trans/addDropDownFieldConfig',
            state: {
                loading: true,
                FormFieldAttributeID: formFieldAttributeIDGlobal
            }
        }
        );
    }

    deleteDropDownFieldConfig = (dropDownFieldConfigID) => {
        this.setState({ showEditModal: true, DropDownFieldConfigID: dropDownFieldConfigID });
    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};
                thisObj.setState({ modalLoad: true });

                values["DropDownFieldConfigID"] = thisObj.state.DropDownFieldConfigID;
                values["TimeZone"] = "IST";
                values["UpdatedBy"] = projectRole.userProfile.userID;
                values["ChangeReason"] = ChangeReason;
                CallServerPost('DropDownFieldConfig/Delete', values)
                    .then(
                        function (response) {
                            if (response.status == 1) {
                                thisObj.setState({ showEditModal:false,modalLoad: true });
                                successModal(response.message, thisObj.props, "/trans/DropDownFieldConfig");
                            } else {
                                thisObj.setState({ modalLoad: true });
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
                title: 'Table Name',
                dataIndex: 'tableName',
                key: 'tableName',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'tableName'),
            },
            {
                title: 'Text Column',
                dataIndex: 'textColumn',
                key: 'textColumn',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'textColumn'),
            },
            {
                title: 'Value Column',
                dataIndex: 'valueColumn',
                key: 'valueColumn',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'valueColumn'),
            },
            {
                title: 'Where Condition',
                dataIndex: 'whereCondition',
                key: 'whereCondition',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'whereCondition'),
            },
            {
                    title: 'Actions',
                    dataIndex: 'actions',
                    key: 'actions',
                    width: 50
            }
        ];

        const { getFieldDecorator } = this.props.form;
        const permissions = this.props.permissions;

        return (

            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-receipt" ></i>
                        <span> Drop Down Field Config </span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent>



                    <ReactTable
                        columns={columns}
                        dataSource={this.state.dataSource}
                        addAction={checkPermission(permissions, ["self"]) >= 3 ? this.addDropDownFieldConfig : null}
                        scroll={{ y: "calc(100vh - 256px)" }}
                        backButtonHandle={this.backDropDownFieldConfig}
                        backButtonTitle="Back"
                       
                    />


                    <ConfirmModal loading={this.state.modalLoad} title="Delete DropDownFieldConfig" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />





                </LayoutContent>

            </LayoutContentWrapper>

        );
    }
}

        
const WrappedApp = Form.create()(DropDownFieldConfig);
export default WrappedApp; 
                  
