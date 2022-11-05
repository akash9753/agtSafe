////import React, { Component } from 'react';
////import { CallServerPost, errorModal, successModalCallback, PostCallWithZone, successModal } from '../Utility/sharedUtility';
////import LayoutContentWrapper from '../../components/utility/layoutWrapper';
////import LayoutContent from '../../components/utility/layoutContent';
////import { Form, Modal, Steps, Row, Spin, Icon } from 'antd';
////import { DynamicForm } from '../Utility/htmlUtility';
////import Button from '../../components/uielements/button';
////import WizardForm from '../Utility/wizardForm';
////import Document from './fileTitle.js';
////import ReactTable from '../Utility/reactTable';
////import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';

////const Step = Steps.Step;
////const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
////var thisObj;
////var studyRelatedDocument = {};

////class CreateStudyModal extends Component {
////    constructor(props) {
////        super(props);

////        this.state = {
////            loading:false,
////            responseData : {
////                formData: {},
////                wizardData: {},
////                selectOptions: {}
////            },
////            dataSource: [],
////            title:"",
////            current: 0,
////            standardversionid: [],

////            url: "",
////            fieldValue: [],
////            dcmntAction: "add",
////            dcmntVisible: false,
////            dcmntFormData: {},
////            titleKey:0,
////        };
////        thisObj=this;
////    }
////    componentWillReceiveProps(nextProps) {
////        if (this.props.visible && !nextProps.visible) {
////             thisObj.props.form.resetFields();
////             thisObj.setState({dataSource:[],responseData: {formData:{}}});

////        } else if (!this.props.visible && nextProps.visible && nextProps.action === "Create") {
////            studyRelatedDocument = {};
////            //console.log("Modal Opened");
////            const thisObj = this;
////            CallServerPost('Study/GetFormDataStudy', { FormName: "Study", ActionName: "Create", ProjectID: nextProps.projectId }).then(
////                function (response) {
////                    const responseData = response.value;

////                    if (responseData.status == 0) {
////                        errorModal(responseData.message);
////                    } else { 

////                        thisObj.setState({ loading:false,dataSource:[],responseData: responseData, dcmntFormData: { formData: responseData.StudyDocument, selectOptions: responseData.selectOptions }, standardversionid: responseData.selectOptions["standardversionid"] });

////                    }
////                }).catch(error => error);
////        }
////    }

////    componentDidUpdate() {
////        let tempRef = thisObj.state.responseData;
////        if (Object.keys(tempRef.formData).length != 0) {
////            document.getElementById("DefineRight").appendChild(document.getElementById("tableDiv"));
////        }
////    }


////    saveStudy = (study) => {
////        let check = thisObj.props.form.getFieldValue;
////        if (check("AnnotationRequired") == true || check("MappingRequried") == true || check("DefineRequired") == true) {
////            thisObj.DefineDocuments(study);

////            study["CRFDocument"] = study["CRFDocument"].toString()
////            thisObj.setState({ loading: true });
////            study["StudyStatusID"] = 5;
////            const props = this.props.parentRootProps;
////            PostCallWithZone('Study/CreateNewStudy', study).then(
////                function (response) {
////                    if (response.status == 0) {
////                        thisObj.setState({ loading: false });
////                        errorModal(response.message);

////                    } else {
////                        thisObj.setState({ loading: false });
////                        successModalCallback(response.message, thisObj.props.studyListRefresh);

////                    }
////                }).catch(error => error);
////        }
////        else {
////            errorModal("Please choose at least one operation for the study");
////        }
////    }

////    DefineDocuments = (study) =>
////    {
////        var datas = thisObj.state.dataSource;

////        datas = datas.concat({ FileTypeID: 53, FileLocation: study.ProtocolDocument })

////        if (study.CRFDocument != null && study.CRFDocument.length != 0)
////        {
////            datas = datas.concat({ FileTypeID: 54, FileLocation: study.CRFDocument.toString() })
////        }

