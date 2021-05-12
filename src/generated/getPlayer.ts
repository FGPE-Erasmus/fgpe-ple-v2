/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RewardType, Result } from "./globalTypes";

// ====================================================
// GraphQL query operation: getPlayer
// ====================================================

export interface getPlayer_player_game {
  __typename: "Game";
  id: string;
  name: string;
}

export interface getPlayer_player_user {
  __typename: "User";
  id: string | null;
  username: string | null;
  email: string | null;
}

export interface getPlayer_player_group {
  __typename: "Group";
  id: string;
  name: string;
}

export interface getPlayer_player_rewards_reward {
  __typename: "Reward";
  id: string;
  kind: RewardType;
  name: string;
  description: string | null;
}

export interface getPlayer_player_rewards {
  __typename: "PlayerReward";
  id: string;
  reward: getPlayer_player_rewards_reward;
}

export interface getPlayer_player_stats {
  __typename: "PlayerStats";
  nrOfSubmissions: number;
  nrOfValidations: number;
  nrOfSubmissionsByActivity: any | null;
  nrOfValidationsByActivity: any | null;
  nrOfSubmissionsByActivityAndResult: any | null;
  nrOfValidationsByActivityAndResult: any | null;
}

export interface getPlayer_player_submissions {
  __typename: "Submission";
  id: string;
  submittedAt: any;
  exerciseId: string;
  feedback: string | null;
  language: string | null;
  metrics: any | null;
  program: string | null;
  result: Result | null;
}

export interface getPlayer_player_validations {
  __typename: "Validation";
  id: string;
  submittedAt: any;
  exerciseId: string;
  feedback: string | null;
  language: string | null;
  metrics: any | null;
  program: string | null;
  result: Result | null;
  outputs: any | null;
}

export interface getPlayer_player {
  __typename: "Player";
  id: string;
  game: getPlayer_player_game;
  user: getPlayer_player_user;
  group: getPlayer_player_group | null;
  points: number;
  rewards: getPlayer_player_rewards[];
  stats: getPlayer_player_stats;
  submissions: getPlayer_player_submissions[];
  validations: getPlayer_player_validations[];
}

export interface getPlayer {
  player: getPlayer_player;
}

export interface getPlayerVariables {
  gameId: string;
  userId: string;
}
