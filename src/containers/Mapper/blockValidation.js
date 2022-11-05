import React from 'react';
import Blockly from 'blockly/core';
import { errorModal, getStudyID, validJSON, strLowerCase, CallServerPost, showProgress, hideProgress, isObject, isArray, isNotNull, errorModalCallback, isObjectCheck } from '../Utility/sharedUtility';
import { Block } from '../Program/Blockly';

let unique = [];
let msg = [];

export let checkXML = (usedBlocks, returnOnlyMsgs = false) => {

    //Unique variable to check if multiple same type block exist means it check  for one block
    msg = [];
    let errors = [];
    usedBlocks.map(block => {

        let blocktype = block.type;
        //condn to check root of the block is step category
        if (block.getRootBlock().highPriority) {
            if (validator[blocktype]) {
                let msg = validator[blocktype](block);
                if (msg) {
                    typeof msg === "string" ?
                        errors.push(msg) :
                        errors.push(...msg);
                }

            }
        }

    });

    if (!returnOnlyMsgs) {
        if (errors.length > 0) {
            let errorMsg = [];
            errors.map((er, i) => {
                //the following if remove duplicates
                if (er &&
                    errors.indexOf(er) === i) {
                    errorMsg.push(<div key={errorMsg.length + 1}>{errorMsg.length + 1}. {er}</div>)
                }
            })
            errorModal(errorMsg);
            return false;
        }
        else {
            return true
        }
    }
    else {
        return errors;
    }
}

