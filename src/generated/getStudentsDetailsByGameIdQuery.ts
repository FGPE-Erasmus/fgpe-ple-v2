/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getStudentsDetailsByGameIdQuery
// ====================================================

export interface getStudentsDetailsByGameIdQuery_game_groups {
  __typename: "Group";
  id: string;
  name: string;
  displayName: string | null;
}

export interface getStudentsDetailsByGameIdQuery_game_challenges_refs {
  __typename: "Activity";
  name: string | null;
  id: string | null;
}

export interface getStudentsDetailsByGameIdQuery_game_challenges {
  __typename: "Challenge";
  name: string;
  refs: getStudentsDetailsByGameIdQuery_game_challenges_refs[];
}

export interface getStudentsDetailsByGameIdQuery_game_players_group {
  __typename: "Group";
  name: string;
}

export interface getStudentsDetailsByGameIdQuery_game_players_stats {
  __typename: "PlayerStats";
  nrOfSubmissions: number;
  nrOfValidations: number;
  nrOfSubmissionsByActivity: any | null;
  nrOfValidationsByActivity: any | null;
  nrOfSubmissionsByActivityAndResult: any | null;
  nrOfValidationsByActivityAndResult: any | null;
}

export interface getStudentsDetailsByGameIdQuery_game_players_user {
  __typename: "User";
  id: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface getStudentsDetailsByGameIdQuery_game_players_learningPath {
  __typename: "ChallengeStatus";
  progress: number;
}

export interface getStudentsDetailsByGameIdQuery_game_players {
  __typename: "Player";
  group: getStudentsDetailsByGameIdQuery_game_players_group | null;
  id: string;
  stats: getStudentsDetailsByGameIdQuery_game_players_stats;
  user: getStudentsDetailsByGameIdQuery_game_players_user;
  learningPath: getStudentsDetailsByGameIdQuery_game_players_learningPath[];
}

export interface getStudentsDetailsByGameIdQuery_game {
  __typename: "Game";
  id: string;
  groups: getStudentsDetailsByGameIdQuery_game_groups[];
  challenges: getStudentsDetailsByGameIdQuery_game_challenges[];
  players: getStudentsDetailsByGameIdQuery_game_players[];
  createdAt: any;
}

export interface getStudentsDetailsByGameIdQuery {
  game: getStudentsDetailsByGameIdQuery_game;
}

export interface getStudentsDetailsByGameIdQueryVariables {
  gameId: string;
}
