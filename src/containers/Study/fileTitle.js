import React, { Component } from 'react';
import { Col, Button, Row, Select, Form, Steps, message, Modal, Icon, Spin } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import {successModalCallback } from '../Utility/sharedUtility';
import { checkAlphaNumeric } from '../Utility/validator';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import ConfirmModal from '../Utility/ConfirmModal';
import SingleForm from '../Utility/SingleForm';
import Input from '../../components/uielements/input';
import { fnLoadOrigin } from '../DefineBot/supportValidation.js';

const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

var thisObj;
var loopControl = true;
var documentTypeText = "";
class FileTitle extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loading: false,
            modalLoading: false,
            responseData: {
                formData: {},
            },
        }

        thisObj = this;

    }
    componentWillReceiveProps(nextProps) {

        if (nextProps.visible && loopControl) {
            
            //thisObj.props.form.setFieldsValue({ DestinationType: value.DestinationType, DocumentType: value.FileTypeID, Title: value.Title });
            thisObj.fnForUpdate(nextProps)
            thisObj.setState({
                responseData: nextProps.formData, visible: nextProps.visible, loopControl: false
            });
            loopControl = false;
        }
        else if (!nextProps.visible) {
            nextProps.form.resetFields();
            loopControl = true;
            thisObj.setState({
              visible: nextProps.visible
            });
        }
    }
  
    fnForUpdate = (nextProps) => {
        var value = nextProps.fieldValue;
        nextProps.formData.formData.forEach(function (key,index)
        {
            if(nextProps.action != "edit"){
                thisObj.props.form.resetFields();
                if(key.attributeName.toLowerCase() != "documenttype"){
                    key.editable=false;
                   key.defaultValue = value[key.attributeName];     

                }
                else{
                    key.defaultValue = value.FileTypeID;
                }
            }
            else{
                key.editable=true;
                if(key.attributeName.toLowerCase() == "documenttype"){
                    key.defaultValue = value.FileTypeID;
                }
                else{
                   key.defaultValue = value[key.attributeName];     
                }
            }
         });
         
     }
    
    handleSubmit = () => {
           thisObj.props.form.validateFields((err, values) => {
               if (!err) {
                   values["DocumentType"] = values["DocumentType"] + "-" + documentTypeText;
                   values.titleKey = (thisObj.props.titleKey);
                   thisObj.props.handleSubmit(values);

               }
        })
         
    }
    getDropSelectedText = (value,text) => {
      var temp = thisObj.state.responseData.formData;
      if (value != null){
        temp.forEach(function (key,index)
        {
            if(key.attributeName.toLowerCase() == "title"){
                key.editable=true;
            }
        });
        }       
        documentTypeText = text;
    }
    
    fnTitleValidation = (value) =>
    {
         var temp = thisObj.state.responseData.formData;

            temp.forEach(function (key,index)
            {
                if(key.attributeName.toLowerCase() == "destinationtype")
                {
                    if(value != null && value !="" && value != undefined){
                        if(value.length >= 2){
                            key.editable=true;
                           
                        }
                        else{
                            key.editable=false;
                            thisObj.props.form.setFieldsValue({DestinationType:null})
                        } 
                    }
                    else{
                            key.editable=false;
                            thisObj.props.form.setFieldsValue({ DestinationType: null})
                        } 
                       
                }
                
            });
            thisObj.setState({
                responseData: thisObj.state.responseData
            });
         
    }
    
     render() {

        const { getFieldDecorator, getFieldValue } = this.props.form;
        var { responseData, loading, visible ,title} = this.state;

        return (
            <Modal
                visible={visible}
                title={this.props.title}
                cancelType='danger'
                onCancel={this.props.handleCancel}
                onOk={this.handleSubmit}
                maskClosable={false}
                style={{zIndex:1051}}
                footer={[
                    <Button key="cancel" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={this.props.handleCancel}>
                        Cancel
                    </Button>,

                    <Button key="save" className='ant-btn sc-ifAKCX fcfmNQ saveBtn' onClick={this.handleSubmit}>
                        Save
                    </Button>,
                ]}
            >
                <Spin indicator={antIcon} spinning={loading}>
                    {
                            <LayoutContentWrapper>
                                <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                                    {
                                        (visible) ?
                                        <SingleForm property={this} responseData={responseData} getFieldDecorator={getFieldDecorator} props={this} /> : ""
                                    }
                                </div>
                            </LayoutContentWrapper>
                    }
                </Spin>
            </Modal>
        );
    }
}

const WrappedApp = Form.create()(FileTitle);
export default WrappedApp;
