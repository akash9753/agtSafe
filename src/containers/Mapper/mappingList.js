import React, { Component } from "react";
import ReactTable from "../Utility/reactTable";
import ButtonWithToolTip from "../Tooltip/ButtonWithToolTip";
import { Modal, Button, Select, Form, Row, Col, message } from 'antd';
import ConfirmModal from '../Utility/ConfirmModal';
import {
    PostCallWithZone,
    successModalCallback,
    errorModal,
    showProgress,
    hideProgress,
    mappingPermission,
    dynamicModal
} from '../Utility/sharedUtility';
import {
    getValueFromForm,
    EMPTY_STR,
    SOURCE,
    TARGET,
    NO_IMPACT,
    IMPACTED_ROW
} from "../Utility/commonUtils";
import { stringSorter, intSorter } from '../Utility/htmlUtility';
import { UpdateImpactModal } from './SourceVariableModal';

const margin = {
    margin: "0 5px 5px 0"
};

function MappingList(props) {
    const [modal2Visible, setmodal2Visible] = React.useState(false);
    const [showConfirmation, setshowConfirmation] = React.useState(false);
    const [deleteID, setdeleteID] = React.useState(-1);
    const isLocked = JSON.parse(sessionStorage.getItem("studyDetails")).locked;
    const workFlowActivityStatusID = JSON.parse(sessionStorage.getItem("studyDetails")).workflowActivityStatusID;
    const projectStudyLockStatus = JSON.parse(sessionStorage.getItem("projectStudyLockStatus"));   
    const [ShowUpdateImapctModal, setShowUpdateImapctModal] = React.useState(false);
    const [Sel_MappingConstruct, setSel_MappingConstruct] = React.useState({});

    const { getFieldDecorator, getFieldsValue } = props.form;
    const { allValues, isHeaderContentShowing } = props;
    const getMapList = () =>
    {
        if (props.type == "ALL") {
            return props.mappingData;
        }
        else if (props.type == SOURCE)
        {
            return props.mappingData.filter(
                mappingOp =>
                    mappingOp["sourceDataset"] === props.sourceObj.TABLE_NAME &&
                    mappingOp["sourceVariableName"] === props.sourceObj.COLUMN_NAME
            )
        } else if (props.type == TARGET) {
            if (props.targetObj.variable !== null) {
                return props.mappingData.filter(
                    mappingOp =>
                        mappingOp["targetDataSet"] === props.targetObj.dataset &&
                        mappingOp["targetVariableName"] === props.targetObj.variable
                )
            } else {
                return props.mappingData.filter(
                    mappingOp =>
                        mappingOp["targetDataSet"] === props.targetObj.dataset
                )
            }
        }
        return props.mappingData;
    }
    const mapList = getMapList();
    const ConfirmDelete = (MappingConstructID) => {
        setdeleteID(MappingConstructID);
        setshowConfirmation(true);
    }
    const getMappingDataList = (mappingData) =>
    {
        //const thisObj = this;

        //let userDetails = JSON.parse(sessionStorage.getItem("userProfile"));
        //let locked = JSON.parse(sessionStorage.projectStudyLockStatus);
        //workflowActivityStatusID =7 means  Mapping Inprogress
        //adminType User admin
        //ADMIN ,Mapping Inprogressonly can annotate only we can annotate
       // let studyDetails = JSON.parse(sessionStorage.getItem("studyDetails"));
      //  let { SourceDataset } = allValues;
       // let Src_Variable = SourceDataset.Variable;

        //let study = JSON.parse(
       //     sessionStorage.getItem("studyDetails")
       // );
        return mappingData.map((mappingConstruct) =>
        {
            const MappingConstructID = mappingConstruct.mappingConstructID;
            const constructString = mappingConstruct.constructString;

            const editCell = (mappingPermission(props.activityWrkflowStatus)) ? (
                <div>

                    <ButtonWithToolTip
                        tooltip="Edit"
                        shape="circle"
                        classname="fas fa-pen"
                        size="small"
                        disabled={projectStudyLockStatus || workFlowActivityStatusID === 16}
                        style={margin}
                        onClick={() => onEdit(mappingConstruct)}
                    />
                    {(constructString && constructString !== "" && mappingConstruct.impact == 0) && 
                        <ButtonWithToolTip
                            tooltip="Copy"
                            shape="circle"
                            classname="fas fa-copy"
                            size="small"
                            disabled={projectStudyLockStatus || workFlowActivityStatusID === 16}
                            style={margin}
                            onClick={() => onCopy(mappingConstruct)}
                        />
                    }
                     
                    <ButtonWithToolTip
                        tooltip="Delete"
                        shape="circle"
                        classname="fas fa-trash-alt"
                        size="small"
                        disabled={projectStudyLockStatus || workFlowActivityStatusID === 16}
                        style={margin}
                        onClick={() => ConfirmDelete(MappingConstructID)}
                    />
                    {(constructString !== "" && constructString && mappingConstruct.impact == 0) ? <ButtonWithToolTip
                        tooltip="Add To Library"
                        shape="circle"
                        classname="ion-android-add"
                        size="small"
                        disabled={projectStudyLockStatus || workFlowActivityStatusID === 16}
                        style={margin}
                        onClick={() => AddMappingRecordToLibrary(mappingConstruct)}
                    /> : ""}
                </div>
            ) : "";

            //if no button in action column means remove action column
            if (editCell) {
                return {
                    key: mappingConstruct.impact ? "impact" + mappingConstruct.mappingConstructID : mappingConstruct.mappingConstructID.toString(),
                    source:
                        mappingConstruct.sourceDataset +
                        "." +
                        mappingConstruct.sourceVariableName,
                    target:
                        mappingConstruct.targetDataSet +
                        "." +
                        mappingConstruct.targetVariableName,
                    action: editCell,
                    rule: mappingConstruct.constructString,
                    impact: mappingConstruct.impact
                };
            }
            else {
                return {
                    key: mappingConstruct.impact ? "impact" + mappingConstruct.mappingConstructID : mappingConstruct.mappingConstructID.toString(),
                    source:
                        mappingConstruct.sourceDataset +
                        "." +
                        mappingConstruct.sourceVariableName,
                        target:
                    mappingConstruct.targetDataSet +
                        "." +
                        mappingConstruct.targetVariableName,
                    rule: mappingConstruct.constructString,
                    impact: mappingConstruct.impact

                };
            }
        });
    }

    let userDetails = JSON.parse(sessionStorage.getItem("userProfile"));
    let locked = JSON.parse(sessionStorage.projectStudyLockStatus);
    //workflowActivityStatusID =7 means  Mapping Inprogress
    //adminType User admin
    //ADMIN ,Mapping Inprogressonly can annotate only we can annotate
    let studyDetails = JSON.parse(sessionStorage.getItem("studyDetails"));
    //console.log(userDetails);
    let study = JSON.parse(
        sessionStorage.getItem("studyDetails")
    );

    const mapcolumns = mappingPermission(props.activityWrkflowStatus) ? [
        {
            title: "Source",
            dataIndex: "source",
            key: "source",
            width: 100,
            sorter: (a, b) => stringSorter(a, b, 'source'),
        },{
            title: "Target",
            dataIndex: "target",
            key: "target",
            width: 100,
            sorter: (a, b) => stringSorter(a, b, 'target'),

        },
        {
            title: "Rule",
            dataIndex: "rule",
            key: "rule",
            width: 100,
            sorter: (a, b) => stringSorter(a, b, 'rule'),

        },
        {
            title: "Actions",
            dataIndex: "action",
            key: "action",
            width: 100
        }
    ] : [
            {
                title: "Source",
                dataIndex: "source",
                key: "source",
                width: 100,
            sorter: (a, b) => stringSorter(a, b, 'source'),
            }, {
                title: "Target",
                dataIndex: "target",
                key: "target",
                width: 100,
            sorter: (a, b) => stringSorter(a, b, 'target'),
            },
            {
                title: "Rule",
                dataIndex: "rule",
                key: "rule",
                width: 100,
                sorter: (a, b) => stringSorter(a, b, 'rule'),
            }
        ];

    const addNew = () => {
        setSel_MappingConstruct({});
        props.form.resetFields();
        setmodal2Visible(true);
    }

    //EDIT
   let onEdit = (mappingConstruct) =>
    {
       const { SourceDataset } = allValues;
       let src_variable = SourceDataset.Variable;

        if (mappingConstruct.impact)
        {
            if (src_variable.some(sv =>
                sv.TABLE_NAME === mappingConstruct.sourceDataset &&
                sv.COLUMN_NAME === mappingConstruct.sourceVariableName))
            {
                props.MappingEdit(mappingConstruct)
            }
            else {
                setSel_MappingConstruct(mappingConstruct);
                setShowUpdateImapctModal(true);
            }


    
        }
        else {
            props.MappingEdit(mappingConstruct)
        }
    }


    //Copy
    let onCopy = (mappingConstruct) => {
        const { SourceDataset } = allValues;
        let src_variable = SourceDataset.Variable;

        if (mappingConstruct.impact) {
            if (src_variable.some(sv =>
                sv.TABLE_NAME === mappingConstruct.sourceDataset &&
                sv.COLUMN_NAME === mappingConstruct.sourceVariableName)) {
                props.MappingEdit(mappingConstruct)
            }
            else {
                setSel_MappingConstruct(mappingConstruct);
                setShowUpdateImapctModal(true);
            }



        }
        else {
            setSel_MappingConstruct(mappingConstruct);
            props.form.resetFields();
            setmodal2Visible(true);
        }
    }

    //Delete Mapping
    const DeleteRule = (ChangeReason) => {
        let postObj = {
            MappingConstructID: deleteID,
            ChangeReason: ChangeReason
        };
        showProgress();
        PostCallWithZone('MappingOperations/Delete', postObj)
            .then(
                function (response) {
                    hideProgress();

                    if (response.status == 1)
                    {
                        successModalCallback(response.message, props.refreshMapping);
                    }
                    else
                    {
                        errorModal(response.message);
                    }
                    setshowConfirmation(false);
                   
                }).catch(error => hideProgress());
    }

    const confirmationCancel = () => {
        setshowConfirmation(false)
    }

    //Add Mapping record to library
    const AddMappingRecordToLibrary = (mappingOperation) => {
        dynamicModal({
            title: "Add To Library",
            msg: "Do you want to save this record in the library?",
            onOk: () => {
                showProgress();

                PostCallWithZone('MappingLibrary/CopyMappingLibrary',
                    {
                        ChangeReason: "Copy",
                        TargetDataSet: mappingOperation.targetDataSet,
                        ConstructString: mappingOperation.constructString,
                        TargetVariableName: mappingOperation.targetVariableName,
                        MappingConstructID: mappingOperation.mappingConstructID,
                        CDISCDataStdDomainMetadataID: mappingOperation.cdiscDataStdDomainMetadataID,
                        CDISCDataStdVariableMetadataID: mappingOperation.cdiscDataStdVariableMetadataID,
                    }
                ).then(function (response) {
                    hideProgress();

                    if (response.status == 1) {

                        successModalCallback(response.message, props.refreshMapping);
                    } else {
                        errorModal(response.message);
                    }
                    setshowConfirmation(false);

                }).catch(error => hideProgress());
            }
        });
    }

    //src_domain & src_var (which src going to move the impacted rule)
    const UpdateImpact = (src_domain,src_var) =>
    {

        //const { SourceDataset } = allValues;

        ////which src  going to move the imapcted record
        //let Src = (SourceDataset.varaibale || []).find((va) =>
        //{
        //    return va.TABLE_NAME === src_domain && va.COLUMN_NAME === src_var;
        //});

        Sel_MappingConstruct.sourceDataset = src_domain;
        Sel_MappingConstruct.sourceVariableName = src_var;
        setShowUpdateImapctModal(false);
        props.MappingEdit(Sel_MappingConstruct);
    }

    const CancelModal = () => {
        setSel_MappingConstruct({});
        setmodal2Visible(false);
    }

    return (
        <div className="Mapping_Table">
            {
                <ReactTable
                    size="small"
                    
                    columns={mapcolumns}
                    addAction={props.type == SOURCE ? () => { addNew() } : null}
                    importFromMappingLib={props.ImportFromMappingLibrary}
                    dataSource={getMappingDataList(mapList)}
                    title={() => "Mapping Operations"}
                    scroll={{ y: isHeaderContentShowing ? "calc(100vh - 363px)" : "calc(100vh - 307px)" }}
                    pageName={"mapping"}
                    isLocked={!isLocked}
                    activityWrkflowStatus={props.activityWrkflowStatus}
                    projectStudyLockStatus={projectStudyLockStatus}
                    workflowActivityStatusID={workFlowActivityStatusID}
                    rowClassName={(record, index) => (record.key.indexOf("impact") !== -1? IMPACTED_ROW : NO_IMPACT)}
                />
            }
            <ConfirmModal
                loading={false}
                title="Delete Mapping"
                SubmitButtonName="Delete"
                onSubmit={DeleteRule}
                visible={showConfirmation}
                handleCancel={confirmationCancel} getFieldDecorator={props.form.getFieldDecorator} />
            <Modal
                title={Object.keys(Sel_MappingConstruct).length === 0 ? "New Mapping" : "Copy Mapping"}
                centered
                maskClosable={false}
                cancelType='danger'
                visible={modal2Visible}
                onCancel={() => setmodal2Visible(false)}
                footer={[
                    <Button key="Cancel"
                        name="Cancel"
                        className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger'
                        style={{ float: 'left' }}
                        onClick={() => CancelModal() }
                    >
                        Cancel
                    </Button>,
                    <Button name="Save" key="ComplexSave" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-primary' style={{ color: "#ffffff" }}
                        onClick={() => {
                            props.form.validateFields(["TargetDomain", "TargetVariable"], (errors, values) => {
                                if (!errors) {

                                    let metaDataID = allValues.Standards.Domain.find(x => x.domain == values["TargetDomain"]).cdiscDataStdDomainMetadataID;
                                    let variable = allValues.Standards.Variable.find(x => x.cdiscDataStdDomainMetadataID == metaDataID && x.variableName == values["TargetVariable"]);
                                    let variableID = allValues.Standards.Variable.find(x => x.cdiscDataStdDomainMetadataID == metaDataID && x.variableName == values["TargetVariable"]).cdiscDataStdVariableMetadataID;
                                    if (allValues.MappingList.filter(mp => mp.cdiscDataStdDomainMetadataID == metaDataID && mp.cdiscDataStdVariableMetadataID == variableID).length > 0) {
                                        message.destroy();
                                        message.error(`${values["TargetDomain"]}.${values["TargetVariable"]} already exists`);
                                    } else {
                                        setmodal2Visible(false);
                                        props.addNewMapping({ ...values, variable: variable, TargetDomainID: metaDataID, TargetVariableID: variableID, SelectedMapping: Sel_MappingConstruct });
                                    }
                                }
                            });
                        }}>
                        Confirm
                    </Button>

                ]}
            >
                <Row gutter={2}>
                    <Col span={12}>
                        <Form.Item label={"Target Domain"} >
                            {getFieldDecorator("TargetDomain", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Target Domain should be selected"
                                    }
                                ],
                            })(
                                <Select
                                    style={{ width: "100%" }}
                                    showSearch
                                    placeholder="Select Domain"
                                    key={"TargetDomain"}
                                    filterOption={(input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }

                                >
                                     {allValues.StandardDomainOps}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            key={"variableSelect"}
                            label={"Target Variable"}
                            style={{ marginLeft: 10 }}
                        >
                            {getFieldDecorator("TargetVariable", {
                                rules: [
                                    {
                                        required: true,
                                        message: "Target Variable should be selected"
                                    }
                                ], 
                            })(
                                <Select
                                    style={{  width: "100%" }}
                                    showSearch
                                    placeholder="Select Target Variable"
                                    key={"TargetVariable"}
                                    filterOption={(input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {getValueFromForm(getFieldsValue, "TargetDomain") !== EMPTY_STR &&
                                        allValues.StandardVaraibleOps[getValueFromForm(getFieldsValue, "TargetDomain")]}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                
            </Modal>
            <UpdateImpactModal
                Show={ShowUpdateImapctModal}
                getFieldDecorator={getFieldDecorator}
                HideSourceVariableModal={() => setShowUpdateImapctModal(false)}
                SourceObj={allValues.SourceDataset}
                UpdateImpact={UpdateImpact}
                form={props.form}
            />
        </div>
    )
}

const WrappedApp = Form.create()(MappingList);

export default WrappedApp;