import React, { Component } from 'react';
import { Breadcrumb, Button, Layout, Select, Form, Icon, Spin, Tooltip } from 'antd';
import LayoutContent from '../../../components/utility/layoutContent';
import { CallServerPost, PostCallWithZone, errorModal, successModal, successModalCallback, PostCallWithZoneForDomainCreate, dynamicModal, showProgress, hideProgress, definePermission } from '../../Utility/sharedUtility';
import SingleForm from '../../Utility/defineBotForm';
import DomainCmntPopUp from '../domainCmntPopUp.js';
import ValueLevelConfig from '../ValueLevelConfig';
import Confirmation from '../confirmation';
import { fnLoadOrigin } from '../../DefineBot/supportValidation.js';
import { DefineContext } from '../context';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;

class Update extends Component {
    static contextType = DefineContext;

    constructor(props) {
        super(props);
        this.state =
        {
            stringData:"",

            //popupFields
            popupFields: {
                formData: [], selectOptions: {}
            },
            //For Comment and Method pop up visible var
            showCmntMtdPop: false,  
            showValuePop:false,   

            formData_comment: [],
            formData_method: [],
            formData_variable: [],
            formData_variablelevelwherecondition:[],
            selectOptions: {},

            //Title for both @Comment and @Method description
            title:"",
            validValues:[],

            valuedata: {},
            valueLevelConfig: {},
            valueLevelAction: "Update",
            readOnly:true
            }

        thisObj = this;    

    }

    //fn call to get the list on click
    static getDerivedStateFromProps (nextProps,state) {

        if (state.ID != nextProps.ID)
        {
            thisObj.props.form.resetFields();
            thisObj.props = nextProps;
            thisObj.setState({ ID: nextProps.ID, responseData: { formData: {} } });

            thisObj.getFormFieldList(nextProps);
        }
}


    //fn to get the list
    getFormFieldList = (props) => {

        //Get the Fields and validation json
        showProgress();

        CallServerPost('Variable/GetVariableFormData',
            {
                FormName: "VariableLevelMetaData",
                ActionName: "Update",
                ID: props.ID,
                DomainID:props.parrentID,
                StudyID: JSON.parse(sessionStorage.studyDetails).studyID,
                StandardName: sessionStorage.standard
            }).then(
                function (response)
                {
                    hideProgress();
                    const result = response.value; 
                    if (result.status == 0)
                    {
                        errorModal(result.message);
                    }
                    else
                    {
                        //fnLoadOrigin(result.formData_variable.find(x => x.attributeName === "Origin").defaultValue, result.formData_variable, thisObj);
                        //fnLoadOrigin(result.formData_variable.find(x => x.attributeName === "ValueListID").defaultValue, result.formData_variable);
                        result.formData_variable.find(x => x.attributeName === "MethodDescription").parentElementID=result.formData_variable.find(x => x.attributeName === "Mandatory").elementID

                        result.stringData = JSON.stringify(result.formData_variable);


                        if (JSON.parse(result.stringData).find(x => x.attributeName == "ValueListID").defaultValue)
                        {
                            result.valueLevelAction = "Update"
                        }

                        //set state to render the page
                        thisObj.setState(result);

                        fnLoadOrigin(result.formData_variable.find(x => x.attributeName === "Origin").defaultValue, result.formData_variable, thisObj);

                        //Custom validation for this page 

                        (function () {

                            document.getElementById("CommentDescriptionConfirm").onclick = function () {
                                thisObj.cmntPopUp();
                            };

                            document.getElementById("MethodDescriptionConfirm").onclick = function () {
                                thisObj.metdPopUp();
                            };
                            document.getElementById("ValueListIDConfirm").onclick = function () {
                                thisObj.valuePopUp();
                            };
                       })();

                }
            }).catch(error => error);
    }

    //fn for Comment button to show the comment popup for @CommentDecription
    cmntPopUp = () =>
    {
        let state = thisObj.state;
        // Value of @TranslatedText is should be the value of @CommentDescription while open the Comment Pop up 
        state.formData_comment.find(x => x.attributeName === "TranslatedText").defaultValue = document.getElementById("CommentDescription").value;

        thisObj.setState({ title: "Comment", showCmntMtdPop: true, popupFields: { formData: state.formData_comment, state } });
    }

  

    metdPopUp = () =>
    {
        let state = thisObj.state;
        // Value of @TranslatedText is should be the value of @MethodDecription while open the Comment Pop up
        state.formData_method.find(x => x.attributeName === "TranslatedText").defaultValue = document.getElementById("MethodDescription").value;

        thisObj.setState({ title: "Method", showCmntMtdPop: true, popupFields: { formData: state.formData_method, state } });
    }

