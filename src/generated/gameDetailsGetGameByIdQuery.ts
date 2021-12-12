/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: gameDetailsGetGameByIdQuery
// ====================================================

export interface gameDetailsGetGameByIdQuery_game_players_stats {
  __typename: "PlayerStats";
  nrOfSubmissions: number;
  nrOfValidations: number;
  nrOfSubmissionsByActivity: any | null;
  nrOfValidationsByActivity: any | null;
  nrOfSubmissionsByActivityAndResult: any | null;
  nrOfValidationsByActivityAndResult: any | null;
}

export interface gameDetailsGetGameByIdQuery_game_players {
  __typename: "Player";
  id: string;
  stats: gameDetailsGetGameByIdQuery_game_players_stats;
}

export interface gameDetailsGetGameByIdQuery_game {
  __typename: "Game";
  id: string;
  name: string;
  startDate: any | null;
  endDate: any | null;
  private: boolean;
  players: gameDetailsGetGameByIdQuery_game_players[];
  createdAt: any;
}

export interface gameDetailsGetGameByIdQuery {
  game: gameDetailsGetGameByIdQuery_game;
}

export interface gameDetailsGetGameByIdQueryVariables {
  gameId: string;
}
