/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getLeaderboardsQuery
// ====================================================

export interface getLeaderboardsQuery_leaderboards_game {
  __typename: "Game";
  id: string;
  name: string;
}

export interface getLeaderboardsQuery_leaderboards_parentChallenge {
  __typename: "Challenge";
  id: string;
}

export interface getLeaderboardsQuery_leaderboards {
  __typename: "Leaderboard";
  id: string | null;
  game: getLeaderboardsQuery_leaderboards_game | null;
  parentChallenge: getLeaderboardsQuery_leaderboards_parentChallenge | null;
  name: string | null;
}

export interface getLeaderboardsQuery {
  leaderboards: getLeaderboardsQuery_leaderboards[];
}

export interface getLeaderboardsQueryVariables {
  gameId: string;
}
