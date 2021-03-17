import { useState, useEffect } from 'react';
import qs from 'qs';
import { Endpoints } from '@octokit/types';

import { API_KEY, per_page } from 'utils/variables';
import useFetch from 'hooks/useFetch';

type ReposResponse = Endpoints['GET /search/repositories']['response']['data'];

type useGetVideosParameter = {
  search: string;
  page: number;
  pageToken?: string;
};

const useGetVideos = ({ search, page, pageToken }: useGetVideosParameter) => {
  const [accumulatedRepos, setAccumulatedRepos] = useState<ReposResponse['items']>([]);

  const query = qs.stringify(
    {
      q: encodeURIComponent(search),
      pageToken,
      key: API_KEY,
      maxResults: per_page,
      part: 'snippet',
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
    path: `/search${query}`,
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

export default useGetVideos;