let validator =
{
    map_type: (block) => {
        //About Map Block
        //This Block have two arguments
        //1.Statement argument name @Map
        // Map statement Accepts only one Dataset.--> this check will happen inbuilt 
        //2.Statement argument name @Conditions
        //Conditions statement should be condition(condition_type) --> this check will happen inbuilt ,
        //Condition may be single or multiple
        //Following fn will check Map statement block have one or multiple input.
        //mandatory check.

        //Map Statement
        let mapBlk_firstChild = block.getInputTargetBlock("map_value");
        let mapBlk_secondChild = mapBlk_firstChild ? mapBlk_firstChild.getNextBlock() : false;

        //Condn statement
        let condnBlock_firstChild = block.getInputTargetBlock("conditions")

        if (!mapBlk_firstChild || !condnBlock_firstChild) {
            return "Map block arguments should not be empty. Find any built in validations available in blockly.";
        }

        if (mapBlk_secondChild) {
            return "Only one argument is allowed for Map.";
        }


    },
    date_type: (block) => {
        //About Date Block
        //This Block have one statement argument
        //1.StatementBlock 
        //Accepts only one variable (Source,Target,Work)--> this check will happen inbuilt 
        //Following fn will check statement block have one or multiple input
        let dropDownValue = block.getFieldValue("op_name");

        let dateBlk_firstChild = block.getInputTargetBlock("input_block");
        let dateBlk_secondChild = dateBlk_firstChild ? dateBlk_firstChild.getNextBlock() : false;

        return !dateBlk_firstChild ?
            dropDownValue + " block arguments should not be empty. Find any built in validations available in blockly." :
            dateBlk_secondChild && !dropDownValue.toLowerCase().includes("datetime") ?
                "Only one argument is allowed for " + dropDownValue + "." :
                "";
    },
    hardcode_type: (block) => {
        //About Hardcode Block
        //This Block have one statement argument name @Hardcode
        //HardCode accepts only String / Integer literal. --> this check will happen inbuilt 
        //Following fn will check statement block have one or multiple input

        let hardcode_firstChild = block.getInputTargetBlock("hardcode_statement");
        let hardcode_secondChild = hardcode_firstChild ? hardcode_firstChild.getNextBlock() : false;

        return !hardcode_firstChild ?
            "Hardcode block arguments should not be empty. Find any built in validations available in blockly." :
            hardcode_secondChild ?
                "Only one argument is allowed for Hardcode." :
                "";
    },
    find_replace_type: (block) => {
        //About FindAndReplaceType Block
        //This Block have three arguments
        //1.Statement argument name @FindAndReplace
        //Accepts only Variable(Source,Target,Work) for first argument  --> this check will happen inbuilt
        //2.Textbox argument name @Find
        //3.TextBox argument name @Replace
        //Following fn will check FindAndReplace statement argument have one or multiple input
        //All fileds mandatory check

        //FindAndReplace
        let findReplace_firstChild = block.getInputTargetBlock("fr_statement");
        let findReplace_secondChild = findReplace_firstChild ? findReplace_firstChild.getNextBlock() : false;

        //Find Textbox
        let findText = block.getFieldValue("input_string_extra");

        //Replace Textbox
        let replaceText = block.getFieldValue("input_replace_string_extra");

        let err = [];

        if (!(findReplace_firstChild && findText && replaceText)) {
            err.push("FindAndReplace block arguments should not be empty. Find any built in validations available in blockly.");
        }

        if (findReplace_secondChild) {
            err.push("Only one argument is allowed for FindAndReplace.");
        }
        return err;
    },

    sort_operations: (block) => {
        //About Sort Block
        //This Block have one statement argument
        //Accepts only one Variable(Source,Target,Work) --> this check will happen inbuilt
        //Following fn will check Sort statement argument have one or multiple input
        //All fileds mandatory check

        let sort_firstChild = block.getInputTargetBlock("op_values");
        let sort_secondChild = sort_firstChild ? sort_firstChild.getNextBlock() : false;

        return !sort_firstChild ?
            "Sort block arguments should not be empty. Find any built in validations available in blockly." :
            sort_secondChild ?
                "Only one argument is allowed for Sort." :
                "";
    },

    sort_variable_operation: (block) => {
        //About Sort Variable Operation Block
        //This Block have two arguments
        //1.Statement argument name @Sort
        //Accepts only Dataset --> this check will happen inbuilt
        //2.Statement argument name @By Variables
        //Accepts only Variables  --> this check will happen inbuilt
        //Accepts Variables that only from the used dataset in Sort statement 
        //Following fn will check @By Variables accepts Variables that only from the used dataset in Sort statement
        //Following fn will check @Sort statement argument accepts only one dataset
        //All fileds mandatory check

        let isVarBlkNotFromSameDataset = false;
        let isNotVarBlock = false;
        let err = [];

        //get sort Statement Block
        let sort_statementBlk_firstChild = block.getInputTargetBlock("sort_variable");
        let sort_statementBlk_secondChild = sort_statementBlk_firstChild ? sort_statementBlk_firstChild.getNextBlock() : false;

        //get sort by variable statement block 
        let by_var = block.getInputTargetBlock("by_variables");

        if (!(sort_statementBlk_firstChild) ||
            !(by_var)) {
            err.push("Sort block arguments should not be empty. Find any built in validations available in blockly.");
        }
        if (sort_statementBlk_firstChild) {
            if (sort_statementBlk_firstChild && sort_statementBlk_secondChild) {
                err.push("Sort accepts only one Dataset.");
            }

            //by variable validation
            if ('data' in sort_statementBlk_firstChild && sort_statementBlk_firstChild.data !== null) {
                let sort_statementBlkData = JSON.parse(sort_statementBlk_firstChild.data);
                let sortDatasetName = sort_statementBlkData.blockType === "Source" ? sort_statementBlkData.TABLE_NAME : sort_statementBlkData.blockType === "Target" ? sort_statementBlkData.domain : sort_statementBlkData.name;

                var get_var = (b) => {
                    if (b && typeof b === "object") {

                        if (isVariableType(b.type)) {
                            if ('data' in b && b.data !== null) {
                                let data = JSON.parse(b.data);
                                // Variable based on source dataset
                                if ('TABLE_NAME' in data) {
                                    if (!isVarBlkNotFromSameDataset &&
                                        sortDatasetName !== data.TABLE_NAME) {
                                        err.push("By Variables should be from " + sortDatasetName + ".");
                                        isVarBlkNotFromSameDataset = true;
                                    }

                                }   //Variable based on Target dataset
                                else if ('cdiscDataStdDomainMetadataID' in data) {
                                    if (!isVarBlkNotFromSameDataset &&
                                        sortDatasetName !== data.domain) {
                                        err.push("By Variables should be from " + sortDatasetName + ".");
                                        isVarBlkNotFromSameDataset = true;
                                    }

                                }
                                else if ('name' in data) {
                                    if (!isVarBlkNotFromSameDataset &&
                                        sortDatasetName !== data.name) {
                                        err.push("By Variables should be from " + sortDatasetName + ".");
                                        isVarBlkNotFromSameDataset = true;
                                    }

                                }

                                if (isVarBlkNotFromSameDataset && isNotVarBlock) {
                                    return;
                                }

                                let nxtConnectedBlock = b.getNextBlock();
                                get_var(nxtConnectedBlock);
                            }
                            else if (!isVariableType(block.type)) {
                                isNotVarBlock = true;
                            }
                        }
                        else {
                            isNotVarBlock = true;
                        }
                    }
                }
                if (by_var) {
                    get_var(by_var);
                }

                //Sort Statement validation End
                if (isNotVarBlock) {
                    err.push("By Variable Should accept only Variables.");
                }
                return err;
            }
        }
        return err;
    },
    simple_ops_mutiple_args_type: (block) => {
        //About simple_ops_mutiple_args_type
        //This block have two argument(1,2)
        //1.Dropdown argument (DirectMove,NumToChar,CharToNum,UpperCase,LowerCase).
        //2.Statment argument ,
        //Statement argument accepts Variable --> this check will happen inbuilt,
        //Following fn will check statement argument accepts only one input.
        //All fileds mandatory check

        let dropDownValue = block.getFieldValue("op_name");
        let statementBlk_firstChild = block.getInputTargetBlock("input_block");
        let statementBlk_secondChild = statementBlk_firstChild ? statementBlk_firstChild.getNextBlock() : false;

        if (!statementBlk_firstChild) {
            return dropDownValue + " block arguments should not be empty. Find any built in validations available in blockly.";
        }
        else if (statementBlk_secondChild) {
            return "Only one argument is allowed for " + dropDownValue + ".";
        }
    },
    complex_ops_multi: (block) => {
        //About complex_ops_multi
        //This block have three arguments
        //1.Dropdown argument (Group Min,Max,Avg,Sum).
        //2.Statment argument name @ By Variables,
        //By Variables accepts Variable --> this check will happen inbuilt,
        //2.Statment argument name @ ID Variables,
        //ID Variables accepts Variable --> this check will happen inbuilt,
        //Following fn will check both By and ID Variables from same dataset.
        //Following fn will check ID Variables accepts only one input.
        //All fileds mandatory check

        let isVarBlkNotFromSameDataset = false;
        let isNotVarBlock = false;
        let dataset = [];
        let err = [];
        let dropDownValue = block.getFieldValue("op_name");

        //This below get_var function called at end of this function
        var get_var = (b) => {
            if (b && typeof b === "object") {

                if (isVariableType(b.type)) {
                    if ('data' in b && b.data !== null) {
                        let data = JSON.parse(b.data);

                        // Variable based on source dataset
                        if ('TABLE_NAME' in data) {
                            if (dataset.length === 0) {
                                dataset.push(data.TABLE_NAME);

                            }
                            else if (dataset.indexOf(data.TABLE_NAME) === -1) {
                                isVarBlkNotFromSameDataset = true;
                            }

                        }
                        //Variable based on Target dataset
                        else if ('cdiscDataStdDomainMetadataID' in data) {
                            if (dataset.length === 0) {
                                dataset.push(data.domain);
                            }
                            else if (dataset.indexOf(data.domain) === -1) {
                                isVarBlkNotFromSameDataset = true;
                            }

                        }

                        if (isVarBlkNotFromSameDataset && isNotVarBlock) {
                            return;
                        }
                        let nxtConnectedBlock = b.getNextBlock();
                        get_var(nxtConnectedBlock);

                    }
                    else if (!isVariableType(block.type)) {
                        isNotVarBlock = true;
                    }
                }
                else {
                    isNotVarBlock = true;
                }
            }
        }

        //get used variable block from by_variables statement in complex_ops_multi
        let by_var = block.getInputTargetBlock("by_variables");

        ////get used variable block from ID statement in complex_ops_multi
        let id_var = block.getInputTargetBlock("id_variable");

        if (!(id_var && typeof id_var === "object") ||
            !(by_var && typeof by_var === "object")) {
            err.push(dropDownValue + " block argument should not be empty. Find any built in validations available in blockly.");

        }

        //get used variable block from by_variables statement in complex_ops_multi
        get_var(by_var);

        //get used variable block from ID statement in complex_ops_multi
        if (id_var && typeof id_var === "object") {
            if (isVariableType(id_var.type)) {

                if (id_var && typeof id_var === "object" && id_var.getNextBlock()) {
                    err.push("ID Variables accepts only one Variables.");
                }

                get_var(id_var);

            }
            else {
                err.push("ID Variables accepts only Variables.");
            }
        }

        if (isVarBlkNotFromSameDataset) {
            err.push("BY/ID Variables should be from " + dataset[0] + ".");

        } if (isNotVarBlock) {
            err.push("BY/ID Variables accepts only Variables.");
        }
        return err;
    },
    merge_type: (block) => {
        //About Merge Block
        //This block have two arguments (1,2)
        //1.Statment argument name @Merge,
        //Merge accepts only dataset(Source,Target,Work) --> this check will happen inbuilt,
        //2.Statment argument name @By Variables,
        //By Variables accepts only drop type variables(Source,Target,Work) --> this check will happen inbuilt,
        //Following fn will check Merge argument should allow two dataset
        //Following fn will check By Variables arguments are should be common variable of Merge two dataset
        //All fileds mandatory check

        let err = [];
        //First argument StatementBlk
        let datasetBlk_firstChild = block.getInputTargetBlock("datasets_to_merge");
        let datasetBlk_secondChild = datasetBlk_firstChild ? datasetBlk_firstChild.getNextBlock() : false;

        //Second argument Statement Block
        let byVarBlk_firstChild = block.getInputTargetBlock("by_variables");

        //Last Field 
        let text = block.getFieldValue("if_condition_extra");

        if (!(datasetBlk_firstChild &&
            byVarBlk_firstChild &&
            text)) {
            err.push("Merge block arguments should not be empty. Find any built in validations available in blockly.");
        }


        //First StatementBlock (@Merge Block) accept only two datasets
        if (datasetBlk_firstChild) {
            if (datasetBlk_secondChild && !datasetBlk_secondChild.getNextBlock()) {
                //get Two DataSet UniqueIDs
                let datasetBlockIDs = [];
                (function () {
                    //get Two DataSet UniqueIDs 
                    //for to match with Varibles used in second statement block
                    let firstDatasetBlk = datasetBlk_firstChild;
                    let data1 = validJSON(firstDatasetBlk.data);

                    let secondDatasetBlk = datasetBlk_secondChild;
                    let data2 = validJSON(secondDatasetBlk.data);

                    datasetBlockIDs = [data1.primaryID, data2.primaryID];

                })();

                //Fn to check used Variable Blocks are from used datasets Blocks
                let isVarType = true;
                let commonVariable = true;

                let varBlockFn = (varBlk) => {
                    if (varBlk && typeof varBlk === "object") {
                        if (isVariableType(varBlk.type)) {
                            let data = validJSON(varBlk.data);
                            if (!data.bothParentDataset ||
                                datasetBlockIDs.toString() !== data.bothParentDataset) {
                                commonVariable = false;
                                err.push("By variables should be from the datasets used in Merge Argument.");
                            }
                        }
                        else {
                            isVarType = false;
                            err.push("By Variables Should accept only Variables.");
                        }

                        let nxtBlock = varBlk.getNextBlock();
                        if ((isVarType || commonVariable) && nxtBlock) {
                            varBlockFn(nxtBlock);
                        }
                    }
                }
                varBlockFn(byVarBlk_firstChild);
            }
            else {
                err.push("Merge should accept two Datasets.");
            }
        }
        return err;
    },
    input_format_type: (block) => {
        //About Input Format block
        //This block have one arguments(1)
        //1.Textbox arguments
        //Following fn to check Input Format allow only "C" or "N"
        //All fileds mandatory check
        let textboxValue = block.getFieldValue("input_format");
        if (!textboxValue || textboxValue === "") {
            return "Input Format should not be empty."
        }
        //else if (textboxValue &&
        //           (textboxValue.toLowerCase() !== "c" ||
        //    textboxValue.toLowerCase() !== "n"))
        //{
        //    return "Input Format should allow either C or N." 
        //}
    },
    output_format_type: (block) => {
        //About Output Format block
        //This block have one arguments(1)
        //1.Textbox arguments
        //Following fn to check Input Format allow only "C" or "N"
        //All fileds mandatory check
        let textboxValue = block.getFieldValue("output_format");
        if (!textboxValue || textboxValue === "") {
            return "Output Format should not be empty."
        }
        //else if (textboxValue &&
        //    (textboxValue.toLowerCase() !== "c" ||
        //    textboxValue.toLowerCase() !== "n")) {
        //    return "Output Format should allow either C or N."
        //}
    },
    id_variable_type: (block) => {
        //About ID Variable block
        //This block have one arguments (1)
        //1.Statment argument name @ID Variable,
        //Accepts only variable(Source,Target,Work) --> this check will happen inbuilt,
        //Following fn will check @ID Variable argument variable are single or multiple
        //All fileds mandatory check

        let statement_firstChild = block.getInputTargetBlock("id_variable");
        let statement_secondChild = statement_firstChild ? statement_firstChild.getNextBlock() : false;

        return !statement_firstChild ?
            "ID Variable block should not be empty. Find any built in validations available in blockly." :
            statement_secondChild ? "ID Variable block accepts only one variable." : "";
    },
    arithmatic_operations: (block) => {
        //About Arithmatic Operations block
        //This block have two arguments (1,2)
        //1.Dropdown argument [Add,Sub,Mul,Div],
        //2.Statement argument
        //Accepts only variable(Source,Target,Work) and int_constant_type_multi --> this check will happen inbuilt,
        //Following fn will check Statement argument value should be int_constant_type_multi and varibale
        //All fileds mandatory check

        let dropDownValue = block.getFieldValue("arithmatic_operations");

        //Statement Argument
        let firstChild = block.getInputTargetBlock("op_values");
        let err = [];

        if (!firstChild) {
            return dropDownValue + " should not be empty. Find any built in validations available in blockly.";
        }
        else {
            let checkOnlyVarTypeOrIntLiteral = (blk) => {
                if (blk && typeof blk === "object") {
                    if (isVariableType(blk.type) || blk.type === "int_constant_type_multi") {
                        let nxtBlk = blk.getNextBlock();
                        checkOnlyVarTypeOrIntLiteral(nxtBlk);
                    }
                    else {
                        err.push(dropDownValue + " should accept only Variable or Int Literal.");
                        return false;
                    }
                }

            }
            checkOnlyVarTypeOrIntLiteral(firstChild);
            return err;

        }
    },
    rename_type: (block) => {
        //About Rename block
        //This block have one arguments (1)
        //1.Textbox argument,
        //All fileds mandatory check
        let textboxValue = block.getFieldValue("rename_var");
        return textboxValue === "" ?
            "Rename block should not be empty. Find any built in validations available in blockly." :
            parseInt(textboxValue) ?
                "Rename block should accept only string." : "";
    },
    compress_type: (block) => {
        //About Compress Block
        //This block have Three arguments (1,2,3)
        //1.StatementBlock name @Compress
        //Accepts only variable (Source,Target,Work)--> this check will happen inbuilt 
        //2.Textbox arguments name @To Remove
        //3.Textbox arguments name @Modifier
        //Following fn will check Compress statement block have one or multiple input

        let err = [];
        //Compress statement block
        let firstChild = block.getInputTargetBlock("compressvariable");
        let secondChild = firstChild ? firstChild.getNextBlock() : false;

        //@To Remove textbox
        let remove = block.getFieldValue("remove");
        //Modifier Textbox
        let modifier = block.getFieldValue("modifier");

        if (!firstChild) {
            err.push("Compress block arguments should not be empty. Find any built in validations available in blockly.");
        }
        if (secondChild) {
            err.push("Compress block should accept only one Variables.");
        }

        return err;
    },
    filter_type: (block) => {
        //About Filter Variable block
        //This block have one arguments (1,2)
        //1.Statment argument name @Filter,
        //Accepts only Dataset(Source,Target,Work) --> this check will happen inbuilt,
        //2.Statment argument name @Condition,
        //Accepts only condition --> this check will happen inbuilt,
        //Following fn will check @ID Variable argument variable are single or multiple
        //All fileds mandatory check

        let err = [];
        //first argument
        let filter_firstChild = block.getInputTargetBlock("filter_value");
        let filter_secondChild = filter_firstChild ? filter_firstChild.getNextBlock() : false;

        //second argument
        let condnArg_firstChild = block.getInputTargetBlock("filter_condition");
        if (!condnArg_firstChild || !filter_firstChild) {
            err.push("Filter block argumnets should not be empty. Find any built in validations available in blockly.");
        }
        if (filter_firstChild) {
            if (filter_secondChild) {
                err.push("Filter block argumnets accepts only one Dataset.");
            }
        }
        return err;
    },
    set_type: (block) => {
        //About Set block
        //This block have one arguments (1)
        //1.Statement argument name @Set,
        //All fileds mandatory check

        let statement = block.getInputTargetBlock("set_statement");
        return !statement ?
            "Set block should not be empty. Find any built in validations available in blockly." :
            "";
    },
    eq_type: (block) => {
        //About eq_type block
        //This block have two arguments (1,2,3)
        //Dropdown values 
        //1.Statement argument  ,
        //2.Statement argument  ,
        //All fileds mandatory check
        //First statement
        let dropdownvalue = block.getFieldValue("operator_name");

        let statement_left = block.getInputTargetBlock("left_values");

        let statement_right = block.getInputTargetBlock("right_values");


        return (!statement_left || !statement_right) ?
            dropdownvalue + " arguments should not be empty. Find any built in validations available in blockly." :
            "";
    },
    andor_type: (block) => {
        //About andor_type block
        //This block have two arguments (1,2,3)
        //Dropdown values 
        //1.Statement argument  ,
        //2.Statement argument  ,
        //All fileds mandatory check

        let dropdownvalue = block.getFieldValue("operator");

        let statement_left = block.getInputTargetBlock("left_value");
        let statement_right = block.getInputTargetBlock("right_value");

        return (!statement_left || !statement_right) ?
            dropdownvalue + " arguments should not be empty. Find any built in validations available in blockly." :
            "";
    },
    condition_type: (block) => {
        //About Condition_Then block
        //This block have two arguments (1,2)
        //1.Statement argument  ,
        //2.Statement argument  ,
        //All fileds mandatory check

        //First statement
        let statement_firstChild = block.getInputTargetBlock("Condition");

        let statement_secondChild = block.getInputTargetBlock("Then");

        return (!statement_firstChild || !statement_secondChild) ?
            "Condition block arguments should not be empty. Find any built in validations available in blockly." :
            "";
    },
    where_type: (block) => {
        //About Where block
        //This block have two argument (1)
        //1.Statement argument  ,
        //All fileds mandatory check

        //First statement
        let statement = block.getInputTargetBlock("where_value");

        return (!statement) ?
            "Where block arguments should not be empty. Find any built in validations available in blockly." :
            "";
    },
    concatenate_type: (block) => {
        //About concatenate block
        //This block have one argument (1)
        //1.Statement argument  ,
        //All fileds mandatory check

        //First statement
        let statement = block.getInputTargetBlock("concatenate_statement");

        if (!statement) {
            return "Concatenate block arguments should not be empty. Find any built in validations available in blockly.";
        }
        else {
            let err =
            {
                intLitPresent: false,
                isVarBlkPresent: false,
                minBlk: 2,
                msg: []
            };

            let checkOnlyVarType = (blk, index) => {
                if (blk && typeof blk === "object") {
                    if (!err.intLitPresent && blk.type === "int_constant_type_multi") {
                        err.intLitPresent = !err.intLitPresent;
                        err.msg.push("Concatenate block should accept only string literal and variable block.");
                    }
                    if (!err.isVarBlkPresent && isVariableType(blk.type)) {
                        err.isVarBlkPresent = !err.isVarBlkPresent;
                    }

                    let nxtBlk = blk.getNextBlock();
                    //loop control

                    if (nxtBlk && (!err.intLitPresent || !err.isVarBlkPresent)) {
                        return checkOnlyVarType(nxtBlk, index + 1);
                    }
                    else {
                        if (index === 1) {
                            err.msg.push("Concatenate should have minimum 2 blocks ");
                        }
                        return !err.isVarBlkPresent ?
                            [...err.msg, "Concatenate block should accept atleast one variable."] : err.msg;
                    }

                }

            }
            return checkOnlyVarType(statement, 1);
        }
    },
    sort_seq_type: (block) => {
        //About sort_seq block
        //This block have one argument (1)
        //1.Statement argument  ,
        //All fileds mandatory check

        let err = [];
        //First statement
        let statement = block.getInputTargetBlock("by_variables");

        if (!statement) {
            return "Seq By Variables block arguments should not be empty. Find any built in validations available in blockly.";
        }
        else {
            //Check DataType it shoul be variable 
            let dataType_check_err = false;
            //Variable should be from same dataset
            let var_from_same_dataset_check_err = false;
            let data = JSON.parse(statement.data);

            let fromDatasetName = "TABLE_NAME" in data ? data.TABLE_NAME : data.domain;

            let is_variable_from_samedataset = (blk) => {
                if (blk && typeof blk === "object") {
                    if (isVariableType(blk.type)) {
                        if ('data' in blk && blk.data !== null && !var_from_same_dataset_check_err) {
                            let data = JSON.parse(blk.data);
                            // Variable based on source dataset
                            if ('TABLE_NAME' in data) {
                                if (!var_from_same_dataset_check_err &&
                                    fromDatasetName !== data.TABLE_NAME) {
                                    err.push("Seq By Variables block should be from " + fromDatasetName + ".");
                                    var_from_same_dataset_check_err = true;
                                }
                            }
                            //Variable based on Target dataset
                            else if ('cdiscDataStdDomainMetadataID' in data) {
                                if (!var_from_same_dataset_check_err &&
                                    fromDatasetName !== data.domain) {
                                    err.push("Seq By Variables block should be from " + fromDatasetName + ".");
                                    var_from_same_dataset_check_err = true;
                                }
                            }
                        }
                    }
                    else {
                        dataType_check_err = true;
                        err.push("Seq By Variables block should accept only variables.");
                    }

                    if (!dataType_check_err || !var_from_same_dataset_check_err) {
                        let nxtBlk = blk.getNextBlock();
                        if (nxtBlk) {
                            is_variable_from_samedataset(nxtBlk);
                        }
                    }
                    else {
                        return;
                    }
                }
            }

            is_variable_from_samedataset(statement);
            return err;
        }
    },
    constant_type_multi: (block) => {
        //About Literal block
        //Blocks can be empty for null/empty check
        return "";
    },
    keep_drop_type2: (block) => {
        //About Keep Drop block
        //This block have two arguments (1,2)
        //1.Dropdown argument (Keep,Drop)
        //2.Statement argument
        //Accepts only variable(Source,Target,Work)  --> this check will happen inbuilt,
        //All fileds mandatory check
        let err = [];
        let dropDownValue = block.getFieldValue("keep_drop");

        //Statement Argument
        let statement = block.getInputTargetBlock("variables");

        if (!statement) {
            return dropDownValue + " should not be empty. Find any built in validations available in blockly.";
        }
        else {
            //Check DataType it shoul be variable or int_constant_type_multi
            let dataType_check_err = false;
            //Variable should be from same dataset
            let var_from_same_dataset_check_err = false;

            let data = JSON.parse(statement.data);

            //get first used datasetname
            let fromDatasetName = getDatasetByVar(data);

            let is_variable_from_samedataset = (blk) => {
                if (blk && typeof blk === "object") {
                    if (isVariableType(blk.type) || blk.type === "int_constant_type_multi") {
                        if ('data' in blk && blk.data !== null && !var_from_same_dataset_check_err) {
                            let data = JSON.parse(blk.data);

                            let prevBlock = block && block.getPreviousBlock();
                            if (prevBlock && prevBlock != "" && typeof prevBlock == 'object' && (prevBlock.type != "merge_type" && prevBlock.type != "set_type")) {
                                // Variable based on source dataset
                                switch (data.blockType) {
                                    case "SourceVar":
                                        if (!var_from_same_dataset_check_err &&
                                            fromDatasetName !== data.TABLE_NAME) {
                                            err.push(dropDownValue + " block should be from " + fromDatasetName + ".");
                                            var_from_same_dataset_check_err = true;
                                        }
                                        break;
                                    case "TargetVar":
                                        if (!var_from_same_dataset_check_err &&
                                            fromDatasetName !== data.domain) {
                                            err.push(dropDownValue + " block should be from " + fromDatasetName + ".");
                                            var_from_same_dataset_check_err = true;
                                        }
                                        break;
                                    case "WorkVar":
                                        if (!var_from_same_dataset_check_err &&
                                            fromDatasetName !== data.dataset) {
                                            err.push(dropDownValue + " block should be from " + fromDatasetName + ".");
                                            var_from_same_dataset_check_err = true;
                                        }
                                        break;
                                }
                            }
                        }
                    }
                    else {
                        dataType_check_err = true;
                        err.push(dropDownValue + " block should accept only variables and Int literals.");
                    }

                    if (!dataType_check_err || !var_from_same_dataset_check_err) {
                        let nxtBlk = blk.getNextBlock();
                        if (nxtBlk) {
                            is_variable_from_samedataset(nxtBlk);
                        }
                    }
                    else {
                        return;
                    }
                }
            }

            is_variable_from_samedataset(statement);
            return err;

        }
    },
    transpose_operation: (block) => {
        //About complex_ops_multi
        //This block have three arguments
        //1.Dropdown argument (Group Min,Max,Avg,Sum).
        //2.Statment argument name @ By Variables,
        //By Variables accepts Variable --> this check will happen inbuilt,
        //2.Statment argument name @ ID Variables,
        //ID Variables accepts Variable --> this check will happen inbuilt,
        //Following fn will check both By and ID Variables from same dataset.
        //Following fn will check ID Variables accepts only one input.
        //All fileds mandatory check

        let var_from_same_dataset_check_err = false;
        let isNotVarBlock = false;
        let err = [];

        function transpose_validation(blk) {
            this.TranseBlock = blk;
            this.usedDataset = {};
            this.usedDatasetName = "";
            this.allUsedBlock = [];

        }


        transpose_validation.prototype.begins = function () {

            let { TranseBlock } = this;

            //Check Multi dataset are used
            this.allDataset = TranseBlock.getInputTargetBlock("transpose_dataset");

            if (this.isAllValuePresent()) {
                return this.datasetvalidation();
            }
            else {
                return err;
            }

        }

        //Check mandatory
        transpose_validation.prototype.isAllValuePresent = function () {
            //temp variable
            let out = true;
            [{ type: "transpose_dataset", name: "Transpose" },
            { type: "by_variables", name: "By Variable(s)" },
            { type: "var_variables", name: "VAR Variable(s)" }].map((stmt) => {

                if (!block.getInputTargetBlock(stmt.type)) {
                    out = false;
                    err.push(stmt.name + " should not be empty.")
                }
            });

            return out;
        }

        //Check Only SIngle dataset
        transpose_validation.prototype.datasetvalidation = function () {
            let { allDataset, TranseBlock } = this;

            if (allDataset && "getNextBlock" in allDataset && !allDataset.getNextBlock()) {

                let dataset = allDataset.getDescendants()[0];
                let data = JSON.parse(dataset.data);

                this.usedDataset = data;
                this.usedDatasetName = getDataset(data);
                this.allUsedBlock = TranseBlock.getDescendants();
                return this.isAllVarFromUsedDataset();

            }
            else {
                err = ["Transpose block should accept only one Dataset."];
                return err;
            }
        }

        //Check all var from same used dataset
        transpose_validation.prototype.isAllVarFromUsedDataset = function () {
            let { allUsedBlock, usedDatasetName } = this;

            function isVarFromUsedDataset(blk, statementname, notCheckMandatory = false) {
                if (blk && typeof blk === "object") {
                    if (isVariableType(blk.type)) {
                        if ('data' in blk && blk.data !== null) {
                            let data = JSON.parse(blk.data);

                            // Variable based on source dataset
                            switch (data.blockType) {
                                case "SourceVar":
                                    if (usedDatasetName !== data.TABLE_NAME) {
                                        err.push(statementname + " block should be from " + usedDatasetName + ".");
                                        var_from_same_dataset_check_err = true;
                                    }
                                    break;
                                case "TargetVar":
                                    if (usedDatasetName !== data.domain) {
                                        err.push(statementname + " block should be from " + usedDatasetName + ".");
                                        var_from_same_dataset_check_err = true;
                                    }
                                    break;
                                case "WorkVar":
                                    if (usedDatasetName !== data.dataset) {
                                        err.push(statementname + " block should be from " + usedDatasetName + ".");
                                        var_from_same_dataset_check_err = true;
                                    }
                                    break;
                            }

                        }
                    }
                    else {
                        isNotVarBlock = true;

                        err.push(statementname + " block should accept only variables.");
                    }

                    let nxtBlk = blk.getNextBlock();
                    if (nxtBlk) {
                        isVarFromUsedDataset(nxtBlk, statementname);
                    }
                    else {
                        return;
                    }

                }
                else {
                    !notCheckMandatory && err.push(statementname + " block argument should not be empty.Find any built in validations available in blockly");

                }

            }

            //get used variable block from by_variables statement in complex_ops_multi
            isVarFromUsedDataset(block.getInputTargetBlock("by_variables"), "By Variable(s)");
            isVarFromUsedDataset(block.getInputTargetBlock("var_variables"), "VAR Variable(s)");

            //For only variable only allowed validation
            isVarFromUsedDataset(block.getInputTargetBlock("copy_variables"), "Copy Variable(s)", true);
            isVarFromUsedDataset(block.getInputTargetBlock("id_variable"), "ID Variable(s)", true);

            return err;

        }


        var transposevalidation = new transpose_validation(block);
        return transposevalidation.begins();
    },

    bulkmap_type: (block) => {
        //About BulkMap Block
        //This Block have three arguments
        //1.Statement argument name @BulkMap
        // BulkMap statement Accepts only one Source Datatable variable/Target Datatable varaible.--> this check will happen inbuilt
        //2.Statement argument name @Config variable
        // Config variable will accept only bulkmap variables from operations section
        //3.Statement argument name @Condition
        //Conditions statement should be condition(condition_type) --> this check will happen inbuilt ,
        //Condition may be single or multiple
        //Following fn will check BulkMap statement block have one or multiple input.
        //mandatory check.

        //BulkMap Statement
        let bulkmapBlk_firstChild = block.getInputTargetBlock("map_value");
        let bulkmapBlk_secondChild = bulkmapBlk_firstChild ? bulkmapBlk_firstChild.getNextBlock() : false;

        //Config variable statement
        let configBlock_firstChild = block.getInputTargetBlock("config_variable");
        let configBlock_secondChild = configBlock_firstChild ? configBlock_firstChild.getNextBlock() : false;

        if (!bulkmapBlk_firstChild || !configBlock_firstChild) {
            return "Bulk Map block arguments should not be empty. Find any built in validations available in blockly.";
        }
        if (bulkmapBlk_secondChild) {
            return "Only one argument is allowed for BulkMap.";
        }

        if (configBlock_secondChild) {
            return "Only one argument is allowed for Config variable.";
        }
    },

    unitconvert_type: (block) => {
        //About UnitConversion Block
        //This Block have six arguments
        //1.Statement argument name @UnitConversion
        // UnitConversion statement Accepts only one Source Datatable variable/Target Datatable varaible.--> this check will happen inbuilt
        //2.Statement argument name @TestName
        // TestName variable will accept only input
        //3.Statement argument name @TestCode
        // TestCode variable will accept only input
        //4.Statement argument name @Specimen
        // Specimen variable will accept only input
        //5.Statement argument name @Category
        // Category variable will accept only input
        //6.Statement argument name @Condition
        //Conditions statement should be condition(condition_type) --> this check will happen inbuilt ,
        //Condition may be single or multiple
        //Following fn will check UnitConversion statement block have one or multiple input.
        //mandatory check.

        //UnitConversion Statement
        let unitconvBlk_firstChild = block.getInputTargetBlock("map_value");
        let unitconvBlk_secondChild = unitconvBlk_firstChild ? unitconvBlk_firstChild.getNextBlock() : false;

        //TestName Statement
        let testnameBlk_firstChild = block.getInputTargetBlock("test_name");
        let testnameBlk_secondChild = testnameBlk_firstChild ? testnameBlk_firstChild.getNextBlock() : false;

        //TestCode Statement
        let testcodeBlk_firstChild = block.getInputTargetBlock("test_code");
        let testcodeBlk_secondChild = testcodeBlk_firstChild ? testcodeBlk_firstChild.getNextBlock() : false;

        //TestCategory Statement
        let testcategoryBlk_firstChild = block.getInputTargetBlock("test_cat");
        let testcategoryBlk_secondChild = testcategoryBlk_firstChild ? testcategoryBlk_firstChild.getNextBlock() : false;

        //TestSpecimen Statement
        let testspecBlk_firstChild = block.getInputTargetBlock("test_spec");
        let testspecBlk_secondChild = testspecBlk_firstChild ? testspecBlk_firstChild.getNextBlock() : false;

        //Mandatory check
        if ((!unitconvBlk_firstChild && (!testnameBlk_firstChild || !testcodeBlk_firstChild || !testcategoryBlk_firstChild || !testspecBlk_firstChild))) {
            return "Unit Conversion block arguments should not be empty. Find any built in validations available in blockly.";
        }
        else if ((unitconvBlk_firstChild && (!testnameBlk_firstChild && !testcodeBlk_firstChild && !testcategoryBlk_firstChild && !testspecBlk_firstChild))) {
            return "Unit Conversion block arguments should not be empty. Find any built in validations available in blockly.";
        }
        else {
            if ((!unitconvBlk_firstChild && (testnameBlk_firstChild || testcodeBlk_firstChild || testcategoryBlk_firstChild || testspecBlk_firstChild)))
                return "Unit Conversion block arguments should not be empty. Find any built in validations available in blockly.";
        }

        //Second value check
        if (unitconvBlk_secondChild) {
            return "Only one argument is allowed for Unit Conversion.";
        }
        else if (testnameBlk_secondChild) {
            return "Only one argument is allowed for Test Name.";
        }
        else if (testcodeBlk_secondChild) {
            return "Only one argument is allowed for Test Code.";
        }
        else if (testcategoryBlk_secondChild) {
            return "Only one argument is allowed for Test Category.";
        }
        else {
            if (testspecBlk_secondChild) {
                return "Only one argument is allowed for Specimen.";
            }
        }
    },

    substring_type: (block) => {
        //About Substring Block
        //This Block have three arguments
        //1.Statement argument name @Substring
        //Accepts only Variable(Source,Target,Work) for first argument  --> this check will happen inbuilt
        //2.Textbox argument name @start is mandatory
        //3.TextBox argument name @end is optional
        //Following fn will check Substring statement argument have one or multiple input
        //All fileds mandatory check

        //Substring
        let substring_firstChild = block.getInputTargetBlock("fr_statement");
        let substring_secondChild = substring_firstChild ? substring_firstChild.getNextBlock() : false;

        //Start Textbox
        let startText = block.getFieldValue("start_extra");

        //End Textbox
        let endText = block.getFieldValue("end_extra");

        let err = [];

        //Mandatory Check
        if (!(substring_firstChild && startText)) {
            err.push("SubString block arguments should not be empty. Find any built in validations available in blockly.");
        }

        //Second value check
        if (substring_secondChild) {
            err.push("Only one argument is allowed for SubString.");
        }
        return err;
    },

    unit_operations: (block) => {
        //About unit_operations block
        //This block have one arguments
        //Dropdown values (TestCode, Specimen , Category)
        //All fileds mandatory check
        //First statement

        //Unit Operations
        let dropdownvalue = block.getFieldValue("unit_operations");

        //SourceTestName statement
        let sourcetestnameBlk_firstChild = block.getInputTargetBlock("input_block");
        let sourcetestnameBlk_secondChild = sourcetestnameBlk_firstChild ? sourcetestnameBlk_firstChild.getNextBlock() : false;

        //Multi input check
        if (sourcetestnameBlk_secondChild) {
            return "Only one argument is allowed for " + dropdownvalue + ".";
        }

        //Mandatory Check
        return (!sourcetestnameBlk_firstChild) ?
            dropdownvalue + " arguments should not be empty. Find any built in validations available in blockly." :
            "";
    },

    unitresult_type: (block) => {
        //About UnitResultConversion Block
        //This Block have seven arguments
        //1.Statement argument name @UnitResultConversion
        // UnitResultConversion statement Accepts only one Source Datatable variable/Target Datatable varaible.--> this check will happen inbuilt
        //2.Statement argument name @UnitVariable
        // TestName variable will accept only input
        //3.Statement argument name @TestName
        // TestName variable will accept only input
        //4.Statement argument name @TestCode
        // TestCode variable will accept only input
        //5.Statement argument name @Specimen
        // Specimen variable will accept only input
        //6.Statement argument name @Category
        // Category variable will accept only input
        //7.Statement argument name @Condition
        //Conditions statement should be condition(condition_type) --> this check will happen inbuilt ,
        //Condition may be single or multiple
        //Following fn will check UnitConversion statement block have one or multiple input.
        //mandatory check.

        //UnitConversion Statement
        let unitresultBlk_firstChild = block.getInputTargetBlock("map_value");
        let unitresultBlk_secondChild = unitresultBlk_firstChild ? unitresultBlk_firstChild.getNextBlock() : false;

        //UnitVariable Statement
        let unitvar_firstChild = block.getInputTargetBlock("unit_variable");
        let unitvar_secondChild = unitvar_firstChild ? unitvar_firstChild.getNextBlock() : false;

        //TestName Statement
        let testnameBlk_firstChild = block.getInputTargetBlock("test_name");
        let testnameBlk_secondChild = testnameBlk_firstChild ? testnameBlk_firstChild.getNextBlock() : false;

        //TestCode Statement
        let testcodeBlk_firstChild = block.getInputTargetBlock("test_code");
        let testcodeBlk_secondChild = testcodeBlk_firstChild ? testcodeBlk_firstChild.getNextBlock() : false;

        //TestCategory Statement
        let testcategoryBlk_firstChild = block.getInputTargetBlock("test_cat");
        let testcategoryBlk_secondChild = testcategoryBlk_firstChild ? testcategoryBlk_firstChild.getNextBlock() : false;

        //TestSpecimen Statement
        let testspecBlk_firstChild = block.getInputTargetBlock("test_spec");
        let testspecBlk_secondChild = testspecBlk_firstChild ? testspecBlk_firstChild.getNextBlock() : false;

        //Mandatory Check
        if ((!unitresultBlk_firstChild && !unitvar_firstChild && (!testnameBlk_firstChild || !testcodeBlk_firstChild || !testcategoryBlk_firstChild || !testspecBlk_firstChild))) {
            return "Unit Result Conversion block arguments should not be empty. Find any built in validations available in blockly.";
        }
        else if ((unitresultBlk_firstChild && !unitvar_firstChild && (!testnameBlk_firstChild && !testcodeBlk_firstChild && !testcategoryBlk_firstChild && !testspecBlk_firstChild))) {
            return "Unit Result Conversion block arguments should not be empty. Find any built in validations available in blockly.";
        }
        else if ((!unitresultBlk_firstChild || unitvar_firstChild && (!testnameBlk_firstChild && !testcodeBlk_firstChild && !testcategoryBlk_firstChild && !testspecBlk_firstChild))) {
            return "Unit Result Conversion block arguments should not be empty. Find any built in validations available in blockly.";
        }
        else if (((unitresultBlk_firstChild || !unitvar_firstChild) && (!testnameBlk_firstChild && !testcodeBlk_firstChild && !testcategoryBlk_firstChild && !testspecBlk_firstChild))) {
            return "Unit Result Conversion block arguments should not be empty. Find any built in validations available in blockly.";
        }
        else {
            if ((!unitresultBlk_firstChild || !unitvar_firstChild && (testnameBlk_firstChild || testcodeBlk_firstChild || testcategoryBlk_firstChild || testspecBlk_firstChild)))
                return "Unit Result Conversion block arguments should not be empty. Find any built in validations available in blockly.";
        }

        //Multi input check
        if (unitresultBlk_secondChild) {
            return "Only one argument is allowed for Unit Result Conversion.";
        }
        else if (unitvar_secondChild) {
            return "Only one argument is allowed for Unit Variable.";
        }
        else if (testnameBlk_secondChild) {
            return "Only one argument is allowed for Test Name.";
        }
        else if (testcodeBlk_secondChild) {
            return "Only one argument is allowed for Test Code.";
        }
        else if (testcategoryBlk_secondChild) {
            return "Only one argument is allowed for Test Category.";
        }
        else {
            if (testspecBlk_secondChild) {
                return "Only one argument is allowed for Specimen.";
            }
        }

    }

}



