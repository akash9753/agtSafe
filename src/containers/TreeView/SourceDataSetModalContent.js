import React, { Component } from 'react';
import NewListComponentWrapper from './newListComponent.style';
import { Input, Tooltip, Col, Row, Spin, Icon, Button, Modal, Checkbox } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import Tabs, { TabPane } from '../../components/uielements/tabs';
import { InputSearch } from '../../components/uielements/input';
import { CallServerPost, errorModal, successModal,showProgress,hideProgress } from '../Utility/sharedUtility';
import { NewListWrapper } from './newListComponent.style';
import ReactTable from '../Utility/reactTable';
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";


function filterTableNames(tableNames, search) {
    search = search.toUpperCase();
    if (search) {
        return tableNames.filter(item => item.TABLE_NAME.toUpperCase().includes(search));
    }
    return tableNames;
}

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
var currentObj;
var thisObj = {};
export default class SourceDataSetModalContent extends Component {
    constructor(props) {
        super(props);
        this.singleTable = this.singleTable.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onTableClicked = this.onTableClicked.bind(this);
        this.setLoaderValue = this.setLoaderValue.bind(this);
        this.onTabChange = this.onTabChange.bind(this);
        this.fnToViewDomain = this.fnToViewDomain.bind(this);
        this.state = {
            visible: false,
            mainData: [],
            dataForDataTab: [],
            dataSource: [],
            search: '',
            settings: {
                data: [],
                licenseKey: 'non-commercial-and-evaluation',
                width: "100%",
                height: props.className === "studyConfig_SrcDataset_Parent" ? "calc(100vh - 206px)" : "calc(100vh - 219px)",
                stretchH: 'all',
                contextMenu: true,
                dropdownMenu: ['filter_by_condition', 'filter_by_value','filter_action_bar'],
                filters: true,
                editor: false,
                afterFilter: this.afterFilter,
                readOnly: true
            },
            metasettings: {
                data: [],
                licenseKey: 'non-commercial-and-evaluation',
                width: "100%",
                height: props.className === "studyConfig_SrcDataset_Parent" ? "calc(100vh - 206px)" : "calc(100vh - 219px)",
                stretchH: 'all',
                contextMenu: true,
                dropdownMenu: ['filter_by_condition', 'filter_by_value', 'filter_action_bar'],
                filters: true,
                editor: false,
                afterFilter: this.afterFilter1,
                readOnly: true
            },
            selectedTableName: '',
            activeKey: -1,
            loading: false,
            datasForFormatTab: {}, // its hld all formats
            formatsForCurrentDataSet: [], //its hold format for current datasource
            datasetColumn: [],
            isChecked: [],
            noOfRows: 0,
            noOfRows1:0

        };
        thisObj = this;
        const studyid = JSON.parse(sessionStorage.getItem("studyDetails")).studyID;
        currentObj = this;
        this.hotTableComponent = React.createRef();
        CallServerPost('Study/GetAllFormats', { StudyID: studyid })
            .then(
                function (response) {
                    let datasForFormatTab = response.value.table;
                    currentObj.setState({ datasForFormatTab });
                });
    }

    afterFilter1 = (values) => {
        const inst = this.hotTableComponent.current;

        const currData = inst.hotInstance.getData();
        const newSize = currData.length;
        this.setState({ noOfRows1: newSize });
        //console.log(values);
    }

