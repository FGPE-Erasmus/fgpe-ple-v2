/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getSubmissionByIdQuery
// ====================================================

export interface getSubmissionByIdQuery_submission {
  __typename: "Submission";
  id: string;
  feedback: string | null;
  program: string | null;
}

export interface getSubmissionByIdQuery {
  submission: getSubmissionByIdQuery_submission;
}

export interface getSubmissionByIdQueryVariables {
  gameId: string;
  submissionId: string;
}
