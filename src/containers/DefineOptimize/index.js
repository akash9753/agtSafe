import React, { Component } from 'react';
import Define from './tree.js'
import DefineContextProvider from './context';
import { DefineContext } from './context';
import { getStudyID, getStudyDetails} from '../Utility/sharedUtility.js';


class DefineTree extends Component
{
    static contextType = DefineContext;

    constructor(props)
    {
        super(props);
    }


    render()
    {
        const locationProps = this.props.location.state;
        let { history, projectStudyLockStatus, wrkFlowStatus, projectInActive } = locationProps;
        let studyID = getStudyID();
        let study = getStudyDetails();

         return (<DefineContextProvider
             history={history}
             StudyID={studyID}
             study={study}
             isStudyLock={study.locked}
             defineActivityWorkflowStatus={wrkFlowStatus}
             projectStudyLockStatus={projectStudyLockStatus}
             projectInActive={projectInActive}
             wrkFlowStatus={wrkFlowStatus}
                >
                     <Define {...locationProps} {...this.props} />
                </DefineContextProvider>
        );
    }
}

export default DefineTree;

