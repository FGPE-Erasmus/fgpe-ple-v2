/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: generateGameTokenMutation
// ====================================================

export interface generateGameTokenMutation_generateGameToken {
  __typename: "TokenDto";
  token: string;
  expiresIn: number;
}

export interface generateGameTokenMutation {
  generateGameToken: generateGameTokenMutation_generateGameToken;
}

export interface generateGameTokenMutationVariables {
  gameId: string;
}
