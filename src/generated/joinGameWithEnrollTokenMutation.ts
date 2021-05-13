/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { State } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: joinGameWithEnrollTokenMutation
// ====================================================

export interface joinGameWithEnrollTokenMutation_enrollWithToken_game {
  __typename: "Game";
  id: string;
  name: string;
}

export interface joinGameWithEnrollTokenMutation_enrollWithToken_user {
  __typename: "User";
  username: string | null;
}

export interface joinGameWithEnrollTokenMutation_enrollWithToken_submissions {
  __typename: "Submission";
  id: string;
  submittedAt: any;
}

export interface joinGameWithEnrollTokenMutation_enrollWithToken_learningPath {
  __typename: "ChallengeStatus";
  id: string;
  state: State;
}

export interface joinGameWithEnrollTokenMutation_enrollWithToken_rewards {
  __typename: "PlayerReward";
  id: string;
  count: number;
}

export interface joinGameWithEnrollTokenMutation_enrollWithToken {
  __typename: "Player";
  id: string;
  game: joinGameWithEnrollTokenMutation_enrollWithToken_game;
  user: joinGameWithEnrollTokenMutation_enrollWithToken_user;
  points: number;
  submissions: joinGameWithEnrollTokenMutation_enrollWithToken_submissions[];
  learningPath: joinGameWithEnrollTokenMutation_enrollWithToken_learningPath[];
  rewards: joinGameWithEnrollTokenMutation_enrollWithToken_rewards[];
  createdAt: any;
  updatedAt: any | null;
}

export interface joinGameWithEnrollTokenMutation {
  enrollWithToken: joinGameWithEnrollTokenMutation_enrollWithToken;
}

export interface joinGameWithEnrollTokenMutationVariables {
  token: string;
}
