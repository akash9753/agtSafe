import React, { Component } from 'react';
import {Form, Breadcrumb, Icon, Spin } from 'antd';
import LayoutContent from '../../../components/utility/layoutContent';
import { CallServerPost, PostCallWithZone, errorModal, successModal, successModalCallback, getProjectRole } from '../../Utility/sharedUtility';
import SingleForm from '../../Utility/defineBotForm';
import Confirmation from '../confirmation';
import DomainCmntPopUp from '../domainCmntPopUp.js';
import ReactTable from '../../Utility/reactTable';

var thisObj;
const projectRole = getProjectRole();
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

class Analysis extends Component {
    constructor(props) {
        super(props);
        this.state =
            {
            showConfirmationPop: false,
            allValues: null,
            responseData: {
                formData: {},
                selectOptions: {},
            },
            CommentPop: false,
            dataSource:[],
            }

        thisObj = this;

        //fn call to get the form field on ready
        thisObj.getFormFieldList(thisObj.props);

    }

    //fn to get the list
    getFormFieldList = (prop) => {
        CallServerPost(prop.getFormUrl, prop.getFormData).then(
            function (response) {
                //console.log(response);
                var result = response.value;
                const responseData = response.value;
                if (responseData.status == 0) {
                    thisObj.setState({
                        loading: false, display: "none"
                    });
                    errorModal(responseData.message);
                } else {

                    //set state to render the page
                    thisObj.setState({
                        show: true, responseData: ({ formData: result.formData, selectOptions: result.selectOptions }), loading: false, display: "none"
                    });
                    (function () {
                        if (thisObj.props.pageName == "Analysis Result") {

                            document.getElementById("DocumentationDescriptionConfirm").onclick = function () {
                                thisObj.cmntPopUp();
                            };
                            document.getElementById("DatasetCommentConfirm").onclick = function () {
                                thisObj.cmntPopUp("Dataset");
                            };
                        }
                    })();
                }
            }).catch(error => error);
    }


    //fn for comment button to show the comment popup
    cmntPopUp = (forWhat) => {
        if (forWhat == "Dataset") {
            let formData =

                [
                    {
                        controlTypeText: "DropDown",tabIndex:1, attributeName: "WhereClause", displayName: "WhereClause", editable: true, inputRequirementText: "Mandatory", inputTypeErrorMessage: "WhereClause should be selected"
                    },
                    {
                        controlTypeText: "DropDown", tabIndex: 2, attributeName: "AnalysisVariable", displayName: "Analysis Variable", editable: true, inputRequirementText: "Mandatory", inputTypeErrorMessage: "Analysis Variable should be selected"
                    }

                ]
            thisObj.setState({ CommentPop: true, cmntresponseData: ({ formData: formData, selectOptions: [] }), title: "Comment" });

        }
        else {
            var prop = thisObj.props;
            CallServerPost(prop.getFormUrl, { FormName: "CommentDescription", ActionName: "Details" }).then(
                function (response) {
                    //console.log(response);
                    var result = response.value;
                    const responseData = response.value;
                    if (responseData.status != 0) {
                        thisObj.setState({ CommentPop: true, cmntresponseData: ({ formData: result.formData, selectOptions: result.selectOptions }), title: "Comment" });
                    }
                });
        }

        //description value to fill the pop up description field 
    }

    //fn to cancel the comment popup
    handleCommentCancel = () => {
        this.setState({ CommentPop: false });
    }

    //fn for Domain Cancel
    Cancel = () => {
        thisObj.setState({ readOnly: true, loading: true, display: "flex" });
        thisObj.props.refresh(thisObj.props.directClick);
    }

    //Cancel confirmation popup
    ConfirmationCancel = (e) => {
        thisObj.props.form.resetFields(["ChangeReason"])
        thisObj.setState({ confirmation: false })
    }

