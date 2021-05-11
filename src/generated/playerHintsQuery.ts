/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: playerHintsQuery
// ====================================================

export interface playerHintsQuery_playerHints_game {
  __typename: "Game";
  name: string;
}

export interface playerHintsQuery_playerHints_parentChallenge {
  __typename: "Challenge";
  id: string;
  name: string;
}

export interface playerHintsQuery_playerHints {
  __typename: "Hint";
  id: string;
  game: playerHintsQuery_playerHints_game;
  parentChallenge: playerHintsQuery_playerHints_parentChallenge | null;
  name: string;
  description: string | null;
  cost: number | null;
  recurrent: boolean;
  createdAt: any;
  updatedAt: any | null;
}

export interface playerHintsQuery {
  playerHints: playerHintsQuery_playerHints[];
}

export interface playerHintsQueryVariables {
  gameId: string;
  challengeId: string;
}
