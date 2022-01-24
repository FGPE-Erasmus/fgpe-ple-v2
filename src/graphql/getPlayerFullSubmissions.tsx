import { gql } from "@apollo/client";

export const GET_PLAYER_FULL_SUBMISSIONS = gql`
  query getPlayerFullSubmissionsQuery(
    $gameId: String!
    $userId: String!
    $exerciseId: String
  ) {
    submissions(gameId: $gameId, userId: $userId, exerciseId: $exerciseId) {
      id
      player {
        id
      }
      exerciseId
      evaluationEngine
      evaluationEngineId
      language
      metrics
      result
      feedback
      submittedAt
      evaluatedAt
      program
      grade
    }
  }
`;
