
import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Progress, Button } from 'antd';

const ButtonGroup = Button.Group;
var thisObj = "";
let Interval = "";

var percent = Math.floor(Math.random() * (+10 - +1)) + +1;
export default class ProgressBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            percent: 0,
            loading: props.loader
        };
        thisObj = this;


        Interval = setInterval(function () {
            percent = thisObj.state.percent ;
            percent = percent + Math.floor(Math.random() * (+10 - +1)) + +1;
            if (percent >= 100) {
                percent  = 99 ;
            }
            thisObj.setState({ percent: percent})
        }, 2000);
    }
  
    static getDerivedStateFromProps(props)
    {
        if (!props.loader && thisObj.state.percent < 100 && thisObj.state.percent != 0) {
            clearInterval(Interval);
            thisObj.setState({ percent: 100 });
           
        } else if (!props.loader && thisObj.state.percent == 100) {
            Interval = setInterval(function () {
                thisObj.setState({ loading: false, percent: 0 });
            }, 1000);

        }
    }

    shouldComponentUpdate() {
        if(!thisObj.props.loader && thisObj.state.percent == 0) {
            clearInterval(Interval);
            return false;
        }
        return true;

    }

    render() {
        const { loading, percent} = this.state;
        const { loader } = this.props;
        return (
            <div style={{ position: "fixed", width: "100%", marginTop: "-103px", height: "85%", pointerEvents: "none !important", marginLeft: "-15px", background: "rgba(255, 255, 255, 0.7)", zIndex: 9999999, display: loading ? "block" : "none" }}>
                <Progress strokeColor={{
                    '0%': 'rgb(50,51,50)',
                    '100%': '#87d068',
                }} 
               style={{ position: 'absolute', width: '50%', margin: 'auto', fontSize: '14px', top: '50%', left: '29%' }} status="active" percent={loader ? percent : 100} />
            </div>
        );
    }
}

