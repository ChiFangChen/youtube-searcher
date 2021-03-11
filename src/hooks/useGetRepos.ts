import { useState, useEffect } from 'react';
import qs from 'qs';
import { Endpoints } from '@octokit/types';

import useFetch from 'hooks/useFetch';

type ReposResponse = Endpoints['GET /search/repositories']['response']['data'];

type UseGetReposParameter = {
  search: string;
  page: number;
  per_page: number;
};

const useGetRepos = ({ search, page, per_page }: UseGetReposParameter) => {
  const [accumulatedRepos, setAccumulatedRepos] = useState<ReposResponse['items']>([]);

  const query = qs.stringify(
    {
      q: encodeURIComponent(search),
      page,
      per_page,
    },
    { addQueryPrefix: true },
  );

  const {
    data = {
      items: [],
      total_count: 0,
    },
    reset: orinReset,
    ...result
  } = useFetch<ReposResponse>({
    path: `https://api.github.com/search/repositories${query}`,
  });

  useEffect(() => {
    if (result.isDone) {
      if (page === 1) {
        setAccumulatedRepos(data.items);
      } else {
        setAccumulatedRepos((r) => [...r, ...data.items]);
      }
    }
  }, [result.isDone]);

  const reset = () => {
    orinReset();
    setAccumulatedRepos([]);
  };

  return {
    data: {
      ...data,
      items: accumulatedRepos,
    },
    reset,
    ...result,
  };
};

export default useGetRepos;
