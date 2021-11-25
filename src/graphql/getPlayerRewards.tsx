import { gql } from "@apollo/client";

export const GET_PLAYER_REWARDS = gql`
  query getPlayerRewardsQuery($gameId: String!, $userId: String!) {
    player(gameId: $gameId, userId: $userId) {
      id
      rewards {
        id
        reward {
          id
          kind
          name
          description
        }
      }
    }
  }
`;
