/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: gameDetailsGetGameByIdQuery
// ====================================================

export interface gameDetailsGetGameByIdQuery_game_groups {
  __typename: "Group";
  id: string;
  name: string;
  displayName: string | null;
}

export interface gameDetailsGetGameByIdQuery_game_challenges_refs {
  __typename: "Activity";
  name: string | null;
  id: string | null;
}

export interface gameDetailsGetGameByIdQuery_game_challenges {
  __typename: "Challenge";
  name: string;
  refs: gameDetailsGetGameByIdQuery_game_challenges_refs[];
}

export interface gameDetailsGetGameByIdQuery_game_players_group {
  __typename: "Group";
  name: string;
}

export interface gameDetailsGetGameByIdQuery_game_players_stats {
  __typename: "PlayerStats";
  nrOfSubmissions: number;
  nrOfValidations: number;
  nrOfSubmissionsByActivity: any | null;
  nrOfValidationsByActivity: any | null;
  nrOfSubmissionsByActivityAndResult: any | null;
  nrOfValidationsByActivityAndResult: any | null;
}

export interface gameDetailsGetGameByIdQuery_game_players_user {
  __typename: "User";
  id: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface gameDetailsGetGameByIdQuery_game_players {
  __typename: "Player";
  group: gameDetailsGetGameByIdQuery_game_players_group | null;
  id: string;
  stats: gameDetailsGetGameByIdQuery_game_players_stats;
  user: gameDetailsGetGameByIdQuery_game_players_user;
}

export interface gameDetailsGetGameByIdQuery_game {
  __typename: "Game";
  id: string;
  name: string;
  startDate: any | null;
  endDate: any | null;
  private: boolean;
  groups: gameDetailsGetGameByIdQuery_game_groups[];
  challenges: gameDetailsGetGameByIdQuery_game_challenges[];
  players: gameDetailsGetGameByIdQuery_game_players[];
  createdAt: any;
}

export interface gameDetailsGetGameByIdQuery {
  game: gameDetailsGetGameByIdQuery_game;
}

export interface gameDetailsGetGameByIdQueryVariables {
  gameId: string;
}
