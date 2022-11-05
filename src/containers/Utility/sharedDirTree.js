import React, { Component } from 'react';
import { Tooltip, Col, Row, Layout, Modal, Spin, Icon } from 'antd';
import Tree, { TreeNode } from '../../components/uielements/tree';
import { InputSearch } from '../../components/uielements/input';
import Button from '../../components/uielements/button';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import { CallServerPost, errorModal, successModal } from '../Utility/sharedUtility';

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
const dataList = [{ "TabName": null, "Children": [{ "TabName": null, "Children": [{ "TabName": null, "Children": [{ "TabName": null, "Children": [{ "TabName": null, "Children": null, "Title": "application-form.pdf", "Key": "D:\\anda000073\\0000\\m1\\us\\application-form.pdf", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }, { "TabName": null, "Children": null, "Title": "cover-letter.pdf", "Key": "D:\\anda000073\\0000\\m1\\us\\cover-letter.pdf", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }], "Title": "us", "Key": "D:\\anda000073\\0000\\m1\\us", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }], "Title": "m1", "Key": "D:\\anda000073\\0000\\m1", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }, { "TabName": null, "Children": [{ "TabName": null, "Children": [{ "TabName": null, "Children": null, "Title": "drug-substance-adpharmatestsubstance.pdf", "Key": "D:\\anda000073\\0000\\m2\\23-qos\\drug-substance-adpharmatestsubstance.pdf", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }, { "TabName": null, "Children": null, "Title": "introduction-introductiontosummary.pdf", "Key": "D:\\anda000073\\0000\\m2\\23-qos\\introduction-introductiontosummary.pdf", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }, { "TabName": null, "Children": null, "Title": "introduction-nomenclature.pdf", "Key": "D:\\anda000073\\0000\\m2\\23-qos\\introduction-nomenclature.pdf", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }, { "TabName": null, "Children": null, "Title": "introduction-pharmaceuticaldevelopments.pdf", "Key": "D:\\anda000073\\0000\\m2\\23-qos\\introduction-pharmaceuticaldevelopments.pdf", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }, { "TabName": null, "Children": null, "Title": "introduction-qualityoverallsummary.pdf", "Key": "D:\\anda000073\\0000\\m2\\23-qos\\introduction-qualityoverallsummary.pdf", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }], "Title": "23-qos", "Key": "D:\\anda000073\\0000\\m2\\23-qos", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }], "Title": "m2", "Key": "D:\\anda000073\\0000\\m2", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }, { "TabName": null, "Children": [{ "TabName": null, "Children": [{ "TabName": null, "Children": [{ "TabName": null, "Children": [{ "TabName": null, "Children": [{ "TabName": null, "Children": null, "Title": "nomenclature.pdf", "Key": "D:\\anda000073\\0000\\m3\\32-body-data\\32s-drug-sub\\ad-pharma-test-substance-ad-pharma-usa-llc\\32s1-gen-info\\nomenclature.pdf", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }], "Title": "32s1-gen-info", "Key": "D:\\anda000073\\0000\\m3\\32-body-data\\32s-drug-sub\\ad-pharma-test-substance-ad-pharma-usa-llc\\32s1-gen-info", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }], "Title": "ad-pharma-test-substance-ad-pharma-usa-llc", "Key": "D:\\anda000073\\0000\\m3\\32-body-data\\32s-drug-sub\\ad-pharma-test-substance-ad-pharma-usa-llc", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }], "Title": "32s-drug-sub", "Key": "D:\\anda000073\\0000\\m3\\32-body-data\\32s-drug-sub", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }], "Title": "32-body-data", "Key": "D:\\anda000073\\0000\\m3\\32-body-data", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }], "Title": "m3", "Key": "D:\\anda000073\\0000\\m3", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }, { "TabName": null, "Children": [{ "TabName": null, "Children": [{ "TabName": null, "Children": [{ "TabName": null, "Children": [{ "TabName": null, "Children": [{ "TabName": null, "Children": [{ "TabName": null, "Children": [{ "TabName": null, "Children": null, "Title": "study-report.pdf", "Key": "D:\\anda000073\\0000\\m5\\53-clin-stud-rep\\531-rep-biopharm-stud\\5311-ba-stud-rep\\123\\crf\\123\\study-report.pdf", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }], "Title": "123", "Key": "D:\\anda000073\\0000\\m5\\53-clin-stud-rep\\531-rep-biopharm-stud\\5311-ba-stud-rep\\123\\crf\\123", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }], "Title": "crf", "Key": "D:\\anda000073\\0000\\m5\\53-clin-stud-rep\\531-rep-biopharm-stud\\5311-ba-stud-rep\\123\\crf", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }, { "TabName": null, "Children": null, "Title": "study-report-regionalinformation.pdf", "Key": "D:\\anda000073\\0000\\m5\\53-clin-stud-rep\\531-rep-biopharm-stud\\5311-ba-stud-rep\\123\\study-report-regionalinformation.pdf", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }, { "TabName": null, "Children": null, "Title": "study-report-stm0001.pdf", "Key": "D:\\anda000073\\0000\\m5\\53-clin-stud-rep\\531-rep-biopharm-stud\\5311-ba-stud-rep\\123\\study-report-stm0001.pdf", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }], "Title": "123", "Key": "D:\\anda000073\\0000\\m5\\53-clin-stud-rep\\531-rep-biopharm-stud\\5311-ba-stud-rep\\123", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }], "Title": "5311-ba-stud-rep", "Key": "D:\\anda000073\\0000\\m5\\53-clin-stud-rep\\531-rep-biopharm-stud\\5311-ba-stud-rep", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }], "Title": "531-rep-biopharm-stud", "Key": "D:\\anda000073\\0000\\m5\\53-clin-stud-rep\\531-rep-biopharm-stud", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }], "Title": "53-clin-stud-rep", "Key": "D:\\anda000073\\0000\\m5\\53-clin-stud-rep", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }], "Title": "m5", "Key": "D:\\anda000073\\0000\\m5", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }, { "TabName": null, "Children": null, "Title": "cover-letter.pdf", "Key": "D:\\anda000073\\0000\\cover-letter.pdf", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }], "Title": "0000", "Key": "D:\\anda000073\\0000", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }], "Title": "D:\\anda000073", "Key": "D:", "Collapsed": false, "Selected": false, "LeftClickAction": null, "Id": 0 }];

