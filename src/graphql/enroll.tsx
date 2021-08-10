import { gql } from "@apollo/client";

export const ENROLL = gql`
  mutation enrollMutation($gameId: String!) {
    enroll(gameId: $gameId) {
      id
    }
  }
`;
