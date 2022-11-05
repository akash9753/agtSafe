import React, { Component } from 'react';
import { CallServerPost, errorModal, successModalCallback, PostCallWithZone, successModal, DownloadFileWithPostData, checkPermission } from '../Utility/sharedUtility';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { Form, Modal, Steps, Row, Spin, Icon, Input, Table } from 'antd';
import { DynamicForm } from '../Utility/htmlUtility';
import Button from '../../components/uielements/button';
import ReactTable from '../Utility/reactTable';
import Tabs, { TabPane } from '../../components/uielements/tabs';
import '../DefineBot/DefineBot.css';
import { stringSorter } from '../Utility/htmlUtility';
import { setTimeout } from 'timers';
import { Pagination } from 'antd';
import TableWrapper from '../../styles/Table/antTable.style';
import ContentHolder from '../../components/utility/contentHolder';
import renderEmpty from 'antd/lib/config-provider/renderEmpty';


const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var dataSource = [], thisObj, StudyID;

var metaDataSource = [];
var renderedDataSource = [];
var search = false;

var datas = [];


const metaDataColumns = [
    {
        title: 'S.No',
        dataIndex: 'slNo',
        key: 'slNo',
        width: 100,
        sorter: (a, b) => stringSorter(a, b, 'slNo'),
    },
    {
        title: 'RuleID',
        dataIndex: 'ruleID',
        key: 'ruleID',
        width: 100,
        sorter: (a, b) => stringSorter(a, b, 'ruleID'),
    },

    {
        title: 'PublisherID',
        dataIndex: 'publisherID',
        key: 'publisherID',
        width: 100,
        sorter: (a, b) => stringSorter(a, b, 'publisherID'),
    },

    {
        title: 'Identifier',
        dataIndex: 'identifier',
        key: 'identifier',
        width: 50,
        ellipsis: true,
        sorter: (a, b) => stringSorter(a, b, 'identifier'),
    },
    {
        title: 'Message',
        dataIndex: 'message',
        key: 'message',
        width: 50,
        ellipsis: true,
        sorter: (a, b) => stringSorter(a, b, 'message')
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: 100,
        ellipsis: true,
        sorter: (a, b) => stringSorter(a, b, 'description')
    },
    {
        title: 'Severity',
        dataIndex: 'severity',
        key: 'severity',
        width: 100,
        sorter: (a, b) => stringSorter(a, b, 'severity')
    }
];
const dataSetColumns = [
    {
        title: 'S.No',
        dataIndex: 'slNo',
        key: 'slNo',
        width: 100,
        sorter: (a, b) => stringSorter(a, b, 'slNo'),
    },
    {
        title: 'RuleID',
        dataIndex: 'ruleID',
        key: 'ruleID',
        width: 100,
        sorter: (a, b) => stringSorter(a, b, 'ruleID'),
    },

    {
        title: 'PublisherID',
        dataIndex: 'publisherID',
        key: 'publisherID',
        width: 100,
        sorter: (a, b) => stringSorter(a, b, 'publisherID'),
    },

    {
        title: 'Identifier',
        dataIndex: 'identifier',
        key: 'identifier',
        width: 100,
        ellipsis: true,
        sorter: (a, b) => stringSorter(a, b, 'identifier'),
    },
    {
        title: 'Message',
        dataIndex: 'message',
        key: 'message',
        width: 200,
        ellipsis: true,
        sorter: (a, b) => stringSorter(a, b, 'message')
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: 100,
        ellipsis: true,
        sorter: (a, b) => stringSorter(a, b, 'description')
    },
    {
        title: 'Severity',
        dataIndex: 'severity',
        key: 'severity',
        width: 100,
        sorter: (a, b) => stringSorter(a, b, 'severity')
    },
    {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        width: 100,
        sorter: (a, b) => stringSorter(a, b, 'category')
    },
    {
        title: 'Domain',
        dataIndex: 'domain',
        key: 'domain',
        width: 100,
        sorter: (a, b) => stringSorter(a, b, 'domain')
    },
    //{
    //    title: 'Variable',
    //    dataIndex: 'variable',
    //    key: 'variable',
    //    width: 100,
    //    sorter: (a, b) => stringSorter(a, b, 'variable')
    //}
];

