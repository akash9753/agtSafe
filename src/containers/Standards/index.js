import React, { Component } from 'react';
import { Icon, Col, Row, Layout, Menu, Breadcrumb, Form, Spin } from 'antd';
import { ContactsWrapper } from '../../styles/JsStyles/projects.style';
import Tree, { TreeNode } from '../../components/uielements/tree';
import StandardTree from './standardTree';
import StandardList from './standardContent.js';
import StandardVersionList from './cDISCDataStandardVersionList.js';
import StandardDomainClassList from './cDISCDataStdDomainClasList.js';
import StdDomainList from './cDISCDataStdDomainList.js';
import VariableList from './cDISCDataStdVariableList.js';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import { ContactListWrapper } from '../../styles/JsStyles/projectList.style';

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
const {  Content, Sider } = Layout;
const { SubMenu } = Menu;
const FormItem = Form.Item;
var thisObj;
const headerStyle = { height: 50, backgroundColor: '#ffffff', padding: 5 };

export default class Standards extends Component {
    constructor(props) {

        super(props);

        this.fnToHideShowTreeView = this.fnToHideShowTreeView.bind(this);

        this.state = {
            displayDiv: null,
            loading: false,
            treeSelect: 0,
            currentTreeNodeObject: [],
            treeClickEvent: null,
            list: null,
            nextProp: false,
            pageRefresh: false,
            loopedParents: {},
        };
        thisObj = this; 
    }


    showSpinner = () => {
        this.setState({ loading: true });
    }

    hideSpinner = () => {
        this.setState({ loading: false });
    }

    fnToHideShowTreeView = () => {
        this.setState({ treeVisible: !this.state.treeVisible });
    }

    onTreeNodeSelect = (selectedKeys, e) => {

        this.setState({ treeClickEvent: e, nextProp: false })

          switch (e.node.props.type.trim().toLowerCase()){
              case "datastandards":
                  this.setState({ pageRefresh: true, nextProp: false, treeSelect: 1, currentTreeNodeObject: e.node.props, loading:false });
                break;
           case "cdiscdatastandard":
                  this.setState({ pageRefresh: true, nextProp: false, treeSelect: 2, currentTreeNodeObject: e.node.props, loading: false });

               break;
           case "cdiscdatastdversion":                
                  this.setState({ pageRefresh:true,nextProp: false, treeSelect: 3, currentTreeNodeObject: e.node.props, loading: false });
                    break;
           //case "domainclass":                
           //       this.setState({ treeSelect:3, currentTreeNodeObject: e.node.props });
           //         break;
           case "cdiscdatastddomainclass":                
                 
                  this.setState({ pageRefresh: true, nextProp: false, treeSelect: 4, currentTreeNodeObject: e.node.props, loading: false  });
                  this.forceUpdate();
                    break;
           case "cdiscdatastddomainmetadata":                
                  this.setState({
                      loopedParents: e.node.props.parents, pageRefresh: true,nextProp: false, treeSelect: 5, currentTreeNodeObject: e.node.props, loading: false  });
                    break;
           default:
                  this.setState({ pageRefresh: true, nextProp: false, treeSelect: 0, loading: false });
        
}
   };

    history = () => {
        
        thisObj.setState({ pageRefresh:false,nextProp: true, loading:true });
    }

    renderDiv = () => {
        
        if (thisObj.state.treeClickEvent != null) {
            thisObj.onTreeNodeSelect("", thisObj.state.treeClickEvent)
        }

    }

    loader = () =>{
      thisObj.setState({loading:true});
    }

    stopLoading = () =>{
      this.setState({loading:false});
    }

render() {
    const { treeVisible, loading, nextProp, pageRefresh, loopedParents } = this.state;
    const permissions = this.props.permissions;
    const isCustom = this.props.location.pathname.split("/")[2] === "customstandards" ? 1 : 0;
        return (
            <div style={{ margin: "0 5px" }}>
                <Spin indicator={antIcon} spinning={loading} >

                 <Breadcrumb>
                    <Breadcrumb.Item>
                            <i className="fas fa-list-ul" />
                        <span> Standards</span>
                    </Breadcrumb.Item>                  
                </Breadcrumb>

                <ContactsWrapper
                        className="isomorphicContacts" style={{padding:0}}>
                    <div className="isoContactListBar" style={{ borderColor: "#ddd", borderRadius: "5px 0px 0px 5px", border: "1px solid rgb(221, 221, 221)", background: "#fff" }}>
                            <ContactListWrapper className="isoContactListWrapper" style={{ padding: 10 }}>
                                <StandardTree isCustom={isCustom} loader={this.loader} nextProp={nextProp} renderCallback={this.renderDiv} stopLoading={this.stopLoading} onTreeNodeSelect={this.onTreeNodeSelect} >
                                  
                                </StandardTree>
                        </ContactListWrapper>
                    </div>
                    <Layout className="isoContactBoxWrapper" style={{ borderColor: "#ddd", borderRadius: "0px 5px 5px 0px", padding: "10px 0 10px 0 !important", border: "1px solid rgb(221, 221, 221)", background: "#fff" }}>
                            <Content style={{ background: '#fff' }}>
                                {this.state.treeSelect == 1 ? (<StandardList isCustom={isCustom} permissions={this.props.permissions} pageRefresh={pageRefresh} history={this.history} currentTreeNodeObject={this.state.currentTreeNodeObject} parentprops={this.props} />) :
                                    this.state.treeSelect == 2 ? (<StandardVersionList permissions={this.props.permissions} pageRefresh={pageRefresh} currentTreeNodeObject={this.state.currentTreeNodeObject} history={this.history} parentprops={this.props} />) :
                                    this.state.treeSelect == 3 ? (<StandardDomainClassList permissions={this.props.permissions} pageRefresh={pageRefresh} history={this.history} currentTreeNodeObject={this.state.currentTreeNodeObject} parentprops={this.props} />) :
                                        this.state.treeSelect == 4 ? (<StdDomainList permissions={this.props.permissions} pageRefresh={pageRefresh} history={this.history} currentTreeNodeObject={this.state.currentTreeNodeObject} parentprops={this.props} />) :
                                            this.state.treeSelect == 5 ? (<VariableList permissions={this.props.permissions} allParents={loopedParents} pageRefresh={pageRefresh} history={this.history} currentTreeNodeObject={this.state.currentTreeNodeObject} parentprops={this.props} />) :
                                        (<div></div>)}
                        </Content>   
                    </Layout>
                </ContactsWrapper>
                </Spin>
                </div>
        );
    }
}

