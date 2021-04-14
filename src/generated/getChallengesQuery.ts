/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Difficulty, Mode } from "./globalTypes";

// ====================================================
// GraphQL query operation: getChallengesQuery
// ====================================================

export interface getChallengesQuery_challenges_refs {
  __typename: "Activity";
  id: string | null;
}

export interface getChallengesQuery_challenges {
  __typename: "Challenge";
  id: string;
  name: string;
  description: string | null;
  difficulty: Difficulty;
  mode: Mode;
  modeParameters: string[];
  locked: boolean;
  hidden: boolean;
  refs: getChallengesQuery_challenges_refs[];
}

export interface getChallengesQuery {
  challenges: getChallengesQuery_challenges[];
}

export interface getChallengesQueryVariables {
  gameId: string;
}
