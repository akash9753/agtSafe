////import React, { Component } from 'react';
////import { Icon } from 'antd';
////import Tabs, { TabPane } from '../../components/uielements/tabs';
////import Select, { SelectOption } from '../../components/uielements/select';
////import Button from '../../components/uielements/button';
////import PageHeader from '../../components/utility/pageHeader';
////import Box from '../../components/utility/box';
////import LayoutWrapper from '../../components/utility/layoutWrapper';
////import IntlMessages from '../../components/utility/intlMessages';
////import { Form, Spin } from 'antd';
////import { getStudyDetails } from '../Utility/sharedUtility';
////import { CallServerPost, errorModal, successModal, checkPermission } from '../Utility/sharedUtility';
////import Datasets from '../Mapper/datasets';
////import DefineTree from '../DefineBot/index';
////import ProgramTree from '../Program/index';
////import Annotation from './Annotation';
////import DatasetTree from '../Mapper/datasetTree';



////const Option = SelectOption;

////function callback(key) { }

////const operations = <Button>Extra Action</Button>;   

////export default class TabForTreeView extends Component {
////    constructor(props) {
////        super(props);
////        this.newTabIndex = 0;
////        this.state = {
////            loading:false,
////            activeKey: "0"
////        };  
////    }

////    onTabChange = activeKey => {
////        window.CloseDoc();
////        if (activeKey == 2) {

////            this.setState({ activeKey: activeKey });
////            this.props.setMapping(true);
////        }
////        else {
////            this.setState({ activeKey: activeKey });
////            this.props.TabChange({ Annotation: activeKey === "1" });
////            this.props.renderCallback();
////        }
////    };
////    render() {
////        var { loading, activeKey } = this.state;
////        const permissions = this.props.permissions;
////        const studyDetails = getStudyDetails();
////        //console.log(studyDetails);
////        const showAnnotation = () => {
////            if (checkPermission(permissions, ['Annotation']) >= 1) {
////                if (studyDetails !== null && studyDetails.sdtmStudyProperty !== null && studyDetails.sdtmStudyProperty.sdtmAnnotationRequired) {
////                    return true;
////                }
////            }
////            return false;
////        };
////        const showMapping = () => {
////            if (checkPermission(permissions, ['Mapping']) >= 1) {
////                if (studyDetails !== null && studyDetails.sdtmStudyProperty !== null && studyDetails.sdtmStudyProperty.sdtmMappingRequried || studyDetails !== null && studyDetails.adamStudyProperty !== null && studyDetails.adamStudyProperty.adamMappingRequired
////                    || studyDetails !== null && studyDetails.sendStudyProperty !== null && studyDetails.sendStudyProperty.sendMappingRequired || studyDetails !== null && studyDetails.mappingRequried) {
////                    return true;
////                }
////            }
////            return false;
////        };

////        const showProgram = () => {
////            if (checkPermission(permissions, ['Program']) >= 1) {
////                if (studyDetails !== null && studyDetails.sdtmStudyProperty !== null && studyDetails.sdtmStudyProperty.sdtmMappingRequried || studyDetails !== null && studyDetails.adamStudyProperty !== null && studyDetails.adamStudyProperty.adamMappingRequired ||
////                    studyDetails !== null && studyDetails.sendStudyProperty !== null && studyDetails.sendStudyProperty.sendMappingRequired || studyDetails !== null && studyDetails.mappingRequried) {
////                    return true;
////                }
////            }
////            return false;
////        };
////        const showDefine = () => {
////            if (checkPermission(permissions, ['Define']) >= 1) {
////                if (studyDetails !== null && studyDetails.sdtmStudyProperty !== null && studyDetails.sdtmStudyProperty.sdtmDefineRequired || studyDetails !== null && studyDetails.adamStudyProperty !== null && studyDetails.adamStudyProperty.adamDefineRequired ||
////                    studyDetails !== null && studyDetails.sendStudyProperty !== null && studyDetails.sendStudyProperty.sendDefineRequired) {
////                    return true;
////                }
////            }
////            return false;
////        };
////        return (
////            <LayoutWrapper style={{ height: '100%' }}>
                
////                <Tabs activeKey={activeKey} onChange={this.onTabChange} style={{ width: '100%' }}>
////                    {showAnnotation() ? <TabPane name="Annotation" tab="Annotation" key="1">
////                        {
////                            activeKey === "1" &&
////                            <Annotation toggleContent={this.props.toggleContent} refresh={this.props.refresh}  tabChange={this.onTabChange} permissions={permissions.Annotation} projectStudyLockStatus={this.props.projectStudyLockStatus} showhideSpinner={this.props.showhideSpinner} renderCallback={this.props.renderCallback} />
////                        }

////                    </TabPane> :  null}
////                    {showMapping() ? <TabPane name="Mapping" tab="Mapping" key="2">
////                        {
////                            activeKey === "2" &&
////                            <div/>
////                        }
////                    </TabPane> : null}
////                    {showProgram() ? <TabPane name="XML/MacroCall/Python" tab="XML/MacroCall/Python" key="3">
////                        {
////                            activeKey === "3" &&
////                            <ProgramTree permissions={permissions.Program} projectStudyLockStatus={this.props.projectStudyLockStatus} renderCallback={this.props.renderCallback} />
////                        }
////                    </TabPane> :  null}
////                    {showDefine() >= 1 ? <TabPane name="Define" tab="Define" key="4">
////                        {
////                            activeKey === "4" &&
////                            <DefineTree permissions={permissions.Define} projectStudyLockStatus={this.props.projectStudyLockStatus} renderCallback={this.props.renderCallback} />  
////                        }
////                    </TabPane> :  null}
////                </Tabs>
////        </LayoutWrapper>
////        );
////    }
////}
