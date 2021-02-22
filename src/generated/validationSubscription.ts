/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Result } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: validationSubscription
// ====================================================

export interface validationSubscription_validationProcessedStudent_player {
  __typename: "Player";
  id: string;
}

export interface validationSubscription_validationProcessedStudent {
  __typename: "Validation";
  id: string;
  player: validationSubscription_validationProcessedStudent_player;
  exerciseId: string;
  result: Result | null;
  createdAt: any;
  feedback: string | null;
  outputs: any | null;
}

export interface validationSubscription {
  validationProcessedStudent: validationSubscription_validationProcessedStudent;
}

export interface validationSubscriptionVariables {
  gameId: string;
}
