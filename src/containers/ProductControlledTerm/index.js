import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, errorModal, PostCallWithZone, successModal, successModalCallback, checkPermission, showProgress, hideProgress } from '../Utility/sharedUtility';
import { Breadcrumb, Form } from 'antd';
import Button from '../../components/uielements/button';
import LayoutContent from '../../components/utility/layoutContent';
import ReactTable from '../Utility/reactTable';
import ConfirmModal from '../Utility/ConfirmModal';
import { stringSorter } from '../Utility/htmlUtility';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import AddProductControlledTerm from '../ProductControlledTerm/addProductControlledTerm';
import EditProductControlledTerm from './editProductControlledTerm';
import { List } from 'immutable';

const FormItem = Form.Item;
const margin = {
    margin: '0 5px 0 0'
};
var thisObj;

class ProductControlledTerm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            title: null,
            showDeleteConfirmationModal:false,
            productControlledTermID: 0,
            action: "List",
            modalLoad: false,
        };
        thisObj = this;
        thisObj.getList();
    }
    getList = () => {
        showProgress();
        CallServerPost('ProductControlledTerm/GetAllProductControlledTerm', {})
            .then(
                function (response) {
                    if (response.value != null) {
                        thisObj.setState({ loading: false });
                        if (response.value != null) {
                            var datas = [];
                            const productControlledTermList = response.value;
                            const permissions = thisObj.props.permissions;
                            const perLevel = checkPermission(permissions, ['self']);
                            for (var i = 0; i < productControlledTermList.length; i++) {
                                const productControlledTermID = productControlledTermList[i].productcontrolledTermID;
                                const editCell = <div>

                                    {perLevel >= 1 && productControlledTermID > 273 ? <ButtonWithToolTip
                                        style={{ marginRight: 5 }}
                                        tooltip={perLevel >= 2 ? "Edit" : "View"}
                                        shape="circle"
                                        classname="fas fa-pen"
                                        size="small"
                                        onClick={() => thisObj.editProductControlledTerm(productControlledTermID, permissions)}
                                    /> : ""}

                                    {perLevel >= 4 && productControlledTermID > 273 ? <ButtonWithToolTip
                                            tooltip="Delete"
                                            shape="circle"
                                            classname="fas fa-trash-alt"
                                            size="small"
                                            style={margin}
                                            onClick={() => thisObj.deleteProductControlledTerm(productControlledTermID)}
                                    /> : ""}
                                </div>;
                                datas.push({
                                    key: productControlledTermList[i].productControlledTermID,
                                    termName: productControlledTermList[i].termName,
                                    longValue: productControlledTermList[i].longValue,
                                    shortValue: productControlledTermList[i].shortValue,
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

    AddProductControlledTerm = () => {
        this.props.history.push({
            pathname: '/trans/addProductControlledTerm',
            state: {
                productControlledTermID: 0
            }
        });
    }

    deleteProductControlledTerm = (productControlledTermID) => {

        this.setState({ showDeleteConfirmationModal: true, action: 'Delete', productControlledTermID: productControlledTermID });
    }

    editCancel = () => {
        thisObj.getList(thisObj.props);
        this.setState({
            action: 'List',
        })

}
    editProductControlledTerm = (productControlledTermID) => {
        this.setState({
            action: 'Edit', productControlledTermID
        })

    }
   

    handleDelete = (ChangeReason) => {
        const thisObj = this;
        let values = {};
        thisObj.setState({ modalLoad: true });
        values["ProductControlledTermID"] = thisObj.state.productControlledTermID;
        values["ChangeReason"] = ChangeReason;

        PostCallWithZone('ProductControlledTerm/Delete', values)
            .then(
                function (response) {
                    thisObj.setState({ modalLoad: false });
                    if (response.status == 1) {
                        thisObj.setState({ showDeleteConfirmationModal: false });
                        successModal(response.message, thisObj.props,"/trans/ProductControlledTerm");
                    } else {
                        thisObj.setState({ showDeleteConfirmationModal: false });
                        errorModal(response.message);
                    }
                }).catch(error => error);

    }
    refreshProgramTemplate = () => {
        thisObj.handleCancelDeleteConfirmationModal();
        thisObj.getList();
        thisObj.setState({ action: "List", modalLoad: false });
    }
    handleCancelDeleteConfirmationModal = () => {
        this.setState({ showDeleteConfirmationModal: false });
        this.props.form.resetFields(["Change Reason"]);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { action, productControlledTermID, title, dataSource } = this.state;
        const columns = [
            {
                title: 'Term Name',
                dataIndex: 'termName',
                key: 'termName',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'termName'),
            },
            {
                title: 'Long Value',
                dataIndex: 'longValue',
                key: 'longValue',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'longValue'),
            },
            {
                title: 'Short Value',
                dataIndex: 'shortValue',
                key: 'shortValue',
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'shortValue'),
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
            <React.Fragment>
                <LayoutContentWrapper style={{ display: (action == "List" || action == "Delete") ? "block" : "none" }}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <i className="fas fa-wrench" ></i>
                            <span>Product Controlled Term</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            List
                     </Breadcrumb.Item>
                    </Breadcrumb>

                    <LayoutContent style={{ wordBreak: 'break-all' }}>
                        <ReactTable
                            columns={columns}
                            dataSource={dataSource}
                            addAction={checkPermission(permissions, ['self']) >= 3 ? this.AddProductControlledTerm : null}
                            scroll={{ y: "calc(100vh - 256px)" }}
                        />

                        {(action == "Delete") && <ConfirmModal title="Delete Product Controlled Term" history={this.props.history} SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.showDeleteConfirmationModal} handleCancel={this.handleCancelDeleteConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad} />}
                    </LayoutContent>
                </LayoutContentWrapper>

                { (action == "Edit") && <EditProductControlledTerm productControlledTermID={productControlledTermID} handleCancel={this.editCancel} readOnly={checkPermission(permissions, ['self']) <= 1} />}
            </React.Fragment>
        );
    }

}

const WrappedApp = Form.create()(ProductControlledTerm);
export default WrappedApp;

