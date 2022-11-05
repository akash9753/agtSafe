import React, { Component } from 'react';
import TableWrapper from '../../styles/Table/antTable.style';
import ContentHolder from '../../components/utility/contentHolder';
import Select, { SelectOption } from '../../components/uielements/select';
import Button from '../../components/uielements/button';
import SwitchToolTip from '../Tooltip/SwitchToolTip';
import { Icon, Input, Spin } from 'antd';
import {
    
    mappingPermission
} from '../Utility/sharedUtility';
const Option = SelectOption;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var allDataSource = [];
var renderedDataSource = [];
var thisObj = {};
var search = false;
export default class ReactTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            paginationSize: 10,
            current: 1,
            records: "",
            showingEntries: this.props.showingEntries,
            loading:false
        };

        search = false;
        this.onPaginationChange = this.onPaginationChange.bind(this);
        this.records = this.records.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);     
        thisObj = this;
        window.addEventListener('resize', this.Render);

    }

    Render = () =>
    {
        try {
            var table = document.getElementsByClassName("ant-table-body");
            table && (Array.from(table) || []).map((tabl, i) => {
                if (document.getElementsByClassName("ant-table-body")) {
                    if (document.getElementsByClassName("ant-table-body")[i].clientHeight >= document.getElementsByClassName("ant-table-body")[i].scrollHeight && document.getElementsByClassName("ant-table-header")) {
                        
                        document.getElementsByClassName("ant-table-header")[i].classList.add("autoScroll");
                        document.getElementsByClassName("ant-table-header")[i].classList.remove("staticScroll");
                    }
                    else if (document.getElementsByClassName("ant-table-header")){
                        document.getElementsByClassName("ant-table-header")[i].classList.add("staticScroll");
                        document.getElementsByClassName("ant-table-header")[i].classList.remove("autoScroll");

                    }
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    componentDidMount() {
        thisObj.Render();
        setTimeout(
            function () {
                this.setState({ loading: false });
            }
                .bind(this),
            200
        );
    }

    componentWillReceiveProps(nextProps) {
        search = this.state.searchText != "";
        if (allDataSource != nextProps.dataSource) {
        //    search = false;
        //    this.setState({ searchText: '' });
        }
    }

    componentDidUpdate() {
        
        thisObj.Render();

        var getDropDownElems = document.getElementsByClassName("ant-select-selection-selected-value");
        for (var i = 0; i < getDropDownElems.length; i++) {
            document.getElementsByClassName("ant-select-selection-selected-value")[i].removeAttribute("title");//to remove title in selected dropdown value
        }

        var getSortElems = document.getElementsByClassName("ant-table-column-sorter-inner");
        for (var j = 0; j < getSortElems.length; j++) {
            document.getElementsByClassName("ant-table-column-sorter-inner")[j].removeAttribute("title");//to remove title in table sort icon
        }
        
    }
    
    getColumns = (columnsArr) => {
        var temp = [];
        for (var i = 0; i < columnsArr.length; i++) {
            if (columnsArr[i].key !== "actions") {
                var columnConfig = {
                    dataIndex: columnsArr[i].dataIndex,
                    key: columnsArr[i].key,
                    title: columnsArr[i].title,
                    width: columnsArr[i].width,
                    sorter: columnsArr[i].sorter,
                    filteredValue: this.state.searchText,
                    render: (text) => (
                        <div>
                            <div style={{ textOverflow: "ellipsis", overflow: "hidden" }}>{text}</div>
                            <div className="toolTip">
                                <span className="toolTipText">{text}</span>
                            </div>
                        </div>
                    )
                };
                if ("fixed" in columnsArr[i]) {
                    columnConfig["fixed"] = columnsArr[i].fixed; 
                }
                temp.push(columnConfig);
            } else if (columnsArr[i].key === "actions" || columnsArr[i].key === "workflowActions") {
                temp.push({
                    dataIndex: columnsArr[i].dataIndex,
                    key: columnsArr[i].key,
                    title: columnsArr[i].title,
                    width: columnsArr[i].width
                });
            }
        }
        return temp;
    }


    onSearch = (inputText) => {
        renderedDataSource =( allDataSource || []).map((record) => {
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
        this.onSearch(e.target.value );
        this.setState({ showingEntries: renderedDataSource.length, current: 1 });
        this.forceUpdate();
    }

    clearSearch = () => {
        this.setState({ searchText: "" });
        this.onSearch("");
        search = false;
    }
    handleTableChange = (pagination, filters, sorter) => {
        this.setState({ current: pagination.current });
    }
    onPaginationChange = (value) => {
        const paginationSize = this.state.paginationSize;
        const totalRecords = renderedDataSource.length;
        var temp = Math.ceil(totalRecords / parseInt(value));
        if (this.state.current > temp) {
            this.setState({ current: temp, paginationSize: parseInt(value) });
        }
        else {
            this.setState({ paginationSize: parseInt(value) });
        }
    }

    records = (paginationSize) => {
        var temp = (paginationSize * (this.state.current - 1)) + paginationSize;
        const totalRecords = renderedDataSource.length;
        const current = (Math.ceil(totalRecords / paginationSize) < this.state.current) ? Math.ceil(totalRecords / paginationSize) : this.state.current;

        if (totalRecords == 0) {
            return "No entries found."
        }
        else if (paginationSize > totalRecords) {
            return "Showing " + ((paginationSize * (current - 1)) + 1) + " to " + totalRecords + " of " + totalRecords + " records"
        }
        else {
            return "Showing " + ((paginationSize * (current - 1)) + 1) + " to " + ((temp > totalRecords) ? totalRecords : temp) + " of " + totalRecords + " records";
        }
    }

    render() {
       let col = this.getColumns(this.props.columns);
        allDataSource = this.props.dataSource;

        var pagination = true;
        if (!search) {
            renderedDataSource = this.props.dataSource;
        } else {
            this.onSearch(this.state.searchText);
        }

        var addBtn;
        if (this.props.addAction && (this.props.pageName != "mapping" || (this.props.pageName === "mapping" && mappingPermission(this.props.activityWrkflowStatus)))) {
            addBtn = (<Button name="TableAdd" tabIndex="0" className="reacTable-addbtn" style={{ marginRight: 10, float: "right" }} onClick={this.props.addAction}>
                <i className="ion-android-add"></i><span style={{ marginLeft: 10 }}>Add</span>
            </Button>);
        }
        var importFromMappingLib;
        if (this.props.importFromMappingLib && (this.props.pageName === "mapping" && mappingPermission(this.props.activityWrkflowStatus))) {
            importFromMappingLib = (<Button
                style={{ float: "right", marginRight: 10, fontSize:"12px" }}
                onClick={() => {
                    this.props.importFromMappingLib();
                }}
                className="reacTable-addbtn"
            >
                <i className="fas fa-file-import" style={{ paddingRight: 2 }} > {"Copy From Library"}</i>
            </Button>);
        }
       
        var importBtn;
        if (this.props.importAction != null) {
            importBtn = (<Button tabIndex="0" name="ImportExcel" className="reacTable-addbtn" style={{ marginRight: 10, float: "right" }} onClick={this.props.importAction}>
                <Icon type="file-excel" theme="outlined" /><span style={{ marginLeft: 10 }}>Import Excel</span>
            </Button>);
        }


        var exportBtn;
        if (this.props.exportAction != null) {
            exportBtn = (<Button tabIndex="0" name="TableExport" className="reacTable-addbtn" style={{ marginRight: 10, float: "right" }} onClick={this.props.exportAction}>
                <Icon type="file-excel" theme="outlined" /><span style={{ marginLeft: 10 }}>Export as Excel</span>
            </Button>);
        }

        var simpleWhereClauseBtn;
        if (this.props.simpleWhereClause != null) {
            simpleWhereClauseBtn = (<div style={{ float: "right" }}><Button name="TableSimpleWhereClause" tabIndex="0" className="reacTable-addbtn" style={{ marginRight: 5 }} onClick={this.props.simpleWhereClause}>
                <span> Simple Where Clause</span>
            </Button>
                <Button tabIndex="0" name="TableComplexWhereClause" className="reacTable-addbtn" style={{ marginRight: 5 }} onClick={this.props.complexWhereClause}>
                    <span> Complex Where Clause</span>
                </Button>

            </div>);
        }

        var switchBtn;
        if (this.props.switchBtn != null) {
            switchBtn = (<div style={{ marginTop: "-32px" }}>
                <SwitchToolTip name="TableSwitch" switchtooltip={this.props.switchtooltip} classname="activeInactiveState" onChange={this.props.switchOnChange} checked={this.props.switchChecked} />
            </div>
            );
        }

        var backBtn;
        if (this.props.backButtonHandle != null) {
            backBtn = (<Button tabIndex="0" name="TableBack" className="reacTable-addbtn" style={{ marginRight: 10, float: "right" }} onClick={this.props.backButtonHandle}>
                <i className="fas fa-arrow-left" style={{ marginRight: 10 }}></i><span>Back</span>
            </Button>);
        }

        var CustomCodeListDownloadTemplate;
        if (this.props.customCodeListDownloadTemplate != null) {
            CustomCodeListDownloadTemplate = (<Button tabIndex="0" name="ImportExcel" className="reacTable-addbtn" style={{ marginRight: 10, float: "right" }} onClick={this.props.customCodeListDownloadTemplate}>
                <Icon type="file-excel" theme="outlined" /><span style={{ marginLeft: 10 }}>Download Template</span>
            </Button>);
        }

        if (this.props.pagination != undefined) {
            pagination = this.props.pagination;
        }
        let datas = false;
        if (typeof renderedDataSource != 'undefined' && typeof renderedDataSource === "object") {
            if (renderedDataSource.length > 0) {
                datas = true;
            }
        }
        const searchText = this.state.searchText;
        return (
            <Spin indicator={antIcon} spinning={this.state.loading}>
            <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                
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
                    {
                        (pagination) ?
                                (renderedDataSource !== undefined ? (<Select tabIndex="0" aria-name="TableSelect" onChange={this.onPaginationChange} className="table-select-value" defaultValue="10" style={{ width: 65, float: "right" }}>
                                    <Option name="TableSelectOption" className="studylist-dropdown" key="10">10</Option>
                                    {renderedDataSource.length > 10  && <Option name="TableSelectOption" className="studylist-dropdown" key="20">20</Option>}
                                    {renderedDataSource.length > 20 && <Option name="TableSelectOption" className="studylist-dropdown" key="50">50</Option>}
                                    {renderedDataSource.length > 50 && <Option name="TableSelectOption" className="studylist-dropdown" key="100">100</Option>}
                                </Select>) : null) : <span>
                                    {this.props.showingEntries != null ? (<p style={{ float: "right", marginTop: 10, marginBottom: 0 }} >No of rows: {renderedDataSource.length}</p>) : (this.props.showingErrors != null ? (<p style={{ float: "right", marginTop: 10, marginBottom: 0 }} >No of errors: {renderedDataSource.length}</p>) : (""))}
                            </span>
                    }
                    {backBtn}
                    {addBtn}
                    {importFromMappingLib}
                    {switchBtn}
                    {importBtn}
                    {exportBtn}
                    {simpleWhereClauseBtn}
                    {CustomCodeListDownloadTemplate}
                </ContentHolder>
                
                <TableWrapper
                    pagination={(pagination) ? { pageSize: this.state.paginationSize, current: this.state.current, showTitle : true } : pagination}
                    size="small"
                    style={{
                        marginTop: 10,
                        height: datas ? "100%" : "auto",
                        display: "flex",
                        flexDirection: "column"
                    }}
                    bordered
                    columns={col}
                    dataSource={renderedDataSource}
                    scroll={this.props.scroll}
                    onChange={this.handleTableChange}
                        id={!datas ? "noContent" : "transBotTable"}
                    className={this.props.backAction !== null ? "backBtnAdded" : "trantable"}
                    onRow={(record, rowIndex) => {
                        return {
                            onDoubleClick: this.props.onDoubleClick ?
                                    () => {
                                        this.props.onDoubleClick(record, rowIndex)
                                }
                              :
                                event => { 
                                    event.preventDefault()
                                   },// click row

                            onMouseEnter: event => {

                                if (event.target.nodeName === "TD" && event.target.nodeName !== "P") {
                                    if (event.target.children.length > 0 && event.target.lastChild.firstChild !== null) {
                                        if (event.target.lastChild.firstChild.clientWidth !== event.target.lastChild.firstChild.scrollWidth && event.target.lastChild.firstChild.nodeName !== "BUTTON") {

                                            //Setting tooltip div position from top
                                            var props = event.target.getBoundingClientRect();
                                            event.target.lastChild.lastChild.firstChild.style.top = props.top - event.target.lastChild.lastChild.firstChild.offsetHeight + "px";
                                            event.target.lastChild.lastChild.firstChild.style.left = props.left + "px";

                                            if (event.target.lastChild.firstChild.className !== "activeToolTip") {
                                                event.target.lastChild.firstChild.classList.add("activeToolTip");
                                            }

                                        }
                                    }                                    
                                } else if (event.target.nodeName === "P" && event.target.nodeName !== "TD") {                                    

                                    if (event.target.clientWidth !== event.target.scrollWidth && event.target.nodeName !== "BUTTON") {

                                        //Setting tooltip div position from top
                                        var props = event.target.getBoundingClientRect();
                                        event.target.nextElementSibling.firstElementChild.style.top = props.top - event.target.nextElementSibling.firstElementChild.offsetHeight + "px";
                                        event.target.nextElementSibling.firstElementChild.style.left = props.left + "px";

                                        if (event.target.className !== "activeToolTip") {
                                            event.target.classList.add("activeToolTip");
                                        }
                                        
                                    }
                                }
                                
                            }
                        };
                        }}
                    rowClassName={this.props.rowClassName ? this.props.rowClassName: "" }

                    />
                {
                    (pagination) ?
                        <div style={{ marginTop: "-23px" }}>
                            <span id="showrecordspan">{(this.props.dataSource != undefined) ? (this.props.dataSource.length != 0) ? (this.records(this.state.paginationSize)) : "Showing 0 entries" : "Showing 0 entries"}</span>
                        </div> : ""
                    }                  

                </div>
                {
                    typeof this.props.simpleWhereClause !== "undefined" && <div style={{ marginTop: "-23px" }}>
                        <span id="showrecordspan">{' No of conditions: ' + renderedDataSource.length}</span>
                    </div>

                }
            </Spin>
        );
    }
}
