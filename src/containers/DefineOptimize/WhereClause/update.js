import React, { Component } from 'react';
import { Button, Select, Table, Form, Breadcrumb, Icon, Spin, Tooltip } from 'antd';
import LayoutContent from '../../../components/utility/layoutContent';
import { CallServerPost, PostCallWithZone, errorModal, successModal, successModalCallback, PostCallWithZoneForDomainCreate, showProgress, hideProgress } from '../../Utility/sharedUtility';
import SingleForm from '../../Utility/defineBotForm';
import DomainCmntPopUp from '../domainCmntPopUp.js';
import Confirmation from '../confirmation';
import ReactTable from '../../Utility/reactTable';
import { DefineContext } from '../context';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;

class AddWhereClause extends Component
{
    static contextType = DefineContext;

    constructor(props) {
        super(props);
        this.state =
            {
                //current page field list
                responseData: {
                    formData: {},
                    selectOptions: {}

                },
                datasource: [],
                //Comment Description pop up field list
                cmnFieldJson: {},
                cmntresponseData: {
                    formData: {},
                    selectOptions: {}
                },

                //popupFields
                popupFields: {},
                //For Comment and Method pop up visible var
                showCmntMtdPop: false,

                //Title for both @Comment and @Method description
                title: "",

                validValues: [],
                confirmation: false,
                show: false,
                readOnly: true

            }

        thisObj = this;

        //fn call to get the form field on ready
        thisObj.getFormFieldList(thisObj.props);


    }

    //fn to get the list
    getFormFieldList = (props) =>
    {
        showProgress();
        CallServerPost('WhereClause/GetWhereClauseFormData', { FormName: "WhereClause", ActionName: "Update", ID: props.ID, StudyID: JSON.parse(sessionStorage.studyDetails).studyID, StandardName: sessionStorage.standard  }).then(
            function (response)
            {
                hideProgress();
                const result = response.value;
                if (response.status == 0) {
                    errorModal(result.message);
                } else {

                    //set state to render the page
                    thisObj.setState({
                        show: true,
                        responseData: { formData: result.formData_whereclause, selectOptions: result.selectOptions },
                        cmntresponseData: { formData: result.formData_comment, selectOptions: result.selectOptions },
                        datasource: result.formData_whereclauseList,
                        loading: false, display: "none"

                    });

                    //Onclick fn to that comment button
                    (function () {
                        document.getElementById("CommentDescriptionConfirm").onclick = function () {
                            thisObj.cmntPopUp();
                        };

                    })();

                    document.getElementById("middleDiv").appendChild(document.getElementById("tableDiv"));
                    document.getElementById("middleDiv").setAttribute("style", "height:100%;overflow:auto;display: flex;flex-direction: column");
                }
            }).catch(error => error);
    }



    //fn call to get the list on click
    static getDerivedStateFromProps(nextProps) {
        //console.log("df");
        if (thisObj.props.ID != nextProps.ID) {
            thisObj.props.form.resetFields();

            thisObj.props = nextProps;
            thisObj.setState({ readOnly: true, show: false, loading: true, display: "flex", responseData: { formData: {} } });
            thisObj.getFormFieldList(nextProps);
        }
    }

    //fn call to get the list on click
    shouldComponentUpdate(nextProps, nextState)
    {
        //console.log(nextProps, nextState);
        return true;
    }



    //fn for Comment button to show the comment popup for @CommentDecription
    cmntPopUp = () => {

        //// Value of @TranslatedText is should be the value of @CommentDescription while open the Comment Pop up 
        thisObj.state.cmntresponseData.formData.find(x => x.attributeName === "TranslatedText").defaultValue = document.getElementById("CommentDescription").value;

        thisObj.setState({ title: "Comment", showCmntMtdPop: true, cmntresponseData: thisObj.state.cmntresponseData });

    }

    //fn for Domain Cancel
    Cancel = () => {
        thisObj.setState({ readOnly: true, loading: true, display: "flex" });
        thisObj.props.refresh(thisObj.props.directClick);
    }

