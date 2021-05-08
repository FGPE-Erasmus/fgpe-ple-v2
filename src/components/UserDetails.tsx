import { gql, useQuery } from "@apollo/client";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Heading,
  Box,
  Flex,
  useColorMode,
} from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  allGameProfilesQuery,
  allGameProfilesQuery_allGameProfiles,
} from "../generated/allGameProfilesQuery";
import { getUserDetails } from "../generated/getUserDetails";
import { GET_ALL_GAME_PROFILES } from "../graphql/getAllGameProfiles";
import { GET_USER_DETAILS } from "../graphql/getUserDetails";
import {
  checkIfConnectionAborted,
  SERVER_ERRORS,
} from "../utilities/ErrorMessages";
import withChangeAnimation from "../utilities/withChangeAnimation";
import Error from "./Error";
import TableComponent from "./TableComponent";
import ColumnFilter from "./TableComponent/ColumnFilter";

const UserDetailCard = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  const { colorMode } = useColorMode();

  return (
    <Box
      width="100%"
      border="1px solid"
      borderColor={colorMode == "dark" ? "gray.700" : "gray.200"}
      padding={2}
      margin={{ base: 0, md: 2 }}
      marginBottom={{ base: 2, md: 2 }}
      borderRadius={4}
    >
      <Heading as="h4" size="sm" marginBottom={2}>
        {title}
      </Heading>
      {content}
    </Box>
  );
};

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

      <Flex
        margin="auto"
        width="100%"
        justifyContent="space-between"
        flexDirection={{ base: "column", md: "row" }}
      >
        <UserDetailCard
          title={"Name"}
          content={`${userData?.user.firstName} ${userData?.user.lastName}`}
        />

        <UserDetailCard
          title={"E-Mail"}
          content={userData?.user.email || "N/A"}
        />

        <UserDetailCard
          title={"E-Mail verified"}
          content={userData?.user.emailVerified ? "Yes" : "No"}
        />

        <UserDetailCard
          title={"Username"}
          content={userData?.user.username || "N/A"}
        />
      </Flex>

      <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
        {t("All game profiles")}
      </Heading>

      <Box>
        <TableComponent
          columns={[
            {
              Header: t("Game"),
              accessor: "game.name",
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter
                  column={column}
                  placeholder={t("placeholders.name")}
                />
              ),
            },
            {
              Header: t("Group"),
              accessor: "group.name",
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter
                  column={column}
                  placeholder={t("placeholders.name")}
                />
              ),
            },
            {
              Header: t("Points"),
              accessor: "points",
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter
                  column={column}
                  placeholder={t("placeholders.name")}
                />
              ),
            },
            {
              Header: t("Submissions"),
              accessor: (
                row: allGameProfilesQuery_allGameProfiles | undefined
              ) => {
                if (row) {
                  return row.submissions.length;
                }
              },
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter
                  column={column}
                  placeholder={t("placeholders.name")}
                />
              ),
            },
            ,
            {
              Header: t("Validations"),
              accessor: (
                row: allGameProfilesQuery_allGameProfiles | undefined
              ) => {
                if (row) {
                  return row.validations.length;
                }
              },
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter
                  column={column}
                  placeholder={t("placeholders.name")}
                />
              ),
            },
          ]}
          data={gameProfilesData?.allGameProfiles}
        />
      </Box>
    </div>
  );
};

export default withChangeAnimation(UserDetails);
