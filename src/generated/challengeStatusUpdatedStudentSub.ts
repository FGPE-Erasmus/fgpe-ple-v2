/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { State } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: challengeStatusUpdatedStudentSub
// ====================================================

export interface challengeStatusUpdatedStudentSub_challengeStatusUpdatedStudent {
  __typename: "ChallengeStatus";
  openedAt: any | null;
  endedAt: any | null;
  startedAt: any | null;
  state: State;
}

export interface challengeStatusUpdatedStudentSub {
  challengeStatusUpdatedStudent: challengeStatusUpdatedStudentSub_challengeStatusUpdatedStudent;
}

export interface challengeStatusUpdatedStudentSubVariables {
  gameId: string;
}
