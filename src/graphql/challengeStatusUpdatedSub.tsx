import { gql } from "@apollo/client";

export const CHALLENGE_STATUS_UPDATED_STUDENT_SUB = gql`
  subscription challengeStatusUpdatedStudentSub($gameId: String!) {
    challengeStatusUpdatedStudent(gameId: $gameId) {
      openedAt
      endedAt
      startedAt
      state
    }
  }
`;