let getDataset = (data) => {
    if ("blockType" in data) {
        switch (data.blockType) {
            case "Source":
                //console.log("s")
                return data.TABLE_NAME

            case "Target":
                return data.domain

            case "Work":
                return data.name
            default:
                return "";
        }
    }

}
let getDatasetByVar = (data) => {
    if ("blockType" in data) {
        switch (data.blockType) {
            case "SourceVar":
                //console.log("s")
                return data.TABLE_NAME

            case "TargetVar":
                return data.domain

            case "WorkVar":
                return data.dataset
            default:
                return "";
        }
    }
}

let isVariableType = (type) => {
    let varaibleBlocks = ["variable_type_drop_multi",
        "variable_type_target_multi", "variable_type_source_multi",
        "variable_type_work_multi",
        "variable_type_drop_multi",
        "variable_type_work_multi_2",
        "variable_type_target_multi_2",
        "variable_type_source_multi_2"];
    return varaibleBlocks.indexOf(type) === -1 ? false : true;

}


let isDataset = (type) => {
    let targetBlockTypes = ["dataset_type_multi_source",
        "dataset_type_multi_target",
        "dataset_type_multi_work"];
    return targetBlockTypes.indexOf(type) === -1 ? false : true;

}

export let StepBlockValidation = (stepToCheck, blocks) => {

    switch (stepToCheck) {
        case "allstep":
            {
                let final = blocks.find(x => x.type === "final_step_type");
                let final_statementBlock = final ? final.getInputTargetBlock("step_statement") : false;

                let step_datatable = blocks.filter(x => x.type === "step_type");
                let step_datatable_statementBlock = step_datatable.length > 0 ? step_datatable.some(st => {

                    return !st.getInputTargetBlock("step_statement");
                }) :
                    false;

                let step_variable = blocks.filter(x => x.type === "step_type_variable");
                let step_variable_statementBlock = step_variable.length > 0 ? step_variable.some(st => {

                    return !st.getInputTargetBlock("step_statement");
                }) :
                    false;


                return ((step_variable.length === 0 || !step_variable_statementBlock) &&
                    (step_datatable.length === 0 || !step_datatable_statementBlock) &&
                    (final_statementBlock && typeof final_statementBlock === "object"));
            }
        case "step_type_and_step_type_variable":
            {

                let step_datatable = blocks.filter(x => x.type === "step_type");
                let empty_step_datatable_statementBlock = step_datatable.some(sd => {
                    return !isObjectCheck(sd.getInputTargetBlock("step_statement"));
                });

                let step_variable = blocks.filter(x => x.type === "step_type_variable");
                let empty_step_variable_statementBlock = step_variable.some(sd => {
                    return !isObjectCheck(sd.getInputTargetBlock("step_statement"));
                });

                return !empty_step_datatable_statementBlock && !empty_step_variable_statementBlock;
            }
        case "partialstep":
            {
                let final = blocks.find(x => x.type === "final_step_type");
                let final_statementBlock = final ? final.getInputTargetBlock("step_statement") : true;

                let step_datatable = blocks.filter(x => x.type === "step_type");
                let step_datatable_statementBlock = step_datatable.length > 0 ? step_datatable.some(st => {

                    return !st.getInputTargetBlock("step_statement");
                }) : false;

                let step_variable = blocks.filter(x => x.type === "step_type_variable");
                let step_variable_statementBlock = step_variable.length > 0 ? step_variable.some(st => {

                    return !st.getInputTargetBlock("step_statement");
                }) : false;

                return ((step_variable.length === 0 || !step_variable_statementBlock) &&
                    (step_datatable.length === 0 || !step_datatable_statementBlock) &&
                    (final_statementBlock || isObjectCheck(final_statementBlock === "object")));
            }
    }
}

