import React, { ChangeEvent, useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'ts-debounce';
import { Endpoints } from '@octokit/types';

type ReposResponse = Endpoints['GET /search/repositories']['response']['data']['items'];

type Fetch = () => void;

const per_page = 100;

function App() {
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

  const onListScroll = () => {
    if (
      !isLoadingRef.current &&
      repoCountRef.current > per_page * (pageRef.current - 1) &&
      repoListRef.current
    ) {
      // clientHeight + scrollTop = scrollHeight
      const { clientHeight, scrollTop, scrollHeight } = repoListRef.current;
      if (scrollTop + clientHeight + 1 >= scrollHeight) fetch();
    }
  };

  useEffect(() => {
    const repoList = repoListRef.current;
    if (repoList) repoList.addEventListener('scroll', onListScroll);
    return () => {
      if (repoList) repoList.removeEventListener('scroll', onListScroll);
    };
  }, []);

  return (
    <div className="App">
      <div>
        <input value={search} onChange={handleSearchChange} />
      </div>
      <div
        ref={repoListRef}
        style={{
          height: '200px',
          overflow: 'scroll',
        }}
      >
        {repos.map((repo, i) => (
          <div key={`${repo.id}${i}`}>
            <a href={repo.svn_url} target="_blank" rel="noreferrer">
              {repo.full_name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
