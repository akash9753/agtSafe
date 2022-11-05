import React, { Component } from 'react';
import { Breadcrumb, Divider, Form } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { CallServerPost, PostCallWithZone, errorModal, successModal, showProgress, hideProgress } from '../Utility/sharedUtility';
import SingleForm from '../Utility/SingleForm';

 class AddProject extends Component {
     constructor(props) {
         super(props);
         const thisObj = this;
         this.handleSubmit = this.handleSubmit.bind(this);
         this.state = {             
             responseData: {
                 formData: {},
                 selectOptions: {}
             }, 
         };
         
CallServerPost('Project/GetProjectFormData', { FormName: "Project", ActionName: "Create" }).then(
    function (response) {
        const responseData = response.value;
        if (responseData.status == 0) {
            errorModal(responseData.message);
        }
        else {
            responseData.formData.push({
                "formFieldAttributeID": 420,
                "attributeName": "RootPath",
                "displayName": "Project RootPath",
                "formID": 3,
                "formActionID": 5,
                "inputRequirementID": 8,
                "inputTypeID": 16,
                "controlTypeID": 11,
                "minValue": 2,
                "maxValue": 255,
                "defaultValue": null,
                "tabIndex": 7,
                "regExID": 25,
                "inputTypeErrorMessage": "",
                "validationErrorMessage": "Project RootPath should be between 2-255 characters",
                "requirementErrorMessage": "Project RootPath is mandatory",
                "formText": "Projects",
                "formActionText": "Create",
                "inputRequirementText": "Mandatory",
                "inputTypeText": "Alphanumeric",
                "controlTypeText": "TextBox",
                "regExText": null,
                "editable": true,
                "wizardID": -1,
                "xpath": null,
                "elementType": null,
                "id": 0,
                "updatedDateTime": "2019-10-04T14:52:16",
                "updatedDateTimeText": null,
                "timeZone": "IST",
                "recordStatus": 2,
                "updatedBy": 1,
                "changeReason": "tabindex updated",
                "updatedUser": "admin"
            });
            thisObj.setState({ responseData: responseData });
        }

    }).catch(error => error);        
     }

 handleSubmit = () => {
     const thisObj = this;
     try {
         //loader
         showProgress();
         this.props.form.validateFields((err, values) => {
             if (!err) {


                 var datas = {};
                 datas["ProjectCode"] = values["ProjectCode"];
                 datas["ProjectDescription"] = values["ProjectDescription"];
                 datas["ProjectName"] = values["ProjectName"];
                 datas["ProjectStatusID"] = values["ProjectStatusID"];
                 datas["SponsorName"] = values["SponsorName"];
                 datas["RootPath"] = values["RootPath"];
                 datas["UserAssignmentList"] = [];
                 for (var i = 0; i < values["UserID"].length; i++) {
                     datas["UserAssignmentList"].push({ UserID: values["UserID"][i], ActionFor: 1 });

                 }

                 PostCallWithZone('Project/Create', datas)
                     .then(
                         function (response) {
                             hideProgress();
                             if (response.status == 1) {
                                 successModal(response.message, thisObj.props.rootprops, "/trans/project");
                             } else {
                                 errorModal(response.message);
                             }
                         }).catch(error => error);
             }
             else {
                 hideProgress();
             }
         });
     } catch (e)
     {
         hideProgress();
     }
 } 
  
 render() { 
         const { responseData } = this.state;       
         const { getFieldDecorator, setFieldsValue } = this.props.form;
         
         return (
             <LayoutContentWrapper style={{ height: "calc(100vh - 128px)"}}>
                 <Breadcrumb>
                     <Breadcrumb.Item>
                         <i className="fas fa-tasks" />
                         <span> Project</span>
                     </Breadcrumb.Item>
                     <Breadcrumb.Item>
                         Add
                    </Breadcrumb.Item>
                 </Breadcrumb>
                 <Divider className="divider-cs" />
                     {Object.keys(responseData.formData).length > 0 &&
                        <SingleForm isCreate={true} property={this} projectUserAssignField={true} responseData={responseData} getFieldDecorator={getFieldDecorator} setFieldsValue={setFieldsValue} handleSubmit={this.handleSubmit} handleCancel={this.props.FormCancel} />
                     } 

             </LayoutContentWrapper>
         );    
    }
}

const WrappedApp = Form.create()(AddProject);

export default WrappedApp;