import { gql } from "@apollo/client";

export const REWARD_RECEIVED_STUDENT_SUB = gql`
  subscription rewardReceivedStudentSubscription($gameId: String!) {
    rewardReceivedStudent(gameId: $gameId) {
      count
      id
      reward {
        kind
        image
        name
        message
        description
      }
    }
  }
`;