//const dataList = [];
var protocoldocdataList = [];
const childDataList = [];
const generateList = [];
const getParentKey = [];


export default class SharedDirTree extends Component {

    constructor(props) {
        super(props);

        this.state = {
            expandedKeys: [],
            searchValue: '',
            loading: false,
            autoExpandParent: true,
        };
        

    }

    generateList = data => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const key = node.Key;
            childDataList.push({ key, title: key });
            if (node.children) {
                generateList(node.children, node.key);
            }
        }
    };


    getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.Children) {
                if (node.Children.some(item => item.Title === key)) {
                    parentKey = node.Key;
                } else if (getParentKey(key, node.Children)) {
                    parentKey = getParentKey(key, node.Children);
                }
            }
        }
        return parentKey;
    };




    onExpand = expandedKeys => {

        this.setState({
            expandedKeys,
            // loading: true,
            autoExpandParent: false,
        });

    };

    onChange = e => {
        const value = e.target.value;
        const expandedKeys = (childDataList)
            .map(item => {
                if (item.key.indexOf(value) > -1) {
                    return getParentKey(item.key, dataList);
                }
                return null;
            })
            .filter((item, i, self) => item && self.indexOf(item) === i);
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    };

    onTreeNodeSelect = (selectedKeys, e) => {
        //console.log(e.node.props);
        const selectedNode = e.node.props;
        this.props.callback(selectedNode);
    };
    componentWillReceiveProps(nextProps) {
        if (this.props.visible && !nextProps.visible) {

            //console.log("File Modal Closed");
        } else if (!this.props.visible && nextProps.visible) {

            //console.log("File Modal Opened");
            const thisObj = this;

        }
    }

    render() {
        const { searchValue, expandedKeys, autoExpandParent } = this.state;

        const loop = data =>
            data.map(item => {
                const index = item.Key.search(searchValue);
                const beforeStr = item.Key.substr(0, index);
                const afterStr = item.Key.substr(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <span style={{ color: '#f50' }}>{searchValue}</span>
                            {afterStr}
                        </span>
                    ) : (
                            <span>{item.Title}</span>
                        );
                if (item.Children) {
                    return (
                        <TreeNode selectable={false} key={item.Key} title={item.Title}>
                            {loop(item.Children)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={item.Key} title={item.Title} />;

            });

        return (

            <Modal
                visible={this.props.visible}
                onCancel={this.props.handleCancel}
                maskClosable={false}
                title={"Select a File"}
                footer={[
                    <Button key="back" size="large" onClick={this.props.handleCancel}>Cancel</Button>,
                ]}
            >

                <LayoutWrapper>

                    <div>

                        <Spin indicator={antIcon} spinning={this.state.loading} size="small">
                            <Tree
                                onExpand={this.onExpand}
                                expandedKeys={expandedKeys}
                                autoExpandParent={autoExpandParent}
                                onSelect={this.onTreeNodeSelect}
                            >
                                {loop(dataList)}
                            </Tree>

                        </Spin>
                    </div>

                </LayoutWrapper>
            </Modal>

        );
    }
}

