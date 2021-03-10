import React, { ChangeEvent, useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'ts-debounce';
import { Endpoints } from '@octokit/types';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import MaterialTextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
import NavigationIcon from '@material-ui/icons/Navigation';

import { MOBILE_MAX } from 'utils/variables';
import { FlexCenter } from 'utils/styles';
import LanguageSwitcher from 'components/LanguageSwitcher';
import Spinner from 'components/Spinner';

type ReposResponse = Endpoints['GET /search/repositories']['response']['data']['items'];

type Fetch = () => void;

const per_page = 100;

const AppWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 25px;
`;

const SearchBlock = styled.div`
  margin: 0 25px 25px;

  > div {
    width: 100%;
  }
`;

const TextField = styled(MaterialTextField)`
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

const RepoList = styled.div`
  flex: 1;
  overflow: scroll;

  > a {
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
  }
`;

const FabWrapper = styled.div`
  position: fixed;
  bottom: 40px;
  right: 25px;
`;

function App() {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(isLoading);
  isLoadingRef.current = isLoading;

  const [search, setSearch] = useState('');
  const searchRef = useRef(search);
  searchRef.current = search;

  const [repos, setRepos] = useState<ReposResponse>([]);
  const reposRef = useRef(repos);
  reposRef.current = repos;

  const [repoCount, setRepoCount] = useState(repos.length);
  const repoCountRef = useRef(repoCount);
  repoCountRef.current = repoCount;

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

  const fetch: Fetch = () => {
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

  const onListScroll = () => {
    if (!repoListRef.current) return;

    // clientHeight + scrollTop = scrollHeight
    const { clientHeight, scrollTop, scrollHeight } = repoListRef.current;

    if (
      !isLoadingRef.current &&
      repoCountRef.current > per_page * (pageRef.current - 1) &&
      scrollTop + clientHeight + 1 >= scrollHeight
    ) {
      fetch();
    }

    if (scrollTop > 100) setShowTopBtn(true);
    else setShowTopBtn(false);
  };

  useEffect(() => {
    const repoList = repoListRef.current;
    if (repoList) repoList.addEventListener('scroll', onListScroll);
    return () => {
      if (repoList) repoList.removeEventListener('scroll', onListScroll);
    };
  }, []);

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
          <a key={`${repo.id}${i}`} href={repo.svn_url} target="_blank" rel="noreferrer">
            {repo.full_name}
          </a>
        ))}

        <Spinner isLoading={isLoading} />

        <Zoom in={showTopBtn} unmountOnExit>
          <FabWrapper>
            <Fab size="small" color="secondary" onClick={onTopBottomClick}>
              <NavigationIcon />
            </Fab>
          </FabWrapper>
        </Zoom>
      </RepoList>
    </AppWrapper>
  );
}

export default App;
