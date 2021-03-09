import React, { FC } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import { SpinnerType } from './types';
import { CircularProgressWrapper } from './styles';

const Spinner: FC<SpinnerType> = ({ isLoading = true, ...props }) => {
  return isLoading ? (
    <CircularProgressWrapper {...props}>
      <CircularProgress disableShrink className="circular" />
    </CircularProgressWrapper>
  ) : null;
};

export default Spinner;
