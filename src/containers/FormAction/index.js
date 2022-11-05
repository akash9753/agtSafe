import React, { Component } from 'react';
import Tabs, { TabPane } from '../../components/uielements/tabs';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, errorModal, successModal, getProjectRole, checkPermission, showProgress, hideProgress } from '../Utility/sharedUtility';
import { Row, Col, Icon, Input, Popconfirm, Breadcrumb, Form } from 'antd';
import Button from '../../components/uielements/button';
import TableWrapper from '../../styles/Table/antTable.style';
import ContentHolder from '../../components/utility/contentHolder';
import LayoutContent from '../../components/utility/layoutContent';
import ReactTable from '../Utility/reactTable';
import ConfirmModal from '../Utility/ConfirmModal';
import IntlMessages from '../../components/utility/intlMessages';
import UpdateFormActionModal from './editFormAction';
import AddFormActionModal from './addFormAction';
import { stringSorter } from '../Utility/htmlUtility';

//ButtonWithToolTip Importing
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';

//const Option = SelectOption;
const FormItem = Form.Item;
const margin = {
    margin: '0 5px 0 0'
};

var allDataSource = [];
var thisObj;

const projectRole = getProjectRole();

var formIDGlobal = null;
var formNameGlobal = null;

class FormAction extends Component {

    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.addFormAction = this.addFormAction.bind(this);

        this.state = {
            dataSource: [],
            showDeleteModal: false,
            showUpdateModal: false,
            showAddModal:false,
            formActionID: null,
            formID: null,
            formName: null,
            modalLoad: false,
            action: ""
        };

        thisObj = this;

