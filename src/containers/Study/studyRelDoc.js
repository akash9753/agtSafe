import React, { Component } from 'react';
import { Col, Button, Row, Select, Form, TreeSelect, message, Modal, Icon, Input  } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import { getRules } from '../Utility/htmlUtility';
import moment from 'moment-timezone';
import { CallServerPost, errorModal, successModalCallback, PostCallWithZone, successModal, getProjectRole, showProgress, hideProgress } from '../Utility/sharedUtility';


const FormItem = Form.Item;
const splitClass = 24;
const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
const SDTM = 'SDTM';

const ADAM = 'ADAM';

const SEND = 'SEND';
var thisObj = "";
const emptyDoc = { FileLocation: '', Title: '', DocumentTypeID: '', DocumentType: '', DestinationType: '' };

class StudyRelDoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allData: false,
            visible: false,
            currentDoc: emptyDoc,
            docTypeOptions: [],
            protocolDocumentData: []
        }
        thisObj = this;
        thisObj.getFormFieldList();
    }

    //fn to get the list
    getFormFieldList = () => {
        showProgress();
        CallServerPost('Study/GetValuesForCreateStudy', { FormName: "Study", ActionName: "Create", ProjectID: JSON.parse(sessionStorage.studyDetails).projectID, StudyID: JSON.parse(sessionStorage.studyDetails).studyID }).then(
            function (response) {

                if (response.status === 0) {
                    hideProgress();
                    errorModal(response.message);
                } else {
                    const allData = response.value;
                    var studyProDoc = allData.StudyFiles.filter(x => x.activityID === 322);//get protocol document
                    var docTypeOptions, protocolDocumentData;

                    if (Object.keys(allData).length > 0) {
                        const pctList = allData["fileTypes"].filter(doc => doc.shortValue.includes('Supplemental')/* || doc.shortValue.includes('Others')*/);
                        docTypeOptions = pctList.map(function (option) {
                            if (JSON.parse(sessionStorage.studyDetails).standardText.includes(SDTM) && option['longValue'].includes(SDTM)) {
                                return (
                                    <Option name="Document Type SDTM_Option" key={option['productcontrolledTermID'] + "_" + option['shortValue']}>
                                        {option['shortValue']}
                                    </Option>
                                );
                            }
                            else if (JSON.parse(sessionStorage.studyDetails).standardText.includes(ADAM) && option['longValue'].includes(ADAM)) {
                                return (
                                    <Option name="Document Type ADAM_Option" key={option['productcontrolledTermID'] + "_" + option['shortValue']}>
                                        {option['shortValue']}
                                    </Option>
                                );
                            } else if (JSON.parse(sessionStorage.studyDetails).standardText.includes(SEND) && option['longValue'].includes(SEND)) {
                                return (
                                    <Option name="Document Type SEND_Option" key={option['productcontrolledTermID'] + "_" + option['shortValue']}>
                                        {option['shortValue']}
                                    </Option>
                                );
                            }

                        });
                        const treeLoop = (data, folderOnly) =>
                            data.map(item => {
                                if (item.children) {
                                    if (!thisObj.props.availableDocs.includes(item.title) && studyProDoc[0].title !== item.title) {
                                        return (

                                            <TreeNode selectable={folderOnly && item.folder} key={item.key} value={item.key} title={item.title}>
                                                {treeLoop(item.children, folderOnly)}
                                            </TreeNode>
                                        );
                                    }
                                }
                                else {
                                    var selectable = true;
                                    if (folderOnly && !item.folder) {
                                        selectable = false;
                                    }
                                    if (!thisObj.props.availableDocs.includes(item.title) && studyProDoc[0].title !== item.title) {
                                        return <TreeNode selectable={selectable} key={item.key} value={item.key} title={item.title} />;
                                    }
                                }
                            });
                        protocolDocumentData = treeLoop([allData["DocumentsTree"].pdfLocation], false);



                    }
                    thisObj.setState({ allData: allData, protocolDocumentData: protocolDocumentData, docTypeOptions: docTypeOptions }, hideProgress());
                    
                }
            }).catch(error => error);
    }


    docTypeOnChange = (value, callback) => {
        if (this.props.curObj.length !== 0) {
            if (this.props.curObj.includes(value)) {
                callback();
            }
        
}
    }

    handleSubmit = () => {
        const thisObj = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {

                const zones = moment.tz.guess();
                const timezone = moment.tz(zones).zoneAbbr();
                var DocumentTypeID = values['DocType'].split("_")[0];
                var DocumentType = values['DocType'].split("_")[1];
                const projectRole = getProjectRole();
                const docDetails = {
                    StudyID: JSON.parse(sessionStorage.studyDetails).studyID,
                    Title: values['DocTitle'], DestinationType: "PhysicalRef", FileTypeID: DocumentTypeID, DocumentType: DocumentType, FileLocation: values['DocumentPath'], LocationType: 0,
                    TimeZone: timezone, UpdatedBy: projectRole.userProfile.userID };
                showProgress();
                CallServerPost('Document/CreateSupplementalDoc', docDetails).then(
                    function (response) {
                        thisObj.setState({
                            loading: false
                        });
                        if (response.status === 0) {
                            errorModal(response.message);
                        } else {
                            successModalCallback(response.message, thisObj.props.refresh);
                        }
                        hideProgress();
                    });
            }
        });
    }
    cancel = () => {
        this.props.handleCancel();
        this.setState({ visible: false });
    }
    static getDerivedStateFromProps(newProps, currentState) {
        if (newProps.studyRelDocModalVisible && !currentState.visible)
        {
            thisObj.setState({ visible: newProps.studyRelDocModalVisible})
        } 
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { studyRelDocModalVisible, standard, availableDocs } = this.props;
        const { currentDoc, allData, visible,protocolDocumentData, docTypeOptions} = thisObj.state;
      
        const DocTypeField = {
            attributeName: "DocType",
            controlTypeText: "DropDownWithSearch",
            inputRequirementText: studyRelDocModalVisible ? "Mandatory" : "Optional",
            inputTypeErrorMessage: "",
            validationErrorMessage: "",
            requirementErrorMessage: "Document Type should be selected",
            regExText: null,
            minValue: null,
            maxValue: null
        };
        const studyDocumentField = {
            attributeName: "DocumentPath",
            inputRequirementText: studyRelDocModalVisible ? "Mandatory" : "Optional",
            inputTypeErrorMessage: "",
            validationErrorMessage: "",
            requirementErrorMessage: "Study Related Document should be selected",
            regExText: null,
            minValue: null,
            maxValue: null
        };
        const titleField = {
            attributeName: "DocTitle",
            controlTypeText: "TextBox",
            inputTypeText: "Alphanumeric",
            inputRequirementText: studyRelDocModalVisible ? "Mandatory" : "Optional",
            requirementErrorMessage: "Title is mandatory",
            inputTypeErrorMessage: "Title should contain only alphanumeric values",
            validationErrorMessage: "Title should be between 2-255 characters",
            regExText: "/^(?!.*  )[A-Za-z0-9 ]+$/",
            minValue: 2,
            maxValue: 255
        };
       
        return (<Modal
            visible={visible && studyRelDocModalVisible}
            title={"Add Documents"}
            cancelType='danger'
            onCancel={this.props.handleCancel}
            maskClosable={false}
            width={'40%'}
            style={{ zIndex: 1051 }}
            footer={[
                <Button key="cancel" name="PopupCancel" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={() => this.cancel()}>
                    Cancel
                    </Button>,

                <Button key="save" name="PopupSave" className='ant-btn sc-ifAKCX fcfmNQ saveBtn' onClick={()=>this.handleSubmit()}>
                    Save
                    </Button>,
            ]}
        >
           
            <LayoutContentWrapper>
                <LayoutContent>
                    <Row>
                        <Col md={splitClass} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                            <FormItem label="Select a Document">                                                                    {/* SDTMStudyRelatedDocument */}
                                {getFieldDecorator('DocumentPath', {
                                    rules: getRules(studyDocumentField, this.props),
                                    initialValue: currentDoc.FileLocation
                                })(
                                    <TreeSelect
                                        tabIndex={0}
                                        showSearch
                                        autoBlur
                                        allowClear
                                        //onChange={val => this.docTypeOnChange(val)}
                                        style={{ width: '100%' }}
                                        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                                        placeholder="Please Select"
                                    >
                                        {protocolDocumentData}
                                    </TreeSelect>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={rowStyle} justify="space-between">
                        <Col md={24} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                            <FormItem label="Document Type">               {/* Document Type Field */}
                                {getFieldDecorator('DocType', {
                                    rules: getRules(DocTypeField, this.props),
                                    initialValue: currentDoc.DocumentType !== '' ? currentDoc.DocumentTypeID + "_" + currentDoc.DocumentType : currentDoc.DocumentType
                                })(
                                    <Select
                                        style={{ width: '100%' }}
                                        mode="single"
                                        aria-name={"Document Type " + standard}
                                    >
                                        {docTypeOptions}
                                    </Select>,
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={rowStyle} justify="space-between">
                        <Col md={24} sm={24} xs={24} style={{ paddingRight: "10px" }}>
                            <FormItem label="Title">               {/* Title Field */}
                                {getFieldDecorator('DocTitle', {
                                    rules: getRules(titleField, this.props),
                                    initialValue: currentDoc.Title
                                })(
                                    <Input
                                        style={{ width: '100%' }}
                                        placeholder="Title"
                                    />,
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </LayoutContent>
            </LayoutContentWrapper>
             
        </Modal>);
    }
}
const WrappedApp = Form.create()(StudyRelDoc);

export default WrappedApp;
