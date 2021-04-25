/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUserDetails
// ====================================================

export interface getUserDetails_user {
  __typename: "User";
  id: string | null;
  emailVerified: boolean | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

export interface getUserDetails {
  user: getUserDetails_user;
}

export interface getUserDetailsVariables {
  userId: string;
}
