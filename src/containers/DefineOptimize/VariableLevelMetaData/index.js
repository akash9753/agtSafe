import React, { Component } from 'react';
import LayoutContent from '../../../components/utility/layoutContent';
import ReactTable from '../../Utility/reactTable';
import { Breadcrumb, Form, Layout } from 'antd';
import {
    CallServerPost,
    hideProgress,
    getUserID,
    showProgress
} from '../../Utility/sharedUtility';
import Update from './update.js';
import ButtonWithToolTip from '../../Tooltip/ButtonWithToolTip.js';
import Progress from '../../Utility/ProgressBar';
import { DefineContext } from '../context';

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
            progress: "active"
        };

        thisObj = this;

    }

    //fn call to get the list on click
    static getDerivedStateFromProps(nextProps, currState)
    {
        let context = DefineContext || {};
        let { _currentValue } = context || {};
        let { node } = _currentValue || {};

        if (currState.primaryID != node.nodeKey) {
            thisObj.setState({
                primaryID: node.nodeKey, progress:"active"
            });
            thisObj.getList(_currentValue);
        }
    }

    //valid re-render 
    shouldComponentUpdate(props, state) {
        let { node } = this.context || {};
        let { nodeKey } = node || {};

        if (nodeKey === state.primaryID) {
            return true;
        }

        return false;
    }

   

    //fn to get the list
    getList = (context) => {
        let { node, StudyID } = context;


        let data = {
            StudyID: StudyID,
            ID: node.nodeKey,
            userID: getUserID()
        };

        CallServerPost("Variable/GetVariableDataByStudyID", data)
            .then(function (response)
            {
                hideProgress();
                if (response.value != null) {
                    let { data, columns } = response.value;

                    //Dynamic Col Object Creation
                    let col = thisObj.formColByDynamicData(columns);
                    //Dynamic Rows (datasource) for table
                    let dataSource = thisObj.formRowByDynamicData(data, columns);

                    thisObj.setState({ columns: col, dataSource: dataSource, progress: "success" });
                }
                else {
                    thisObj.setState({ progress: "exception" });

                    thisObj.setState({ showListPage: true }, hideProgress());
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
                var colConfig = { title: columnKey, dataIndex: tempdata, key: tempdata, sorter: (a, b) => thisObj.tableSort(a, b, tempdata) };
                if (columnKey == "Variable Name" || columnKey == "Order Number") {
                    colConfig["fixed"] = "left";
                    colConfig["width"] = 100;
                }
                col.push(colConfig);
            }
        });
        col.push(lastColumn);
        return col;
    }

    //Row Formation
    formRowByDynamicData = (data, columns) => {
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

                        editCell = (
                            <div>
                                <ButtonWithToolTip
                                    name="Edit"
                                    tooltip="View"
                                    shape="circle"
                                    classname="fas fa-eye"
                                    size="small" 
                                    onClick={
                                        () => thisObj.fnToEdit(ID)
                                    }
                                />
                            </div>
                        );

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
    fnToEdit = (variableID) =>
    {

        const { setNodeWhenEditBtnClick } = this.context;
        //Highlight
        setNodeWhenEditBtnClick(variableID);
    }


 
    render() {


        const { progress, show } = this.state;

        return (
            <Layout style={{ overflow: "auto", height: "100%", backgroundColor: "#fff" }}>
                {
                    (show === "List") &&

                    (Object.keys(this.state.columns).length != 0) && (
                        <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                            <Breadcrumb>
                                <Breadcrumb.Item>
                                    <i className="ion-clipboard" />
                                    <span> {"Variable Level Meta Data"}</span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>List </Breadcrumb.Item>
                            </Breadcrumb>
                            <LayoutContent style={{ overflow: "auto", height: "100%" }}>
                                {
                                    <ReactTable
                                        size="small"
                                        pagination={true}
                                        columns={this.state.columns}
                                        dataSource={this.state.dataSource}
                                        onDoubleClick={(record, rowIndex) => {
                                            thisObj.fnToEdit(record.key, rowIndex);
                                        }}
                                        showingEntries={this.state.dataSource.length}
                                        scroll={{ x: ((this.state.columns.length - 1) * 200) + 100, y: "calc(100vh - 324px)" }}
                                    />
                                }
                            </LayoutContent>
                        </div>)
                        }

                {<Progress progress={progress} NoInitialPercent={true} />}

            </Layout>
        );
    }
}

const WrappedApp = Form.create()(DomainList);
export default WrappedApp;

