import React, { Component } from 'react';
import Tree, { TreeNode } from '../../components/uielements/tree';
import { InputSearch } from '../../components/uielements/input';
import Spin from '../../styles/spin.style';
import { Button } from 'antd';
const Btncss={

   margin:'0 5px',
   borderRadius:3

}
const thisObj = this;
class ProgramStudy extends Component {

    constructor(props) {
        super(props);

    };





    render() {

        return (
            <div>
                <div style={{ paddingTop: "36vh", left: "27vw", position: "absolute"}}>
                        <Button style={Btncss} type="primary">Download Programs</Button>
                        <Button style={Btncss} type="primary">Execute Programs</Button>

                </div>
            </div>
        );
    }
}

export default ProgramStudy;