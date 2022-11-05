import React, { Component, useRef, useState, useEffect } from 'react';
import { Modal, Button, Row, Checkbox, Icon, Input, Breadcrumb } from 'antd';
import 'handsontable/dist/handsontable.full.css';
import { HotTable, HotColumn } from '@handsontable/react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { errorModal, CallServerPost, showProgress, hideProgress, checkPermission, successModalCallback } from '../Utility/sharedUtility';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import { ActionColumn } from '../User/ActionColumn';
import ConfirmModal from '../Utility/ConfirmModal';
import moment from 'moment-timezone';


export default function MappingLibrary(props) {
    let Ref_Table = useRef();
    let Ref_Search = useRef();

    const ActionCell = (props) => {
        return props.value;
    }
    let maplibpermission = (checkPermission(props.permissions, ["self"]) >= 4);
    //if sow all is checkbox means table multiple select
    //else single select
    let type = "checkbox";
    let ShowAll = true;
    let hideCheckBox = false;
    let [isChecked, setChecked] = useState(false);
    let [showDeleteModal, setShowDeleteModal] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [dataSourceOrg, setDataSourceOrg] = useState([]);
    let [filteredData, setFilteredData] = useState(dataSource);
    let [searchText, setSearchText] = useState("");
    //console.log(checkPermission(props.permissions, ["self"]) >= 4)
    const refreshList = () => {
        let mappingOperation = false;

        const permissions = props.permissions;
        let data = [];
        let inData = {};

        //MappingLibrary
        if (mappingOperation) {
            let { targetDataSet, targetVariableName } = mappingOperation;

            inData.targetDataSet = targetDataSet;
            inData.targetVariableName = targetVariableName
            inData.mappingLibraryID = 0;

        }
        else {
            inData.mappingLibraryID = -1;
        }
        showProgress();
        CallServerPost("MappingLibrary/GetAll", inData)
            .then((res) => {
                hideProgress();
                if (res.status === 1) {

                    let libraryRecord = res.value;

                    const perLevel = checkPermission(permissions, ["self"]);
                    for (var i = 0; i < libraryRecord.length; i++) {
                        let source = libraryRecord[i].sourceDataset + "." + libraryRecord[i].sourceVariableName;
                        let target = libraryRecord[i].targetDataSet + "." + libraryRecord[i].targetVariableName;
                        let constructString = libraryRecord[i].constructString;
                        const mappingLibraryID = libraryRecord[i].mappingLibraryID;

                        data.push({
                            key: mappingLibraryID,
                            source: source,
                            target: target,
                            constructString: constructString
                        });
                    }

                    setDataSource(data);
                    setFilteredData(data);
                }
                else {
                    setDataSource([]);
                    setFilteredData([]);
                }
                hideProgress();
            }).catch((e) => {
                hideProgress();
            });
    }
    useEffect(() => {
        refreshList();
    }, []);


    //For Checkbox in Table
    let getHTML = (showall_loc) => {
        if (showall_loc) {

            let checkbox = "<input type='checkbox' class='checker parentimportcheckbox' ";
            checkbox += isChecked ? 'checked="checked"' : '';
            checkbox += !(checkPermission(props.permissions, ["self"]) >= 4) || hideCheckBox ? 'disabled' : "";

            checkbox += ">";
            return checkbox;
        }
        else {

            return "Check";
        }
    }

    let getColumns = (showall_loc) => {
        const Columns = [
            {
                title: getHTML(showall_loc),
                type: 'checkbox',
                data: "Row_Selection",
                readOnly: !(checkPermission(props.permissions, ["self"]) >= 4),
                classname: "htCenter htMiddle"
            },
            {
                title: "Source",
                data: "source",
                classname: "htCenter htMiddle"
            },
            {
                title: "Target",
                data: "target"
            },
            {
                title: "Rule",
                data: "constructString"
            }

        ]
        if (!(checkPermission(props.permissions, ["self"]) >= 4)) {
            Columns.shift();
        }
        return Columns;
    }
    //Columns
    

    //Select All Record
    //when parent checkbox clicked
    const SelectAllRecord = (event, coords) => {
        const totalRows = filteredData.length;

        let check = !isChecked;

        for (let index = 0; index < totalRows; index++) {
            Ref_Table.current.hotInstance.getInstance().setDataAtCell(index, 0, check ? true : false);
        }
        setChecked(check);
    }


    //Is check selected mapping rule target is available in current study??
    let checkIsTargetAval = (sel_lib_records) => {
        let { Standards } = props;
        let target = [];
        //Std Target Domain Variable
        let { Domain, Variable } = Standards;
        let out =
        {
            err: false,
            emsg: [<div><h1>Following targets are not available :</h1></div>]
        }

        sel_lib_records.map((lr) => {
            //Domain aval for the study
            let isDomainAval = Domain.find(dm => dm.domain === lr.targetDataSet);
            if (isDomainAval) {
                lr.cdiscDataStdDomainMetadataID = isDomainAval.cdiscDataStdDomainMetadataID;
                let isVariableAval = Variable.find(va => va.variableName === lr.targetVariableName &&
                    va.cdiscDataStdDomainMetadataID === isDomainAval.cdiscDataStdDomainMetadataID);
                if (isVariableAval) {
                    lr.cdiscDataStdVariableMetadataID = isVariableAval.cdiscDataStdVariableMetadataID;
                    return true;
                }
            }
            out.err = true;

            if (target.indexOf(lr.target) === -1) {
                target.push(lr.target);
                out.emsg.push(<p className="errparatag">{lr.target}</p>);
            }
        });
        return out;
    }

    let checkisTarExistAlready = (sel_lib_records) => {
        //Already exist variable
        let { MappingList } = props;
        let target = [];
        let out = {
            err: false,
            emsg: [<div><h1>Following targets are already exist :</h1></div>]

        }

        sel_lib_records.map((lr) => {
            //Domain aval for the study
            let isTarExist = MappingList.some(ml => ml.targetDataSet === lr.targetDataSet &&
                ml.targetVariableName === lr.targetVariableName);

            if (isTarExist && target.indexOf(lr.target) === -1) {
                target.push(lr.target);
                out.err = true;
                out.emsg.push(<p className="errparatag">{lr.target}</p>)
            }

        });

        return out;
    }

    //Delete selected rules
    let DeleteRule = () => {

        //let allrecord = Ref_Table.current.hotInstance.getSourceData();
        let allrecord = filteredData;

        if (allrecord.length > 0) {
            //filter only selected record
            let selected_records = allrecord.filter(rec => rec.Row_Selection);

            if (selected_records.length > 0) {
                setShowDeleteModal(true);
            }
            else {
                errorModal("Select atleast one rule to delete");
            }
        }
        else {
            errorModal("No rule(s) available to delete");
        }
    }

    let DeleteBulk = (changeReason) => {
        setShowDeleteModal(false);

        //filter only selected record
        let selected_records = filteredData.filter(rec => rec.Row_Selection);
        if (selected_records.length > 0) {
            showProgress();
            const zones = moment.tz.guess();
            const timezone = moment.tz(zones).zoneAbbr();
            const userID = JSON.parse(sessionStorage.getItem("userProfile")).userID;
            let delList = [];
            for (var i = 0; i < selected_records.length; i++) {
                delList.push({
                    UpdatedBy: userID,
                    TimeZone: timezone,
                    MappingLibraryID: selected_records[i].key
                });
            }

            CallServerPost("MappingLibrary/Delete", delList)
                .then((res) => {
                    hideProgress();
                    if (res.status === 1) {
                        successModalCallback(res.message, refreshList);

                    } else {
                        errorModal(res.message);
                    }
                }).catch((e) => {
                    hideProgress();
                });


        }
        else {
            errorModal("Select atleast one rule to delete");
        }
    }

    //on search
    let onSearch = (event) => {

        if (dataSource.length === 0) return;
        let hiddenPlugin = Ref_Table.current.hotInstance.getPlugin('hiddenRows');
        const searchTextval = event.currentTarget.value;
        hiddenPlugin.showRows([...Array(filteredData.length).keys()]);
        
        if (searchTextval && searchTextval.length > 1) {
            const searchresult = Ref_Table.current.hotInstance.getPlugin("search").query(searchTextval);

            let rowstohide = [];
            filteredData.forEach(function (value, i) {
                if (searchresult.filter(a => a.row === i).length === 0) {
                    rowstohide.push(i);
                }
            });
            
            hiddenPlugin.hideRows(rowstohide);
            hideCheckBox = searchresult.length === 0;
            Ref_Table.current.hotInstance.render();
        } else {
            hideCheckBox = false;
            Ref_Table.current.hotInstance.render();
        }
        if (searchTextval && searchTextval.length === 0) {
            Ref_Search.current.input.value = "";
        }
    }

    //on clearSearch
    let clearSearch = () => {
        Ref_Search.current.input.value = "";
        let hiddenPlugin = Ref_Table.current.hotInstance.getPlugin('hiddenRows');
        hiddenPlugin.showRows([...Array(filteredData.length).keys()]);
        Ref_Table.current.hotInstance.render();
    }
   
    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <i className="fas fa-book" />
                    <span> Mapping Library</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    List
                </Breadcrumb.Item>
            </Breadcrumb>
            <LayoutContentWrapper>
                <Row style={{ width: "100%", padding: "5px" }}>
                    <Input
                        ref={Ref_Search}
                        tabIndex="0"
                        name="TableSearch"
                        suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        suffix={<Icon onClick={clearSearch} type="close" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        style={{ width: '20%' }} onChange={onSearch} placeholder="Search"
                    />
                </Row>
                <Row style={{ width: "100%", padding: "5px" }}>
                    <HotTable
                        id="MappingLibraryList"
                        licenseKey="non-commercial-and-evaluation"
                        height={maplibpermission ? "calc(100vh - 203px)" : "calc(100vh - 179px)"}
                        style={{ borderRadius: "10px" }}
                        viewportRowRenderingOffsetnumber={10}
                        ref={Ref_Table}
                        settings=
                        {
                            {
                                wordWrap: true,
                                stretchH: 'all',
                                data: dataSource,
                                columns: getColumns(ShowAll),
                                editable: false,
                                readOnly: true,
                                filters: true,
                                hiddenRows: true,
                                dropdownMenu: ['filter_by_condition', 'filter_by_value', 'filter_action_bar'],
                                afterFilter: function (filter) {
                                    let filteredVal = this.getPlugin('trimRows').rowsMapper._arrayMap.map(r => this.getSourceDataAtRow(r))
                                    setFilteredData(filteredVal)
                                },
                                afterGetColHeader: function (col, TH) {
                                    if (col === 0) {
                                        const button = TH.children[0].children[0];
                                        button.parentNode.removeChild(button);
                                    }
                                },
                                afterOnCellMouseUp: function (e, coords, td) {
                                    e.preventDefault();

                                    if (e.realTarget.classList.contains('checker')) {
                                        //when parent checkbox clicked
                                        SelectAllRecord(e, coords);
                                    }
                                },
                                afterChange: function () {
                                    if (filteredData.some(x => !x.Row_Selection)) {
                                        setChecked(false);
                                    }
                                    else {
                                        setChecked(true);
                                    }
                                },
                                beforeChange: function (changes, source) {
                                    const [[row, prop, oldVal, newVal]] = changes;
                                    if (type === "radio" && prop === "Row_Selection" && oldVal != newVal) {
                                        if (newVal) {
                                            let allrow = this.getSourceData().filter(x => x.Row_Selection == true);
                                            allrow.map((r, i) => {
                                                r.Row_Selection = false;
                                            })
                                        }
                                        this.setDataAtRowProp(row, this.propToCol("Row_Selection"), newVal);
                                    }
                                    else if (type === "radio" && prop === "Row_Selection" && oldVal) {
                                        this.setDataAtRowProp(row, this.propToCol("Row_Selection"), false);
                                    }

                                },
                                cells: function (row, col, prop) {
                                    var cellProperties = {};

                                    if (prop === 'Row_Selection') {
                                        cellProperties.className = 'htMiddle htCenter';
                                    }
                                    return cellProperties;
                                }

                            }
                        }
                    >

                    </HotTable>

                    <div id="MetaDataNoFilter" style={{ display: dataSource.length > 0 ? "none" : "block" }}>No data available</div>
                </Row>
                <Row style={{ width: "100%" }} >
                    {checkPermission(props.permissions,["self"]) >= 4 &&  <Button
                        style={{ float: "right" }}
                        type={"danger"}
                        onClick={DeleteRule}
                    >
                        {"Delete"}
                    </Button>}
                </Row>
            </LayoutContentWrapper>

            <ConfirmModal title="Delete Mapping Rule(s)" SubmitButtonName="Delete" onSubmit={DeleteBulk} visible={showDeleteModal} handleCancel={() => { setShowDeleteModal(false) }} />
        </>
    );
}

