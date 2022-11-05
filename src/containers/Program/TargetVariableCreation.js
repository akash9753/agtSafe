import React, { createRef } from 'react';
import {  Modal, Button, Row, Col, Select, Empty } from 'antd';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import { MappingDatas } from '../TreeView/getMappingDatas';
import { errorModal } from '../Utility/sharedUtility';

let Option = Select.Option;
let thisObj = {};

export default class TargetVariableCreation extends React.Component {
    constructor(props) {
        super(props);
        this.state =
        {
            visible: false,
            currentstep: 0,
            sel_variable: [],
            sel_DomainID: -1,
            sel_DomainName: "",
            isChecked: false,
            secTable_Record: [],
            frstTable_Record: [],
            target_DomainOption: []
        }

        //create ref to access the table 1
        this.FirstTableComp = createRef();
        //create ref to access the table 2 
        this.SecTableComp = createRef();
        thisObj = this;
    }

    static getDerivedStateFromProps(new_props, curr_state) {
        if (new_props.visible && !curr_state.visible) {
            //Filter the Target Domain/Dataset
            let target_DomainOption = thisObj.targetDomainFilter();
            //Initialise value 
            return {
                currentstep: 0,
                secTable_Record: [],
                frstTable_Record: [],
                visible: new_props.visible,
                target_DomainOption: target_DomainOption
            }
        }
        return null;
    }

    //Filter domains/datasets that have not been mapped
    //For Std/Target Domain/Dataset Dropdown
    targetDomainFilter = () => {
        let tar_domainOpt = [];
        let { Standards, MappingList } = MappingDatas;
        let { Domain } = Standards;

        if (Domain && typeof Domain === "object") {
            //Filter domains/datasets that have not been mapped
            MappingList = MappingList && typeof MappingList === "object" ? MappingList : [];
            for (var i = 0; i < Domain.length; i++) {
                let dm = Domain[i];
                if (!MappingList.some(ml => ml.cdiscDataStdDomainMetadataID === dm.cdiscDataStdDomainMetadataID)) {
                    tar_domainOpt.push(<Option key={dm.cdiscDataStdDomainMetadataID} value={dm.cdiscDataStdDomainMetadataID}>{dm.domain}</Option>);
                }
            }
        }
        return tar_domainOpt;
    }

    //Table 1
    //Checkbox HTML 
    getHTML = () => {
        let { isChecked } = this.state;
        let checkbox = "<input type='checkbox' class='checker parentimportcheckbox' ";
        checkbox += isChecked ? 'checked="checked"' : '';
        checkbox += ">";
        return checkbox;
    }

    //Table 1
    //Check Parent Checkbox
    checkParenetCheckBox = (check) => {
        this.setState({ isChecked: check });
    }

    //Table 1
    //Select All Record,when parent checkbox clicked
    SelectAllRecord = () => {
        try {
            let { isChecked, frstTable_Record } = this.state;

            let check = !isChecked;
            let instance = this.FirstTableComp.current.hotInstance;

            const totalRows = frstTable_Record.length;
            //Filter End

            for (let index = 0; index < totalRows; index++) {
                let allData = instance.getSourceData()
                allData[index][0] = check ? true : false;
                allData[index].Row_Selection = check ? true : false;
            }
            instance.render();
            this.checkParenetCheckBox(check);
        }
        catch (e) {
            //console.log(e);
        }
    }

    //Filter variables by selected domain
    tar_DomainOnChange = (cdiscDataStdDomainMetadataID) =>
    {
        try {
            let { Standards } = MappingDatas;
            let { Domain, Variable } = Standards;

            //filter dataset/domain object for selected domain
            let sel_domain = (Domain || []).find((dm) => dm.cdiscDataStdDomainMetadataID === cdiscDataStdDomainMetadataID);
            sel_domain = sel_domain && typeof sel_domain === "object" ? sel_domain : {};

            let variable = Variable.filter(va => {
                if (va.cdiscDataStdDomainMetadataID === cdiscDataStdDomainMetadataID) {
                    //Initialise checkbox here
                    va.Row_Selection = false;
                    return va;
                }
            });

            //Clear Table 2
            //Table 2 instance
            let t2_instance = this.SecTableComp.current.hotInstance;
            t2_instance.clear();
            t2_instance.loadData([]);
            t2_instance.getPlugin('Filters').clearConditions();
            t2_instance.getPlugin('Filters').filter();
            t2_instance.render();
            //End of table 2 clear


            thisObj.setState({
                isChecked: false,
                secTable_Record: [],
                frstTable_Record: variable,
                sel_DomainName: sel_domain.domain,
                sel_DomainID: cdiscDataStdDomainMetadataID
            });
        }
        catch(e){
            console.log(e);
        }
    }

