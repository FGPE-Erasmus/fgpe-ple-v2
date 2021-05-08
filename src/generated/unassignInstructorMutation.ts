/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: unassignInstructorMutation
// ====================================================

export interface unassignInstructorMutation_unassignInstructor {
  __typename: "Game";
  id: string;
}

export interface unassignInstructorMutation {
  unassignInstructor: unassignInstructorMutation_unassignInstructor;
}

export interface unassignInstructorMutationVariables {
  userId: string;
  gameId: string;
}
