/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: removePlayerFromGameMutation
// ====================================================

export interface removePlayerFromGameMutation_removeFromGame {
  __typename: "Player";
  id: string;
}

export interface removePlayerFromGameMutation {
  removeFromGame: removePlayerFromGameMutation_removeFromGame;
}

export interface removePlayerFromGameMutationVariables {
  gameId: string;
  userId: string;
}
