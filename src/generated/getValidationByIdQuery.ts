/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EvaluationEngine, Result } from "./globalTypes";

// ====================================================
// GraphQL query operation: getValidationByIdQuery
// ====================================================

export interface getValidationByIdQuery_validation_game {
  __typename: "Game";
  id: string;
}

export interface getValidationByIdQuery_validation_player {
  __typename: "Player";
  id: string;
}

export interface getValidationByIdQuery_validation {
  __typename: "Validation";
  id: string;
  game: getValidationByIdQuery_validation_game;
  player: getValidationByIdQuery_validation_player;
  exerciseId: string;
  evaluationEngine: EvaluationEngine | null;
  evaluationEngineId: string | null;
  language: string | null;
  metrics: any | null;
  outputs: any | null;
  userExecutionTimes: any | null;
  feedback: string | null;
  submittedAt: any;
  evaluatedAt: any | null;
  program: string | null;
  result: Result | null;
}

export interface getValidationByIdQuery {
  validation: getValidationByIdQuery_validation;
}

export interface getValidationByIdQueryVariables {
  gameId: string;
  validationId: string;
}
