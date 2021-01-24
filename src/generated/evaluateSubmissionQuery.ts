/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EvaluationEngine } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: evaluateSubmissionQuery
// ====================================================

export interface evaluateSubmissionQuery_evaluate_game {
  __typename: "Game";
  id: string;
}

export interface evaluateSubmissionQuery_evaluate_player_user {
  __typename: "User";
  username: string | null;
}

export interface evaluateSubmissionQuery_evaluate_player {
  __typename: "Player";
  user: evaluateSubmissionQuery_evaluate_player_user;
}

export interface evaluateSubmissionQuery_evaluate {
  __typename: "Submission";
  id: string;
  game: evaluateSubmissionQuery_evaluate_game;
  player: evaluateSubmissionQuery_evaluate_player;
  feedback: string | null;
  exerciseId: string;
  evaluationEngine: EvaluationEngine | null;
  evaluationEngineId: string | null;
}

export interface evaluateSubmissionQuery {
  evaluate: evaluateSubmissionQuery_evaluate | null;
}

export interface evaluateSubmissionQueryVariables {
  exerciseId: string;
  gameId: string;
  file: any;
}
