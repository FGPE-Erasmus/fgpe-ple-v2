/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: generateGroupTokenMutation
// ====================================================

export interface generateGroupTokenMutation_generateGroupToken {
  __typename: "TokenDto";
  token: string;
  expiresIn: number;
}

export interface generateGroupTokenMutation {
  generateGroupToken: generateGroupTokenMutation_generateGroupToken;
}

export interface generateGroupTokenMutationVariables {
  gameId: string;
  groupId: string;
}
