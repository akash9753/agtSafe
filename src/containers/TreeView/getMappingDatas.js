import React from 'react';
import { CallServerPost,getStudyDetails, showProgress, hideProgress } from '../Utility/sharedUtility';
import { TreeNode } from '../../components/uielements/tree';
import { Select } from 'antd';

const studyDetails = getStudyDetails();
const { Option } = Select;

export function MappingData () {
    this.CallBack = {};
    
}

export let MappingDatas = {
    SourceDataset: {
        Domain: [],
        Variable: []
    },
    Standards: {
        Domain: [],
        Variable: []
    },
    MappingList: [],
    FieldProperties: [],
    StandardVaraibleOps: {},
    Loaded: false,
    CustomTargetDS:[]
}

//Get All Required Data For Page Render and  when we create mapping and upadate mapping 
MappingData.prototype.GetInit = function ()
{
        this.GetMapping();
}


//Get Source List
MappingData.prototype.GetSource = function () {
    const obj = this;
    showProgress();
    CallServerPost('Study/GetAllSourceDataSetMetaData', { studyID: getStudyDetails().studyID })
        .then(
            function (data) {
            let value = data.value;
            if (value !== null) {
                MappingDatas.Loaded = true;
                if ('CustomTargetDS' in value) {
                    MappingDatas.CustomTargetDS = value.CustomTargetDS;
                } else {
                    MappingDatas.CustomTargetDS = [];

                }
                if ('target' in value && 'domainList' in value.target && 'variableList' in value.target)
                {
                        MappingDatas.Standards =
                        {
                            Domain: value.target.domainList, Variable: value.target.variableList
                        };
                        MappingDatas.StandardDomainOps = value.target.domainList.map(function (op)
                        {
                            if (MappingDatas.CustomTargetDS.indexOf(op.domain) === -1 && (op.domain && typeof op.domain === 'string' && !op.domain.toLowerCase().includes('_int')))
                            {
                                let varList = value.target.variableList.filter(varObj => varObj.cdiscDataStdDomainMetadataID === op.cdiscDataStdDomainMetadataID);
                                MappingDatas.StandardVaraibleOps[op.domain] = varList.map(function (varop) {
                                    return <Option key={varop.variableName} value={varop.variableName}>{varop.variableName}</Option>;
                                });
                                return <Option key={op.domain} value={op.domain}>{op.domain}</Option>;
                            }
                        });
                        MappingDatas.FieldProperties = 'FieldProperties' in value ? value.FieldProperties : [];
                    } else {
                        MappingDatas.Standards = {
                            Domain: [], Variable: []
                        };
                    }
                if ('DomainMetadata' in value && 'VariableMetadata' in value)
                {
                    MappingDatas.SourceDataset =
                    {
                            Domain: value.DomainMetadata, Variable: value.VariableMetadata

                    };
                } else
                {
                        MappingDatas.SourceDataset = {
                            Domain: [], Variable: []
                        };
                }
               
                     obj.CallBack();
                } else {
                    alert("Error");

            }
            //hideProgress();
            });
}

//Get Target List
MappingData.prototype.GetMapping = function () {
    const obj = this;
    //showProgress();
    CallServerPost('MappingOperations/GetAllMappingOperationsByStudyID', { studyID: getStudyDetails().studyID })
        .then(
            function (response) {
                if (response.value != null) {
                    MappingDatas.Loaded = true;
                    MappingDatas.MappingList = response.value;
                    obj.GetSource();
                } else {
                    MappingDatas.MappingList = [];
                    obj.GetSource();

                }
            });
}

//Get Target List
MappingData.prototype.RefreshMapping = function (value) {
    const obj = this;
   // showProgress();
    CallServerPost('MappingOperations/GetAllMappingOperationsByStudyID', { studyID: getStudyDetails().studyID })
        .then(
        function (response) {
            let result = response.value;
            if (typeof result === 'object' && result) {
                    MappingDatas.MappingList = response.value;

                    obj.CallBack(value, response.value);

            } else {
                    MappingDatas.MappingList = [];
                    obj.CallBack(value, []);

            }
           // hideProgress();
            });
}



export const DomainDropDownOptionForm = (data) => (data != undefined && data != null) ? data.map(function (option) {
        return (
            <Select.Option key={option.cdiscDataStdDomainMetadataID} value={option.cdiscDataStdDomainMetadataID}>
                {option.domain}
            </Select.Option>
        )
}) : [];


export function filter(data, SourceDomain){

    if (data != undefined && data != null) {
        let Source = [];
        data["SourceDataset"].Variable.filter(x => x["TABLE_NAME"] == SourceDomain).reduce((x, y, index) => {
            if (index == 1)
                Source.push(x)
            if (!Source.some(unique => unique.COLUMN_NAME == y.COLUMN_NAME))
                Source.push(y)

            return Source;
        });
        return Source;

    }
    else {
        return [];
    }
}




