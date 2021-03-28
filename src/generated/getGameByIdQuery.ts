/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getGameByIdQuery
// ====================================================

export interface getGameByIdQuery_game_players_submissions {
  __typename: "Submission";
  id: string;
}

export interface getGameByIdQuery_game_players_validations {
  __typename: "Validation";
  id: string;
}

export interface getGameByIdQuery_game_players_group {
  __typename: "Group";
  name: string;
}

export interface getGameByIdQuery_game_players_user {
  __typename: "User";
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

export interface getGameByIdQuery_game_players {
  __typename: "Player";
  id: string;
  submissions: getGameByIdQuery_game_players_submissions[];
  validations: getGameByIdQuery_game_players_validations[];
  points: number;
  group: getGameByIdQuery_game_players_group | null;
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