////        if (study.RawDatasetLoc != null)
////        {
////            datas = datas.concat({ FileTypeID: 55, FileLocation: study.RawDatasetLoc })
////        }

////        if (study.StandardDatasetLoc != null)
////        {
////            datas = datas.concat({ FileTypeID: 56, FileLocation: study.StandardDatasetLoc })
////        }

////        study.DefineDocuments = datas;

////    }

////   switchfn = (result,id) => {
////    var thisobject=this;
////    var field="";
////      if(id !="AnnotationRequired"){
////         switch (id)
////        {

////            case "MappingRequried":
////                    field=["RawDatasetLoc"];
////                    break;
////            case "DefineRequired":

////                   field=["StandardDatasetLoc","StudyRelatedDocument","DefineOutputType"];
////                  break;
////          }
////         thisObj.props.form.resetFields(field)
////         field.forEach(function (key) {
////            thisobject.state.responseData.formData.find(x => x.attributeName === key).inputRequirementID = (result)?8:9 ;
////            thisobject.state.responseData.formData.find(x => x.attributeName === key).inputRequirementText = (result)?"Mandatory":"Optional"
////            thisobject.state.responseData.formData.find(x => x.attributeName === key).editable =(result)?true:false;

////            if(!result)
////            {
////                thisObj.props.form.resetFields([key]);
////            }
////        });
////    }
////      thisObj.setState({ responseData: thisObj.state.responseData});
////   }

////   getTitleFrFile = (value, node, extra, result, id) => {
////       document.getElementsByClassName("StudyRelatedDocument")[0].classList.add("ant-select-dropdown-hidden");

////       if (value.length == 0) { 
////            studyRelatedDocument={};
////           thisObj.setState({ dataSource: [], dcmntVisible: false })

////       }
////       else if (value.length < extra.preValue.length) {
////           var dataSource = [];

////           delete studyRelatedDocument[extra.triggerNode.props.value]
////           dataSource = Object.values(studyRelatedDocument);

////           thisObj.setState({ dataSource: dataSource, dcmntVisible: false })
////        }
////        else{
////           thisObj.setState({
////               dcmntVisible: true,
////               dcmntAction: "add",
////               url: extra.triggerNode.props.value,
////               fieldValue: {
////                   DestinationType: null, FileTypeID: null, Title: null } })
////        }
////   }     
////    additionalClear = (whichStep) => {
////        if (whichStep === 3) {
////            studyRelatedDocument = {};
////            thisObj.setState({ dataSource: [], dcmntVisible: false });
////        } else if (whichStep === 2) {
////            this.switchfn(false, "MappingRequried");
////        }
       
////   }
////   titlePopCancel = () => {
////       if (thisObj.state.dcmntAction == "add") {
////           delete studyRelatedDocument[thisObj.state.url];
////           thisObj.setState({ dcmntVisible: false, dataSource: Object.values(studyRelatedDocument) });
////           thisObj.props.form.setFieldsValue({ 'StudyRelatedDocument': Object.keys(studyRelatedDocument) });
////       }
////       else {
////           thisObj.setState({ dcmntVisible: false });
////       }

////   }
////   titlePopSave = (data) =>
////   {
////       let titleKey = data.titleKey;
////       let action = thisObj.state.dcmntAction;
////       if (action == "edit") {
////           studyRelatedDocument[thisObj.state.url].Title = data["Title"];
////           studyRelatedDocument[thisObj.state.url].DestinationType = data["DestinationType"];
////           studyRelatedDocument[thisObj.state.url].FileTypeID = data["DocumentType"].split("-")[0];
////           studyRelatedDocument[thisObj.state.url].DocumentType = data["DocumentType"].split("-")[1];
////       }
////       else {
////           var dataSource = [];
////           const url = thisObj.state.url;
////           const length = thisObj.state.dataSource.length + 1;

