/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Result } from "./globalTypes";

// ====================================================
// GraphQL query operation: getPlayerValidationsQuery
// ====================================================

export interface getPlayerValidationsQuery_player_game_groups {
  __typename: "Group";
  id: string;
  name: string;
  displayName: string | null;
}

export interface getPlayerValidationsQuery_player_game_challenges_refs {
  __typename: "Activity";
  id: string | null;
  name: string | null;
}

export interface getPlayerValidationsQuery_player_game_challenges {
  __typename: "Challenge";
  id: string;
  name: string;
  refs: getPlayerValidationsQuery_player_game_challenges_refs[];
}

export interface getPlayerValidationsQuery_player_game {
  __typename: "Game";
  id: string;
  name: string;
  groups: getPlayerValidationsQuery_player_game_groups[];
  challenges: getPlayerValidationsQuery_player_game_challenges[];
}

export interface getPlayerValidationsQuery_player_validations {
  __typename: "Validation";
  id: string;
  submittedAt: any;
  exerciseId: string;
  language: string | null;
  result: Result | null;
}

export interface getPlayerValidationsQuery_player {
  __typename: "Player";
  id: string;
  game: getPlayerValidationsQuery_player_game;
  validations: getPlayerValidationsQuery_player_validations[];
}

export interface getPlayerValidationsQuery {
  player: getPlayerValidationsQuery_player;
}

export interface getPlayerValidationsQueryVariables {
  gameId: string;
  userId: string;
}
