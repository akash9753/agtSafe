import React, { Component } from 'react';
import LayoutContent from '../../../components/utility/layoutContent';
import ReactTable from '../../Utility/reactTable';
import { Breadcrumb, Form, Layout } from 'antd';
import {
    CallServerPost,
    hideProgress,
    getUserID,
    errorModal,
    definePermission,
    PostCallWithZoneForDomainCreate,
    successModalCallback,
    showProgress
} from '../../Utility/sharedUtility';
import StudyRelDoc from '../../Study/studyRelDoc';
import ConfirmModal from '../../Utility/ConfirmModal';
import ButtonWithToolTip from '../../Tooltip/ButtonWithToolTip.js';
import Progress from '../../Utility/ProgressBar';
import { DefineContext } from '../context';

var thisObj;


//Importing ButtonWithToolTip For Action Edit Icon

class MethodList extends Component {
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

        };

        thisObj = this;

    }

    //fn call to get the list on click
    static getDerivedStateFromProps(nextProps, currState) {
        if (currState.primaryID != nextProps.ID) {
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
        let { StudyID } = this.context;
        let data = {
            StudyID: StudyID,
            userID: getUserID()
        };

        //Progressbar init
        thisObj.setState({ progress: "active" });

        CallServerPost("Document/GetDocumentByStudyID", data)
            .then(function (response)
            {
                if (response.value != null)
                {
                    let { data, columns } = response.value;

                    //Dynamic Col Object Creation
                    let col = thisObj.formColByDynamicData(columns);
                    //Dynamic Rows (datasource) for table
                    let { dataSource , availableDocs} = thisObj.formRowByDynamicData(data, columns);

                    thisObj.setState({ availableDocs:availableDocs,columns: col,studyRelDocModalVisible:false, show:"List", dataSource: dataSource, progress: "success" });
                }
                else
                {
                    thisObj.setState({ show: "List" }, hideProgress());
                }
            }).catch((e) =>
            {
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
    formColByDynamicData = (columns) =>
    {
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
        let availableDocs = [];
        let dataSource = [];
        if (data.length != 0) {
            data.forEach(function (key, i)
            {
                var rowRec = {};
                availableDocs.push(key[1]);
                columns.forEach(function (columnKey, columnIndex)
                {

                    //Dynamic rec (datasource) for table
                    if (columnKey.toLowerCase().replace(/ /g, "") == "actions") {
                        const ID = key[columnIndex];
                        var editCell;

                        editCell = (<div>
                                        <ButtonWithToolTip
                                            name="Delete"
                                            tooltip="Delete"
                                            shape="circle"
                                            classname="fas fa-trash-alt"
                                            size="small"
                                            style={{ margin: "0px 0px 0px 5px" }}
                                            onClick={() => thisObj.fnToDelete(ID, key[1])}
                                            disabled={!definePermission(defineActivityWorkflowStatus) || key[2] === "AnnotatedCRF"}
   />
                                    </div>);

                        rowRec[columnKey.toLowerCase().replace(/ /g, "")] = editCell;
                    }
                    else {
                        rowRec[columnKey.toLowerCase().replace(/ /g, "")] = key[columnIndex];
                    }

                });

                rowRec.key = key[0];
                dataSource.push(rowRec);
            });
        }

        return {
            dataSource: dataSource,
            availableDocs: availableDocs
        };
    }


    //fn To Edit
    handleDelete = (ChangeReason) =>
    {
        let { study } = this.context;
        let { documentID } = this.state;
        const thisObj = this;
        var data = {
            ChangeReason: ChangeReason,
            ElementID: documentID,
            FileName: thisObj.state.fileNameToDelete,
            StudyID: study.studyID,
            TimeZone: "IST",
            UpdatedBy: getUserID()
        };

        thisObj.setState({ confirmation: false });
        showProgress();
        PostCallWithZoneForDomainCreate("Document/Delete", data).then(
            function (response)
            {
                hideProgress();
                const responseData = response;

                if (responseData.status == 0)
                {
                    errorModal(responseData.message);
                    thisObj.props.form.resetFields(['Change Reason']);
                }
                else
                {
                    thisObj.props.form.resetFields(['Change Reason']);
                    successModalCallback(responseData.message, () => thisObj.refresh());
                }
            }).catch(error => error);

    }
    //Change reason
    fnToDelete = (id,fileName) =>
    {
        thisObj.setState({
            documentID: id,
            confirmation: true,
            fileNameToDelete: fileName
        });
    }
    //fn To Edit
    showAdd = () =>
    {
        //Highlight
        //showProgress();
        thisObj.setState({ studyRelDocModalVisible : true });
    }
    //refresh get list from controller
    refresh = () =>
    {
        let { context } = thisObj;
        thisObj.getList(context);
    }

    backToList = () =>
    {
        thisObj.setState({
            studyRelDocModalVisible: false
        })
    }
    ConfirmationCancel = () => {
        thisObj.setState({
            confirmation: false
        })
    }
 
    render() {


        const { progress, show, confirmation, studyRelDocModalVisible, availableDocs} = this.state;
        const { defineActivityWorkflowStatus } = this.context ? this.context : {};

        return (
            <Layout style={{ overflow: "auto", height: "100%", backgroundColor: "#fff" }}>
                {
                    (show === "List") &&

                    (Object.keys(this.state.columns).length != 0) &&
                        <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                            <Breadcrumb>
                                <Breadcrumb.Item>
                                    <i className="ion-clipboard" />
                                    <span> {"Documents"}</span>
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
                                    } </Breadcrumb.Item>
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

                {
                    studyRelDocModalVisible && 
                    <StudyRelDoc
                        studyRelDocModalVisible={studyRelDocModalVisible}
                        handleCancel={this.backToList}
                        refresh={thisObj.refresh}
                        availableDocs={availableDocs}
                    /> 
                }
               
                {<Progress progress={progress} NoInitialPercent={true} />}
                {
                    confirmation && 
                    <ConfirmModal
                        loading={false}
                        title={"Delete " + this.state.fileNameToDelete}
                        SubmitButtonName="Delete"
                        onSubmit={this.handleDelete}
                        visible={confirmation}
                        handleCancel={this.ConfirmationCancel}
                        getFieldDecorator={this.props.form.getFieldDecorator}
                    />
                }

            </Layout>
        );
    }
}

const WrappedApp = Form.create()(MethodList);
export default WrappedApp;

