import { gql } from "@apollo/client";

export const GET_GAME_PLAYERS = gql`
  query getGamePlayersQuery($gameId: String!) {
    game(id: $gameId) {
      players {
        group {
          name
        }

        id

        user {
          id
          firstName
          lastName
        }
      }
    }
  }
`;
