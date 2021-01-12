/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EvaluationEngine, Result } from "./globalTypes";

// ====================================================
// GraphQL query operation: getSubmissionByIdQuery
// ====================================================

export interface getSubmissionByIdQuery_submission_game {
  __typename: "Game";
  id: string;
}

export interface getSubmissionByIdQuery_submission_player {
  __typename: "Player";
  id: string;
}

export interface getSubmissionByIdQuery_submission {
  __typename: "Submission";
  id: string;
  game: getSubmissionByIdQuery_submission_game;
  player: getSubmissionByIdQuery_submission_player;
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
}

export interface getSubmissionByIdQuery {
  submission: getSubmissionByIdQuery_submission;
}

export interface getSubmissionByIdQueryVariables {
  gameId: string;
  submissionId: string;
}
