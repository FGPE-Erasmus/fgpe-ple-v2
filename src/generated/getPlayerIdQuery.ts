/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPlayerIdQuery
// ====================================================

export interface getPlayerIdQuery_profileInGame {
  __typename: "Player";
  id: string;
}

export interface getPlayerIdQuery {
  profileInGame: getPlayerIdQuery_profileInGame;
}

export interface getPlayerIdQueryVariables {
  gameId: string;
}
