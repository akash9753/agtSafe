import React, { Component } from 'react';
import { Breadcrumb,Button, Col, Row, Select, Form, Steps, message, Modal, Icon, Spin } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { CallServerPost, PostCallWithZone, errorModal, successModal, successModalCallback, checkPermission, getAddButtonText, getSaveButtonText } from '../Utility/sharedUtility';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import ConfirmModal from '../Utility/ConfirmModal';
import SingleForm from '../Utility/SingleForm';
import Input from '../../components/uielements/input';
import { clear } from '../Utility/SingleForm';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;

class AddStandard extends Component {
    constructor(props) {

        super(props);

        this.state = {
            loading: true,
            showEditConfirmationModal:false,
            StandardName:[],
            Description:[],
            responseData: {
                formData: {},
            },
            nextProp: true,
            modalLoad: false,
            disableBtn: false
         }

        thisObj = this;

        thisObj.getFormData(thisObj.props);

   }

    getFormData = (data) => {
        if (data.action != "" && data.action != "Delete") {
            CallServerPost('CDISCDataStandard/GetStandardFormData', { FormName: "CDISCStandards", ActionName: data.action, ID: data.cdiscDataStandardID, Editable: (data.action === "Update") ? (data.readOnly) : false }).then(
                function (response) {
                    thisObj.setState({ loading: false });
                    const responseData = response.value;
                    if (responseData.status == 0) {
                        errorModal(responseData.message);
                    } else {
                        thisObj.setState({ nextProp: false, responseData: responseData, loading: false });
                    }
                }).catch(error => error);
        }
    }

    componentWillReceiveProps(nextProps) 
    {
        if (thisObj.state.nextProp && nextProps.action != "" && nextProps.action != "Delete") {
            thisObj.setState({
                nextProp: false
            });
                thisObj.getFormData(nextProps);            
        }
    }

    handleStandardCancel = () => {
        thisObj.setState({
            nextProp: true, responseData: { formData: {} }
                });
        this.props.handleCancel();
    }

    handleCancelEditConfirmationModal =() => {
        this.setState({ showEditConfirmationModal: false });
        this.props.form.resetFields(["Change Reason"]);

    }
    refreshTree = () => {
        this.props.form.resetFields();
        this.setState({
            showEditConfirmationModal: false
        });
        this.props.history();
    }

     handleSubmit = (e) => {
        e.preventDefault();
         const thisObj = this;

            if(thisObj.props.action == "Update"){
               thisObj.props.form.validateFields(["StandardName", "StandardDescription"],{ force: true },(err, values) => {                  
                  if (!err) {
                      thisObj.setState({ showEditConfirmationModal: true, StandardName: values.StandardName, Description: values.StandardDescription });
                    }
            });
            }        
            else if(thisObj.props.action == "Create"){
               thisObj.props.form.validateFields(["StandardName", "StandardDescription"],{ force: true },(err, values) => {                  
                  if (!err) 
                  {                     
                      thisObj.setState({ loading: true, disableBtn: true });
                     PostCallWithZone('CDISCDataStandard/Create', values)
                            .then(
                              function (response) {
                                  thisObj.setState({ loading: false, disableBtn: false });
                                     if (response.status == 1) {
                                         successModalCallback(response.message, thisObj.refreshTree);
                                     }
                                    else {
                                        errorModal(response.message);
                                     }
                       }).catch(error => error);
                    }
            });
            }   
     }

   handleUpdate = (ChangeReason) => {
        const thisObj = this;
        let values = {};
       thisObj.setState({ loading: true, disableBtn: true, modalLoad: true });
       values["ChangeReason"] = ChangeReason;
        values["CDISCDataStandardID"] = thisObj.props.cdiscDataStandardID;
        values["StandardName"] = thisObj.state.StandardName;
        values["StandardDescription"] = thisObj.state.Description;
        values["UpdatedDateTimeText"] = thisObj.state.responseData.updatedDateTimeText;
               
                PostCallWithZone('CDISCDataStandard/Update', values)
                    .then(
                    function (response) {     
                        thisObj.setState({ loading: false, disableBtn: false, modalLoad: false, showEditConfirmationModal: false });
                        if (response.status == 1) {
                            successModalCallback(response.message, thisObj.refreshTree);
                            thisObj.handleStandardCancel();
                            thisObj.props.handleCancel();
                        } else {
                           errorModal(response.message);
                        }
                    }).catch(error => error);
          
    }

   render() {

       const { getFieldDecorator, getFieldValue } = this.props.form;
       const { responseData, loading, disableBtn } = this.state;
       const { action } = this.props;

       return (
           <Modal
               visible={this.props.visible}
               style={{ top: "27vh" }}
               width={650}
               title={this.props.title}
               maskClosable={false}
               onCancel={disableBtn ? null : this.handleStandardCancel}
               onOk={this.handleSubmit}
                               footer={[
                                   <Button key="Cancel" name="Cancel" disabled={disableBtn} className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{float:'left'}} onClick={this.handleStandardCancel}>
                                    Cancel
                                </Button>,
                                    (action == "Create") &&
                                    <Button key="Clear" name="Clear" disabled={disableBtn} className='ant-btn sc-ifAKCX fcfmNQ ant-btn-default' style={{ float: 'left' }} onClick={clear}>
                                    Clear
                                </Button>,
                                 this.props.readOnly === false ?
                                     <Button disabled={disableBtn} name={action === "Create" ? getAddButtonText() : getSaveButtonText()} className='ant-btn sc-ifAKCX fcfmNQ saveBtn' onClick={this.handleSubmit}>
                                       {action === "Create" ? getAddButtonText() : getSaveButtonText()}
                                    </Button> : <div style={{ height: '32px' }}></div>,
                             ]}
           >
               <Spin indicator={antIcon} spinning={loading}>

              <LayoutContentWrapper>
                    {

                           ( this.state.action != "" )?
                            Object.keys(responseData.formData).length > 0 && (
                                   <SingleForm property={this} responseData={responseData} getFieldDecorator={getFieldDecorator}  />):<div></div>

                    }


              </LayoutContentWrapper>
               </Spin>
               <ConfirmModal title="Update Standard" SubmitButtonName="Update" onSubmit={this.handleUpdate} visible={this.state.showEditConfirmationModal} handleCancel={this.handleCancelEditConfirmationModal} getFieldDecorator={getFieldDecorator} loading={this.state.modalLoad}/>

           </Modal>
        );    
}
}

const WrappedApp = Form.create()(AddStandard);
export default WrappedApp;
