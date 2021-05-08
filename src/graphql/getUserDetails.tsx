import { gql } from "@apollo/client";

export const GET_USER_DETAILS = gql`
  query getUserDetails($userId: String!) {
    user(id: $userId) {
      id
      emailVerified
      username
      firstName
      lastName
      username
      email
    }
  }
`;
