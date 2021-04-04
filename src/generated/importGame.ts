/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EvaluationEngine } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: importGame
// ====================================================

export interface importGame_importGEdILArchive {
  __typename: "Game";
  id: string;
  name: string;
  description: string | null;
  courseId: string;
  gedilLayerId: string | null;
  gedilLayerDescription: string | null;
  startDate: any | null;
  endDate: any | null;
  evaluationEngine: EvaluationEngine;
}

export interface importGame {
  importGEdILArchive: importGame_importGEdILArchive;
}

export interface importGameVariables {
  file: any;
  gameName: string;
  courseId: string;
  evaluationEngine: string;
  gameDescription?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}
