import styled from 'styled-components';
import { palette } from 'styled-theme';

const LayoutContentStyle = styled.div`
  width: 100%;
  padding: 5px;
  background-color: #ffffff;
  border: 1px solid ${palette('border', 0)};
  height: 100%;
  border-radius: 10px;
`;

export default LayoutContentStyle;
