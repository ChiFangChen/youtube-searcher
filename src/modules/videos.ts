import axios from 'axios';
import qs from 'qs';

import { API_HOST, API_KEY, per_page } from 'utils/variables';
import { StoreTypes } from './index';

// Selector
export const videosSelector = (state: StoreTypes): State => state.videos;

interface State {
  isLoading: boolean;
  isDone: boolean;
  isError: boolean;
  data: {
    nextPageToken: undefined | string;
    prevPageToken: undefined | string;
    pageInfo: {
      totalResults: undefined | number;
      resultsPerPage: undefined | number;
    };
    items: {
      id: string;
      img: string;
      title: string;
    }[];
  };
}

// Initial state
const initialState: State = {
  isLoading: false,
  isDone: false,
  isError: false,
  data: {
    nextPageToken: undefined,
    prevPageToken: undefined,
    pageInfo: {
      totalResults: undefined,
      resultsPerPage: undefined,
    },
    items: [],
  },
};

// Constants
const prefix = 'videos';
export const INIT = `${prefix}/INIT`;
export const BUSY = `${prefix}/BUSY`;
export const DONE = `${prefix}/DONE`;
export const FAIL = `${prefix}/FAIL`;

// Reducer
const videosReducer = (state = initialState, action: any = {}) => {
  switch (action.type) {
    case INIT:
      return {
        ...initialState,
      };
    case BUSY:
      return {
        ...state,
        isLoading: true,
        isDone: false,
        isError: false,
      };
    case FAIL:
      return {
        ...state,
        isLoading: false,
        isDone: true,
        isError: true,
      };
    case DONE:
      return {
        ...state,
        isLoading: false,
        isDone: true,
        data: {
          ...(state.data ? { ...state.data } : {}),
          ...action.payload.data,
          items: [
            ...(state.data ? [...state.data.items] : []),
            ...action.payload.data.items.map((item: any) => ({
              id: item.id.videoId,
              img: item.snippet.thumbnails.high.url,
              title: item.snippet.title,
            })),
          ],
        },
      };
    default:
      return state;
  }
};

// Action Creators

interface Reset {
  type: typeof INIT;
}

export const reset = (): Reset => ({
  type: INIT,
});

interface Busy {
  type: typeof BUSY;
}

export const busy = (): Busy => ({
  type: BUSY,
});

interface FetchDonePayload {
  data: any;
}

interface FetchDone {
  type: typeof DONE;
  payload: FetchDonePayload;
}

export const fetchDone = ({ data }: FetchDonePayload): FetchDone => ({
  type: DONE,
  payload: {
    data,
  },
});

interface FetchFail {
  type: typeof FAIL;
}

export const fetchFail = (): FetchFail => ({
  type: FAIL,
});

// call API
const getVideos = async ({
  search,
  pageToken,
  count = 0,
}: {
  search: string;
  pageToken: undefined | string;
  count?: number;
}) => {
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

  const url = `${API_HOST}/search${query}`;

  const {
    data: responseData,
    data: { nextPageToken, items },
  } = await axios(url);
  let currentItems = items;

  count += 1;

  if (nextPageToken && count < 5) {
    const nextResponse: any = await getVideos({
      search,
      pageToken: nextPageToken,
      count,
    });
    currentItems = [...currentItems, ...nextResponse.items];

    return {
      ...nextResponse,
      items: currentItems,
    };
  }

  return {
    ...responseData,
    items: currentItems,
  };
};

// Thunk
type ReadVideosParameter = {
  search: string;
};

export const readVideos = ({ search }: ReadVideosParameter) => async (
  dispatch: any,
  getState: any,
) => {
  dispatch(busy());

  const { nextPageToken: pageToken } = getState().videos.data;
  try {
    const result = await getVideos({ pageToken, search });
    dispatch(fetchDone({ data: result }));
  } catch (error) {
    dispatch(fetchFail());
  }
};

export default videosReducer;
