/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getGameByIdQuery
// ====================================================

export interface getGameByIdQuery_game {
  __typename: "Game";
  id: string;
  name: string;
  description: string | null;
  createdAt: any;
  updatedAt: any | null;
}

export interface getGameByIdQuery {
  game: getGameByIdQuery_game;
}

export interface getGameByIdQueryVariables {
  gameId: string;
}
