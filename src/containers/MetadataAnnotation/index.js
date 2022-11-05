import React, { createRef } from 'react';
import { HotTable } from '@handsontable/react';
import { Row, Col, Button, Empty, Result, Modal, Icon,Checkbox } from 'antd';
import 'handsontable/dist/handsontable.full.css';
import { MappingData, MappingDatas } from '../TreeView/getMappingDatas';
import {
    isArray,
    isNotNull,
    showProgress,
    hideProgress,
    getStudyID,
    getUserID,
    PostCallWithZoneForDomainCreate,
    successModal,
    errorModal,
    validJSON,
    successModalCallback,
    annotationPermission,
    CallServerPost,
    strLowerCase,
    FormErrorIfArray,
    warningModal
} from '../Utility/sharedUtility';
import Box from '../../components/utility/box';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import ContentTab from '../TreeView/contentTab';
import Progress from '../Utility/ProgressBar';
import ProgressBarFullyUI from '../Utility/ProgressBarFullyUI';
import ViewUpdatedRecord from './ViewUpdatedRecord';
import autocompleteType from 'handsontable/commonjs/cellTypes/autocompleteType';
import { UpCircleFill, DollarCircleFill } from '@ant-design/icons';

let thisObj = {};

export default class MetaDataAnnotation extends React.Component {

    constructor(props) {

        super(props);
        let locationState = (props.location && props.location.state) ? props.location.state : {};
        let ColConfig = ['DataType', 'PreText', 'FieldOID', 'FormOID', 'FormName'];

        this.state = {
            SourceDataset: MappingDatas.SourceDataset,
            Column: [],
            RowData: [],
            loading:"loading",
            ColumnAndDataType: [],
            showHeader: false,
            Progress: false,
            PrimarySourceData: "",
            filteredData:[],
            annotationsWorkflowStatus: locationState.wrkFlowStatus,
            ColConfig: locationState.AnnotActvtyList.filter(activi => {
                return ColConfig.indexOf(activi.configurationName) !== -1;

            }),
            activityDetails: locationState.allActivityDetails,
            //For Prediction
            //we are handling progress bar in  ui
            progressBarfullyUI: { percent: 0, status: "active", show: false },
            //Show & hide Columns pop
            showColKeepResetModal: false,
            hiddenColumn: [],
            selColumn: [],
           
        }
        thisObj = this;

        //create ref to access the table 
        this.hotTableComponent = createRef();

    }

    //Get Raw data(Source) and standards here
    componentDidMount()
    {
        this.getData();
    }

    getData = () => {

        showProgress();
        CallServerPost('AnnotationData/GetAnnotationDataByStudyID', { studyID: getStudyID() }).then(function (res) {

            if (res.status === 1) {
                let value = res.value;
                thisObj.GetRawDataset(value);
            }
            else {
                thisObj.GetRawDataset([]);
            }
        })
    }

    //GetSourceAndTarget Datasets
    GetRawDataset = (UpdatedRecFromDB = []) => {
        if (!MappingDatas.Loaded) {
            showProgress();
            let MappinDatas = new MappingData();
            MappinDatas.CallBack = () => {
                thisObj.GetSourceAndTarget(MappingDatas, UpdatedRecFromDB);
            }
            MappinDatas.GetSource();
        }
        else {
            thisObj.GetSourceAndTarget(MappingDatas, UpdatedRecFromDB);
        }
    }

    //Here forming rows & columns according to source and standards
    GetSourceAndTarget = (MappingDatas, UpdatedRecFromDB) => {
        const { Standards, FieldProperties } = MappingDatas;
        if (FieldProperties) {

            //Stringify FieldProperties
            //Do not override the actual FieldProperties
            let stringifyFieldProperties = JSON.stringify(FieldProperties);
            let fld_property = JSON.parse(stringifyFieldProperties);

            let RowData = thisObj.FormRow(fld_property, UpdatedRecFromDB);

            let { Column } = thisObj.FormColumn(fld_property);
            let DataType = thisObj.FormDataType(Column, Standards);

            thisObj.setState({
                loading:"loaded",
                RowData: RowData,
                filteredData: RowData,
                ColumnAndDataType: DataType,
                orgColumnAndDataType: DataType,
                Standards: Standards,
                ShowUpdatedRecords: false,
                PrimarySourceData: JSON.stringify(RowData),
                SourceDataset: MappingDatas.SourceDataset,
                UpdatedRecFromDB: UpdatedRecFromDB
            }, hideProgress());

        } else {
            thisObj.setState({
                loading: "loaded",
                RowData: [],
                ColumnAndDataType: [],
                orgColumnAndDataType: [],
                Standards: Standards,
                ShowUpdatedRecords: false,
            }, hideProgress());
        }
    }

