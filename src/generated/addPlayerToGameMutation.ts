/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addPlayerToGameMutation
// ====================================================

export interface addPlayerToGameMutation_addToGame_game {
  __typename: "Game";
  id: string;
}

export interface addPlayerToGameMutation_addToGame_user {
  __typename: "User";
  username: string | null;
}

export interface addPlayerToGameMutation_addToGame {
  __typename: "Player";
  id: string;
  game: addPlayerToGameMutation_addToGame_game;
  user: addPlayerToGameMutation_addToGame_user;
}

export interface addPlayerToGameMutation {
  addToGame: addPlayerToGameMutation_addToGame;
}

export interface addPlayerToGameMutationVariables {
  gameId: string;
  userId: string;
}
