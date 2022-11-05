import React, { Component } from 'react';
import 'handsontable/dist/handsontable.full.css';
import { rowStyle } from '../../../styles/JsStyles/CommonStyles';
import {
    Row,
    Col,
    Form,
    Modal,
    Button,
    Select,
    TreeSelect
} from 'antd';
import { ANNOTATION, METADATA_ANNOT } from '../../Utility/appConstants';
import { showProgress, hideProgress, CallServerPost, isNotNull } from "../../Utility/sharedUtility";
import { Steps, Popover } from 'antd';
import { MetaDatasetPageField, ColumnField } from "./MetaDataConfigPageField";

const { Step } = Steps;

//CSS
const FormItem = Form.Item;
const { Option } = Select;
const customDot = (dot,index,currstep) => (

        <>{dot}</>
);

let Step1_FieldsConfig =
{
    FieldProperties: "",
    DataDictionaries: "",
    UnitDictionaries: "",
};

let Step2_ColumnsConfig =
{
    FieldProperties: "",
    DataDictionaries: "",
    UnitDictionaries: "",
    FormName: "",
    FormOID: "",
    FieldOID: "",
    PreText: "",
    DataType: ""

};
class MetaDatasetConfiguration extends Component {
    constructor(props) {
        super(props);

        let update = props.action === "Details";
        this.state =
        {
            currentstep: 0,
            MetaDataColumns: [],
            pagefield: [...MetaDatasetPageField.map((fld) => fld.attributeName),
            ...ColumnField.map((fld) => fld.attributeName)]
        };
    }

    //Submit
    Submit = () => {
        this.props.form.validateFields([...MetaDatasetPageField.map((fld) => fld.attributeName),
        ...ColumnField.map((fld) => fld.attributeName)], { force: true }, (err, values) =>
        {
            if (!err)
            {
                let SrcDatasetText = this.getSrcDatasetText();
                this.props.setMetaDataset(values, SrcDatasetText)
            }
        });
    }

    //get MetaDataset Text
   
    getSrcDatasetText = () => {
        let { action, updateData } = this.props;
        let { FieldProperties, DataDictionaries, UnitDictionaries } = Step1_FieldsConfig;

        //Set value to field 
        if (action === "Details" &&
            (FieldProperties === "" ||
            DataDictionaries === "" ||
            UnitDictionaries === ""))
        {
            //get Database value 
            let getMetaDataset = (updateData || []).find((x) => x.configurationName === "MetaDataset");
            return getMetaDataset && typeof getMetaDataset === "object" ? getMetaDataset.configurationValue : "";
        }
        else
        {
            let metatxt = [];
            Object.keys(Step1_FieldsConfig).map((key,i) =>
            {
                if (Step1_FieldsConfig[key] && Step1_FieldsConfig[key] != "" && Step1_FieldsConfig[key])
                {
                    metatxt.push(Step1_FieldsConfig[key]);
                }
            })
            return metatxt.toString();
        }
    }

    //Step 1 Dropdown Onchange
    Step1_onChange = (path, value, node, id) =>
    {
        //reset second step

        this.props.form.resetFields([...ColumnField.map((fld) => fld.attributeName)]);
        Step1_FieldsConfig[id] = value;

    }

    //Step 2 Dropdown Onchange
    Step2_onChange = (path, value, node, id) => {

        Step2_ColumnsConfig[id] = value;
    }

   //Get Initial value
    //if action update ? show the updated value from db 
    // if action create ? show user updated value
    getInitialValue = (fieldName,UpdatedValue) =>
    {
        let { MetaDatasetConfig, updateData, action } = this.props;

        //get value
        let getValue = (fieldName) =>
        {
            let obj = updateData.find(va => va.configurationName === fieldName && va.activityText === ANNOTATION);
            return obj ? obj.configurationValue : "";
        }

        if (action === "Details")
        {
            let val = getValue(fieldName);
            return (!val || val === "") ? [] : val;
        }
        else
        {
          return MetaDatasetConfig[fieldName] !== "" ? MetaDatasetConfig[fieldName] :
          {};
        }
            
    }

    //moving to next step will come here
    getColumn = () =>
    {
        //Loader
        showProgress();
        const thisObj = this;
        this.props.form.validateFields(["FieldProperties", "DataDictionaries", "UnitDictionaries"],
        { force: true }, (err, values) =>
        {
            //console.log(values);

            if (!err)
            {
               
                CallServerPost('MetaData/GetColumnMetaData', values)
                    .then(function (response) {
                        //console.log(response);
                        if (response.status == 1) {

                            thisObj.setState({
                                MetaDataColumns: response.value.map(col => col["columN_NAME"])
                            })
                        }
                        hideProgress();
                    });
            }
        });
       
    }

