/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: changeGameStartDateMutation
// ====================================================

export interface changeGameStartDateMutation_changeStartDate {
  __typename: "Game";
  id: string;
}

export interface changeGameStartDateMutation {
  changeStartDate: changeGameStartDateMutation_changeStartDate;
}

export interface changeGameStartDateMutationVariables {
  startDate: any;
  gameId: string;
}
