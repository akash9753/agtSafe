export function findInString(
    value = null,
    stringTofind = null,
    separator = " "
) {
    if (value === null || stringTofind === null) {
        return false;
    }
    value = value.toString().toLowerCase();
    stringTofind = stringTofind.toString().toLowerCase();
    if (separator === "") {
        return value.includes(stringTofind);
    } else {
        let sa = stringTofind.split(separator);
        for (var i = 0; i < sa.length; i++) {
            if (value.includes(sa[i])) {
                return true;
            }
        }
    }
    return false;
}
export const SOURCE = "source";
export const TARGET = "target";
export const WORK = "work";
export const SOURCE_DATASET = "SOURCE_DATASET";
export const SOURCE_VARIABLE = "SOURCE_VARIABLE";
export const TARGET_DATASET = "TARGET_DATASET";
export const TARGET_VARIABLE = "TARGET_VARIABLE";
export const PROGRAM = "PROGRAM";
export const DISPLAY_KEYS = {
    "SOURCE_DATASET": "TABLE_NAME",
    "TARGET_DATASET": "domain",
    "SOURCE_VARIABLE": "COLUMN_NAME",
    "TARGET_VARIABLE": "variableName",
    "PROGRAM": "label"
};

export const MAPPINGOPT = "MappingOpt";
export const EMPTY_STR = "";

export function getValueFromForm(getFieldsValue, key) {
    return getFieldsValue([key])[key] !== undefined
        ? getFieldsValue([key])[key]
        : "";
}
export const IMPACTED_ROW = "IMPACTED_ROW";
export const NO_IMPACT = "NO_IMPACT";