    valuePopUp = () =>
    {
        let valueLevelAction = "Update";
        // Value of @TranslatedText is should be the value of @MethodDecription while open the Comment Pop up
       

        thisObj.setState({
            valueLevelAction: valueLevelAction,
            valuedata: {
                DomainID: thisObj.props.parrentID,
                Domain: thisObj.props.form.getFieldValue("Domain"), Variable: thisObj.props.form.getFieldValue("VariableName")
            }, title: "Method", showValuePop: true, popupFields: thisObj.state.metdresponseData
        });
    }
    handleLoader = () => {
        thisObj.setState({
            loading: false, display: "none"
            });
    }
    //@CodeListName Validation
    ValueListValidation = (value) =>
    {             
        let state = thisObj.state;

        state.formData_variable.find(x => x.attributeName === "ValueListID").extCom = value;
       
        if (value)
        {
            var ValueListIDText = thisObj.props.form.getFieldValue("Domain") + "." + thisObj.props.form.getFieldValue("VariableName");
            state.formData_variable.find(x => x.attributeName === "ValueListID").defaultValue = ValueListIDText;
        }
        else
        {
            // Value of @TranslatedText is should be the value of @MethodDecription while open the Comment Pop up
            document.getElementById("ValueListIDText").value = "";
        }
    }
    


    //fn to cancel the comment popup
    handleCommentCancel = () =>
    {
        this.setState({ showCmntMtdPop: false });
    }

    handleValueCancel = () =>
    {
        this.setState({ showValuePop: false });
    }

//Cancel confirmation popup
    ConfirmationCancel = (e) =>
    {
       thisObj.props.form.resetFields(["Change Reason"]);
       thisObj.setState({ confirmation: false});
    }

//Validate the current page fields
    handleValidate = (e) =>
    {
        e.preventDefault();
        const thisObj = this;
        var elementID = 0;
        thisObj.props.form.validateFields((err, values) =>
        {
            if (!err)
            {
                //check whereclausedata is 0 or not
                if (thisObj.props.form.getFieldValue("ValueListID") &&
                    Object.keys(thisObj.state.formData_variablelevelwherecondition).length == 0)
                {
                    errorModal("Please configure the where conditions to generate the valuelists");

                } else if (!thisObj.props.form.getFieldValue("ValueListID") &&
                    Object.keys(thisObj.state.formData_variablelevelwherecondition).length > 0)
                {
                    dynamicModal({
                        title: "Warning", icon: "exclamation-circle", msg: "Are you sure to remove the valuelist configuration for this variable ?", onOk: () => { this.callback(values) }
                    });
                }
                else
                {
                    thisObj.setState({ confirmation: true, validValues: values });
                }
            }
    });
}
    callback = (values) =>
    {
        thisObj.setState({ confirmation: true, validValues: values })
    }

    handleUpdate = (changeReason) =>
    {
        thisObj.handleSubmit(changeReason)
    }

    //fn for Update
    handleSubmit = (changeReason) =>
    {
        const thisObj = this;


        var formData = JSON.parse(thisObj.state.stringData);

        var validValues = thisObj.state.validValues;
        var elementID = 0;
        var itemRefID = 0;
        formData.forEach(function (key, index)
        {
            const fieldName = key["displayName"].replace(/ /g, "");

            if (index < thisObj.state.formData_comment.length)
            {
                thisObj.state.formData_comment[index].comment = true;
                thisObj.state.formData_comment[index].changeReason = changeReason;
                if (thisObj.state.formData_comment[index].displayName.toLowerCase() == 'description')
                {
                    thisObj.state.formData_comment[index].defaultValue= thisObj.props.form.getFieldValue("CommentDescription");
                }
            }

            if (index < thisObj.state.formData_method.length) {
                if (thisObj.state.formData_method[index].displayName.toLowerCase() == 'description' ){
                    thisObj.state.formData_method[index].defaultValue= thisObj.props.form.getFieldValue("MethodDescription");
                    }
                thisObj.state.formData_method[index].changeReason = changeReason;

                thisObj.state.formData_method[index].method = true;
            }
            if (key["defaultValue"] == "" || key["defaultValue"] == null) {
                if (validValues[fieldName] != "" && validValues[fieldName] != null) {
                    key["changed"] = true;
                }
            }
            else if (fieldName == "ValueListID"){
                if (validValues[fieldName] != key["extCom"]) {
                    key["changed"] = true;
                }
            }
            else if (validValues[fieldName] != key["defaultValue"]) {
                key["changed"] = true;
            }
            key.defaultValue = (validValues[fieldName] != null && validValues[fieldName] != "") ? validValues[fieldName].toString() : validValues[fieldName];

            if (key.displayName == "Variable Name")
            {
                elementID = key.elementID;
            }

            else if (key.displayName == "Mandatory") {
                itemRefID = key.elementID;
            }

            if (fieldName == "CommentDescription")
            {
                key.comment = true;
                key.parentElementID = elementID;
            }
            else if (fieldName == "MethodDescription")
            {
                key.method = true;
            }
           else if (fieldName == "CodeListName") {
                key.codeList = true;
                key.extCom = document.getElementById("CodeListNameCheckBox").checked;
                key.defaultValue = (validValues[fieldName] !== null && validValues[fieldName].trim() != "") ? validValues[fieldName].toUpperCase() : validValues[fieldName];

            }
             if (fieldName == "ValueListID") {

                 if (key.extCom != validValues[fieldName] || thisObj.state.valueLevelAction == "Create") {
                     key["changed"] = true;
                 } else {
                     key["changed"] = false;
                 }

                key.extCom = validValues[fieldName];
                if (validValues[fieldName])
                {
                   key.defaultValue = "VL."+document.getElementById(fieldName + "Text").value;
                }
                else {
                    key.defaultValue = null;

                }
            }

            key.timeZone = "IST";
            key.changeReason = changeReason;
            key.updatedBy = JSON.parse(sessionStorage.userProfile).userID;

        })
         

        var data = {
                  defineFormFieldAttribute:formData,
                  whereClauseData: thisObj.state.formData_variablelevelwherecondition
        }

        showProgress();
        PostCallWithZoneForDomainCreate('Variable/UpdateVariableData',data).then(
            function (response)
            {
                hideProgress();
                const responseData = response;
                if (responseData.status == 0) {
                    thisObj.setState({ confirmation: false});
                    errorModal(responseData.message);
                }
                else {
                    successModalCallback(response.message, () => {
                        thisObj.setState({ confirmation: false }, thisObj.props.refresh);
                    });
                }
            }).catch(error => { hideProgress(); });
    }

