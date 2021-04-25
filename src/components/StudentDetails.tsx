import { gql, useQuery } from "@apollo/client";
import { Heading } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Box, Flex } from "reflexbox";
import { getUserDetails } from "../generated/getUserDetails";
import {
  checkIfConnectionAborted,
  SERVER_ERRORS,
} from "../utilities/ErrorMessages";
import withChangeAnimation from "../utilities/withChangeAnimation";
import Error from "./Error";

const GET_USER_DETAILS = gql`
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

const StudentDetails = () => {
  const { userId } = useParams<{ userId: string }>();

  const { data, error, loading } = useQuery<getUserDetails>(GET_USER_DETAILS, {
    variables: {
      userId: userId,
    },
    fetchPolicy: "no-cache",
    skip: !userId,
  });
  const { t } = useTranslation();

  if (!userId) {
    return <Error errorContent="No user id" />;
  }

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
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
          Student: {data?.user.firstName} {data?.user.lastName}
        </Heading>
      </Flex>
    </div>
  );
};

export default withChangeAnimation(StudentDetails);