    //fn to cancel the comment popup
    handleCommentCancel = () => {
        this.setState({ showCmntMtdPop: false });
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

    //Cancel confirmation popup
    ConfirmationCancel = (e) => {

        thisObj.props.form.resetFields(["Change Reason"])
        thisObj.setState({ confirmation: false })
    }


    //fn for Domain Create
    handleUpdate = (changeReason) => {
        const thisObj = this;
        var elementID = 0;
        var validValues = thisObj.state.validValues;


        thisObj.state.responseData.formData.forEach(function (key, index) {
            const fieldName = key["displayName"].replace(/ /g, "");

            if (index < thisObj.state.cmntresponseData.formData.length) {
                thisObj.state.cmntresponseData.formData[index].comment = true;
            }

            if (key["defaultValue"] != validValues[fieldName]) {
                key["changed"] = true;
            }
            key["defaultValue"] = (validValues[fieldName] != null && validValues[fieldName] != "") ? validValues[fieldName].toString() : validValues[fieldName];


            if (key["displayName"] == "WhereClause") {
                elementID = key["elementID"]
            }

            if (key["attributeName"] == "CommentDescription") {
                key["parentElementID"] = elementID;
                key["comment"] = true;
            }
            key["timeZone"] = "IST";
            key["changeReason"] = changeReason;
            key["updatedBy"] = JSON.parse(sessionStorage.userProfile).userID;
        })

        showProgress();
        var data = thisObj.state.responseData.formData;
        PostCallWithZoneForDomainCreate('WhereClause/UpdateWhereClauseData', data).then(
            function (response)
            {
                hideProgress();
                const responseData = response;
                if (responseData.status == 0) {
                    thisObj.setState({ popupLoading: false });
                    errorModal(responseData.message);
                }
                else {
                    thisObj.setState({ popupLoading: false, confirmation: false });
                    successModalCallback(responseData.message, thisObj.props.refresh);
                }
            }).catch(error => error);
    }
    handleReadOnlyToSave = () => {
        thisObj.setState({ readOnly: false });
    }
    handleSaveToReadOnly = () => {

        thisObj.props.form.resetFields();
        thisObj.setState({ readOnly: true, show: false, loading: true, display: "flex", responseData: { formData: {} } });
        thisObj.getFormFieldList(thisObj.props);

    }
    navigate = (navigate) => {
        let { navigateByPrevNext } = this.context;
        let { ID } = this.props;
        navigateByPrevNext(navigate, ID);
    }
    render() {

        var { readOnly, show, title, responseData, datasource, loading, showCmntMtdPop, cmntresponseData, display } = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { defineActivityWorkflowStatus, prev , next } = this.props;
        const { back } = this.context;

        const columns = [
            {
                title: 'Variable Name',
                dataIndex: 'variableName',
                key: 'variableName',
                width: 100
            },
            {
                title: 'Comparator',
                dataIndex: 'comparator',
                key: 'comparator',
                width: 100
            },
            {
                title: 'Check Value',
                dataIndex: 'variableValue',
                key: 'variableValue',
                width: 100
            },
        ];
        return (
            <div style={{ height: "100%", width: "100%" }}>
                {(show) &&
                    (Object.keys(responseData.formData).length > 0) && (
                        <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                            <Breadcrumb>
                                <Breadcrumb.Item>
                                    <i className="ion-clipboard" />
                                    <span> Whereclause</span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>View
                                    <span style={{ float: 'right' }}>
                                        {prev && <Tooltip title="Prev">
                                            <Icon
                                                className={"defineRightLeftIcon"}
                                                type="caret-left" theme="outlined"
                                                id='left'
                                                style={{ cursor: "pointer", fontSize: "20px" }}
                                                onClick={() => this.navigate("prev")} />
                                        </Tooltip>}
                                        {next && <Tooltip title="Next">
                                            <Icon
                                                className={"defineRightLeftIcon"}
                                                type="caret-right" theme="outlined"
                                                id='right' style={{ cursor: "pointer", fontSize: "20px" }}
                                                onClick={() => this.navigate("next")} />
                                        </Tooltip>}
                                    </span>
                                </Breadcrumb.Item>
                            </Breadcrumb>

                            <div style={{ overflow: "auto", height: "100%", display: "flex", flexDirection: "column" }}>
                                <SingleForm defineActivityWorkflowStatus={defineActivityWorkflowStatus} property={this} responseData={responseData} getFieldDecorator={getFieldDecorator}/* handleSubmit={this.handleValidate}*/ handleCancel={back ? this.backToList : ""} isStudyLock={this.props.isStudyLock} />
                                <DomainCmntPopUp defineActivityWorkflowStatus={defineActivityWorkflowStatus} title={title} data={cmntresponseData} cmntSubmit={this.cmntSave} visible={showCmntMtdPop} handleCancel={this.handleCommentCancel} getFieldDecorator={getFieldDecorator} />
                                <div id="tableDiv" className="customfix" style={{ overflow: "auto", height: "100%", display: "flex", flexDirection: "column" }}>
                                    <span>Expression Table </span>
                                    <ReactTable
                                        size="small"
                                        pagination={false}
                                        columns={columns}
                                        filterDropdownVisible={false}
                                        dataSource={datasource}
                                        showingEntries={datasource.length}
                                        scroll={{ x: 300, y: "calc(100% - 34px)" }}
                                    />
                                </div>

                                <Confirmation loading={this.state.popupLoading} title="Update WhereClause" onSubmit={this.handleUpdate} visible={this.state.confirmation} handleCancel={this.ConfirmationCancel} getFieldDecorator={getFieldDecorator} />
                            </div>
                        </div>
                    )}          
            </div>
        );
    }
}
const WrappedApp = Form.create()(AddWhereClause);
export default WrappedApp;