//Get all the variable of used variable's dataset in Finalstep / in Keep drop
//@Note --- For Program Execution page by variable concept
//passing this values in Extra2 
//If Keep or drop not used, All variables in that domain should be sent in "Extra1"
//If keep is used, only the variables used inside keep should be sent in "Extra1"
//If drop is used, take all variables in that domain and remove variables used in drop and send remaining in "Extra1"

export function Get_Var_From_Step(SourceDataset = [], Standards = [], MappingDatas = [], work_datasets = []) {


    this.SourceDataset = SourceDataset;
    this.Standards = Standards;
    this.MappingDatas = MappingDatas;
    this.work_datasets = work_datasets;
    //Finalstep/Variable step
    //Initially null
    this.StepType = "";
    this.SourceOfRule = {};


}

Get_Var_From_Step.prototype.init = function () {
    try {
        let { StepType, StepBlock, SourceOfRule, WorkDataTable } = this;
        switch (StepType.toLowerCase()) {
            case "variablestep":
                {

                    //get first used statement block
                    let First_Statement_Blks = StepBlock.getInputTargetBlock("step_statement");
                    //do
                    //{
                    //    children.push(Statement_Blks);
                    //} while (Statement_Blks = Statement_Blks.getNextBlock());
                    if (First_Statement_Blks) {
                        //get all used block inside the variable step  
                        let children = First_Statement_Blks && typeof First_Statement_Blks === "object" ? First_Statement_Blks.getDescendants() : [];
                        //get only dataset blk from datatable step

                        let is_keep_drop_used = children ? children.filter(x => x.type === "keep_drop_type2") : [];

                        if (is_keep_drop_used.length > 0) {
                            return validJSON(this.Var_From_KeepDrop(is_keep_drop_used[0]));
                        }
                        else {
                            if (First_Statement_Blks.type === "hardcode_type") {

                                let Variable = (this.SourceDataset && "Variable" in this.SourceDataset) ?
                                    this.SourceDataset.Variable : [];

                                let source_var = [];
                                Variable = Variable.filter(v => v.TABLE_NAME === SourceOfRule.sourceDataset);
                                source_var = (Variable || []).map(va => {
                                    return {
                                        memname: WorkDataTable,
                                        name: va.COLUMN_NAME
                                    }
                                });

                                return source_var;
                            }
                            else {
                                return validJSON(this.Var_From_Step(children));
                            }
                        }
                    } else {
                        return []
                    }
                }
                break;
            case "datatablestep":
                {

                    let First_Statement_Blks = StepBlock.getInputTargetBlock("step_statement");
                    //do {
                    //    children.push(Statement_Blks);
                    //} while (Statement_Blks = Statement_Blks.getNextBlock());
                    if (First_Statement_Blks) {
                        //get all used block inside the datatable step  
                        let children = First_Statement_Blks && typeof First_Statement_Blks === "object" ? First_Statement_Blks.getDescendants() : [];
                        //get only dataset blk from datatable step

                        let is_keep_drop_used = children ? children.filter(x => x.type === "keep_drop_type2") : [];
                        if (First_Statement_Blks.type === "merge_type" || First_Statement_Blks.type === "set_type") {
                            let filteredvar = this.Get_Var_For_Merger_Set(children);
                            if (is_keep_drop_used.length > 0) {
                                return this.Merge_Set_Keep_Drop(is_keep_drop_used[0], filteredvar);
                            }
                            return filteredvar;
                        }
                        else {
                            if (is_keep_drop_used.length > 0) {
                                return (validJSON(this.Var_From_KeepDrop(is_keep_drop_used[0])));
                            } else {
                                return this.Var_From_DatatTableStep(children);
                            }
                        }
                    }
                    else {
                        return [];
                    }
                }
                break;
            case "finalstep":
                {
                    let final_step = Blockly.getMainWorkspace().getBlocksByType("final_step_type");
                    let Descendants = final_step[0].getDescendants();
                    let is_keep_drop_used = Descendants ? Descendants.filter(x => x.type === "keep_drop_type2") : [];

                    if (is_keep_drop_used.length > 0) {
                        return this.Var_From_KeepDrop(is_keep_drop_used[0]);
                    }
                    else {
                        return this.Var_From_Step(Descendants);
                    }
                }
                break;
            case "WkFinalStep":
                {

                    let Descendants = StepBlock.getDescendants();
                    let is_keep_drop_used = Descendants ? Descendants.filter(x => x.type === "keep_drop_type2") : [];

                    if (is_keep_drop_used.length > 0) {
                        return this.Var_From_KeepDrop(is_keep_drop_used[0]);
                    }
                    else {
                        return this.Var_From_Step(Descendants);
                    }
                }
                break;
        }
    }
    catch (e) {
        console.log(e);
    }

}

