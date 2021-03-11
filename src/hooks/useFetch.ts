import { useState, useRef } from 'react';
import axios, { AxiosResponse } from 'axios';

type UseFetchParameter = {
  path: string;
};

type UseFetchRes<D> = {
  isLoading: boolean;
  isDone: boolean;
  isErr: boolean;
  data: undefined | D;
  statusCode: undefined | number;
  fetch: VoidFunction;
  reset: VoidFunction;
};

const useFetch = <D>({ path }: UseFetchParameter): UseFetchRes<D> => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isErr, setIsErr] = useState<boolean>(false);
  const [statusCode, setStatusCode] = useState<undefined | number>(undefined);
  const [data, setData] = useState<undefined | D>(undefined);

  // due to the debounce function, the fetch function couldn't get the newest path
  const pathRef = useRef(path);
  pathRef.current = path;

  const fetch = () => {
    setIsDone(false);
    setStatusCode(undefined);
    setIsErr(false);
    setIsLoading(true);

    axios
      .get(pathRef.current)
      .then(function (response: AxiosResponse<D>) {
        setData(response.data);
        setStatusCode(response.status);
      })
      .catch((err) => {
        const code = err.message.replace('Request failed with status code ', '');
        const codeNumber = Number(code);
        if (code == codeNumber) setStatusCode(codeNumber);
        setIsErr(true);
      })
      .finally(() => {
        setIsLoading(false);
        setIsDone(true);
      });
  };

  const reset = () => {
    setIsLoading(false);
    setIsDone(false);
    setIsErr(false);
    setStatusCode(undefined);
    setData(undefined);
  };

  return {
    isLoading,
    isDone,
    isErr,
    data,
    statusCode,
    fetch,
    reset,
  };
};

export default useFetch;
