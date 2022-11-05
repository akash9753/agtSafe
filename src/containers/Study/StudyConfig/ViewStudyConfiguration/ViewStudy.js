import React, { Component } from 'react';
import ViewStudy from '../../../TreeView/ViewStudyModalContent';
import Tabs, { TabPane } from '../../../../components/uielements/tabs';
import {  Icon, Form, Spin, Empty } from 'antd';

import {
    CallServerPost,
    getStudyDetails,
    hideProgress,
    PostCallWithZone,
    errorModal,
    successModal,
    showProgress,
    TreeSelectOptionLoop
} from '../../../Utility/sharedUtility';
import { ContactCardWrapper } from '../../../TreeView/domainCard.style';

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

let thisObj = this;

class ViewStudyModalContent extends Component {
    constructor(props) {
        super(props);



        this.onTableClicked = this.onTableClicked.bind(this);
        this.state =
        {
            responseData:
            {
                formData: {},
                selectOptions: {},
                dropdowns: []
            },
            showEditModal: false,
            General: {},
            CRF: [],
            Mapping: [],
            Define: {},
            loading: false,
            editForm: false,
            pdfFiles: [],
            xptLocation: [],
            fileRawDatasetSelect: [],
            rawDatasetLocaton: [],
            name:""
        };

        thisObj = this;


    }

    static getDerivedStateFromProps(props,currState)
    {
        let { projectID, study, tabName, activeKey } = props;

        if (tabName === activeKey && currState.name != activeKey) {
            //Loader
            showProgress();
            CallServerPost('Study/GetStudyForView', {
                FormName: "Study",
                ActionName: "Update",
                ProjectID: projectID,
                ID: study.studyID
            }).then(
                function (response) {
                    //Loader
                    hideProgress();
                    const resp = response.value;

                    if (resp.status == 0) {
                        errorModal(resp.message);
                    }
                    else {

                        const formData = resp.formData;

                        let generalData = Object.assign({}, resp);
                        generalData.formData = formData.filter(form => form.wizardID === 10);

                        let study = getStudyDetails();
                        let Activities = generalData.formData.find(x => x.attributeName === "Activities");

                        if (Activities && study) {
                            let val = [];
                            if (study.annotationRequired) {
                                val.push("Annotation");

                            }
                            if (study.mappingRequried) {
                                val.push("Transformation");

                            }
                            if (study.defineRequired) {
                                val.push("Define");
                            }
                            Activities.defaultValue = val.toString();
                        }

                        let annotData = Object.assign({}, resp);

                        annotData.formData = formData.filter(form => form.wizardID === 11);

                        let mappingData = Object.assign({}, resp);
                        mappingData.formData = formData.filter(form => form.wizardID === 12);

                        let tabluationData = Object.assign({}, resp);
                        tabluationData.formData = !study.annotationRequired ?
                            [annotData.formData.find(f => f.attributeName === "CRFDocument"),
                            ...formData.filter(form => form.wizardID === 13)] :
                            [...formData.filter(form => form.wizardID === 13)];

                        //Annotatoin,TransFormation,Define Dropdown values

                        //for Annotation CRF Document
                       // const pdfFiles = TreeSelectOptionLoop([resp["DocumentsTree"].pdfLocation], false);

                        //for transformation Output Standardized Dataset Location
                        //for Define Standardized Dataset Location
                       // const xptLocation = TreeSelectOptionLoop([resp["DocumentsTree"].xptLocation], true);


                        //for Transformation Raw Dataset Location
                        //const fileRawDatasetSelect = TreeSelectOptionLoop([resp["DocumentsTree"].sas7BdatLocation], false);

                        //for Transformation Raw Dataset Location
                        //const rawDatasetLocaton = TreeSelectOptionLoop([resp["DocumentsTree"].sas7BdatLocation], true);

                        resp.dropdowns =
                        {
                            CRFDocument: "file",
                            "Protocol Document": "file",
                            FieldProperties: "file",
                            DataDictionaries: "file",
                            UnitDictionaries: "file",
                            MappingOutput: "MappingOutput",
                            RawDatasetLoc: "file",
                            StandardDatasetLoc: "file",
                            "DefineStandardDatasetLoc": "file"

                        }


                        thisObj.setState({
                            name: activeKey,
                            activeKey:"1",
                            responseData: resp,
                            General: generalData,
                            CRF: resp.activityDetails.filter(a => a.activityID === 323),
                            Mapping: resp.activityDetails.filter(a => a.activityID === 324),
                            Define: tabluationData,
                            IsDefineConfigured: resp.activityDetails.filter(a => a.activityID === 325),
                           // pdfFiles: pdfFiles,
                           // xptLocation: xptLocation,
                            //fileRawDatasetSelect: fileRawDatasetSelect,
                            //rawDatasetLocaton: rawDatasetLocaton
                        });

                    }

                }).catch(error => error);
            return { name: activeKey }

        }
        else if (tabName !== activeKey ){
            //Loop Comtrol
            return { name: "", activeKey: "1" }
        }

    }
    onTableClicked(selectedTableName) {
        this.fnToViewDomain(selectedTableName, this.state.activeKey);

    }

