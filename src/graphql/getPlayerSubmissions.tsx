import { gql } from "@apollo/client";

export const GET_PLAYER_SUBMISSIONS = gql`
  query getPlayerSubmissionsQuery($gameId: String!, $userId: String!) {
    player(gameId: $gameId, userId: $userId) {
      id

      game {
        id
        name

        challenges {
          id
          name
          refs {
            id
            name
          }
        }
      }

      submissions {
        id
        submittedAt
        exerciseId
        language
        result
      }
    }
  }
`;
