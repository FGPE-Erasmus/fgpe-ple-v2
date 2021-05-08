/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addMultipleToGameMutation
// ====================================================

export interface addMultipleToGameMutation_addMultipleToGame {
  __typename: "Player";
  id: string;
}

export interface addMultipleToGameMutation {
  addMultipleToGame: addMultipleToGameMutation_addMultipleToGame[];
}

export interface addMultipleToGameMutationVariables {
  gameId: string;
  usersIds: string[];
}
