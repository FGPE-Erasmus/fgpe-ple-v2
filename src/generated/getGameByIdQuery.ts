/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EvaluationEngine, Result } from "./globalTypes";

// ====================================================
// GraphQL query operation: getGameByIdQuery
// ====================================================

export interface getGameByIdQuery_game_players_validations {
  __typename: "Validation";
  id: string;
}

export interface getGameByIdQuery_game_players_submissions {
  __typename: "Submission";
  exerciseId: string;
  feedback: string | null;
  result: Result | null;
}

export interface getGameByIdQuery_game_players_user {
  __typename: "User";
  email: string | null;
  id: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface getGameByIdQuery_game_players {
  __typename: "Player";
  id: string;
  validations: getGameByIdQuery_game_players_validations[];
  submissions: getGameByIdQuery_game_players_submissions[];
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
  startDate: any | null;
  endDate: any | null;
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
