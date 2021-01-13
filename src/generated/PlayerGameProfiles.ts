/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PlayerGameProfiles
// ====================================================

export interface PlayerGameProfiles_myGameProfiles_game {
  __typename: "Game";
  id: string;
  name: string;
  description: string | null;
}

export interface PlayerGameProfiles_myGameProfiles_user {
  __typename: "User";
  id: string | null;
  username: string | null;
  email: string | null;
}

export interface PlayerGameProfiles_myGameProfiles_group {
  __typename: "Group";
  id: string;
  name: string;
}

export interface PlayerGameProfiles_myGameProfiles_rewards_reward {
  __typename: "Reward";
  id: string;
  name: string;
  description: string | null;
  image: string | null;
}

export interface PlayerGameProfiles_myGameProfiles_rewards {
  __typename: "PlayerReward";
  id: string;
  reward: PlayerGameProfiles_myGameProfiles_rewards_reward;
}

export interface PlayerGameProfiles_myGameProfiles {
  __typename: "Player";
  id: string;
  game: PlayerGameProfiles_myGameProfiles_game;
  user: PlayerGameProfiles_myGameProfiles_user;
  group: PlayerGameProfiles_myGameProfiles_group | null;
  rewards: PlayerGameProfiles_myGameProfiles_rewards[];
}

export interface PlayerGameProfiles {
  myGameProfiles: PlayerGameProfiles_myGameProfiles[];
}
