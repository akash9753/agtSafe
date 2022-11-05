import React, { Component } from 'react';
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
import { stringSorter } from '../Utility/htmlUtility';
//import PermissionModal from './permissionModal';
//import Select, { SelectOption } from '../../components/uielements/select';

//ButtonWithToolTip Importing
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';

//const Option = SelectOption;
const FormItem = Form.Item;
const dataSource = [];
const margin = {
    margin: '0 5px 0 0'
};

var allDataSource = [];
var thisObj, formID, formText;
var deleteModal;

const projectRole = getProjectRole();

class Forms extends Component {

    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.addForm = this.addForm.bind(this);

        this.state = {
            dataSource,
            showEditModal: false,            
            formID,
            formText,
            modalLoad:false

        };

        thisObj = this;
        showProgress();
        CallServerPost('Form/GetAllForm', {})
            .then(
            function (response) {

                if (response.value != null) {
                    var datas = [];
                    const formList = response.value;
                    const permissions = thisObj.props.permissions;
                    const perLevel = checkPermission(permissions, ["self"]);
                    for (var i = 0; i < formList.length; i++) {

                        const formid = formList[i].formID;
                        const formtext = formList[i].formName;
                        const formDesc = formList[i].formDescription;

                        const editCell = <div>

                            
                            {perLevel >= 1 && formid > 74 ? <ButtonWithToolTip
                                tooltip={perLevel >= 2 ? "Edit" : "View"}
                                shape="circle"
                                classname="fas fa-pen"
                                size="small"
                                style={margin}
                                onClick={() => thisObj.editForm(formid, permissions)}
                            /> : ""}
                            
                            {perLevel >= 4 && formid > 74 ? <ButtonWithToolTip
                                tooltip="Delete"
                                shape="circle"
                                classname="fas fa-trash-alt"
                                size="small"
                                style={margin}
                                onClick={() => thisObj.deleteForm(formid)}
                            /> : ""}
                                                        
                            {perLevel >= 1 ? <ButtonWithToolTip
                                tooltip="Form Action"
                                shape="circle"
                                classname="fas fa-file-code"
                                size="small"
                                style={margin}
                                onClick={() => thisObj.formAction(formid, formtext)}
                            /> : ""}

                            {perLevel >= 1 ? <ButtonWithToolTip
                                tooltip="List"
                                shape="circle"
                                classname="fas fa-list"
                                size="small"
                                style={margin}
                                onClick={() => thisObj.formList(formid, formtext, formDesc)}
                            /> : ""}
                              
                            
                        </div>;
                        datas.push({
                            key: formList[i].formID,
                            formName: formList[i].formName,
                            status: formList[i].statusText,
                            formDescription: formList[i].formDescription,
                            displayName: formList[i].displayName,
                            actions: editCell
                        });
                    }
                    allDataSource = datas;
                    thisObj.setState({ dataSource: datas, loading: false });
                }
                hideProgress();
            })
            .catch(error => error);
    }

    editForm = (formID, permissions) => {
        this.props.history.push({
            pathname: '/trans/editForm',
            state: {
                FormID: formID,
                readOnly: checkPermission(permissions, ["self"]) <= 1
            }
        }
        );
    }

    addForm = () => {
        this.props.history.push({
            pathname: '/trans/addForm',
            state: {
                loading: true,
            }
        }
        );
    }

    formAction = (formID, formText) => {       

        this.props.history.push({
            pathname: '/trans/FormAction',
            state: {
                FormID: formID,
                FormName: formText
            }
        }
        );
    }

    formList = (formID, formText, formDesc) => {

        this.props.history.push({
            pathname: '/trans/ListPageConfiguration',
            state: {
                FormID: formID,
                FormName: formText,
                FormDesc: formDesc
            }
        });
    }


    deleteForm = (formID) => {
        this.setState({ showEditModal: true, FormID: formID });
    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};
        thisObj.setState({  modalLoad: true });

                values["ChangeReason"] = ChangeReason;
                values["FormID"] = thisObj.state.FormID;
                values["TimeZone"] = "IST";
                values["UpdatedBy"] = projectRole.userProfile.userID;

                CallServerPost('Form/Delete', values)
                    .then(
                    function (response) {
                        thisObj.setState({ modalLoad: false });
                        if (response.status == 1) {
                            successModal(response.message, thisObj.props, "/trans/Form");
                        } else {
                            errorModal(response.message);
                        }
                    }).catch(error => error);
         

    }

    handleCancel = () => {
        this.setState({ showEditModal: false, showPermissionModal: false });
    }   


    render() {
        const columns = [
            {
                title: 'Form Name',
                dataIndex: 'formName',
                key: 'formName',
                width: 150,
                sorter: (a, b) => stringSorter(a, b, 'formName'),
            },
            {
                title: 'Form Description',
                dataIndex: 'formDescription',
                key: 'formDescription',
                width: 150,
                sorter: (a, b) => stringSorter(a, b, 'formDescription'),
            },
            {
                title: 'Display Name',
                dataIndex: 'displayName',
                key: 'displayName',
                width: 150,
                sorter: (a, b) => stringSorter(a, b, 'displayName'),
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                width: 50,
                sorter: (a, b) => stringSorter(a, b, 'status'),
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
                        <i className="fas fa-file-code" ></i>
                        <span> Form</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent>



                    <ReactTable
                        columns={columns}
                        dataSource={this.state.dataSource}
                        addAction={checkPermission(permissions, ["self"]) >= 3 ? this.addForm : null}
                        scroll={{ y: "calc(100vh - 256px)" }}
                    />

                    <Form>
                        <ConfirmModal loading={this.state.modalLoad} title="Delete Form" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showEditModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />
                    </Form>

                    

                </LayoutContent>

            </LayoutContentWrapper>

        );
    }

}

const WrappedApp = Form.create()(Forms);
export default WrappedApp;

