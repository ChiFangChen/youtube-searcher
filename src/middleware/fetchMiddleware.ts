import axios, { AxiosResponse } from 'axios';

/*
  {
    types: [Success, Fail, Request]
    options: {
      url: string,
      config: {},
    }
  }
*/

// Intercept specific action
// This repo doesn't really use it ~
const fetchMiddleware = () => (next: any) => (action: any) => {
  if (!action.types) {
    return next(action);
  }

  const [Success, Fail, Request] = action.types;
  const options = action.options;
  next({
    type: Request,
  });

  return new Promise((resolve, reject) => {
    axios
      .get(options.url)
      .then(function (response: AxiosResponse<any>) {
        next({
          type: Success,
          payload: {
            data: response.data,
          },
        });

        resolve(true);
      })
      .catch((err) => {
        next({
          type: Fail,
        });

        reject(err);
      });
  });
};

export default fetchMiddleware;
