import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  IconButton,
} from '@material-ui/core';
import LanguageIcon from '@material-ui/icons/Language';

import { LangBtnWrapper } from './styles';

const LanguageSwitcher: FC = (prop) => {
  const { i18n } = useTranslation();

  const [showLangNav, setShowLangNav] = useState(false);

  const langBtnRef = React.useRef(null);

  const openLangNav = () => setShowLangNav(true);
  const closeLangNav = () => setShowLangNav(false);

  const switchLang = (lang: 'en' | 'zh-tw') => () => {
    i18n.changeLanguage(lang);
    closeLangNav();
  };

  return (
    <LangBtnWrapper {...prop}>
      <IconButton ref={langBtnRef} onClick={openLangNav}>
        <LanguageIcon fontSize="small" />
      </IconButton>

      <Popper
        open={showLangNav}
        anchorEl={langBtnRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={closeLangNav}>
                <MenuList>
                  <MenuItem onClick={switchLang('en')} selected={i18n.language === 'en'}>
                    English
                  </MenuItem>
                  <MenuItem onClick={switchLang('zh-tw')} selected={i18n.language === 'zh-tw'}>
                    繁體中文
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </LangBtnWrapper>
  );
};

export default LanguageSwitcher;
