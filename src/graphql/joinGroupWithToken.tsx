import { gql } from "@apollo/client";

export const JOIN_GROUP_WITH_TOKEN = gql`
  mutation joinGroupWithToken($gameId: String!, $token: String!) {
    addToGroupWithToken(gameId: $gameId, token: $token) {
      id
      game {
        id
        name
      }
      user {
        username
      }
      group {
        id
        name
      }
    }
  }
`;
