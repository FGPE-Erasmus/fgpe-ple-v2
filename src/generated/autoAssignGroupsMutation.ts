/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: autoAssignGroupsMutation
// ====================================================

export interface autoAssignGroupsMutation_autoAssignGroups {
  __typename: "Group";
  id: string;
}

export interface autoAssignGroupsMutation {
  autoAssignGroups: autoAssignGroupsMutation_autoAssignGroups[];
}

export interface autoAssignGroupsMutationVariables {
  gameId: string;
}