//for keep drop
Get_Var_From_Step.prototype.Merge_Set_Keep_Drop = function (keep_drop, obje) {
    //Get the value from the drop down (whether the value is keep or drop)
    let dropdown_val = keep_drop.getFieldValue("keep_drop");
    //Get all the used variable in the statement input of keepdrop block
    let statement_blk = keep_drop.getInputTargetBlock("variables");
    let { ForToGetWorkDataset, WorkDataTable } = this;

    switch (dropdown_val) {
        case "Keep":
            {
                let usedvar_in_keep = [];
                let get_Used_Var_In_Keep = (statement_blk) => {
                    if (statement_blk) {

                        let data = validJSON(statement_blk.data);
                        let nxt = statement_blk.getNextBlock();
                        if (nxt) {
                            get_Used_Var_In_Keep(nxt);
                        }
                        switch (data.blockType) {
                            case "SourceVar":
                                if (!usedvar_in_keep.some(va => va.name === data.COLUMN_NAME)) {
                                    usedvar_in_keep.push({
                                        memname: WorkDataTable,
                                        name: data.COLUMN_NAME
                                    });
                                }
                                break;
                            case "TargetVar":
                                if (!usedvar_in_keep.some(va => va.name === data.variableName)) {
                                    usedvar_in_keep.push({
                                        memname: WorkDataTable,
                                        name: data.variableName
                                    });
                                }
                                break;
                            case "WorkVar":
                                if (!usedvar_in_keep.some(va => va.name === data.variable)) {
                                    usedvar_in_keep.push({
                                        memname: WorkDataTable,
                                        name: data.variable
                                    });
                                }
                                break;
                        }
                    }
                }
                get_Used_Var_In_Keep(statement_blk);

                return usedvar_in_keep;
            }
        case "Drop":
            {
                let usedvar_in_drop = [];
                let get_Used_Var_In_Drop = (statement_blk) => {
                    if (statement_blk) {
                        let data = validJSON(statement_blk.data);
                        let nxt = statement_blk.getNextBlock();
                        if (nxt) {
                            get_Used_Var_In_Drop(nxt);
                        }
                        switch (data.blockType) {
                            case "SourceVar":
                                {
                                    let getIndex = obje.findIndex(vari => vari.blockType === "SourceVar" && vari.name === data.COLUMN_NAME);
                                    obje = obje.filter((va, ind) => ind != getIndex);
                                }
                                break;
                            case "TargetVar":
                                {
                                    let getIndex = obje.findIndex(vari => vari.blockType === "TargetVar" && vari.name === data.variableName);
                                    obje = obje.filter((va, ind) => ind != getIndex);
                                }
                                break;
                            case "WorkVar":
                                {
                                    let getIndex = obje.findIndex(vari => vari.blockType === "WorkVar" && vari.name === data.variable);
                                    obje = obje.filter((va, ind) => ind != getIndex);
                                }
                                break;
                        }
                    }

                }
                get_Used_Var_In_Drop(statement_blk);
                return obje;
            }
    }
};
//for keep drop
Get_Var_From_Step.prototype.Var_From_KeepDrop = function (keep_drop) {
    //Get the value from the drop down (whether the value is keep or drop)
    let dropdown_val = keep_drop.getFieldValue("keep_drop");
    //Get all the used variable in the statement input of keepdrop block
    let statement_blk = keep_drop.getInputTargetBlock("variables");
    let { ForToGetWorkDataset, WorkDataTable } = this;

    switch (dropdown_val) {
        case "Keep":
            {
                let usedvar_in_keep = [];
                let get_Used_Var_In_Keep = (statement_blk) => {
                    if (statement_blk) {
                        let data = validJSON(statement_blk.data);
                        let nxt = statement_blk.getNextBlock();
                        if (nxt) {
                            get_Used_Var_In_Keep(nxt);
                        }
                        switch (data.blockType) {
                            case "SourceVar":
                                if (!usedvar_in_keep.some(va => va.variableName === data.COLUMN_NAME || va.name === data.COLUMN_NAME)) {
                                    ForToGetWorkDataset ?
                                        usedvar_in_keep.push({
                                            memname: WorkDataTable,
                                            name: data.COLUMN_NAME
                                        }) :
                                        usedvar_in_keep.push({
                                            type: "Source",
                                            dataset: data.TABLE_NAME,
                                            variableName: data.COLUMN_NAME
                                        });
                                }
                                break;
                            case "TargetVar":
                                if (!usedvar_in_keep.some(va => va.variableName === data.variableName || va.name === data.variableName)) {
                                    ForToGetWorkDataset ?
                                        usedvar_in_keep.push({
                                            memname: WorkDataTable,
                                            name: data.variableName
                                        }) :
                                        usedvar_in_keep.push({
                                            type: "Source",
                                            dataset: data.domain,
                                            variableName: data.variableName
                                        });
                                }
                                break;
                            case "WorkVar":
                                if (!usedvar_in_keep.some(va => va.variableName === data.variable || va.name === data.variable)) {
                                    ForToGetWorkDataset ?
                                        usedvar_in_keep.push({
                                            memname: WorkDataTable,
                                            name: data.variable
                                        }) :
                                        usedvar_in_keep.push({
                                            type: "Source",
                                            dataset: data.dataset,
                                            variableName: data.variable
                                        });
                                }
                                break;
                        }
                    }
                }
                get_Used_Var_In_Keep(statement_blk);

                return JSON.stringify(usedvar_in_keep);
            }
        case "Drop":
            {
                let usedvar_in_drop = [];
                let get_Used_Var_In_Drop = (statement_blk) => {
                    if (statement_blk) {
                        let data = validJSON(statement_blk.data);
                        let nxt = statement_blk.getNextBlock();
                        if (nxt) {
                            get_Used_Var_In_Drop(nxt);
                        }
                        switch (data.blockType) {
                            case "SourceVar":
                                usedvar_in_drop.push(data.COLUMN_NAME);
                                break;
                            case "TargetVar":
                                usedvar_in_drop.push(data.variableName);
                                break;
                            case "WorkVar":
                                usedvar_in_drop.push(data.variable);
                                break;
                        }
                    }
                }
                get_Used_Var_In_Drop(statement_blk);
                let all_var = this.findWhichdDataset(statement_blk, true, usedvar_in_drop);
                return JSON.stringify(all_var);
            }
    }
};
//for step and Variable step
Get_Var_From_Step.prototype.Var_From_Step = function (descendants) {
    let statement_blk = descendants.filter(child => isVariableType(child.type));
    let all_var = this.findWhichdDataset(statement_blk[0]);
    return JSON.stringify(all_var);
};
//Transpose block
Get_Var_From_Step.prototype.WorkVar_From_Transposeblock = function (transposeblock) {
    try {
        let { WorkDataTable } = this;

        //get Used first Variable in by varible statement
        let by_var_statement_blk = transposeblock.getInputTargetBlock("by_variables");
        if (by_var_statement_blk) {

            //get Used all Variable's in by varible statement
            let getAllUsedVar = (by_var_statement_blk && typeof by_var_statement_blk === "object") ? by_var_statement_blk.getDescendants() : [];

            //default column add here
            let defaultcol = ["_NAME_", "_LABEL_", "COL1"]
            let out = [...defaultcol.map(dcol => { return { name: dcol, memname: WorkDataTable } })];

            (getAllUsedVar || []).map(var_blk => {
                let data = validJSON(var_blk.data);
                let type = data ? data.blockType : "";
                switch (type) {
                    case "SourceVar":
                        {
                            !out.some(v => v.name.toLowerCase() === data.COLUMN_NAME.toLowerCase()) &&
                                out.push({ name: data.COLUMN_NAME, memname: WorkDataTable });
                        }
                        break;
                    case "TargetVar":
                        {
                            !out.some(v => v.name.toLowerCase() === data.variableName.toLowerCase()) &&
                                out.push({ name: data.variableName, memname: WorkDataTable });
                        }
                        break;
                    case "WorkVar":
                        {
                            !out.some(v => v.name.toLowerCase() === data.variable.toLowerCase()) &&
                                out.push({ name: data.variable, memname: WorkDataTable });
                        }
                        break;
                    default:
                        break;
                }

            });


            return out;
        }
        return [];
    }
    catch (e) {
        console.log(e);
        return [];
    }
};

