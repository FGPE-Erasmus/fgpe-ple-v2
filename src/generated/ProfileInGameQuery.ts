/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { State, Result } from "./globalTypes";

// ====================================================
// GraphQL query operation: ProfileInGameQuery
// ====================================================

export interface ProfileInGameQuery_profileInGame_game {
  __typename: "Game";
  id: string;
  name: string;
}

export interface ProfileInGameQuery_profileInGame_user {
  __typename: "User";
  id: string | null;
  username: string | null;
}

export interface ProfileInGameQuery_profileInGame_group {
  __typename: "Group";
  id: string;
}

export interface ProfileInGameQuery_profileInGame_rewards_reward {
  __typename: "Reward";
  id: string;
  name: string;
}

export interface ProfileInGameQuery_profileInGame_rewards {
  __typename: "PlayerReward";
  id: string;
  reward: ProfileInGameQuery_profileInGame_rewards_reward;
  count: number;
}

export interface ProfileInGameQuery_profileInGame_learningPath_challenge_parentChallenge {
  __typename: "Challenge";
  id: string;
  name: string;
  description: string | null;
}

export interface ProfileInGameQuery_profileInGame_learningPath_challenge {
  __typename: "Challenge";
  id: string;
  name: string;
  description: string | null;
  parentChallenge: ProfileInGameQuery_profileInGame_learningPath_challenge_parentChallenge | null;
}

export interface ProfileInGameQuery_profileInGame_learningPath_refs_activity {
  __typename: "Activity";
  id: string | null;
}

export interface ProfileInGameQuery_profileInGame_learningPath_refs {
  __typename: "ActivityStatus";
  activity: ProfileInGameQuery_profileInGame_learningPath_refs_activity | null;
  solved: boolean | null;
}

export interface ProfileInGameQuery_profileInGame_learningPath {
  __typename: "ChallengeStatus";
  id: string;
  challenge: ProfileInGameQuery_profileInGame_learningPath_challenge;
  state: State;
  progress: number;
  startedAt: any | null;
  openedAt: any | null;
  endedAt: any | null;
  refs: ProfileInGameQuery_profileInGame_learningPath_refs[];
}

export interface ProfileInGameQuery_profileInGame_submissions {
  __typename: "Submission";
  id: string;
  exerciseId: string;
  result: Result | null;
  grade: number | null;
}

export interface ProfileInGameQuery_profileInGame {
  __typename: "Player";
  id: string;
  game: ProfileInGameQuery_profileInGame_game;
  user: ProfileInGameQuery_profileInGame_user;
  group: ProfileInGameQuery_profileInGame_group | null;
  points: number;
  rewards: ProfileInGameQuery_profileInGame_rewards[];
  learningPath: ProfileInGameQuery_profileInGame_learningPath[];
  submissions: ProfileInGameQuery_profileInGame_submissions[];
  createdAt: any;
  updatedAt: any | null;
}

export interface ProfileInGameQuery {
  profileInGame: ProfileInGameQuery_profileInGame;
}

export interface ProfileInGameQueryVariables {
  gameId: string;
}
