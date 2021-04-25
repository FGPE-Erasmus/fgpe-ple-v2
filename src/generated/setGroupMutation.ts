/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: setGroupMutation
// ====================================================

export interface setGroupMutation_setGroup {
  __typename: "Player";
  id: string;
}

export interface setGroupMutation {
  setGroup: setGroupMutation_setGroup;
}

export interface setGroupMutationVariables {
  gameId: string;
  groupId: string;
  playerId: string;
}
