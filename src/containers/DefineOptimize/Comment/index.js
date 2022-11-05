import React, { Component } from 'react';
import LayoutContent from '../../../components/utility/layoutContent';
import ReactTable from '../../Utility/reactTable';
import { Breadcrumb, Form, Layout } from 'antd';
import {
    CallServerPost,
    hideProgress,
    getUserID,
    definePermission,
    showProgress,
    PostCallWithZone,
    successModalCallback,
    errorModal,
    
} from '../../Utility/sharedUtility';
import Update from './update.js';
import Create from './Create.js';
import ButtonWithToolTip from '../../Tooltip/ButtonWithToolTip.js';
import Progress from '../../Utility/ProgressBar';
import { DefineContext } from '../context';
import ConfirmModal from '../../Utility/ConfirmModal';

var thisObj;


//Importing ButtonWithToolTip For Action Edit Icon

class DomainList extends Component {
    static contextType = DefineContext;

    constructor(props) {
        super(props);

        this.state =
        {
            show: "List",
            dataSource: [],
            confirmation: false,
            studyRelDocModalVisible: false,
            progress: "",
            primaryID: props.ID,
            columns: [],
            progress: "active",
            commentID:-1,
        };

        thisObj = this;

    }

    //fn call to get the list on click
    static getDerivedStateFromProps(nextProps, currState)
    {
        if (currState.primaryID != nextProps.ID)
        {
            thisObj.props = nextProps;

            thisObj.setState({
                primaryID: nextProps.ID,
            });

        }
    }

    //valid re-render 
    shouldComponentUpdate(props, state) {
        if (props.ID === state.primaryID) {
            return true;
        }

        return false;
    }

    //Get List 
    componentDidMount() {
        thisObj.getList();
    }

    //fn to get the list
    getList = () =>
    {

        let { StudyID, node } = this.context;

        let data = {
            StudyID: StudyID,
            userID: getUserID()
        };

        thisObj.setState({ progress: "active" });
        CallServerPost("Comment/GetCommentByStudyID", data)
            .then(function (response) {
                if (response.value != null)
                {
                    hideProgress();
                    let { data, columns } = response.value;

                    //Dynamic Col Object Creation
                    let col = thisObj.formColByDynamicData(columns);
                    //Dynamic Rows (datasource) for table
                    let dataSource = thisObj.formRowByDynamicData(data, columns);

                    thisObj.setState({ columns: col, show: "List", dataSource: dataSource, progress: "success" });
                }
                else {

                    thisObj.setState({ progress: "exception",show : "List" }, hideProgress());
                }
            }).catch((e) => {
                console.log(e);
            });
    }

    //sorting
    tableSort = (a, b, column) => {
        if (parseInt(a[column])) {
            if (a[column] < b[column]) return -1;
            if (a[column] > b[column]) return 1;
            return 0;
        }
        else {
            if (a[column] < b[column]) return -1;
            if (a[column] > b[column]) return 1;
            return 0;
        }
    }

    //Column Formation
    formColByDynamicData = (columns) => {
        let col = [];
        let lastColumn = "";
        columns.forEach(function (columnKey, columnIndex) {
            if (columnIndex == 0) {
                var tempdata = columnKey.replace(/ /g, "").toLowerCase();

                //in controller return response the column object is {"Action",...}.But we need to show action column at last 
                lastColumn = { title: columnKey, dataIndex: tempdata.toLowerCase(), key: columnKey.toLowerCase(), title: columnKey, width: 100 };
            }
            else {
                var tempdata = columnKey.replace(/ /g, "").toLowerCase();

                col.push({ title: columnKey, dataIndex: tempdata, key: tempdata, sorter: (a, b) => thisObj.tableSort(a, b, tempdata) });
            }
        });
        col.push(lastColumn);
        return col;
    }

    //Row Formation
    formRowByDynamicData = (data, columns) =>
    {
        let { study, isStudyLock, projectStudyLockStatus, defineActivityWorkflowStatus } = this.context;

        let dataSource = [];
        if (data.length != 0) {
            data.forEach(function (key, i) {
                var rowRec = {};

                columns.forEach(function (columnKey, columnIndex) {

                    //Dynamic rec (datasource) for table
                    if (columnKey.toLowerCase().replace(/ /g, "") == "actions") {
                        const ID = key[columnIndex];
                        const prevID = i != 0 ? data[i - 1][columnIndex] : false;
                        const nextID = i < (data.length - 1) ? data[i + 1][columnIndex] : false;

                        var editCell;

                        editCell = (<div>
                            <ButtonWithToolTip
                                name="Edit"
                                tooltip="View"
                                shape="circle"
                                classname="fas fa-eye"
                                size="small"
                                onClick={() => thisObj.fnToEdit({
                                    commentID: ID,
                                    prev: prevID,
                                    next: nextID
                                })
                                }
                            />
                            <ButtonWithToolTip
                                name="Delete"
                                tooltip="Delete"
                                shape="circle"
                                classname="fas fa-trash-alt"
                                size="small"
                                style={{ margin: "0px 0px 0px 5px" }}
                                onClick={() => thisObj.fnToDelete(ID)}
                                disabled={!definePermission(defineActivityWorkflowStatus)}
                                
                            /> 
                        </div>);

                        rowRec[columnKey.toLowerCase().replace(/ /g, "")] = editCell;
                    }
                    else {
                        rowRec[columnKey.toLowerCase().replace(/ /g, "")] = key[columnIndex];
                    }

                })
                rowRec.key = key[0];
                dataSource.push(rowRec);
            });
        }

        return dataSource;
    }


