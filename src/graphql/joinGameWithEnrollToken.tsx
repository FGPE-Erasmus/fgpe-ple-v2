import { gql } from "@apollo/client";

export const JOIN_GAME_WITH_ENROLL_TOKEN = gql`
  mutation joinGameWithEnrollTokenMutation($token: String!) {
    enrollWithToken(token: $token) {
      id
      game {
        id
        name
      }
      user {
        username
      }
      points
      submissions {
        id
        submittedAt
      }
      learningPath {
        id
        state
      }
      rewards {
        id
        count
      }
      createdAt
      updatedAt
    }
  }
`;
