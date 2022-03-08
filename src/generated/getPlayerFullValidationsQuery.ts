/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EvaluationEngine, Result } from "./globalTypes";

// ====================================================
// GraphQL query operation: getPlayerFullValidationsQuery
// ====================================================

export interface getPlayerFullValidationsQuery_validations_player {
  __typename: "Player";
  id: string;
}

export interface getPlayerFullValidationsQuery_validations {
  __typename: "Validation";
  id: string;
  player: getPlayerFullValidationsQuery_validations_player;
  exerciseId: string;
  evaluationEngine: EvaluationEngine | null;
  evaluationEngineId: string | null;
  language: string | null;
  metrics: any | null;
  feedback: string | null;
  submittedAt: any;
  evaluatedAt: any | null;
  program: string | null;
  outputs: any | null;
  result: Result | null;
  userExecutionTimes: any | null;
}

export interface getPlayerFullValidationsQuery {
  validations: getPlayerFullValidationsQuery_validations[];
}

export interface getPlayerFullValidationsQueryVariables {
  gameId: string;
  userId: string;
  exerciseId?: string | null;
}
