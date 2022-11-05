import React, { Component } from 'react';
import { Breadcrumb } from "antd";
import ReactTable from '../Utility/reactTable';
//ButtonWithToolTip Importing
import ButtonWithToolTip from '../Tooltip/ButtonWithToolTip';


export default class ProgramList extends Component {
    constructor(props) {
        super(props);


    }

   

    render() {

        const editCell = <div>
            <ButtonWithToolTip
                tooltip="Edit"
                shape="circle"
                classname="fas fa-pen"
                size="small"
                style={{ marginRight :"5px"}} />
            <ButtonWithToolTip
                tooltip="Download"
                shape="circle"
                classname="fas fa-download"
                size="small"
                style={{ marginRight: "5px" }} />
            <ButtonWithToolTip
                tooltip="Execute"
                shape="circle"
                classname="fas fa-code"
                size="small"
                style={{ marginRight: "5px" }} />
        </div>

        const columns = [{
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 100
        }, {
            title: 'Program',
            dataIndex: 'program',
            key: 'program',
            width: 100
            }, {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                width: 100
            }
        ];

        const data = [{
            key: '1',
            program: 'DM',
            action: editCell,
            status: "Under Review"
            
        }, {
            key: '2',
            program: 'AE',
            action: editCell,
            status: "Accepted"
            
        }, {
            key: '3',
            program: 'VS',
            action: editCell,
            status: "Accepted"
            
        }, {
            key: '4',
            program: 'CO',
            action: editCell,
            status: "Under Review"
           
        }];

        

        return (
            <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <i className="ion-clipboard" />
                        <span> Program</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>List </Breadcrumb.Item>
                </Breadcrumb>
                <ReactTable
                    size="small"
                    pagination={false}
                    columns={columns}
                    dataSource={data}
                    showingEntries= "4"
                />
            </div>
        );

    }
}