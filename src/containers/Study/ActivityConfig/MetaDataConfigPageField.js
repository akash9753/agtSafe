export const MetaDatasetPageField = [
    {
        mandatory: true,
        displayName: "Field Properties",
        attributeName: "FieldProperties",
        requirementErrorMessage: "Field Properties should be selected",
    },
    {
        mandatory: false,
        displayName: "Data Dictionaries",
        attributeName: "DataDictionaries",
        requirementErrorMessage: "Data Dictionaries should be selected",
    },
    {
        mandatory: false,
        displayName: "Unit Dictionaries",
        attributeName: "UnitDictionaries",
        requirementErrorMessage: "Unit Dictionaries should be selected",
    },
];
export const ColumnField = [
    {
        mandatory: true,
        displayName: "Form Name",
        attributeName: "FormName",
        requirementErrorMessage: "FormName should be selected",
    },
    {
        mandatory: true,
        displayName: "FormOID",
        attributeName: "FormOID",
        requirementErrorMessage: "FormOID should be selected",
    },
    {
        mandatory: true,
        displayName: "FieldOID",
        attributeName: "FieldOID",
        requirementErrorMessage: "FieldOID should be selected",
    },
    {
        mandatory: true,
        displayName: "PreText",
        attributeName: "PreText",
        requirementErrorMessage: "PreText should be selected",
    },   
    {
        mandatory: true,
        displayName: "Data Type",
        attributeName: "DataType",
        requirementErrorMessage: "DataType should be selected",
    },
    
];

//For Annotation.js page
export const AnnotFields = {
    AnnotationRequired: "AnnotationRequired",
    CRFDocument: "CRFDocument",
    MetaDataset: "MetaDataset"
};

//Field Creation
export const annotateSwitch = {
    controlTypeText: "Switch",
    inputTypeText: "Switch",
    inputRequirementText: "Optional",
    inputTypeErrorMessage: "",
    validationErrorMessage: "",
    requirementErrorMessage: "",
    regExText: null,
    minValue: null,
    maxValue: null
};

export const MetaDataset = {
    controlTypeText: "TextBox",
    inputTypeText: "Alphanumericspecial",
    inputRequirementText: "Mandatory",
    inputTypeErrorMessage: "",
    validationErrorMessage: "",
    requirementErrorMessage: "Meta Dataset should be selected",
    regExText: null,
    minValue: null,
    maxValue: null
};
//Transformation section
export const MappingOutputTypeField = {
    controlTypeText: "DropDownWithSearch",
    inputTypeText: "Alphanumeric",
    inputRequirementText: "Mandatory",
    inputTypeErrorMessage: "",
    validationErrorMessage: "",
    requirementErrorMessage: "Mapping Program Language should be selected",
    regExText: null,
    minValue: null,
    maxValue: null
};
export const rawDatasetField = {
    controlTypeText: "FileSelect",
    inputTypeText: "ServerBrowse",
    inputRequirementText: "Mandatory",
    inputTypeErrorMessage: "",
    validationErrorMessage: "",
    requirementErrorMessage: "Raw Dataset Location should be selected",
    regExText: null,
    minValue: null,
    maxValue: null
};
export const StandardizedDatasetLocationField =
{
    controlTypeText: "FileSelect",
    inputTypeText: "ServerBrowse",
    inputRequirementText: "Mandatory",
    inputTypeErrorMessage: "",
    validationErrorMessage: "",
    requirementErrorMessage: "Output Standardized Dataset Location should be selected",
    regExText: null,
    minValue: null,
    maxValue: null
};

export const MappingFields = {
    StandardDatasetLoc: "StandardDatasetLoc",
    RawDatasetLoc: "RawDatasetLoc",
    MappingOutput: "MappingOutput"
};
