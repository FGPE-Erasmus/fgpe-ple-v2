/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RewardType } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: rewardReceivedStudentSubscription
// ====================================================

export interface rewardReceivedStudentSubscription_rewardReceivedStudent_reward {
  __typename: "Reward";
  kind: RewardType;
  image: string | null;
  name: string;
  message: string | null;
  description: string | null;
}

export interface rewardReceivedStudentSubscription_rewardReceivedStudent {
  __typename: "PlayerReward";
  count: number;
  id: string;
  reward: rewardReceivedStudentSubscription_rewardReceivedStudent_reward;
}

export interface rewardReceivedStudentSubscription {
  rewardReceivedStudent: rewardReceivedStudentSubscription_rewardReceivedStudent;
}

export interface rewardReceivedStudentSubscriptionVariables {
  gameId: string;
}
