import qs from 'qs';

import useFetch from 'hooks/useFetch';

type UseGetReposParameter = {
  search: string;
  page: number;
  per_page: number;
};

const useGetRepos = <D>({ search, page, per_page }: UseGetReposParameter) => {
  const query = qs.stringify(
    {
      q: encodeURIComponent(search),
      page,
      per_page,
    },
    { addQueryPrefix: true },
  );
  const result = useFetch<D>({
    path: `https://api.github.com/search/repositories${query}`,
  });

  return result;
};

export default useGetRepos;
