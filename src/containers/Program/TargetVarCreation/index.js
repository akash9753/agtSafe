import React, { createRef } from 'react';
import { Modal, Button, Row, Col, Select, Empty, Divider } from 'antd';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import { MappingDatas } from '../../TreeView/getMappingDatas';
import { errorModal, strLowerCase } from '../../Utility/sharedUtility';
import TargetVarCreationUpdation from './TargetVarCreationUpdation';

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
            frstTable_Record: [],
            target_DomainOption: [],
            canceling: false
        }

        //create ref to access the table 1
        this.FirstTableComp = createRef();

        thisObj = this;
    }

    static getDerivedStateFromProps(new_props, curr_state)
    {
        try
        {
            if (new_props.visible && !curr_state.visible)
            {
                //Filter the Target Domain/Dataset
                let target_DomainOption = thisObj.targetDomainFilter();
                //Initialise value 
                return {
                    currentstep: 0,
                    canceling: false,
                    frstTable_Record: [],
                    visible: new_props.visible,
                    target_DomainOption: target_DomainOption
                }
            }
            return null;
        }
        catch (e)
        {
            return null;
        }
    }

    //Filter domains/datasets that have not been mapped
    //For Std/Target Domain/Dataset Dropdown
    targetDomainFilter = () =>
    {
        try
        {
            let tar_domainOpt = [];

            let { tar_ds } = this.props;
            let { Standards, MappingList } = MappingDatas;
            let { Domain } = Standards;

            if (Domain && typeof Domain === "object")
            {
                //Filter domains/datasets that have not been mapped
                MappingList = MappingList && typeof MappingList === "object" ? MappingList : [];
                for (var i = 0; i < Domain.length; i++)
                {
                    let dm = Domain[i];
                    if (!(tar_ds || []).some(tds => strLowerCase(tds.Key) === strLowerCase(dm.domain)) && !strLowerCase(dm.domain).includes('_int'))
                    {
                        tar_domainOpt.push(<Option key={dm.cdiscDataStdDomainMetadataID} value={dm.cdiscDataStdDomainMetadataID}>{dm.domain}</Option>);
                    }
                }
            }
            return tar_domainOpt;
        }
        catch (e)
        {
            return [];
        }
    }

    //Checkbox HTML 
    getHTML = () => {
        let { isChecked } = this.state;
        let checkbox = "<input type='checkbox' class='checker parentimportcheckbox' ";
        checkbox += isChecked ? 'checked="checked"' : '';
        checkbox += ">";
        return checkbox;
    }

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
    tar_DomainOnChange = (cdiscDataStdDomainMetadataID) => {
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

            thisObj.setState({
                isChecked: false,
                frstTable_Record: variable,
                sel_DomainName: sel_domain.domain,
                sel_DomainID: cdiscDataStdDomainMetadataID
            });
        }
        catch (e) {
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
        try {
            //Table Instance
            let instance = this.FirstTableComp.current.hotInstance;
            let t_Record = instance.getSourceData();
            let sel_record = t_Record.filter(tr => tr.Row_Selection);
            if (sel_record && sel_record.length > 0) {
                thisObj.setState((prevState) => ({ currentstep: prevState.currentstep + 1, sel_variable: sel_record }));
            }
            else {
                
                if (this.state.sel_DomainName == "") {
                    errorModal("Please select Target Domain");
                }
                else {
                    errorModal("Please select Target Variable(s)");
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    //Set modal title
    setTitle = () => {
        let { sel_DomainName, currentstep } = this.state;
        return (sel_DomainName && sel_DomainName !== "" && currentstep === 1) ? "Create Target Dataset - " + sel_DomainName : "Create Target Dataset";
    }

    //Modal Cancel
    //Go back to program page
    cancel = (refresh = false) => {
        this.setState({ canceling: true }, () => {
            this.setState({ visible: false, sel_DomainID: -1 }, () => this.props.cancel(refresh)
            )
        });
    }



    render() {
        let { visible } = this.props;
        let {
            isChecked,
            canceling,
            currentstep,
            sel_DomainID,
            sel_variable,
            sel_DomainName,
            frstTable_Record,
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

        return <Modal

            visible={visible}
            maskClosable={false}
            width="100%"
            title={this.setTitle()}
            style={{ top: 20, padding: 10 }}
            onCancel={() => this.cancel()}
            footer={null}
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
                        height={frstTable_Record.length > 0 ? "calc(100vh - 211px)" : "0px"}
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
                                    if (rec.some(x => !x.Row_Selection)) {
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
                <TargetVarCreationUpdation
                    prev={this.prev}
                    stepNo={currentstep}
                    cancel={this.cancel}
                    canceling={canceling}
                    tar_Domain={sel_DomainName}
                    tar_Variables={sel_variable}
                    cdiscDataStdDomainMetadataID={sel_DomainID}
                    isEdit={false}
                />
            </Row>
            <Row style={{ display: currentstep === 0 ? "block" : "none" }}>
                <Divider style={{ margin: "5px 0px 10px 0px" }} />
                <Button
                    key="back"
                    name="PopupCancel"
                    className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger'
                    onClick={this.cancel}
                >
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    name="PopupSave"
                    onClick={this.next}
                    style={{ float: 'right' }}
                    className='ant-btn sc-ifAKCX fcfmNQ ant-btn-primary saveBtn'
                >
                    Next
                </Button>
            </Row>
        </Modal>
    }
}