    //Column Formation
    FormColumn = (FieldProperties) => {

        let Col = [];
        //FOR ALL Coulmn
        if (FieldProperties.length > 0 && typeof FieldProperties[0] === "object") {
            Col = Object.keys(FieldProperties[0]);
        }

        //Remove few col in the list
        let removecol = ["annotationdataid", "update","row_num","rownum", "changeidentifier", "recordstatus"];

        //Sorting
        //Below we are doing sorting => "TargetDomain", "TargetVariable","FORMOID","FIELDOID"
        //So First four column should be "TargetDomain", "TargetVariable","FORMOID","FIELDOID"
        let orderCol = [...new Set(["TargetDomain", "TargetVariable", "FORMOID", "FIELDOID", ...Col.filter(c => removecol.indexOf(c.toLowerCase()) === -1)])]

        let Column = [

            ...orderCol.map(c => {
                return {
                    title: c.toUpperCase(),
                    dataIndex: c,
                }
            })
        ]


        return { Column: Column }
    }

    getDomain = (domainObj) =>
    {
        try {
            let dm = [];
            domainObj.map(d => {
                if (!strLowerCase(d.domain).includes('_int'))
                {
                    dm.push(d.domain);
                }
            });
            return dm;
        }
        catch (e) {
            return [];
        }
    }
    //Column DataType Formation
    //Here we deciding Type of input for Columns
    FormDataType = (Column, Standards) => {
        const { Domain } = Standards;
        let { annotationsWorkflowStatus } = this.state;
        let HTMLCol = ["TargetDomain", "TargetVariable"];
        //Output generation Used Target should not show here
        let { CustomTargetDS } = MappingDatas;

        let dm = JSON.stringify(Domain);
        let domainObj = validJSON(dm);
        domainObj = domainObj.filter(dmn => CustomTargetDS.indexOf(dmn.domain) === -1);
        let dmObj = this.getDomain(domainObj);
        //end
        return Column.map((col, i) => {
            if (HTMLCol.indexOf(col.dataIndex) !== -1) {
                switch (col.dataIndex) {
                    case "TargetDomain":
                        return {
                            title: col.title,
                            data: col.dataIndex,
                            strict: true,
                            allowInvalid: false,
                            filter: true,
                            type: 'dropdown',
                            source: ["--Select--", ...dmObj, "Not Mapped"],
                            readOnly: !annotationPermission(annotationsWorkflowStatus)

                        }
                    case "TargetVariable":
                        return {

                            title: col.title,
                            data: col.dataIndex,
                            strict: true,
                            filter:true,
                            allowInvalid: false,
                            type: 'autocomplete',
                            source: ["--Select--"],
                            readOnly: !annotationPermission(annotationsWorkflowStatus)
                        }
                }
            }
            else {
                return {
                    title: col.title,
                    data: col.dataIndex,
                    readOnly: true
                };
            }

        });
    }

    //Form Row Data
    FormRow = (FieldProperties, UpdatedRecFromDB) =>
    {
        let RowData = [];

        if (FieldProperties.length > 0) {
            let { ColConfig } = this.state;

            FieldProperties.map((Fld_Prop, i) =>
            {

                //ColConfig -> This var contains the column configuration details that were given in the Meta Data config in the Activity configuration
                //Match field properties to column configuration keys
                ColConfig.map(ca =>
                {
                    let Fld_Prop_keys = Object.keys(Fld_Prop);
                    //Match key with columnconfig
                    let matchKey = Fld_Prop_keys.find(k => k.toLowerCase() === ca.configurationValue.toLowerCase());

                    //Delete after match and use our column config columns only
                    let matchKeyValue = Fld_Prop[matchKey];
                    delete Fld_Prop[matchKey];

                    Fld_Prop[ca.configurationName.toUpperCase()] = matchKeyValue;
                });

                //Table Update
                    //If the record has already been updated, the updated record must be set
                    //Update done here
                    let is_RecFromDB = UpdatedRecFromDB.find(rec => rec.sourceDataSet === Fld_Prop.FORMOID && rec.sourceVariableName === Fld_Prop.FIELDOID);
                    let updated = is_RecFromDB ? true : false;

                    // Check is DOmain and Var from DB available for current study or not
                    let cdiscDataStdDomainMetadataID = updated ? thisObj.GetDomain(is_RecFromDB.targetDataSet) : -1;
                    //Is var aval in Current study
                    let isVarAval = updated ? thisObj.GetVariable(is_RecFromDB.targetVariableName, cdiscDataStdDomainMetadataID) : -1;
                //END For Table Update 

                //Additional columns are added here(TargetDomain,TargetVariable,Update,CHANGEIDENTIFIER,RecordStatus(For view Table))
                Fld_Prop["TargetDomain"] = cdiscDataStdDomainMetadataID !== -1 ? is_RecFromDB.targetDataSet : "--Select--" //Mandatory Column
                Fld_Prop["TargetVariable"] = isVarAval !== -1 ? is_RecFromDB.targetVariableName : "--Select--"; //Mandatory Column
                Fld_Prop["AnnotationDataID"] = updated ? is_RecFromDB.annotationDataID : 0; // for in db table this one is not null
                Fld_Prop["Update"] = updated; //The record for updating or creating can be found here
                Fld_Prop["CHANGEIDENTIFIER"] = false; //Those records that have been changed can be found here
                Fld_Prop["RecordStatus"] = updated ? "Update" : "Create"; 

                RowData.push(Fld_Prop);

            });
        }
        return RowData;
    }

