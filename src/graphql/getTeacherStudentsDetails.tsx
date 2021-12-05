import { gql } from "@apollo/client";

export const GET_TEACHER_STUDENTS_DETAILS = gql`
  query getTeacherStudentsDetails {
    myGames {
      id
      name
      players {
        stats {
          nrOfSubmissions
          nrOfValidations
        }

        # points

        group {
          name
        }
        user {
          id
          lastName
          firstName
        }

        learningPath {
          progress
        }
      }
    }
  }
`;
