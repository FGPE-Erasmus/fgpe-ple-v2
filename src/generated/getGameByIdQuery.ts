/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GameStateEnum, EvaluationEngine } from "./globalTypes";

// ====================================================
// GraphQL query operation: getGameByIdQuery
// ====================================================

export interface getGameByIdQuery_game_groups {
  __typename: "Group";
  id: string;
  name: string;
  displayName: string | null;
}

export interface getGameByIdQuery_game_challenges_refs {
  __typename: "Activity";
  name: string | null;
  id: string | null;
}

export interface getGameByIdQuery_game_challenges {
  __typename: "Challenge";
  name: string;
  refs: getGameByIdQuery_game_challenges_refs[];
}

export interface getGameByIdQuery_game_players_group {
  __typename: "Group";
  name: string;
}

export interface getGameByIdQuery_game_players_stats {
  __typename: "PlayerStats";
  nrOfSubmissions: number;
  nrOfValidations: number;
  nrOfSubmissionsByActivity: any | null;
  nrOfValidationsByActivity: any | null;
  nrOfSubmissionsByActivityAndResult: any | null;
  nrOfValidationsByActivityAndResult: any | null;
}

export interface getGameByIdQuery_game_players_user {
  __typename: "User";
  id: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface getGameByIdQuery_game_players {
  __typename: "Player";
  group: getGameByIdQuery_game_players_group | null;
  id: string;
  stats: getGameByIdQuery_game_players_stats;
  user: getGameByIdQuery_game_players_user;
}

export interface getGameByIdQuery_game_instructors {
  __typename: "User";
  id: string | null;
  username: string | null;
}

export interface getGameByIdQuery_game {
  __typename: "Game";
  id: string;
  name: string;
  description: string | null;
  gedilLayerId: string | null;
  gedilLayerDescription: string | null;
  courseId: string;
  startDate: any | null;
  endDate: any | null;
  state: GameStateEnum;
  evaluationEngine: EvaluationEngine;
  private: boolean;
  groups: getGameByIdQuery_game_groups[];
  challenges: getGameByIdQuery_game_challenges[];
  players: getGameByIdQuery_game_players[];
  instructors: getGameByIdQuery_game_instructors[];
  createdAt: any;
  updatedAt: any | null;
}

export interface getGameByIdQuery {
  game: getGameByIdQuery_game;
}

export interface getGameByIdQueryVariables {
  gameId: string;
}
