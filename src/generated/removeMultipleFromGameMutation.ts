/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: removeMultipleFromGameMutation
// ====================================================

export interface removeMultipleFromGameMutation_removeMultipleFromGame {
  __typename: "Player";
  id: string;
}

export interface removeMultipleFromGameMutation {
  removeMultipleFromGame: removeMultipleFromGameMutation_removeMultipleFromGame[];
}

export interface removeMultipleFromGameMutationVariables {
  gameId: string;
  usersIds: string[];
}
