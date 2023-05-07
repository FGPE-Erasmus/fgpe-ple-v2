import { gql } from "@apollo/client";

/**
 * This is a smaller version of the query getTeacherStudentsDetails (no progress and no stats)
 */
export const GET_TEACHER_STUDENTS_DETAILS_SMALL = gql`
  query getTeacherStudentsDetailsSmall {
    myGames {
      id
      name
      players {
        group {
          name
        }
        user {
          id
          lastName
          firstName
        }
      }
    }
  }
`;
