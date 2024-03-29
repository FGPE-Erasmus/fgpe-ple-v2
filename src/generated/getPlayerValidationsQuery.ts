/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Result } from "./globalTypes";

// ====================================================
// GraphQL query operation: getPlayerValidationsQuery
// ====================================================

export interface getPlayerValidationsQuery_player_validations {
  __typename: "Validation";
  id: string;
  submittedAt: any;
  exerciseId: string;
  language: string | null;
  result: Result | null;
}

export interface getPlayerValidationsQuery_player {
  __typename: "Player";
  id: string;
  validations: getPlayerValidationsQuery_player_validations[];
}

export interface getPlayerValidationsQuery {
  player: getPlayerValidationsQuery_player;
}

export interface getPlayerValidationsQueryVariables {
  gameId: string;
  userId: string;
}
