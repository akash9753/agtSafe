import React, { Component } from 'react';
import { Breadcrumb, Form, Icon, Tooltip} from 'antd';
import { CallServerPost, errorModal, successModalCallback, PostCallWithZoneForDomainCreate, getStudyID, showProgress, hideProgress, definePermission } from '../../Utility/sharedUtility';
import SingleForm from '../../Utility/defineBotForm';
import DomainCmntPopUp from '../domainCmntPopUp.js';
import Confirmation from '../confirmation';
import { DefineContext } from '../context';


var thisObj;

class Update extends Component
{
    static contextType = DefineContext;

    constructor(props) {
        super(props);
        this.state =
        {

            responseData:
            {
                formData: {},
                selectOptions: {}
            },

            cmntresponseData: {
                formData: {},
                selectOptions: {}
            },
            readOnly: true,
            //for cmnt popup 
            visible: false,
            title: "",

            //validate fields are saved to this variable @see the handle Validate fn
            validValues: [],
        }

        thisObj = this;
    }
    componentDidMount()
    {
        //fn call to get the form field on ready
        thisObj.getFormFieldList(thisObj.props);
    }

    getFormFieldList = (props) =>
    {
        showProgress();
        let { StudyID } = this.context || {};

        //Get the required field to form the page
        CallServerPost('Domain/GetDomainFormData',
            {
                FormName: "Domain",
                ActionName: "Update",
                ID: props.ID,
                StudyID: StudyID,
                StandardName: sessionStorage.standard
            }).then(function (response)
                {
                 hideProgress();
                const result = response.value;
                if (result.status == 0)
                {
                    thisObj.setState({
                        responseData: { formData: [] }
                    });

                    errorModal(result.message);
                }
                else
                {
                    //For Custom Domain purpose if custom domain is true the following list should be enable else no need
                    if (response.value.formData_domain.find(x => x.attributeName == "CustomDomain").defaultValue != "0")
                    {
                        var keyToEnable = ["AliasName", "Context", "TranslatedText","Class", "IsReferenceData", "Structure", "KeyVariable", "Repeating", "Purpose"];
                        response.value.formData_domain.forEach(function (key, index) {

                            if (keyToEnable.indexOf(key.attributeName) != -1) {
                                key.editable = true;
                                key.inputRequirementID = 8;
                                key.inputRequirementText = "Mandatory";
                            }
                        });
                    }

                    //set state to render the page
                    thisObj.setState({
                        responseData: { formData: result.formData_domain, keySequence: result.formData_keysequence,  selectOptions: result.selectOptions },
                        cmntresponseData: { formData: result.formData_comment, selectOptions: result.selectOptions },
                    });

                    //Onclick fn to that comment button
                    (function ()
                    {
                        document.getElementById("CommentDescriptionConfirm").onclick = function () {
                            thisObj.cmntPopUp();
                        };
                    })();

                }
            }).catch(error => { hideProgress(); });
    }

    handleReadOnlyToSave = () =>
    {
        thisObj.setState({ readOnly: false });
    }

    handleSaveToReadOnly = () =>
    {
        thisObj.props.form.resetFields();
        thisObj.setState({ readOnly: true, responseData: { formData: {} } });
        thisObj.getFormFieldList(thisObj.props);

    }