    //Validate the current page fields
    handleValidate = (e) => {
        e.preventDefault();
        const thisObj = this;
        var elementID = 0;
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                thisObj.setState({ confirmation: true, validValues: values })
            }
        });
    }

    handleReadOnlyToSave = () => {
        thisObj.setState({ readOnly: false });
    }

    handleSaveToReadOnly = () => {

        thisObj.props.form.resetFields();
        thisObj.setState({ readOnly: true, show: false, loading: true, display: "flex", responseData: { formData: {} } });
        thisObj.getFormFieldList(thisObj.props);

    }
    handleSubmit = (e) => {
        e.preventDefault();
        const thisObj = this;
        if (thisObj.state.actionName == "Update") {
            const thisObj = this;
            thisObj.props.form.validateFields((err, values) => {
                if (!err) {
                    thisObj.setState({ showConfirmationPop: true, modalLoad: false, allValues: values });
                }
            });
        }
        else {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    var url = thisObj.props.saveUrl;
                    this.fnToCreateAndUpdate(url, values);
                }
            });
        }
    }
    handleUpdate = (ChangeReason) => {

        thisObj.setState({ modalLoad: true });
        const thisObj = this;
        let values = this.state.allValues;
        var url = thisObj.saveUrl;
     
        values["ChangeReason"] = ChangeReason;
        values["DataSetValidationRuleID"] = this.state.dataSetValidationRuleID;
        values["TimeZone"] = "IST";
        values["UpdatedBy"] = projectRole.userProfile.userID;

        CallServerPost(url, values)
            .then(
                function (response) {
                    thisObj.setState({ showConfirmationPop: false, modalLoad: false });
                    if (response.status == 0) {
                        thisObj.setState({ popupLoading: false });
                        errorModal(response.message);
                    } else {
                        thisObj.setState({ popupLoading: false, confirmation: false });
                        successModalCallback(response.message, thisObj.Cancel);
                    }
                }).catch(error => error);
    }

    componentDidUpdate() {
        if (thisObj.props.pageName == "Analysis Result") {
            let tempRef = thisObj.state.responseData;
            if (Object.keys(tempRef.formData).length != 0) {
                document.getElementById("DatasetComment").parentElement.parentElement.appendChild(document.getElementById("tableDiv"));
            }
        }
    }
    render() {
        var { responseData, loading, display, dataSource, show, readOnly, CommentPop, actionName } = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { toHide, pageName, defineActivityWorkflowStatus } = this.props;
        const columns = [
            {
                title: 'Where Clause',
                dataIndex: 'Where Clause',
                key: 'Where Clause',
                width: 100
            },
            {
                title: 'Analysis Variable',
                dataIndex: 'AnalysisVariable',
                key: 'AnalysisVariable',
                width: 100
            },
            
        ]; 

        return (
            <div style={{ height: "100%", width: "100%" }}>
                {
                    (show) ?
                        (Object.keys(responseData.formData).length > 0) ? (
                            <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                                <Breadcrumb>
                                    <Breadcrumb.Item>
                                        <i className="ion-clipboard" />
                                        <span> {pageName}</span>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>{actionName}
                                        {
                                            <span style={{ float: 'right' }}>
                                                {(toHide != "left" && toHide != "both") && <Icon type="caret-left" theme="outlined" id='left' style={{ cursor: "pointer" }} onClick={this.props.move} />}
                                                {(toHide != "right" && toHide != "both") && <Icon type="caret-right" theme="outlined" id='right' style={{ cursor: "pointer" }} onClick={this.props.move} />}
                                            </span>
                                        }
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                                <div style={{ overflow: "auto", height: "100%", display: "flex", flexDirection: "column" }}>
                                    <SingleForm defineActivityWorkflowStatus={defineActivityWorkflowStatus}  ReadOnlyToSave={this.handleReadOnlyToSave} SaveToReadOnly={this.handleSaveToReadOnly} readOnly={readOnly} property={this} props={this} responseData={responseData} getFieldDecorator={getFieldDecorator} handleSubmit={this.handleValidate} handleCancel={this.props.cancel ? this.Cancel : ""} isStudyLock={this.props.isStudyLock} />
                                    <Confirmation loading={this.state.popupLoading} onSubmit={this.handleUpdate} visible={this.state.confirmation} handleCancel={this.ConfirmationCancel} getFieldDecorator={getFieldDecorator} />
                                </div>
                            </div>
                        ) : <div className="norecords">No fields are available to show</div> : ""}
                {loading && <div className="customLoader" style={{ display: display }}>
                    <Spin indicator={antIcon} style={{ margin: "auto" }} size="default" spinning={true}></Spin>
                </div>}
                <DomainCmntPopUp title={"Comment"} data={this.state.cmntresponseData} cmntSubmit={this.cmntSave} visible={CommentPop} handleCancel={this.handleCommentCancel} getFieldDecorator={getFieldDecorator} />

                <Confirmation loading={this.state.popupLoading} onSubmit={this.handleUpdate} visible={this.state.confirmation} handleCancel={this.ConfirmationCancel} getFieldDecorator={getFieldDecorator} />
                <div id="tableDiv" style={{ padding: "5px 0px 10px 0px" }}>
                    <span><b>Whereclause </b></span>
                    <div style={{ padding: "0px", overflow: "auto" }}>
                        <ReactTable
                            size="small"
                            search={false}
                            pagination={false}
                            columns={columns}
                            filterDropdownVisible={false}
                            dataSource={dataSource}
                            scroll={{ x: 500 }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
const WrappedApp = Form.create()(Analysis);
export default WrappedApp;
