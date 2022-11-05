import React, { Component } from 'react';
import Tabs, { TabPane } from '../../components/uielements/tabs';
import { Breadcrumb, Icon, Col, Row, Select, Form, Spin } from 'antd';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import SingleForm from '../Utility/SingleForm';
import ConfirmModal from '../Utility/ConfirmModal';
import {
    CallServerPost,
    getStudyDetails,
    hideProgress,
    PostCallWithZone,
    errorModal,
    successModal,
    showProgress,
    TreeSelectOptionLoop
} from '../Utility/sharedUtility';
import Button from '../../components/uielements/button';
import { Annotation } from '../Study/ActivityConfig/Annotation';

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

class ViewStudyModalContent extends Component {
    constructor(props) {
        super(props);
        const thisObj = this;



        this.onTableClicked = this.onTableClicked.bind(this);
        this.state =
        {
            responseData:
            {
                formData: {},
                selectOptions: {},
            },
            showEditModal: false,
            General: {},
            CRF: {},
            Mapping: {},
            Define: {},
            loading: false,
            editForm: false,
            pdfFiles: [],
            xptLocation: [],
            fileRawDatasetSelect: [],
            rawDatasetLocaton: []
        };


        if (typeof this.props.studyID != 'undefined') {

            //Loader
            showProgress();
            CallServerPost('Study/GetStudyForView', {
                FormName: "Study",
                ActionName: "Update",
                ProjectID: this.props.projectID,
                ID: this.props.studyID
            }).then(
                function (response)
                {
                    //Loader
                    hideProgress();
                    const resp = response.value;

                    if (resp.status == 0)
                    {
                        errorModal(resp.message);
                    }
                    else
                    {

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

                        ////Annotatoin,TransFormation,Define Dropdown values

                        ////for Annotation CRFDocument
                        //const pdfFiles = TreeSelectOptionLoop([resp["DocumentsTree"].pdfLocation], false);

                        ////for transformation Output Standardized Dataset Location
                        ////for Define Standardized Dataset Location
                        //const xptLocation = TreeSelectOptionLoop([resp["DocumentsTree"].xptLocation], true);


                        ////for Transformation Raw Dataset Location
                        //const fileRawDatasetSelect = TreeSelectOptionLoop([resp["DocumentsTree"].sas7BdatLocation], false);

                        ////for Transformation Raw Dataset Location
                        //const rawDatasetLocaton = TreeSelectOptionLoop([resp["DocumentsTree"].sas7BdatLocation], true);


                        thisObj.setState({
                            responseData: resp,
                            General: generalData,
                            CRF: annotData,
                            Mapping: mappingData,
                            Define: tabluationData,        
                        });

                    }

                }).catch(error => error);
        }



    }

    onTableClicked(selectedTableName) {
        this.fnToViewDomain(selectedTableName, this.state.activeKey);

    }

    handleSubmit = () => {
        this.setState({ showEditModal: true });
    }

    render() {

        const { getFieldDecorator, setFieldsValue } = this.props.form;
        const { General, CRF, Mapping, Define, pdfFiles, rawDatasetLocaton, xptLocation, fileRawDatasetSelect } = this.state;
        const { responseData } = this.state;

        let studyDetails = JSON.parse(sessionStorage.studyDetails);
        return (
            <Spin key={"studyModalkey"} indicator={antIcon} spinning={this.state.loading} >

                <Tabs defaultActiveKey="1" onChange={this.onTabChange} type="card">

                    <TabPane tab="General" key="1" style={{ overflow: 'auto' }}>

                        {Object.keys(General).length > 0 &&
                            <SingleForm property={this} responseData={General} getFieldDecorator={getFieldDecorator} editForm={null} /*extraButton1={refBtn}*/ setFieldsValue={setFieldsValue} />
                        }

                    </TabPane>

                    {(studyDetails.annotationRequired || studyDetails.mappingRequried) &&
                        <TabPane tab="Transformation" key="2" style={{ overflow: 'auto' }}>
                        {Object.keys(CRF).length > 0 &&
                            <Annotation
                                study={studyDetails}
                                form={this.props.form}
                                updateData={responseData.activityDetails}
                                status={{ Annot: { id: 0, text: "" }, Trans: { id: 0, text: "" } }}
                                pdfFiles={[]}
                                xptLocation={[]}
                                fileRawDatasetSelect={[]}
                                rawDatasetLocaton={[]}
                          />
                        }
                        </TabPane>}



                    {studyDetails.defineRequired && <TabPane tab="Define" key="4" style={{ overflow: 'auto' }}>

                        {Object.keys(Define).length > 0 &&
                            <SingleForm property={this} responseData={Define} getFieldDecorator={getFieldDecorator} setFieldsValue={setFieldsValue} /*extraButton1={refBtn} extraButton2={valBtn} extraButton3={genDefineBtn}*/ />
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