//Filter used var from Rename Block 
export function GetRenameVariables(children, src, tar, work_ds) {
    try {
        //out variable
        let rename_var = {}

        //Check Duplication (do not rename multiple columns with the same name).
        let find_Duplication = { identify: [], duplicate: [] };
        let { identify, duplicate } = find_Duplication;

        for (var index = 0; index < children.length; index++) {
            //Block used in selcted block
            let block = children[index];
            let dataset_info = validJSON(block.data);
            let dataset_type = dataset_info.blockType;
            let type = block.type;

            //Should check for only Variable step ,DataTable step
            if (isDataset(type)) {
                //get block value connection 
                //Get the used dataTableOptions in dataset
                let dataTableOptions = block && (block.getOnlyValueConnection_ && block.getOnlyValueConnection_());
                dataTableOptions = dataTableOptions && (dataTableOptions.targetBlock && dataTableOptions.targetBlock());
                let dataTableOpt_child = dataTableOptions && (dataTableOptions.getChildren && dataTableOptions.getChildren());
                //Get the used rename blk in dataset
                let renameBlk = isArray(dataTableOpt_child) && dataTableOpt_child[0];
                //get first used block in rename block (type - rename_vars)
                let used_blk_in_rename = (isObject(renameBlk) && renameBlk.getDescendants) ? renameBlk.getDescendants() : [];

                used_blk_in_rename.map(b => {
                    //uvbr -> used var block in rename
                    let uvbr_dataInfo = validJSON(b.data);
                    let var_type = uvbr_dataInfo.blockType;

                    //get text from rename block.(rename - rename_type)
                    let rename_text_blk = b.getOnlyValueConnection_();
                    rename_text_blk = isObject(rename_text_blk) ? rename_text_blk.targetBlock() : false;
                    let renameText = isObject(rename_text_blk) ? rename_text_blk.getFieldValue("rename_var") : "";
                    //End 
                    if (renameText != "" && typeof renameText === "string" && !parseInt(renameText)) {
                        switch (dataset_type) {
                            case "Source":
                                {
                                    let srcVar = src.Variable;
                                    let s_ds = strLowerCase(uvbr_dataInfo.TABLE_NAME);
                                    let s_var = strLowerCase(uvbr_dataInfo.COLUMN_NAME);
                                    //Get only the used used source var from rename block,if Source DATASET means
                                    if (var_type === "SourceVar" && uvbr_dataInfo.TABLE_NAME === dataset_info.TABLE_NAME &&
                                        srcVar.some(sv => strLowerCase(sv.TABLE_NAME) == s_ds && strLowerCase(sv.COLUMN_NAME) === s_var)) {

                                        let { blockType, TABLE_NAME } = dataset_info;
                                        //uvbr -> used var block in rename
                                        let { COLUMN_NAME } = uvbr_dataInfo;

                                        //Check Duplication (do not rename multiple columns with the same name).
                                        //check the combination of type(src/tar/work) and rename text
                                        //Same re-name allowed for same variable ex(demo.domain rename is x ,can have another demo.domain rename is x )
                                        let dp_chk_renametxt = var_type + '.' + TABLE_NAME + '.' + renameText.toLowerCase();
                                        let dp_chk_varname = var_type + '.' + TABLE_NAME + '.' + COLUMN_NAME;

                                        if (!identify.some(dpo => dpo.v_name.toLowerCase() !== dp_chk_varname.toLowerCase() && dpo.r_name.toLowerCase() === dp_chk_renametxt.toLowerCase())) {
                                            identify.push({ r_name: dp_chk_renametxt, v_name: dp_chk_varname });

                                            rename_var[TABLE_NAME + "@_" + var_type] = rename_var[TABLE_NAME + "@_" + var_type] || {};
                                            rename_var[TABLE_NAME + "@_" + var_type][COLUMN_NAME] = { ...uvbr_dataInfo, renameTo: renameText.toUpperCase() };
                                        }
                                        else {
                                            duplicate.indexOf(TABLE_NAME + " - " + renameText) === -1 && duplicate.push(TABLE_NAME + " - " + renameText);
                                        }
                                    }
                                }
                                break;
                            case "Target":
                                {
                                    //Get only the used used target var from rename block,if Target DATASET means
                                    let t_ds = strLowerCase(uvbr_dataInfo.domain);
                                    let t_var = strLowerCase(uvbr_dataInfo.variableName);
                                    if (var_type === "TargetVar" && uvbr_dataInfo.domain === dataset_info.domain &&
                                        tar.some(tv => strLowerCase(tv.targetDataSet) == t_ds && strLowerCase(tv.targetVariableName) === t_var)) {
                                        let { blockType, domain } = dataset_info;
                                        //uvbr -> used var block in rename
                                        let { variableName } = uvbr_dataInfo;
                                        //Check Duplication (do not rename multiple columns with the same name).
                                        //Check Duplication (do not rename multiple columns with the same name).
                                        //check the combination of type(src/tar/work) and rename text
                                        let dp_chk_renametxt = var_type + '.' + domain + '.' + renameText.toLowerCase();
                                        //Same re-name allowed for same variable ex(demo.domain rename is x ,can have another demo.domain rename is x )
                                        let dp_chk_varname = var_type + '.' + domain + '.' + variableName;

                                        if (!identify.some(dpo => dpo.v_name.toLowerCase() !== dp_chk_varname.toLowerCase() && dpo.r_name.toLowerCase() === dp_chk_renametxt.toLowerCase())) {
                                            identify.push({ r_name: dp_chk_renametxt, v_name: dp_chk_varname });
                                            rename_var[domain + "@_" + var_type] = rename_var[domain + "@_" + var_type] || {};
                                            rename_var[domain + "@_" + var_type][variableName] = { ...uvbr_dataInfo, renameTo: renameText.toUpperCase() };
                                        }
                                        else {
                                            duplicate.indexOf(domain + " - " + renameText) === -1 && duplicate.push(domain + " - " + renameText);
                                        }
                                    }
                                }
                                break;
                            case "Work":
                                {
                                    let w_ds = strLowerCase(uvbr_dataInfo.dataset);
                                    //Get only the used used Work var from rename block,if Work DATASET means
                                    if (var_type === "WorkVar" && w_ds === strLowerCase(dataset_info.name) &&
                                        work_ds.some(v => strLowerCase(v.memname) == w_ds && strLowerCase(v.name) == strLowerCase(uvbr_dataInfo.variable))) {
                                        let { blockType, name } = dataset_info;
                                        //uvbr -> used var block in rename
                                        let { variable } = uvbr_dataInfo;
                                        //Check Duplication (do not rename multiple columns with the same name).
                                        //Check Duplication (do not rename multiple columns with the same name).
                                        //check the combination of type(src/tar/work) and rename text

                                        let dp_chk_renametxt = var_type + '.' + name + '.' + renameText.toLowerCase();
                                        //Same re-name allowed for same variable ex(demo.domain rename is x ,can have another demo.domain rename is x )
                                        let dp_chk_varname = var_type + '.' + name + '.' + variable;

                                        if (!identify.some(dpo => dpo.v_name.toLowerCase() !== dp_chk_varname.toLowerCase() && dpo.r_name.toLowerCase() === dp_chk_renametxt.toLowerCase())) {
                                            identify.push({ r_name: dp_chk_renametxt, v_name: dp_chk_varname });

                                            rename_var[name + "@_" + var_type] = rename_var[name + "@_" + var_type] || {};
                                            rename_var[name + "@_" + var_type][variable] = { ...uvbr_dataInfo, renameTo: renameText.toUpperCase() };
                                        }
                                        else {
                                            duplicate.indexOf(variable + " - " + renameText) === -1 && duplicate.push(variable + " - " + renameText);
                                        }
                                    }
                                }
                                break;
                        }
                    }
                });
            }

        }

        return {
            variableRenameList: rename_var, duplicate: duplicate
        };
    } catch (e) {
        console.log(e);
        return {};
    }
}

//for  datatable step
// parameter @children is the used block inside datatable step
Get_Var_From_Step.prototype.Var_From_DatatTableStep = function (children) {
    try {
        let { WorkDataTable, Standards, work_datasets, variableRenameList } = this;
        let out = [];

        if (children && typeof children === "object" && children.length > 0) {
            //for transpose block
            let isTransPoseBlkUsed = (children || []).find(child => child.type == "transpose_operation");
            if (isTransPoseBlkUsed && typeof isTransPoseBlkUsed === "object") {
                out = this.WorkVar_From_Transposeblock(isTransPoseBlkUsed, variableRenameList);
            }
            else {
                //get only dataset blk from datatable step
                let used_dataset_blk = children.filter(child => isDataset(child.type));
                //Controlling duplication for dataset
                let cntrlDuplication = [];

                (used_dataset_blk || []).map(ds_blk => {
                    let data = validJSON(ds_blk.data);
                    let type = data ? data.blockType : "";
                    //Controlling duplication for dataset
                    let duplicationcontrol = cntrlDuplication.some(cd => cd.dataset === data.TABLE_NAME && cd.type === "Source");
                    if (!duplicationcontrol) {
                        switch (type) {
                            case "Source":
                                {
                                    //Controlling duplication for dataset
                                    cntrlDuplication.push({ dataset: data.TABLE_NAME, type: type });

                                    let Dataset = (this.SourceDataset && "Domain" in this.SourceDataset) ?
                                        this.SourceDataset.Domain : [];
                                    let Variable = (this.SourceDataset && "Variable" in this.SourceDataset) ?
                                        this.SourceDataset.Variable : [];

                                    let var_by_used_dataset = Variable.filter(va => {
                                        //Rename the variable ,if a rename block exists 
                                        let rename_obj = variableRenameList[data.TABLE_NAME + "@_" + "SourceVar"];

                                        let renameTo = rename_obj && rename_obj[va.COLUMN_NAME] && rename_obj[va.COLUMN_NAME].renameTo;

                                        let col_Name = isNotNull(renameTo) ? renameTo : va.COLUMN_NAME;


                                        if (va.TABLE_NAME === data.TABLE_NAME && !out.some(wkva => wkva.name === col_Name)) {
                                            out.push({ name: col_Name, memname: WorkDataTable });
                                        }
                                    });
                                }
                                break;
                            case "Target":
                                {
                                    //Controlling duplication for dataset
                                    cntrlDuplication.push({ dataset: data.domain, type: type });

                                    let Dataset = (Standards && "Domain" in Standards) ?
                                        this.SourceDataset.Domain : [];
                                    let Variable = (Standards && "Variable" in Standards) ?
                                        Standards.Variable : [];

                                    Variable.filter(va => {
                                        let mappingConstruct = this.MappingDatas.MappingList.find(
                                            mapper =>
                                                mapper.cdiscDataStdVariableMetadataID ===
                                                va.cdiscDataStdVariableMetadataID || (typeof va.domain == 'string' && va.domain.toLowerCase().includes('_int'))
                                        );
                                        if (typeof mappingConstruct === 'object' &&
                                            mappingConstruct) {
                                            //Rename the variable ,if a rename block exists 
                                            let rename_obj = variableRenameList[data.domain + "@_" + "TargetVar"];

                                            let renameTo = rename_obj && rename_obj[va.variableName] && rename_obj[va.variableName].renameTo;
                                            let col_Name = isNotNull(renameTo) ? renameTo : va.variableName;

                                            if (va.cdiscDataStdDomainMetadataID === data.cdiscDataStdDomainMetadataID && !out.some(wkva => wkva.name === col_Name)) {
                                                out.push({ name: col_Name, memname: WorkDataTable });
                                            }
                                        }
                                    });
                                }
                                break;
                            case "Work":
                                {
                                    //Controlling duplication for dataset
                                    // data.name -> is work dataset
                                    cntrlDuplication.push({ dataset: data.name, type: type });

                                    let work_var = [];
                                    //In work_datasets object -> name key is work variable , memname key is dataset
                                    work_datasets.filter(va => {
                                        //Rename the variable ,if a rename block exists 
                                        let rename_obj = variableRenameList[data.name + "@_" + "WorkVar"];
                                        let renameTo = rename_obj && rename_obj[va.name] && rename_obj[va.name].renameTo;
                                        let col_Name = isNotNull(renameTo) ? renameTo : va.name;

                                        if (va.memname === data.name && !out.some(wkva => wkva.name === col_Name)) {
                                            out.push({ name: col_Name, memname: WorkDataTable });
                                        }
                                    });
                                }
                                break;
                            default:
                                break;
                        }
                    }

                });
            }
            return out;
        }
    } catch (e) {
        console.log(e);
        return [];
    }
    return [];
};
//for  datatable step
// parameter @children is the used block inside datatable step
Get_Var_From_Step.prototype.Get_Var_For_Merger_Set = function (children) {
    try {
        let { WorkDataTable, Standards, work_datasets, variableRenameList } = this;
        let out = [];

        if (children && typeof children === "object" && children.length > 0) {


            //for transpose block
            let isTransPoseBlkUsed = (children || []).find(child => child.type == "transpose_operation");
            if (isTransPoseBlkUsed && typeof isTransPoseBlkUsed === "object") {
                out = this.WorkVar_From_Transposeblock(isTransPoseBlkUsed, variableRenameList);
            }
            else {

                //get only dataset blk from datatable step
                let used_dataset_blk = children.filter(child => isDataset(child.type));
                //Controlling duplication for dataset
                let cntrlDuplication = [];

                (used_dataset_blk || []).map(ds_blk => {
                    let data = validJSON(ds_blk.data);
                    let type = data ? data.blockType : "";
                    //Controlling duplication for dataset
                    let duplicationcontrol = cntrlDuplication.some(cd => cd.dataset === data.TABLE_NAME && cd.type === "Source");
                    if (!duplicationcontrol) {
                        switch (type) {
                            case "Source":
                                {
                                    //Controlling duplication for dataset
                                    cntrlDuplication.push({ dataset: data.TABLE_NAME, type: type });

                                    let Dataset = (this.SourceDataset && "Domain" in this.SourceDataset) ?
                                        this.SourceDataset.Domain : [];
                                    let Variable = (this.SourceDataset && "Variable" in this.SourceDataset) ?
                                        this.SourceDataset.Variable : [];

                                    let var_by_used_dataset = Variable.filter(va => {
                                        //Rename the variable ,if a rename block exists 
                                        let rename_obj = variableRenameList[data.TABLE_NAME + "@_" + "SourceVar"];

                                        let renameTo = rename_obj && rename_obj[va.COLUMN_NAME] && rename_obj[va.COLUMN_NAME].renameTo;

                                        let col_Name = isNotNull(renameTo) ? renameTo : va.COLUMN_NAME;


                                        if (va.TABLE_NAME === data.TABLE_NAME && !out.some(wkva => wkva.name === col_Name)) {
                                            out.push({ name: col_Name, memname: WorkDataTable, blockType: "SourceVar" });
                                        }
                                    });
                                }
                                break;
                            case "Target":
                                {
                                    //Controlling duplication for dataset
                                    cntrlDuplication.push({ dataset: data.domain, type: type });

                                    let Dataset = (Standards && "Domain" in Standards) ?
                                        this.SourceDataset.Domain : [];
                                    let Variable = (Standards && "Variable" in Standards) ?
                                        Standards.Variable : [];

                                    Variable.filter(va => {
                                        let mappingConstruct = this.MappingDatas.MappingList.find(
                                            mapper =>
                                                mapper.cdiscDataStdVariableMetadataID ===
                                                va.cdiscDataStdVariableMetadataID || (typeof va.domain == 'string' && va.domain.toLowerCase().includes('_int'))
                                        );
                                        if (typeof mappingConstruct === 'object' &&
                                            mappingConstruct) {
                                            //Rename the variable ,if a rename block exists 
                                            let rename_obj = variableRenameList[data.domain + "@_" + "TargetVar"];

                                            let renameTo = rename_obj && rename_obj[va.variableName] && rename_obj[va.variableName].renameTo;
                                            let col_Name = isNotNull(renameTo) ? renameTo : va.variableName;

                                            if (va.cdiscDataStdDomainMetadataID === data.cdiscDataStdDomainMetadataID && !out.some(wkva => wkva.name === col_Name)) {
                                                out.push({ name: col_Name, memname: WorkDataTable, blockType: "TargetVar" });
                                            }
                                        }
                                    });
                                }
                                break;
                            case "Work":
                                {
                                    //Controlling duplication for dataset
                                    // data.name -> is work dataset
                                    cntrlDuplication.push({ dataset: data.name, type: type });

                                    let work_var = [];
                                    //In work_datasets object -> name key is work variable , memname key is dataset
                                    work_datasets.filter(va => {
                                        //Rename the variable ,if a rename block exists 
                                        let rename_obj = variableRenameList[data.name + "@_" + "WorkVar"];
                                        let renameTo = rename_obj && rename_obj[va.name] && rename_obj[va.name].renameTo;
                                        let col_Name = isNotNull(renameTo) ? renameTo : va.name;

                                        if (va.memname === data.name && !out.some(wkva => wkva.name === col_Name)) {
                                            out.push({ name: col_Name, memname: WorkDataTable, blockType: "WorkVar" });
                                        }
                                    });
                                }
                                break;
                            default:
                                break;
                        }
                    }

                });
            }
            return out;
        }
    } catch (e) {
        console.log(e);
        return [];
    }
    return [];
};
//Return Variables Based on dataset
//blk parameter is a first statement input of the block
//drop and usedvarindrop
Get_Var_From_Step.prototype.findWhichdDataset = function (blk, drop = false, usedvarindrop = []) {
    let { ForToGetWorkDataset, WorkDataTable } = this;

    if (blk) {
        let data = validJSON(blk.data);
        let type = data ? data.blockType : "";
        try {
            switch (type) {
                case "SourceVar":
                    {
                        let Variable = (this.SourceDataset && "Variable" in this.SourceDataset) ?
                            this.SourceDataset.Variable : [];

                        let source_var = [];
                        Variable = Variable.filter(v => v.TABLE_NAME === data.TABLE_NAME);
                        (Variable || []).map(va => {
                            if ((!drop || usedvarindrop.indexOf(va.COLUMN_NAME) === -1) &&
                                !source_var.some(v => v.variableName === va.COLUMN_NAME)) {
                                ForToGetWorkDataset ?
                                    source_var.push({
                                        memname: WorkDataTable,
                                        name: va.COLUMN_NAME
                                    }) :
                                    source_var.push({
                                        type: "Source",
                                        dataset: va.TABLE_NAME,
                                        variableName: va.COLUMN_NAME
                                    })
                            }
                        });

                        return source_var;
                    }
                case "TargetVar":
                    {

                        let target_var = [];
                        let variable = this.Standards ?
                            this.Standards.Variable : [];

                        let varible = variable.filter(
                            v =>
                                v.cdiscDataStdDomainMetadataID ===
                                data.cdiscDataStdDomainMetadataID
                        );


                        varible.map(va => {
                            let mappingConstruct = this.MappingDatas.MappingList.find(
                                mapper =>
                                    mapper.cdiscDataStdVariableMetadataID ===
                                    va.cdiscDataStdVariableMetadataID || (typeof va.domain == 'string' && va.domain.toLowerCase().includes('_int'))
                            );
                            if (typeof mappingConstruct === 'object' &&
                                mappingConstruct) {
                                if ((!drop || usedvarindrop.indexOf(va.variableName) === -1) &&
                                    !target_var.some(v => v.variableName === va.variableName)) {
                                    ForToGetWorkDataset ?
                                        target_var.push({
                                            memname: WorkDataTable,
                                            name: va.variableName
                                        }) :
                                        target_var.push({
                                            type: "Target",
                                            dataset: data.domain,
                                            variableName: va.variableName
                                        });
                                }
                            }
                        });
                        return target_var;
                    }
                case "WorkVar":
                    {
                        let work_var = [];

                        this.work_datasets.filter(va => {
                            if (va.memname === data.dataset &&
                                (!drop || usedvarindrop.indexOf(va.name) === -1) &&
                                !work_var.some(v => v.variableName === va.name)
                            ) {
                                ForToGetWorkDataset ?
                                    work_var.push({
                                        memname: WorkDataTable,
                                        name: va.name
                                    })
                                    :
                                    work_var.push({
                                        type: "Work",
                                        variableName: va.name,
                                        dataset: va.memname
                                    });
                            }
                        });
                        return work_var;
                    }
            }
        }
        catch (e) {
            //console.log(e);
            return [];
        }
    }
    else {
        return [];
    }
}

