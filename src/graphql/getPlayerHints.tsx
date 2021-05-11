import { gql } from "@apollo/client";

export const GET_PLAYER_HINTS = gql`
  query playerHintsQuery($gameId: String!, $challengeId: String!) {
    playerHints(gameId: $gameId, challengeId: $challengeId) {
      id
      game {
        name
      }
      parentChallenge {
        id
        name
      }
      name
      description
      cost
      recurrent
      createdAt
      updatedAt
    }
  }
`;
