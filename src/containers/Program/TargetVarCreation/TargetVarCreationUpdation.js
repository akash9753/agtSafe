import React, { createRef } from 'react';
import { Modal, Button, Row, Col, Select, Empty, Divider, message } from 'antd';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import { MappingDatas } from '../../TreeView/getMappingDatas';
import { errorModal, successModal, showProgress, hideProgress, CallServerPost, successModalCallback, isNullishObject } from '../../Utility/sharedUtility';

let Option = Select.Option;
let thisObj = {};
export default class TargetVarCreationUpdation extends React.Component {
    constructor(props) {
        super(props);
        this.state =
        {
            data: [],
            tar_Domain: "",
            tar_Variables: [],
            sel_cdiscDataStdDomainMetadataID: -1,
            datasetData: [],
            canceling: false,
            isEdit: false
        }


        this.TableRef = createRef();
        thisObj = this;
    }


    static getDerivedStateFromProps(new_props, curr_state) {
        if (new_props.stepNo == 1) {
            if (new_props.tar_Domain != curr_state.tar_Domain) {
                //Initialize Table 
                //Whenever selcted Domain has changed , table needs to be refreshed
                thisObj.tableClear();
                //END
                if (new_props.isEdit) {
                    thisObj.getData(new_props.tar_Domain);
                    return {
                        data: [],
                        tar_Domain: "",
                        canceling: false,
                        tar_Variables: [],
                        sel_cdiscDataStdDomainMetadataID: -1,
                        isEdit: new_props.isEdit
                    };
                }
                thisObj.setState({
                    data: [],
                    tar_Domain: new_props.tar_Domain,
                    tar_Variables: new_props.tar_Variables,
                    sel_cdiscDataStdDomainMetadataID: new_props.cdiscDataStdDomainMetadataID,
                    isEdit: new_props.isEdit
                }, () => {
                    thisObj.addRow();
                    //Update scroll to the initial position
                    let T_Insatnce = thisObj.TableRef.current.hotInstance;
                    T_Insatnce.scrollViewportTo(0, 0);
                });
            }
            else if (new_props.tar_Variables.length != curr_state.tar_Variables.length) {
                //Whenever any variable is unchecked , the filter needs to be updated since the table could be filtered by an unchecked column
                thisObj.tableFilterClear();
            }
        } else if (new_props.canceling && !curr_state.canceling) {
            //Initialize Table 
            //Whenever click cancel,table needs to be refreshed
            thisObj.tableClear();
            //END

            return {
                data: [],
                tar_Domain: "",
                canceling: true,
                tar_Variables: [],
                sel_cdiscDataStdDomainMetadataID: -1,
                isEdit: new_props.isEdit
            }
        }
    }

    getData = () => {

        showProgress();
        var values = {
            Domain: this.props.tar_Domain,
            StudyID: JSON.parse(sessionStorage.getItem("studyDetails")).studyID
        };
        CallServerPost('MappingOperations/GetDirectTarget', values)
            .then(
                function (response) {
                    hideProgress();
                    if (response.status == 1) {
                       
                        thisObj.setState({
                            data: [...response.value],
                            datasetData: JSON.stringify(response.value),
                            tar_Domain: thisObj.props.tar_Domain
                        });
                    } else {
                        errorModal(response.message);
                    }
                });
    }

    //Table clear and update to initiale stage
    tableClear = () => {
        try {
            //Initialize value 
            //Whenever selcted Domain has changed , table needs to be refreshed
            if (thisObj.TableRef.current) {
                let T_Insatnce = thisObj.TableRef.current.hotInstance;
                let record = T_Insatnce.getSourceData();
                record.length > 0 && T_Insatnce.alter('remove_row', 0, record.length);
                T_Insatnce.getPlugin('Filters').clearConditions();
                T_Insatnce.getPlugin('Filters').filter();
                T_Insatnce.scrollViewportTo(0, 0);
            }
            //END of table update
        }
        catch (e) {
            console.log(e);
        }
    }

    //Table clear and update to initiale stage
    tableFilterClear = () => {
        try {
            let T_Insatnce = thisObj.TableRef.current.hotInstance;
            T_Insatnce.getPlugin('Filters').clearConditions();
            T_Insatnce.getPlugin('Filters').filter();
            T_Insatnce.render();
        }
        catch (e) {
            console.log(e);
        }
    }

    //When Click Prev button
    prev = () => {
        //Go to previous step
        this.props.prev();
    };


    //Add Row 
    addRow = () => {
        try {
            this.tableFilterClear();
            let { TableRef } = this;
            let { data } = this.state;
            let t_instance = TableRef.current.hotInstance;
            t_instance.alter('insert_row', data.length);

            t_instance.render();
            this.setState({ data: t_instance.getSourceData() })
        }
        catch (e) {
            //console.log(e)
        }
    }

