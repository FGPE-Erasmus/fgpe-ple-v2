/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RewardType } from "./globalTypes";

// ====================================================
// GraphQL query operation: getPlayerRewardsQuery
// ====================================================

export interface getPlayerRewardsQuery_player_rewards_reward {
  __typename: "Reward";
  id: string;
  kind: RewardType;
  name: string;
  description: string | null;
}

export interface getPlayerRewardsQuery_player_rewards {
  __typename: "PlayerReward";
  id: string;
  reward: getPlayerRewardsQuery_player_rewards_reward;
}

export interface getPlayerRewardsQuery_player {
  __typename: "Player";
  id: string;
  rewards: getPlayerRewardsQuery_player_rewards[];
}

export interface getPlayerRewardsQuery {
  player: getPlayerRewardsQuery_player;
}

export interface getPlayerRewardsQueryVariables {
  gameId: string;
  userId: string;
}