    //When TargetDomain Drop down onchange  will come here
    //Filter TargetVariable based on domain
    GetTargetVariable = (TargetDomainName) =>
    {
        if (TargetDomainName)
        {
            const { Standards } = thisObj.state;
            const { Domain, Variable } = Standards;

            switch (TargetDomainName)
            {
                case "Not Mapped":
                    return ["Not Mapped"];
                default:
                {
                    const TargetDomain = Domain.find(x => x.domain.toLowerCase() === TargetDomainName.toLowerCase());
                    const sel_CDISCDataStdDomainMetadataID = (typeof TargetDomain === "object" && "cdiscDataStdDomainMetadataID" in TargetDomain) ? TargetDomain.cdiscDataStdDomainMetadataID :
                            -1;

   
                    //variable based on selected domain in target domain column
                    let variable = Variable.filter(x => x.cdiscDataStdDomainMetadataID === sel_CDISCDataStdDomainMetadataID);
                    return ["--Select--", ...variable.map(va => va.variableName)];
                }
            }
        }
        else
        {
            return [];
        }
    }

    //GetTableJSON
    GetTableJSON = () =>
    {
        try
        {
            return this.hotTableComponent.current.hotInstance.getSourceData();
        }
        catch (e)
        {
            return [];
        }
    }

    //Data Formation
    //For Create
    DataFormation = (data) =>
    {
        if (data.length > 0)
        {
            return data.map(da =>
            {
                let CDISCDataStdDomainMetadataID = thisObj.GetDomain(da.TargetDomain);

                return {
                    StudyID: getStudyID(),
                    CRFDocumentID: 3,
                    AnnotationText: "Text",
                    CDISCDataStdDomainMetadataID: CDISCDataStdDomainMetadataID,
                    CDISCDataStdVariableMetadataID: thisObj.GetVariable(da.TargetVariable, CDISCDataStdDomainMetadataID),
                    SourceDataSet: da.FORMOID,
                    SourceVariableName: da.FIELDOID,
                    TargetDataSet: da.TargetDomain,
                    TargetVariableName: da.TargetVariable,
                    AnnotationDataID: da.AnnotationDataID,
                    Update: da.Update,
                    VicinityText: 'test',
                    PageNumber: 0,
                    AdditionalSourceData: "[]",
                    TimeZone: "IST",
                    UpdatedBy: getUserID(),
                    UserID: getUserID(),
                    AnnotationShape: "MetaData",
                    BorderColor: "MetaData",
                    BorderWidth: 0,
                    FontSize: 0,
                    FontStyle: "MetaData",
                    FontColor: "MetaData",
                    FillColor: "MetaData",
                    TopCoordinate: 0,
                    LeftCoordinate: 0,
                    AnnotationHeight: 0,
                    AnnotationWidth: 0
                }
            })
        }
    }

    //Get Target Domain Aval
    GetDomain = (TargetDomainName) =>
    {
        const { Standards } = MappingDatas;
        const { Domain } = Standards

        let Sel_Domain = isNotNull(TargetDomainName) ?
            Domain.find(x => x.domain.toLowerCase() === TargetDomainName.toLowerCase()) : {};

        return TargetDomainName === "Not Mapped" ? 0 : Sel_Domain ? Sel_Domain.cdiscDataStdDomainMetadataID : -1;
    }

    //is Target Variable Aval
    GetVariable = (TargetVariableName, CDISCDataStdDomainMetadataID) =>
    {
        const { Standards } = MappingDatas;
        const { Variable } = Standards

        let Sel_Variable = isNotNull(TargetVariableName) ?
            Variable.find(x => {
                return (x.variableName.toLowerCase() === TargetVariableName.toLowerCase() &&
                    x.cdiscDataStdDomainMetadataID === CDISCDataStdDomainMetadataID);
            }) : null;

        return TargetVariableName === "Not Mapped" ? 0 :
               Sel_Variable ? Sel_Variable.cdiscDataStdVariableMetadataID : -1;
    }

