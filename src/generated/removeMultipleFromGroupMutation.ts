/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: removeMultipleFromGroupMutation
// ====================================================

export interface removeMultipleFromGroupMutation_removeMultipleFromGroup {
  __typename: "Player";
  id: string;
}

export interface removeMultipleFromGroupMutation {
  removeMultipleFromGroup: removeMultipleFromGroupMutation_removeMultipleFromGroup[];
}

export interface removeMultipleFromGroupMutationVariables {
  gameId: string;
  playersIds: string[];
}
