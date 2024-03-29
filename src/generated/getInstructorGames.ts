/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GameStateEnum } from "./globalTypes";

// ====================================================
// GraphQL query operation: getInstructorGames
// ====================================================

export interface getInstructorGames_myGames_players_stats {
  __typename: "PlayerStats";
  nrOfSubmissions: number;
  nrOfValidations: number;
}

export interface getInstructorGames_myGames_players_group {
  __typename: "Group";
  name: string;
}

export interface getInstructorGames_myGames_players_user {
  __typename: "User";
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  id: string | null;
}

export interface getInstructorGames_myGames_players_learningPath {
  __typename: "ChallengeStatus";
  progress: number;
}

export interface getInstructorGames_myGames_players {
  __typename: "Player";
  stats: getInstructorGames_myGames_players_stats;
  group: getInstructorGames_myGames_players_group | null;
  user: getInstructorGames_myGames_players_user;
  learningPath: getInstructorGames_myGames_players_learningPath[];
}

export interface getInstructorGames_myGames {
  __typename: "Game";
  id: string;
  name: string;
  description: string | null;
  private: boolean;
  startDate: any | null;
  endDate: any | null;
  state: GameStateEnum;
  players: getInstructorGames_myGames_players[];
}

export interface getInstructorGames {
  myGames: getInstructorGames_myGames[];
}