    //Save
    Save = () =>
    {
        let tabledata = this.GetTableJSON();
        let UpdatedRecord = tabledata.filter(td => (td.CHANGEIDENTIFIER && td.TargetDataSet != '--Select--' && td.TargetVariable != "--Select--"));

        if (UpdatedRecord.length > 0) {
            thisObj.setState({ progress: "active" });

            let data = this.DataFormation(UpdatedRecord);

            PostCallWithZoneForDomainCreate("AnnotationData/MetaDataAnnotationCreationUpdation", data)
                .then(
                    function (response)
                    {
                        hideProgress();
                        if (response.status == 1)
                        {
                            thisObj.setState({ progress: "success", ShowUpdatedRecord: false });

                            if (response.value && response.value.length > 0)
                            {
                                let warning = FormErrorIfArray("The following targets are already mapped. Please delete them from mapping page and try again.", response.value, "Remaining mapped successfully!")
                                warningModal(warning, () => thisObj.AfterSave());
                            }
                            else
                            {
                                successModalCallback(response.message, () => thisObj.AfterSave());
                            }
                        }
                        else
                        {
                            thisObj.setState({ progress: "exception" });

                            let notMappedList = response.value;
                            if (notMappedList && typeof notMappedList === "object" && notMappedList.length > 0) {
                                let err = FormErrorIfArray("The following targets have already been mapped. Please delete them from the mapping page and try again.", response.value)
                                errorModal(err);
                            }
                            else
                            {
                                errorModal(response.message);
                            }
                        }
                    }).catch(error => error);
        }
        else
        {
            errorModal("no updated record");
        }
    }

    //Cancel
    Cancel = () => {
        this.props.history.push("/trans/project", { openSelectedStudy: true });
    }

    AfterSave = () => {
        const tht = this;
        this.setState({ ShowUpdatedRecord: false }, () => {
            tht.getData();
        });
    }

    WhenDataModified = (changes, source, table) => {
        let { PrimarySourceData } = thisObj.state;
        let { hotTableComponent } = this;

        if (source === "edit") {
            const [[row, prop, oldVal, newVal]] = changes;

            //Get Unmodified Source Data

            let PrimaryData = validJSON(PrimarySourceData);

            let t_instance = table.getInstance();
            let tableSource = t_instance.getSourceData();

            //console.log("row:" + table.toPhysicalRow(row) + "prop:" + prop + "oldVal:" + oldVal + "newVal:" + newVal);

            let phy_row = table.toPhysicalRow(row);
            switch (prop)
            {
                case "TargetDomain":

                    if (PrimaryData[phy_row][prop] !== newVal && newVal !== "--Select--")
                    {
                        tableSource[table.toPhysicalRow(row)]["CHANGEIDENTIFIER"] = true;
                    }
                    else
                    {
                        tableSource[table.toPhysicalRow(row)]["CHANGEIDENTIFIER"] = false;
                    }
                    break;

                case "TargetVariable":
                    let domain_col_num = t_instance.propToCol("TargetDomain");
                    let domain_col_val = t_instance.getDataAtCell(row, domain_col_num);
                    if ((PrimaryData[phy_row][prop] !== newVal && newVal !== "--Select--") ||
                        PrimaryData[phy_row]["TargetDomain"] !== domain_col_val)
                    {
                        tableSource[table.toPhysicalRow(row)]["CHANGEIDENTIFIER"] = true;
                    }
                    else
                    {
                        tableSource[table.toPhysicalRow(row)]["CHANGEIDENTIFIER"] = false;
                    }
                    break;
            }
            
        }
    }

    GetTableInstance = (ht_component) =>
    {
        try
        {
            return ht_component.current.hotInstance.getSourceData()
        }
        catch (e)
        {
            //console.log(e);
            return [];
        }
    }

    ShowUpdatedRecord = () =>
    {

        let { hotTableComponent } = this;

        let getUpdatedData = this.GetTableInstance(hotTableComponent);

        thisObj.setState({ ShowUpdatedRecord: true, UpdatedRecord: getUpdatedData.filter(upd => (upd.CHANGEIDENTIFIER && upd.TargetDataSet != '--Select--' && upd.TargetVariable != "--Select--")) });
    }

    //Fn Prediction 
    //Single Prediction
    //Row right click and then click Predict text
    //Function To Predict Target For Single Source
    FnToPredictTarFrSingleSrc = (rownum, sel_rec) => {
        let { hotTableComponent } = thisObj;
        let hTable = hotTableComponent.current.hotInstance;

        showProgress();
        CallServerPost('Py/GetPrediction',
            {
                text: sel_rec.PRETEXT, variable: sel_rec.FORMOID + "." + sel_rec.FIELDOID
            }).then(function (res) {
                hideProgress();

                let { status, value } = res;
                if (status === 1) {
                    //value from controller is like {0:"DOMIAN.Vraiable"} from this get only "DOMIAN.Vraiable"
                    //IF controller return value is  {0:"DROP"} ? no prediction : show the prdicted value
                    // following check for above two condn 
                    if (value &&
                        typeof value === "object" &&
                        Object.keys(value).length > 0 &&
                        value[0] && typeof value[0] === "string" &&
                        value[0].toLowerCase() !== "drop") {
                        //split control return {0:"DOMIAN.Vraiable"}
                        let target = value[0].split(".");
                        let domain = target[0];
                        let variable = target[1];

                        let isDomainID = thisObj.GetDomain(domain);
                        let isDomainVariableID = thisObj.GetVariable(variable, isDomainID);


                        if (isDomainID !== -1 && isDomainVariableID !== -1)
                        {

                            let data = hTable.getSourceDataAtRow(rownum);
                            let { PrimarySourceData } = thisObj.state;

                            let PrimaryData = validJSON(PrimarySourceData);

                            if (PrimaryData[rownum]["TargetDomain"] !== target[0] || PrimaryData[rownum]["TargetVariable"] !== target[1]) {
                                data.CHANGEIDENTIFIER = true;
                            }
                            else
                            {
                                data.CHANGEIDENTIFIER = false;
                            }

                            data.TargetDomain = target[0]
                            hTable.setCellMeta(hTable.toVisualRow(rownum), hTable.propToCol("TargetVariable"), 'source', thisObj.GetTargetVariable(target[0]));

                            data.TargetVariable = target[1]
                            ////Set the predicted target
                            //hTable.setDataAtRowProp(hTable.toVisualRow(rownum), "TargetDomain", target[0]);
                            //hTable.setCellMeta(hTable.toVisualRow(rownum), hTable.propToCol("TargetVariable"), 'source', thisObj.GetTargetVariable(target[0]));

                            hTable.render();

                            return;
                        }
                    }
                }

                errorModal("No Prediction available for " + sel_rec.FORMOID + "." + sel_rec.FIELDOID);
            });
    }

