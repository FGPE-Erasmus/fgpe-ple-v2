/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getInstructorGames
// ====================================================

export interface getInstructorGames_games_players_submissions {
  __typename: "Submission";
  id: string;
}

export interface getInstructorGames_games_players_validations {
  __typename: "Validation";
  id: string;
}

export interface getInstructorGames_games_players_group {
  __typename: "Group";
  name: string;
}

export interface getInstructorGames_games_players_user {
  __typename: "User";
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

export interface getInstructorGames_games_players_learningPath_refs {
  __typename: "ActivityStatus";
  solved: boolean | null;
}

export interface getInstructorGames_games_players_learningPath {
  __typename: "ChallengeStatus";
  refs: getInstructorGames_games_players_learningPath_refs[];
}

export interface getInstructorGames_games_players {
  __typename: "Player";
  submissions: getInstructorGames_games_players_submissions[];
  validations: getInstructorGames_games_players_validations[];
  points: number;
  group: getInstructorGames_games_players_group | null;
  user: getInstructorGames_games_players_user;
  learningPath: getInstructorGames_games_players_learningPath[];
}

export interface getInstructorGames_games {
  __typename: "Game";
  id: string;
  name: string;
  description: string | null;
  players: getInstructorGames_games_players[];
}

export interface getInstructorGames {
  games: getInstructorGames_games[];
}
