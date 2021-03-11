import React, { ChangeEvent, useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'ts-debounce';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

import LanguageSwitcher from 'components/LanguageSwitcher';
import Spinner from 'components/Spinner';
import TopButton from 'components/TopButton';

import { ReposResponse } from './types';
import { AppWrapper, SearchBlock, TextField, RepoList, RepoListItem } from './styles';

const per_page = 100;

function Main() {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const [search, setSearch] = useState('');
  const searchRef = useRef(search);
  searchRef.current = search;

  const [repos, setRepos] = useState<ReposResponse>([]);
  const reposRef = useRef(repos);
  reposRef.current = repos;

  const [repoCount, setRepoCount] = useState(repos.length);

  const [page, setPage] = useState(1);
  const pageRef = useRef(page);
  pageRef.current = page;

  const [showTopBtn, setShowTopBtn] = useState(false);

  const repoListRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    // init page
    setPage(1);
    debounceFetch();
  };

  const fetch: VoidFunction = () => {
    setIsLoading(true);
    const currentPage = pageRef.current;
    const queryString = `q=${encodeURIComponent(
      searchRef.current,
    )}&page=${currentPage}&per_page=${per_page}`;
    axios
      .get(`https://api.github.com/search/repositories?${queryString}`)
      .then(function (response) {
        if (currentPage === 1) {
          setRepos(response.data.items);
          repoListRef.current?.scrollTo(0, 0);
        } else {
          setRepos([...reposRef.current, ...response.data.items]);
        }
        setPage(currentPage + 1);
        setRepoCount(response.data.total_count);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const debounceFetch = useCallback(debounce(fetch, 500), []);

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
  }, [repoListRef, isLoading, page, repoCount]);

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
        {repos.map((repo, i) => (
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