    //Multiple Prediction 
    FnToPredictTarFrMulSrc = () => {
        //for err identification
        let err = true;

        let { hotTableComponent } = thisObj;
        let { filteredData } = thisObj.state;
        let hTable = hotTableComponent.current.hotInstance;

        //Form DATA FOR CONTROLLER
        //GET ALL THE RECORD ONLY IF TARGET DOMAIN , VARIABLE AND PRETEXT IS EMPTY
        let record = [];
        filteredData.map((rec, rownum) => {
            if (rec.TargetDomain === "--Select--" && rec.TargetVariable === "--Select--" && isNotNull(rec.PRETEXT)) {

                 record.push({
                    text: rec.PRETEXT,
                    variable: rec.FORMOID + "." + rec.FIELDOID,
                    rownum: rownum
                });
            }
        });

        //FOR PROGRESS BAR
        //HERE THE RECORD IS NOW SPLIT BY "@TIME" Variable
        //CALCULATION EX 'time' VAR IS 50 & TOTLA RECORD = 1080 ? 1080 / 50 = 22 TIMES WE HAVE TO LOOP AND SEND TO CONTROLLER 
        let time = 50;
        let rec_count = record.length;

        //LOOP VAR USED TO LOOP 
        //CALCULATION EX 'time' VAR IS 50 & TOTLA RECORD = 1080 ? 1080 / 50 = 22 TIMES WE HAVE TO LOOP AND SEND TO CONTROLLER 
        let loop = rec_count / time;
        loop = Math.ceil(loop);
        //END LOOP CALCULATION

        // @'i' VARIABLE USED TO STORE CURRENT LOOP NUM
        let loopNum = 0;

        //Progress start
        thisObj.setState({ progressBarfullyUI: { percent: 0, status: "active", progress: true } });

        MultiplePrediction(loopNum);

        function MultiplePrediction(loopNum)
        {
            let filter_next_set_of_record_by_num_of_times = [];

            new Promise((resolve, reject) =>
            {
                //here times is 50

                let fltr_rec_from = (loopNum * time);
                let fltr_rec_to = time * (loopNum + 1);

                filter_next_set_of_record_by_num_of_times = record.slice(fltr_rec_from, fltr_rec_to);

                if (filter_next_set_of_record_by_num_of_times.length > 0) {

                    GetPredictionFromController(filter_next_set_of_record_by_num_of_times, resolve);
                }
                else
                {
                    reject();
                }
            }).then(() =>
            {
                //Scroll to the upcoming prediction column
                let hTable = hotTableComponent.current.hotInstance;
                filter_next_set_of_record_by_num_of_times.length > 0 && hTable.scrollViewportTo(filter_next_set_of_record_by_num_of_times[0].rownum, 0);
                //END

                //count the loop
                loopNum++;

                let percentage = rec_count < time ? 100 : ((time * loopNum) / rec_count) * 100;

                if (loopNum < loop) {
                    thisObj.setState({ progressBarfullyUI: { percent: Math.ceil(percentage), status: "active", progress: true } })
                    MultiplePrediction(loopNum);
                }
                else {

                    thisObj.setState({ progressBarfullyUI: { percent: Math.ceil(percentage), status: "active", progress: true } });
                    setTimeout(() => {
                        thisObj.setState({ progressBarfullyUI: { progress: false } })

                    }, 300);

                    err && errorModal("No Prediction's are available");

                }

            }).catch(() =>
            {
                thisObj.setState({ progressBarfullyUI: { progress: false } })

                err && errorModal("No Prediction's are available");

            });
        }

        function GetPredictionFromController(records, resolve) {
            CallServerPost('Py/GetMultiplePrediction', { predict: records }).then(function (res)
            {
                let { status, value } = res;


                if (status === 1 && isArray(value))
                {
                    value.map(va => {
                        //Predicted obj
                        let { pred, rownum } = va;

                        let target = isNotNull(pred) ? pred.split(".") : [];

                        let domain = target[0];
                        let variable = target[1];

                        //Check predicted target Domain and variable's from controller are available for current study or not
                        let isDomainID = thisObj.GetDomain(domain);
                        let isDomainVariableID = thisObj.GetVariable(variable, isDomainID);

                        //Check predicted target Domain and variable's from controller are available or not
                        if (isDomainID !== -1 && isDomainVariableID !== -1) {

                            rownum = hTable.toPhysicalRow(rownum)
                            let data = hTable.getSourceDataAtRow(rownum);

                            let { PrimarySourceData } = thisObj.state;

                            let PrimaryData = validJSON(PrimarySourceData);

                            if (PrimaryData[rownum]["TargetDomain"] !== target[0] || PrimaryData[rownum]["TargetVariable"] !== target[1])
                            {
                                data.CHANGEIDENTIFIER = true;
                            }
                            else {
                                data.CHANGEIDENTIFIER = false;
                            }
                            data.TargetDomain = target[0]
                            data.TargetVariable = target[1]
                            ////Set the predicted target
                            //hTable.setDataAtRowProp(rownum, "TargetDomain", target[0]);
                            //hTable.setDataAtRowProp(rownum, "TargetVariable", target[1]);
                            err = false;
                        }
                    });

                    resolve();
                }
                else {
                    resolve();
                }
            });
        }
    }

