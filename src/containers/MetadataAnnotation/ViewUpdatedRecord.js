import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import 'handsontable/dist/handsontable.full.css';
import { HotTable } from '@handsontable/react';
import { validJSON } from '../Utility/sharedUtility'; 

export default class UpdatedRecord extends Component {
    constructor(props) {
        super(props);

        this.state = {};

    }

 
    render()
    {
        const { Show, Row, Column, DataType } = this.props;

        //for not to affect the original data
        let col = JSON.stringify(DataType);
        let cl = validJSON(col);
        //end

        return (

            <div>
                <Modal
                    visible = {Show}
                    maskClosable={false}
                    width="100%"
                    title={"Updated Record"}
                    style={{ top: 20, padding: 10 }}
                    onCancel={this.props.Cancel}

                    footer={[
                            <Button key="back"
                                name="PopupCancel"
                                className='ant-btn sc-ifAKCX fcfmNQ ant-btn-danger'
                                style={{ float: 'left' }}
                            onClick={this.props.Cancel}>Cancel</Button>,
                             <Button key="submit"
                                 disabled={Row.length === 0}
                                name="PopupSave"
                                className='ant-btn sc-ifAKCX fcfmNQ ant-btn-primary saveBtn' onClick={this.props.Ok}>
                                Ok
                                </Button>
                        ,
                    ]}
                    
                >
                    <HotTable
                        id="MetaDataAnnotation_Table"
                        className={"MetaDataAnnotation_Table_TD"}
                        height={Row.length > 0 ? "calc(100vh - 166px)" : "0px"}
                        licenseKey="non-commercial-and-evaluation"
                        viewportRowRenderingOffsetnumber={10}
                        settings=
                        {
                            {
                                wordWrap: true,
                                stretchH: 'all',
                                data: Row,
                                colHeaders: ["Record Status", ...Column],

                                columns: [
                                    {
                                        data: "RecordStatus",
                                        readOnly: true
                                    }, ...cl.map(co => { co.readOnly = true; return co })
                                ],
                                editable: false,
                                readOnly: true,
                                filters: true,
                                dropdownMenu: ['filter_by_condition', 'filter_by_value', 'filter_action_bar'],
                            }
                        }
                    />
                    <div id="MetaDataNoFilter" style={{ display: Row.length > 0 ? "none" : "block" }}>No data available</div>

                </Modal>
            </div>
        );
    }
}

