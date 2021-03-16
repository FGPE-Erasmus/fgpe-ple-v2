/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getGroupRankingsQuery
// ====================================================

export interface getGroupRankingsQuery_groupRankings_player_group {
  __typename: "Group";
  id: string;
  name: string;
}

export interface getGroupRankingsQuery_groupRankings_player_user {
  __typename: "User";
  id: string | null;
  username: string | null;
}

export interface getGroupRankingsQuery_groupRankings_player {
  __typename: "Player";
  id: string;
  group: getGroupRankingsQuery_groupRankings_player_group | null;
  user: getGroupRankingsQuery_groupRankings_player_user;
}

export interface getGroupRankingsQuery_groupRankings {
  __typename: "Ranking";
  player: getGroupRankingsQuery_groupRankings_player | null;
  score: any;
}

export interface getGroupRankingsQuery {
  groupRankings: getGroupRankingsQuery_groupRankings[];
}

export interface getGroupRankingsQueryVariables {
  gameId: string;
  leaderboardId: string;
}