        if (typeof this.props.location.state != 'undefined') {
            formIDGlobal = this.props.location.state.FormID;
            formNameGlobal = this.props.location.state.FormName;
        }
        showProgress();
        CallServerPost('FormAction/GetAllFormAction', { FormID: formIDGlobal })
            .then(
            function (response) {

                if (response.value != null) {
                    var datas = [];
                    const formActionList = response.value;
                    const permissions = thisObj.props.permissions;
                    const perLevel = checkPermission(permissions, ["self"]);
                    for (var i = 0; i < formActionList.length; i++) {
                        const formActionid = formActionList[i].formActionID;
                        const formid = formActionList[i].formID;
                        const formName = formActionList[i].formText;                        

                        const editCell = <div>

                            
                            {perLevel >= 1 ? <ButtonWithToolTip
                                tooltip={perLevel >= 2 ? "Edit" : "View"}
                                shape="circle"
                                classname="fas fa-pen"
                                size="small"
                                style={margin}
                                onClick={() => thisObj.editFormAction(formid, formActionid)}
                            /> : ""}
                           
                            {perLevel >= 4 ? <ButtonWithToolTip
                                tooltip="Delete"
                                shape="circle"
                                classname="fas fa-trash-alt"
                                size="small"
                                style={margin}
                                onClick={() => thisObj.deleteFormAction(formActionid)}
                            />: ""}
                            
                            {perLevel >= 1 ? <ButtonWithToolTip
                                tooltip="Form Field Attribute"
                                shape="circle"
                                icon="form"
                                size="small"
                                style={margin}
                                onClick={() => thisObj.formFieldAttribute(formid, formActionid)}
                            />: ""}
                            
                            {perLevel >= 1 ? <ButtonWithToolTip
                                tooltip="Wizard"
                                shape="circle"
                                classname="fas fa-columns"
                                size="small"
                                style={margin}
                                onClick={() => thisObj.wizard(formid, formActionid)}
                            />: ""}
                            

                        </div>;
                        datas.push({
                            key: formActionList[i].formActionID,
                            formText: formActionList[i].formText,
                            status: formActionList[i].statusText,
                            actionName: formActionList[i].actionName,
                            changeReasonRequired: formActionList[i].changeReasonRequiredText,
                            actions: editCell
                        });
                    }
                    allDataSource = datas;
                    thisObj.setState({ dataSource: datas, loading: false, formID: formIDGlobal, formName: formNameGlobal });
                }
                hideProgress();
            })
            .catch(error => error);
    }

    backFormAction = () => {
        this.props.history.push({
            pathname: '/trans/Form'            
        }
        );
    }

    editFormAction = (formID, formActionID) => {
        this.setState({
            showUpdateModal: true,
            showAddModal: false,
            FormID: formID,
            FormActionID: formActionID,
            action : "Update"
        });
    }

    addFormAction = () => {
        this.setState( {
            showAddModal: true,
            showUpdateModal: false,
            FormID: formIDGlobal,
            FormName: formNameGlobal,
            action: "Create"
            })
        }
        
    
    formFieldAttribute = (formID, formActionID) => {
        this.props.history.push({
            pathname: '/trans/FormFieldAttribute',
            state: {
                
                FormID: formID,
                FormActionID: formActionID
            }
        }
        );
    }

    wizard = (formID, formActionID) => {

        this.props.history.push({
            pathname: '/trans/Wizard',
            state: {
                FormID: formID,
                FormActionID: formActionID
            }
        }
        );
    }

    deleteFormAction = (formActionID) => {
        this.setState({ showDeleteModal: true, FormActionID: formActionID });
    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;

        let values = {};
        thisObj.setState({ modalLoad: true });
            values["FormActionID"] = thisObj.state.FormActionID;
            values["ChangeReason"] = ChangeReason;
            values["TimeZone"] = "IST";
            values["UpdatedBy"] = projectRole.userProfile.userID;

                CallServerPost('FormAction/Delete', values)
                    .then(
                    function (response) {
                        if (response.status == 1) {
                            thisObj.setState({ modalLoad: false });
                            successModal(response.message, thisObj.props, "/trans/FormAction");
                        } else {
                            errorModal(response.message);
                            thisObj.setState({ modalLoad: false });
                        }
                    }).catch(error => error);
           
    }

    handleCancel = () => {
        this.setState({ showDeleteModal: false, showAddModal: false, showUpdateModal: false });
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
                title: 'Action Name',
                dataIndex: 'actionName',
                key: 'actionName',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'actionName'),
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                width: 50,
                sorter: (a, b) => stringSorter(a, b, 'status'),
            },
            {
                title: 'Change Reason Required',
                dataIndex: 'changeReasonRequired',
                key: 'changeReasonRequired',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'changeReasonRequired'),
            },

            {
                    title: 'Actions',
                    dataIndex: 'actions',
                    key: 'actions',
                    width: 80
            }
        ];

        const { getFieldDecorator } = this.props.form;
        const permissions = this.props.permissions;
        return (
            <span>
            <Row>
                <Col span={24}>
                    <Col span={12}>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                    <Icon type="form" />
                                <span> Form Action</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                List
                    </Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col span={12}>
                            <div className="topBar-info-label">
                            
                        </div>
                    </Col>
                </Col>
            </Row>
            <LayoutContentWrapper>
                
                <LayoutContent>



                    <ReactTable
                      columns={columns}
                      dataSource={this.state.dataSource}
                      addAction={checkPermission(permissions, ["self"]) >= 3 ? this.addFormAction : null}
                      scroll={{ y: "calc(100vh - 256px)" }}
                      backButtonHandle={this.backFormAction}
                      backButtonTitle="Back"
                    />

                    <Form>

                            { this.state.showAddModal && <AddFormActionModal
                                title="Add Form Action"
                                action={this.state.action}
                                history={this.props.history}
                                visible={this.state.showAddModal}
                                FormID={this.state.FormID}
                                parentRootProps={this.props.rootprops}
                                handleCancel={this.handleCancel}
                                getFieldDecorator={this.getFieldDecorator}
                            />}

                            { this.state.showUpdateModal && <UpdateFormActionModal
                                title="Edit Form Action"
                                action={this.state.action}
                                readOnly={checkPermission(permissions, ["self"]) <= 1}
                                history={this.props.history}
                                visible={this.state.showUpdateModal}
                                FormID={this.state.FormID}
                                FormActionID={this.state.FormActionID}
                                parentRootProps={this.props.rootprops}
                                handleCancel={this.handleCancel}
                                getFieldDecorator={this.getFieldDecorator}
                            />}
                        

                            <ConfirmModal
                                loading={this.state.modalLoad}
                                title="Delete Form Action"
                                SubmitButtonName="Delete"
                                onSubmit={this.handleDelete}
                                visible={this.state.showDeleteModal}
                                handleCancel={this.handleCancel}
                                getFieldDecorator={getFieldDecorator}
                            />
                    </Form>



                </LayoutContent>

            </LayoutContentWrapper>
            </span>

        );
    }

}

const WrappedApp = Form.create()(FormAction);
export default WrappedApp;



//<Col span={12}>
//    <div className="topBar-info-label">
//        <span><strong>Form Name: </strong></span>
//        <span>{formNameGlobal}</span>
//    </div>
//</Col>