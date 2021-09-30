/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GameStateEnum } from "./globalTypes";

// ====================================================
// GraphQL query operation: getInstructorGames
// ====================================================

export interface getInstructorGames_myGames_players_submissions {
  __typename: "Submission";
  id: string;
}

export interface getInstructorGames_myGames_players_validations {
  __typename: "Validation";
  id: string;
}

export interface getInstructorGames_myGames_players_group {
  __typename: "Group";
  name: string;
}

export interface getInstructorGames_myGames_players_user {
  __typename: "User";
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  id: string | null;
}

export interface getInstructorGames_myGames_players_learningPath_refs {
  __typename: "ActivityStatus";
  solved: boolean | null;
}

export interface getInstructorGames_myGames_players_learningPath {
  __typename: "ChallengeStatus";
  refs: getInstructorGames_myGames_players_learningPath_refs[];
}

export interface getInstructorGames_myGames_players {
  __typename: "Player";
  submissions: getInstructorGames_myGames_players_submissions[];
  validations: getInstructorGames_myGames_players_validations[];
  points: number;
  group: getInstructorGames_myGames_players_group | null;
  user: getInstructorGames_myGames_players_user;
  learningPath: getInstructorGames_myGames_players_learningPath[];
}

export interface getInstructorGames_myGames {
  __typename: "Game";
  id: string;
  name: string;
  description: string | null;
  private: boolean;
  startDate: any | null;
  endDate: any | null;
  state: GameStateEnum;
  players: getInstructorGames_myGames_players[];
}

export interface getInstructorGames {
  myGames: getInstructorGames_myGames[];
}
