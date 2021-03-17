import React, { ChangeEvent, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { debounce } from 'ts-debounce';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';

import { per_page } from 'utils/variables';
import useGetVideos from 'hooks/useGetVideos';
import LanguageSwitcher from 'components/LanguageSwitcher';
import Spinner from 'components/Spinner';

import { AppWrapper, SearchBlock, TextField, List, ListItem } from './styles';

function Main() {
  /* i18n */

  const { t } = useTranslation();

  /* main data */

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { isLoading, isDone, data, fetch } = useGetVideos({
    search,
    page,
    pageToken: undefined,
  });

  console.log(data);

  const debounceFetch = useCallback(debounce(fetch, 500), []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    // init page
    setPage(1);
    debounceFetch();
  };

  useEffect(() => {
    if (isDone) {
      setPage((p) => p + 1);
    }
  }, [isDone]);

  return (
    <AppWrapper>
      <Typography align="center" variant="h3" component="h1">
        {t('heading')}
      </Typography>

      <LanguageSwitcher />

      <SearchBlock>
        <TextField
          label={t('label')}
          value={search}
          onChange={handleSearchChange}
          className="input"
        />
      </SearchBlock>

      <List>
        {/* {repos.map((repo, i) => (
          <ListItem key={`${repo.id}${i}`} href={repo.svn_url} target="_blank" rel="noreferrer">
            {repo.full_name}
          </ListItem>
        ))} */}

        <Spinner isLoading={isLoading} />
      </List>
    </AppWrapper>
  );
}

export default Main;
