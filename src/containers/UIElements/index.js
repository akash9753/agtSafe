import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, PostCallWithZone, errorModal, successModal, getProjectRole, checkPermission, showProgress, hideProgress } from '../Utility/sharedUtility';
import { Breadcrumb, Form } from 'antd';
import LayoutContent from '../../components/utility/layoutContent';
import ReactTable from '../Utility/reactTable';
import ConfirmModal from '../Utility/ConfirmModal';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import { stringSorter } from '../Utility/htmlUtility';
import AddUIElementModal from './AddUIElement';
import EditUIElementModal from './EditUIElement';

const dataSource = [];
const margin = {
    margin: '0 5px 0 0'
};

var allDataSource = [];
var thisObj;
var uIElementID = 0;
var deleteModal;

const projectRole = getProjectRole();

class UIElement extends Component {

    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.addUIElement = this.addUIElement.bind(this);

        this.state = {
            dataSource,
            showDeleteModal: false,
            showAddUiElementModal: false,
            showEditUiElementModal: false,
            modalLoad: false,
            uiElementId: '',
            action:""
        };

        thisObj = this;
        showProgress();
        CallServerPost('UIElement/GetAllUIElement', {})
            .then(
            function (response) {

                if (response.value !== null) {
                    var datas = [];
                    const uiElementList = response.value;
                    const permissions = thisObj.props.permissions;
                    const perLevel = checkPermission(permissions, ['self']);
                    for (var i = 0; i < uiElementList.length; i++) {
                        const uiElementID = uiElementList[i].uiElementID;
                        const editCell = <div>

                            
                            {perLevel >= 1 ? <ButtonWithToolTip
                                tooltip={perLevel >= 2 ? "Edit" : "View"}
                                shape="circle"
                                classname="fas fa-pen"
                                size="small"
                                style={margin}
                                onClick={() => thisObj.editForm(uiElementID)}
                            /> : ""}

                            {perLevel >= 4 ? <ButtonWithToolTip
                                tooltip="Delete"
                                shape="circle"
                                classname="fas fa-trash-alt"
                                size="small"
                                style={margin}
                                onClick={() => thisObj.deleteForm(uiElementID)}
                            /> : ""}                           

                            
                        </div>;
                        datas.push({
                            key: uiElementList[i].uiElementID,
                            objectCategoryText: uiElementList[i].objectCategoryText,
                            parentObjectText: uiElementList[i].parentObjectText,
                            objectName: uiElementList[i].objectName,
                            objectDisplayName: uiElementList[i].objectDisplayName,
                            actions: uiElementList[i].uiElementID <= 68 ? null : editCell
                        });
                    }
                    allDataSource = datas;
                    thisObj.setState({ dataSource: datas, loading: false });
                }
                hideProgress();
            })
            .catch(error => error);
    }

    editForm = (uiElementID) => {
        this.setState({ showEditUiElementModal: true, uiElementId: uiElementID, action : "Update"});
    }

    addUIElement = () => {
        this.setState({ showAddUiElementModal: true, action: "Create"});
    }

    deleteForm = (ID) => {
        uIElementID = ID;
        this.setState({ showDeleteModal: true });
    }

    handleDelete = (ChangeReason) => {
        const thisObj = this;
         thisObj.setState({ modalLoad: true });
                let values = {};
                values["ChangeReason"] = ChangeReason;
                values["UIElementID"] = uIElementID;

                PostCallWithZone('UIElement/Delete', values)
                    .then(
                    function (response) {
                        thisObj.setState({ modalLoad: false });
                        if (response.status === 1) {
                            thisObj.setState({ showDeleteModal: false });
                            successModal(response.message, thisObj.props, "/trans/UIElements");
                        } else {
                            thisObj.setState({ showDeleteModal: false });
                            errorModal(response.message);
                        }
                    }).catch(error => error);
            

    }

    handleCancel = () => {
        this.setState({ showDeleteModal: false, showAddUiElementModal: false, showEditUiElementModal : false });
    }


    render() {
        
        const columns = [
            {
                title: 'Object Category',
                dataIndex: 'objectCategoryText',
                key: 'objectCategoryText',
                width: 150, sorter: (a, b) => stringSorter(a, b, 'objectCategoryText'),
            },
            {
                title: 'Parent Object',
                dataIndex: 'parentObjectText',
                key: 'parentObjectText',
                width: 150, sorter: (a, b) => stringSorter(a, b, 'parentObjectText'),
            },
            {
                title: 'Object Name',
                dataIndex: 'objectName',
                key: 'objectName',
                width: 150, sorter: (a, b) => stringSorter(a, b, 'objectName'),
            },
            {
                title: 'Object Display Name',
                dataIndex: 'objectDisplayName',
                key: 'objectDisplayName',
                width: 150, sorter: (a, b) => stringSorter(a, b, 'objectDisplayName'),
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 80
            }
        ];

        const { getFieldDecorator } = this.props.form;
        const permissions = thisObj.props.permissions;

        return (

            <LayoutContentWrapper>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="fas fa-cubes" />
                        <span> UI Element</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        List
                    </Breadcrumb.Item>
                </Breadcrumb>

                <LayoutContent>



                    <ReactTable
                        columns={columns}
                        dataSource={this.state.dataSource}
                        addAction={checkPermission(permissions, ["self"]) >= 3 ? this.addUIElement : null}
                        scroll={{ y: "calc(100vh - 256px)" }}
                    />
                    {this.state.showAddUiElementModal && <AddUIElementModal visible={this.state.showAddUiElementModal} history={this.props.history} hideAddUIElementsModal={this.handleCancel} />} 
                    {this.state.showEditUiElementModal && <EditUIElementModal readOnly={checkPermission(permissions, ["self"]) <= 1} visible={this.state.showEditUiElementModal} history={this.props.history} hideEditUIElementsModal={this.handleCancel} uiElementId={this.state.uiElementId} />}
                    <Form>
                        {this.state.showDeleteModal && <ConfirmModal loading={this.state.modalLoad} title="Delete UI Element" SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteModal} handleCancel={this.handleCancel} getFieldDecorator={getFieldDecorator} />}
                    </Form>

                    

                </LayoutContent>

            </LayoutContentWrapper>

        );
    }

}

const WrappedApp = Form.create()(UIElement);
export default WrappedApp;

