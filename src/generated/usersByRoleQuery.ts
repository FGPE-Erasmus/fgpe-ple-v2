/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: usersByRoleQuery
// ====================================================

export interface usersByRoleQuery_usersByRole {
  __typename: "User";
  id: string | null;
  emailVerified: boolean | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

export interface usersByRoleQuery {
  usersByRole: usersByRoleQuery_usersByRole[];
}

export interface usersByRoleQueryVariables {
  role: string;
}
