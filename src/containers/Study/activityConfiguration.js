////import React, { Component } from 'react';
////import {
////    Col,
////    Row,
////    Modal,
////    Card,
////    Form,
////} from 'antd';
////import {
////    TreeNode
////} from '../../components/uielements/tree';
////import LayoutContentWrapper from '../../components/utility/layoutWrapper';
////import LayoutWrapper from '../../components/utility/layoutWrapper';
////import {
////    errorModal,
////    showProgress,
////    hideProgress,
////    CallServerPost
////} from '../Utility/sharedUtility';

////import Box from '../../components/utility/box';
////import {
////    CSSTransition
////} from 'react-transition-group';
////import Annotation from './Annotation';
////import Transformation from './Annotation';
////import Define from './Annotation';
////import DataContext from "./DataContext";


////const flexDisplay = { display: "flex", flexDirection: "column", padding: "6px 0px 10px 0px" };
////let thisObj = {};

////class ActivityConfiguration extends Component {
////    constructor(props) {
////        super(props);
////        this.state =
////        {
////            home: props.visible,
////            screen: "home",
////            documents:[]
////        };
////    }

////    componentDidMount()
////    {
////            const thisObj = this;
////            showProgress();
////            CallServerPost('Study/GetValuesForCreateStudy', { FormName: "Study", ActionName: "Create", ProjectID: this.props.projectId }).then(
////                function (response) {
////                    if (response.status === 0) {
////                        errorModal(response.message);
////                    }
////                    else
////                    {
////                        const studyData = response.value;
////                        const treeLoop = (data, folderOnly) =>
////                            data.map(item => {
////                                if (item.children) {
////                                    return (
////                                        <TreeNode selectable={folderOnly && item.folder} key={item.key} value={item.key} title={item.title}>
////                                            {treeLoop(item.children, folderOnly)}
////                                        </TreeNode>
////                                    );
////                                }
////                                else {
////                                    var selectable = true;
////                                    if (folderOnly && !item.folder) {
////                                        selectable = false;
////                                    }
////                                    return <TreeNode selectable={selectable} key={item.key} value={item.key} title={item.title} />;
////                                }
////                            });

////                        const protocolDocumentData = treeLoop([studyData["DocumentsTree"].pdfLocation], false);
////                        thisObj.setState({ documents: protocolDocumentData})
////                    }
////                    hideProgress();
////                }).catch(error => error);
////        }
    
   
//////this code to cancel the popup when click cancel
////    static getDerivedStateFromProps(newProp, currentState)
////    {
////        let { visible } = newProp;
////        //when cancel this if will work
////        if (!visible && currentState.home)
////        {
////            return {
////                home: false,
                
////            };
////        }
////    }

////    //Cancel
////    cancel = () => {
////        let { page } = this.state;
////        switch (page)
////        {
////            case "home":
////                return this.props.handleCancel();
////            default:
////                return this.setState({ screen: "home" });
////        }
////    }

////    render() {
////        let { screen,documents } = this.state;
////        return (
////            <Modal
////                home={this.props.visible}
////                title={"Activity Configuration -" + this.props.studyName }
////                onCancel={this.handleCancel}
////                maskClosable={false}
////                style={{ top: 20, minHeight: 400 }}
////                centered
////                width='auto'
////                footer={null}
////            >
////                <LayoutWrapper id="treeview_layout" >
////                    {screen === "home" &&
////                        <Box style={flexDisplay}>
////                        {
////                            <Row style={{ display: "flex", flexDirection: "column", height: '100%' }}>
////                                <Col style={{ height: "100%" }}>
////                                    <LayoutContentWrapper style={{ height: "100%", width: "100%" }} >
////                                        {
////                                            <div style={{ background: '#ECECEC', padding: '50px', height: "100%", width: '100%' }}>
////                                                <Row gutter={16}>
////                                                    {
////                                                        <Col span={8}>
////                                                            <div style={{ display: "inline-block", height: "100%", width: "100%", minHeight: 100, minWidth: 200 }} >
////                                                                <CSSTransition
////                                                                    in={true}
////                                                                    timeout={500}
////                                                                    classNames="alert"
////                                                                    unmountOnExit
////                                                                    appear
////                                                                >
////                                                                    <Card
////                                                                        title="Annotation"
////                                                                        bordered={false}
////                                                                        extra={
////                                                                            <i
////                                                                                className="fa fa-cog"
////                                                                                aria-hidden="true"
////                                                                                onClick={() => this.setState({ Annotation: true })}
////                                                                            >
////                                                                            </i>}
////                                                                    >
////                                                                        <div>
////                                                                            Status :
////                                                        </div>
////                                                                    </Card>
////                                                                </CSSTransition>
////                                                            </div>
////                                                        </Col>
////                                                    }
////                                                    {
////                                                        <Col span={8}>
////                                                            <div style={{ display: "inline-block", height: "100%", width: "100%", minHeight: 100, minWidth: 200 }} >
////                                                                <CSSTransition
////                                                                    in={true}
////                                                                    timeout={550}
////                                                                    classNames="list-transition"
////                                                                    unmountOnExit
////                                                                    appear
////                                                                >
////                                                                    <Card
////                                                                        title="Transformation"
////                                                                        bordered={false}
////                                                                        extra={<i
////                                                                            className="fa fa-cog"
////                                                                            aria-hidden="true"></i>}
////                                                                    >
////                                                                        <div>
////                                                                            Status :
////                                                        </div>
////                                                                    </Card>
////                                                                </CSSTransition>
////                                                            </div>
////                                                        </Col>
////                                                    }
////                                                    {
////                                                        <Col span={8} >
////                                                            <div style={{ display: "inline-block", height: "100%", width: "100%", minHeight: 100, minWidth: 200 }} >
////                                                                <CSSTransition
////                                                                    in={true}
////                                                                    timeout={600}
////                                                                    classNames="alert"
////                                                                    unmountOnExit
////                                                                    appear

////                                                                >
////                                                                    <Card
////                                                                        title="Define XML"
////                                                                        bordered={false}
////                                                                        extra={<i
////                                                                            className="fa fa-cog" aria-hidden="true">
////                                                                        </i>}>
////                                                                        <div>
////                                                                            Status :
////                                                        </div>
////                                                                    </Card>
////                                                                </CSSTransition>
////                                                            </div>
////                                                        </Col>
////                                                    }

////                                                </Row>
////                                            </div>
////                                        }
////                                    </LayoutContentWrapper>
////                                </Col>
////                            </Row>
////                        }
////                        </Box>
////                    }
////                    <DataContext.Provider
////                        value={{
////                            documents: documents,
////                            cancel: this.cancel,
////                        }}
////                    >
////                        {
////                            screen === "annotation" &&
////                            <Annotation />
////                        }
////                        {
////                            screen === "transformation" &&
////                            <Transformation />
////                        }
////                        {
////                            screen === "define" &&
////                            <Define />
////                        }
////                    </DataContext.Provider>
////                </LayoutWrapper>
////            </Modal>
////        );
////    }
////}

////const WrappedApp = Form.create()(ActivityConfiguration);

////export default WrappedApp;