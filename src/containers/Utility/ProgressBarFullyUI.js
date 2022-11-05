import React from 'react';
import { Progress, Button } from 'antd';
import { getUserID, hideProgress, showProgress } from './sharedUtility';

var thisObj = {};

//This var we save instance instead of s
let web_socket_instance = null;

export default class ProgressBarFullyUI extends React.Component {
    constructor(props) {
        super(props);
        this.state =
        {
            text: "",
            percent: 0,
            progress:false,
        };

        thisObj = this;
    }



    render() {
        const { percent, progress, status } = this.props;

        return (<div
                className="dynamicprogressbar_div"
                style={{
                    display: progress ? "block" : "none"
                }}
            >
                    <>
                        <Progress
                            type="circle"
                            percent={percent}
                            className="dynamicprogressbar"
                            status={status}
                            strokeColor={{ '0%': '#108ee9', '100%': '#87d068', }}
                            width={80}
                />
                    </>
            </div>
        );
    }
}

