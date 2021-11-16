/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RewardType, Result } from "./globalTypes";

// ====================================================
// GraphQL query operation: getPlayerQuery
// ====================================================

export interface getPlayerQuery_player_game_groups {
  __typename: "Group";
  id: string;
  name: string;
  displayName: string | null;
}

export interface getPlayerQuery_player_game_challenges_refs {
  __typename: "Activity";
  id: string | null;
  name: string | null;
  title: string | null;
}

export interface getPlayerQuery_player_game_challenges {
  __typename: "Challenge";
  id: string;
  name: string;
  refs: getPlayerQuery_player_game_challenges_refs[];
}

export interface getPlayerQuery_player_game {
  __typename: "Game";
  id: string;
  name: string;
  groups: getPlayerQuery_player_game_groups[];
  challenges: getPlayerQuery_player_game_challenges[];
}

export interface getPlayerQuery_player_user {
  __typename: "User";
  id: string | null;
  username: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface getPlayerQuery_player_group {
  __typename: "Group";
  id: string;
  name: string;
}

export interface getPlayerQuery_player_rewards_reward {
  __typename: "Reward";
  id: string;
  kind: RewardType;
  name: string;
  description: string | null;
}

export interface getPlayerQuery_player_rewards {
  __typename: "PlayerReward";
  id: string;
  reward: getPlayerQuery_player_rewards_reward;
}

export interface getPlayerQuery_player_stats {
  __typename: "PlayerStats";
  nrOfSubmissions: number;
  nrOfValidations: number;
  nrOfSubmissionsByActivity: any | null;
  nrOfValidationsByActivity: any | null;
  nrOfSubmissionsByActivityAndResult: any | null;
  nrOfValidationsByActivityAndResult: any | null;
}

export interface getPlayerQuery_player_submissions {
  __typename: "Submission";
  id: string;
  submittedAt: any;
  exerciseId: string;
  language: string | null;
  result: Result | null;
}

export interface getPlayerQuery_player_validations {
  __typename: "Validation";
  id: string;
  submittedAt: any;
  exerciseId: string;
  language: string | null;
  result: Result | null;
}

export interface getPlayerQuery_player {
  __typename: "Player";
  id: string;
  game: getPlayerQuery_player_game;
  user: getPlayerQuery_player_user;
  group: getPlayerQuery_player_group | null;
  points: number;
  rewards: getPlayerQuery_player_rewards[];
  stats: getPlayerQuery_player_stats;
  submissions: getPlayerQuery_player_submissions[];
  validations: getPlayerQuery_player_validations[];
}

export interface getPlayerQuery {
  player: getPlayerQuery_player;
}

export interface getPlayerQueryVariables {
  gameId: string;
  userId: string;
}
