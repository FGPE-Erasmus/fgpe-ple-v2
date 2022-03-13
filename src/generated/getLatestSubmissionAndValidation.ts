/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Result } from "./globalTypes";

// ====================================================
// GraphQL query operation: getLatestSubmissionAndValidation
// ====================================================

export interface getLatestSubmissionAndValidation_latestValidation {
  __typename: "Validation";
  createdAt: any;
  feedback: string | null;
  result: Result | null;
  outputs: any | null;
  language: string | null;
  program: string | null;
  id: string;
}

export interface getLatestSubmissionAndValidation_latestSubmission {
  __typename: "Submission";
  createdAt: any;
  feedback: string | null;
  result: Result | null;
  language: string | null;
  program: string | null;
  id: string;
}

export interface getLatestSubmissionAndValidation {
  latestValidation: getLatestSubmissionAndValidation_latestValidation;
  latestSubmission: getLatestSubmissionAndValidation_latestSubmission;
}

export interface getLatestSubmissionAndValidationVariables {
  gameId: string;
  exerciseId: string;
}