    //When Click Prev button
    prev = () => {
        //Go to previous step
        this.setState((prevState) => ({ currentstep: prevState.currentstep - 1 }));
    };

    //When Click Next button
    next = () => {
        try
        {
            //Table Instance
            let instance = this.FirstTableComp.current.hotInstance;
            console.log(this)
            let t_Record = instance.getSourceData();
            let sel_record = t_Record.filter(tr => tr.Row_Selection);
            if (sel_record && sel_record.length > 0) {
                thisObj.setState((prevState) => ({ currentstep: prevState.currentstep + 1, sel_variable: sel_record }),
                    () => {
                        //For second step 
                        //Add one row when go to next step at first time,if record selected
                        let { SecTableComp } = this;

                        //Table 2 instance
                        let t_instance = SecTableComp.current.hotInstance
                        let t_Record = t_instance.getSourceData();
                        t_Record.length === 0 && sel_record.length > 0 && thisObj.addRow();
                        t_instance.scrollViewportTo(0, 0);
                    });
            }
            else
            {
                thisObj.setState((prevState) => ({ secTable_Record:[] }),
                    () => {
                        errorModal("Please select variables.");
                    });
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    //Table2
    //Add Row for step 2
    addRow = () => {
        try {
            let { SecTableComp } = this;
            let { secTable_Record } = this.state;
            let t_instance = SecTableComp.current.hotInstance;
            t_instance.alter('insert_row', secTable_Record.length);
            t_instance.render();
        }
        catch (e) {
            //console.log(e)
        }
    }

    //Table 2
    //Form column by selected variable record
    form_Column = () => {
        let { sel_variable } = this.state;
        let { SecTableComp } = this;
        let t_instance = SecTableComp.current && SecTableComp.current.hotInstance;

        let col = [];
        (sel_variable || []).filter(va => {
            col.push({
                title: va.variableName,
                data: va.variableName,
                type: this.findDatatype(va),
                classname: "htCenter htMiddle"
            })
        });
        t_instance && t_instance.render();
        return col;
    }

    //Table 2
    //Find data type of the column.
    findDatatype = (variable) => {
        let type = variable["dataTypeText"];
        switch (type) {
            case "Char":
            case "char":
                return "text";
            case "Num":
            case "num":
                return "numeric";
            default:
                return "text";
        }
    }

    //Set modal title
    setTitle = () => {
        let { sel_DomainName, currentstep } = this.state;
        return (sel_DomainName && sel_DomainName !== "" && currentstep === 1) ? "Create Target Dataset - " + sel_DomainName : "Create Target Dataset";
    }

    //Modal Cancel
    //Go back to program page
    cancel = () => {
        this.setState({ visible: false, sel_DomainID: -1 }, () => this.props.cancel())
    }

    //Create
    create = () =>
    {
        let { secTable_Record, sel_DomainID, sel_DomainName } = this.state;

        //filter only variable which is not empty/null
        let variables = [];
        (secTable_Record && typeof secTable_Record === "object") &&
            secTable_Record.map(va_obj =>
            {

                let vari = Object.keys(va_obj);
                //filter variable's which have valid values and not null/undefined/""
                let v_obj = {};
                (vari || []).map((va_name) => {

                    if (va_obj[va_name] && va_obj[va_name] != "")
                    {
                        v_obj[va_name] = va_obj[va_name];
                    }
                });
                //Push the obj if the object have valid values
                Object.keys(v_obj).length > 0 && variables.push(v_obj);
            });
        console.log(variables);
        if (variables.length > 0) {
            console.log(sel_DomainName);
            console.log(sel_DomainID);
            console.log(variables);
        }
        else {
            errorModal("No data available!");
        }
    }

    render()
    {
        let { visible } = this.props;
        let {
            isChecked,
            sel_variable,
            currentstep,
            sel_DomainID,
            frstTable_Record,
            secTable_Record,
            target_DomainOption
        } = this.state;

        //Table1 Columns 
        const Frst_Columns = [
            {
                title: this.getHTML(),
                type: 'checkbox',
                data: "Row_Selection",
                readOnly: false,
                classname: "htCenter htMiddle"
            },
            {
                title: "Variable Name",
                data: "variableName",
                classname: "htCenter htMiddle"
            },
            {
                title: "Variable Label",
                data: "variableLabel"
            },
            {
                title: "Role",
                data: "roleText"
            },
            {
                title: "Cole",
                data: "coreText"
            },
            {
                title: "Data Type",
                data: "dataTypeText"
            },
            {
                title: "Format",
                data: "format"
            }];

        //Table 2 Column 
        let Sec_Column = this.form_Column();

        return <Modal
              
            visible={visible}
            maskClosable={false}
            width="100%"
            title={this.setTitle()}
            style={{ top: 20, padding: 10 }}
            onCancel={() => this.cancel()}
            footer={[
                <Button
                    key="back"
                    name="PopupCancel"
                    className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger'
                    style={{ float: 'left' }}
                    onClick={this.cancel}
                >
                    Cancel
                </Button>,
                (currentstep === 1 &&
                    sel_variable.length > 0) &&
                <Button key="Create"
                    name="Edit"
                    className='ant-btn ant-btn-primary tar_var_create'
                    onClick={this.addRow}>
                    Add Row
                </Button>,
                currentstep === 1 &&
                <Button key="Prev"
                    name="Prev"
                    className='ant-btn ant-btn-primary'
                    onClick={this.prev}
                >
                    Previous
                </Button>,
                <Button
                    key="submit"
                    name="PopupSave"
                    className='ant-btn sc-ifAKCX fcfmNQ ant-btn-primary saveBtn' onClick={currentstep === 0 ? this.next : this.create}>
                    {currentstep === 0 ? "Next" : "Ok"}
                </Button>]}
        >
            <Row style={{ display: currentstep === 0 ? "block" : "none" }}>
                {/*Target Drop down*/}
                <Col md={12} sm={24} xs={24} style={{ paddingBottom: 5, textAlign: "left" }}>
                    <label className="Tar_Domain_Select_Label">Target Domain:</label>
                        <Select
                            style={{ width: "50%" }}
                            showSearch
                            placeholder="Select Domain"
                            key={"TargetDomain"}
                            filterOption={(input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            value={sel_DomainID}
                            onChange={this.tar_DomainOnChange}
                        >
                            <Option key={-1} value={-1}>--Select--</Option>
                            {target_DomainOption}
                        </Select>
                </Col>
                {/*TABLE1*/}
                <Col md={24} sm={24} xs={24} style={{ padding: 0 }}>
                    <HotTable
                        id="AlterStd_Table"
                        className={"MetaDataAnnotation_Table_TD"}
                        height={frstTable_Record.length > 0 ? "calc(100vh - 216px)" : "0px"}
                        licenseKey="non-commercial-and-evaluation"
                        viewportRowRenderingOffsetnumber={210}
                        ref={this.FirstTableComp}
                        settings=
                        {
                            {
                                wordWrap: true,
                                stretchH: 'all',
                                data: frstTable_Record,
                                columns: Frst_Columns,
                                editable: false,
                                readOnly: true,
                                afterOnCellMouseUp: function (e, coords, td) {
                                    e.preventDefault();
                                    if (e.realTarget.classList.contains('checker')) {
                                        //when parent checkbox clicked
                                        thisObj.SelectAllRecord(e, coords);
                                    }
                                },
                                afterChange: function () {
                                    let rec = this.getSourceData();
                                    //uncheck parent checkbox,if anychild is not checked
                                    if (rec.some(x => !x.Row_Selection))
                                    {
                                        //let t2_instance = thisObj.SecTableComp.current.hotInstance
                                        //t2_instance.getPlugin('Filters').clearConditions();
                                        //t2_instance.getPlugin('Filters').filter();
                                        isChecked &&
                                            thisObj.checkParenetCheckBox(false);
                                    }
                                    else {
                                        rec.length > 0 && !isChecked && thisObj.checkParenetCheckBox(true);
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
                    />
                    <Empty style={{ display: frstTable_Record.length > 0 ? "none" : "block" }} />
                </Col>
            </Row>

            {/*TABLE2*/}
            <Row style={{ display: currentstep === 1 ? "block" : "none" }}>
                <HotTable
                    id="AlterStdVariable_Table"
                    className={"AlterVariable_Table_TD"}
                    height={Sec_Column.length > 0 ? "calc(100vh - 179px)" : "0px"}
                    licenseKey="non-commercial-and-evaluation"
                    viewportRowRenderingOffsetnumber={10}
                    ref={this.SecTableComp}
                    settings=
                    {
                        {
                            filters: true,
                            stretchH: 'all',
                            wordWrap: true,
                            editable: false,
                            readOnly: false,
                            rowHeaders: true,
                            columns: Sec_Column,
                            autoColumnSize: true,
                            contextMenu: true,
                            allowRemoveRow: true,
                            copyPaste: true,
                            data: secTable_Record,
                            dropdownMenu: ['filter_by_condition', 'filter_by_value', 'filter_action_bar'],
                        }
                    }
                />
                <Empty style={{ display: Sec_Column.length > 0 ? "none" : "block" }} />
            </Row>
        </Modal>
    }
}
