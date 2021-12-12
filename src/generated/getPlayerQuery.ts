/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPlayerQuery
// ====================================================

export interface getPlayerQuery_player_learningPath_challenge_refs {
  __typename: "Activity";
  id: string | null;
  name: string | null;
}

export interface getPlayerQuery_player_learningPath_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  refs: getPlayerQuery_player_learningPath_challenge_refs[];
}

export interface getPlayerQuery_player_learningPath {
  __typename: "ChallengeStatus";
  challenge: getPlayerQuery_player_learningPath_challenge;
  progress: number;
}

export interface getPlayerQuery_player_game_groups {
  __typename: "Group";
  id: string;
  name: string;
  displayName: string | null;
}

export interface getPlayerQuery_player_game {
  __typename: "Game";
  id: string;
  name: string;
  groups: getPlayerQuery_player_game_groups[];
}

export interface getPlayerQuery_player_user {
  __typename: "User";
  id: string | null;
  username: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface getPlayerQuery_player_group {
  __typename: "Group";
  id: string;
  name: string;
}

export interface getPlayerQuery_player_stats {
  __typename: "PlayerStats";
  nrOfSubmissions: number;
  nrOfValidations: number;
  nrOfSubmissionsByActivity: any | null;
  nrOfValidationsByActivity: any | null;
  nrOfSubmissionsByActivityAndResult: any | null;
  nrOfValidationsByActivityAndResult: any | null;
}

export interface getPlayerQuery_player {
  __typename: "Player";
  id: string;
  learningPath: getPlayerQuery_player_learningPath[];
  game: getPlayerQuery_player_game;
  user: getPlayerQuery_player_user;
  group: getPlayerQuery_player_group | null;
  stats: getPlayerQuery_player_stats;
}

export interface getPlayerQuery {
  player: getPlayerQuery_player;
}

export interface getPlayerQueryVariables {
  gameId: string;
  userId: string;
}
