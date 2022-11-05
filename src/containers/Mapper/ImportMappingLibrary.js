import React, { Component, useEffect, useRef, useState } from 'react';
import { Modal, Button, Row, Checkbox } from 'antd';
import 'handsontable/dist/handsontable.full.css';
import { HotTable } from '@handsontable/react';
import { errorModal, hideProgress } from '../Utility/sharedUtility';
import { lib } from 'crypto-js';
import { ImpactValidation } from './blockValidation';
import { SOURCE_DATASET } from '../Utility/commonUtils';

let loop_contrl = "";
export default function ImportFromLibrary(props) {
    let Ref_Table = useRef();

    const { ShowAll, libRecord, contentTabOpen, importLib_State } = props;
    let [record, setRecord] = useState(libRecord);

    //if sow all is checkbox means table multiple select
    //else single select
    let type = ShowAll ? "checkbox" : "radio";

    let [isChecked, setChecked] = useState(false);

    useEffect(() => {
        //when reload initialise filter
        if (importLib_State === "reLoading") {
            Ref_Table.current.hotInstance.updateSettings({
                filters: false
            });
        }
        if (importLib_State === "loaded") {
            Ref_Table.current.hotInstance.updateSettings({
                filters: true
            })
        }
    });


    //For Checkbox in Table
    let getHTML = (ShowAll) => {
        if (ShowAll) {
            let checkbox = "<input type='checkbox' class='checker parentimportcheckbox' ";
            checkbox += isChecked ? 'checked="checked"' : '';
            checkbox += ">";
            return checkbox;
        }
        else {
            return "Check";
        }
    }
    //Columns
    const Columns = [
        {
            title: getHTML(ShowAll),
            type: 'checkbox',
            data: "Row_Selection",
            readOnly: false,
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

    //Select All Record
    //when parent checkbox clicked
    const SelectAllRecord = (event, coords) => {

        let check = !isChecked;
        let instance = Ref_Table.current.hotInstance;

        //when filter scenario
        //if click select all select only filter record
        let filteredRecord = instance.getPlugin('trimRows').rowsMapper._arrayMap.map(r => instance.getSourceDataAtRow(r));
        //if actual record is 10 but when filter output is 0 means we need to know, is the table is in filter stage or not
        let isFiltered = Ref_Table.current.hotInstance.getPlugin('trimRows').trimmedRows;
        //due to filter -> if no record , checkbox to false 
        check = (isFiltered.length > 0 && filteredRecord.length === 0) ? false : check;

        const totalRows = filteredRecord.length > 0 ? filteredRecord.length : libRecord.length;
        //FIlter End

        for (let index = 0; index < totalRows; index++) {
            let allData = instance.getSourceData();
            let physicalRow = instance.toPhysicalRow(index);
            //physicalRow will be null if fildered data is null
            allData[physicalRow ? physicalRow : index][0] = check ? true : false;
            allData[physicalRow ? physicalRow : index].Row_Selection = check ? true : false;
        }

        instance.render();
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
                    //match the name and update the id 
                    lr.cdiscDataStdVariableMetadataID = isVariableAval.cdiscDataStdVariableMetadataID;
                    console.log(lr)
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

    //Import selected rules
    let Import = () =>
    {
        let { Standards, SourceDataset } = props;

        //filter only selected record
        let selected_records = libRecord.filter(rec => rec.Row_Selection);

        if (selected_records.length > 0) {
            //check selected mapping rule target is available in current study??
            let isTargetAval = ShowAll ? checkIsTargetAval(selected_records) : { err: false };
    
            if (!isTargetAval.err) {
                //validation 
                im_validation(selected_records);
                //Is Target already exist
                let isTarExistAlready = ShowAll ? checkisTarExistAlready(selected_records) : { err: false };
                if (!isTarExistAlready.err)
                {
                    //ncicodelist validation
                    new Promise((resolve, reject) =>
                    {
                        let impact_validation = new ImpactValidation(Standards, SourceDataset);

                        impact_validation.selected_records = selected_records;
                        impact_validation.resolve = resolve;
                        impact_validation.Standards = Standards;
                        impact_validation.reject = reject;
                        impact_validation.selected_records = selected_records;
                        impact_validation.ImpactNCICodeListValidation();
                    
                    }).then(() =>
                    {
                        props.import(ShowAll ? selected_records : selected_records[0]);
                        if (!ShowAll) {
                            //for single select
                            //refreshSelctedRec
                            let refreshSelctedRec = Ref_Table.current.hotInstance.getSourceData().find(r => r.Row_Selection);
                            refreshSelctedRec.Row_Selection = false;
                        }

                    }).catch(() =>
                    {
                        hideProgress();
                    })
                    
                }
                else {
                    errorModal(isTarExistAlready.emsg);
                }
            }
            else {
                errorModal(isTargetAval.emsg);
            }

            
            
        }
        else {
            errorModal("Select Atleast one record");
        }
    }

    let im_validation = (sel_librules) => {
        let { Standards, SourceDataset, MappingList } = props;
        try {
            sel_librules.map((rule) => {
                let xml = new DOMParser().parseFromString(rule.constructJson, "application/xml");

                //is no_impact false ? there is impact : no impact 
                let impact = new ImpactValidation(Standards, SourceDataset, xml, rule);
                impact.MappingList = MappingList;
                impact.IsMappedSourceAvaliable();
                impact.ValidationOfAllBlocksUsed();
                
                //if imapct is there
                if (impact.impacted) {
                    rule.constructJson = new XMLSerializer().serializeToString(impact.xml);
                    rule.impact = 1;
                }
                else
                {
                    rule.constructJson = new XMLSerializer().serializeToString(impact.xml);
                }
            });
        }
        catch (e) {

        }
    }
    return (<>
        <Row>
            <HotTable
                id="ImportFromMappingLibrary"
                className={"MetaDataAnnotation_Table_TD"}
                height={libRecord.length > 0 ? (contentTabOpen ? "calc(100vh - 249px)" : "calc(100vh - 205px)") : "0px"}
                licenseKey="non-commercial-and-evaluation"
                viewportRowRenderingOffsetnumber={10}
                ref={Ref_Table}
                settings=
                {
                    {
                        wordWrap: true,
                        stretchH: 'all',
                        data: libRecord,
                        columns: Columns,
                        editable: false,
                        readOnly: true,
                        filters: true,
                        dropdownMenu: ['filter_by_condition', 'filter_by_value', 'filter_action_bar'],
                        afterFilter: function (col, TH)
                        {
                            //reset checkbox when filter
                            setChecked(false);
                            this.getSourceData().map(x => { x[0] = false; x.Row_Selection = false });
                            this.render();
                        },
                        afterGetColHeader: function (col, TH)
                        {
                            //Remove sorting button for Checkbox column
                            if (col === 0)
                            {
                                const button = TH.children[0].children[0];
                                button.parentNode.removeChild(button);
                            }
                        },
                        afterOnCellMouseUp: function (e, coords, td)
                        {
                            e.preventDefault();
                            if (e.realTarget.classList.contains('checker'))
                            {
                                //when parent checkbox clicked
                                SelectAllRecord(e, coords);
                            }
                        },
                        afterChange: function ()
                        {
                            let rec = this.getPlugin('trimRows').rowsMapper._arrayMap.map(r => this.getSourceDataAtRow(r));
                            if (rec.some(x => !x.Row_Selection))
                            {
                                setChecked(false);
                            }
                            else
                            {
                                rec.length > 0 && setChecked(true);
                            }
                        },
                        beforeChange: function (changes, source)
                        {
                            const [[row, prop, oldVal, newVal]] = changes;
                            if (type === "radio" && prop === "Row_Selection" && oldVal != newVal) {
                                if (newVal)
                                {
                                    let allrow = this.getSourceData().filter(x => x.Row_Selection == true);
                                    allrow.map((r, i) =>
                                    {
                                        r.Row_Selection = false;
                                    });
                                }
                                let physicalRow = this.toPhysicalRow(row);
                                this.getSourceData()[physicalRow].Row_Selection = newVal;
                                this.render();
                            }
                        },
                        cells: function (row, col, prop)
                        {
                            var cellProperties = {};

                            if (prop === 'Row_Selection') {
                                cellProperties.className = 'htMiddle htCenter';
                            }
                            return cellProperties;
                        }
                    }
                }
            />
            <div id="MetaDataNoFilter" style={{ display: libRecord.length > 0 ? "none" : "block" }}>No data available</div>
        </Row>
        <Row >
            <Button
                type="danger"
                onClick={() => props.cancel()}
            >
                {"Cancel"}
            </Button>
            <Button
                style={{ float: "right" }}
                onClick={Import}
                type={"primary"}
            >
                <i className="fas fa-file-import" style={{ paddingRight: 2 }}> Copy Rule</i>
            </Button>
        </Row>
    </>
    );
}

