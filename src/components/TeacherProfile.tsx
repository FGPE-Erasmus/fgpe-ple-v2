import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useTranslation } from "react-i18next";
import { getInstructorGames } from "../generated/getInstructorGames";
import withChangeAnimation from "../utilities/withChangeAnimation";
import GamesList from "./GamesList";
import InstructorGames from "./InstructorGames";
import TeacherStudents from "./TeacherStudents";
import Error from "./Error";
import { SERVER_ERRORS } from "../utilities/ErrorMessages";

const INSTRUCTOR_GAMES = gql`
  query getInstructorGames {
    games {
      id
      name
      description
      players {
        submissions {
          id
        }
        validations {
          id
        }
        points
        group {
          name
        }
        user {
          firstName
          lastName
          email
        }

        learningPath {
          refs {
            solved
          }
        }
      }
    }
  }
`;

const TeacherProfile = () => {
  const { data, error, loading } = useQuery<getInstructorGames>(
    INSTRUCTOR_GAMES,
    {
      fetchPolicy: "no-cache",
    }
  );
  const { t } = useTranslation();

  if (!loading && error) {
    const isServerConnectionError = error.graphQLErrors[0].message.includes(
      SERVER_ERRORS.ECONNABORTED
    );

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
      <InstructorGames data={data} />
      <TeacherStudents gamesData={data} />
    </div>
  );
};

export default withChangeAnimation(TeacherProfile);
