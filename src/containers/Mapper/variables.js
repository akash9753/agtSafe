import React, { Component } from "react";
import { Form, Icon, Select, Button } from "antd";
import { NewListWrapper } from "../TreeView/newListComponent.style";
import { InputSearch } from "../../components/uielements/input";
import {
    findInString,
    SOURCE,
    TARGET,
    MAPPINGOPT,
    SOURCE_VARIABLE,
    TARGET_VARIABLE
} from "../Utility/commonUtils";

import { MappingDatas } from "../TreeView/getMappingDatas";

const { Option } = Select;
const antIcon = (
    <Icon type="loading" style={{ fontSize: 24, color: "#17242c" }} spin />
);
const columns = [
    {
        title: "Target",
        dataIndex: "target",
        key: "target",
        width: 100
    },
    {
        title: "Action",
        dataIndex: "action",
        key: "action",
        width: 100
    },
    {
        title: "Rule",
        dataIndex: "rule",
        key: "rule"
    }
];
const margin = {
    margin: "0 5px 5px 0"
};

let thisObj = {};
class MappingVariables extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: props.selectedVarDS,
            searchValue:"",
            datasetName:
                props.mappingType === SOURCE
                    ? props.selectedDS.TABLE_NAME
                    : props.selectedDS.domain,
            
        };
        thisObj = this;
    }

    getVariables = () => {
        const { allValues, mappingType, selectedDS } = this.props;
        if (mappingType === SOURCE) {
            return this.getSourceValues(allValues, selectedDS);
        } else if (mappingType === TARGET) {
            return this.getTargetValues(allValues, selectedDS);
        } else {
            return [];
        }
    };

    getSourceValues = (allValues, selectedDS) => {
        const { searchValue } = this.state;
        const props = this.props;        
        let forMappingList = props.for !== MAPPINGOPT;

        let srcvariables = [];        
        let variablesList = allValues.SourceDataset.Variable.filter(
            variable => variable.TABLE_NAME === selectedDS.TABLE_NAME
        );

        variablesList.map(function (variable,index) {
            let activeClass =
                props.selectedVarDS !== null &&
                    variable.COLUMN_NAME === props.selectedVarDS.COLUMN_NAME
                    ? "isoList active"
                    : "isoList";

            if (
                searchValue === "" ||
                findInString(variable.COLUMN_NAME, searchValue)
            ) {
                let datasetObj = variable;
                let dragObjValues = {
                    value: variable,
                    type: SOURCE_VARIABLE
                };
                
                srcvariables.push(
                    <div key={"srcmaindiv" + index++} className={activeClass}
                        name={forMappingList ? "forMappingList" : "forMappingAdd"} >
                        {forMappingList && <div
                            key={"srcbgdiv" + index++}
                            className="isoNoteBGColor"

                            style={{ width: "5px", background: "#7ED321" }}
                        />}
                        <div
                            key={"noteTExtdiv" + index++}
                            className="isoNoteText"
                          
                            onClick={
                                (e) => forMappingList ?
                                    props.onClick(datasetObj)
                                    : e.preventDefault()
                            }

                        >

                            <h3 draggable={!forMappingList}
                                onDragStart={
                                    (e) => !forMappingList ?
                                        props.onDrag(e, JSON.stringify(dragObjValues))
                                        : e.preventDefault()
                                }>{variable.COLUMN_NAME}</h3>

                            {forMappingList && <span key={"srcspan" + index++} className="isoNoteCreatedDate">
                                {variable.DESCRIPTION}
                            </span>
                            }
                        </div>
                    </div>
                );
            }
        });

        return srcvariables;
    };

    getTargetValues = (allValues, selectedDS) => {
        const { searchValue, selectedValue } = this.state;        
        const props = this.props;
        const { selectedVarDS } = props;

        let srcvariables = [];
        const thisobj = this;
        let index = 1;
        let variablesList = allValues.Standards.Variable.filter(
            variable =>
                variable.cdiscDataStdDomainMetadataID ===
                selectedDS.cdiscDataStdDomainMetadataID
        );

        variablesList.map(function (variable) {

            let forMappingList = props.for !== MAPPINGOPT;
            let activeClass =
                selectedVarDS !== null &&
                    variable.variableName === selectedVarDS.variableName
                    ? "isoList active"
                    : "isoList";
            let mappingConstruct = MappingDatas.MappingList.filter(
                mapper =>
                    mapper.cdiscDataStdVariableMetadataID ===
                    variable.cdiscDataStdVariableMetadataID
            );
            if (
                mappingConstruct !== null &&
                mappingConstruct.length > 0 &&
                (searchValue === "" || findInString(variable.variableName, searchValue))
            ) {
                const datasetObj = variable;
                let dragObjValues = {
                    value: variable,
                    type: TARGET_VARIABLE
                };
                srcvariables.push(
                    <div key={"tgtmaindiv" + index} className={activeClass}
                        name={forMappingList ? "forMappingList" : "forMappingAdd"} >
                        {forMappingList &&
                            <div
                                key={"tgtbgdiv" + index}
                                className="isoNoteBGColor"
                                style={{ width: "5px", background: "#7ED321" }}
                            />
                        }

                        <div
                            key={"tgtnoteTExtdiv" + index}
                            className="isoNoteText"    
                            onClick={
                                (e) => forMappingList ?
                                       props.onClick(datasetObj)
                                    : e.preventDefault()    
                            }>

                            <h3 onDragStart={
                                (e) => !forMappingList ?
                                    props.onDrag(e, JSON.stringify(dragObjValues))
                                    : e.preventDefault()
                                }
                                draggable={!forMappingList} >
                                {variable.variableName}
                            </h3>

                            {forMappingList && <span key={"tgtspan" + index} className="isoNoteCreatedDate">
                                {variable.variableLabel}
                            </span>
                            }
                        </div>
                    </div>
                );
            }
            index += 1;
        });

        return srcvariables;
    };

    onVarSearchChange = (e) => {
        thisObj.setState({ searchValue:e.target.value });
    }

    render() {
        const { datasetName } = this.state;
        return (         
            <NewListWrapper className="isoNoteListWrapper" style={{ height:"calc(100vh - 208px)"}}>
                    <InputSearch
                        placeholder={"Search Variable in " + datasetName}
                        className="isoSearchNotes"
                        onChange={this.onVarSearchChange}
                        allowClear
                    />
                    <div
                        className="isoNoteList"
                        style={{ height: "calc(100vh - 190px)" }}
                    >
                        {this.getVariables()}
                    </div>
                </NewListWrapper>
        );
    }
}

const WrappedApp = Form.create()(MappingVariables);

export default WrappedApp;
