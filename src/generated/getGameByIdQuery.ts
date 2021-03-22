/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getGameByIdQuery
// ====================================================

export interface getGameByIdQuery_game_players_user {
  __typename: "User";
  email: string | null;
  id: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface getGameByIdQuery_game_players {
  __typename: "Player";
  id: string;
  user: getGameByIdQuery_game_players_user;
}

export interface getGameByIdQuery_game {
  __typename: "Game";
  id: string;
  name: string;
  description: string | null;
  createdAt: any;
  updatedAt: any | null;
  players: getGameByIdQuery_game_players[];
}

export interface getGameByIdQuery {
  game: getGameByIdQuery_game;
}

export interface getGameByIdQueryVariables {
  gameId: string;
}
