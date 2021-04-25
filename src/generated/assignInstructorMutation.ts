/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: assignInstructorMutation
// ====================================================

export interface assignInstructorMutation_assignInstructor {
  __typename: "Game";
  id: string;
}

export interface assignInstructorMutation {
  assignInstructor: assignInstructorMutation_assignInstructor;
}

export interface assignInstructorMutationVariables {
  gameId: string;
  userId: string;
}