    handleSubmit = () => {
        this.setState({ showEditModal: true });
    }

    getDDTextByKey = (type, key) => {
        switch (type) {
            case "file":
                return key ? key.replace(/^.*[\\\/]/, '') : key;
            case "MappingOutput":
                return key ? key === "1" ? "Python" : "SAS" : key;

            default:

        }


    }

    tabOnChange = (key) => {
        
        this.setState({
            activeKey: key
        });
    }
    render() {

        const { General, CRF, Mapping, Define, activeKey } = this.state;
        const { responseData, IsDefineConfigured} = this.state;
        let { dropdowns } = responseData;

        //CRF Remve some field
        let Remov_CRFFLD = ["AnnotationRequired", "CRFCheckedOut"];

        let studyDetails = JSON.parse(sessionStorage.studyDetails);
        return (
            <Spin key={"studyModalkey"} indicator={antIcon} spinning={this.state.loading} >

                <Tabs activeKey={activeKey} onChange={this.tabOnChange} type="card">

                    <TabPane tab="General" key="1" style={{ overflow: 'auto' }}>


                        <ContactCardWrapper >
                            <div className="isoContactInfoWrapper"> {(General.formData || []).map((field) => {
                                return <div className="isoContactCardInfos">
                                    <p className="isoInfoLabel">{field.displayName}</p>
                                    <p className="isoInfoDetails">
                                        {dropdowns[field.displayName] ?
                                            this.getDDTextByKey(dropdowns[field.displayName], field.defaultValue) :
                                            field.defaultValue
                                        }
                                    </p>
                                </div>

                            })}
                            </div>
                        </ContactCardWrapper>
                    </TabPane>

                    {(studyDetails.annotationRequired || studyDetails.mappingRequried) &&
                        <TabPane tab="Transformation" key="2" style={{ overflow: 'auto' }}>
                            <ContactCardWrapper >
                                <div className="isoContactInfoWrapper">
                                    {studyDetails.annotationRequired && (CRF || []).map((fld) => {
                                        let { configurationName, configurationValue } = fld;
                                        return Remov_CRFFLD.indexOf(configurationName) === -1 && <div className = "isoContactCardInfos" >
                                            <p className="isoInfoLabel">{fld.configurationName}</p>
                                            <p className="isoInfoDetails">
                                                {dropdowns[configurationName] ?
                                                    this.getDDTextByKey(dropdowns[configurationName], configurationValue) :
                                                    configurationValue
                                                }
                                            </p>
                                        </div>
                                    })}
                                    {
                                        studyDetails.mappingRequried && (Mapping || []).map((fld) => {
                                            let { configurationName, configurationValue } = fld;

                                            return <div className="isoContactCardInfos">
                                                <p className="isoInfoLabel">{configurationName}</p>
                                                <p className="isoInfoDetails">
                                                    {dropdowns[configurationName] ?
                                                        this.getDDTextByKey(dropdowns[configurationName], configurationValue) :
                                                        configurationValue
                                                    }
                                                </p>
                                            </div>
                                        })}
                                    {
                                        (Mapping.length === 0 && CRF.length === 0) &&
                                        <Empty description="Not Yet Configured" />
                                    }
                                </div>
                            </ContactCardWrapper>
                        </TabPane>}



                    {studyDetails.defineRequired && <TabPane tab="Define" key="4" style={{ overflow: 'auto' }}>

                        {IsDefineConfigured && IsDefineConfigured.length > 0 ?
                            < ContactCardWrapper >
                            <div className="isoContactInfoWrapper"> {(Define.formData || []).map((field) => {
                                return <div className="isoContactCardInfos">
                                    <p className="isoInfoLabel">{field.displayName}</p>
                                    <p className="isoInfoDetails">
                                        {dropdowns[field.attributeName] ?
                                            this.getDDTextByKey(dropdowns[field.attributeName], field.defaultValue) :
                                            field.defaultValue
                                        }
                                    </p>
                                </div>

                            })}
                            </div>
                        </ContactCardWrapper>:

                        <Empty description="Not Yet Configured" />
                        
                       }
                    </TabPane>
                    }
                </Tabs>
            </Spin>
        );
    }
}

const WrappedApp = Form.create()(ViewStudyModalContent);

export default WrappedApp;

//<TabPane tab="Analysis define" key="5" style={{ overflow: 'auto' }}>
//    <LayoutContent>
//    </LayoutContent>
//</TabPane>
//    <TabPane tab="Analysis Mapping" key="6" style={{ overflow: 'auto' }}>
//        <LayoutContent>
//        </LayoutContent>
//    </TabPane>