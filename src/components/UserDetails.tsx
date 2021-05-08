import { gql, useQuery } from "@apollo/client";
import { Heading } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Box, Flex } from "reflexbox";
import { allGameProfilesQuery } from "../generated/allGameProfilesQuery";
import { getUserDetails } from "../generated/getUserDetails";
import { GET_ALL_GAME_PROFILES } from "../graphql/getAllGameProfiles";
import { GET_USER_DETAILS } from "../graphql/getUserDetails";
import {
  checkIfConnectionAborted,
  SERVER_ERRORS,
} from "../utilities/ErrorMessages";
import withChangeAnimation from "../utilities/withChangeAnimation";
import Error from "./Error";

const UserDetails = () => {
  const { userId } = useParams<{ userId: string }>();

  const {
    data: userData,
    error: userError,
    loading: userLoading,
  } = useQuery<getUserDetails>(GET_USER_DETAILS, {
    variables: {
      userId: userId,
    },
    fetchPolicy: "no-cache",
    skip: !userId,
  });

  const {
    data: gameProfilesData,
    error: gameProfilesError,
    loading: gameProfilesLoading,
  } = useQuery<allGameProfilesQuery>(GET_ALL_GAME_PROFILES, {
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

  if (!userLoading && userError) {
    const isServerConnectionError = checkIfConnectionAborted(userError);

    if (isServerConnectionError) {
      return <Error serverConnectionError />;
    } else {
      return <Error errorContent={JSON.stringify(userError)} />;
    }
  }

  if (!gameProfilesLoading && gameProfilesError) {
    const isServerConnectionError = checkIfConnectionAborted(gameProfilesError);

    if (isServerConnectionError) {
      return <Error serverConnectionError />;
    } else {
      return <Error errorContent={JSON.stringify(gameProfilesError)} />;
    }
  }

  if (userLoading || gameProfilesLoading) {
    return <div>{t("Loading")}</div>;
  }

  console.log("data", gameProfilesData);

  return (
    <div>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
          User: {userData?.user.firstName} {userData?.user.lastName}
        </Heading>
      </Flex>

      <Box>This section is not ready yet.</Box>
    </div>
  );
};

export default withChangeAnimation(UserDetails);
