import React, { Component } from 'react';
import Button from '../../components/uielements/button';
import Input from '../../components/uielements/input';
import { Icon } from 'antd';
import DirectoryTreeView from '../Study/directoryTreeview';
export default class FileFolderSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            folderModalVisible: false,
            filePath : ""
        };
    }
    setFile = (file) => {
        const attributeName = this.props.attributeName;
        let data = {};
        data[attributeName] = file.eventKey;
        this.props.setFieldValue(data);
        this.handleCancel();
    }
    showFileDialog = () => {
        this.setState({ folderModalVisible: true });
    }
    handleCancel = () => {
        this.setState({ folderModalVisible: false });
    }
    render() {
        const uploadBtn = <a onClick={this.showFileDialog}><Icon type="file-pdf" /></a>;
        return (
            <div>
                
                <Input size="small" type="text" value={this.props.value} id={this.props.attributeName} addonAfter={uploadBtn} />
            </div>
        )
    }
}