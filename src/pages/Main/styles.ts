import styled from 'styled-components';
import { TextField as MaterialTextField, Card } from '@material-ui/core';
import MaterialPagination from '@material-ui/lab/Pagination';

import { SM_MIN, MD_MIN, LG_MIN } from 'utils/variables';
import Spinner from 'components/Spinner';

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
  margin-top: 25px;
  flex: 1;
  overflow: scroll;
`;

export const ListItem = styled(Card)`
  color: #000;
  background-color: whitesmoke;
  text-decoration: none;

  .action-area {
    padding: 25px;
  }

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

  .image {
    height: 300px;

    @media (min-width: ${SM_MIN}) {
      height: 200px;
    }

    @media (min-width: ${MD_MIN}) {
      height: 180px;
    }

    @media (min-width: ${LG_MIN}) {
      height: 300px;
    }
  }
`;

export const StyledSpinner = styled(Spinner)`
  margin-top: 12px;
`;

export const Pagination = styled(MaterialPagination)`
  display: flex;
  justify-content: center;
  margin: 30px 0;
`;
