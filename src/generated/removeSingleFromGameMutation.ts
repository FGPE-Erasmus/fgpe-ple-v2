/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: removeSingleFromGameMutation
// ====================================================

export interface removeSingleFromGameMutation_removeFromGame {
  __typename: "Player";
  id: string;
}

export interface removeSingleFromGameMutation {
  removeFromGame: removeSingleFromGameMutation_removeFromGame;
}

export interface removeSingleFromGameMutationVariables {
  gameId: string;
  userId: string;
}
