/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getInstructorGames
// ====================================================

export interface getInstructorGames_games {
  __typename: "Game";
  id: string;
  name: string;
  description: string | null;
}

export interface getInstructorGames {
  games: getInstructorGames_games[];
}