    //fn To Edit
    fnToEdit = (data) =>
    {
        thisObj.setState({
            show: "Update",
  
            commentID: data.commentID
        });
    }

   
    //fn To Edit
    showAdd = () => {
        //Highlight

        thisObj.setState({
            show: "Create",
        });
    }
    //refresh get list from controller
    refresh = () => {
        let { context } = thisObj;
        thisObj.getList(context);
    }

    backToList = () => {
        thisObj.setState({
            show: "List"
        })
    }
    //Change reason
    fnToDelete = (id, fileName) => {
        thisObj.setState({
            commentID: id,
            confirmation: true,
        });
    }
    //fn To Delete
    handleDelete = (ChangeReason) => {
        let { study } = this.context;
        let { commentID } = this.state;
        const thisObj = this;
        var data =
        {
            ChangeReason: ChangeReason,
            ElementID: commentID,
            StudyID: study.studyID,
            TimeZone: "IST",
            UpdatedBy: getUserID()
        };

        thisObj.setState({ confirmation: false });
        showProgress();
        PostCallWithZone("Comment/Delete", data).then(
            function (response) {
                hideProgress();
                const responseData = response;

                if (responseData.status == 0) {
                    errorModal(responseData.message);
                    thisObj.props.form.resetFields(['Change Reason']);
                }
                else {
                    thisObj.props.form.resetFields(['Change Reason']);
                    successModalCallback(responseData.message, () => thisObj.refresh());
                }
            }).catch(error => error);
    }
 

    render() {


        const { progress, show, commentID, confirmation } = this.state;
        const { defineActivityWorkflowStatus, study } = this.context ? this.context : {};
       

        return (
            <Layout style={{ overflow: "auto", height: "100%", backgroundColor: "#fff" }}>
                {
                    (show === "List") &&

                    (Object.keys(this.state.columns).length != 0) &&
                        <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                            <Breadcrumb>
                                <Breadcrumb.Item>
                                    <i className="ion-clipboard" />
                                    <span> {"Comment"}</span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>List
                                {
                                    (definePermission(defineActivityWorkflowStatus) &&
                                        <span style={{ float: 'right' }} >
                                            <ButtonWithToolTip
                                                tooltip="Add"
                                                shape="circle"
                                                classname="fas fa-plus"
                                                size="small"
                                                onClick={() => thisObj.showAdd()}
                                                name="Add"
                                            />

                                        </span>)
                                }</Breadcrumb.Item>
                            </Breadcrumb>
                            <LayoutContent style={{ overflow: "auto", height: "100%" }}>
                            {
                                <ReactTable
                                    size="small"
                                    pagination={true}
                                    columns={this.state.columns}
                                    dataSource={this.state.dataSource}
                                    onDoubleClick={(record, rowIndex) =>
                                    {
                                        thisObj.fnToEdit(record, rowIndex);
                                    }}
                                    showingEntries={this.state.dataSource.length}
                                    scroll={{ x: ((this.state.columns.length - 1) * 200) + 100, y: "calc(100vh - 324px)" }}
                                />
                            }
                            </LayoutContent>
                        </div>}


                {show == "Update" &&
                    <Update
                        backToList={this.backToList}
                        refresh={this.refresh}
                        ID={commentID}
            
                    />
                }
                {show == "Create" &&
                    <Create
                        backToList={this.backToList}
                        refresh={this.refresh}

                    />
                }
                {<Progress progress={progress} NoInitialPercent={true} />}
                <ConfirmModal
                    loading={false}
                    title={"Delete Comment"}
                    SubmitButtonName="Delete"
                    onSubmit={this.handleDelete}
                    visible={confirmation}
                    handleCancel={this.ConfirmationCancel}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                   
                />
            </Layout>
        );
    }
}

const WrappedApp = Form.create()(DomainList);
export default WrappedApp;

