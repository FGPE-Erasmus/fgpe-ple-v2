/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: enrollMutation
// ====================================================

export interface enrollMutation_enroll {
  __typename: "Player";
  id: string;
}

export interface enrollMutation {
  enroll: enrollMutation_enroll;
}

export interface enrollMutationVariables {
  gameId: string;
}
