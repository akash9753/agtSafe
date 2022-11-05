import React, { Component } from 'react';
import { Tooltip, Col, Row, Layout, Input, Icon, Spin } from 'antd';
import Tree, { TreeNode } from '../../components/uielements/tree';
import { InputSearch } from '../../components/uielements/input';
import Button from '../../components/uielements/button';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { CallServerPost, errorModal, successModal } from '../Utility/sharedUtility';

var thisObj;
const Search = Input.Search;
const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;

const dataList = [];
var tempData = [];
export default class StandardTree extends Component {

    constructor(props) {
        super(props);
        this.state = {         
            expandedKeys: ["Data Standards-DataStandards"],
            searchValue: '',
            autoExpandParent: true,
            treeData: [],
            reLoad:false,
        };
        thisObj = this; 

        CallServerPost('CDISCDataStandard/GetStandardMetaData')
            .then(
            function (response) {
                if(response.value != null){
                    //append here if new standards added
                   // if (thisObj.props.isCustom === 0) {
                        response.value[0].children = response.value[0].children.filter(x => x.title !== null);
                        thisObj.setState({ treeData: response.value});
                    //} else {
                    //    response.value[0].children = response.value[0].children.filter(x => x.title != "SDTM-IG" && x.title != "ADAM" && x.title != "SEND-IG" && x.title !== "OMOP CDM");
                    //    thisObj.setState({ treeData: response.value});
                    //}

                    thisObj.props.renderCallback();   
                }
            });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.nextProp) {           
            CallServerPost('CDISCDataStandard/GetStandardMetaData')
                .then(
                function (response) {
                    if (response.value != null) {
                        //append here if new standards added
                        //if (thisObj.props.isCustom === 0) {
                            response.value[0].children = response.value[0].children.filter(x => x.title !== null);                             
                            thisObj.setState({ treeData: response.value});
                        //} else {
                        //    response.value[0].children = response.value[0].children.filter(x => x.title != "SDTM-IG" && x.title != "ADAM" && x.title !== "SEND-IG" && x.title !== "OMOP CDM");
                        //    thisObj.setState({ treeData: response.value});
                        //}
                        
                        thisObj.props.renderCallback();   
                    }
                });
        }
    }

    onExpand = expandedKeys => {

        this.setState({
            expandedKeys,
            // loading: true,
            autoExpandParent: false,
        });

    };
   
    onChange = (e) => {
        const value = e.target.value;
        tempData = [];
        if (value != ""){
            this.searchData(thisObj.state.treeData, null, value, tempData)
        }
        const expandedKeys = (value != null && value.length > 0) ? tempData.filter((item, i, self) => item && self.indexOf(item) === i) : ["Data Standards-DataStandards"];
        this.setState({
            expandedKeys,
            searchValue: e.target.value,
            autoExpandParent: true,
        });
        //console.log(expandedKeys);
    }

    searchData = (data, parent, searchValue, tempData) => {
         data.map((item) => {
             if (item.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
                 if (parent != null) {
                     tempData.push(parent);
                 }
                if (item.children) {
                    this.searchData(item.children, (item.key == "DataStandards") ? item.key : item.title + "-" + item.key, searchValue, tempData);
                }
            }
            else {
                if (item.children) {
                    this.searchData(item.children, (item.key == "DataStandards") ? item.key : item.title + "-" + item.key, searchValue, tempData);
                }
            }
        })
    }

    renderTreeNodes = (data, parentKey, grantParents) =>
    {
        return data.map((item) => {
            const index = item.title.toLowerCase().indexOf(thisObj.state.searchValue.toLowerCase());
            const beforeStr = item.title.substr(0, index);
            const afterStr = item.title.substr(index + thisObj.state.searchValue.length);

            const title = (index > -1 && thisObj.state.searchValue != "") ? (
                    <span style={{ color: '#f50' }}>{item.title}</span>
            ) : <span>{item.title}</span>;

            if (item.children) {

                let allParent = JSON.stringify(grantParents);
                let temp = JSON.parse(allParent);
                if (item.source != null) {
                    temp[item.source] = item.key;
                } else {
                    temp["root"] = item.key;
                }

           return (
               <TreeNode parents={grantParents} title={title} parentKey={parentKey} key={item.title+"-"+item.key} type={(item.source == null) ? item.key : item.source} dataRef={item}>
                {
                
                       this.renderTreeNodes(item.children, item.key, temp)
            }
          </TreeNode>
        );
      }

            return <TreeNode parents={grantParents} parentKey={parentKey} title={title} key={item.title + "-" + item.key} type={(item.source == null) ? item.key : item.source} dataRef={item} />;
      });
    }

    clearSearch = () => {
        this.setState({
            expandedKeys: ["Data Standards-DataStandards"],
            searchValue: "",
            autoExpandParent: true,
        });
    }

render() {
        const { searchValue, expandedKeys, autoExpandParent ,loading} = this.state;

        return (
            <div>
                <span id="standardListSearch">
                    {
                        searchValue !== "" ?
                            < Input tabIndex="0" name="StandardSearch" suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)', float: 'right' }} />} suffix={<Icon onClick={this.clearSearch} type="close" style={{ color: 'rgba(0,0,0,.25)', float: 'right' }} />} style={{ width: 'calc(100% - 52px)', margin: '0px 10px', minWidth: '100px' }} value={searchValue} onChange={this.onChange} placeholder="Search" />
                            :
                            < Input tabIndex="0" name="StandardSearch" suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)', float: 'right' }} />} style={{ width: 'calc(100% - 52px)', margin: '0px 10px', minWidth: '100px' }} value={searchValue} onChange={this.onChange} placeholder="Search" />
                    }
                </span>
                 <div style={{ height: "calc(100vh - 188px)", overflow: "auto", marginTop: 10, border: "1px solid #ddd"}}>
                    {this.state.treeData.length ?
                        <Tree
                            onExpand={this.onExpand}
                            expandedKeys={expandedKeys}
                            autoExpandParent={autoExpandParent}
                            onSelect={this.props.onTreeNodeSelect}

                        >
                            {
                                this.renderTreeNodes(this.state.treeData, null, {})
                                

                            }
                            </Tree>
                            : <div style={{display:"flex",height:"100%",width:"100%"}}>
                                <Spin indicator={antIcon} style={{margin:"auto"}} size="small"  spinning={true}></Spin>
                              </div>
                            }
                        </div>
                 </div>
        );  
    }
}