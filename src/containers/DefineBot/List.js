import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import ReactTable from '../Utility/reactTable';
import { Breadcrumb, Form, Icon, Button, Layout, Spin } from 'antd';
import {
    showProgress,
    CallServerPost,
    PostCallWithZoneForDomainCreate,
    successModal,
    successModalCallback,
    errorModal,
    errorModalCallback,
    hideProgress,
    definePermission,
    getUserID
} from '../Utility/sharedUtility';
import AddDefineDomain from './Domain/update.js';
import AddValueLevel from './ValueLevel/update.js';
import AddVariableLevelMetaData from './VariableLevelMetaData/update.js';
import AddWhereClause from './WhereClause/update.js';
import AddCodeList from './CodeList/update.js';
import Analysis from './AnalysisResult/AnalysisResultUI.js';
import MethodComment from './update.js';
import './DefineBot.css'
import Confirmation from './confirmation';
import AddExternalCodeList from './CodeList/AddExternalCodeList';
import ConfirmModal from '../Utility/ConfirmModal';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip.js';
import StudyRelDoc from '../Study/studyRelDoc';
import Progress from '../Utility/ProgressBar';

var thisObj;

var action = "Update";
var showList = false;

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

//Importing ButtonWithToolTip For Action Edit Icon

class DomainList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            showListPage: false,
            showEditPage: false,
            idForEditPage: 0,
            columns: [{ title: "Actiom", key: 9 }, { title: "Column1", key: 1 }, { title: "Column2", key: 2 }],
            dataSource: {},
            updatePage: 0,
            style: {},
            display: "flex",
            action: "Update",
            confirmation: false,
            fnDelete: { url: "", data: "" },
            popupLoading: false,
            modalLoad: false,
            toHide: "none",
            parentKey: 0,
            showList: false,
            studyRelDocModalVisible: false,
            availableDocs: [],
            fileNameToDelete: "",
            nodeID: -1,
            progress:"",
        };

        thisObj = this;
    }

    //fn call to get the list on click
    static getDerivedStateFromProps(nextProps, currState)
    {
        if (currState.nodeID != nextProps.ID || showList) 
        {
            thisObj.props = nextProps;

            showList = false;

            thisObj.setState({
                nodeID: nextProps.ID,
                showListPage: false,
                showList: false,
                showEditPage: false,
                columns: {},
                loading: true,
                display: "flex" }, thisObj.getList(nextProps));
            
        }
    }

    //fn to get the list
    getList = (data) => {
        if (data.analysis) {
            var tableStyle = { x: 1500, y: "calc(100% - 34px)" };

            thisObj.setState({ confirmation: false, dataSource: [], columns: [{ title: "Actiom", key: 9 }, { title: "Column1", key: 1 }, { title: "Column2", key: 2 }], loading: false, display: "none", showListPage: true, style: tableStyle });

        }
        else
        {
            //Show Webscoket Progress 
            thisObj.setState({ progress: "active" });

            CallServerPost(data.url, { ...data.data, userID: getUserID() })
                .then(
                    function (response)
                    {
                        if (response.value != null)
                        {
                            thisObj.setState({ progress: "success"});

                            thisObj.pageList(response);
                        }
                        else {
                            thisObj.setState({ progress: "exception" });

                            thisObj.setState({ studyRelDocModalVisible: false, confirmation: false, loading: false, display: "none", showListPage: true }, hideProgress());
                        }
                    });
        }
    }
    handleCancel = () => {
        thisObj.setState({
             studyRelDocModalVisible: false 
        });
    }

    //fn to form the datasource 
    pageList = (response) => {

        var tableStyle = "";
        var result = {};
        const props = thisObj.props.treePageProp;
        switch (thisObj.props.pageName.toLowerCase().replace(/ /g, "")) {
            case "domain":
                tableStyle = { x: 1700, y: "calc(100% - 34px)" };
                result = props.table(thisObj, response, "structure", 200, "0");
                break;
            case "variablelevelmetadata":
                tableStyle = { x: 2000, y: "calc(100% - 34px)" };
                result = props.table(thisObj, response, "variablelabel", 200, "0")
                break;
            case "valuelevel":
                tableStyle = { x: 2000, y: "calc(100% - 34px)" };
                result = props.table(thisObj, response, "valuelabel", 200, "0")
                break;
            case "whereclause":
                tableStyle = { x: 300, y: "calc(100% - 34px)" };
                result = props.table(thisObj, response, "whereclause", 200, "0")
                break;
            case "codelist":
                tableStyle = { x: 1500, y: "calc(100% - 34px)" };
                result = props.table(thisObj, response, "codelistname", 200, "0")
                break;
            case "comment":
                tableStyle = { x: 1200, y: "calc(100% - 34px)" };
                result = props.table(thisObj, response, "commentdescription", 200, "01")
                break;
            case "method":
                tableStyle = { x: 1200, y: "calc(100% - 34px)" };
                result = props.table(thisObj, response, "methoddescription", 200, "01")
                break;
            case "externalcodelist":
                tableStyle = { x: 850, y: "calc(100% - 34px)" };
                result = props.table(thisObj, response, "datatype", 200, "0")
                break;
            case "documents":
                tableStyle = { x: 900, y: "calc(100% - 34px)" };
                result = props.table(thisObj, response, "href", 200, "0")
                break;
        }
        thisObj.setState({ studyRelDocModalVisible:false, confirmation: false, dataSource: result.dataSource, columns: result.columns, loading: false, display: "none", showListPage: true, style: tableStyle, availableDocs: result.availableDocs }, hideProgress());
    }




    fnToShowEditPage = (obj, forPosition, parentKey) => {
        let id = (obj.key !== undefined) ? obj.key : obj;
        let forPositionToHide = (obj.forPositionToHide !== undefined) ? obj.forPositionToHide : forPosition;
        const treePageProps = thisObj.props.treePageProp;

        //currentPage prop
        const props = thisObj.props;
        //console.log(thisObj.props.pageName.toLowerCase().replace(/ /g, ""))


        switch (thisObj.props.pageName.toLowerCase().replace(/ /g, "")) {

            case "domain":
                thisObj.setState({ showEditPage: true, showListPage: false, showList: false, idForEditPage: id, updatePage: 1, parentKey: parentKey })
                break;

            case "variablelevelmetadata":

                treePageProps.highLightNode(id, [props.ID]);
                thisObj.setState({ toHide: forPositionToHide, showEditPage: true, showList: false, showListPage: false, idForEditPage: id, updatePage: 2, parentKey: parentKey })
                break;

            case "valuelevel":

                treePageProps.highLightNode(id, [props.ID, thisObj.getNearParent(id)]);
                thisObj.setState({ toHide: forPositionToHide, showEditPage: true, showList: false, showListPage: false, idForEditPage: id, updatePage: 3, parentKey: parentKey })
                break;

            case "whereclause":
                treePageProps.highLightNode(id, [props.ID]);
                thisObj.setState({ toHide: forPositionToHide, showEditPage: true, showList: false, showListPage: false, idForEditPage: id, updatePage: 4, parentKey: parentKey })
                break;
            case "externalcodelist":
                treePageProps.highLightNode(id, [props.ID]);
                thisObj.setState({ toHide: forPositionToHide, showEditPage: true, showList: false, showListPage: false, idForEditPage: id, updatePage: 7, parentKey: parentKey })
                break;
            case "codelist":

                if (action != "Create") {
                    treePageProps.highLightNode(id, [props.ID, thisObj.getNearParent(id)]);
                }

                thisObj.setState({ toHide: forPositionToHide, showEditPage: true, showList: false, showListPage: false, idForEditPage: id, updatePage: 5, action: action, parentKey: parentKey })
                break;
            case "method":
                thisObj.setState({ toHide: forPositionToHide, showEditPage: true, showList: false, showListPage: false, idForEditPage: id, updatePage: 6, action: action, parentKey: parentKey })
                break;
            case "comment":
                thisObj.setState({ toHide: forPositionToHide, showEditPage: true, showList: false, showListPage: false, idForEditPage: id, updatePage: 6, action: action, parentKey: parentKey })
                break;
            case "analysisresult":
                thisObj.setState({ toHide: forPositionToHide, showEditPage: true, showList: false, getFormUrl: "Roles/GetRolesFormData", getFormData: { FormName: "analysisresult", ActionName: "Create" }, getSaveUrl: "", showListPage: false, idForEditPage: id, updatePage: 8, action: action, parentKey: parentKey })
                break;
            case "analysisresultmetadata":
                thisObj.setState({ toHide: forPositionToHide, getFormUrl: "Roles/GetRolesFormData", getFormData: { FormName: "AnalysisResultMetaData", ActionName: "Create" }, getSaveUrl: "", showList: false, showEditPage: true, showListPage: false, idForEditPage: id, updatePage: 8, action: action, parentKey: parentKey })
                break;

            case "documents":
                thisObj.setState({ toHide: forPositionToHide, showEditPage: false, showList: false, showListPage: true, studyRelDocModalVisible: true, idForEditPage: id, updatePage: 9, action: action, parentKey: parentKey })
                break;

        }
        action = "Update"
    }
    getNearParent = (id) => {
        var parentKey = "0";
        var i = 0;
        if (thisObj.props.node.children != null) {
            thisObj.props.node.children.forEach(function (key, index) {
                if (i == 1) {
                    return false;
                }
                if (key.props.dataRef.Children != null) {
                    key.props.dataRef.Children.forEach(function (childKey, childIndex) {

                        if (childKey.Key == id) {
                            parentKey = key.props.dataRef.Key;
                            i = 1;
                        }

                    })
                }
            });
        }
        return parentKey;
    }

    fnToDeletePage = (id, fileName) => {
        var fnDelete = {};
        const PageName = this.props.pageName;
        if (PageName == "Comment") {
            fnDelete = { url: "Comment/Delete" }
        }
        else if (PageName == "Method") {
            fnDelete = { url: "Method/Delete" }
        }
        else if (PageName == "Codelist") {
            fnDelete = { url: "CodeList/Delete" }
        }
        else if (PageName === "Documents") {
            fnDelete = { url: "Document/Delete" }
        }

        thisObj.setState({
            idForEditPage: id, confirmation: true, popupLoading: false, fnDelete: fnDelete, fileNameToDelete: fileName
        });
    }

    refresh = () => {
        new Promise((resolve, reject) =>
        {
            thisObj.props.reloadTree(resolve,reject);

        }).then(() =>
        {
            showList = true;
            thisObj.setState({ showList: true, confirmation: false, loading: true, display: "flex", studyRelDocModalVisible: false });

        }).catch(() =>
        {
            //console.log("test")
        });

        //thisObj.setState({ studyRelDocModalVisible:false, confirmation: false, dataSource: result.dataSource, columns: result.columns, loading: false, display: "none", showListPage: true, style: tableStyle, availableDocs: result.availableDocs }, hideProgress());
    }
    fromdocumentPageRefresh = () => {
        thisObj.setState({ updatePage:0,studyRelDocModalVisible: false }, thisObj.getList(thisObj.props));
}
    handleDelete = (ChangeReason) => {
        const thisObj = this;

        var data = { ChangeReason: ChangeReason, ElementID: thisObj.state.idForEditPage, FileName: thisObj.state.fileNameToDelete, StudyID: JSON.parse(sessionStorage.studyDetails).studyID, TimeZone: "IST", UpdatedBy: JSON.parse(sessionStorage.userProfile).userID };
        thisObj.setState({ modalLoad: true });
        PostCallWithZoneForDomainCreate(thisObj.state.fnDelete.url, data).then(
            function (response) {
                const responseData = response;
                thisObj.setState({ modalLoad: false });

                if (responseData.status == 0) {

                    errorModal(responseData.message);
                    thisObj.props.form.resetFields(['Change Reason']);

                }
                else
                {
                    thisObj.props.form.resetFields(['Change Reason']);
                    successModalCallback(responseData.message, () => thisObj.getList(thisObj.props));
                }
            }).catch(error => error);
    }
    ConfirmationCancel = () => {
        thisObj.setState({ confirmation: false })

    }
    move = (moveAction) => {
        thisObj.getData(thisObj.props.node.children, moveAction.currentTarget.id);
    }

    fnToShowAddPage = (pageName) => {
        action = "Create";
        thisObj.fnToShowEditPage(0);
    }

    getData = (data, moveAction) => {
        data.some(function (key, index) {
            if (key.props.dataRef.Children != null) {
                key.props.dataRef.Children.some(function (childKey, childIndex) {
                    if (childKey.Key == thisObj.state.idForEditPage) {
                        if (moveAction == 'left') {
                            if ((childIndex - 1) >= 0) {
                                let toHide = ((childIndex - 1) == 0) ? ((index == 0) ? "left" : "none") : "none";

                                thisObj.fnToShowEditPage(key.props.children[childIndex - 1].key, toHide, key.props.children[childIndex - 1].props.parentKey);
                                return childIndex == childIndex;
                            }
                            else {
                                if ((index - 1) >= 0) {
                                    let toHide = (index == 0) ? "left" : "none";

                                    //previous parent last child @note test this code only for codelist and valuelevel because that has different

                                    thisObj.fnToShowEditPage(data[index - 1].props.children[data[index - 1].props.children.length - 1].key, toHide, data[index - 1].props.children[data[index - 1].props.children.length - 1].props.parentKey);

                                }
                            }
                        }
                        else if (moveAction == 'right') {
                            if ((childIndex + 1) != key.props.children.length) {
                                let toHide = ((childIndex + 2) == key.props.children.length) ? (((index + 1) != data.length) ? "none" : "right") : "none";

                                thisObj.fnToShowEditPage(key.props.children[childIndex + 1].key, toHide, key.props.children[childIndex + 1].props.parentKey);

                            }
                            else {
                                if ((index + 1) != data.length) {
                                    let toHide = ((index + 1) == data.length) ? "right" : "none";

                                    //next parent first child 

                                    thisObj.fnToShowEditPage(data[index + 1].props.children[0].key, toHide, data[index + 1].props.parentKey);

                                }
                            }
                        }

                    }
                })
            }
            else {
                if (key.key == thisObj.state.idForEditPage) {
                    if (moveAction == 'left') {
                        if ((index - 1) >= 0) {
                            let toHide = ((index - 1) == 0) ? "left" : "none";

                            thisObj.fnToShowEditPage(data[index - 1].key, toHide, data[index + 1] !== undefined ? data[index + 1].props.parentKey : undefined);

                        }
                    }
                    else {
                        if ((index + 1) != data.length) {
                            let toHide = ((index + 2) == data.length) ? "right" : "none";

                            thisObj.fnToShowEditPage(data[index + 1].key, toHide, data[index + 1].props.parentKey);

                        }
                    }
                }

            }
        });
    }

    render() {
        if (document.getElementsByClassName("ant-table-body")[0]) {
            if (document.getElementsByClassName("ant-table-body")[0].clientHeight >= document.getElementsByClassName("ant-table-body")[0].scrollHeight) {
                document.getElementsByClassName("ant-table-header")[0].style.overflow = "auto";

            } else {
                document.getElementsByClassName("ant-table-header")[0].style.overflow = "scroll";
            }
        }

        const { progress, toHide, getFormData, getFormUrl, saveUrl, showEditPage, showListPage, idForEditPage, loading, style, updatePage, display, action, parentKey, studyRelDocModalVisible, availableDocs } = this.state;
        const { pageName, isStudyLock, projectStudyLockStatus, defineActivityWorkflowStatus} = this.props;
        const { getFieldDecorator } = this.props.form;

        return (
            <Layout>
                {
                    (showListPage) ?
                        (
                            (Object.keys(this.state.columns).length != 0) ? (
                                <div >
                                    <Breadcrumb>
                                        <Breadcrumb.Item>
                                            <i className="ion-clipboard" />
                                            <span> {pageName}</span>
                                        </Breadcrumb.Item>
                                        <Breadcrumb.Item>List
                                         {
                                                //Define generation inprog and in underreview status only we need to enable the add
                                                (definePermission(defineActivityWorkflowStatus) &&
                                                    (pageName == "Analysis Result Metadata" || pageName == "Analysis Result" || pageName == "Codelist" || pageName == "Method" || pageName == "Comment" || pageName == "Documents")) ?
                                                    <span style={{ float: 'right' }} >
                                                        <ButtonWithToolTip
                                                            tooltip="Add"
                                                            shape="circle"
                                                            classname="fas fa-plus"
                                                            size="small"
                                                            onClick={() => thisObj.fnToShowAddPage(pageName)}
                                                            name="Add"
                                                        />

                                                    </span> : ""
                                            }
                                        </Breadcrumb.Item>
                                    </Breadcrumb>
                                    <LayoutContent style={{ overflow: "auto", height: "100%" }}>{

                                        <ReactTable
                                            size="small"
                                            pagination={true}
                                            columns={this.state.columns}
                                            dataSource={this.state.dataSource}
                                            onDoubleClick={(record, rowIndex) => {
                                                pageName !== "Documents" &&
                                                thisObj.fnToShowEditPage(record, rowIndex);
                                            }}

                                            showingEntries={this.state.dataSource.length}
                                            scroll={{ x: ((this.state.columns.length - 1) * 200) + 100, y: "calc(100vh - 337px)" }}
                                        />
                                    }</LayoutContent>
                                    {
                                        (updatePage === 9) ? <StudyRelDoc
                                                                studyRelDocModalVisible={studyRelDocModalVisible}
                                            handleCancel={this.handleCancel}
                                            refresh={thisObj.fromdocumentPageRefresh}
                                                                availableDocs={availableDocs}
                                                              /> : ''}
                                </div>) : <div className="norecords"><b>No records </b></div>) :
                            (showEditPage ? (
                            (updatePage == 1) ?
                                <AddDefineDomain defineActivityWorkflowStatus={defineActivityWorkflowStatus} parentKey={parentKey} toHide={toHide} move={this.move} ID={idForEditPage} refresh={thisObj.refresh} isStudyLock={this.props.isStudyLock} standardName={this.props.standardName} /> :
                                (updatePage == 2) ?
                                    <AddVariableLevelMetaData defineActivityWorkflowStatus={defineActivityWorkflowStatus} node={(this.props.node.children != undefined) ? this.props.node.children[0].props : []} parentKey={parentKey} toHide={toHide} move={this.move} directClick={false} parrentID={thisObj.props.currentNodeID} ID={idForEditPage} refresh={thisObj.refresh} cancel={true} isStudyLock={this.props.isStudyLock} standardName={this.props.standardName} /> :
                                    (updatePage == 3) ?
                                        <AddValueLevel defineActivityWorkflowStatus={defineActivityWorkflowStatus}  parentKey={parentKey} toHide={toHide} move={this.move} directClick={false} ID={idForEditPage} refresh={thisObj.refresh} cancel={true} isStudyLock={this.props.isStudyLock} standardName={this.props.standardName} /> :
                                        (updatePage == 4) ?
                                            <AddWhereClause defineActivityWorkflowStatus={defineActivityWorkflowStatus}  parentKey={parentKey} toHide={toHide} move={this.move} directClick={false} ID={idForEditPage} refresh={thisObj.refresh} cancel={true} isStudyLock={this.props.isStudyLock} standardName={this.props.standardName} /> :
                                            (updatePage == 5) ?
                                                <AddCodeList defineActivityWorkflowStatus={defineActivityWorkflowStatus}  parentKey={parentKey} parentPageName={this.props.ID} handleCancel={this.handleCancel} toHide={toHide} move={this.move} directClick={false} ID={idForEditPage} action={action} refresh={thisObj.refresh} cancel={true} isStudyLock={this.props.isStudyLock} standardName={this.props.standardName} selectedKey={this.props.selectedKey} parentPageName={this.props.parentPageName} /> :
                                                (updatePage == 6) ?
                                                    <MethodComment defineActivityWorkflowStatus={defineActivityWorkflowStatus}  parentKey={parentKey} toHide={toHide} pageName={pageName} move={this.move} directClick={false} ID={idForEditPage} action={action} refresh={thisObj.refresh} cancel={true} isStudyLock={this.props.isStudyLock} standardName={this.props.standardName} /> :
                                                    (updatePage == 7) ?
                                                        <AddExternalCodeList defineActivityWorkflowStatus={defineActivityWorkflowStatus}  parentKey={parentKey} toHide={toHide} pageName={pageName} move={this.move} directClick={false} ID={idForEditPage} action={action} refresh={thisObj.refresh} cancel={true} isStudyLock={this.props.isStudyLock} standardName={this.props.standardName} /> :
                                                        (updatePage == 8) ? <Analysis defineActivityWorkflowStatus={defineActivityWorkflowStatus}  pageName={pageName} getFormUrl={getFormUrl} getFormData={getFormData} saveUrl={saveUrl} parentKey={parentKey} toHide={toHide} pageName={pageName} move={this.move} directClick={false} ID={idForEditPage} action={action} refresh={thisObj.refresh} cancel={true} isStudyLock={this.props.isStudyLock} standardName={this.props.standardName} /> :''

                        ) : '')


                }
                
                {<Progress progress={progress} NoInitialPercent={true} />}

                <ConfirmModal loading={this.state.modalLoad} title={"Delete " + this.props.pageName} SubmitButtonName="Delete" onSubmit={this.handleDelete} visible={this.state.confirmation} handleCancel={this.ConfirmationCancel} getFieldDecorator={getFieldDecorator} />

            </Layout>
        );
    }
}

const WrappedApp = Form.create()(DomainList);
export default WrappedApp;

