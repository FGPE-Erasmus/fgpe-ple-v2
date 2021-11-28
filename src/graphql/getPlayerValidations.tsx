import { gql } from "@apollo/client";

export const GET_PLAYER_VALIDATIONS = gql`
  query getPlayerValidationsQuery($gameId: String!, $userId: String!) {
    player(gameId: $gameId, userId: $userId) {
      id

      validations {
        id
        submittedAt
        exerciseId
        language
        result
      }
    }
  }
`;