    //keep modal

    onKeep = (event, colindex) => {

        let { selColumn, orgColumnAndDataType} = this.state;

        if (!event.target.checked && selColumn.length === orgColumnAndDataType.length - 1)
        {
            errorModal("Please select any one column");
        }
        else if (event.target.checked)
        {
            this.setState((state) => {
                let selColumn = state.selColumn.filter(x => x !== colindex);
                return ({
                    selColumn: selColumn
                })
            });

        }
        else
        {
            this.setState((state) => {
                return ({
                    selColumn: [...state.selColumn, colindex]
                })
            });
           

        }
      
    }
    //keep modal
    fnModalOnOk = () =>
    {
        let { selColumn, hiddenColumn, ColumnAndDataType, orgColumnAndDataType } = this.state;
        if (selColumn.length === orgColumnAndDataType.length)
        {
            errorModal("Please select any one column");
            return;
        }
        let columnAndDataType = orgColumnAndDataType.filter((x, index) => selColumn.indexOf(index) === -1);
        this.setState({ hiddenColumn: selColumn, showColKeepResetModal: false, ColumnAndDataType: columnAndDataType})
    }

    /*height*/
    getHeight = () =>
    {
        let { RowData, showHeader} = this.state;
        return RowData.length !== 0 && showHeader ? "calc(100vh - 213px)" :
               RowData.length !== 0 && !showHeader ? "calc(100vh - 168px)" :
               0 
    }
    render()
    {
        const {
                Column,
                showHeader,
                selColumn,
                hiddenColumn,
                progressBarfullyUI,
                activityDetails,
                RowData,
                ColumnAndDataType,
                UpdatedRecord,
                progress,
            annotationsWorkflowStatus,
            orgColumnAndDataType,
            ShowUpdatedRecord,
            loading

        } = this.state;
        return (
            <LayoutWrapper id="treeview_layout" >

                <Box className={"metadataAnnotBox"}>

                    {showHeader &&
                        <Row style={{ display: "flex", flexDirection: "column" }}>
                            <Col className="site-layout-background" span={24} >
                            <ContentTab
                                    backBtn={ false}
                                    projectInActive={this.props.projectInActive}
                                    history={this.props.history}
                                    projectStudyLockStatus={this.props.projectStudyLockStatus}
                                    fromDashboard={this.props.fromDashboard}
                                    actidetails={activityDetails}
                                />
                            </Col>
                        </Row>
                    }
                    {RowData.length !== 0 && <Row className="site-layout-background">
                        <Col className={"site-layout-background"} style={{ padding: "5px 10px 10px 10px" }}>
                            <>
                                <Button name="TableAdd" type={"default"} style={{ height: "27px", margin: "0px 5px 0px 0px" }} onClick={() => this.setState({ showColKeepResetModal: true })} >
                                    Keep
                                </Button>
                                <Button name="Reset" className="resetbtn" onClick={() => this.setState({ selColumn: [], hiddenColumn: [], ColumnAndDataType: orgColumnAndDataType })} >
                                    Reset
                                </Button>
                                <Icon
                                    className="metaAnnotArrow"
                                    theme="filled"
                                    type={showHeader ? "up-circle" : "down-circle"}
                                    onClick={() => this.setState({ showHeader: !showHeader })}
                                />

                            </>
                        </Col>
                    </Row>
                    }
                    <Row style={{ display: "flex", flexDirection: "column", height: RowData.length !== 0 ? '100%' : 0 }}>
                        <Col className={"AnnotStyle site-layout-background"} style={{ height: "100%" }}>
                            <div style={{ padding: "0px 10px 10px 10px", height: this.getHeight()}}>
                                <HotTable
                                    id="MetaDataAnnotation_Table"
                                    className={"MetaDataAnnotation_Table_TD"}
                                    height={RowData.length > 0 ? "100%" : "50px"}
                                    licenseKey="non-commercial-and-evaluation"
                                    viewportRowRenderingOffsetnumber={10}
                                    ref={this.hotTableComponent}
                                    settings=
                                    {
                                        {
                                            wordWrap: true,
                                            stretchH: 'all',
                                            data: RowData,
                                            columns: ColumnAndDataType,
                                            height: 400,
                                            fillHandle: false,
                                            filters: true,
                                            hiddenColumns:
                                            {
                                                // specify columns hidden by default
                                                columns: hiddenColumn
                                            },
                                            colWidths: function (index) {
                                                let instance = thisObj.hotTableComponent.current.hotInstance;
                                                let allHeader = instance.getColHeader();
                                                if (allHeader.indexOf("SECTION") === index ||
                                                    allHeader.indexOf("PRETEXT") === index ||
                                                    allHeader.indexOf("FORMNAME") === index) {
                                                    return 300;
                                                } else {
                                                    return 200;
                                                }
                                            },
                                            afterFilter: function (filter)
                                            {
                                                let filteredVal = this.getPlugin('trimRows').rowsMapper._arrayMap.map(r => this.getSourceDataAtRow(r))

                                                thisObj.setState({ filteredData: filteredVal})
                                            },
                                            beforeKeyDown: function (e)
                                            {
                                                e.stopPropagation();
                                                let cell = this.getSelected();
                                                if (cell && cell.length > 0)
                                                {
                                                    let [row, col] = [...cell[0]];

                                                    if (this.propToCol("TargetDomain") === col ||
                                                        this.propToCol("TargetVariable") === col)
                                                    {
                                                        this.setCellMeta(row, col, "type", "autocomplete")
                                                        this.setCellMeta(row, col, "filter", true);
                                                        this.setCellMeta(row, col, "strict", true);
                                                    }
                                                }
                                            },
                                            beforeOnCellMouseDown: function (e, coords) {
                                                e.preventDefault();

                                                if (coords && coords.row != undefined && coords.col != undefined) {
                                                    let {row, col
                                                        }= coords;

                                                    if (this.propToCol("TargetDomain") === col ||
                                                        this.propToCol("TargetVariable") === col)
                                                    {
                                                        this.setCellMeta(row, col, "type", "dropdown");
                                                        this.setCellMeta(row, col, "filter", false);
                                                    }
                                                }
                                            },
                                            dropdownMenu: ['filter_by_condition', 'filter_by_value', 'filter_action_bar'],
                                            contextMenu: {
                                                items: {
                                                    "Predict_Text": {

                                                        name: 'Predict Text',
                                                        callback: function (action, rowArray, b, c) {
                                                            let sel_row = this.getSelectedLast();

                                                            let [row] = [...sel_row];
                                                            row = this.toPhysicalRow(row);

                                                            //get row data
                                                            let rowData = this.getSourceDataAtRow(row);
                                                            //Call Predict_Text Fn
                                                            thisObj.FnToPredictTarFrSingleSrc(row, rowData);
                                                        },
                                                        hidden: function () {

                                                            //Hidden Predict text option while Multiple row selection
                                                            let getSelectedRange = this.getSelectedRangeLast();
                                                            if (getSelectedRange) {
                                                                let getSelectedRows = getSelectedRange;
                                                                let { from, to } = getSelectedRows;

                                                                if (from.row !== to.row) {
                                                                    //if row selection mismatch hidden menu
                                                                    return true;
                                                                } else {


                                                                    //select whole row when we right click
                                                                    this.selectRows(to.row);
                                                                }
                                                            }

                                                            if (!this.getSelected() || !annotationPermission(annotationsWorkflowStatus)) {
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            afterChange: function (changes, source)
                                            {
                                                if (changes) {
                                                    //console.log(changes)
                                                    const [[row, prop, oldVal, newVal]] = changes;
                                                    if (prop === "TargetDomain" && oldVal !== newVal)
                                                    {

                                                        this.setCellMeta(row, this.propToCol("TargetVariable"), 'source', thisObj.GetTargetVariable(newVal));

                                                        if (newVal === "Not Mapped")
                                                        {
                                                            this.setDataAtRowProp(row, "TargetVariable", "Not Mapped");
                                                        }

                                                    }
                                                
                                                }
                                                //Track change identifier
                                                thisObj.WhenDataModified(changes, source, this);
                                            },
                                            beforeChange: function (changes, source)
                                            {
                                                const [[row, prop, oldVal, newVal]] = changes;

                                                let instance = this.getInstance();

                                                if (prop === "TargetDomain" && oldVal !== newVal)
                                                {
                                                    //set dropdown data based on Targetdomain
                                                    this.setCellMeta(row, this.propToCol("TargetVariable"), 'source', thisObj.GetTargetVariable(newVal));

                                                    if (newVal !== "Not Mapped")
                                                    {

                                                        let data = this.getSourceDataAtRow(this.toPhysicalRow(row));


                                                        data.TargetVariable = "--Select--"
                                                        this.render();
                                                        //this.setDataAtRowProp(row, "TargetVariable", "--Select--");
                                                    }
                                    
                                                }

                                            },
                                            cells: function (physicalRow, physicalcolumn, prop)
                                            {
                                                if (prop === "TargetVariable")
                                                {
                                                    let ht = thisObj.hotTableComponent.current.hotInstance;
                                                    const cellProperties = {};
                                                    //visualRowIndex
                                                    const row = this.instance.toVisualRow(physicalRow);
                                                    //visualColIndex
                                                    const col = this.instance.toVisualColumn(physicalcolumn);

                                                    //IF No Prediction ? make variable readonly
                                                    if (ht.getDataAtCell(row, ht.propToCol("TargetDomain")) === "Not Mapped" ||
                                                        ht.getDataAtCell(row, col) === "Not Mapped")
                                                    {
                                                        cellProperties.className = "ht_readonly";
                                                        cellProperties.readOnly = true;
                                                    }
                                                    else
                                                    {
                                                        //Load dependency dropdown
                                                        //This is usefull for reload
                                                        let TargetDomainOfTheRow = ht.getDataAtCell(row, ht.propToCol("TargetDomain"))

                                                        ht.setCellMeta(row, ht.propToCol("TargetVariable"), 'source', thisObj.GetTargetVariable(TargetDomainOfTheRow));

                                                        cellProperties.readOnly = annotationPermission(annotationsWorkflowStatus) ? false : true;
                                                        cellProperties.className = "ht_not_readonly";

                                                    }

                                                    return cellProperties;
                                                }

                                            }
                                        }
                                    }
                                />
                                {/*<div id="MetaDataNoFilter" style={{ display: RowData.length > 0 ? "none" : "block" }}>No data available</div>*/}
                            </div>
                        </Col>
                    </Row>
                    {
                        RowData.length === 0 && <Empty description={loading === "loading" ? "Progressing" : "No Data"} />
                    }
                    {RowData.length > 0 && <Row className="site-layout-background">
                        <Col className={"site-layout-background"} style={{ padding: "0px 10px" }}>
                            <Button name="Cancel" type="danger" onClick={() => this.Cancel()}>
                                Cancel
                            </Button>

                            {
                                annotationPermission(annotationsWorkflowStatus) &&
                                <>
                                  <Button name="Add" style={{ float: "right" }} className="saveBtn" onClick={() => this.ShowUpdatedRecord()} >
                                        Save
                                  </Button>
                                    <Button name="Predict" style={{ float: "right", marginRight: 5 }} type="primary" onClick={this.FnToPredictTarFrMulSrc} >
                                        Predict All
                                  </Button>
                                </>
                            }

                        </Col>
                    </Row>}
                </Box>
                {ShowUpdatedRecord &&
                    <ViewUpdatedRecord
                        Column={Column}
                        DataType={orgColumnAndDataType}
                        Row={UpdatedRecord}
                        Show={ShowUpdatedRecord}
                        Ok={() => this.Save()}
                        Cancel={() => this.setState({ ShowUpdatedRecord: false })}
                    />}
                {<Progress progress={progress} NoInitialPercent={true} />}
                { <ProgressBarFullyUI {...progressBarfullyUI} />}
                <Modal
                    title="Keep"
                    visible={this.state.showColKeepResetModal}
                    width={300}
                    style={{top:10}}
                    onCancel={this.fnModalOnOk}
                    footer={[

                        <Row justify="end">

                            <Button name="ok"
                                key="ok"
                                className="saveBtn"
                                onClick={this.fnModalOnOk} style={{ width: 80 }}>
                                      OK
                            </Button>
                        </Row>,
                    ]}
                >
                    <a className={"aTagInMetaAnnot"} onClick={() => this.setState({ selColumn: [] })}>Select All</a>
                    <a className={"aTagInMetaAnnot"} onClick={() => this.setState({ selColumn: (orgColumnAndDataType || []).map(({ title }, index) => index) })}>Clear</a>
                    <ul>

                        {(orgColumnAndDataType || []).map(({ title }, index) => (
                            <li>
                                <label>
                                    <Checkbox
                                        type="checkbox"
                                        name={title}
                                        style={{ pointerEvents: "auto" }}
                                        checked={selColumn.indexOf(index) === -1}
                                        onChange={(e) => {  this.onKeep(e, index) }}
                                    >
                                        {title}
                                    </Checkbox>
                                </label>
                            </li>
                        ))}
                    </ul>

                </Modal>
            </LayoutWrapper>

        )
    }
}

