/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Result } from "./globalTypes";

// ====================================================
// GraphQL query operation: latestSubmissionQuery
// ====================================================

export interface latestSubmissionQuery_latestSubmission {
  __typename: "Submission";
  createdAt: any;
  feedback: string | null;
  result: Result | null;
  language: string | null;
  program: string | null;
  id: string;
}

export interface latestSubmissionQuery {
  latestSubmission: latestSubmissionQuery_latestSubmission;
}

export interface latestSubmissionQueryVariables {
  gameId: string;
  exerciseId: string;
}
