import React, { ChangeEvent, useState, useCallback, useRef, useEffect } from 'react';
import { debounce } from 'ts-debounce';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

import useGetRepos from 'hooks/useGetRepos';
import LanguageSwitcher from 'components/LanguageSwitcher';
import Spinner from 'components/Spinner';
import TopButton from 'components/TopButton';

import { ReposResponse } from './types';
import { AppWrapper, SearchBlock, TextField, RepoList, RepoListItem } from './styles';

const per_page = 100;

function Main() {
  /* i18n */

  const { t } = useTranslation();

  /* main data */

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const {
    isLoading,
    isDone,
    data: { items: repos, total_count: repoCount } = { items: [], total_count: 0 },
    fetch,
  } = useGetRepos<ReposResponse>({
    search,
    page,
    per_page,
  });

  const debounceFetch = useCallback(debounce(fetch, 500), []);

  const [accumulatedRepos, setAccumulatedRepos] = useState<ReposResponse['items']>([]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    // init page
    setPage(1);
    debounceFetch();
  };

  useEffect(() => {
    if (isDone) {
      if (page === 1) {
        setAccumulatedRepos(repos);
        repoListRef.current?.scrollTo(0, 0);
      } else {
        setAccumulatedRepos((r) => [...r, ...repos]);
      }
      setPage(page + 1);
    }
  }, [isDone]);

  /* scroll */

  const [showTopBtn, setShowTopBtn] = useState(false);

  const repoListRef = useRef<HTMLDivElement>(null);

  const onTopBottomClick = (): void =>
    repoListRef.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });

  const onListScroll = useCallback(() => {
    if (!repoListRef.current) return;

    // clientHeight + scrollTop = scrollHeight
    const { clientHeight, scrollTop, scrollHeight } = repoListRef.current;

    if (
      !isLoading &&
      repoCount > per_page * (page - 1) &&
      scrollTop + clientHeight + 1 >= scrollHeight
    ) {
      fetch();
    }

    if (scrollTop > 100) setShowTopBtn(true);
    else setShowTopBtn(false);
  }, [repoListRef, isLoading, page, repoCount, fetch]);

  useEffect(() => {
    const repoList = repoListRef.current;
    if (repoList) repoList.addEventListener('scroll', onListScroll);
    return () => {
      if (repoList) repoList.removeEventListener('scroll', onListScroll);
    };
  }, [onListScroll]);

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

      <RepoList ref={repoListRef}>
        {accumulatedRepos.map((repo, i) => (
          <RepoListItem key={`${repo.id}${i}`} href={repo.svn_url} target="_blank" rel="noreferrer">
            {repo.full_name}
          </RepoListItem>
        ))}

        <Spinner isLoading={isLoading} />

        <TopButton show={showTopBtn} onClick={onTopBottomClick} />
      </RepoList>
    </AppWrapper>
  );
}

export default Main;
