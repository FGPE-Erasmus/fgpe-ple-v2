import { useQuery } from "@apollo/client";
import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import {
  allGameProfilesQuery,
  allGameProfilesQuery_allGameProfiles,
} from "../generated/allGameProfilesQuery";
import { getUserDetails } from "../generated/getUserDetails";
import { GET_ALL_GAME_PROFILES } from "../graphql/getAllGameProfiles";
import { GET_USER_DETAILS } from "../graphql/getUserDetails";
import { checkIfConnectionAborted } from "../utilities/ErrorMessages";
import withChangeAnimation from "../utilities/withChangeAnimation";
import DetailsCard from "./DetailsCard";
import Error from "./Error";
import TableComponent from "./TableComponent";
import ColumnFilter from "./TableComponent/ColumnFilter";

const UserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const history = useHistory();

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
        <DetailsCard
          title={t("Full name")}
          content={`${userData?.user.firstName} ${userData?.user.lastName}`}
        />

        <DetailsCard title={"E-Mail"} content={userData?.user.email || "N/A"} />

        <DetailsCard
          title={t("E-Mail verified")}
          content={userData?.user.emailVerified ? t("Yes") : t("No")}
        />

        <DetailsCard
          title={t("Username")}
          content={userData?.user.username || "N/A"}
        />
      </Flex>

      <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
        {t("All game profiles")}
      </Heading>

      <Box>
        <TableComponent
          onRowClick={(row: allGameProfilesQuery_allGameProfiles) => {
            history.push({
              pathname: `/teacher/player-details/${row.user.id}/${row.game.id}`,
            });
          }}
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
              Header: t("table.group"),
              accessor: "group.name",
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter
                  column={column}
                  placeholder={t("placeholders.name")}
                />
              ),
            },
            {
              Header: t("points"),
              accessor: "points",
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter
                  column={column}
                  placeholder={t("placeholders.name")}
                />
              ),
            },
            {
              Header: t("table.submissions"),
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
            {
              Header: t("table.validations"),
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
            {
              Header: t("Rewards"),
              accessor: (
                row: allGameProfilesQuery_allGameProfiles | undefined
              ) => {
                if (row) {
                  return row.rewards.length;
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
