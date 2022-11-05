import React, { Component } from 'react';
import { Col, Button, Row, Select, Checkbox, Form, Steps, message, Modal, Icon, Spin } from 'antd';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import { rowStyle } from '../../styles/JsStyles/CommonStyles';
import ReactTable from '../Utility/reactTable';
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';
import '../DefineBot/DefineBot.css'

const antIcon = <Icon type="loading" style={{ fontSize: 24, color: '#17242c' }} spin />;
var thisObj;

class TablePop extends Component {

    constructor(props) {
        super(props);
        
        this.state = props

        thisObj = this;

    }

    //Get the required field to form the pop up
    componentWillReceiveProps(prop) {
        thisObj.setState(prop);
    }
    
    render() {

        const { visible, column, row, loading, exportAction } = this.state;
        return (<Modal
            visible={visible}
            title="Standard Variable Import Error"
            style={{ top:"20px"}}
            width={"98%"}
            cancelType='danger'
            onCancel={this.props.handleCancel}
            onOk={this.save}
            maskClosable={false}
            footer={[
                <Button key="Cancel" className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger' style={{ float: 'left' }} onClick={this.props.handleCancel}>
                    Cancel
                    </Button>,

                <div style={{ height: "32px" }}></div>
            ]}
        >
            <Spin indicator={antIcon} spinning={false}>
                <LayoutContentWrapper id="defineBotTable" style={{ height: "calc(100vh - 183px)", width: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                        {
                            (visible) ?
                                column.length > 0 && (

                                    <div style={{ height: "100%" }}>

                                        <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                                            <ReactTable
                                                showingErrors={row.length}
                                                exportAction={row.length == 0 ? null : exportAction}
                                                size="small"
                                                pagination={false}
                                                columns={column}
                                                dataSource={row}
                                                filterDropdownVisible={false}
                                                scroll={{ x: 1000}}

                                            />
                                        </div>
                                    </div>)


                                : ""
                        }
                    </div>
                </LayoutContentWrapper>
            </Spin>
        </Modal>

    )
         }

}

const WrappedApp = Form.create()(TablePop);
export default WrappedApp;
