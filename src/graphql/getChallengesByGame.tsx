import { gql } from "@apollo/client";

export const GET_CHALLENGES_BY_GAME = gql`
  query getGameChallenges($gameId: String!) {
    challenges(gameId: $gameId) {
      id
      name
      hidden
      refs {
        id
        name
      }
    }
  }
`;