    //Form column by selected variable record
    form_Column = () => {
        let { tar_Variables } = this.props;
        let { TableRef } = this;
        let t_instance = TableRef.current && TableRef.current.hotInstance;

        let col = [];
        (tar_Variables || []).filter(va => {
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

    form_edit_column = () => {
        let { data } = this.state;
        let { readOnly } = this.props;
        if (data.length == 0) return [];
        let Frst_Columns = [];


        Object.keys(data[0]).map(colname => {
            if (colname.toUpperCase() !== "ROW_NUM") {
                Frst_Columns.push({
                    title: colname ? colname.toUpperCase() : "Col",
                    data: colname,
                    readOnly: readOnly,
                    classname: "htCenter htMiddle"
                })
            }
        });
        return Frst_Columns;
    }

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


    //Modal Cancel
    //Go back to program page
    cancel = () => {
        this.props.cancel();
    }

    //Create
    create = () => {
        let { datasetData, tar_Domain, sel_cdiscDataStdDomainMetadataID } = this.state;

        let T_Insatnce = thisObj.TableRef.current.hotInstance;
        let record = T_Insatnce.getSourceData();

        //filter only variable which is not empty/null
        let variables = [];
        (record && typeof record === "object") &&
            record.map(va_obj => {

                let vari = Object.keys(va_obj);
                //filter variable's which have valid values and not null/undefined/""
                let v_obj = {};
                (vari || []).map((va_name) => {

                    if (va_obj[va_name] && va_obj[va_name] != "") {
                        v_obj[va_name] = va_obj[va_name];
                    }
                });
                //Push the obj if the object have valid values
                Object.keys(v_obj).length > 0 && variables.push(v_obj);
            });
        if (variables.length > 0) {

            if (JSON.stringify(variables) == datasetData) {
                message.destroy();
                message.error("No changes to update!");
                return;
            }
            var values = {
                Domain: tar_Domain,
                cdiscDataStdDomainMetadataID: sel_cdiscDataStdDomainMetadataID,
                data: variables,
                StudyID: JSON.parse(sessionStorage.getItem("studyDetails")).studyID,
                UpdatedBy: JSON.parse(sessionStorage.userProfile).userID
            };

            showProgress();
            CallServerPost('MappingOperations/CreateTarget', values)
                .then(
                    function (response) {
                        if (response.status == 1) {
                            hideProgress();
                            if (thisObj.state.isEdit) {
                                successModalCallback("Dataset Updated Successfully.",thisObj.getData);
                                
                            } else {
                                successModalCallback("Dataset Created Successfully.", () => { thisObj.props.cancel(true) });
                            }
                        } else {
                            hideProgress();
                            errorModal(response.message);
                        }
                    });
        }
        else {
            hideProgress();
            errorModal("No data available!");
        }
    }

    resetData = () => {
        try {
            let { datasetData } = this.state;
           
            this.setState({
                data: JSON.parse(datasetData)
            });
        }
        catch (e) {
            //console.log(e)
        }
        

    }

    render() {
        let {
            data
        } = this.state;
        const { readOnly } = this.props;
        //Table 2 Column 
        let Sec_Column = this.state.isEdit ? this.form_edit_column() : this.form_Column();
        const hght = this.state.isEdit ? "calc(100vh - 220px)" : "calc(100vh - 175px)";
        return <>
            <Row >
                <HotTable
                    id="AlterStdVariable_Table"
                    className={"AlterVariable_Table_TD"}
                    height={Sec_Column.length > 0 ? hght : "0px"}
                    licenseKey="non-commercial-and-evaluation"
                    viewportRowRenderingOffsetnumber={10}
                    ref={this.TableRef}
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
                            data: data,
                            dropdownMenu: ['filter_by_condition', 'filter_by_value', 'filter_action_bar'],
                        }
                    }
                />
                <Empty style={{ display: Sec_Column.length > 0 ? "none" : "block" }} />
            </Row>
            <Divider style={{ margin: "5px 0px 10px 0px" }} />
            <Row >
                {
                    !this.state.isEdit &&
                    <Button
                        key="back"
                        name="PopupCancel"
                        style={{ float: 'left' }}
                        onClick={this.cancel}
                        className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger'
                    >
                        Cancel
                    </Button>
                }
                {!readOnly &&
                    <Button
                        key="submit"
                        name="PopupSave"
                        style={{ float: 'right', marginLeft: 5 }}
                        onClick={this.create}
                        className='ant-btn sc-ifAKCX fcfmNQ ant-btn-primary saveBtn'
                    >
                        {this.state.isEdit ? "Update" : "Create"}
                    </Button>
                }
                {
                    this.state.isEdit && !readOnly &&
                    <Button key="reset"
                        name="reset"
                        style={{ float: 'right', marginLeft: 5 }}
                        className='ant-btn ant-btn-primary'
                        onClick={this.resetData}
                    >
                        Reset
                    </Button>
                }
                {
                    !this.state.isEdit &&
                    <Button key="Prev"
                        name="Prev"
                        style={{ float: 'right', marginLeft: 5 }}
                        className='ant-btn ant-btn-primary'
                        onClick={this.prev}
                    >
                        Previous
                    </Button>
                }
                {
                    !readOnly &&
                    <Button
                        key="addrow"
                        name="addrow"
                        style={{ float: 'right' }}
                        className='ant-btn ant-btn-primary tar_var_create'
                        onClick={this.addRow}>
                        Add Row
                    </Button>
                }
            </Row>
        </>
    }
}
