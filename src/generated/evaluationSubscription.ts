/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Result } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: evaluationSubscription
// ====================================================

export interface evaluationSubscription_submissionEvaluatedStudent_player {
  __typename: "Player";
  id: string;
}

export interface evaluationSubscription_submissionEvaluatedStudent {
  __typename: "Submission";
  id: string;
  player: evaluationSubscription_submissionEvaluatedStudent_player;
  exerciseId: string;
  result: Result | null;
  createdAt: any;
  feedback: string | null;
}

export interface evaluationSubscription {
  submissionEvaluatedStudent: evaluationSubscription_submissionEvaluatedStudent;
}

export interface evaluationSubscriptionVariables {
  gameId: string;
}
