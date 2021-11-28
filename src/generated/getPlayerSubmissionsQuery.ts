/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Result } from "./globalTypes";

// ====================================================
// GraphQL query operation: getPlayerSubmissionsQuery
// ====================================================

export interface getPlayerSubmissionsQuery_player_submissions {
  __typename: "Submission";
  id: string;
  submittedAt: any;
  exerciseId: string;
  language: string | null;
  result: Result | null;
}

export interface getPlayerSubmissionsQuery_player {
  __typename: "Player";
  id: string;
  submissions: getPlayerSubmissionsQuery_player_submissions[];
}

export interface getPlayerSubmissionsQuery {
  player: getPlayerSubmissionsQuery_player;
}

export interface getPlayerSubmissionsQueryVariables {
  gameId: string;
  userId: string;
}
