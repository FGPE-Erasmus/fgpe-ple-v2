/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getGroupsQuery
// ====================================================

export interface getGroupsQuery_groups {
  __typename: "Group";
  id: string;
  name: string;
  displayName: string | null;
}

export interface getGroupsQuery {
  groups: getGroupsQuery_groups[];
}

export interface getGroupsQueryVariables {
  gameId: string;
}
