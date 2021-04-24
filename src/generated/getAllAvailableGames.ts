/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EvaluationEngine } from "./globalTypes";

// ====================================================
// GraphQL query operation: getAllAvailableGames
// ====================================================

export interface getAllAvailableGames_games_instructors {
  __typename: "User";
  email: string | null;
  id: string | null;
}

export interface getAllAvailableGames_games {
  __typename: "Game";
  id: string;
  name: string;
  description: string | null;
  gedilLayerId: string | null;
  gedilLayerDescription: string | null;
  startDate: any | null;
  endDate: any | null;
  createdAt: any;
  updatedAt: any | null;
  evaluationEngine: EvaluationEngine;
  private: boolean;
  instructors: getAllAvailableGames_games_instructors[];
}

export interface getAllAvailableGames {
  games: getAllAvailableGames_games[];
}
