/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getValidationByIdQuery
// ====================================================

export interface getValidationByIdQuery_validation {
  __typename: "Validation";
  id: string;
  outputs: any | null;
  feedback: string | null;
  program: string | null;
}

export interface getValidationByIdQuery {
  validation: getValidationByIdQuery_validation;
}

export interface getValidationByIdQueryVariables {
  gameId: string;
  validationId: string;
}
