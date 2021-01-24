/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EvaluationEngine } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: validateSubmissionQuery
// ====================================================

export interface validateSubmissionQuery_validate_game {
  __typename: "Game";
  id: string;
}

export interface validateSubmissionQuery_validate_player_user {
  __typename: "User";
  username: string | null;
}

export interface validateSubmissionQuery_validate_player {
  __typename: "Player";
  user: validateSubmissionQuery_validate_player_user;
}

export interface validateSubmissionQuery_validate {
  __typename: "Validation";
  id: string;
  game: validateSubmissionQuery_validate_game;
  player: validateSubmissionQuery_validate_player;
  exerciseId: string;
  evaluationEngine: EvaluationEngine | null;
  evaluationEngineId: string | null;
}

export interface validateSubmissionQuery {
  validate: validateSubmissionQuery_validate | null;
}

export interface validateSubmissionQueryVariables {
  exerciseId: string;
  gameId: string;
  file: any;
  inputs: string[];
}
