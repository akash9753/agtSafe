import styled from 'styled-components';
import WithDirection from '../../settings/withDirection';

const StepsStyleWrapper = styled.div`
    .steps-content {
      margin-top: 16px;
      min-height: 340px;
      text-align: left;
    }
    .steps-action {
      margin-top: 24px;
    }
    .steps-action-left {
      text-align: left;
    }
    .steps-action-right {
      text-align: right;
    }
`;

export default WithDirection(StepsStyleWrapper);