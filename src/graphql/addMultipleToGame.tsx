import { gql } from "@apollo/client";

export const ADD_MULTIPLE_TO_GAME = gql`
  mutation addMultipleToGameMutation($gameId: String!, $usersIds: [String!]!) {
    addMultipleToGame(gameId: $gameId, usersIds: $usersIds) {
      id
    }
  }
`;
