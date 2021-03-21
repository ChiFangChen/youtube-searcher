import { combineReducers } from 'redux';
import videosReducer from './videos';

export const rootReducer = combineReducers({
  videos: videosReducer,
});

export type StoreTypes = ReturnType<typeof rootReducer>;