    saveValueLevel = (value) =>
    {
        if (value.length === value.filter(x => x.modificationStatus === 3).length) {
            this.ValueListValidation(false);
        }
        this.setState({ formData_variablelevelwherecondition: value ,showValuePop:false});
    }

    handleReadOnlyToSave = () =>
    {
        thisObj.setState({ readOnly: false });
    }

    handleSaveToReadOnly = () =>
    {
        thisObj.props.form.resetFields();
        thisObj.setState({ responseData: { formData: {} } });
        thisObj.getFormFieldList(thisObj.props );
    }

    navigate = (navigate) =>
    {
        let { navigateByPrevNext } = this.context;
        let { ID } = this.props;
        navigateByPrevNext(navigate,ID);
    }

    render()
    {
        var { readOnly,formData_variablelevelwherecondition, valueLevelAction, stringData, formData_variable, selectOptions, tableElement, showValuePop, title, showCmntMtdPop, popupFields, valuedata } = this.state;
        const { getFieldDecorator } = this.props.form;
        const { back, defineActivityWorkflowStatus } = this.context;
        const { prev, next, backToList } = this.props;

        return (
            <div  style={{height: "100%",width:"100%"}}>
                {
                    (Object.keys(formData_variable).length > 0) &&
                    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <i className="ion-clipboard" />
                                <span> Variable Level Meta Data</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>Edit
                               
                                <span style={{ float: 'right' }}>
                                    {prev && <Tooltip title="Prev">
                                        <Icon
                                            className={"defineRightLeftIcon"}
                                            type="caret-left" theme="outlined"
                                            id='left'
                                            style={{ cursor: "pointer", fontSize: "20px" }}
                                            onClick={() => this.navigate("prev")}
                                        />
                                    </Tooltip>}
                                    {next && <Tooltip title="Next">
                                        <Icon
                                            className={"defineRightLeftIcon"}
                                            type="caret-right" theme="outlined"
                                            id='right' style={{ cursor: "pointer", fontSize: "20px" }}
                                            onClick={() => this.navigate("next")}
                                        />
                                    </Tooltip>}
                                </span>
                            </Breadcrumb.Item>
                        </Breadcrumb>

                        <div style={{ overflow: "auto", height: "100%", display: "flex", flexDirection: "column" }}>
                            <SingleForm
                                defineActivityWorkflowStatus={defineActivityWorkflowStatus}
                                ReadOnlyToSave={this.handleReadOnlyToSave}
                                SaveToReadOnly={this.handleSaveToReadOnly}
                                readOnly={readOnly} stringData={stringData}
                                props={this}
                                responseData={{
                                    formData: formData_variable,
                                    selectOptions: selectOptions
                                }}
                                getFieldDecorator={getFieldDecorator}
                                tableElement={tableElement}
                                handleSubmit={this.handleValidate}
                                handleCancel={back ? backToList : ""}
                                isStudyLock={this.props.isStudyLock}
                            />
                            <DomainCmntPopUp defineActivityWorkflowStatus={defineActivityWorkflowStatus} title={title} data={popupFields} cmntSubmit={this.cmntSave} visible={showCmntMtdPop} handleCancel={this.handleCommentCancel} getFieldDecorator={getFieldDecorator} />
                            <ValueLevelConfig defineActivityWorkflowStatus={defineActivityWorkflowStatus}  handleLoader={this.handleLoader} variablelevelwherecondition={formData_variablelevelwherecondition} action={valueLevelAction} data={valuedata} visible={showValuePop} saveValueLevel={this.saveValueLevel} handleCancel={this.handleValueCancel} />
                            <Confirmation loading={false} title="Update Variable Level Meta Data" onSubmit={this.handleUpdate} visible={this.state.confirmation} handleCancel={this.ConfirmationCancel} getFieldDecorator={getFieldDecorator} />
                        </div>
                    </div>
                }
        </div>
        );}
}

const WrappedApp = Form.create()(Update);
export default WrappedApp;

