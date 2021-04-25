/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addGroupMutation
// ====================================================

export interface addGroupMutation_saveGroup {
  __typename: "Group";
  id: string;
  name: string;
  displayName: string | null;
}

export interface addGroupMutation {
  saveGroup: addGroupMutation_saveGroup;
}

export interface addGroupMutationVariables {
  gameId: string;
  groupName: string;
  groupDisplayName: string;
}
