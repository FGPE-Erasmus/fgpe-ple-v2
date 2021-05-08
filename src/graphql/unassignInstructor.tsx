import { gql } from "@apollo/client";

export const UNASSIGN_INSTRUCTOR = gql`
  mutation unassignInstructorMutation($userId: String!, $gameId: String!) {
    unassignInstructor(userId: $userId, gameId: $gameId) {
      id
    }
  }
`;