//Get variable from used dataset in DataTable step

export function ImpactValidation(Standards, SourceDataset, xml, record = false) {
    try {
        this.xml = xml;
        this.record = record;
        //convert string to xml 
        //all used block data information
        this.data_info = this.xml.getElementsByTagName("data");

        //deciding var
        //if false ,imapct exist else not
        this.none_impacted = true;
        this.impacted = false;

        //used block in rule validation
        let { Domain, Variable } = SourceDataset;
        this.src_domain = Domain;
        this.src_variable = Variable;
        this.std_domain = Standards.Domain;
        this.std_variable = Standards.Variable;

        //impacted list 
        this.ImpactedList = {};
        //for create/update/generate program/individual run should validate the work.but ,get workdataset no need to validate the work here
        this.NotValidateWork = false;
        this.work_exist = true;
        this.NotAvailWorkList = {};
        this.variableRenameList = {};

        //Duplicate column due to renaming variable
        this.duplicateColumn = [];
    }
    catch (e) {
        //console.log(e);
    }
}

//Actual source of the record
//IsMappedSourceAvaliable
//this only used by importmappinlibrary.js
ImpactValidation.prototype.IsMappedSourceAvaliable = function () {
    try {
        //record -> sel record
        let { src_variable, record } = this;

        if (src_variable.some(sv =>
            sv.TABLE_NAME === record.sourceDataset &&
            sv.COLUMN_NAME === record.sourceVariableName)) {
            record.impact = 0;
            record.changeReason = "Create";
        }
        else {
            record.impact = 1;
            record.changeReason = "Create";
        }
    }
    catch (e) {
        //console.log(e);
    }
}

////Here Validate the used blocks in rule
//Only ImportMapping Library uses this function
ImpactValidation.prototype.ValidationOfAllBlocksUsed = function ()
{
    try {
        let {
            xml,
            data_info,
            std_domain,
            src_domain,
            MappingList,
            std_variable,
            src_variable,
            WorkDatatset,
            none_impacted,
            NotValidateWork,
            VariableRenameList
        } = this;

        for (var i = 0; i < data_info.length; i++)
        {
            let data = data_info[i];
            let d = validJSON(data_info[i].textContent);

            switch (d.blockType) {
                case "Source":
                    {

                        let nothing_impacted = src_domain.some(va => {
                            return va.TABLE_NAME === d.TABLE_NAME;
                        });

                        !nothing_impacted && (this.ImpactedList[d.TABLE_NAME] = "Source Dataset - " + d.TABLE_NAME);
                        //Maintaing statge of overal check
                        none_impacted = none_impacted && nothing_impacted;
                    }
                    break;
                case "SourceVar":
                    {
                        //Combine renamed variables also before check for impact
                        let renameVarsByDataset = VariableRenameList && VariableRenameList[d.TABLE_NAME + "@_SourceVar"];
                        renameVarsByDataset = isObjectCheck(renameVarsByDataset) ? renameVarsByDataset : {};

                        let combineBothVariables = [...src_variable,
                        ...(Object.keys(renameVarsByDataset) || []).map(rv => renameVarsByDataset[rv])];

                        let nothing_impacted = combineBothVariables.some(va => {
                            let renameTo = va.renameTo && typeof va.renameTo === "string" ? va.renameTo : "";
                            return (va.TABLE_NAME.toUpperCase() === d.TABLE_NAME.toUpperCase() && va.COLUMN_NAME.toUpperCase() === d.COLUMN_NAME.toUpperCase()) ||
                                (va.TABLE_NAME.toUpperCase() === d.TABLE_NAME.toUpperCase() && renameTo.toUpperCase() === d.COLUMN_NAME.toUpperCase());
                        });

                        !nothing_impacted && (this.ImpactedList[d.TABLE_NAME + "." + d.COLUMN_NAME] = "Source Variable - " + d.TABLE_NAME + "." + d.COLUMN_NAME);
                        //Maintaing statge of overal check
                        none_impacted = none_impacted && nothing_impacted;
                    }
                    break;
                case "Target":
                    {
                        let nothing_impacted = std_domain.some(va => {
                            return d.domain === va.domain
                        });

                        //not to override  above validation .if above validation itself found impact ,then no need to do following validation.that's why condn added below
                        if (d && d.domain && !d.domain.includes("_int")) {
                            nothing_impacted = nothing_impacted && MappingList.some(va => {
                                return d.domain === va.targetDataSet
                            });
                        }
                        !nothing_impacted && (this.ImpactedList[d.domain] = "Target Dataset - " + d.domain);
                        //Maintaing statge of overal check
                        none_impacted = none_impacted && nothing_impacted;
                    }
                    break;
                case "TargetVar":
                    {
                        let blockOfData = data.parentElement;
                        let fieldTag = data_info[i].parentElement.getElementsByTagName('field');
                        let fieldName = fieldTag && typeof fieldTag == 'object' ? fieldTag[0].textContent : "";
                        let domainName = isNotNull(fieldName) ? fieldName.split('.')[0] : "";

                        //get used block std domain name for usedblk variable by cdiscDataStdDomainMetadataID
                        let usedBlkDomain = std_domain.find(dm1 => dm1.domain.toLowerCase() === domainName.toLowerCase());
                        let usedBlkDomainName = usedBlkDomain && typeof usedBlkDomain === "object" ? usedBlkDomain.domain : "";
                        d.cdiscDataStdDomainMetadataID = usedBlkDomain && typeof usedBlkDomain === "object" ? usedBlkDomain.cdiscDataStdDomainMetadataID : 0;
                        
                        

                        let nothing_impacted = std_variable.some(va => {

                            //get std domain name for variable by cdiscDataStdDomainMetadataID
                            let domain = std_domain.find(dm => dm.cdiscDataStdDomainMetadataID === va.cdiscDataStdDomainMetadataID);
                            let domainname = domain && typeof domain === "object" ? domain.domain : "";

                            //let getDomain = Standards.Domain.find(d => d.cdiscDataStdDomainMetadataID === va.cdiscDataStdDomainMetadataID);
                            if (usedBlkDomainName.toUpperCase() === domainname.toUpperCase() &&
                                va.variableName.toUpperCase() === d.variableName.toUpperCase())
                            {
                                d.cdiscDataStdVariableMetadataID = va.cdiscDataStdVariableMetadataID
                                data_info[i].parentElement.childNodes[1].textContent = JSON.stringify(d)
                                return true;
                            };
                        });
                        //not to override  above validation .if above validation itself found impact ,then no need to do following validation.that's why condn added below
                        //HERE available Mapping List validation
                        if (usedBlkDomain && usedBlkDomain.domain && !usedBlkDomain.domain.includes("_int")) {
                            nothing_impacted = nothing_impacted &&
                                MappingList.some(va => {
                                    return usedBlkDomainName.toUpperCase() === va.targetDataSet.toUpperCase() && va.cdiscDataStdVariableMetadataID === d.cdiscDataStdVariableMetadataID;
                                });
                        }
                        !nothing_impacted && (this.ImpactedList[usedBlkDomainName + "." + d.variableName] = "Target Variable - " + usedBlkDomainName + "." + d.variableName);

                        //Maintaing statge of overal check
                        none_impacted = none_impacted && nothing_impacted;
                    }
                    break;

            }

            if (!none_impacted) {

            }
        }

        //here we inverse 
        //for other end developing 
        this.impacted = !none_impacted;

    }
    catch (e) {
        console.log(e)
    }
}