    //get Column Option
    //when load filter option for corresponding select dropdown
    getColumnOption = (dropdownName) =>
    {
        let { getFieldsValue } = this.props.form;
        let { MetaDataColumns } = this.state;

        let dependency_dropdowns = ["FormName", "FormOID", "FieldOID", "PreText", "DataType"];

        dependency_dropdowns = dependency_dropdowns.filter(dd => dd !== dropdownName);

        //getValue from other dropdown except dropdownName
        let sel_ValFromOtherDD = getFieldsValue(dependency_dropdowns);
        let selValFromOtherDD = Object.values(sel_ValFromOtherDD);

        let filterDDOptions = MetaDataColumns.filter(col => selValFromOtherDD.indexOf(col) === -1);

        return filterDDOptions.map(it => 
            <Option optionKey={"field_config"} value={it}>{it}</Option>
        )
    }

    //When Click Next button
    next = (step) =>
    {

        this.props.form.validateFields([...MetaDatasetPageField.map((fld) => fld.attributeName)], { force: true }, (err, values) => {
            if (!err)
            {
                let { action } = this.props;

               
               action === "Create" && this.getColumn();
                this.setState((prevState) => ({ currentstep: prevState.currentstep + 1 }));
            }
        })
       
    };

   //When Click Prev button
    prev = () =>
    {
        this.setState((prevState) => ({ currentstep: prevState.currentstep - 1 }));

    };

    render() {
        const { Show, action, form, isProjectInActive, FileList } = this.props;
        const { currentstep } = this.state;

        const { getFieldDecorator } = form;

        const steps = ["Field Configuration","Column Configuration"]
        return (<Modal
                    visible={Show}
                    maskClosable={false}
                    width="60%"
                    centered
                    title={"MetaData Configuration"}
                    style={{ top: 20, padding: 10 }}
                    onCancel={this.props.Cancel}
                    footer=
                    {
                        [
                            <Button
                                name="PopupCancel"
                                style={{ float: 'left' }}
                                onClick={this.props.Cancel}
                                className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger'
                            >
                                Cancel
                            </Button>,
                            <Button
                                name="PopupSave"
                                className='ant-btn sc-ifAKCX fcfmNQ ant-btn-primary saveBtn'
                                style={{ display: currentstep < steps.length - 1 ? "inline-block" : "none" }}
                                onClick={() => this.next(currentstep + 1)}
                            >
                                Next
                            </Button>, 
                            <Button
                                className='ant-btn sc-ifAKCX fcfmNQ ant-btn-primary saveBtn'
                                style={{ display: currentstep > 0 ? "inline-block" : "none" }}
                                onClick={this.prev}
                            >
                                Previous
                            </Button>,
                            <Button
                                name="PopupSave"
                                className='ant-btn sc-ifAKCX fcfmNQ ant-btn-primary'
                                style={{ display: currentstep === steps.length - 1 ? "inline-block" : "none" }}
                                onClick={() => this.Submit()}
                                >
                                Ok
                            </Button>,
                        ]
                    }
        >
            <Steps current={currentstep}
                progressDot={
                    (dot, { status, index }) => customDot(dot, index, currentstep)
                }
            >
                {steps.map((title) => {
                   return <Step
                        title={title}>
                    </Step>
                }
                )}
            </Steps>
             {/*Step 1*/}
             <Row className="steps-content" style={{ display: currentstep === 0 ? "block" : "none" }}>
                     {MetaDatasetPageField.map((fld) => {
                            return <Col md={24} sm={24} xs={24} style={{ padding: 0 }}>
                                <FormItem label={fld.attributeName}>                                                                    {/* CRF Document Field */}
                                    {getFieldDecorator(fld.attributeName, {
                                        rules: [{ required: fld.mandatory, message: fld.requirementErrorMessage }],
                                        initialValue: this.getInitialValue(fld.attributeName, Step1_FieldsConfig)
                                    })(
                                        <TreeSelect
                                            tabIndex={0}
                                            showSearch
                                            autoBlur
                                            mode="single"
                                            allowClear
                                            style={{ width: "100%" }}
                                            placeholder="Please Select"
                                            onChange={(path, value, node) => this.Step1_onChange(path, value, node, fld.attributeName )}
                                            disabled={action === "Details" || isProjectInActive}
                                            dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                                        >
                                            {FileList}
                                        </TreeSelect>
                                    )}
                                </FormItem>
                            </Col>
                        })}
                   </Row>

            {/*Step 2*/}
            <Row className="steps-content" gutter={10} style={{ display: currentstep === 1 ? "block" : "none" }}>
                    {ColumnField.map((fld) => {
                        return <Col  md={12} sm={24} xs={24}>

                                 <FormItem label={fld.displayName}>                                                                    {/* CRF Document Field */}
                                    {getFieldDecorator(fld.attributeName, {
                                        rules: [{ required: fld.mandatory, message: fld.requirementErrorMessage }],
                                        initialValue: this.getInitialValue(fld.attributeName)

                                    })(
                                        <Select
                                            placeholder="--Select--"
                                            style={{ width: "100%" }}
                                            disabled={action === "Details" || isProjectInActive}
                                            onChange={(path, value, node) => this.Step2_onChange(path, value, node, fld.attributeName)}

                                        >
                                            {this.getColumnOption(fld.attributeName)}
                                         </Select>
                                )}
                            </FormItem>
                        </Col>
                       
                    })}
                    </Row>
         </Modal>
        );
    }
}


export default MetaDatasetConfiguration;