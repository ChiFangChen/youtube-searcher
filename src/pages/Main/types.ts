import { Endpoints } from '@octokit/types';

export type ReposResponse = Endpoints['GET /search/repositories']['response']['data']['items'];
