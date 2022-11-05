import React, { Component } from "react";
import ContentTab from "../TreeView/contentTab";
import {
    Row,
    Modal,
    Form,
    Button,
    Spin,
    Icon,
    Tabs,
    message
} from "antd";
import Blockly from 'blockly/core';
import { FormErrorHtmlIfObj, FormErrorIfArray, checkXML, GetRenameVariables, StepBlockValidation, Get_Var_From_Step, ImpactValidation, WorkDatasetVariableExists } from './blockValidation';
import BlocklyComponent, { Block, Field, Category } from './Blockly';
import { MappingDatas } from '../TreeView/getMappingDatas';
import { CREATE, UPDATE, isArray, isNotNull, PostCallWithZone, strLowerCase,successModalCallback, errorModal, errorModalCallback, showProgress, setSessionValue, hideProgress, CallServerPost, validJSON, isObjectCheck } from '../Utility/sharedUtility';
import ConfirmModal from '../Utility/ConfirmModal';
import axios from 'axios';
import { Validator } from './validator';
import { HotTable, HotColumn } from '@handsontable/react';
import "handsontable/dist/handsontable.min.css";
import SplitPane from 'react-split-pane';
import BlockWorkResult from './blockWorkResult';
import CustomProgram from './CustomProgram';

const Pane = require('react-split-pane/lib/Pane');

const { TabPane } = Tabs;


