import styled from 'styled-components';

import { FlexCenter } from 'utils/styles';

import { SpinnerType } from './types';

export const CircularProgressWrapper = styled.div<SpinnerType>`
  ${FlexCenter}
  ${({ wrapperHeight }) => wrapperHeight && `height: ${wrapperHeight};`}

  .circular {
    margin: 20px 0;
    color: thistle;
  }
`;
