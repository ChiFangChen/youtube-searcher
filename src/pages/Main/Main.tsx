import React, { ChangeEvent, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { debounce } from 'ts-debounce';
import { useTranslation } from 'react-i18next';
import { Typography, CardActionArea, CardContent, CardMedia, Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import { videosSelector, readVideos, reset } from 'modules/videos';
import LanguageSwitcher from 'components/LanguageSwitcher';

import {
  AppWrapper,
  SearchBlock,
  TextField,
  List,
  ListItem,
  StyledSpinner,
  Pagination,
} from './styles';

const uiPerPage = 24;

function Main() {
  /* i18n */

  const { t } = useTranslation();

  /* main data */

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const searchRef = useRef(search);
  searchRef.current = search;

  const { isLoading, data } = useSelector(videosSelector);
  const dispatch = useDispatch();

  const paginationCount = useMemo(() => Math.ceil(data.items.length / uiPerPage), [
    data.items.length,
  ]);

  const handleReset = useCallback(() => dispatch(reset()), [dispatch]);

  const handleFetch = useCallback(() => {
    dispatch(
      readVideos({
        search: searchRef.current,
      }),
    );
  }, [dispatch, searchRef]);

  const resetAndFetch = useCallback(() => {
    // init page
    handleReset();
    setPage(1);

    handleFetch();
  }, [setPage, handleReset, handleFetch]);

  const debounceFetch = useCallback(debounce(resetAndFetch, 500), []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debounceFetch();
  };

  const goYoutube = (id: string) => () => {
    window.open(`https://www.youtube.com/watch?v=${id}`);
  };

  const onPaginationChange = (event: object, page: number) => setPage(page);

  // when clicking the last page button, load more data
  useEffect(() => {
    if (page === paginationCount && data.pageInfo.resultsPerPage) handleFetch();
  }, [page, paginationCount, data.pageInfo.resultsPerPage, handleFetch]);

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
        <Grid container spacing={3}>
          {data.items
            .slice((page - 1) * uiPerPage, page * uiPerPage)
            .map((item: any, i: number) => (
              <Grid item xs={12} sm={6} md={4} xl={3} key={`${item.id}${i}`}>
                <ListItem>
                  <CardActionArea className="action-area" onClick={goYoutube(item.id)}>
                    <CardMedia image={item.img} title={item.title} className="image" />
                    <CardContent>
                      <Typography component="h5" align="center">
                        {item.title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </ListItem>
              </Grid>
            ))}
        </Grid>

        <StyledSpinner isLoading={isLoading && !data.nextPageToken} />
      </List>

      {paginationCount && (
        <Pagination
          page={page}
          onChange={onPaginationChange}
          count={paginationCount}
          color="secondary"
        />
      )}
    </AppWrapper>
  );
}

export default Main;