    afterFilter = (values) => {
        const inst = this.hotTableComponent.current;

        const currData = inst.hotInstance.getData();
        const newSize = currData.length;
        this.setState({ noOfRows: newSize });
        //console.log(values);
    }
    //Set formatsw values for Current Data Source
    fnToSetFormatsForCurrentDataSet = (dataSource) => {
        var formatsForCurrentDataSet = [];
        dataSource.map(item => {
            var dataValForFormat = {};
            if (item.FORMAT_NAME != "" && item.FORMAT_NAME != null) {
                dataValForFormat["COLUMN_NAME"] = item.COLUMN_NAME;
                dataValForFormat["FORMAT_NAME"] = item.FORMAT_NAME;
                formatsForCurrentDataSet.push(dataValForFormat);
            }
        });
        return formatsForCurrentDataSet;
    }
    fnToViewDomain = (selectedTableName, currentActiveKey) => {
        if (currentActiveKey === -1) {
            currentActiveKey = 1;
        }
        const { valueData, sourceData } = this.props;
        const { metasettings, settings } = this.state;
        const thisobj = this;
        if (thisobj.hotTableComponent.current != null) {
            thisobj.hotTableComponent.current.hotInstance.scrollViewportTo(0, 0);
        }
        var currentDataSource = [];
        currentDataSource = valueData.filter(variable => variable.TABLE_NAME == selectedTableName);
        var formatsForCurrentDataSet = this.fnToSetFormatsForCurrentDataSet(currentDataSource);
        if (currentActiveKey == "1") {
            var datasForDataTab = [];
            // Getting vlues for MetaData tab            
            currentDataSource = currentDataSource.map(item => {
                var dataVal = {};
                var dtype = "Character";
                if (item.DATA_TYPE && item.DATA_TYPE === "5") {
                    dtype = "Numeric";
                }
                dataVal["COLUMN_NAME"] = item.COLUMN_NAME;
                dataVal["DESCRIPTION"] = item.DESCRIPTION;
                dataVal["DATATYPE"] = dtype;
                dataVal["CHARACTER_MAXIMUM_LENGTH"] = item.CHARACTER_MAXIMUM_LENGTH;
                dataVal["FORMAT_NAME"] = item.FORMAT_NAME;
                dataVal["FORMAT_LENGTH"] = item.FORMAT_LENGTH;
                datasForDataTab.push(dataVal);
            });
            
            this.setState({
                metasettings: { ...metasettings, filters: false },
                dataForDataTab: datasForDataTab,
                activeKey: currentActiveKey,
                selectedTableName: selectedTableName,
                loading: true,
                noOfRows1: datasForDataTab.length,
                formatsForCurrentDataSet: formatsForCurrentDataSet
            }, () => {
                if (thisobj.hotTableComponent.current != null) {
                    thisobj.hotTableComponent.current.hotInstance.scrollViewportTo(0, 0);
                }
            });
        } else if (currentActiveKey == "2") {
            currentObj = this;
            //Columns for DataSet values tab and Getting vlues for Data tab
            var columns = [];
            currentDataSource = currentDataSource.map(item => {
                var columnValues = {};
                var dataVal = {};
                columnValues["title"] = item.COLUMN_NAME;
                columnValues["dataIndex"] = item.COLUMN_NAME;
                columnValues["key"] = item.COLUMN_NAME;
                columnValues["width"] = 100;
                columns.push(columnValues);
            });
            showProgress();
            CallServerPost('Study/GetAllSourceDataSetValues', { StudyID: JSON.parse(sessionStorage.getItem("studyDetails")).studyID, TableName: selectedTableName })
                .then(
                function (response) {
                    if (response.value != null) {
                        let col = (columns || []).map(x => x.title);
                        currentObj.setState({
                            settings: { ...settings, filters: false },
                            isChecked: col,
                            mainDataSource: response.value,
                            dataSource: response.value,
                            datasetColumn: col, mainData: columns,
                            activeKey: currentActiveKey,
                            selectedTableName: selectedTableName,
                            loading: true,
                            noOfRows: response.value.length,
                            formatsForCurrentDataSet
                        }, () => {
                            if (thisobj.hotTableComponent.current != null) {
                                thisobj.hotTableComponent.current.hotInstance.scrollViewportTo(0, 0);
                            }
                        });
                    }
                    hideProgress();
                });
        } else if (currentActiveKey == "3")
        {
            currentObj = this;            
            var datasForCurrentDataSet = [];
            for (let i in currentObj.state.datasForFormatTab)
            {
                formatsForCurrentDataSet.map(function (item) {
                    if (item.FORMAT_NAME == currentObj.state.datasForFormatTab[i].format) {
                        //Add Column Value
                        currentObj.state.datasForFormatTab[i]["columnname"] = item.COLUMN_NAME;
                        datasForCurrentDataSet.push(currentObj.state.datasForFormatTab[i]);
                    }
                });
            }

            currentObj.setState({
                activeKey: currentActiveKey,
                selectedTableName: selectedTableName,
                loading: true,
                formatsForCurrentDataSet: datasForCurrentDataSet
            });
        }
    }

