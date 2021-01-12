/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EvaluationEngine } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: uploadSubmissionQuery
// ====================================================

export interface uploadSubmissionQuery_evaluate_game {
  __typename: "Game";
  id: string;
}

export interface uploadSubmissionQuery_evaluate_player_user {
  __typename: "User";
  username: string | null;
}

export interface uploadSubmissionQuery_evaluate_player {
  __typename: "Player";
  user: uploadSubmissionQuery_evaluate_player_user;
}

export interface uploadSubmissionQuery_evaluate {
  __typename: "Submission";
  id: string;
  game: uploadSubmissionQuery_evaluate_game;
  player: uploadSubmissionQuery_evaluate_player;
  feedback: string | null;
  exerciseId: string;
  evaluationEngine: EvaluationEngine | null;
  evaluationEngineId: string | null;
}

export interface uploadSubmissionQuery {
  evaluate: uploadSubmissionQuery_evaluate | null;
}

export interface uploadSubmissionQueryVariables {
  exerciseId: string;
  gameId: string;
  file: any;
}
