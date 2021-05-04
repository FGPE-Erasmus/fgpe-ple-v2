/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: setGroupForMultipleMutation
// ====================================================

export interface setGroupForMultipleMutation_setGroupForMultiple {
  __typename: "Player";
  id: string;
}

export interface setGroupForMultipleMutation {
  setGroupForMultiple: setGroupForMultipleMutation_setGroupForMultiple[];
}

export interface setGroupForMultipleMutationVariables {
  gameId: string;
  groupId: string;
  playersIds: string[];
}
