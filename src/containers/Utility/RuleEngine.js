import { RuleReturn } from './commonEnum';
export default class RuleEngine {
    constructor(rules, operations) {
        this.rules = {};
        const thisObj = this;
        rules.map(function (rule) {
            thisObj.rules[rule.label.toLowerCase()] = rule;
        });
        this.undoVal = [];
        this.programs = {};
        this.currentId = "GrandParentDiv";
        this.returnObj = {
            status: false
        };
    }
    get allRules() {
        return this.rules;
    }
    get activeID() {
        return this.currentId;
    }

    //Function to create Random Id's.
    genRandomID() {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        var allProgramKeys = Object.keys(this.programs);
        while (text == "" || allProgramKeys.indexOf(text) >= 0) {
            text = "";
            for (var i = 0; i < 5; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
        }
        return text;
    }

    //getType = (programName) => {
    //    const thisObj = this;
    //    var currprogramName = programName;
    //    var getText = "";
    //    Object.keys(thisObj.rules).map(function (key) {
    //        if (thisObj.rules[key].name === currprogramName) {
    //            getText = thisObj.rules[key].programTypeText;
    //        }
    //    });
    //    return getText;
    //}
    getExtras = (data) => {
        let result = {};
        Object.keys(data).forEach(function (variableName, value) {
            result[variableName] = data[variableName];
        })
        return result;
    }
    getDisplay = (data) => {
        let thisObj = this;

        let result;
        Object.keys(data).forEach(function (variableName, value) {
            (value == 0) ? result = variableName + " = " + thisObj.checkNULL(data[variableName]) : result += "," + variableName + " = " + thisObj.checkNULL(data[variableName]);
        })
        return result;
    }

    checkNULL = (data) => {
        if (data == null) {
            return '""';
        }
        return data;
    }

    //Function to add program rule
    addProgram(programName, id, targetID, subTextValue, programTemplateID, EditID, cbForProAttrCheck) {
        var allProgramKeys = Object.keys(this.programs);
        if (targetID.classList[0] != "VariableList" && targetID.classList[0] != "DatasetList" && targetID.id !== "dropHereNode") {
            if (EditID != -1 && EditID != undefined) {
                if (targetID.id == "droppedDiv") {
                    this.programs["GrandParentDiv"].extras = this.getExtras(subTextValue);
                    this.programs["GrandParentDiv"].display = this.getDisplay(subTextValue);
                }
                else {
                    this.programs[EditID].extras = this.getExtras(subTextValue);
                    this.programs[EditID].display = this.getDisplay(subTextValue);
                }
            }
            else if (allProgramKeys.length > 0) {
                const maxArgs = this.rules[this.programs[targetID.id].name.toLowerCase()].maxArgument;
                const argsCount = this.programs[targetID.id].arguments.length;
                const argsAllowed = this.rules[this.programs[targetID.id].name.toLowerCase()].argumentTypeText;
                const allowConst = argsAllowed === "Variable_Program" || argsAllowed === "Variable_Literal_Program" || argsAllowed === "Literal_Program" || argsAllowed === "Program" || argsAllowed === "Variable-Program-Literal" || argsAllowed === "Dataset_Program" || argsAllowed === "Dataset_Variable_Program" ? true : false;

                //if function is "Variable-Program-Literal" then position rule followed
                if (argsAllowed === "Variable-Program-Literal") {
                    if (this.programs[targetID.id].arguments[0] === undefined) {
                        if (programName !== undefined) {
                            var notAllowArgs = true;
                        }
                    } else if (this.programs[this.programs[targetID.id].arguments[0]].domainName !== undefined || this.programs[this.programs[targetID.id].arguments[0]].name !== undefined) {
                        var notAllowArgs = false;
                    }
                } else {
                    var notAllowArgs = true;
                }


                if (maxArgs == 0 || (maxArgs > 0 && argsCount < maxArgs && allowConst && notAllowArgs)) {
                    const programId = this.genRandomID();
                    if (subTextValue !== undefined) {
                        if (cbForProAttrCheck(programName)) {
                            this.programs[programId] = { name: programName, display: this.getDisplay(subTextValue), key: this.rules[programName.toLowerCase()].name, arguments: [], parentId: targetID.id, programTemplateID: programTemplateID, extras: this.getExtras(subTextValue), type: this.rules[programName.toLowerCase()].programTypeText };
                        } else if (programName.toLowerCase() === "set") {
                            this.programs[programId] = { name: programName, display: this.getDisplay(subTextValue), key: this.rules[programName.toLowerCase()].name, arguments: [], parentId: targetID.id, programTemplateID: programTemplateID, extras: this.getExtras(subTextValue), type: this.rules[programName.toLowerCase()].programTypeText };
                        }
                    } else {
                        this.programs[programId] = {
                            name: programName,
                            key: this.rules[programName.toLowerCase()].name,
                            arguments: [],
                            programTemplateID: programTemplateID,
                            parentId: targetID.id,
                            type: this.rules[programName.toLowerCase()].programTypeText,
                            extras: {}
                        };
                    }


                    this.programs[targetID.id].arguments.push(programId);
                    this.returnObj.status = true;
                    this.returnObj.ID = programId;

                } else {
                    this.returnObj.status = false;
                }
            } else {
                const programId = "GrandParentDiv";
                if (subTextValue !== undefined) {
                    if (cbForProAttrCheck(programName)) {
                        this.programs[programId] = { name: programName, display: this.getDisplay(subTextValue), key: this.rules[programName.toLowerCase()].name, arguments: [], parentId: targetID.id, programTemplateID: programTemplateID, extras: this.getExtras(subTextValue), type: this.rules[programName.toLowerCase()].programTypeText };
                    }
                } else {
                    this.programs[programId] = {
                        name: programName,
                        key: this.rules[programName.toLowerCase()].name,
                        arguments: [],
                        parentId: targetID.id,
                        programTemplateID: programTemplateID,
                        type: this.rules[programName.toLowerCase()].programTypeText,
                        extras: {}
                    };
                }
                this.returnObj.status = true;
                this.returnObj.ID = programId;
            }
            return this.returnObj;
        } else {
            this.returnObj.status = false;
            return this.returnObj;
        }
    }

    //Function to add dataset rule
    addDataset(programName, id, targetID) {
        var allProgramKeys = Object.keys(this.programs);
        if (allProgramKeys.length > 0 && targetID.classList[0] != "VariableList" && targetID.classList[0] != "DatasetList" && targetID.id !== "dropHereNode") {
            //if (allProgramKeys.length > 0) {
            const maxArgs = this.rules[this.programs[targetID.id].name.toLowerCase()].maxArgument;
            const argsCount = this.programs[targetID.id].arguments.length;
            const argsAllowed = this.rules[this.programs[targetID.id].name.toLowerCase()].argumentTypeText;
            const allowConst = argsAllowed === "Dataset_Program" || argsAllowed === "Dataset_Variable_Program" ? true : false;

            if (maxArgs == 0 || (maxArgs > 0 && argsCount < maxArgs && allowConst)) {
                const datasetId = this.genRandomID();
                this.programs[datasetId] = {
                    datasetName: programName,
                    parentId: targetID.id
                };

                this.programs[targetID.id].arguments.push(datasetId);
                this.returnObj.status = true;
                this.returnObj.ID = datasetId;

            } else {
                this.returnObj.status = false;
            }
            //} else {
            //    const datasetId = "GrandParentDiv";
            //    this.programs[datasetId] = {
            //        datasetName: programName,
            //        parentId: "root"
            //    };
            //    this.returnObj.status = true;
            //    this.returnObj.ID = datasetId;
            //}
            return this.returnObj;
        } else {
            this.returnObj.status = false;
            return this.returnObj;
        }
    }

    //Function to set Highlight Indication Accept or Not.
    DragProgram(TargetID, currentDraggedArgsType, dragObject) {
        if (TargetID.classList != "VariableList" && TargetID.classList[0] != "DatasetList" && TargetID.id !== "dropHereNode") {
            const maxArgs = this.rules[this.programs[TargetID.id].name.toLowerCase()].maxArgument;
            const argsCount = this.programs[TargetID.id].arguments.length;
            const argsAllowed = this.rules[this.programs[TargetID.id].name.toLowerCase()].argumentTypeText;
            var allowConst;
            if (currentDraggedArgsType === "Program") {
                allowConst = argsAllowed === "Variable_Program" || argsAllowed === "Variable_Literal_Program" || argsAllowed === "Literal_Program" || argsAllowed === "Program" || argsAllowed === "Variable-Program-Literal" || argsAllowed === "Dataset_Program" || argsAllowed === "Dataset_Variable_Program" ? true : false;
            } else if (currentDraggedArgsType === "Variable") {
                allowConst = argsAllowed === "Variable" || argsAllowed === "Variable_Literal" || argsAllowed === "Variable_Program" || argsAllowed === "Variable_Literal_Program" || argsAllowed === "Variable-Program-Literal" || argsAllowed === "Dataset_Variable_Program" ? true : false;
            } else if (currentDraggedArgsType === "Constant") {
                allowConst = argsAllowed === "Literal" || argsAllowed === "Variable_Literal" || argsAllowed === "Literal_Program" || argsAllowed === "Variable_Literal_Program" || argsAllowed === "Variable-Program-Literal" ? true : false;
            } else if (currentDraggedArgsType === "Dataset") {
                allowConst = argsAllowed === "Dataset_Variable_Program" || argsAllowed === "Dataset_Program" ? true : false;
            }

            //if function is "Variable-Program-Literal" then position rule followed
            if (argsAllowed === "Variable-Program-Literal") {
                if (this.programs[TargetID.id].arguments[0] === undefined) {
                    if (currentDraggedArgsType === "Program" || currentDraggedArgsType === "Variable") {
                        var notAllowArgs = true;
                    } else {
                        var notAllowArgs = false;
                    }
                } else if (this.programs[TargetID.id].arguments[0] !== undefined) {
                    if (currentDraggedArgsType === "Constant") {
                        var notAllowArgs = true;
                    } else {
                        var notAllowArgs = false;
                    }
                }
            } else {
                var notAllowArgs = true;
            }


            if (argsCount < maxArgs && allowConst && notAllowArgs) {
                return true;
            }
            else {
                return false;
            }
        } else {
            return false;
        }
    }

    //on drag start this func will shows avaliable drop nodes
    CheckAllowArgs(TargetID, currentDraggedArgsType, dragObject) {
        if (TargetID.classList != "VariableList" && TargetID.classList[0] != "DatasetList" && TargetID.id !== "dropHereNode") {
            const maxArgs = this.rules[this.programs[TargetID.id].name.toLowerCase()].maxArgument;
            const argsCount = this.programs[TargetID.id].arguments.length;
            const argsAllowed = this.rules[this.programs[TargetID.id].name.toLowerCase()].argumentTypeText;
            var allowConst;
            if (currentDraggedArgsType === "Program") {
                allowConst = argsAllowed === "Variable_Program" || argsAllowed === "Variable_Literal_Program" || argsAllowed === "Literal_Program" || argsAllowed === "Program" || argsAllowed === "Variable-Program-Literal" || argsAllowed === "Dataset_Program" || argsAllowed === "Dataset_Variable_Program" ? true : false;
            } else if (currentDraggedArgsType === "Variable") {
                allowConst = argsAllowed === "Variable" || argsAllowed === "Variable_Literal" || argsAllowed === "Variable_Program" || argsAllowed === "Variable_Literal_Program" || argsAllowed === "Variable-Program-Literal" || argsAllowed === "Dataset_Variable_Program" ? true : false;
            } else if (currentDraggedArgsType === "Constant") {
                allowConst = argsAllowed === "Literal" || argsAllowed === "Variable_Literal" || argsAllowed === "Literal_Program" || argsAllowed === "Variable_Literal_Program" || argsAllowed === "Variable-Program-Literal" ? true : false;
            } else if (currentDraggedArgsType === "Dataset") {
                allowConst = argsAllowed === "Dataset_Variable_Program" || argsAllowed === "Dataset_Program" ? true : false;
            }

            //if function is "Variable-Program-Literal" then position rule followed
            if (argsAllowed === "Variable-Program-Literal") {
                if (this.programs[TargetID.id].arguments[0] === undefined) {
                    if (currentDraggedArgsType === "Program" || currentDraggedArgsType === "Variable") {
                        var notAllowArgs = true;
                    } else {
                        var notAllowArgs = false;
                    }
                } else if (this.programs[TargetID.id].arguments[0] !== undefined) {
                    if (currentDraggedArgsType === "Constant") {
                        var notAllowArgs = true;
                    } else {
                        var notAllowArgs = false;
                    }
                }
            } else {
                var notAllowArgs = true;
            }


            if (argsCount < maxArgs && allowConst && notAllowArgs) {
                return true;
            }
            else {
                return false;
            }
        } else {
            return false;
        }
    }

    //Function to add Constant Rule.
    addConstant(constValue, targetID) {
        if (targetID.id != "droppedDiv" && targetID.classList[0] != "DatasetList" && targetID.classList[0] != "VariableList" && targetID.id !== "dropHereNode") {
            const programName = this.programs[targetID.id].name;
            const maxArgs = this.rules[programName.toLowerCase()].maxArgument;
            const argsAllowed = this.rules[programName.toLowerCase()].argumentTypeText;
            const allowConst = argsAllowed == "Literal" || argsAllowed == "Variable_Literal" || argsAllowed == "Literal_Program" || argsAllowed == "Variable_Literal_Program" || argsAllowed === "Variable-Program-Literal" ? true : false;
            if (allowConst) {
                const argsCount = this.programs[targetID.id].arguments.length;

                //if function is "Variable-Program-Literal" then position rule followed
                if (argsAllowed === "Variable-Program-Literal") {
                    if (this.programs[targetID.id].arguments[0] !== undefined) {
                        var notAllowArgs = true;
                    } else {
                        var notAllowArgs = false;
                    }
                } else {
                    var notAllowArgs = true;
                }

                if (maxArgs == 0 || (maxArgs > 0 && argsCount < maxArgs && notAllowArgs)) {
                    const constID = this.genRandomID();
                    this.programs[constID] = {
                        value: constValue,
                        parentId: targetID.id
                    };
                    this.programs[targetID.id].arguments.push(constID);
                    this.returnObj.status = true;
                } else {
                    this.returnObj.status = false;
                }
            } else {
                this.returnObj.status = false;
            }
        } else {
            this.returnObj.status = false;
        }
        return this.returnObj;
    }

    //Function to check add constant when drop on target
    checkAddConstant(targetID) {
        if (Object.keys(this.programs).length > 0 && targetID.id != "droppedDiv" && targetID.classList[0] != "DatasetList" && targetID.classList[0] != "VariableList" && targetID.id !== "dropHereNode") {
            const programName = this.programs[targetID.id].name;
            const maxArgs = this.rules[programName.toLowerCase()].maxArgument;
            const argsAllowed = this.rules[programName.toLowerCase()].argumentTypeText;
            const allowConst = argsAllowed == "Literal" || argsAllowed == "Variable_Literal" || argsAllowed == "Literal_Program" || argsAllowed == "Variable_Literal_Program" || argsAllowed === "Variable-Program-Literal" ? true : false;
            const argsCount = this.programs[targetID.id].arguments.length;

            //if function is "Variable-Program-Literal" then position rule followed
            if (argsAllowed === "Variable-Program-Literal") {
                if (this.programs[targetID.id].arguments[0] !== undefined) {
                    var notAllowArgs = true;
                } else {
                    var notAllowArgs = false;
                }
            } else {
                var notAllowArgs = true;
            }

            if (maxArgs == 0 || (maxArgs > 0 && argsCount < maxArgs && allowConst && notAllowArgs)) {
                this.returnObj.status = true;
            } else {
                this.returnObj.status = false;
            }
        } else {
            this.returnObj.status = false;
        }
        return this.returnObj;
    }

    //Function to add variable rule
    addVariable(domainName, variableName, id, targetID) {

        if (Object.keys(this.programs).length > 0 && targetID.classList[0] != "DatasetList" && targetID.classList[0] != "VariableList" && targetID.id !== "dropHereNode") {
            const programName = this.programs[targetID.id].name;
            const maxArgs = this.rules[programName.toLowerCase()].maxArgument;
            const argsAllowed = this.rules[programName.toLowerCase()].argumentTypeText;
            const allowVariable = argsAllowed === "Variable" || argsAllowed === "Variable_Literal" || argsAllowed === "Variable_Program" || argsAllowed === "Variable_Literal_Program" || argsAllowed === "Variable-Program-Literal" || argsAllowed === "Dataset_Variable_Program" ? true : false;
            if (allowVariable) {
                const argsCount = this.programs[targetID.id].arguments.length;

                //if function is "Variable-Program-Literal" then position rule followed
                if (argsAllowed === "Variable-Program-Literal") {
                    if (this.programs[targetID.id].arguments[0] === undefined) {
                        if (domainName !== undefined && variableName !== undefined) {
                            var notAllowArgs = true;
                        }
                    } else if (this.programs[this.programs[targetID.id].arguments[0]].domainName !== undefined || this.programs[this.programs[targetID.id].arguments[0]].name !== undefined) {
                        var notAllowArgs = false;
                    }
                } else {
                    var notAllowArgs = true;
                }

                if (maxArgs == 0 || (maxArgs > 0 && argsCount < maxArgs && notAllowArgs)) {
                    const variableId = this.genRandomID();
                    this.programs[variableId] = {
                        domainName: domainName,
                        variableName: variableName,
                        parentId: targetID.id
                    };

                    this.programs[targetID.id].arguments.push(variableId);
                    this.returnObj.status = true;
                    this.returnObj.ID = variableId;
                } else {
                    this.returnObj.status = false;
                }
            } else {
                this.returnObj.status = false;
            }
        } else {
            this.returnObj.status = false;
        }
        return this.returnObj;

    }

}