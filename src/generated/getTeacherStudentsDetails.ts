/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTeacherStudentsDetails
// ====================================================

export interface getTeacherStudentsDetails_myGames_players_stats {
  __typename: "PlayerStats";
  nrOfSubmissions: number;
  nrOfValidations: number;
}

export interface getTeacherStudentsDetails_myGames_players_group {
  __typename: "Group";
  name: string;
}

export interface getTeacherStudentsDetails_myGames_players_user {
  __typename: "User";
  id: string | null;
  lastName: string | null;
  firstName: string | null;
}

export interface getTeacherStudentsDetails_myGames_players_learningPath {
  __typename: "ChallengeStatus";
  progress: number;
}

export interface getTeacherStudentsDetails_myGames_players {
  __typename: "Player";
  stats: getTeacherStudentsDetails_myGames_players_stats;
  group: getTeacherStudentsDetails_myGames_players_group | null;
  user: getTeacherStudentsDetails_myGames_players_user;
  learningPath: getTeacherStudentsDetails_myGames_players_learningPath[];
}

export interface getTeacherStudentsDetails_myGames {
  __typename: "Game";
  id: string;
  name: string;
  players: getTeacherStudentsDetails_myGames_players[];
}

export interface getTeacherStudentsDetails {
  myGames: getTeacherStudentsDetails_myGames[];
}
