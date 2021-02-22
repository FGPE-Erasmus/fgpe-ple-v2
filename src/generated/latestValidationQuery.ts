/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Result } from "./globalTypes";

// ====================================================
// GraphQL query operation: latestValidationQuery
// ====================================================

export interface latestValidationQuery_latestValidation {
  __typename: "Validation";
  createdAt: any;
  feedback: string | null;
  result: Result | null;
  outputs: any | null;
  language: string | null;
  program: string | null;
  id: string;
}

export interface latestValidationQuery {
  latestValidation: latestValidationQuery_latestValidation;
}

export interface latestValidationQueryVariables {
  gameId: string;
  exerciseId: string;
}