    singleTable(sourceData) {
        const { selectedTableName } = this.state;
        const colors = ["#7ED321", "#de1b1b", "#511E78", "#ff9009", "#42a5f5"];
        const activeClass = selectedTableName === sourceData.TABLE_NAME ? 'active' : '';
        const onClick = () => this.onTableClicked(sourceData.TABLE_NAME);
        return (
            <div className={"isoList " +activeClass} key={sourceData.TABLE_NAME}>
                <div
                    className="isoNoteBGColor"
                    style={{ width: '5px', background: colors[0] }}
                />
                <div className="isoNoteText" onClick={onClick}>
                    <h3 name={sourceData.TABLE_NAME + "_List"}>{sourceData.TABLE_NAME}</h3>
                    <span className="isoNoteCreatedDate">
                        {sourceData.DESCRIPTION}
                    </span>
                </div>
            </div>
        );
    }

    onChange(event) {
        this.setState({ search: event.target.value });
    }
    onTableClicked(selectedTableName) {
        this.fnToViewDomain(selectedTableName, this.state.activeKey);

    }   
    onTabChange(currentActiveKey) {       
        this.fnToViewDomain(this.state.selectedTableName, currentActiveKey);
    }
    setLoaderValue = loaderVal => {
        if (loaderVal) {
            this.setState({ loading: false });
        }

    };


    keepModal = () => {
        this.setState({
            visible: true,
        });
    };

  

    handleCancel = e => {
        //console.log(e);
        this.setState({
            visible: false
        });
    };

    componentDidUpdate() {
        let { filters } = thisObj.state.settings;
        if (!filters) {
            thisObj.setState({ settings: { filters: true } });
        }
        if (!thisObj.state.metasettings.filters) {
            thisObj.setState({ metasettings: { filters: true } });
        }
    }

    reset = () => {
        let col = (this.state.mainData || []).map(x => x.title);
        this.setState({ settings: { filters: false }, isChecked: col, datasetColumn: col, dataSource: this.state.mainDataSource, visible: false, noOfRows: this.state.mainDataSource.length });
    }

  
    metaTable = () => {
        this.setState({ metasettings: { filters: false }, noOfRows1: this.state.dataForDataTab.length })
    }

    handleCheckClick = (event,title) => {
       
        let checked = this.state.isChecked;
        if (event.target.checked) {
            checked.push(title);
        } else {
            checked = checked.filter(x => x !== title); 
        }
        this.setState({
            isChecked: checked
        });
    }

    onSelect = (event) => {
        let data = this.state.mainData.map(x => x.title);
        this.setState({ isChecked: data });
    }

    onClear = () => {
        this.setState({isChecked:[]})
    }

    onColumnClick = () => {
        let { isChecked, mainDataSource} = this.state;
        if (isChecked.length > 0) {
            mainDataSource.map(x => {
                let filterDataSource = {};
                isChecked.map(y => {
                    filterDataSource[y] = x[y];
                });
            });
            this.setState({ datasetColumn: isChecked,  visible: false });
        } else {
            errorModal('Select any one column');
        }
    } 

  


