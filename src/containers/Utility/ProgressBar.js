import React from 'react';
import { Progress, Button } from 'antd';
import { getUserID, hideProgress, showProgress } from './sharedUtility';
import { VARIABLE_ALREADY_EXISTS } from 'blockly/msg/en';

var thisObj = {};

//This var we save instance instead of s
let web_socket_instance = null;

export default class DynamicProgressNotification extends React.Component {
    constructor(props) {
        super(props);
        this.state =
        {
            text:"",
            percent: 0,
            run: false,
        };

        this.socket_initialize();


        thisObj = this;
    }

    //componentWillUnmount
    componentWillUnmount()
    {

        //CLose socket on unmount
       //"Not Hitting"
        //console.log("UnMount ")
        //if (web_socket_instance && web_socket_instance.readyState === 1) {
        //    web_socket_instance.send(JSON.stringify({ action: "Close", UserID: getUserID() }))
        //    web_socket_instance.close();
        //}

    }



    static getDerivedStateFromProps(newProp, currentState)
    {
        const { progress, acknowledge, NoInitialPercent } = newProp;
        const {  run, percentage } = currentState;


        //when progress start
        if (progress === "active" && !run)
        {
            //incase socket not opening
            //showProgress();

            
            thisObj.socket_initialize();


            //Handle Open
            return {
                run: progress,
                status: progress,
                percent: NoInitialPercent ? 0 : Math.floor(Math.random() * (5 - 1 + 1) + 1).toString(),
                text:""
            }
        }


        //When Progress End
        if ((progress === "exception" || progress === "success") && run)
        {

            //web_socket_instance.close();
            hideProgress();
            return {
                run: false, percentage: 0, status: progress,
            }
        }

        /*Progress*/
        return null;

    }

    socket_initialize = () =>
    {
        const { percentage,run } = this.state;
        const {  progress,acknowledge} = this.props;

        //If Readystate = 0 means Socket has been created. The connection is not yet open.
        //If Readystate = 1 means The connection is open and ready to communicate.
        //If Readystate = 2 means The connection is in the process of closing.
        //If Readystate = 3 means The connection is closed or couldn't be opened.

        if (!web_socket_instance || web_socket_instance.readyState == 3) {
            //Get IP from Session
            //IP from Appconfiguration
            //Socket initializtion done here
            var websocketIP = sessionStorage.getItem("websocketIP");
            web_socket_instance = new WebSocket(websocketIP);

            //On Open
            web_socket_instance.onopen = () => {
                //when Open 
                hideProgress();
                sessionStorage.setItem("web_socket_instance_state", JSON.stringify(web_socket_instance.readyState));
                if (typeof acknowledge === "function") {
                    acknowledge(web_socket_instance.readyState);
                }
                //setInterval(function test()
                //{
                //    web_socket_instance.send(JSON.stringify({ action: "Pinging every 1sec for to keep alive", UserID: getUserID() }));
                //}, 1000);
                

               
            };

            //On Message receiving
            web_socket_instance.onmessage = function (e) {
                try {

                    let data = JSON.parse(e.data);
                    hideProgress();

                    if (data.Text === "Handshaked") {
                        //console.log("Now able to send or receive");

                        web_socket_instance.send(JSON.stringify({ action: "Store", UserID: getUserID() }));
                    }
                    else {
                        thisObj.setState({
                            percent: data.Percentage, text: data.Text
                        });
                    }

                    data.Percentage > 0 && hideProgress();
                    return;
                }
                catch (e) {
                    //console.log(e);
                }
            };

            //On closing
            web_socket_instance.onclose = function (e) {
                if ((progress === "exception" || progress === "success") && run) {
                    //web_socket_instance.close();

                    hideProgress();

                    sessionStorage.removeItem("web_socket_instance_state");

                    thisObj.setState({
                        run: false, percentage: 0, status: progress,
                    });
                }
                new Promise((res, rej) => {
                    thisObj.socket_initialize();

                    res();
                }).then(() => {
                    if (web_socket_instance && web_socket_instance.readyState === 1) {
                        web_socket_instance.send(web_socket_instance.send(JSON.stringify({ action: "Store", UserID: getUserID() })));
                    }
                })
                // let UserId = getUserID();
                /* instance.send(JSON.stringify({ action: "Close", UserID: UserId }));*/

            }

            //Handle Error
            web_socket_instance.onerror = function (event) {
                if (percentage === "0") {
                    showProgress();
                }

                //console.log("WebSocket error observed:", event);
            };

        } else if (!web_socket_instance || web_socket_instance.readyState == 1) {
            hideProgress();
        } 
        
     
    }
    componentDidUpdate()
    {
        if (web_socket_instance.readyState === 1)
        {
            //store current ID To Session in Program.cs
            web_socket_instance.send(JSON.stringify({ action: "Store", UserID: getUserID() }));

        }
    }

    render() {
        const { percent, status,run,text } = this.state;
        return (
            <div
                className="dynamicprogressbar_div"
                style={{
                    display: run ? "block" : "none"
                }}
            >
                {
                    
                    <>
                        <Progress
                        type="circle"
                        percent={percent}
                        className="dynamicprogressbar"
                        status={percent === "-1" ? "exception" : status}
                        strokeColor={{ '0%': '#108ee9', '100%': '#87d068', }}
                        width={80}
                        />
                        {text != "" && text && <p className="dynamic_progressbar">{text}</p>}
                    </>
                }

            </div>
        );
    }
}

