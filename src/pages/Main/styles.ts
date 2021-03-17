import styled from 'styled-components';
import MaterialTextField from '@material-ui/core/TextField';

import { MOBILE_MAX } from 'utils/variables';
import { FlexCenter } from 'utils/styles';

export const AppWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 25px;
`;

export const SearchBlock = styled.div`
  margin: 0 25px 25px;

  > div {
    width: 100%;
  }
`;

export const TextField = styled(MaterialTextField)`
  &.input {
    .Mui-focused {
      &.MuiFormLabel-root {
        color: #914191;
      }
      &.MuiInput-underline:after,
      &.MuiInput-underline:before {
        border-bottom-color: #914191;
      }
    }
    .MuiInput-underline:hover:not(.Mui-disabled):before,
    .MuiInput-underline:hover:after {
      border-bottom: 2px solid #914191;
    }
  }
`;

export const List = styled.div`
  flex: 1;
  overflow: scroll;
`;

export const ListItem = styled.a`
  ${FlexCenter}
  height: 40px;
  width: 100%;
  color: #000;
  background-color: whitesmoke;
  text-decoration: none;
  border: 1px solid #fff;
  padding: 25px;

  &:visited {
    color: #999;
  }

  &:hover {
    color: #fff;
    background-color: thistle;

    &:visited {
      background-color: #d2aed2;
    }
  }

  @media (max-width: ${MOBILE_MAX}) {
    justify-content: left;
  }
`;
