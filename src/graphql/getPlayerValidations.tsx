import { gql } from "@apollo/client";

export const GET_PLAYER_VALIDATIONS = gql`
  query getPlayerValidationsQuery($gameId: String!, $userId: String!) {
    player(gameId: $gameId, userId: $userId) {
      id

      game {
        id
        name
        groups {
          id
          name
          displayName
        }

        challenges {
          id
          name
          refs {
            id
            name
          }
        }
      }

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
