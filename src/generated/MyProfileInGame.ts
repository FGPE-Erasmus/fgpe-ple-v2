/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { State, Result } from "./globalTypes";

// ====================================================
// GraphQL query operation: MyProfileInGame
// ====================================================

export interface MyProfileInGame_profileInGame_game {
  __typename: "Game";
  id: string;
  name: string;
}

export interface MyProfileInGame_profileInGame_user {
  __typename: "User";
  id: string | null;
  username: string | null;
}

export interface MyProfileInGame_profileInGame_group {
  __typename: "Group";
  id: string;
}

export interface MyProfileInGame_profileInGame_rewards_reward {
  __typename: "Reward";
  id: string;
  name: string;
}

export interface MyProfileInGame_profileInGame_rewards {
  __typename: "PlayerReward";
  id: string;
  reward: MyProfileInGame_profileInGame_rewards_reward;
  count: number;
}

export interface MyProfileInGame_profileInGame_learningPath_challenge {
  __typename: "Challenge";
  id: string;
}

export interface MyProfileInGame_profileInGame_learningPath {
  __typename: "ChallengeStatus";
  id: string;
  challenge: MyProfileInGame_profileInGame_learningPath_challenge;
  state: State;
  startedAt: any | null;
  openedAt: any | null;
  endedAt: any | null;
}

export interface MyProfileInGame_profileInGame_submissions {
  __typename: "Submission";
  id: string;
  exerciseId: string;
  result: Result | null;
  grade: number | null;
}

export interface MyProfileInGame_profileInGame {
  __typename: "Player";
  id: string;
  game: MyProfileInGame_profileInGame_game;
  user: MyProfileInGame_profileInGame_user;
  group: MyProfileInGame_profileInGame_group | null;
  points: number;
  rewards: MyProfileInGame_profileInGame_rewards[];
  learningPath: MyProfileInGame_profileInGame_learningPath[];
  submissions: MyProfileInGame_profileInGame_submissions[];
  createdAt: any;
  updatedAt: any | null;
}

export interface MyProfileInGame {
  profileInGame: MyProfileInGame_profileInGame;
}

export interface MyProfileInGameVariables {
  gameId: string;
}
