import { gql } from "@apollo/client";

export const GET_ACTIVITY_BY_ID = gql`
  query getActivityById($gameId: String!, $activityId: String!) {
    activity(gameId: $gameId, activityId: $activityId) {
      id
      pdf
      statement
      editorKind
      name
      title
      codeSkeletons {
        extension
        code
      }
    }
  }
`;
