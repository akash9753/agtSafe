import React, { Component } from 'react';
import { CallServerPost, errorModal, successModalCallback, PostCallWithZone, successModal, DownloadFileWithPostData, checkPermission } from '../Utility/sharedUtility';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { Form, Modal, Steps, Row, Spin, Icon, Input } from 'antd';
import { DynamicForm } from '../Utility/htmlUtility';
import Button from '../../components/uielements/button';
import ReactTable from '../Utility/reactTable';
import Tabs, { TabPane } from '../../components/uielements/tabs';
import '../DefineBot/DefineBot.css';
import { stringSorter } from '../Utility/htmlUtility';
import { setTimeout } from 'timers';
import { Pagination } from 'antd';
import ContentHolder from '../../components/utility/contentHolder';
import TableWrapper from '../../styles/Table/antTable.style';

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
var search = false;
var renderedDataSource = [];
var dataSource = [], thisObj, StudyID;


class DefineValidationModal extends Component {
    constructor(props) {
        super(props);

        var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '_' + today.getHours() + ':' + today.getMinutes();
        this.state = {
            visible: false,
            loading: true,
            date: date,
            noOfError: props.schemaDataSource.length,
            column: [],
            row: props.schemaDataSource,
            exportAction: this.handleExcelDownloadSchemaValidation,
            activeKey: "Schema",
            tableLoading: false,
            searchText: "",
            sortedInfo: {}
        };
        //For initial render
        renderedDataSource = props.schemaDataSource;
        thisObj = this;

    }
    //static getDerivedStateFromProps(nextProps, currentstate) {
    //    return thisObj.onTabChange(1);
    //}

    //componentWillReceiveProps(nextProps) {
    //    thisObj.onTabChange(1);
    // }