//Here Validate the used blocks in rule
//Only blocklyWorkspcae.js uses this function
ImpactValidation.prototype.ImpactValidationOfUsedBlocks = function () {
    try {
        let {
            
            stepblk,
            data_info,
            std_domain,
            src_domain,
            MappingList,
            std_variable,
            src_variable,
            WorkDatatset,
            none_impacted,
            NotValidateWork,
            variableRenameList
        } = this;


        for (var i = 0; i < stepblk.length; i++) {
            let blk = stepblk[i];
            let data_info = blk.data;
            let d = validJSON(data_info);

            switch (d.blockType) {
                case "Source":
                    {

                        let nothing_impacted = src_domain.some(va => {
                            return va.TABLE_NAME === d.TABLE_NAME;
                        });

                        !nothing_impacted && (this.ImpactedList[d.TABLE_NAME] = "Source Dataset - " + d.TABLE_NAME);
                        //Maintaing statge of overal check
                        none_impacted = none_impacted && nothing_impacted;
                    }
                    break;
                case "SourceVar":
                    {
                        //Combine renamed variables also before check for impact
                        let renameVarsByDataset = variableRenameList && variableRenameList[d.TABLE_NAME + "@_SourceVar"];
                        renameVarsByDataset = isObjectCheck(renameVarsByDataset) ? renameVarsByDataset : {};

                        let combineBothVariables = [...src_variable,
                        ...(Object.keys(renameVarsByDataset) || []).map(rv => renameVarsByDataset[rv])];

                        let nothing_impacted = combineBothVariables.some(va => {
                            let renameTo = va.renameTo && typeof va.renameTo === "string" ? va.renameTo : "";
                            return (va.TABLE_NAME.toUpperCase() === d.TABLE_NAME.toUpperCase() && va.COLUMN_NAME.toUpperCase() === d.COLUMN_NAME.toUpperCase()) ||
                                (va.TABLE_NAME.toUpperCase() === d.TABLE_NAME.toUpperCase() && renameTo.toUpperCase() === d.COLUMN_NAME.toUpperCase());
                        });

                        !nothing_impacted && (this.ImpactedList[d.TABLE_NAME + "." + d.COLUMN_NAME] = "Source Variable - " + d.TABLE_NAME + "." + d.COLUMN_NAME);
                        //Maintaing statge of overal check
                        none_impacted = none_impacted && nothing_impacted;
                    }
                    break;
                case "Target":
                    {
                        let nothing_impacted = std_domain.some(va => {
                            return d.domain === va.domain
                        });

                        //not to override  above validation .if above validation itself found impact ,then no need to do following validation.that's why condn added below
                        if (d && d.domain && !d.domain.includes("_int")) {
                            nothing_impacted = nothing_impacted && MappingList.some(va => {
                                return d.domain === va.targetDataSet
                            });
                        }
                        !nothing_impacted && (this.ImpactedList[d.domain] = "Target Dataset - " + d.domain);
                        //Maintaing statge of overal check
                        none_impacted = none_impacted && nothing_impacted;
                    }
                    break;
                case "TargetVar":
                    {

                        //get used block std domain name for usedblk variable by cdiscDataStdDomainMetadataID
                        let usedBlkDomain = std_domain.find(dm1 => dm1.cdiscDataStdDomainMetadataID === d.cdiscDataStdDomainMetadataID);
                        let usedBlkDomainName = usedBlkDomain && typeof usedBlkDomain === "object" ? usedBlkDomain.domain : d.domain;
                        //Combine renamed variables also before check for impact
                        let renameVarsByDataset = variableRenameList && variableRenameList[usedBlkDomainName + "@_TargetVar"];
                        renameVarsByDataset = isObjectCheck(renameVarsByDataset) ? renameVarsByDataset : {};

                        let bothVariables = [...std_variable,
                        ...(Object.keys(renameVarsByDataset) || []).map(rv => renameVarsByDataset[rv])];


                        let nothing_impacted = bothVariables.some(va => {
                            let renameTo = va.renameTo && typeof va.renameTo === "string" ? va.renameTo : "";

                            //get std domain name for variable by cdiscDataStdDomainMetadataID
                            let domain = std_domain.find(dm => dm.cdiscDataStdDomainMetadataID === va.cdiscDataStdDomainMetadataID);
                            let domainname = domain && typeof domain === "object" ? domain.domain : "";

                            //let getDomain = Standards.Domain.find(d => d.cdiscDataStdDomainMetadataID === va.cdiscDataStdDomainMetadataID);
                            return usedBlkDomainName.toUpperCase() === domainname.toUpperCase() &&
                                (va.variableName.toUpperCase() === d.variableName.toUpperCase() || d.variableName.toUpperCase() === renameTo.toUpperCase());
                        });

                        //not to override  above validation .if above validation itself found impact ,then no need to do following validation.that's why condn added below
                        //HERE available Mapping List validation
                        if (usedBlkDomain && usedBlkDomain.domain && !usedBlkDomain.domain.includes("_int")) {
                            nothing_impacted = nothing_impacted &&
                                MappingList.some(va => {
                                    return usedBlkDomainName.toUpperCase() === va.targetDataSet.toUpperCase() && va.cdiscDataStdVariableMetadataID === d.cdiscDataStdVariableMetadataID;
                                });
                        }
                        !nothing_impacted && (this.ImpactedList[usedBlkDomainName + "." + d.variableName] = "Target Variable - " + usedBlkDomainName + "." + d.variableName);

                        //Maintaing statge of overal check
                        none_impacted = none_impacted && nothing_impacted;
                    }
                    break;

            }

            if (!none_impacted) {

            }
        }

        //here we inverse 
        //for other end developing 
        this.impacted = !none_impacted;

    }
    catch (e) {
        console.log(e)
    }
}

//NCICodeList_Validation For Workspace
//Only blocklyWorkspcae.js uses this function
ImpactValidation.prototype.ImapctNCICodeListValidationWorkspace = function () {
    let { data_info, NCICODELISTDATA } = this;
    let nci_list = NCICODELISTDATA && typeof NCICODELISTDATA === "object" ? NCICODELISTDATA : [];
    let usedblk_info = data_info;
    for (let i = 0; i < usedblk_info.length; i++) {
        let block_info = usedblk_info[i] && usedblk_info[i].textContent ? validJSON(usedblk_info[i].textContent) : {};

        if (block_info.blockType === "NciCodeListData") {
            if (!nci_list.some(x => x.code === block_info.code)) {
                let cdiscSubmissionValue = block_info.cdiscSubmissionValue;

                this.impacted = true;
                this.ImpactedList["Nci" + "." + cdiscSubmissionValue] = "NCI Codelist - " + cdiscSubmissionValue;
            }
        }
    }
}

//NCICodeList_Validation while copying records
ImpactValidation.prototype.ImpactNCICodeListValidation = function () {
    let { Standards, selected_records, resolve, reject } = this;
    let loop_index = 0;
    try {
        //Std Target Domain Variable
        let { Domain, Variable } = Standards || [];

        //fn init
        loop(selected_records[loop_index]);

        function loop(rule) {
            //convert string to xml     
            let xml = rule.constructJson &&
                typeof rule.constructJson === "string" &&
                new DOMParser().parseFromString(rule.constructJson, "application/xml");

            //get info from rule
            let usedblk_info = xml &&
                xml.getElementsByTagName("data");

            if (rule.constructJson && usedblk_info && typeof usedblk_info === "object" && usedblk_info.length > 0) {
                //Domain aval for the study
                let isDomainAval = (Domain || []).find(dm => dm.domain === rule.targetDataSet);
                if (isDomainAval) {
                    let cdiscDataStdDomainMetadataID = (isDomainAval || {}).cdiscDataStdDomainMetadataID;
                    let isVariableAval = (Variable || []).find(va => va.variableName === rule.targetVariableName &&
                        va.cdiscDataStdDomainMetadataID === isDomainAval.cdiscDataStdDomainMetadataID);

                    if (isVariableAval) {
                        //match the name and update the id 
                        let cdiscDataStdVariableMetadataID = (isVariableAval || {}).cdiscDataStdVariableMetadataID;

                        let inp_data = {
                            cDISCDataStdID: JSON.parse(
                                sessionStorage.getItem("studyDetails")
                            ).standardID,
                            cdiscDataStdDomainMetadataID: cdiscDataStdDomainMetadataID,
                            cdiscDataStdVariableMetadataID: cdiscDataStdVariableMetadataID
                        }
                        inp_data["StudyID"] = getStudyID();
                        showProgress();
                        controller_call(inp_data, usedblk_info);
                        return;
                    }
                }

                ++loop_index;
                selected_records[loop_index] ? loop(selected_records[loop_index]) : resolve();
            }
            else {
                ++loop_index;
                selected_records[loop_index] ? loop(selected_records[loop_index]) : resolve();
            }


            function controller_call(inp_data, usedblk) {
                CallServerPost("NCICodeList/GetNCIByDatasetVariable", inp_data).then((res) =>
                {
                    hideProgress();
                    let avail_codelist = res.value;

                    if (res.status === 1 && avail_codelist && typeof avail_codelist === "object" && avail_codelist.length > 0) {

                        let avail_codelist = res.value;

                        for (let i = 0; i < usedblk.length; i++) {
                            let block_info = usedblk[i] && usedblk[i].textContent ? validJSON(usedblk[i].textContent) : {};

                            if (block_info.blockType === "NciCodeListData") {
                                if (!avail_codelist.some(x => x.code === block_info.code)) {
                                    selected_records[loop_index].impact = 1;
                                    break;
                                }
                            }
                        }

                    }
                    else {
                        Array.from(usedblk).some(blk => {
                            //get used block info
                            //block info in data block
                            let data = blk && blk.textContent ? validJSON(blk.textContent) : {};
                            if (data.blockType === "NciCodeListData") {
                                selected_records[loop_index].impact = 1;
                                return true;
                            }
                        })
                    }

                    ++loop_index;
                    selected_records[loop_index] ? loop(selected_records[loop_index]) : resolve();
                });
            }
        }
    }
    catch (e) {
        reject();
        hideProgress();
        console.log(e);
    }

}
//WorkDataset Variable Exists
export function WorkDatasetVariableExists(stepBlock, workDataset, VariableRenameList) {
    //overall check 
    let exist = true;
    //get all used block inside the variable step  
    let frst_children = stepBlock && typeof stepBlock === "object" ? stepBlock.getInputTargetBlock("step_statement") : [];
    let children = isObject(frst_children) ? frst_children.getDescendants() : [];
    let workBlocks = children.filter(sblock => sblock.type === "variable_type_work_multi" || sblock.type === "dataset_type_multi_work" || sblock.type === "variable_type_work_multi_2");
    //get only dataset blk from datatable step

    let not_avail_wks = {};

    for (var i = 0; i < workBlocks.length; i++) {

        let blk = workBlocks[i];
        let data_info = validJSON(blk.data);

        switch (data_info.blockType) {
            case "Work":
                {
                    let isExist = workDataset.some(va => {
                        return data_info.name.toUpperCase() === va.memname.toUpperCase()
                    });

                    !isExist && (not_avail_wks[data_info.name] = "Work Dataset - " + data_info.name);
                    //maintaining status
                    exist = exist && isExist;
                }
                break;
            case "WorkVar":
                {
                    //Combine renamed variables also before check for impact
                    let renameVarsByDataset = VariableRenameList && VariableRenameList[data_info.dataset + "@_WorkVar"];
                    renameVarsByDataset = isObjectCheck(renameVarsByDataset) ? renameVarsByDataset : {};

                    let bothVariables = [...workDataset,
                    ...(Object.keys(renameVarsByDataset) || []).map(rv => renameVarsByDataset[rv])];

                    let isExist = exist && bothVariables.some(va => {
                        let renameTo = va.renameTo && typeof va.renameTo === "string" ? va.renameTo : "";
                        let vds = isObjectCheck(va) ? 'dataset' in va ? va.dataset : 'memname' in va ? va.memname : '' : '';
                        let vname = isObjectCheck(va) ? 'name' in va ? va.name : 'variable' in va ? va.variable : '' : '';

                        if (data_info.dataset.toUpperCase() === vds.toUpperCase() &&
                            (data_info.variable.toUpperCase() === vname.toUpperCase() || data_info.variable.toUpperCase() === renameTo.toUpperCase())) {
                            return true;
                        }
                    });

                    !isExist && (not_avail_wks[data_info.dataset + "." + data_info.variable] = "Work Variable - " + data_info.dataset + "." + data_info.variable);
                    //maintaining status
                    exist = exist && isExist;
                }
                break;
        }
    }

    return { Work_Exist: exist, Not_Avail_WkList: not_avail_wks }
}


export function FormErrorHtmlIfObj(header, errObj) {
    try {
        let err = [<div className="errorpop_map marginTopBottomFive">{header} :</div>,
        <ol className="errOrderLi">{(Object.keys(errObj) || []).map((keyName, index) => {
            return <li key={index}>
                {errObj[keyName]}
            </li>
        })}
        </ol>];
        return err;
    }
    catch (e) {
        console.log(e);
        return [];
    }
}

export function FormErrorIfArray(header, errObj) {
    try {

        let errOb = [];
        errObj.map((er, i) => {
            if (errObj.indexOf(er) === i) {
                errOb.push(er)
            }
        });

        let err = [<div className="errorpop_map marginTopBottomFive">{header} :</div>,
        <ol className="errOrderLi">{(errOb || []).map((er, i) => {
            return <li key={er}>
                {er}
            </li>
        })}

        </ol>];
        return err;
    }
    catch (e) {
        console.log(e);
        return [];
    }
}