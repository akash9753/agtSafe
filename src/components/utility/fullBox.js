import React from 'react';
import BoxTitleWrapper from './boxTitle';
import { BoxWrapper } from './fullBox.style';

export default props => (
    <BoxWrapper className="isoBoxWrapper" style={props.style} >
        <BoxTitleWrapper title={props.title} subtitle={props.subtitle} />
    {props.children}
  </BoxWrapper>
);