    componentDidMount() {
        thisObj.onTabChange(1);
    }
    handleExcelDownloadSchemaValidation = () => {
        var title = this.props.title;

        var studyName = title.substring(0, title.lastIndexOf('_'));
        DownloadFileWithPostData('Study/ExportValidationResults', this.props.title + "_SchemaValidationResults_" + this.state.date + ".xlsx", { StudyName: studyName, DirectoryName: title, SchemaValidationFileName: "SchemaValidationResults.xlsx" }, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }
    handleExcelDownloadDataValidation = () => {
        var title = this.props.title;

        var studyName = title.substring(0, title.lastIndexOf('_'));
        DownloadFileWithPostData('Study/ExportValidationResults', this.props.title + "_DataValidationResults_" + this.state.date + ".xlsx", { StudyName: studyName, DirectoryName: title, DataValidationFileName: "DataValidationResults.xlsx" }, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }
    handleExcelDownloadMetaDataValidation = () => {
        var title = this.props.title;

        var studyName = title.substring(0, title.lastIndexOf('_'));
        DownloadFileWithPostData('Study/ExportValidationResults', this.props.title + "_MetaDataValidationResults_" + this.state.date + ".xlsx", { StudyName: studyName, DirectoryName: title, MetaDataValidationFileName: "MetaDataValidationResults.xlsx" }, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }

    handleExcelDownloadNciCodeListValidation = () => {
        var title = this.props.title;

        var studyName = title.substring(0, title.lastIndexOf('_'));
        DownloadFileWithPostData('Study/ExportValidationResults', this.props.title + "_NciCodeListValidationResults_" + this.state.date + ".xlsx", { StudyName: studyName, DirectoryName: title, NciCodeListValidationFileName: "NciCodeListValidationResults.xlsx" }, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }

    handleExcelDownloadDataSetValidation = () => {
        var title = this.props.title;

        var studyName = title.substring(0, title.lastIndexOf('_'));
        DownloadFileWithPostData('Study/ExportValidationResults', this.props.title + "_DataSetValidationResults_" + this.state.date + ".xlsx", { StudyName: studyName, DirectoryName: title, DataSetValidationFileName: "DataSetValidationResults.xlsx" }, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }

    onTabChange = (tab) => {
        this.setState({ tableLoading: true });
        const props = thisObj.props;
        if (tab == "Schema") {
            renderedDataSource = props.schemaDataSource;
            this.setState({ sortedInfo: {}, searchText: "", activeKey: tab.toString(), noOfError: props.schemaDataSource.length, row: props.schemaDataSource, exportAction: this.handleExcelDownloadSchemaValidation });
        }
        else if (tab == "Data") {
            renderedDataSource = props.dataValidationDataSource;
            this.setState({ sortedInfo: {}, searchText: "", activeKey: tab.toString(), noOfError: props.dataValidationDataSource.length, row: props.dataValidationDataSource, exportAction: this.handleExcelDownloadDataValidation });
        }
        else if (tab == "MetaData") {
            renderedDataSource = props.metaDataSource;
            this.setState({ sortedInfo: {}, searchText: "", activeKey: tab.toString(), noOfError: props.metaDataSource.length, row: props.metaDataSource, exportAction: this.handleExcelDownloadMetaDataValidation });
        }
        else if (tab == "NciCodeList") {
            renderedDataSource = props.nciCodeListDataSource;
            this.setState({ sortedInfo: {}, searchText: "", activeKey: tab.toString(), noOfError: props.nciCodeListDataSource.length, row: props.nciCodeListDataSource, exportAction: this.handleExcelDownloadNciCodeListValidation });
        }
        else if (tab == "Dataset") {
            renderedDataSource = props.dataSetDataSource;
            this.setState({ sortedInfo: {}, searchText: "", activeKey: tab.toString(), noOfError: props.dataSetDataSource.length, row: props.dataSetDataSource, exportAction: this.handleExcelDownloadDataSetValidation });
        }


        setTimeout(
            function () {
                this.setState({ tableLoading: false });
            }
                .bind(this),
            200
        );

    }


    onSearch = (inputText) => {
        renderedDataSource = this.state.row.map((record) => {
            var match = false;
            search = true;
            Object.keys(record).map((key) => {
                if (key !== "key" && key !== "actions" && key !== "action") {
                    if (record[key] !== undefined && record[key] !== null && record[key] !== "") {
                        if (record[key].toString().toLowerCase().indexOf(inputText.toString().toLowerCase()) !== -1) {
                            match = true;
                        }
                    }
                }
            });
            if (!match) {
                return null;
            }
            return {
                ...record
            };

        }).filter(record => !!record);

    }

    onInputChange = (e) => {
        if (e.target.value != "") {
            search = true;

            this.setState({ searchText: e.target.value });
        }
        else {
            this.setState({ searchText: e.target.value });
            search = false;
        }
        this.onSearch(e.target.value);
        //this.setState({ showingEntries: renderedDataSource.length, current: 1 });
        //this.forceUpdate();
    }

    clearSearch = () => {
        this.setState({ searchText: "" });
        this.onSearch("");
        search = false;
    };

    //Get Column by tabname
    getColumn = (tabName) => {
        let { sortedInfo } = thisObj.state;

        switch (tabName.toLowerCase()) {
            case "schema":
                return [
                    {
                        title: 'S.No',
                        dataIndex: 'slNo',
                        key: 'slNo',
                        width: 100,
                        sorter: (a, b) => stringSorter(a, b, 'slNo'),
                        sortOrder: sortedInfo.columnKey === 'slNo' && sortedInfo.order,

                    },
                    {
                        title: 'Line Number',
                        dataIndex: 'lineNumber',
                        key: 'lineNumber',
                        width: 100,
                        sorter: (a, b) => stringSorter(a, b, 'lineNumber'),
                        sortOrder: sortedInfo.columnKey === 'lineNumber' && sortedInfo.order,

                    },
                    {
                        title: 'Line Position',
                        dataIndex: 'linePosition',
                        key: 'linePosition',
                        width: 100,
                        sorter: (a, b) => stringSorter(a, b, 'linePosition'),
                        sortOrder: sortedInfo.columnKey === 'linePosition' && sortedInfo.order,

                    },
                    {
                        title: 'Message',
                        dataIndex: 'message',
                        key: 'message',
                        width: 100,
                        ellipsis: true,
                        sorter: (a, b) => stringSorter(a, b, 'message'),
                        sortOrder: sortedInfo.columnKey === 'message' && sortedInfo.order,

                    },
                    {
                        title: 'Severity',
                        dataIndex: 'severity',
                        key: 'severity',
                        width: 100,
                        ellipsis: true,
                        sorter: (a, b) => stringSorter(a, b, 'severity'),
                        sortOrder: sortedInfo.columnKey === 'severity' && sortedInfo.order,

                    },
                ];
            case "data":
                return [
                    {
                        title: 'S.No',
                        dataIndex: 'slNo',
                        key: 'slNo',
                        width: 150,
                        sorter: (a, b) => stringSorter(a, b, 'slNo'),
                        sortOrder: sortedInfo.columnKey === 'slNo' && sortedInfo.order,

                    },
                    {
                        title: 'Node Name',
                        dataIndex: 'nodeName',
                        key: 'nodeName',
                        width: 150,
                        sorter: (a, b) => stringSorter(a, b, 'nodeName'),
                        sortOrder: sortedInfo.columnKey === 'nodeName' && sortedInfo.order,

                    },
                    {
                        title: 'Rule ID',
                        dataIndex: 'ruleID',
                        key: 'ruleID',
                        width: 150,
                        sorter: (a, b) => stringSorter(a, b, 'ruleID'),
                        sortOrder: sortedInfo.columnKey === 'ruleID' && sortedInfo.order,
                    },
                    {
                        title: 'Item ID',
                        dataIndex: 'itemID',
                        key: 'itemID',
                        width: 150,
                        sorter: (a, b) => stringSorter(a, b, 'itemID'),
                        sortOrder: sortedInfo.columnKey === 'itemID' && sortedInfo.order,

                    },
                    {
                        title: 'Error',
                        dataIndex: 'error',
                        key: 'error',
                        width: 150,
                        sorter: (a, b) => stringSorter(a, b, 'error'),
                        sortOrder: sortedInfo.columnKey === 'error' && sortedInfo.order,

                    },
                    {
                        title: 'Description',
                        dataIndex: 'description',
                        key: 'description',
                        width: 150,
                        ellipsis: true,
                        sorter: (a, b) => stringSorter(a, b, 'description'),
                        sortOrder: sortedInfo.columnKey === 'description' && sortedInfo.order,

                    },
                    {
                        title: 'Category',
                        dataIndex: 'category',
                        key: 'category',
                        width: 150,
                        sorter: (a, b) => stringSorter(a, b, 'category'),
                        sortOrder: sortedInfo.columnKey === 'category' && sortedInfo.order,

                    },
                    {
                        title: 'Severity',
                        dataIndex: 'severity',
                        key: 'severity',
                        width: 150,
                        sorter: (a, b) => stringSorter(a, b, 'severity'),
                        sortOrder: sortedInfo.columnKey === 'severity' && sortedInfo.order,


                    },
                ];
            case "metadata":
                return [
                    {
                        title: 'S.No',
                        dataIndex: 'slNo',
                        key: 'slNo',
                        width: 100,
                        sorter: (a, b) => stringSorter(a, b, 'slNo'),
                        sortOrder: sortedInfo.columnKey === 'slNo' && sortedInfo.order,

                    },
                    {
                        title: 'RuleID',
                        dataIndex: 'ruleID',
                        key: 'ruleID',
                        width: 100,
                        sorter: (a, b) => stringSorter(a, b, 'ruleID'),
                        sortOrder: sortedInfo.columnKey === 'ruleID' && sortedInfo.order,

                    },

                    {
                        title: 'PublisherID',
                        dataIndex: 'publisherID',
                        key: 'publisherID',
                        width: 100,
                        sorter: (a, b) => stringSorter(a, b, 'publisherID'),
                        sortOrder: sortedInfo.columnKey === 'publisherID' && sortedInfo.order,

                    },

                    {
                        title: 'Identifier',
                        dataIndex: 'identifier',
                        key: 'identifier',
                        width: 100,
                        sorter: (a, b) => stringSorter(a, b, 'identifier'),
                        sortOrder: sortedInfo.columnKey === 'identifier' && sortedInfo.order,

                    },
                    {
                        title: 'Message',
                        dataIndex: 'message',
                        key: 'message',
                        width: 200,
                        ellipsis: true,
                        sorter: (a, b) => stringSorter(a, b, 'message'),
                        sortOrder: sortedInfo.columnKey === 'message' && sortedInfo.order,

                    },
                    {
                        title: 'Description',
                        dataIndex: 'description',
                        key: 'description',
                        ellipsis: true,
                        width: 100,
                        sorter: (a, b) => stringSorter(a, b, 'description'),
                        sortOrder: sortedInfo.columnKey === 'description' && sortedInfo.order,

                    },
                    {
                        title: 'Severity',
                        dataIndex: 'severity',
                        key: 'severity',
                        width: 100,
                        sorter: (a, b) => stringSorter(a, b, 'severity'),
                        sortOrder: sortedInfo.columnKey === 'severity' && sortedInfo.order,

                    }
                ];
            case "ncicodelist":
                return [
                    {
                        title: 'S.No',
                        dataIndex: 'slNo',
                        key: 'slNo',
                        width: 100,
                        sorter: (a, b) => stringSorter(a, b, 'slNo'),
                        sortOrder: sortedInfo.columnKey === 'slNo' && sortedInfo.order,
                    },
                    {
                        title: 'RuleID',
                        dataIndex: 'ruleID',
                        key: 'ruleID',
                        width: 150,
                        sorter: (a, b) => stringSorter(a, b, 'ruleID'),
                        sortOrder: sortedInfo.columnKey === 'ruleID' && sortedInfo.order,
                    },

                    {
                        title: 'PublisherID',
                        dataIndex: 'publisherID',
                        key: 'publisherID',
                        width: 150,
                        sorter: (a, b) => stringSorter(a, b, 'publisherID'),
                        sortOrder: sortedInfo.columnKey === 'publisherID' && sortedInfo.order,
                    },

                    {
                        title: 'Message',
                        dataIndex: 'message',
                        ellipsis: true,
                        key: 'message',
                        width: 150,
                        sorter: (a, b) => stringSorter(a, b, 'message'),
                        sortOrder: sortedInfo.columnKey === 'message' && sortedInfo.order,
                    },
                    {
                        title: 'Description',
                        dataIndex: 'description',
                        key: 'description',
                        ellipsis: true,
                        width: 150,

                        sorter: (a, b) => stringSorter(a, b, 'description'),
                        sortOrder: sortedInfo.columnKey === 'description' && sortedInfo.order,
                    },
                    {
                        title: 'Severity',
                        dataIndex: 'severity',
                        key: 'severity',
                        width: 150,
                        sorter: (a, b) => stringSorter(a, b, 'severity'),
                        sortOrder: sortedInfo.columnKey === 'severity' && sortedInfo.order
                    },
                    {
                        title: 'Category',
                        dataIndex: 'category',
                        key: 'category',
                        width: 150,
                        sorter: (a, b) => stringSorter(a, b, 'category'),
                        sortOrder: sortedInfo.columnKey === 'category' && sortedInfo.order
                    },
                    {
                        title: 'DomainVariable',
                        dataIndex: 'domainVariable',
                        key: 'domainVariable',
                        width: 150,
                        sorter: (a, b) => stringSorter(a, b, 'domainVariable'),
                        sortOrder: sortedInfo.columnKey === 'domainVariable' && sortedInfo.order
                    },
                    {
                        title: 'Term',
                        dataIndex: 'term',
                        key: 'term',
                        width: 150,
                        sorter: (a, b) => stringSorter(a, b, 'term'),
                        sortOrder: sortedInfo.columnKey === 'term' && sortedInfo.order,

                    },

                ];
            case "dataset":
                return [
                    {
                        title: 'S.No',
                        dataIndex: 'slNo',
                        key: 'slNo',
                        width: 100,
                        sorter: (a, b) => stringSorter(a, b, 'slNo'),
                        sortOrder: sortedInfo.columnKey === 'slNo' && sortedInfo.order,

                    },
                    {
                        title: 'RuleID',
                        dataIndex: 'ruleID',
                        key: 'ruleID',
                        width: 100,
                        sorter: (a, b) => stringSorter(a, b, 'ruleID'),
                        sortOrder: sortedInfo.columnKey === 'ruleID' && sortedInfo.order,

                    },

                    {
                        title: 'PublisherID',
                        dataIndex: 'publisherID',
                        key: 'publisherID',
                        width: 100,
                        sorter: (a, b) => stringSorter(a, b, 'publisherID'),
                        sortOrder: sortedInfo.columnKey === 'publisherID' && sortedInfo.order,

                    },

                    {
                        title: 'Identifier',
                        dataIndex: 'identifier',
                        key: 'identifier',
                        width: 100,
                        sorter: (a, b) => stringSorter(a, b, 'identifier'),
                        sortOrder: sortedInfo.columnKey === 'identifier' && sortedInfo.order,

                    },
                    {
                        title: 'Message',
                        dataIndex: 'message',
                        key: 'message',
                        width: 200,
                        ellipsis: true,
                        sorter: (a, b) => stringSorter(a, b, 'message'),
                        sortOrder: sortedInfo.columnKey === 'message' && sortedInfo.order,

                    },
                    {
                        title: 'Description',
                        dataIndex: 'description',
                        key: 'description',
                        ellipsis: true,
                        width: 100,
                        sorter: (a, b) => stringSorter(a, b, 'description'),
                        sortOrder: sortedInfo.columnKey === 'description' && sortedInfo.order,

                    },
                    {
                        title: 'Severity',
                        dataIndex: 'severity',
                        key: 'severity',
                        width: 100,
                        sorter: (a, b) => stringSorter(a, b, 'severity'),
                        sortOrder: sortedInfo.columnKey === 'severity' && sortedInfo.order,

                    },
                    {
                        title: 'Category',
                        dataIndex: 'category',
                        key: 'category',
                        width: 100,
                        sorter: (a, b) => stringSorter(a, b, 'category'),
                        sortOrder: sortedInfo.columnKey === 'category' && sortedInfo.order,

                    },
                    {
                        title: 'Domain',
                        dataIndex: 'domain',
                        key: 'domain',
                        width: 100,
                        sorter: (a, b) => stringSorter(a, b, 'domain'),
                        sortOrder: sortedInfo.columnKey === 'domain' && sortedInfo.order,

                    },
                    //{
                    //    title: 'Variable',
                    //    dataIndex: 'variable',
                    //    key: 'variable',
                    //    width: 100,
                    //    sorter: (a, b) => stringSorter(a, b, 'variable')
                    //}
                ];
        }
    }

    //Table onChange
    //Set Sorter Info
    handleChange = (pagination, filters, sorter) => {
        this.setState({
            sortedInfo: sorter,
        });
    };

    render() {

        const { activeKey, row, noOfError, exportAction, loading, tableLoading, searchText } = this.state;
        const { visible } = this.props;

        //get column by active key
        let columnByTabName = this.getColumn(activeKey);
        const hideInputSearch = {
            display: "none"
        };
        return (
            <Modal
                visible={visible}
                title={this.props.title + " - DefineXml Validation Results"}
                style={{ top: 20 }}
                onCancel={this.props.handleCancel}
                width={'95%'}
                maskClosable={false}
                footer={[

                    <Button key="finish" name="Finish" type="primary" onClick={this.props.handleCancel}>Finish</Button>,
                ]}
            >
                <LayoutContent style={{ padding: 5 }} >
                    <Tabs onChange={this.onTabChange} type="card" activeKey={activeKey}>
                        <TabPane tab="Schema Validation" key={"Schema"} >

                        </TabPane>
                        <TabPane tab="Data Validation" key={"Data"} >

                        </TabPane>
                        <TabPane tab="MetaData Validation" key={"MetaData"} >

                        </TabPane>
                        <TabPane tab="NciCodeList Validation" key={"NciCodeList"} >

                        </TabPane>
                        <TabPane tab="Dataset Validation" key={"Dataset"} >

                        </TabPane>
                    </Tabs>

                    <Form>
                        <Spin indicator={antIcon} spinning={tableLoading}>
                            <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }} >
                                <ContentHolder style={{ marginTop: 0 }}>
                                    {
                                        (this.props.search != false) &&
                                        <span style={this.props.inputSearchVisible} >
                                            {
                                                searchText !== "" ?
                                                    < Input tabIndex="0" name="TableSearch" suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />} suffix={<Icon onClick={this.clearSearch} type="close" style={{ color: 'rgba(0,0,0,.25)' }} />} style={{ width: '20%' }} value={this.state.searchText} onChange={this.onInputChange} placeholder="Search" />
                                                    :
                                                    < Input tabIndex="0" name="TableSearch" suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />} style={{ width: '20%' }} value={this.state.searchText} onChange={this.onInputChange} placeholder="Search" />
                                            }
                                        </span>
                                    }

                                    {noOfError !== 0 && <Button tabIndex="0" name="TableExport" className="reacTable-addbtn" style={{ marginRight: 10, float: "right" }} onClick={exportAction}>
                                        <Icon type="file-excel" theme="outlined" /><span style={{ marginLeft: 10 }}>Export as Excel</span>
                                    </Button>}

                                </ContentHolder>

                                <TableWrapper
                                    showingErrors={noOfError}
                                    //inputSearchVisible={hideInputSearch}
                                    bordered
                                    size="small"
                                    style={{
                                        marginTop: 10,
                                        display: "flex",
                                        flexDirection: "column"
                                    }}
                                    bordered
                                    id={renderedDataSource.length === 0 ? "noContent" : "transBotTable"}
                                    className={"trantable Generate_Define_Table"}
                                    onChange={this.handleChange}
                                    columns={columnByTabName}
                                    dataSource={renderedDataSource}
                                    scroll={{ y: "calc(100vh - 317px)", x: columnByTabName.length * 100 }}
                                />
                            </div>
                        </Spin>
                    </Form>
                </LayoutContent>
            </Modal>
        );
    }
}

const WrappedApp = Form.create()(DefineValidationModal);

export default WrappedApp;


