import React, { Component } from 'react';
import Blockly from 'blockly/core';
import { hideProgress, showProgress, mappingPermission, CallServerPost, PostCallWithZone, validJSON, successModalCallback, errorModal } from "../Utility/sharedUtility";
import BlocklyComponent, { Block, Field, Category } from './Blockly';
import {
    Row,
    Button,
} from "antd";

let thisObj = {};

//following line for open flyout while drag from flyout
let SelectedCategory = {};

export default class ProgramWorkSpace extends Component {

    constructor(props) {
        super(props);
        this.FetchBlocks(props.mappingBlocks);

        let { TargetObj, domain } = props;
        let tarObj = TargetObj.find(x => x.Id === domain);
        let variable = tarObj ? tarObj.Children : [];

        let sort_seq_var = (props.AllTargetVariables && typeof props.AllTargetVariables === "object") ?
            props.AllTargetVariables.find(va => va.VariableName === domain + "SEQ")
            : [];


        this.state = {

            mapping_category: {},
            //only for check if tree node is changed (for validation purpose in getDerivedStateFromProps)
            selectedTarget: props.domain,
            selected_targetDS: props.domain,
            Sort_Seq_Variable: sort_seq_var,
            xml: new XMLSerializer().serializeToString(this.initialXml(props.AllTargetVariables, domain)),
            slectedTargetObj: props.TargetObj.find(x => x.Id === props.domain),
            TARGETDATASET: this.targetDatasetBlocks(props.TargetObj),
            TARGETVARIABLE: this.TargetVarBlockForSelectedTarget(variable, domain),

        };

        this.simpleWorkspace = React.createRef();
        thisObj = this;

    }

    //when tree click manualy load the Target Variable Category
    static getDerivedStateFromProps(currProps, oldState) {

        if (currProps.domain && currProps.domain !== oldState.selectedTarget) {

            //For update flyout (flyout remains open without highlighting)
            thisObj.hideToolBox();
            let { TargetObj, domain } = currProps;
            let tarObj = TargetObj.find(x => x.Id === domain);
            let variableObj = tarObj ? tarObj.Children : [];
            let formHTML = thisObj.TargetVarBlockForSelectedTarget(variableObj, domain);

            //For Update xml when tree node onchange 
            Blockly.getMainWorkspace().clear();
            let xml = thisObj.initialXml(currProps.AllTargetVariables, domain);
            Blockly.Xml.domToWorkspace(xml, Blockly.getMainWorkspace());
            //end
            let sort_seq_var = (currProps.AllTargetVariables && currProps.AllTargetVariables === "object") ?
                currProps.AllTargetVariables.find(va => va.VariableName === domain.toUpperCase() + "SEQ")
                : [];

            thisObj.setState({
                mapping_category: [],
                selectedTarget: domain,
                TARGETVARIABLE: formHTML,
                selected_targetDS: domain,
                Sort_Seq_Variable: sort_seq_var,
                slectedTargetObj: TargetObj.find(x => x.Id === domain)
            })
        }
    }

