/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: allGameProfilesQuery
// ====================================================

export interface allGameProfilesQuery_allGameProfiles_game {
  __typename: "Game";
  id: string;
  name: string;
}

export interface allGameProfilesQuery_allGameProfiles_group {
  __typename: "Group";
  id: string;
  name: string;
}

export interface allGameProfilesQuery_allGameProfiles_rewards_reward {
  __typename: "Reward";
  name: string;
  description: string | null;
  createdAt: any;
}

export interface allGameProfilesQuery_allGameProfiles_rewards {
  __typename: "PlayerReward";
  id: string;
  reward: allGameProfilesQuery_allGameProfiles_rewards_reward;
}

export interface allGameProfilesQuery_allGameProfiles_stats {
  __typename: "PlayerStats";
  nrOfSubmissions: number;
  nrOfValidations: number;
  nrOfSubmissionsByActivity: any | null;
  nrOfValidationsByActivity: any | null;
  nrOfSubmissionsByActivityAndResult: any | null;
  nrOfValidationsByActivityAndResult: any | null;
}

export interface allGameProfilesQuery_allGameProfiles_submissions {
  __typename: "Submission";
  id: string;
}

export interface allGameProfilesQuery_allGameProfiles_validations {
  __typename: "Validation";
  id: string;
}

export interface allGameProfilesQuery_allGameProfiles_user {
  __typename: "User";
  id: string | null;
  email: string | null;
  emailVerified: boolean | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
}

export interface allGameProfilesQuery_allGameProfiles_learningPath {
  __typename: "ChallengeStatus";
  progress: number;
}

export interface allGameProfilesQuery_allGameProfiles {
  __typename: "Player";
  id: string;
  game: allGameProfilesQuery_allGameProfiles_game;
  group: allGameProfilesQuery_allGameProfiles_group | null;
  points: number;
  rewards: allGameProfilesQuery_allGameProfiles_rewards[];
  stats: allGameProfilesQuery_allGameProfiles_stats;
  submissions: allGameProfilesQuery_allGameProfiles_submissions[];
  validations: allGameProfilesQuery_allGameProfiles_validations[];
  user: allGameProfilesQuery_allGameProfiles_user;
  learningPath: allGameProfilesQuery_allGameProfiles_learningPath[];
}

export interface allGameProfilesQuery {
  allGameProfiles: allGameProfilesQuery_allGameProfiles[];
}

export interface allGameProfilesQueryVariables {
  userId: string;
}
