import { gql } from "@apollo/client";

export const GET_LATEST_SUBMISSION_AND_VALIDATION = gql`
  query getLatestSubmissionAndValidation(
    $gameId: String!
    $exerciseId: String!
  ) {
    latestValidation(gameId: $gameId, exerciseId: $exerciseId) {
      createdAt
      feedback
      result
      outputs
      language
      program
      id
    }
    latestSubmission(gameId: $gameId, exerciseId: $exerciseId) {
      createdAt
      feedback
      result
      language
      program
      id
    }
  }
`;
