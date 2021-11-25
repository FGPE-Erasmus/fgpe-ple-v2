/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Result } from "./globalTypes";

// ====================================================
// GraphQL query operation: getPlayerSubmissionsQuery
// ====================================================

export interface getPlayerSubmissionsQuery_player_game_challenges_refs {
  __typename: "Activity";
  id: string | null;
  name: string | null;
}

export interface getPlayerSubmissionsQuery_player_game_challenges {
  __typename: "Challenge";
  id: string;
  name: string;
  refs: getPlayerSubmissionsQuery_player_game_challenges_refs[];
}

export interface getPlayerSubmissionsQuery_player_game {
  __typename: "Game";
  id: string;
  name: string;
  challenges: getPlayerSubmissionsQuery_player_game_challenges[];
}

export interface getPlayerSubmissionsQuery_player_submissions {
  __typename: "Submission";
  id: string;
  submittedAt: any;
  exerciseId: string;
  language: string | null;
  result: Result | null;
}

export interface getPlayerSubmissionsQuery_player {
  __typename: "Player";
  id: string;
  game: getPlayerSubmissionsQuery_player_game;
  submissions: getPlayerSubmissionsQuery_player_submissions[];
}

export interface getPlayerSubmissionsQuery {
  player: getPlayerSubmissionsQuery_player;
}

export interface getPlayerSubmissionsQueryVariables {
  gameId: string;
  userId: string;
}
