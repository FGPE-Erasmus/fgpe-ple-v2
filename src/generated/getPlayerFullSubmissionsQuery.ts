/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EvaluationEngine, Result } from "./globalTypes";

// ====================================================
// GraphQL query operation: getPlayerFullSubmissionsQuery
// ====================================================

export interface getPlayerFullSubmissionsQuery_submissions_player {
  __typename: "Player";
  id: string;
}

export interface getPlayerFullSubmissionsQuery_submissions {
  __typename: "Submission";
  id: string;
  player: getPlayerFullSubmissionsQuery_submissions_player;
  exerciseId: string;
  evaluationEngine: EvaluationEngine | null;
  evaluationEngineId: string | null;
  language: string | null;
  metrics: any | null;
  result: Result | null;
  feedback: string | null;
  submittedAt: any;
  evaluatedAt: any | null;
  program: string | null;
  grade: number | null;
}

export interface getPlayerFullSubmissionsQuery {
  submissions: getPlayerFullSubmissionsQuery_submissions[];
}

export interface getPlayerFullSubmissionsQueryVariables {
  gameId: string;
  userId: string;
  exerciseId?: string | null;
}
