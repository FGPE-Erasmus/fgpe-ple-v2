/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GameStateEnum, EvaluationEngine } from "./globalTypes";

// ====================================================
// GraphQL query operation: getGameByIdQuery
// ====================================================

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

export interface getGameByIdQuery_game_players {
  __typename: "Player";
  group: getGameByIdQuery_game_players_group | null;
  id: string;
  stats: getGameByIdQuery_game_players_stats;
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