    componentDidUpdate() {
        //following function for open flyout while drag from flyout
        let workspace = Blockly.getMainWorkspace();

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
    
    //InitialXMl
    initialXml = (targetVariables, selectedDomain) => {
        
        //sort by order key
        let variableForSelDomain = targetVariables.filter(v => v.TargetDataSet === selectedDomain);
        const getInt = (inval) => {
            return inval && inval != "" ? parseInt(inval) : 0;
        }
        let variablesList = variableForSelDomain.sort((v2, v1) => getInt(v2.Order) < getInt(v1.Order) ? -1 : getInt(v2.Order) > getInt(v1.Order) ? 1 : 0)
        //console.log(variablesList)
        let order_xml = `<xml>
                    <block deletable="false" type="exec_order_of_execution" id="order_of_execution" x="287" y="130">
                        <field name="Order_of_Execution_name">Order of Execution</field>
                        <statement name="order_of_execution_statement">
                        </statement>
                    </block>
                </xml>`;
        let finDom = Blockly.Xml.textToDom(order_xml);
        let allBlocks = null;
        let firstChild = null;

        variablesList.map((variable, index) => {

            variable["blockType"] = "TargetVar";

            let text = `${selectedDomain}.${variable.TargetVariableName}`;
            let blockxml = "";

            if (index === 0) {
                variable["blockType"] = "TargetVar";

                let text = `${selectedDomain}.${variable.TargetVariableName}`;
                let byvar_blk_xml = this.form_by_var_block(variable);

                const nextel = variablesList.length > 0 ? "<next></next>" : "";
                blockxml = byvar_blk_xml ? `<block editable="false" id="` + text + `" type="variable_type_target_multi" >
                                                    <field name = "var_name"><![CDATA[`+ text + `]]></field>
                                                    <data><![CDATA[`+ JSON.stringify(variable) + `]]></data>
                                                    <value name="value_input">
                                                    <block type="exec_by_variables" id="exec_by_variables`+ text + `" >
                                                        <field name="NAME">By Variables</field>
                                                            <statement name="by_var_statement">
                                                            `+ byvar_blk_xml + `   
                                                            </statement>            
                                                    </block>
                                                    </value>
                                                    `+ nextel + `
                                                 </block>` :
                    `<block editable="false" id="` + text + `" type="variable_type_target_multi" >
                                                      <field name = "var_name"><![CDATA[`+ text + `]]></field>
                                                      <data><![CDATA[`+ JSON.stringify(variable) + `]]></data>
                                                    <value name="value_input">
                                                    <block type="exec_by_variables" id="exec_by_variables`+ text + `" >
                                                        <field name="NAME">By Variables</field>
                                                            <statement name="by_var_statement">
                                                            </statement>
                                                    </block>
                                                    </value>
                                                    `+ nextel + `
                                                </block>` ;
                allBlocks = Blockly.Xml.textToDom(blockxml);
            }
            else {

                let byvar_blk_xml = this.form_by_var_block(variable);
                const nextel = index < variablesList.length - 1 ? "<next></next>" : "";
                variable["blockType"] = "TargetVar";
                let text = `${selectedDomain}.${variable.TargetVariableName}`;
                const blockxmlin = byvar_blk_xml ? `
                                                    <block editable="false" id="` + text + `" type="variable_type_target_multi" >
                                                    <field name = "var_name"><![CDATA[`+ text + `]]></field>
                                                    <data><![CDATA[`+ JSON.stringify(variable) + `]]></data>
                                                    <value name="value_input">
                                                      <block type="exec_by_variables" id="exec_by_variables`+ text + `" >
                                                        <field name="NAME">By Variables</field>
                                                            <statement name="by_var_statement">
                                                            `+ byvar_blk_xml + `   
                                                            </statement>
                                                      </block>
                                                    </value>
                                                    `+ nextel + `
                                                    </block>` :
                    `<block editable="false" id="` + text + `" type="variable_type_target_multi" >
                                                    <field name = "var_name"><![CDATA[`+ text + `]]></field>
                                                    <data><![CDATA[`+ JSON.stringify(variable) + `]]></data>
                                                    <value name="value_input">
                                                    <block type="exec_by_variables" id="exec_by_variables`+ text + `" >
                                                        <field name="NAME">By Variables</field>
                                                            <statement name="by_var_statement">
                                                            </statement>
                                                    </block>
                                                    </value>
                                                    `+ nextel + `
                                                </block>`;
                let blockdomin = Blockly.Xml.textToDom(blockxmlin);
                var nodes = allBlocks.querySelectorAll('next');
                nodes[nodes.length - 1].appendChild(blockdomin);

            }


            finDom.querySelector("[name='order_of_execution_statement']").appendChild(allBlocks);
        });


        return finDom;
    }

    //form_by_var_block 
    form_by_var_block = (variable, selectedDomain) => {
        var Extra1 = variable.Extra1;
        if (Extra1) {

            let category_text = variable.TargetDataSet + "." + variable.TargetVariableName;

            var blockObj = {};
            blockObj["type"] = category_text;
            blockObj["colour"] = 120;
            blockObj["args0"] = [{ "type": "field_label_serializable", "name": "var_name" }, { "type": "input_value", "name": "value_input" }];
            blockObj["message0"] = "%1 %2";
            blockObj["previousStatement"] = [category_text];
            blockObj["nextStatement"] = [category_text];
            blockObj["inputsInline"] = false;


            Blockly.Blocks[category_text] = {

                init: function () {
                    //for to enable if it is not used in workspace except step block
                    this.highPriority = "";
                    this.jsonInit(blockObj);
                },
            }

            try {


                //get the used block in by_variable block 
                let Used_Variables_In_ByVar = validJSON(Extra1);



                let usedblk_in_byvar_xml = "";
                if (Used_Variables_In_ByVar && Used_Variables_In_ByVar.length > 0) {
                    Used_Variables_In_ByVar.reverse().map((usedblk_in_byvar, index) => {

                        if (index === 0) {
                            let text = usedblk_in_byvar.COLUMN_NAME;

                            usedblk_in_byvar_xml = `<block editable="false" id="` + text + `" type="` + category_text + `" >
                                          <field name = "var_name"><![CDATA[`+ text + `]]></field>
                                          <data><![CDATA[`+ JSON.stringify(usedblk_in_byvar) + `]]></data>
                                    </block>`;
                        }
                        else {
                            let text = usedblk_in_byvar.COLUMN_NAME;

                            usedblk_in_byvar_xml += `<block editable="false" id="` + text + `" type="` + category_text + `"  >
                                                            <field name = "var_name"><![CDATA[`+ text + `]]></field>
                                                            <data><![CDATA[`+ JSON.stringify(usedblk_in_byvar) + `]]></data>
                                                            <next>
                                                            `+ usedblk_in_byvar_xml + `
                                                            </next>
                                                         </block>`;
                        }

                    })
                }
                return usedblk_in_byvar_xml;
            }
            catch (e) {
                //console.log(e);
            }

        }
    }

    //Get All TheUsed Block From MappingXML
    getAllTheUsedBlockFromMappingXML = (block, data) => {

        let { mapping_category } = thisObj.state;
        let category_text = block.getFieldValue("var_name");
        if (mapping_category && typeof mapping_category === "object" && Object.keys(mapping_category).findIndex(vari => vari === category_text) === -1) {
            //Demo_update
            //TransBot1.0.1
            //    when we use var from category not working as expected

            if (data.Extra2) {
                let category_text = block.getFieldValue("var_name");

                var blockObj = {};
                blockObj["type"] = category_text;
                blockObj["colour"] = 120;
                blockObj["args0"] = [{ "type": "field_label_serializable", "name": "var_name" }, { "type": "input_value", "name": "value_input" }];
                blockObj["message0"] = "%1 %2";
                blockObj["previousStatement"] = [category_text];
                blockObj["nextStatement"] = [category_text];
                blockObj["inputsInline"] = false;


                Blockly.Blocks[category_text] = {

                    init: function () {
                        //for to enable if it is not used in workspace except step block
                        this.highPriority = "";
                        this.jsonInit(blockObj);
                    },

                }
                try {

                    let Used_Variables = validJSON(data.Extra2);
                    let htmlBlk = Used_Variables.map(va => {
                        return <block type={category_text} >
                            <field name={"var_name"} editable_={false}>{va.variableName}</field>
                            <data>{JSON.stringify({ ...va, COLUMN_NAME: va.variableName, TABLE_NAME: va.dataset })}</data>
                        </block>
                    });


                    if (htmlBlk.length > 0) {
                        let temp_mapping_category = mapping_category;

                        temp_mapping_category[category_text] = htmlBlk;

                        this.setState({ mapping_category: temp_mapping_category });
                    }
                }
                catch (e) {
                    //console.log(e);
                }
            }
        } else {
            let temp_mapping_category = mapping_category;

            delete temp_mapping_category[category_text];

            this.setState({ mapping_category: temp_mapping_category });
        }
    }



    //Hide Toolbox(Flyout) manualy 
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
            toolbox.getFlyout().hide();
            toolbox.clearSelection();
        }
    }

    //Blocks Initialization
    FetchBlocks = (mappingBlocks) => {
        const thisOb = this;
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

            if (mappingBlock["type"] !== "step_type" && mappingBlock["type"] !== "step_type_variable") {

                Blockly.Blocks[mappingBlock.type] = {

                    init: function () {
                        //for to enable if it is not used in workspace except step block
                        this.highPriority = mappingBlock.category === "step";
                        this.jsonInit(blockObj);

                        var thisBlock = this;

                        if (mappingBlock.tooltip) {
                            this.setTooltip(function () {
                                switch (thisBlock.type) {
                                    case "constant_type_multi":
                                        {
                                            let data = validJSON(thisBlock.data);
                                            if (data && data.cdiscDefinition && typeof data.cdiscDefinition === "string") {
                                                return data.cdiscDefinition;
                                            }
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            });
                        }
                    },

                }
            } else if (mappingBlock["type"] === "step_type" || mappingBlock["type"] === "step_type_variable") {
                Blockly.Blocks[mappingBlock.type] = {
                    init: function () {
                        //for to enable if it is not used in workspace except step block
                        this.highPriority = mappingBlock.category === "step";
                        this.jsonInit(blockObj);
                    },
                    customContextMenu: (options) => {
                        var option = {};
                        option.enabled = true;
                        option.text = 'Run Step';
                        option.callback = (block_selected) => {
                            thisOb.executeStep(block_selected);
                        };
                        options.unshift(option);
                        return options;
                    },
                };
            }

        });
    }

    //Target Block
    targetDatasetBlocks = targetVar => {
        //console.log("Target");
        //console.log(targetVar);
        return targetVar.map((target, index) => {
            let dataTarget = { ...target, blockType: "Target" };
            return (<React.Fragment key={target.Id + "_key"}>
                <Block editable={false} type="dataset_type_multi_target" >
                    <Field name="ds_name">
                        {target.Id}
                    </Field>
                    <data> {JSON.stringify({ ...dataTarget, category: "dataset" })}</data>
                </Block>
            </React.Fragment>);
        })
    };

    //Load Target Variable based on selected Target Block
    TargetVariableBlocks = (obj) => {

        let { TargetObj } = thisObj.props;

        //following line to open flyout while drag from flyout
        SelectedCategory = { Category: 1 }

        //Filter the varible for selected block(Target)
        let tarObj = TargetObj.find(x => x.Id === obj.Id);

        let variablesList = tarObj ? tarObj.Children : [];

        thisObj.setState({ TARGETVARIABLE: this.TargetVarBlockForSelectedTarget(variablesList, obj.Id), selected_targetDS: obj.Id });
    }

    TargetVarBlockForSelectedTarget = (variablesList, selectedDomain) => {

        let HTML = [];
        //sort by order key
        variablesList = variablesList.sort((v2, v1) => v2.Order < v1.Order ? -1 : v2.Order > v1.Order ? 1 : 0)
        //Demo_update
        //TransBot1.0.1
        //when we use var from category not working as expected
        variablesList.map((variable) => {

            variable["blockType"] = "TargetVar";
            let data = JSON.parse(variable.data);

            let text = `${selectedDomain}.${variable.Key}`;

            let blockText = `<block editable="false" type="variable_type_target_multi" >
                                          <field name = "var_name"><![CDATA[`+ text + `]]></field>
                                          <data><![CDATA[`+ JSON.stringify({ ...data, blockType: "TargetVar" }) + `]]></data>
                                    </block>`
            var block = Blockly.Xml.textToDom(blockText);
            HTML.push(block);

        });

        return HTML;
    }
    fnTargetVariable = () => {
        return thisObj.state.TARGETVARIABLE;
    }
    //End

    //when delete block followinf function will hit
    RemoveVariables = (obj) => {
        if (obj.blockType === "Target") {
            thisObj.setState({ TARGETVARIABLE: [] });
        }
    }
    //Save 
    save = () => {
        const thisObj = this;

        let xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());

        var StudyID = JSON.parse(sessionStorage.getItem("studyDetails")).studyID;

        let { domain } = thisObj.props;
        let { slectedTargetObj } = thisObj.state;
        //Filter the varible for selected block(Target)
        let targetvariable = (slectedTargetObj && typeof slectedTargetObj === "object") ?
            slectedTargetObj.Children : [];

        let domainID = targetvariable.length > 0 ? targetvariable[0].CDISCDataStdDomainMetadataID : 0;


        //get ordered block
        var result = this.validation("Save");
        if (!result.error) {
            //Get Sort Seq Block
            let exec_xml = new XMLSerializer().serializeToString(xml);
            var values =
            {
                StudyID: StudyID,
                domainName: domain,
                domainID: domainID,
                execution: result.out,
                exec_xml: exec_xml,

            };

            showProgress();

            PostCallWithZone("MappingOperations/UpdateOrder", values).then((response) => {
                //console.log(response);

                if (response.status === 1) {
                    successModalCallback("Order updated successfully", () => { thisObj.refresh() });
                } else {
                    errorModal(response.message);

                }
                hideProgress();
            });
        }
        else {
            errorModal(result.out);
        }
    }


    getOrderedBlocks = () => {
        //get ordered block
        let target_Variables = [];
        let uniqueKey = [];

        if (Blockly.getMainWorkspace() !== null) {
            let order_of_execution_blk = Blockly.getMainWorkspace().getBlocksByType("exec_order_of_execution");
            if (order_of_execution_blk[0].type === "exec_order_of_execution") {
                let tarVarLoop = (tar_Var_blk, index) => {

                    if (tar_Var_blk && "data" in tar_Var_blk) {
                        let data = validJSON(tar_Var_blk.data);

                        //set order
                        data.Order = index;

                        //set byvariables to extra key
                        let getByVar_Blocks = this.getByVariables(tar_Var_blk);
                        data.Extra1 = getByVar_Blocks ? JSON.stringify(getByVar_Blocks) : "";

                        target_Variables.push(data);

                        //Get Next Block
                        let nxtBlock = tar_Var_blk.getNextBlock();

                        return nxtBlock ? tarVarLoop(nxtBlock, (index + 1)) : false;
                    }
                }

                //get all the block from orderofexecution statement
                let TargetVariables = order_of_execution_blk[0].getInputTargetBlock("order_of_execution_statement");


                tarVarLoop(TargetVariables, 1);

                return target_Variables;
            }
            return target_Variables;
        }
        return target_Variables;
    }

    //when Save or Generate 
    getByVariables = (target_blk) => {

        let getblock_val_connection = target_blk.getOnlyValueConnection_();
        let by_variables = getblock_val_connection ? getblock_val_connection.targetBlock() : false;
        if (by_variables && typeof by_variables === "object" && by_variables.type === "exec_by_variables") {
            let used_var_in_xml = [];
            let statement_blocks = by_variables.getInputTargetBlock("by_var_statement");

            var get_all_used_var = (statement_block) => {
                if (statement_block && "data" in statement_block) {
                    let stmt_data = validJSON(statement_block.data);
                    let nxt_blk = statement_block.getNextBlock();

                    used_var_in_xml.push({ "COLUMN_NAME": stmt_data.COLUMN_NAME, "TABLE_NAME": stmt_data.TABLE_NAME })

                    if (nxt_blk && typeof nxt_blk === "object") {
                        get_all_used_var(nxt_blk);
                    }
                    return;
                }
            }
            get_all_used_var(statement_blocks)

            return used_var_in_xml.length > 0 ? used_var_in_xml : "";
        }
        else {
            return false;
        }
    }


    //Refresh 
    refresh = () => {
        return new Promise((resolve, reject) => {
            thisObj.props.refresh(resolve, reject);
        }).then((result) => {
            let { TargetObj, domain } = this.props;
            let tarObj = TargetObj.find(x => x.Id === domain);
            let variable = tarObj ? tarObj.Children : [];

            this.setState({
                TARGETVARIABLE: this.TargetVarBlockForSelectedTarget(variable, domain)
            }, hideProgress());

        }).catch(e => {
            //console.log(e);
        });
    }

    viewPythonTab = () => {
        //validate by varibles should be present when generate

        let usedByVar = Blockly.getMainWorkspace().getBlocksByType("exec_by_variables");

        let isvalid = this.validation("Generate");
        if (!isvalid.error) {
            thisObj.props.viewPythonTab(isvalid.out, thisObj.state.slectedTargetObj);
        }
        else {
            errorModal(isvalid.out);

        }

    }

    //following function do following validation.
    //By Variables should not be empty
    //By Variables should be present except for first variable

    validation = (action) => {
        let { slectedTargetObj } = this.state;
        let variable_for_selected_domain = slectedTargetObj && typeof slectedTargetObj === "object" ? slectedTargetObj.Children : [];


        // Get Order of execution block
        let order_blk = Blockly.getMainWorkspace().getBlocksByType("exec_order_of_execution");

        // Get Used Variable From Order of execution block
        let used_first_var_blk = order_blk[0].getInputTargetBlock("order_of_execution_statement");
        let index = 1;

        //it will be false when if variable block have no byVar means
        let allblk_hav_byvar = true;

        //it will be false when ByVar block have no variable input
        let byvarblk_hav_var = true;

        //Unique Block Validation
        let unique_vari_added = [];

        let target_Variables = [];
        let errmsg = [];

        let loopAllUsedStmtBlk = (var_blk) => {

            unique_vari_added.push(var_blk.getFieldValue("var_name"));

            //Demo_update
            //TransBot1.0.1
            //Allow By Var first var
            switch (action) {
                case "Generate":
                    {
                        //get used by var
                        let val_ip = var_blk.getInput("value_input");
                        let used_byvar = val_ip && val_ip.connection && val_ip.connection.targetBlock();
                        if (!var_blk.data.includes("custom_program_type")) {
                            if (used_byvar) {
                                if (!used_byvar.getInputTargetBlock("by_var_statement") &&
                                    byvarblk_hav_var) {
                                    byvarblk_hav_var = false;
                                    errmsg.push(
                                        <div key={errmsg.length + 1}>
                                            {errmsg.length + 1}.By Variables should not be empty.
                                        </div>
                                    );
                                }
                            }
                            else if (allblk_hav_byvar) {
                                allblk_hav_byvar = false;
                                errmsg.push(
                                    <div key={errmsg.length + 1}>
                                        {errmsg.length + 1}.By Variables should be present for all variables.
                                    </div>
                                );
                            }
                        }
                    }
                    break;

                case "Save":
                    //No Validation
                    break;
            }


            //the following code to get data
            if ("data" in var_blk) {
                let data = validJSON(var_blk.data);

                //set order
                data.Order = index;
                index++;

                //set byvariables to extra key
                let getByVar_Blocks = this.getByVariables(var_blk);
                data.Extra1 = getByVar_Blocks ? JSON.stringify(getByVar_Blocks) : "";

                target_Variables.push(data);

                //Get Next Block
                let nxtblk = var_blk.getNextBlock();

                //if any one of this following variable allblk_hav_byvar || byvarblk_hav_var  is false means no need to validate remaing blocks we can display the error message
                if ((allblk_hav_byvar || byvarblk_hav_var) && nxtblk) {
                    return loopAllUsedStmtBlk(nxtblk)
                }
                else {
                    let uniquevar_validation = [...new Set(unique_vari_added)];
                    if (uniquevar_validation.length !== unique_vari_added.length ||
                        (action === "Save" && variable_for_selected_domain.length > uniquevar_validation.length)) {
                        errmsg.push(
                            <div key={errmsg.length + 1}>
                                {errmsg.length + 1}.Invalid Variables.
                            </div>);

                    }


                    return errmsg.length > 0 ? { error: true, out: errmsg } :
                        { error: false, out: target_Variables }

                }
            }
        }

        return used_first_var_blk ? loopAllUsedStmtBlk(used_first_var_blk) :
            { error: true, out: "Order of Execution should not be empty." };
    }

    render() {
        let { TARGETDATASET, TARGETVARIABLE, selected_targetDS, xml, mapping_category } = this.state;
        let { mappingBlocks, domain, selectedDomain, activityWrkflowStatus } = this.props;
        let studyDetails = JSON.parse(sessionStorage.getItem("studyDetails"));
        let userDetails = JSON.parse(sessionStorage.getItem("userProfile"));
        let locked = JSON.parse(sessionStorage.projectStudyLockStatus);
        //workflowActivityStatusID =3 means  Annotation Inprogress
        //workflowActivityStatusID =4 means  Annotation Review
        //adminType User admin
        //ADMIN ,Mapping Inprogress ,Review ,Project and Study Manager only can annotate only we can annotate


        let role = sessionStorage.getItem("role");
        let roleID = validJSON(role).RoleID;
        //roleID 3 -> Project Manager
        //roleID 4 -> Study Manager

        return <Row style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ height: "100%", display: "block", flexDirection: "column" }}>
                <BlocklyComponent
                    style={{ height: "100%", width: "100%" }}
                    fnTargetVariable={this.fnTargetVariable}
                    readOnly={false}
                    move={{
                        scrollbars: true,
                        drag: true,
                        wheel: true
                    }}
                    targetVariableBlocks={this.TargetVariableBlocks}
                    RemoveVariables={this.RemoveVariables}
                    getAllTheUsedBlockFromMappingXML={this.getAllTheUsedBlockFromMappingXML}
                    initialXml={xml}
                >
                    <Category name="DataTable Operations" colour="%{BKY_LOGIC_HUE}">
                        {
                            mappingBlocks.filter(b => b.view_category === "datatable_ops" && b.type.indexOf("exec_") !== -1 && b.type !== "exec_order_of_execution").map((block_loc) => {
                                return (
                                    <Block type={block_loc.type} />
                                );

                            })
                        }
                    </Category>

                    {/*<Category name="Target DataTable" colour="250">*/}
                    {/*    {TARGETDATASET}*/}
                    {/*</Category>*/}

                    {TARGETVARIABLE &&
                        <Category custom="fnTargetVariable" name={selected_targetDS} colour="250" >
                        </Category>
                    }

                    {mapping_category && typeof mapping_category === "object" &&
                        Object.keys(mapping_category).map(cat => {
                            return <Category name={cat} colour="250" >
                                {mapping_category[cat]}
                            </Category>
                        })
                    }

                </BlocklyComponent>
            </div>
            <Row gutter={2} style={{ paddingRight: 2, paddingTop: 10 }}>
                <Button style={{ float: "right", marginLeft: 5 }}
                    className="saveBtn"
                    disabled={!mappingPermission(activityWrkflowStatus)}
                    onClick={() => this.save()}>
                    <i className="fas fa-save" style={{ paddingRight: 2 }}> Save </i>
                </Button>
                {/*Mapping Programmer roleid 7 */}
                {/*If Underreview means not allow Mapping Programmer to Genereate*/}
                <Button
                    style={{ float: "right" }}
                    type="primary"
                    disabled={!mappingPermission(activityWrkflowStatus)}
                    onClick={() => this.viewPythonTab()}
                >
                    Generate
                </Button>

            </Row>
        </Row>
    }
}