////           const edit = <div>
////               <ButtonWithToolTip
////                   tooltip="Edit"
////                   shape="circle"
////                   classname="fas fa-pen"
////                   size="small"
////                   url={url}
////                   onClick={() => thisObj.fnToEditDocuments(url,length)}
////               />
////           </div>;

////           studyRelatedDocument[thisObj.state.url] = { key: (action == "edit") ? titleKey : length,actions: edit, Title: data["Title"], DestinationType: data["DestinationType"], FileLocation: thisObj.state.url, DocumentType: data["DocumentType"].split("-")[1], FileTypeID: data["DocumentType"].split("-")[0] };
////       }

////       dataSource = Object.values(studyRelatedDocument)
////       thisObj.setState({ dataSource: dataSource, dcmntVisible: false })
////   }
////   fnToEditDocuments = (data,key) => {

////       thisObj.setState({ dcmntVisible: true, dcmntAction: "edit", url: data, fieldValue: studyRelatedDocument[data], titleKey: key })
////   }


////handleReset = () => {
////    this.props.form.resetFields();
////  }

////    render() {
////        const { visible, handleCancel } = this.props;
////        const { getFieldDecorator, setFieldsValue, validateFields, resetFields } = this.props.form;
////        const { responseData, current, loading, dataSource, fieldValue, dcmntFormData, dcmntVisible, dcmntAction, titleKey} = this.state;
////        const columns = [
////            {
////                title: 'Actions',
////                dataIndex: 'actions',
////                key: 'actions',
////                width: 100
////            },
////            {
////                title: 'Title',
////                dataIndex: 'Title',
////                key: 'Title',
////                width: 100
////            },
////            {
////            title: 'Type',
////            dataIndex: 'DestinationType',
////            key: 'DestinationType',
////            width:100
////        },

////        {
////            title: 'Document Type',
////            dataIndex: 'DocumentType',
////            key: 'DocumentType',
////            width: 100
////        },
////        {
////            title: 'Path',
////            dataIndex: 'FileLocation',
////            key: 'FileLocation',
////            width:100
////        }


////        ]; 
////       // const steps = DynamicForm(responseData.formData, responseData.wizardData, responseData.selectOptions, getFieldDecorator, setFieldsValue);
////        return (
////            <Modal
////                visible={visible}
////                title={"Create Study"}
////                style={{ top: 20 }}
////                onCancel={handleCancel}
////                width={'80%'}
////                maskClosable={false}
////                footer={null}
////            >
                
////                <Spin indicator={antIcon} spinning={loading}>
////                    {Object.keys(responseData.formData).length > 0 && (
////                        <LayoutContentWrapper>
////                            <WizardForm isTableClear={true} isCreate={true} property={this} props={this} getTitleFrFile={this.getTitleFrFile} switchfn={this.switchfn} responseData={responseData} handleCancel={handleCancel} handleReset={this.handleReset} setFieldsValue={setFieldsValue} getFieldDecorator={getFieldDecorator} validateFields={validateFields} saveCallBack={this.saveStudy} />

////                            <Document titleKey={titleKey} fieldValue={fieldValue} action={dcmntAction} visible={dcmntVisible} formData={dcmntFormData} handleCancel={this.titlePopCancel} handleSubmit={this.titlePopSave} title={thisObj.state.title} getFieldDecorator={getFieldDecorator} />

////                            <div id="tableDiv" style={{ padding: "0px 0px 10px 0px" }}>
////                                <span>Study Douments </span>
////                                <div style={{ padding: "0px", overflow:"auto" }}>
////                                    <ReactTable
////                                        size="small"
////                                        search={false}
////                                    pagination={false}
////                                    columns={columns}
////                                    filterDropdownVisible={false}
////                                    dataSource={dataSource}
////                                    scroll={{ x: 500}}
////                                />
////                                </div>
////                            </div>
////                        </LayoutContentWrapper>
////                    )}
////                </Spin>
                
////            </Modal>
////        );
////    }
////}
////const WrappedApp = Form.create()(CreateStudyModal);

////export default WrappedApp;