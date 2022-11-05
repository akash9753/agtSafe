import React, { Component } from 'react';
import { Breadcrumb, Col, Row, Select, Form, Steps, message, Modal, Icon } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, errorModal, successModal, PostCallWithZone, showProgress, hideProgress } from '../Utility/sharedUtility';
import { checkPhoneNumber } from '../Utility/validator';
import { getFormItemsLeft, getFormItemsRight } from '../Utility/htmlUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import SingleForm from '../Utility/SingleForm';
import WizardForm from '../Utility/wizardForm';
import Progress from '../Utility/ProgressBar';
const Option = Select.Option;
const FormItem = Form.Item;
const Step = Steps.Step;


let thisObj = {};
class AddUser extends Component {
  
    constructor(props) {
        super(props);
        //Binding function with 'this' object
        this.handleSubmit = this.handleSubmit.bind(this);
        

         thisObj = this;
        //Initializing state 
        this.state = {
            responseData: {
                formData: {},
                wizardData: {},
                selectOptions: {},
                countryDetails:[]
            },
            progress_start:false,
            current: 0
        };
     
        this.test();

    }

    test = () => {
        thisObj.setState({ progress_start: true })

        //To get user form data
        CallServerPost('Users/GetUserFormData', { FormName: "Users", ActionName: "Create" }).then(
            function (response) {
                thisObj.setState({ progress_start: false })

                const responseData = response.value;
                //console.log(response)
                if (responseData.status == 0) {
                    errorModal(responseData.message);
                } else {
                    thisObj.setState({ responseData: responseData });
                }
            }).catch(error => error);
    }
    cancel = () => {

        this.props.history.push({
            pathname: '/trans/users'
       }        
       ); 
    }

    setDisplayName = (result) => {
        let getValue = this.props.form.getFieldValue;
        let firstName = getValue("FirstName");
        let lastName = getValue("LastName");
        let DisplayName = (firstName ? firstName + " " : "") + (lastName ? lastName : "");
        if (DisplayName.length > 255) {
            DisplayName = DisplayName.substring(1, 255);
        }
        this.props.form.setFieldsValue({ DisplayName });
    }

    setUserName = (result) => {
        let getValue = this.props.form.getFieldValue;
        let emailAddress = getValue("EmailAddress");
        let UserName = (emailAddress ? emailAddress : "");
        this.props.form.setFieldsValue({ UserName });
    }

    handleReset = () => {
        this.props.form.resetFields();
    }

    handleSubmit = (values) => {
       
        const thisObj = this;
        values["TimeZone"] = "IST";
        //values["UserStatusID"] = 1;
        showProgress();
        thisObj.setState({progress_start:true})
        thisObj.props.form.validateFields((err, values) => {
            if (!err) {
                if (values["AdminType"]) {
                    values["AdminType"] = 127;
                } else {
                    values["AdminType"] = 128;
                }
                PostCallWithZone('Users/Create', values)
                    .then(
                        function (response) {
                            hideProgress();
                            if (response.status == 1) {
                                successModal(response.message, thisObj.props, "/trans/users");
                            } else {
                                errorModal(response.message);
                            }
                        }).catch(error => error);
            } else {
                hideProgress();
            }
        });
    }

 

    render() {

        const { getFieldDecorator ,setFieldsValue, validateFields } = this.props.form;
        const { responseData, progress_start } = this.state;
       
        return (
                <LayoutContentWrapper>
                 <Breadcrumb>
                     <Breadcrumb.Item >
                        <i className="fas fa-user" />
                         <span> User</span>
                     </Breadcrumb.Item>
                     <Breadcrumb.Item>
                         Add
                    </Breadcrumb.Item>
                 </Breadcrumb>
                    {
                        Object.keys(responseData.formData).length > 0 && (
                        
                        <SingleForm isCreate={true} setDisplayName={this.setDisplayName} setUserName={this.setUserName} property={this} responseData={responseData} getFieldDecorator={getFieldDecorator} handleCancel={this.cancel} setFieldsValue={setFieldsValue} handleSubmit={this.handleSubmit} />)
                    }
                {<Progress start={progress_start} />}

                    </LayoutContentWrapper>
            
        );
    }
}

const WrappedApp = Form.create()(AddUser);

export default WrappedApp;