    render()
    {
        let { readOnly,responseData,  visible,cmntresponseData, title} = this.state;
        const { getFieldDecorator } = this.props.form;
        const {defineActivityWorkflowStatus} = this.context;
        const { prev, next, backToList } = this.props;

    return (
        <div  style={{height: "100%",width:"100%"}}>
            {
                (Object.keys(responseData.formData).length > 0) &&
                <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <i className="ion-clipboard" />
                            <span> Domain</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Edit
                           </Breadcrumb.Item>
                        
                    </Breadcrumb>
                    <div style={{ overflow: "auto", height: "100%", display: "flex", flexDirection: "column" }}>
                        <SingleForm
                            defineActivityWorkflowStatus={defineActivityWorkflowStatus}
                            property={this}
                            props={this}
                            ReadOnlyToSave={this.handleReadOnlyToSave}
                            SaveToReadOnly={this.handleSaveToReadOnly}
                            readOnly={readOnly}
                            responseData={responseData}
                            getFieldDecorator={getFieldDecorator}
                            handleSubmit={this.handleValidate}
                            handleCancel={this.props.backToList}
                            isStudyLock={this.props.isStudyLock}
                            
                        />
                    </div>
                    <DomainCmntPopUp defineActivityWorkflowStatus={defineActivityWorkflowStatus} title={title} data={cmntresponseData} cmntSubmit={this.cmntSave} visible={visible} handleCancel={this.handleCommentCancel} getFieldDecorator={getFieldDecorator} />
                    <Confirmation loading={false} title="Update Domain" onSubmit={this.handleUpdate} visible={this.state.confirmation} handleCancel={this.ConfirmationCancel} getFieldDecorator={getFieldDecorator} />
                </div>
            }             
         </div>
    );}


    //fn for comment button to show the comment popup
    cmntPopUp = () =>
    {

        thisObj.state.cmntresponseData.formData[0].defaultValue = document.getElementById("CommentDescription").value;

        thisObj.setState({ visible: true, cmntresponseData: thisObj.state.cmntresponseData, title: "Comment" });

        //description value to fill the pop up description field 
    }

   

    //Validate the current page fields
    handleValidate = (e) =>
    {
            e.preventDefault();
            const thisObj = this;
            thisObj.props.form.validateFields((err, values) =>
            {
                if (!err)
                {
                    thisObj.setState({ confirmation: true, validValues: values });
                }
            });
    }

    //fn for Update
    handleUpdate = (changeReason) =>
    {
        const thisObj = this;
        var elementID = 0;
        var { validValues, responseData } = thisObj.state;
  
        responseData.formData.forEach(function (key, index)
        {
            const fieldName = key["displayName"].replace(/ /g, "");

            let value = key["defaultValue"];
            if (value == "" || value == null)
            {
                if (validValues[fieldName] && validValues[fieldName])
                {
                    key["changed"] = true;
                }
            }
            else if (validValues[fieldName] != value)
            {
                key["changed"] = true;
            }

            //if value is array is ,convert to string
            key["defaultValue"] = validValues[fieldName] ? validValues[fieldName].toString() : validValues[fieldName];

            if (fieldName == "CommentDescription")
            {
                key["comment"] = true;
                key["parentElementID"] = elementID;
            }

            if (key["displayName"] == "Name") {
                elementID = key["elementID"]
            }

            if (fieldName == "KeyVariable") {
                key["elementID"] = elementID;
            }

            key["timeZone"] = "IST";
            key["changeReason"] = changeReason;
            key["updatedBy"] = JSON.parse(sessionStorage.userProfile).userID;
        });

        thisObj.state.responseData.formData.map(function (x, indexitem) {
            if (thisObj.state.responseData.formData[indexitem].wizardID === null) {
                thisObj.state.responseData.formData[indexitem].wizardID = -1;
            }
        })
        var formData = [...thisObj.state.responseData.keySequence, ...thisObj.state.responseData.formData];
        showProgress();
        PostCallWithZoneForDomainCreate('Domain/UpdateDomainData', thisObj.state.responseData.formData).then(
            function (response)
            {
                hideProgress();
                if (response.status == 0)
                {
                    thisObj.setState({ confirmation: false });
                    errorModal(response.message);
                }
                else
                {
                    successModalCallback(response.message, () =>
                    {
                        thisObj.setState({ confirmation: false }, thisObj.props.refresh);
                    });
                }
            }).catch(error => { hideProgress(); });       
    }



    //fn to cancel the comment popup
    handleCommentCancel = () =>
    {
        this.setState({ visible: false });
    }

    //Cancel confirmation popup
    ConfirmationCancel = (e) => {
       thisObj.props.form.resetFields(["Change Reason"])
       thisObj.setState({ confirmation: false })
    }
}
const WrappedApp = Form.create()(Update);
export default WrappedApp;


