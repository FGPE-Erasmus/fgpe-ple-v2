/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllAvailableGames
// ====================================================

export interface getAllAvailableGames_games_instructors {
  __typename: "User";
  email: string | null;
  id: string | null;
}

export interface getAllAvailableGames_games {
  __typename: "Game";
  id: string;
  name: string;
  description: string | null;
  private: boolean;
  instructors: getAllAvailableGames_games_instructors[];
}

export interface getAllAvailableGames {
  games: getAllAvailableGames_games[];
}
