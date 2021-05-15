/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: changeGameEndDateMutation
// ====================================================

export interface changeGameEndDateMutation_changeEndDate {
  __typename: "Game";
  id: string;
}

export interface changeGameEndDateMutation {
  changeEndDate: changeGameEndDateMutation_changeEndDate;
}

export interface changeGameEndDateMutationVariables {
  endDate: any;
  gameId: string;
}
