/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getGamePlayersQuery
// ====================================================

export interface getGamePlayersQuery_game_players_group {
  __typename: "Group";
  name: string;
}

export interface getGamePlayersQuery_game_players_user {
  __typename: "User";
  id: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface getGamePlayersQuery_game_players {
  __typename: "Player";
  group: getGamePlayersQuery_game_players_group | null;
  id: string;
  user: getGamePlayersQuery_game_players_user;
}

export interface getGamePlayersQuery_game {
  __typename: "Game";
  players: getGamePlayersQuery_game_players[];
}

export interface getGamePlayersQuery {
  game: getGamePlayersQuery_game;
}

export interface getGamePlayersQueryVariables {
  gameId: string;
}
