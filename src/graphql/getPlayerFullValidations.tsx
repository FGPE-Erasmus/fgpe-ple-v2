import { gql } from "@apollo/client";

export const GET_PLAYER_FULL_VALIDATIONS = gql`
  query getPlayerFullValidationsQuery(
    $gameId: String!
    $userId: String!
    $exerciseId: String
  ) {
    validations(gameId: $gameId, userId: $userId, exerciseId: $exerciseId) {
      id
      player {
        id
      }
      exerciseId
      evaluationEngine
      evaluationEngineId
      language
      metrics
      feedback
      submittedAt
      evaluatedAt
      program
      outputs
      result
      userExecutionTimes
    }
  }
`;