class DefinePreValidationModal extends Component {
    constructor(props) {
        super(props);

        var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '_' + today.getHours() + ':' + today.getMinutes();
        this.state = {
            visible: false,
            loading: true,
            date: date,
            noOfError: props.metaDataSource.length,
            column: metaDataColumns,
            row: props.metaDataSource.length,
            exportAction: this.handleExcelDownloadMetaDataValidation,
            activeKey: "1",
            tableLoading: false,
            searchText: "",


        };
        renderedDataSource = props.metaDataSource;

        thisObj = this;

    }
    //static getDerivedStateFromProps(nextProps, currentstate) {
    //     thisObj.onTabChange(1);
    //}

    //componentWillReceiveProps(nextProps) {
    //    thisObj.onTabChange(1);
    //}
    componentDidMount() {
        thisObj.onTabChange(1);
    }
   
    handleExcelDownloadMetaDataValidation = () => {
        var title = this.props.title;

        var studyName = title.substring(0, title.lastIndexOf('_'));
        DownloadFileWithPostData('Study/ExportValidationResults', this.props.title + "_MetaDataValidationResults_" + this.state.date + ".xlsx", { StudyName: studyName, DirectoryName: title, MetaDataValidationFileName: "MetaDataValidationResults.xlsx" }, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }    

    handleExcelDownloadDataSetValidation = () => {
        var title = this.props.title;

        var studyName = title.substring(0, title.lastIndexOf('_'));
        DownloadFileWithPostData('Study/ExportValidationResults', this.props.title + "_DataSetValidationResults_" + this.state.date + ".xlsx", { StudyName: studyName, DirectoryName: title, DataSetValidationFileName: "DataSetValidationResults.xlsx" }, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }

    onTabChange = (tab) => {
        this.setState({ tableLoading: true });
        const props = thisObj.props;
        if (tab == 1) {
            renderedDataSource = props.metaDataSource;
            this.setState({ searchText:"", activeKey: tab.toString(), noOfError: props.metaDataSource.length, row: props.metaDataSource, column: metaDataColumns, exportAction: this.handleExcelDownloadMetaDataValidation });
        }

        else if (tab == 2) {
            renderedDataSource = props.dataSetDataSource;
            this.setState({ searchText:"", activeKey: tab.toString(), noOfError: props.dataSetDataSource.length, row: props.dataSetDataSource, column: dataSetColumns, exportAction: this.handleExcelDownloadDataSetValidation });
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

    render() {

        const { activeKey, row, column, noOfError, exportAction, loading, tableLoading,searchText } = this.state;
        const { visible } = this.props;

        const hideInputSearch = {
            display: "none"
        };

        
        return (
            <Modal
                visible={visible}
                title={this.props.title + " - Define Pre-Validation Results"}
                style={{ top: 20 }}
                onCancel={this.props.handleCancel}
                width={'95%'}
                maskClosable={false}
                footer={[

                    <Button key="finish" type="primary" name="Finish" onClick={this.props.handleCancel}>Finish</Button>,
                    //<Pagination
                    //    total={20}
                    //    defaultCurrent={1}
                    //    style={{
                    //        float: 'left', marginLeft: '20px'
                    //    }}
                    ///>
                ]}
            >
                <LayoutContent style={{ padding: 0 }} >
                    <Tabs onChange={this.onTabChange} type="card" activeKey={activeKey} style={{ paddingLeft: 20, paddingBottom: 2 }}>
                                           
                        <TabPane tab="MetaData Validation" key={"1"} >

                        </TabPane>
                       
                        <TabPane tab="Dataset Validation" key={"2"} >

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
                                    columns={column}
                                    dataSource={renderedDataSource}
                                    scroll={this.props.scroll}
                                />
                            </div>
                        </Spin>
                    </Form>
                </LayoutContent>
            </Modal>
        );
    }
}

const WrappedApp = Form.create()(DefinePreValidationModal);

export default WrappedApp;


