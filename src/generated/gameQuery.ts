/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: gameQuery
// ====================================================

export interface gameQuery_game_players_user {
  __typename: "User";
  id: string | null;
}

export interface gameQuery_game_players {
  __typename: "Player";
  id: string;
  user: gameQuery_game_players_user;
}

export interface gameQuery_game {
  __typename: "Game";
  id: string;
  name: string;
  players: gameQuery_game_players[];
}

export interface gameQuery {
  game: gameQuery_game;
}

export interface gameQueryVariables {
  gameId: string;
}