let thisObj = "";
let SelectedCategory = {};
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class BlocklyWorkspace extends Component {
    constructor(props) {
        super(props);
        this.FetchBlocks(props.mappingBlocks);
        let actV = props.activityDetails.find(x => x.activityText === "Transformation" && x.configurationName === "MappingOutput");
        let progType = 1;
        if (actV) {
            progType = parseInt(actV.configurationValue);
        }
        this.state =
        {
            initialXml: this.getInitialXML(props),
            SOURCE: this.sourceBlocks(props),
            TARGET: this.targetBlocks(props),
            WORK_BLOCKS: this.workBlocks(props.work_datasets),
            selected_sourceDS: "",
            selected_targetDS: "",
            selected_workDS: "",
            SOURCEVARIABLETYPE1: [],
            SOURCEVARIABLETYPE2: [],
            TARGETVARIABLETYPE1: [],
            TARGETVARIABLETYPE2: [],
            WORKVARIABLETYPE1: [],
            WORKVARIABLETYPE2: [],
            TARGETVARIABLE: [],
            WORKVARIABLE: [],
            NCICODELISTDATA: this.nciCodeListDataBlock(props.NCICODELISTDATA),
            bulkMapData: this.BulkMapDataBlock(props.bulkMapConfig),
            DROPVAR: [],
            merge_name: "",
            showConfirmation: false,
            blockInit: true,
            minSize: "100%",
            hasResult: true,
            log: "",
            resultSet: [],
            loading: false,
            lstHTML: "",
            sasmacro: "",
            activeKey: "1",
            dsName: "",
            currentStep: {},
            toolBox: '',
            programType: progType,
            paneSize: { first: "100%", second: "5%" },
            showProgramArea: false,
            viewWorkVariableFrVarStep: [],
            viewWorkVariableFrDTStep: [],
            customVisible: false,
            customprogram: props.MappingConstruct && props.MappingConstruct.pythonProgram && props.MappingConstruct.mappingProgram && (props.MappingConstruct.pythonProgram === props.MappingConstruct.mappingProgram) ? props.MappingConstruct.mappingProgram : ""

        };
        thisObj = this;
        //Load workDataset
        props.action === UPDATE && this.GetWorkDatasetWhenLoad();
        this.simpleWorkspace = React.createRef();
        //console.log(Blockly);

    }

    static getDerivedStateFromProps(props, state) {

        if (!props.showProgramArea && state.showProgramArea) {
            return {
                showProgramArea: props.showProgramArea,
                paneSize: { first: "100%", second: "0%" }
            };
        } else if (props.showProgramArea && !state.showProgramArea) {
            return {
                showProgramArea: props.showProgramArea,
                paneSize: { first: "70%", second: "30%" }
            };
        }
        return null;
    }

    //componentWillUpdate(nextProps, nextState) {
    //    //// if (nextProps.action == UPDATE && this.props.action == CREATE) {
    //    //   Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(), nextProps.MappingConstruct.constructJson);
    //    //  } else if (nextProps.action == CREATE && this.props.action == UPDATE) {
    //    //      Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(), '');
    //    //  } else if (nextProps.action == UPDATE && nextProps.MappingConstruct.mappingConstructID != this.props.MappingConstruct.mappingConstructID) {
    //    //      let workspace = Blockly.getMainWorkspace();
    //    //       Blockly.Xml.domToWorkspace(workspace, nextProps.MappingConstruct.constructJson);
    //    //   } 
    //}
    componentDidUpdate() {
        let workspace = Blockly.getMainWorkspace();

        //for toolbox highlight after drag the block
        if (workspace.toolbox_.flyout_.isVisible_) {
            try {
                let getCategory = workspace.getToolbox().getToolboxItems()[SelectedCategory.Category]
                if (getCategory) {
                    getCategory.setSelected(true);
                }
            } catch (e) {
                //console.log(e);
            }

        } else {
            SelectedCategory = { Category: -1 };

        }
    }
    componentWillUnmount() {
        Blockly.DropDownDiv.hide();
        Blockly.ContextMenu.hide();
    }

    //get Initial XML
    //Here make xml if rule is empty 
    getInitialXML = (props) => {
        let { action, MappingConstruct, allValues } = props;
        let { SourceDataset } = allValues;


        let { sourceDataset, sourceVariableName } = MappingConstruct;

        let { Variable } = SourceDataset;
        let srcObj = {};
        srcObj = {
            ...srcObj,
            ...Variable.find(va => va.TABLE_NAME === sourceDataset && va.COLUMN_NAME === sourceVariableName)
        };


        srcObj["blockType"] = "SourceVar";
        srcObj = JSON.stringify(srcObj);

        return `<xml xmlns="https://developers.google.com/blockly/xml">
                        <block deletable="false" type="final_step_type" startScrollX="30" startScrollY="30" x="30" y="30" />
                        <block type="variable_type_source_multi" id="kkos" disabled="true" editable="false" x="407" y="124">
                        <field name="var_name">`+ sourceDataset + `.` + sourceVariableName + `</field>
                        <data>`+ srcObj + `</data>
                        </block>
                    </xml>`;
    }

    hideToolBox = () => {
        var workspace = Blockly.getMainWorkspace();
        // For now the trashcan flyout always autocloses because it overlays the
        // trashcan UI (no trashcan to click to close it).

        if (workspace.trashcan &&
            workspace.trashcan.flyout) {
            workspace.trashcan.flyout.hide();
        }
        var toolbox = workspace.getToolbox();
        if (toolbox &&
            toolbox.getFlyout() &&
            toolbox.getFlyout().autoClose) {
            toolbox.clearSelection();
        }
    }

    //Blocks Initialization
    FetchBlocks = (mappingBlocks) => {
        const thisOb = this;
        showProgress();
        new Promise((resolve, reject) => {
            //console.log(mappingBlocks)
            mappingBlocks.map((mappingBlock, index) => {

                let validateJSON = (json, v = 1) => {
                    try {
                        return JSON.parse(json)
                    } catch (e) {
                        return v === 0 ? json : [];
                    }

                }

                var blockObj = {};
                blockObj["type"] = mappingBlock["type"];
                blockObj["colour"] = mappingBlock["color"];
                blockObj["args0"] = validateJSON(mappingBlock["args"]);
                blockObj["message0"] = mappingBlock["message"];

                if (mappingBlock["previousStatement"]) {
                    blockObj["previousStatement"] = validateJSON(mappingBlock.previousStatement, 0);
                }
                if (mappingBlock["nextStatement"]) {
                    blockObj["nextStatement"] = validateJSON(mappingBlock.nextStatement, 0);
                }
                if (mappingBlock["output"]) {
                    blockObj["output"] = validateJSON(mappingBlock.output, 0);
                }

                if (mappingBlock["inputsInline"]) {
                    blockObj["inputsInline"] = true;
                }

                if (mappingBlock["type"] === "custom_program_type") {
                    Blockly.Blocks[mappingBlock.type] = {
                        init: function () {
                            //Help Text 
                            //set value for help text
                            if (mappingBlock["description"]) {
                                this.setWarningText(mappingBlock["description"])
                            }

                            //for to enable if it is not used in workspace except step block
                            this.highPriority = mappingBlock.category === "step";
                            this.jsonInit(blockObj);
                        },
                        customContextMenu: (options) => {
                            var run_Option = {
                                enabled: true,
                                text: 'Edit Program',
                                callback: function (blk) {
                                    thisOb.setState({ customVisible: true });
                                }
                            }
                            run_Option.scopeType = { block: Blockly.ContextMenuRegistry.ScopeType.BLOCK }
                            options.unshift(run_Option);

                            return options;
                        },
                    };
                } else if (mappingBlock["type"] !== "step_type" && mappingBlock["type"] !== "step_type_variable") {

                    Blockly.Blocks[mappingBlock.type] = {

                        init: function () {
                            //Help Text 
                            //set value for help text
                            if (mappingBlock["description"]) {
                                this.setWarningText(mappingBlock["description"])
                            }

                            //for to enable if it is not used in workspace except step block
                            this.highPriority = mappingBlock.category === "step";

                            this.jsonInit(blockObj);

                            var thisBlock = this;
                            if (mappingBlock.type == "constant_type_multi") {
                                var literalValidator = function (newValue) {
                                    if (newValue.length > 100) {
                                        return null;
                                    }
                                    return newValue;
                                };

                                this.getField("const_str").setValidator(literalValidator);
                            }
                            if (mappingBlock.tooltip) {
                                this.setTooltip(function () {
                                    switch (thisBlock.type) {
                                        case "constant_type_multi":
                                            {
                                                let data = validJSON(thisBlock.data);
                                                if (data && data.cdiscDefinition && typeof data.cdiscDefinition === "string") {
                                                    return data.nciPreferredTerm + " - " + data.cdiscDefinition;
                                                }
                                            }
                                            break;
                                        default:
                                            break;
                                    }
                                });
                            }



                        },
                        onchange: function (e) {
                            try {
                                if (typeof (e.name) != "undefined") {
                                    switch (e.name) {
                                        case "input_replace_string_extra":
                                        case "input_string_extra":
                                            {
                                                var block = Blockly.getMainWorkspace().getBlockById(e.blockId);

                                                if (block) {
                                                    block.setFieldValue(e.newValue.replace(/\d+/g, ''), e.name);
                                                }
                                                return;
                                            }
                                        //case "const_str":
                                        //    var err = [];
                                        //    let txtvalue = e.newValue;
                                        //    let getIFBlk = Blockly.getMainWorkspace().getBlocksByType("constant_type_multi")[0];
                                        //    if (txtvalue.length > 200) {
                                        //        err.push("Literal should be less than 200 characters");
                                        //    } else {
                                        //        getIFBlk.setWarningText(null);
                                        //        if (getIFBlk.warning && getIFBlk.warning.bubble_) {
                                        //            getIFBlk.warning.disposeBubble();
                                        //        }
                                        //    }
                                        //    if (err.length > 0) {
                                               
                                        //        getIFBlk.setWarningText(err.toString());
                                        //        if (getIFBlk.warning && !getIFBlk.warning.bubble_) {
                                        //            getIFBlk.warning.createBubble();
                                        //        }
                                        //        getIFBlk.warning.setVisible(true);
                                        //    }

                                        //    return;
                                        case "rename_var": {
                                            var block = Blockly.getMainWorkspace().getBlockById(e.blockId);
                                            if (block) {
                                                if (e.newValue && typeof e.newValue == "string") {
                                                    {
                                                        block.setFieldValue(e.newValue.toUpperCase().trim(), e.name);
                                                    }
                                                }
                                                return;
                                            }
                                        }
                                        default:
                                            break;
                                    }

                                }
                            } catch (e) {
                                //console.log(e);
                            }
                        }
                    }
                } else if (mappingBlock["type"] === "step_type" || mappingBlock["type"] === "step_type_variable") {
                    Blockly.Blocks[mappingBlock.type] = {
                        init: function () {
                            //Help Text 
                            //set value for help text
                            if (mappingBlock["description"]) {
                                this.setWarningText(mappingBlock["description"])
                            }

                            //for to enable if it is not used in workspace except step block
                            this.highPriority = mappingBlock.category === "step";
                            this.jsonInit(blockObj);
                        },
                        onchange: function (e) {
                            try {
                                if (typeof (e.name) != "undefined") {
                                    switch (e.name) {
                                        case "temp_dsname":
                                        case "temp_varname":
                                            {
                                                var block = Blockly.getMainWorkspace().getBlockById(e.blockId);
                                                if (block) {
                                                    if (e.newValue && typeof e.newValue == "string") {
                                                        {
                                                            block.setFieldValue(e.newValue.toUpperCase().trim(), e.name);
                                                        }
                                                    }
                                                    return;
                                                }
                                            }

                                        default:
                                            break;
                                    }

                                }

                            }
                            catch (e) {
                                //console.log(e);
                            }
                        },
                        customContextMenu: (options) => {
                            var run_Option = {
                                enabled: true,
                                text: 'Run Step',
                                callback: function (blk) {
                                    let block_selected = Blockly.selected;
                                    thisOb.executeStep(block_selected);
                                }
                            }
                            run_Option.scopeType = { block: Blockly.ContextMenuRegistry.ScopeType.BLOCK }
                            options.unshift(run_Option);

                            var run_from_top_Option = {
                                enabled: true,
                                text: 'Run From Top',
                                callback: function (blk) {
                                    let block_selected = Blockly.selected;
                                    thisOb.executeFromTop(block_selected);
                                }
                            }
                            run_Option.scopeType = { block: Blockly.ContextMenuRegistry.ScopeType.BLOCK }
                            options.unshift(run_from_top_Option);

                            var view_WorkVar_Option = {
                                enabled: true,
                                text: 'Get Work Dataset',
                                callback: function (blk) {
                                    let block_selected = Blockly.selected;
                                    //Only for step and Final Step
                                    thisOb.GetWorkDatasetWhenManual(block_selected);
                                }
                            }
                            view_WorkVar_Option.scopeType = { block: Blockly.ContextMenuRegistry.ScopeType.BLOCK }
                            options.unshift(view_WorkVar_Option);


                            return options;
                        },
                    };
                }

            });
            resolve();
        }).then(() => {
            hideProgress();
        }).catch(() => {
            hideProgress();
        })

    }

    GetWorkDatasetWhenLoad = () => {
        let { MappingConstruct } = this.props;
        const { constructJson } = MappingConstruct;

        let xml = constructJson && constructJson != "" ? constructJson : this.getInitialXML(this.props);
        let { wds } = this.fnToGetWorkDataset(xml);

        thisObj.props.addWorkDataset(wds, () => thisObj.setState({
            WORK_BLOCKS: thisObj.workBlocks(wds),
            WORKVARIABLETYPE1: [],
            WORKVARIABLETYPE2: [],
            selected_workDS: ""
        }));

    }

    GetWorkDatasetWhenManual = (sel_blk) => {
        let { wds } = this.fnToGetWorkDataset(false, sel_blk);

        thisObj.props.addWorkDataset(wds, () => thisObj.setState({
            WORK_BLOCKS: thisObj.workBlocks(wds),
            WORKVARIABLETYPE1: [],
            WORKVARIABLETYPE2: [],
            selected_workDS: ""
        }));
    }
    //isCheckAllDataset
    isCheckAllDataset = (block) => {
        try {
            let getAllConnectedBlock = block && typeof block === "object" ? block.getDescendants() : [];
            return getAllConnectedBlock.some(bl => bl.type === "final_step_type");
        }
        catch (e) {
            return false;
        }
    }
    //Fn TO Load Work Dataset 
    fnToGetWorkDataset = (initialxmlcheck = false, selected_step = {}, NotToValidateBlk = false) => {
        try {
            let form_work_dataset = [];
            //variable to handle error 
            let err = {
                validationErr: [], duplicateColumn: [], impacted_block: {}, combineAllErr: []
            };
            let { validationErr, duplicateColumn, impacted_block, combineAllErr } = err;
            //End
            let { props } = this;
            let { work_datasets, NCICODELISTDATA, MappingConstruct } = props;
            let { SourceDataset, Standards, MappingList } = props.allValues;

            let tempWorkspce = new Blockly.Workspace();
            let validXML = "";

            //For when click Create/Update 
            if (!initialxmlcheck) {
                //check dataset for step alone or whole connected steps
                let checkforwhole = this.isCheckAllDataset(selected_step);
                //Get valid xml before validation
                //AS we pick many blocks and keep them in workspace ,So in that case Valid xml means xml which have final step
                //Following function find the final step and return that block chain alone
                let validBlcoks = checkforwhole ? this.getValidXML() : selected_step.getRootBlock();

                Blockly.Xml.domToBlock(tempWorkspce, Blockly.Xml.blockToDom(validBlcoks));
                //Blocks to xml
                validXML = Blockly.Xml.workspaceToDom(tempWorkspce);
                //Get valid xml End
            }
            //For initial load if action is update
            else {
                //parse xml
                Blockly.Xml.domToWorkspace(tempWorkspce, Blockly.Xml.textToDom(initialxmlcheck));
                validXML = Blockly.Xml.workspaceToDom(tempWorkspce);
            }

            let errors = [];
            let dataTableNameVariableNameValidation = () => {
                //check if datatable field has no values
                Array.from(validXML.querySelectorAll('[name="temp_dsname"]')).some(dsfield => {
                    return !isNotNull(dsfield.textContent) ? (validationErr.push('Enter Data Table Name'), true) : false;
                });

                //check if variable field has no values
                Array.from(validXML.querySelectorAll('[name="temp_varname"]')).some(varfield => {
                    return !isNotNull(varfield.textContent) ? (validationErr.push('Enter Variable Name'), true) : false;
                });
            }
            dataTableNameVariableNameValidation();

            let all_Blocks = tempWorkspce.getAllBlocks();

            let NotAvailWkList = {};

            let isAllUsedStepValid = StepBlockValidation("partialstep", all_Blocks);
            !initialxmlcheck && !isAllUsedStepValid && validationErr.push('Mapping Rule cannot be empty');
            //Step Block Validation (FinalStep,Variable step And Datatable step)
            if (validXML) {
                //Validate the used block inside the step

                //Filter only variable step and datatable step block
                //step_type -> datatable steps
                //step_type_variable -> variable step
                let all_used_step_blocks = isArray(all_Blocks) ? (all_Blocks || []).filter(blk => blk.type === "step_type" || blk.type === "step_type_variable" || blk.type === "final_step_type") : [];
                for (var index = 0; index < all_used_step_blocks.length; index++) {
                    let StepBlock = all_used_step_blocks[index];
                    let frst_stmt_bk = StepBlock.getChildren();
                    //check step have any blocks
                    if (frst_stmt_bk[0]) {
                        //Validate the used block inside the step -- Normal validation(isempty,isvalid)
                        let valdteBlk = !NotToValidateBlk ? checkXML(frst_stmt_bk[0].getDescendants(), true) : [];
                        valdteBlk = isArray(valdteBlk) ? valdteBlk : [];
                        validationErr = !NotToValidateBlk ? [...validationErr, ...valdteBlk] : [];

                        //First get the List variables going to rename
                        let { variableRenameList, duplicate } = GetRenameVariables(frst_stmt_bk[0].getDescendants(), SourceDataset, MappingList, form_work_dataset);

                        //Impact Validation 
                        let impact = new ImpactValidation(Standards, SourceDataset, validXML);
                        impact.stepblk = frst_stmt_bk[0].getDescendants();
                        impact.MappingList = MappingList;
                        impact.NotValidateWork = true;
                        impact.variableRenameList = variableRenameList;
                        impact.ImpactValidationOfUsedBlocks();
                        impact.NCICODELISTDATA = NCICODELISTDATA;
                        impact.ImapctNCICodeListValidationWorkspace();
                        //Impact validation end

                        //Work Validation Begins
                        //for to filter all the work ,if that block have no error
                        let usedWKExist = true;
                        //first step check workdataset should be []
                        let { Work_Exist, Not_Avail_WkList } = WorkDatasetVariableExists(StepBlock, form_work_dataset, variableRenameList);
                        if (!Work_Exist) {
                            usedWKExist = false;
                            NotAvailWkList = ({ ...NotAvailWkList, ...Not_Avail_WkList });
                        }
                        //Work validation End
                        if (usedWKExist && !impact.impacted && duplicate.length == 0) {
                            let { type } = StepBlock;
                            switch (type) {
                                //Variable Operation Step
                                case "step_type_variable":
                                    {
                                        //Get @DataTable(TextBOX field ) And @VariableName(TextBOX field ) field of the Step
                                        let DataTable = StepBlock.getFieldValue("temp_dsname");
                                        let VariableName = StepBlock.getFieldValue("temp_varname");
                                        if (DataTable && DataTable.trim() != "" && VariableName && VariableName.trim() != "") {
                                            //Get the Variable from the dataset of the Variable Used
                                            // Initialise the Fn
                                            let TheFnToGetVariable = new Get_Var_From_Step(SourceDataset, Standards, MappingDatas, form_work_dataset);
                                            //Set value
                                            TheFnToGetVariable.StepBlock = StepBlock;
                                            //For Which step are we going to filter variable 
                                            TheFnToGetVariable.StepType = "VariableStep";
                                            TheFnToGetVariable.WorkDataTable = DataTable;
                                            TheFnToGetVariable.ForToGetWorkDataset = true;
                                            TheFnToGetVariable.SourceOfRule = MappingConstruct;
                                            TheFnToGetVariable.variableRenameList = variableRenameList;
                                            //Function start here
                                            let filter_variable = TheFnToGetVariable.init();
                                            let work_variables = filter_variable;

                                            //Add custom variable by @VariableName(TextBOX field ) field of the Step
                                            work_variables.push({ "name": VariableName, "memname": DataTable });
                                            //End add custom variable 

                                            form_work_dataset = usedWKExist ? [...form_work_dataset.filter(e => (typeof e.memname === "string") && e.memname.toLowerCase() !== DataTable.toLowerCase()),
                                            ...work_variables] : form_work_dataset;

                                        }
                                    }
                                    break;
                                //DataTable Operation Step
                                case "step_type":
                                    {
                                        //Get @VariableName(TextBOX field ) And @DataTable(TextBOX field ) field of the Step
                                        let DataTable = StepBlock.getFieldValue("temp_dsname");
                                        if (DataTable && (typeof DataTable === "string" || DataTable.trim() !== "")) {
                                            //Get the Variable from the dataset of the Variable Used
                                            let TheFnToGetVariable = new Get_Var_From_Step(SourceDataset, Standards, MappingDatas, form_work_dataset);
                                            //For Which step are we going to filter variable 
                                            TheFnToGetVariable.StepType = "DataTableStep";
                                            TheFnToGetVariable.StepBlock = StepBlock;
                                            TheFnToGetVariable.WorkDataTable = DataTable;
                                            TheFnToGetVariable.ForToGetWorkDataset = true;
                                            TheFnToGetVariable.variableRenameList = variableRenameList;

                                            //here we filter the var from the dataset of the Variable Used
                                            let work_variables = TheFnToGetVariable.init();

                                            form_work_dataset = usedWKExist ? [...form_work_dataset.filter(e => (typeof e.memname === "string") && e.memname.toLowerCase() !== DataTable.toLowerCase()),
                                            ...work_variables] : form_work_dataset;
                                        }

                                    }
                                    break;
                                case "final_step_type":
                                    {
                                        //Get @VariableName(TextBOX field ) And @DataTable(TextBOX field ) field of the Step

                                        //Get the Variable from the dataset of the Variable Used
                                        let TheFnToGetVariable = new Get_Var_From_Step(SourceDataset, Standards, MappingDatas, form_work_dataset);
                                        //For Which step are we going to filter variable 
                                        TheFnToGetVariable.StepType = "WkFinalStep";
                                        TheFnToGetVariable.StepBlock = StepBlock;
                                        TheFnToGetVariable.WorkDataTable = "";
                                        TheFnToGetVariable.ForToGetWorkDataset = true;
                                        //here we filter the var from the dataset of the Variable Used
                                        let work_variables = TheFnToGetVariable.init();

                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                        else {
                            impact.impacted && (impacted_block = { ...impacted_block, ...impact.ImpactedList });
                            duplicate.length > 0 && duplicateColumn.push(duplicate);
                        }

                    }
                }

                combineAllErr = validationErr.length > 0 ? FormErrorIfArray("Validation Error", validationErr) : [];
                //Work error
                isObjectCheck(NotAvailWkList) && combineAllErr.push(FormErrorHtmlIfObj("The following Works are not available", NotAvailWkList));
                //Impact error
                Object.keys(impacted_block).length > 0 && combineAllErr.push(FormErrorHtmlIfObj("The following blocks are impacted", impacted_block));
                //column duplication error due to rename
                duplicateColumn.length > 0 && combineAllErr.push(FormErrorIfArray("Rename variables should be unique", duplicateColumn));

                combineAllErr.length > 0 && errorModalCallback(combineAllErr);

                return {
                    wds: form_work_dataset, err: isObjectCheck(combineAllErr)
                }

            }
            else {
                errorModal("XML not valid");
                return { err: true, wds: form_work_dataset };
            }

        }
        catch (e) {
            console.log(e);

            initialxmlcheck && thisObj.resetWorkDataset();
            return { err: true, wds: [] };

        }
    }
    //Reset Workdataset
    resetWorkDataset = () => {
        thisObj.props.addWorkDataset([], () => thisObj.setState({
            WORK_BLOCKS: thisObj.workBlocks([]),
            WORKVARIABLETYPE1: [],
            WORKVARIABLETYPE2: [],
            selected_workDS: ""
        }));
    }
    ////Header Actions
    //MappingTitle = () => {
    //    const { TargetDomain, TargetVariable } = this.props.selectedTargetObj;
    //    //console.log(this.props)
    //    return <div>
    //        <span className="selectedOperations">
    //            <strong>
    //                <span>Mapping:</span>{" "}
    //                <span style={{ color: "#1890ff" }}>
    //                    {TargetDomain + "." + TargetVariable}
    //                </span>
    //            </strong>
    //        </span>
    //        <ContentTab showToggleIcon={false} />
    //    </div>
    //}

    //Source Block
    sourceBlocks = props => {
        let { SourceDataset } = props.allValues;
        return SourceDataset.Domain.map(source => {
            let dataSource = { ...source, blockType: "Source" };

            return (<React.Fragment key={source.TABLE_NAME + "_key"}>
                <Block editable={false} type="dataset_type_multi_source" >
                    <Field name="ds_name">
                        {source.TABLE_NAME}
                    </Field>
                    <data>{JSON.stringify({ ...dataSource, category: "dataset", primaryID: source.TABLE_NAME })}</data>
                </Block>
            </React.Fragment>);
        })
    };

    //Target Block
    targetBlocks = props => {
        let { Standards } = props.allValues;
        let { Domain } = Standards;
        let MappingList = MappingDatas.MappingList;
        let mappinglistdomains = MappingList.map((data, index) => {
            if (MappingList.findIndex(e => e.cdiscDataStdDomainMetadataID == data.cdiscDataStdDomainMetadataID) === index) {
                let Target = Domain.find(x => x.cdiscDataStdDomainMetadataID === data.cdiscDataStdDomainMetadataID);
                if (Target !== null && typeof Target === "object") {
                    let dataTarget = { ...Target, blockType: "Target" };
                    return (<React.Fragment key={Target.domain + "_key"}>
                        <Block editable={false} type="dataset_type_multi_target" >
                            <Field name="ds_name">
                                {Target.domain}
                            </Field>
                            <data>{JSON.stringify({ ...dataTarget, category: "dataset", primaryID: data.cdiscDataStdDomainMetadataID })}</data>
                        </Block>
                    </React.Fragment>);
                }
            }
        });
        Domain.map(Target => {
            if (Target.domain.includes("_int")) {
                let dataTarget = { ...Target, blockType: "Target" };
                mappinglistdomains.push((<React.Fragment key={Target.domain + "_key"}>
                    <Block editable={false} type="dataset_type_multi_target" >
                        <Field name="ds_name">
                            {Target.domain}
                        </Field>
                        <data>{JSON.stringify({ ...dataTarget, category: "dataset", primaryID: Target.cdiscDataStdDomainMetadataID })}</data>
                    </Block>
                </React.Fragment>));
            }
        });
        return mappinglistdomains;
    };

    //Work Blocks
    workBlocks = (work_datasets) => {
        const workDomains = [...new Set(work_datasets.map(x => x.memname))];
        //console.log(workDomains)
        let workBlocks_s = workDomains.map((datInfo) => {
            let dataSource = { blockType: "Work", name: datInfo };

            return (<React.Fragment key={datInfo + "work_fg_key"}>
                <Block editable={false} type="dataset_type_multi_work" >
                    <Field name="ds_name">
                        {datInfo}
                    </Field>
                    <data>{JSON.stringify({ ...dataSource, category: "dataset", primaryID: datInfo })}</data>
                </Block>
            </React.Fragment>);
        });
        return workBlocks_s;
    }

    // Work Variable Blocks
    workVariableBlocks = (obj, block) => {
        let { selected_workDS } = this.state;
        //1.filter all the variables that needs to be renamed if Rename block used
        //2.Check Duplication (do not rename multiple columns with the same name).
        let { props } = this;
        let { work_datasets } = props;
        let { SourceDataset, MappingList } = props.allValues;

        let { variableRenameList, duplicate } = GetRenameVariables([block], SourceDataset, MappingList, work_datasets);
        if (duplicate.length === 0) {
            if (selected_workDS !== obj.name) {
                let type1 = [];
                let type2 = [];
                let datasetobj = this.props.work_datasets.filter(v => v.memname === obj.name);
                if (datasetobj.length > 0) {
                    datasetobj.map((vaobj) => {
                        //Because of the override to source/original value ,you have to stringify and use.
                        let va_str = JSON.stringify(vaobj);
                        let datInfo = validJSON(va_str);

                        let dataSource =
                        {
                            blockType: "WorkVar",
                            type: 'variable',
                            variable: datInfo.name,
                            dataset: obj.name
                        };

                        //Rename the variable ,if it is in rename. 
                        let rename_obj = variableRenameList[obj.name + "@_" + "WorkVar"];
                        let renameTo = rename_obj && rename_obj[dataSource.variable] && rename_obj[dataSource.variable].renameTo;
                        dataSource.variable = isNotNull(renameTo) ? renameTo.toUpperCase() : dataSource.variable;

                        type1.push(<React.Fragment key={dataSource.variable + "work_fgv_key"}>
                            <Block editable={false} type="variable_type_work_multi" >
                                <Field name="var_name">
                                    {obj.name}.{dataSource.variable.toUpperCase()}
                                </Field>
                                <data>{JSON.stringify({ ...dataSource })}</data>
                            </Block>
                        </React.Fragment>);
                        type2.push(<React.Fragment key={dataSource.variable + "work_fgv_key"}>
                            <Block editable={false} type="variable_type_work_multi_2" >
                                <Field name="var_name">
                                    {obj.name}.{dataSource.variable.toUpperCase()}
                                </Field>
                                <data>{JSON.stringify({ ...dataSource })}</data>
                            </Block>
                        </React.Fragment>);
                    });
                    this.setState({ WORKVARIABLETYPE1: type1, WORKVARIABLETYPE2: type2, selected_workDS: obj.name });
                }

            }
            else {
                thisObj.RemoveVariables(obj);
            }
        } else {
            errorModal(FormErrorHtmlIfObj("Rename variables should be unique", duplicate));
        }
    }


    //BulkMap Block
    BulkMapDataBlock = (BulkMapDataObj) => {
        let groupBlock = {};
        let nciblock = [];

        //Block creation
        let block = (b) => {
            let dataSource = { blockType: "BulkMapData", ...b };
            return (<React.Fragment key={b.targetVariable + "_key"}>
                <Block editable={false} type="constant_type_multi">
                    <Field name="const_str">
                        {b.targetDomain + "." + b.targetVariable}
                    </Field>
                    <data>{JSON.stringify({ ...dataSource, category: "dataset" })}</data>
                </Block>
            </React.Fragment>);
        }

        if (typeof BulkMapDataObj === "object" && BulkMapDataObj.length > 20) {
            BulkMapDataObj.map((data) => {
                let firstLetter = typeof data.targetDomain === "string" && data.targetDomain.charAt(0);
                if (firstLetter && firstLetter.match(/^[a-zA-Z]+$/)) {
                    return groupBlock[firstLetter.toUpperCase()] ?
                        groupBlock[firstLetter.toUpperCase()].push(block(data)) :
                        groupBlock[firstLetter.toUpperCase()] = [block(data)];
                } else {

                    return groupBlock["123"] ?
                        groupBlock["123"].push(block(data)) :
                        groupBlock["123"] = [block(data)];
                }
            });

            //Category creation
            nciblock = Object.keys(groupBlock).map(groupName => {
                return <Category name={groupName} colour="100">
                    {groupBlock[groupName]}
                </Category>
            })

        }
        else {

            nciblock = BulkMapDataObj.map((obj) => {
                return block(obj);
            })
        }

        return {
            name: "BulkMapConfig",
            block: nciblock
        }
    }

    //NCICODELISTDATA Block
    nciCodeListDataBlock = (nCICODELISTDATA) => {
        let codelistName = "";
        let groupBlock = {};
        let nciblock = [];

        //Block creation
        let block = (b) => {
            let dataSource = { blockType: "NciCodeListData", ...b };
            codelistName = b.codelistName;
            return (<React.Fragment key={b.cdiscSubmissionValue + "_key"}>
                <Block editable={false} type="constant_type_multi">
                    <Field name="const_str">
                        {b.cdiscSubmissionValue}
                    </Field>
                    <data>{JSON.stringify({ ...dataSource, category: "dataset" })}</data>
                </Block>
            </React.Fragment>);
        }

        if (typeof nCICODELISTDATA === "object" && nCICODELISTDATA.length > 20) {
            nCICODELISTDATA.map((data) => {
                let firstLetter = data.cdiscSubmissionValue.charAt(0);
                if (firstLetter.match(/^[a-zA-Z]+$/)) {
                    return groupBlock[firstLetter.toUpperCase()] ?
                        groupBlock[firstLetter.toUpperCase()].push(block(data)) :
                        groupBlock[firstLetter.toUpperCase()] = [block(data)];
                } else {

                    return groupBlock["123"] ?
                        groupBlock["123"].push(block(data)) :
                        groupBlock["123"] = [block(data)];
                }
            });

            //Category creation
            nciblock = Object.keys(groupBlock).map(groupName => {
                return <Category name={groupName} colour="100">
                    {groupBlock[groupName]}
                </Category>
            })

        }
        else {

            nciblock = nCICODELISTDATA.map((obj) => {
                return block(obj);
            })
        }

        return {
            name: codelistName,
            block: nciblock
        }
    }

    // Variable Block for Source
    SourceVariableBlocks = (obj, block) => {
        //1.filter all the variables that needs to be renamed if Rename block used
        //2.Check Duplication (do not rename multiple columns with the same name).
        let { work_datasets } = this.props;
        let { SourceDataset, MappingList } = this.props.allValues;

        let { variableRenameList, duplicate } = GetRenameVariables([block], SourceDataset, MappingList, work_datasets);
        if (duplicate.length === 0) {
            let { selected_sourceDS } = this.state;
            if (selected_sourceDS !== obj.TABLE_NAME) {


                let { SourceDataset } = thisObj.props.allValues;
                let VariableList = SourceDataset.Variable.filter(
                    va => va.TABLE_NAME === obj.TABLE_NAME
                );

                SelectedCategory = { Category: 5 };
                let type1 = [];
                let type2 = [];

                let varBlock = VariableList.map(vari => {
                    //Because of the override to source/original value ,you have to stringify and use.
                    let va_str = JSON.stringify(vari);
                    let data = validJSON(va_str);

                    //Rename the variable ,if a rename block exists 
                    let rename_obj = variableRenameList[obj.TABLE_NAME + "@_" + "SourceVar"];
                    let renameTo = rename_obj && rename_obj[data.COLUMN_NAME] && rename_obj[data.COLUMN_NAME].renameTo;
                    data.COLUMN_NAME = isNotNull(renameTo) ? renameTo.toUpperCase() : data.COLUMN_NAME;

                    data["blockType"] = "SourceVar";

                    type1.push(<React.Fragment key={"src_fgmt_key_" + obj.TABLE_NAME + data.COLUMN_NAME}>
                        <Block editable={false} type="variable_type_source_multi" >
                            <Field name="var_name">
                                {obj.TABLE_NAME}.{data.COLUMN_NAME}
                            </Field>
                            <data>{JSON.stringify({ ...data, uniqueid: obj.TABLE_NAME })}</data>
                        </Block>
                    </React.Fragment>);

                    type2.push(<React.Fragment key={"src_fgmt_key_" + obj.TABLE_NAME + data.COLUMN_NAME}>
                        <Block editable={false} type="variable_type_source_multi_2" >
                            <Field name="var_name">
                                {obj.TABLE_NAME}.{data.COLUMN_NAME}
                            </Field>
                            <data>{JSON.stringify({ ...data, uniqueid: obj.TABLE_NAME })}</data>
                        </Block>
                    </React.Fragment>);

                });

                thisObj.setState({ SOURCEVARIABLETYPE1: type1, SOURCEVARIABLETYPE2: type2, selected_sourceDS: obj.TABLE_NAME });


            }
            else {
                thisObj.RemoveVariables(obj);
            }
        }
        else {
            errorModal(FormErrorHtmlIfObj("Rename variables should be unique", duplicate));
        }
    };

    //Variable Block for Target
    TargetVariableBlocks = (obj, block) => {

        let { work_datasets } = this.props;
        let { SourceDataset, MappingList } = this.props.allValues;

        //1.filter all the variables that needs to be renamed if Rename block used
        //2.Check Duplication (do not rename multiple columns with the same name).
        let { variableRenameList, duplicate } = GetRenameVariables([block], SourceDataset, MappingList, work_datasets);
        if (duplicate.length === 0) {

            let { selected_targetDS } = this.state;
            if (selected_targetDS !== obj.domain) {
                let { Standards } = thisObj.props.allValues;

                //For HighLight node
                SelectedCategory = { Category: 6 };

                let variablesList = Standards.Variable.filter(
                    variable =>
                        variable.cdiscDataStdDomainMetadataID ===
                        obj.cdiscDataStdDomainMetadataID
                );

                let type1 = [];
                let type2 = [];

                variablesList.map(function (vari) {
                    //Because of the override to source/original value ,you have to stringify and use.
                    let va_str = JSON.stringify(vari);
                    let variable = validJSON(va_str);

                    let mappingConstruct = MappingDatas.MappingList.filter(
                        mapper =>
                            mapper.cdiscDataStdVariableMetadataID ===
                            variable.cdiscDataStdVariableMetadataID
                    );

                    //Rename the variable ,if its is in the rename list 
                    let rename_obj = variableRenameList[obj.domain + "@_" + "TargetVar"];
                    let renameTo = rename_obj && rename_obj[variable.variableName] && rename_obj[variable.variableName].renameTo;
                    let col_Name = isNotNull(renameTo) ? renameTo.toUpperCase() : variable.variableName;
                    variable.variableName = col_Name;

                    variable["blockType"] = "TargetVar";

                    if ((typeof mappingConstruct === 'object' && mappingConstruct && mappingConstruct.length > 0) || obj.domain.includes("_int")) {

                        type1.push(<React.Fragment key={"tgtfmt_var_" + col_Name}>
                            <Block editable={false} type="variable_type_target_multi" >
                                <Field name="var_name">
                                    {obj.domain}.{col_Name}
                                </Field>
                                <data>{JSON.stringify({ ...variable, domain: obj.domain, uniqueid: obj.cdiscDataStdDomainMetadataID })}</data>
                            </Block>
                        </React.Fragment>);

                        type2.push(<React.Fragment key={"tgtfmt_var_" + variable.variableName}>
                            <Block editable={false} type="variable_type_target_multi_2" >
                                <Field name="var_name">
                                    {obj.domain}.{col_Name}
                                </Field>
                                <data>{JSON.stringify({ ...variable, domain: obj.domain, uniqueid: obj.cdiscDataStdDomainMetadataID })}</data>
                            </Block>
                        </React.Fragment>);
                    }
                });

                thisObj.setState({ TARGETVARIABLETYPE1: type1, TARGETVARIABLETYPE2: type2, selected_targetDS: obj.domain });
            }
            else {
                thisObj.RemoveVariables(obj);
            }
        }
        else {
            errorModal(FormErrorHtmlIfObj("Rename variables should be unique", duplicate));
        }
    };

    //Remove Variable Blocks When Delete
    RemoveVariables = (obj) => {
        if (obj.blockType === "Source") {
            thisObj.setState({ SOURCEVARIABLETYPE1: [], SOURCEVARIABLETYPE2: [], selected_sourceDS: "" });

        } else if (obj.blockType === "Target") {
            thisObj.setState({ TARGETVARIABLETYPE1: [], TARGETVARIABLETYPE2: [], selected_targetDS: "" });

        }
        else if (obj.blockType === "Work") {
            thisObj.setState({ WORKVARIABLETYPE1: [], WORKVARIABLETYPE2: [], selected_workDS: "" });

        }
    }

    //Cancel
    hideMapperModal = flag => {
        if (flag === "Cancel") {
            this.props.hideMapperModal();
        }
    };

    //validation 

    // Save Process
    //For Save Rules
    saveRule = (ChangeReason = "Created", saveProgress = false) => {
        let { SourceDataset, Standards } = thisObj.props.allValues;

        let { props } = this;
        let { sourceObj, selectedTargetObj, MappingConstruct, action, work_datasets } = props;
        const { TargetDomainID, TargetVariableID } = selectedTargetObj;

        //Create and Update 
        let xml = this.getValidXML();
        xml = this.wrapXMLTag(xml);

        if (xml) {

            let used_dset_var_from_finalstp = new Get_Var_From_Step(SourceDataset, Standards, MappingDatas, work_datasets);
            //For Which step are we going to filter variable 
            used_dset_var_from_finalstp.StepType = "FinalStep";

            let values = {
                ConstructJson: xml,
                ConstructString: "",
                MappingXML: "",
                StudyID: JSON.parse(
                    sessionStorage.getItem("studyDetails")
                ).studyID,
                CDISCDataStdDomainMetadataID: MappingConstruct.cdiscDataStdDomainMetadataID !== undefined ? MappingConstruct.cdiscDataStdDomainMetadataID : TargetDomainID,
                CDISCDataStdVariableMetadataID: MappingConstruct.cdiscDataStdVariableMetadataID !== undefined ? MappingConstruct.cdiscDataStdVariableMetadataID : TargetVariableID,
                SourceDataset: action === UPDATE ? MappingConstruct.sourceDataset : sourceObj.TABLE_NAME,
                SourceVariableName: action === UPDATE ? MappingConstruct.sourceVariableName : sourceObj.COLUMN_NAME,
                ChangeReason: ChangeReason,
                action: thisObj.props.action,
                Order: action === UPDATE ? MappingConstruct.Order : 0,
                isCheckedOut: saveProgress ? 1 : 0,
                Extra1: "",
                Extra2: used_dset_var_from_finalstp.init(used_dset_var_from_finalstp),
                impact: saveProgress ? MappingConstruct.impact : 0,
                Status: action === UPDATE ? MappingConstruct.Status : "",
                UpdatedDateTimeText: MappingConstruct.updatedDateTimeText,

            }
            //if (action == UPDATE) {
            values.MappingConstructID = MappingConstruct.mappingConstructID;
            if (xml.includes("custom_program_type")) {
                values["MappingProgram"] = thisObj.state.customprogram;
                values["PythonProgram"] = thisObj.state.customprogram;
            }
            // Loader
            const urltocall = saveProgress ? "MappingOperations/SaveProgress" : "MappingOperations/UpdateMappingOperations";
            showProgress();
            PostCallWithZone(urltocall, values).then((response) => {
                const responseData = response;
                if (responseData.status == 1) {
                    if (saveProgress) {
                        message.destroy();
                        message.success('Rule progress saved successfully!', 0.5);
                        hideProgress();
                    } else {
                        setSessionValue("MappingDeleteIsCheckOut", null);
                        setSessionValue("MappingUpdateIsCheckOut", null);
                        thisObj.setState({ showConfirmation: false });
                        successModalCallback(response.message, () => thisObj.props.clearWorkSpace("refresh"));
                    }

                } else {
                    errorModal(response.message);
                }
                hideProgress();
            })
        }
    }

    //Get valid xml first and the validate
    //we can creat many block .So in that case Valid xml means xml which have final step
    //Following function find the final step and return that block chain alone
    getValidXML = () => {
        let XMLOfAllUsedBlock = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
        //Cretae one temp workspace(@Note:if use actual workspace one copy will create in actual workspace.So create temp workspace)
        let tempWorkSpace = new Blockly.Workspace();
        let validXML = "";

        var result = Array.from(XMLOfAllUsedBlock.childNodes).some(b => {
            let block = Blockly.Xml.domToBlock(tempWorkSpace, b);
            let loopToFindIsFinal_step_type_ExistOrNot = (blo) => {
                var nxt = blo.getNextBlock();
                return blo.type === "final_step_type" ? (validXML = block, true) : nxt ? loopToFindIsFinal_step_type_ExistOrNot(nxt) : false;
            }
            return loopToFindIsFinal_step_type_ExistOrNot(block)
        });

        return result ? validXML : result;
    }

    wrapXMLTag = (validBlockChain) => {
        return ` <xml xmlns="https://developers.google.com/blockly/xml">` + new XMLSerializer().serializeToString(Blockly.Xml.blockToDom(validBlockChain)) + `</xml>`;
    }

    //UpdateWithConfirmation
    validateRule = () => {
        let { props } = this;

        let { action } = props;
        //Create and Update 

        //Get valid xml first and the validate
        //we can creat many block .So in that case Valid xml means xml which have final step
        //Following function find the final step and return that block chain alone
        let validBlcoks = this.getValidXML();
        let tempWorkspce = new Blockly.Workspace();
        Blockly.Xml.domToBlock(tempWorkspce, Blockly.Xml.blockToDom(validBlcoks));

        //Blocks to xml
        let validXML = Blockly.Xml.workspaceToDom(tempWorkspce);

        //First one is for initial load, Sec param is block and third one is dontShowErrMsg
        let { wds, err } = thisObj.fnToGetWorkDataset(false, validBlcoks, false);
        if (!err) {
            if (action === "Create") {

                thisObj.saveRule();
            }
            else {
                thisObj.props.addWorkDataset(wds, () => thisObj.setState({
                    WORK_BLOCKS: thisObj.workBlocks(wds),
                    WORKVARIABLETYPE1: [],
                    WORKVARIABLETYPE2: [],
                    selected_workDS: "",
                    showConfirmation: true
                }));

            }
        }
        else {
            thisObj.props.addWorkDataset(wds, () => thisObj.setState({
                WORK_BLOCKS: thisObj.workBlocks(wds),
                WORKVARIABLETYPE1: [],
                WORKVARIABLETYPE2: [],
                selected_workDS: "",
            }));
        }

    }


    //Find impact block
    //Check is impact
    impactedBlkPresent = (workspce) => {
        let AllValidBlocks = workspce.getAllBlocks();
        let { SourceDataset, MappingList } = this.props.allValues;
        let { Variable } = SourceDataset;

        //For Src
        let getAllSrcBlk = AllValidBlocks.filter(c => {
            let data = validJSON(c.data)
            if (data) {
                return data.blockType === "SourceVar";
            }
        });
        //For Target
        let getAllTargetBlk = AllValidBlocks.filter(c => {
            let data = validJSON(c.data)
            if (data) {
                return data.blockType === "TargetVar";
            }
        });

        //is used src avl in current study src
        let UsedSrcNotAvl = getAllSrcBlk.map(srcblk => {
            let srcobj = validJSON(srcblk.data);
            //Variable var is actual source variable
            //srcobj is used block srcobj
            return Variable.some(va => {
                return va.TABLE_NAME === srcobj.TABLE_NAME && va.COLUMN_NAME === srcobj.COLUMN_NAME;
            });
        }).some(isaval => !isaval);

        //is used targ avl in current study version target
        let UsedTarNotAvl = getAllTargetBlk.map(tarblk => {
            let tarobj = validJSON(tarblk.data);
            //Variable var is actual Std variable
            //tarobj is used block target

            return MappingList.some(va => {
                //let getDomain = Standards.Domain.find(d => d.cdiscDataStdDomainMetadataID === va.cdiscDataStdDomainMetadataID);
                return tarobj.domain === va.targetDataSet && va.targetVariableName === tarobj.variableName;

            })
        }).some(isaval => !isaval);

        return UsedSrcNotAvl || UsedTarNotAvl;
    }

    //Change Reason Cancel
    handleChangeReasonCancel = () => {
        thisObj.setState({ showConfirmation: false });
    }

    handleSASResult = (response) => {
        this.setState({ log: response["LOG"], lstHTML: response["LST"], resultSet: JSON.parse(response["dataset"]) });
    }

    setProgress = (show) => {
        this.setState({ loading: show });
    }



    genrateProgram = (stepxml = "") => {
        let { props } = this;
        let { selectedTargetObj, allValues, NCICODELISTDATA, work_datasets } = props;
        let { Standards, SourceDataset, MappingList } = allValues;

        //Code to put validation for Generate Program
        //Transbot 1.0.1
        //Demo update
        let cus_pro = Blockly.getMainWorkspace().getBlocksByType("custom_program_type");
        if (cus_pro.length === 0 || !cus_pro.some(x => x.getParent() && x.getParent().type === "final_step_type")) {
            //Create and Update 

            //Get valid xml first and the validate
            //we can creat many block .So in that case Valid xml means xml which have final step
            //Following function find the final step and return that block chain alone
            let validBlcoks = this.getValidXML();

            let tempWorkspce = new Blockly.Workspace();
            Blockly.Xml.domToBlock(tempWorkspce, Blockly.Xml.blockToDom(validBlcoks));
            //Blocks to xml
            let validXML = Blockly.Xml.workspaceToDom(tempWorkspce);
            //First one is for initial load, Sec param is block and third one is dontShowErrMsg
            let { wds, err } = thisObj.fnToGetWorkDataset(false, validBlcoks, false);
            if (!err) {
                tempWorkspce.dispose();
                thisObj.props.addWorkDataset(wds, () => thisObj.setState({
                    WORK_BLOCKS: thisObj.workBlocks(wds),
                    WORKVARIABLETYPE1: [],
                    WORKVARIABLETYPE2: [],
                    selected_workDS: "",
                }, () => thisObj.getSASMacro()));
            }
            else {
                thisObj.props.addWorkDataset(wds, () => thisObj.setState({
                    WORK_BLOCKS: thisObj.workBlocks(wds),
                    WORKVARIABLETYPE1: [],
                    WORKVARIABLETYPE2: [],
                    selected_workDS: "",
                }));
            }

        } else {
            thisObj.setState({
                sasmacro: this.state.customprogram,
                dsName: "",
                log: ""
            });
            props.fnToShowHideProgramArea(true);
        }
    }

    getSASMacro = (stepxml = "") => {
        let { props } = this;

        const { programType } = this.state;
        let { sourceObj, selectedTargetObj, MappingConstruct, action, allValues } = props;
        const { TargetDomainID, TargetVariableID } = selectedTargetObj;

        //Get valid xml first and the validate
        //we can creat many block .So in that case Valid xml means xml which have final step
        //Following function find the final step and return that block chain alone
        let tempxml = this.getValidXML();
        tempxml = this.wrapXMLTag(tempxml);

        let xml = stepxml === "" ? tempxml : true;

        if (xml) {
            let XMLValue = stepxml === "" ? xml : stepxml;


            let values = {
                ConstructJson: XMLValue,
                ConstructString: "",
                MappingXML: "",
                StudyID: JSON.parse(
                    sessionStorage.getItem("studyDetails")
                ).studyID,
                CDISCDataStdDomainMetadataID: action === UPDATE ? MappingConstruct.cdiscDataStdDomainMetadataID : TargetDomainID,
                CDISCDataStdVariableMetadataID: action === UPDATE ? MappingConstruct.cdiscDataStdVariableMetadataID : TargetVariableID,
                SourceDataset: action === UPDATE ? MappingConstruct.sourceDataset : sourceObj.TABLE_NAME,
                SourceVariableName: action === UPDATE ? MappingConstruct.sourceVariableName : sourceObj.COLUMN_NAME
            }
            showProgress();
            if (stepxml === "") {
                CallServerPost("MappingOperations/GenMacro", values).then((response) => {
                    const responseData = response;
                    if (responseData.status == 1) {
                        thisObj.setState({
                            sasmacro: programType == 1 ? responseData.value.pythonProgram : responseData.value.mappingProgram,
                            dsName: `${responseData.value.domain}`
                        });
                        props.fnToShowHideProgramArea(true)
                    } else {
                        errorModal(response.message);
                    }
                    hideProgress();
                })
            } else {
                return CallServerPost("MappingOperations/GenMacro", values).then((response) => {
                    const responseData = response;
                    if (responseData.status == 1) {
                        return programType == 1 ? responseData.value.pythonProgram : responseData.value.mappingProgram;
                    }
                    else {
                        return "";
                    }
                })
            }

        }

    }


    executeMacro = () => {
        const thisObj = this;

        const execmacro = this.state.sasmacro;

        showProgress();
        let ds = ''
        let domain = ''
        if (this.props.action == CREATE) {
            ds = `FX${this.props.selectedTargetObj.TargetDomain}_${this.props.selectedTargetObj.TargetVariable}`;
            domain = this.props.selectedTargetObj.TargetDomain;
        } else if (this.props.action == UPDATE) {
            ds = `FX${this.props.MappingConstruct.targetDataSet}_${this.props.MappingConstruct.targetVariableName}`;
            domain = this.props.MappingConstruct.targetDataSet;
        }
        const StudyID = JSON.parse(sessionStorage.getItem("studyDetails")).studyID;
        CallServerPost("Py/ExecSasTemp", {
            'program': execmacro,
            'dataset': ds,
            StudyID: StudyID,
            'domain': domain,
            'username': JSON.parse(sessionStorage.userProfile).userName
        }).then((response) => {
            if (response.status == 1) {
                const res = response.value;
                if (res !== null && "LOG" in res) {
                    thisObj.setState({ log: res["LOG"], lstHTML: res["LST"] });
                    if ("dataset" in res && res["dataset"] != "") {
                        thisObj.props.addWorkTable(JSON.parse(res["dataset"]), ds);
                    }
                } else {
                    errorModal("Something went wrong!");
                }

            }
            hideProgress();
        });

    }
    getStep = () => {
        // let xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
        //console.log(xml.querySelector('[type="step_type"]'));
        return "Step 1";
    }
    setCurrentStep = (currStep) => {
        //this.setState({ currentStep: currStep });
    }

    addNewWorkData = () => {

    }
    executeFromTop = (block_selected) => {
        try {
            let { allValues } = thisObj.props;
            let allblocks = block_selected.getRootBlock();

            //Blocks to xml
            const validXML = Blockly.Xml.blockToDom(allblocks);
            //selected block to xml,for to remove next connection
            const selectedXML = Blockly.Xml.blockToDom(block_selected);

            if (selectedXML.children[selectedXML.children.length - 1].localName == "next") {
                if (block_selected.id === validXML.id) {
                    validXML.children[validXML.children.length - 1].remove();
                }
                else {
                    let selxml = validXML.querySelector('[id="' + block_selected.id + '"]');
                    selxml.children[selectedXML.children.length - 1].remove();
                }
            }
            //validate selected block 
            //Following function find the step and return that block chain alone
            //Validate selected step block alone
            let tempWorkspce = new Blockly.Workspace();
            Blockly.Xml.domToBlock(tempWorkspce, validXML);
            let validBlcoks = tempWorkspce.getAllBlocks();
            const th = this;

            //First one is for initial load, Sec param is block and third one is dontShowErrMsg
            let { wds, err } = thisObj.fnToGetWorkDataset(false, validBlcoks[0]);

            if (!err) {
                const dsxml = validXML.querySelectorAll('[name="temp_dsname"]');
                const datasetName = dsxml[dsxml.length - 1].textContent;
                const variablename = block_selected.getField("temp_varname");

                if (datasetName !== "" && (!variablename || variablename.getValue() !== "")) {
                    let XMLValue = new XMLSerializer().serializeToString(validXML);
                    const xmlfinal = `<xml xmlns="https://developers.google.com/blockly/xml">` + XMLValue + `</xml>`;
                    //console.log(xmlfinal);


                    thisObj.props.addWorkDataset(wds, () => thisObj.setState({
                        WORK_BLOCKS: thisObj.workBlocks(wds),
                        WORKVARIABLETYPE1: [],
                        WORKVARIABLETYPE2: [],
                        selected_workDS: "",
                    }, () => {
                        this.getSASMacro(xmlfinal).then((macro) => {
                            //console.log(macro);
                            if (macro !== "") {
                                th.executeStepMacro(macro, datasetName, variablename);
                            } else {
                                hideProgress();
                            }
                        });
                    }));

                } else {
                    let errorMsg = [];
                    datasetName === "" && errorMsg.push(<div key={errorMsg.length + 1}>{errorMsg.length + 1}. {"Enter Data Table Name."}</div>);
                    (variablename && variablename.getValue() === "") && errorMsg.push(<div key={errorMsg.length + 1}>{errorMsg.length + 1}. {"Enter Variable Name."}</div>);
                    errorModal(errorMsg);
                }
            } else {
                thisObj.props.addWorkDataset(wds, () => thisObj.setState({
                    WORK_BLOCKS: thisObj.workBlocks(wds),
                    WORKVARIABLETYPE1: [],
                    WORKVARIABLETYPE2: [],
                    selected_workDS: "",
                }));
            }


        }
        catch (e) {
            console.log(e);
        }
    }

    executeStep = (block_selected) => {
        try {
            let { selectedTargetObj, allValues, NCICODELISTDATA, work_datasets } = thisObj.props;
            let { Standards, SourceDataset, MappingList } = allValues;

            //for selected block to validate that block alone
            const validXML = Blockly.Xml.blockToDom(block_selected);
            if (validXML.children[validXML.children.length - 1].localName == "next") {
                validXML.children[validXML.children.length - 1].remove();
            }

            //validate selected block 
            //for selcted 
            //Following function find the step and return that block chain alone
            //Validate selected step block alone
            let tempWorkspce1 = new Blockly.Workspace();
            Blockly.Xml.domToBlock(tempWorkspce1, validXML);
            //normal validateion & no work validation
            let validate_sel_blcoks = tempWorkspce1.getAllBlocks();
            const th = this;

            //for rename
            let root_blk = block_selected.getRootBlock();
            //1.filter all the variables that needs to be renamed if Rename block used
            //2.Check Duplication (do not rename multiple columns with the same name).
            let { variableRenameList, duplicate } = GetRenameVariables(validate_sel_blcoks, SourceDataset, MappingList, work_datasets);

            let impact = new ImpactValidation(Standards, SourceDataset, validXML);
            impact.stepblk = validate_sel_blcoks;
            impact.MappingList = MappingList;
            impact.WorkDatatset = [];
            impact.variableRenameList = variableRenameList;
            impact.ImpactValidationOfUsedBlocks();
            impact.NCICODELISTDATA = NCICODELISTDATA;
            !impact.impacted && impact.ImapctNCICodeListValidationWorkspace();

            if (validXML &&
                StepBlockValidation("step_type_and_step_type_variable", validate_sel_blcoks)) {
                if (checkXML(validate_sel_blcoks)) {
                    if (!impact.impacted && duplicate.length == 0) {

                        const datasetName = validXML.querySelector('[name="temp_dsname"]').textContent;
                        const variablename = block_selected.getField("temp_varname");

                        if (datasetName !== "" && (!variablename || variablename.getValue() !== "")) {
                            let XMLValue = new XMLSerializer().serializeToString(validXML);
                            const xmlfinal = `<xml xmlns="https://developers.google.com/blockly/xml">` + XMLValue + `</xml>`;
                            //console.log(xmlfinal);

                            this.getSASMacro(xmlfinal).then((macro) => {
                                //console.log(macro);
                                if (macro !== "") {
                                    th.executeStepMacro(macro, datasetName, variablename);
                                } else {
                                    hideProgress();
                                }
                            });

                        } else {
                            let errorMsg = [];
                            datasetName === "" && errorMsg.push(<div key={errorMsg.length + 1}>{errorMsg.length + 1}. {"Enter Data Table Name."}</div>);
                            (variablename && variablename.getValue() === "") && errorMsg.push(<div key={errorMsg.length + 1}>{errorMsg.length + 1}. {"Enter Variable Name."}</div>);
                            errorModal(errorMsg);
                        }

                    }
                    else {
                        let err = [];
                        //!impact.work_exist && (err.push(FormErrorHtmlIfObj("The following Works are not available", impact.NotAvailWorkList)));
                        //Impact error
                        impact.impacted && (err.push(FormErrorHtmlIfObj("The following blocks are impacted", impact.ImpactedList)));

                        //column duplication error due to rename
                        duplicate.length > 0 && err.push(FormErrorIfArray("Rename variables should be unique", duplicate));

                        errorModal(err);
                    }
                }
            }
            else {
                errorModal("Mapping Rule cannot be empty.");
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    executeStepMacro = (stepmacro = "", dsname = "", varname = "") => {
        const thisObj = this;
        let { work_datasets } = thisObj.props;
        const execmacro = stepmacro;
        const StudyID = JSON.parse(sessionStorage.getItem("studyDetails")).studyID;
        showProgress();
        let ds = ''
        ds = dsname;
        let domain = ''
        if (this.props.action == CREATE) {
            domain = this.props.selectedTargetObj.TargetDomain;
        } else if (this.props.action == UPDATE) {
            domain = this.props.MappingConstruct.targetDataSet;
        }

        CallServerPost("Py/ExecSasWork", { 'program': execmacro, 'dataset': ds, 'username': JSON.parse(sessionStorage.userProfile).userName, 'domain': domain, StudyID: StudyID }).then((response) => {
            hideProgress();
            if (response.status == 1 && 'value' in response) {
                const res = response.value;

                if (res != undefined && res != null && res !== "") {
                    if ("LOG" in res && "LST" in res) {
                        thisObj.setState({ log: res["LOG"], lstHTML: res["LST"], sasmacro: execmacro });
                    } else if ("LOG" in res) {
                        thisObj.setState({ log: res["LOG"], sasmacro: execmacro, lstHTML: "" });
                    } else {
                        thisObj.setState({ sasmacro: execmacro, lstHTML: "", log: "" });
                    }
                    if ("dataset" in res && res["dataset"] != "") {
                        let returnJSON = (va) => {
                            try {
                                return JSON.parse(va);
                            }
                            catch (e) {
                                return []
                            }
                        }
                        try {
                            thisObj.props.addWorkTable(JSON.parse(res["dataset"]), ds, JSON.parse(res["columns"]), () => {
                                thisObj.setState({ WORK_BLOCKS: thisObj.workBlocks(thisObj.props.work_datasets) });
                            });
                        } catch (e) {
                            console.log('invalid json');
                        }

                    }
                } else {
                    errorModal("Something went wrong!");
                    thisObj.setState({ sasmacro: execmacro, lstHTML: "", log: res["LOG"] });
                }
            } else {
                errorModal("Something went wrong!")
                thisObj.setState({ sasmacro: execmacro, lstHTML: "", log: "" });
            }

        });
    }


    //For merge 
    mergeVariables = (obj) => {
        try {
            let { SourceDataset, Standards, MappingList } = thisObj.props.allValues;
            let { merge_name } = thisObj.state;
            let { work_datasets } = thisObj.props;

            let bothDatasetsPrimaryIds = [];

            //Get Used variable Blocks in Merge block
            let first_used_dataset = obj.getInputTargetBlock("datasets_to_merge");
            let second_used_dataset = first_used_dataset.getNextBlock();

            //Get what are all the variable need to Rename  
            let { variableRenameList, duplicate } = GetRenameVariables(obj.getDescendants(), SourceDataset, MappingList, work_datasets);
            if (duplicate.length == 0) {
                let getCommonVariavles = (block) => {
                    if (block) {
                        if ('data' in block && block.data !== null) {
                            let data = JSON.parse(block.data);
                            switch (data.blockType) {
                                case "Source":
                                    {
                                        bothDatasetsPrimaryIds.push(data.TABLE_NAME);

                                        //Rename the variable ,if a rename block exists 
                                        let renameVars = variableRenameList[data.TABLE_NAME + "@_" + "SourceVar"];

                                        let out = {};
                                        SourceDataset.Variable.filter(va => {
                                            if (va.TABLE_NAME === data.TABLE_NAME) {
                                                let renameTo = renameVars && renameVars[va.COLUMN_NAME] && renameVars[va.COLUMN_NAME].renameTo;

                                                let col_Name = isNotNull(renameTo) ? renameTo.toUpperCase() : va.COLUMN_NAME;

                                                out[col_Name] = { ...va, COLUMN_NAME: col_Name };
                                            }
                                        });
                                        return out;
                                    }
                                case "Target":
                                    {
                                        let target_variables = {};

                                        let varible = Standards.Variable.filter(
                                            v =>
                                                v.cdiscDataStdDomainMetadataID ===
                                                data.cdiscDataStdDomainMetadataID
                                        );


                                        bothDatasetsPrimaryIds.push(data.cdiscDataStdDomainMetadataID);
                                        //Rename the variable ,if a rename block exists 
                                        let renameVars = variableRenameList[data.domain + "@_" + "TargetVar"];

                                        varible.map(va => {
                                            let mappingConstruct = MappingDatas.MappingList.find(
                                                mapper =>
                                                    mapper.cdiscDataStdVariableMetadataID ===
                                                    va.cdiscDataStdVariableMetadataID
                                            );
                                            if (typeof mappingConstruct === 'object' &&
                                                mappingConstruct || (va.domain && strLowerCase(va.domain).includes('_int'))) {


                                                let renameTo = renameVars && renameVars[va.variableName] && renameVars[va.variableName].renameTo;
                                                let col_Name = isNotNull(renameTo) ? renameTo.toUpperCase() : va.variableName;

                                                target_variables[col_Name] = { ...va, variableName: col_Name };
                                            }
                                        });
                                        return target_variables;
                                    }
                                case "Work":
                                    {
                                        let out = {};
                                        bothDatasetsPrimaryIds.push(data.name);
                                        //Rename the variable ,if a rename block exists 
                                        let renameVars = variableRenameList[data.name + "@_" + "WorkVar"];
                                        work_datasets.filter(v => {
                                            if (v.memname.toUpperCase() === data.name.toUpperCase()) {
                                                let renameTo = renameVars && renameVars[v.name] && renameVars[v.name].renameTo;
                                                let col_Name = isNotNull(renameTo) ? renameTo.toUpperCase() : v.name;
                                                out[col_Name] = { ...v, name: col_Name };
                                            }
                                        });
                                        return out;
                                    }
                            }

                        }
                    }

                }


                if (first_used_dataset && second_used_dataset) {

                    let firstdataset_data = validJSON(first_used_dataset.data);
                    let firstdataset_name = firstdataset_data.blockType === "Source" ? firstdataset_data.TABLE_NAME : firstdataset_data.blockType === "Target" ? firstdataset_data.domain : firstdataset_data.name;

                    let seconddataset_data = validJSON(second_used_dataset.data);
                    let seconddataset_name = seconddataset_data.blockType === "Source" ? seconddataset_data.TABLE_NAME : seconddataset_data.blockType === "Target" ? seconddataset_data.domain : seconddataset_data.name;

                    if (merge_name !== "Merge(" + firstdataset_name + "," + seconddataset_name + ")") {
                        //Filter variable here                   
                        let first_datset_variable = getCommonVariavles(first_used_dataset);
                        let second_datset_variable = getCommonVariavles(second_used_dataset);
                        //FInd which dataset is this
                        let F_Dataset_Var_KeyName = firstdataset_data.blockType === "Source" ? "COLUMN_NAME" : firstdataset_data.blockType === "Target" ? "variableName" : "name";
                        let S_Dataset_Var_KeyName = seconddataset_data.blockType === "Source" ? "COLUMN_NAME" : seconddataset_data.blockType === "Target" ? "variableName" : "name";
                        //end

                        let HTML = [];
                        (Object.keys(first_datset_variable) || []).map(fst_dskey => {
                            let vari = first_datset_variable[fst_dskey];
                            if ((Object.keys(second_datset_variable) || []).some(sec_dskey => fst_dskey.toLocaleLowerCase() === sec_dskey.toLocaleLowerCase())) {
                                let data = vari;
                                if (data.COLUMN_NAME) {
                                    HTML.push(<React.Fragment key={"src_fgmt_key_" + data.TABLE_NAME + data.COLUMN_NAME}>
                                        <Block editable={false} type="variable_type_drop_multi" >
                                            <Field name="dropvar_name">
                                                {data.COLUMN_NAME.toUpperCase()}
                                            </Field>()
                                <data>{JSON.stringify({ ...data, bothParentDataset: bothDatasetsPrimaryIds.toString() })}</data>
                                        </Block>
                                    </React.Fragment>)
                                }
                                else if (data.variableName) {
                                    HTML.push(<React.Fragment key={"tgtfmt_var_" + data.variableName}>
                                        <Block editable={false} type="variable_type_drop_multi" >
                                            <Field name="dropvar_name">
                                                {data.variableName.toUpperCase()}
                                            </Field>
                                            <data>{JSON.stringify({ ...data, bothParentDataset: bothDatasetsPrimaryIds.toString() })}</data>
                                        </Block>
                                    </React.Fragment>);
                                }
                                else if (data.name) {
                                    HTML.push(<React.Fragment key={data.name + "work_fgv_key"}>
                                        <Block editable={false} type="variable_type_drop_multi" >
                                            <Field name="dropvar_name">
                                                {data.name.toUpperCase()}
                                            </Field>
                                            <data>{JSON.stringify({ ...data, bothParentDataset: bothDatasetsPrimaryIds.toString() })}</data>
                                        </Block>
                                    </React.Fragment>);
                                }
                                return false;
                            }
                        });
                        thisObj.setState({ DROPVAR: [], merge_name: "" }, () => {
                            thisObj.setState({ DROPVAR: HTML, merge_name: "Merge(" + firstdataset_name + "," + seconddataset_name + ")" });
                        })
                    }
                    else {
                        thisObj.setState({ DROPVAR: [], merge_name: "" });
                    }
                }
                else {
                    thisObj.setState({ DROPVAR: [], merge_name: "" });

                }
            }
            else {
                errorModal(FormErrorHtmlIfObj("Rename variables should be unique", duplicate));
            }

        }
        catch (e) {
            console.log(e);
        }
    }
    clearMergeVar = () => {
        thisObj.setState({ DROPVAR: [], merge_name: "" });
    }

    workspacecancel = () => {
        let { action } = this.props;
        Blockly.DropDownDiv.hide();
        Blockly.ContextMenu.hide();

        this.props.clearWorkSpace(action)
    }
    cancelCustom = () => {
        this.setState({ customVisible: false });
    }
    savecustomprogram = (program) => {
        this.setState({ customVisible: false, customprogram: program });
    }

    //importFromLibrary
    importFromLibrary = () => {
        const { MappingConstruct, action } = this.props;
        this.props.ImportDataFromMappingLibrary(MappingConstruct, this.formXMLByMappingLibrary);
    }

    formXMLByMappingLibrary = (importedMappingXML) => {
        Blockly.getMainWorkspace().clear();
        Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(), Blockly.Xml.textToDom(importedMappingXML.constructJson));
        this.props.setActiveKey();
    }
    getInitxml = (initialXml, MappingConstruct) => {
        return MappingConstruct && MappingConstruct.constructJson && MappingConstruct.constructJson != "" ? MappingConstruct.constructJson : initialXml
    }
    render() {
        const { DROPVAR, merge_name, WORKVARIABLETYPE1, WORKVARIABLETYPE2,
            paneSize, dsName, sasmacro, activeKey, MappingTitle,
            SOURCE, TARGET, WORK_BLOCKS, SOURCEVARIABLETYPE1, SOURCEVARIABLETYPE2, TARGETVARIABLETYPE1, TARGETVARIABLETYPE2,
            selected_sourceDS, selected_targetDS, selected_workDS,
            showConfirmation, blockInit, initXML, minSize, log, resultSet, loading, lstHTML, NCICODELISTDATA, initialXml, bulkMapData, customVisible, customprogram } = this.state;
        const { action, showProgramArea, MappingConstruct } = this.props;
        const { constructJson } = this.props.action === UPDATE ? MappingConstruct : {};


        const xml = this.props.action === CREATE ? this.getInitxml(initialXml, MappingConstruct) : constructJson && constructJson != "" ? constructJson : initialXml;
        return (
            <div style={{ height: "100%" }} id="BlocklyWorkspace" >
                <SplitPane split="horizontal"
                    onChange={size => {
                        window.dispatchEvent(new Event('resize'));
                        thisObj.setState({ paneSize: { first: size[0] + "px", second: size[1] + "px" } });
                    }}>
                    <Pane initialSize={paneSize.first} minSize="10%">
                        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <div style={{ height: "100%", display: blockInit ? "block" : "none", flexDirection: "column" }}>
                                <BlocklyComponent
                                    style={{ height: "100%", width: "100%" }}
                                    ref={this.simpleWorkspace}
                                    readOnly={false}
                                    move={{
                                        scrollbars: true,
                                        drag: true,
                                        wheel: true
                                    }}
                                    RemoveVariables={this.RemoveVariables}
                                    sourceVariableBlocks={this.SourceVariableBlocks}
                                    targetVariableBlocks={this.TargetVariableBlocks}
                                    workVariableBlocks={this.workVariableBlocks}
                                    setCurrentStep={this.setCurrentStep}
                                    manualClick={this.manualClick}
                                    mergeVariables={this.mergeVariables}
                                    clearMergeVar={this.clearMergeVar}
                                    initialXml={xml}>
                                    <Category name="Variable Operations" colour="%{BKY_LOGIC_HUE}">
                                        {
                                            this.props.mappingBlocks.filter(b => b.view_category === "variable_ops").map((block) => {
                                                return (
                                                    <Block type={block.type} >
                                                        <data>{JSON.stringify({ mappingBlockID: block.mappingBlockID, name: block.name, category: block.category, view_category: block.view_category, order: block.order, type: block.type })}
                                                        </data>
                                                    </Block>);
                                            })
                                        }
                                    </Category>
                                    <Category name="DataTable Operations" colour="%{BKY_LOGIC_HUE}">
                                        {
                                            this.props.mappingBlocks.filter(b => b.view_category === "datatable_ops" &&
                                                b.type.indexOf("exec") === -1).map((block) => {
                                                    return (
                                                        <Block type={block.type} >
                                                            <data>{JSON.stringify({ mappingBlockID: block.mappingBlockID, name: block.name, category: block.category, view_category: block.view_category, order: block.order, type: block.type })}
                                                            </data>
                                                        </Block>);
                                                })
                                        }
                                    </Category>
                                    <Category name="Literals" colour="%{BKY_LOGIC_HUE}">
                                        {
                                            this.props.mappingBlocks.filter(b => b.view_category === "literal_ops").map((block) => {
                                                return (
                                                    <Block type={block.type} >
                                                        <data>{JSON.stringify({ mappingBlockID: block.mappingBlockID, name: block.name, category: block.category, view_category: block.view_category, order: block.order, type: block.type })}
                                                        </data>
                                                    </Block>);

                                            })
                                        }
                                    </Category>
                                    <Category name="Conditions" colour="%{BKY_LOGIC_HUE}">
                                        {
                                            this.props.mappingBlocks.filter(b => b.view_category === "condition_ops").map((block) => {
                                                return (
                                                    <Block type={block.type} >
                                                        <data>{JSON.stringify({ mappingBlockID: block.mappingBlockID, name: block.name, category: block.category, view_category: block.view_category, order: block.order, type: block.type })}
                                                        </data>
                                                    </Block>);

                                            })
                                        }
                                    </Category>
                                    <Category name="Operation Attributes" colour="%{BKY_LOGIC_HUE}">

                                        {
                                            this.props.mappingBlocks.filter(b => b.view_category === "operation_attr_ops").map((block) => {
                                                return (
                                                    <Block type={block.type} >
                                                        <data>{JSON.stringify({ mappingBlockID: block.mappingBlockID, name: block.name, category: block.category, view_category: block.view_category, order: block.order, type: block.type })}
                                                        </data>
                                                    </Block>);

                                            })
                                        }
                                    </Category>

                                    <Category name="Source DataTable" colour="20">
                                        {SOURCE}
                                    </Category>
                                    <Category name="Target DataTable" colour="250">
                                        {TARGET}
                                    </Category>
                                    {WORK_BLOCKS.length > 0 && <Category name="Work DataTable" colour="250">
                                        {WORK_BLOCKS}
                                    </Category>
                                    }
                                    {
                                        NCICODELISTDATA.block.length > 0 &&
                                        <Category name={NCICODELISTDATA.name} colour="100">
                                            {NCICODELISTDATA.block}
                                        </Category>
                                    }

                                    {
                                        bulkMapData.block.length > 0 &&
                                        <Category name={bulkMapData.name} colour="100">
                                            {bulkMapData.block}
                                        </Category>
                                    }

                                    {SOURCEVARIABLETYPE1.length > 0 &&
                                        <Category name={selected_sourceDS} colour="65">
                                            {SOURCEVARIABLETYPE1}
                                        </Category>}

                                    {TARGETVARIABLETYPE1.length > 0 &&
                                        <Category name={selected_targetDS} colour="300">
                                            {TARGETVARIABLETYPE1}
                                        </Category>
                                    }
                                    {
                                        WORKVARIABLETYPE1.length > 0 &&
                                        <Category name={selected_workDS} colour="300">
                                            {WORKVARIABLETYPE1}
                                        </Category>
                                    }
                                    {
                                        DROPVAR.length > 0 &&
                                        <Category name={merge_name} colour="300">
                                            {DROPVAR}
                                        </Category>
                                    }
                                </BlocklyComponent>

                            </div>
                            <Row style={{ paddingTop: 10 }}>

                                <Button
                                    type="danger"
                                    onClick={() => this.workspacecancel(action)}
                                >
                                    {"Cancel"}
                                </Button>


                                <Button
                                    style={{ float: "right" }}
                                    className="ant-btn-primary"
                                    onClick={this.validateRule}
                                >
                                    <i className="fas fa-save" style={{ paddingRight: 5 }}></i>
                                    {action === CREATE ? CREATE : UPDATE}
                                </Button>
                                <Button
                                    style={{ float: "right", marginRight: 10 }}
                                    className="saveBtn"
                                    disabled={action === CREATE ? true : false}
                                    onClick={() => this.saveRule("Progress Save", true)}
                                >
                                    <i className="fas fa-save" style={{ paddingRight: 5 }}> </i>
                                    {"Save Progress"}
                                </Button>
                                <Button
                                    style={{ float: "right", marginRight: 10, height: 27 }}
                                    className="ant-btn-primary"
                                    onClick={() => {
                                        this.genrateProgram();
                                    }}
                                >
                                    <i className="fas fa-save" style={{ paddingRight: 5 }}></i>
                                    {"Generate Program"}
                                </Button>
                                <Button
                                    className="ant-btn tealbtn"
                                    style={{
                                        float: "right",
                                        marginRight: 10,
                                        height: 27,
                                        backgroundColor: "#08979C",
                                        color: "#fff"
                                    }}
                                    onClick={() => {
                                        this.importFromLibrary();
                                    }}
                                >
                                    <i className="fas fa-file-import" style={{ paddingRight: 5 }} ></i>
                                    {"Copy From Library"}
                                </Button>
                            </Row>
                        </div>
                    </Pane>
                    {showProgramArea &&
                        <Pane minSize={"20px"} initialSize={paneSize.second} style={{ display: showProgramArea ? "block" : "none" }}>
                            <BlockWorkResult log={log} lstHTML={lstHTML} sasmacro={sasmacro} executeMacro={this.executeMacro} />
                        </Pane>
                    }
                </SplitPane>
                {
                    customVisible && <CustomProgram
                        targetDomainVariable={this.props.targetDomainVariable}
                        programType={this.state.programType}
                        customVisible={customVisible}
                        saveprogram={this.savecustomprogram}
                        cancelCustom={this.cancelCustom}
                        customprogram={customprogram}
                        activityDetails={this.props.activityDetails}
                    />
                }
                <ConfirmModal loading={false} title="Update Mapping" SubmitButtonName="Update" onSubmit={this.saveRule} visible={showConfirmation} handleCancel={() => this.handleChangeReasonCancel()} />
            </div>
        );
    }
}

const WrappedApp = Form.create()(BlocklyWorkspace);

export default WrappedApp;


