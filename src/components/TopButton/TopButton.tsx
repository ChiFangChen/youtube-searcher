import React, { FC } from 'react';
import { Fab, Zoom } from '@material-ui/core';
import NavigationIcon from '@material-ui/icons/Navigation';

import { BackToTopButtonType } from './types';
import { FabWrapper } from './styles';

const TopButton: FC<BackToTopButtonType> = ({ show = true, onClick, ...props }) => {
  return (
    <Zoom in={show} unmountOnExit>
      <FabWrapper>
        <Fab size="small" color="secondary" onClick={onClick}>
          <NavigationIcon />
        </Fab>
      </FabWrapper>
    </Zoom>
  );
};

export default TopButton;
