import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useTranslation } from "react-i18next";
import { getInstructorGames } from "../generated/getInstructorGames";
import { checkIfConnectionAborted } from "../utilities/ErrorMessages";
import withChangeAnimation from "../utilities/withChangeAnimation";
import Error from "./Error";
import InstructorGames from "./InstructorGames";
import TeacherStudents from "./TeacherStudents";

const INSTRUCTOR_GAMES = gql`
  query getInstructorGames {
    myGames {
      id
      name
      description
      private
      startDate
      endDate
      state
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
          firstName
          lastName
          email
          id
        }

        learningPath {
          progress
        }
      }
    }
  }
`;

const TeacherProfile = () => {
  const { data, error, loading, refetch } = useQuery<getInstructorGames>(
    INSTRUCTOR_GAMES,
    {
      fetchPolicy: "no-cache",
    }
  );
  const { t } = useTranslation();

  if (!loading && error) {
    const isServerConnectionError = checkIfConnectionAborted(error);

    if (isServerConnectionError) {
      return <Error serverConnectionError />;
    } else {
      return <Error errorContent={JSON.stringify(error)} />;
    }
  }

  if (loading) {
    return <div>{t("Loading")}</div>;
  }

  return (
    <div>
      <InstructorGames data={data} refetch={refetch} />
      <TeacherStudents gamesData={data} />
    </div>
  );
};

export default withChangeAnimation(TeacherProfile);