    render() {
        const { isChecked, search, activeKey, allCheck, noOfRows, formatsForCurrentDataSet, currentActiveKey } = this.state;
        const { className } = this.props;
        const sourceData = filterTableNames(this.props.sourceData, search);

        const dataSetColumn = this.state.datasetColumn.map(function (e) {
            return { data: e };
        });

        const columns = [
            { data: 'Variable' },
            { data: 'DataType' },
            { data: 'CHAR Max Length' },
            { data: 'Label' },
            { data: 'Format' },
            { data: 'Format Length' },
            
        ];

        const colHeaders = [
            'Variable',
            'Label',
            'DataType',
            'Max Length',
            'Format',
            'Format Length'
        ];

        var columnsForDataTab;
        if (this.state.dataForDataTab.length > 0) {
            columnsForDataTab = [{
                title: 'COLUMN_NAME',
                dataIndex: 'COLUMN_NAME',
                key: 'COLUMN_NAME',
                width:100
            },
            {
                title: 'DESCRIPTION',
                dataIndex: 'DESCRIPTION',
                key: 'DESCRIPTION',
                width: 100
            },
            {
                title: 'DATATYPE',
                dataIndex: 'DATATYPE',
                key: 'DATATYPE',
                width: 100
            },
            {
                title: 'CHARACTER_MAXIMUM_LENGTH',
                dataIndex: 'CHARACTER_MAXIMUM_LENGTH',
                key: 'CHARACTER_MAXIMUM_LENGTH',
                width: 100
            },
            {
                title: 'FORMAT_NAME',
                dataIndex: 'FORMAT_NAME',
                key: 'FORMAT_NAME',
                width: 100
            },
            {
                title: 'FORMAT_LENGTH',
                dataIndex: 'FORMAT_LENGTH',
                key: 'FORMAT_LENGTH',
                width: 100
            }];     

            var columnsForFormatTab = [{
                title: 'Variable',
                dataIndex: 'columnname',
                key: 'columnname',
                width: 50
            }, {
                title: 'Format',
                dataIndex: 'format',
                key: 'format',
                width: 50
            },
            {
                title: 'Encoded Value',
                dataIndex: 'encoded',
                key: 'encoded',
                width: 50
            },
            {
                title: 'Decoded Value',
                dataIndex: 'decoded',
                key: 'decoded',
                width: 50
            }];   
        }
      
      
        return (
            <NewListComponentWrapper>
                <Modal
                    title="Keep"
                    visible={this.state.visible}
                    width={300}
                    onCancel={this.handleCancel}
                    footer={[
                        <Row justify="end">
                            <Col span={4} offset={4}>
                                <Button key="Select" name="Select" onClick={this.onSelect} >
                                Select all
                                </Button>
                            </Col>,

                          <Col span={6} offset={6}>
                         <Button name="Clear" key="Clear" onClick={this.onClear}>
                                Clear all
                               </Button>
                            </Col>
                        </Row>,
                        <br />,

                        <Row justify="end">
                            <Col span={4} offset={4}>
                                <Button key="Cancel" name="Cancel" onClick={this.handleCancel} style={{ width: 85 }} >
                                    Cancel
                                 </Button>
                            </Col>

                            <Col span={6} offset={6}>
                                <Button name="ok" key="ok" onClick={this.onColumnClick}  style={{ width: 80 }}>
                                    OK
                                  </Button>
                                </Col>
                              </Row>,
                       

                    ]}
                >


                    <ul>
                   
                        {this.state.mainData .map(({title },index) => (
                            <li>
                                <label>
                                    <Checkbox
                                        type="checkbox"                                 
                                        name={title}
                                        style={{ pointerEvents: "auto" }}
                                        checked={isChecked.indexOf(title) !== -1}
                                        onChange={(e) => { this.handleCheckClick(e, title) }}
                                    >
                                        {title}
                                        </Checkbox>
                                </label>
                            </li>
                        ))}
                    </ul>

                    

                </Modal>
                <Row gutter={4} className={className} style={{ width: '100%', height: 'calc(100vh - 120px)' }}>
                    <Col span={6} style={{ height: '100%' }}>
                        <div className="isoNoteListSidebar">
                            <NewListWrapper className="isoNoteListWrapper" style={{ height: 'calc(100vh - 119px)'}}>
                                <InputSearch
                                    placeholder="Search Datasets"
                                    allowClear
                                    className="isoSearchNotes"
                                    value={search}
                                    onChange={this.onChange}
                                    name="Source Dataset Search"
                                />
                                <div className="isoNoteList">
                                    {sourceData && sourceData.length > 0 ? (
                                        sourceData.map(sourceData => this.singleTable(sourceData))
                                    ) : (
                                            <span className="isoNotlistNotice">No Dataset found</span>
                                        )}
                                </div>
                            </NewListWrapper>
                        </div>

                    </Col>
                    {
                        activeKey >= 0 && 
                        <Col span={18} style={{ height: '100%' }}>
                            <Tabs onChange={this.onTabChange} type="card" className="SourceDatasetTab" style={{ paddingLeft: 20, paddingBottom: 5 ,overflowY:"hidden !important"}}>
                                    <TabPane className={this.state.dataForDataTab.length > 0 ? "overlayTable" : "tables"} tab="MetaData" key={"1"} /*style={{overflow: 'auto'}}*/>
                                       
                                            <Spin indicator={antIcon} spinning={this.state.loading} size="small">
                                                <Button type="primary" disabled={this.state.noOfRows1 === this.state.dataForDataTab.length} size="large" style={{ marginLeft: 10 }} onClick={this.metaTable}>
                                                    Reset
                                                </Button>
                                            <span style={{ float: "right", marginRight: "15px", marginTop: "7px" }}>Showing list of records:{this.state.noOfRows1}</span>
                                            
                                               
                                                <HotTable
                                                    ref={this.hotTableComponent}
                                                    colHeaders={colHeaders}
                                                    settings={this.state.metasettings}
                                                    data={this.state.dataForDataTab}
                                                    style={{ marginTop: 15 }}
                                                    licenseKey="non-commercial-and-evaluation"
                                                />
                                            
                                                {this.setLoaderValue(this.state.loading)}
                                            </Spin>
                                        
                                </TabPane>
                                    <TabPane tab="DataSet Values" className={this.state.dataSource.length > 0 ? "overlayTable" : "tables"} key={"2"} /*style={{overflow: 'auto' }}*/>
                                       
                                            <Spin indicator={antIcon} spinning={this.state.loading} size="small">

                                                <Button type="primary" size="large" style={{ marginLeft: 10 }} onClick={this.keepModal}>
                                                    Keep
                                                </Button>

                                                <Button type="primary" size="large" disabled={noOfRows === this.state.dataSource.length} style={{ marginLeft: 15 }} onClick={this.reset}>
                                                    Reset
                                                </Button>
                                                <span style={{ float: "right", marginRight: "15px", marginTop: "7px" }}>Showing list of records:{this.state.noOfRows}</span>
                                                    {
                                                        dataSetColumn && Array.isArray(dataSetColumn) &&
                                                        dataSetColumn.length > 0 &&
                                                        <HotTable
                                                            ref={this.hotTableComponent}
                                                            columns={dataSetColumn}
                                                            colHeaders={this.state.datasetColumn}
                                                            settings={this.state.settings}
                                                            data={this.state.dataSource}
                                                            style={{ marginTop: 15 }}
                                                            licenseKey="non-commercial-and-evaluation"
                                                        />
                                                    }

                                                {this.setLoaderValue(this.state.loading)}
                                            </Spin>
                                        
                                </TabPane>
                                    <TabPane className={this.state.formatsForCurrentDataSet.length > 0 ? "overlayTable" : "tables"} tab="Formats" key={"3"}>
                                       
                                            <Spin indicator={antIcon} spinning={this.state.loading} size="small">

                                                <ReactTable

                                                    scroll={{ y: "calc(100vh - 256px)" }}
                                                    columns={columnsForFormatTab}
                                                    dataSource={this.state.formatsForCurrentDataSet}
                                                />
                                                {this.setLoaderValue(this.state.loading)}
                                            </Spin>
                                        
                                    </TabPane>
                                
                            </Tabs>
                        </Col>
                    }
                    
                </Row>
            </NewListComponentWrapper>
        );
    }
}