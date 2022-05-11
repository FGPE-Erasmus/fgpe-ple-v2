import { useQuery } from "@apollo/client";
import { Box, Flex, Heading } from "@chakra-ui/react";
import React, { useMemo } from "react";
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
import RefreshCacheMenu from "./RefreshCacheMenu";
import TableComponent from "./TableComponent";
import ColumnFilter from "./TableComponent/ColumnFilter";

const UserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const history = useHistory();
  const memoizedSorting = useMemo(
    () => (rowA: any, rowB: any) => {
      const a =
        rowA.original.learningPath
          .flatMap((learningPath: any) => learningPath.progress)
          .reduce((a: any, b: any) => a + b, 0) /
        rowA.original.learningPath.length;

      const b =
        rowB.original.learningPath
          .flatMap((learningPath: any) => learningPath.progress)
          .reduce((a: any, b: any) => a + b, 0) /
        rowB.original.learningPath.length;

      if (a > b) return 1;

      if (b > a) return -1;

      return 0;
    },
    []
  );

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
    refetch: refetchGameProfiles,
  } = useQuery<allGameProfilesQuery>(GET_ALL_GAME_PROFILES, {
    variables: {
      userId: userId,
    },
    fetchPolicy: "cache-first",
    skip: !userId,
  });

  const { t } = useTranslation();

  if (!userId) {
    return <Error />;
  }

  if (!userLoading && userError) {
    const isServerConnectionError = checkIfConnectionAborted(userError);

    if (isServerConnectionError) {
      return <Error serverConnectionError />;
    } else {
      return <Error errorContent={userError} />;
    }
  }

  if (!gameProfilesLoading && gameProfilesError) {
    const isServerConnectionError = checkIfConnectionAborted(gameProfilesError);

    if (isServerConnectionError) {
      return <Error serverConnectionError />;
    } else {
      return <Error errorContent={gameProfilesError} />;
    }
  }

  if (userLoading || gameProfilesLoading) {
    return <div>{t("Loading")}</div>;
  }

  console.log("data", gameProfilesData?.allGameProfiles);

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

      <Flex justifyContent="space-between" alignItems="center"></Flex>
      <Box>
        <TableComponent
          tableHeader={
            <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
              {t("All game profiles")}
            </Heading>
          }
          refreshData={refetchGameProfiles}
          contextMenu={
            <RefreshCacheMenu
              loading={gameProfilesLoading}
              refetch={refetchGameProfiles}
            />
          }
          onRowClick={(row: allGameProfilesQuery_allGameProfiles) => {
            history.push({
              pathname: `/teacher/player-details/${userData?.user.id}/${row.game.id}`,
            });
          }}
          columns={[
            {
              Header: t("Game"),
              accessor: "game.name",
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter column={column} placeholder={"abc"} />
              ),
            },
            {
              Header: t("table.group"),
              accessor: "group.name",
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter column={column} placeholder={"abc"} />
              ),
            },
            {
              Header: t("points"),
              accessor: "points",
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter column={column} placeholder={"abc"} />
              ),
            },
            {
              Header: t("table.submissions"),
              accessor: (
                row: allGameProfilesQuery_allGameProfiles | undefined
              ) => {
                if (row) {
                  return row.stats.nrOfSubmissions;
                }
              },
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter column={column} placeholder={"abc"} />
              ),
            },
            {
              Header: t("table.validations"),
              accessor: (
                row: allGameProfilesQuery_allGameProfiles | undefined
              ) => {
                if (row) {
                  return row.stats.nrOfValidations;
                }
              },
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter column={column} placeholder={"abc"} />
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
                <ColumnFilter column={column} placeholder={"abc"} />
              ),
            },
            {
              Header: t("table.progress"),
              accessor: "learningPath",
              Cell: ({ value }: { value: any }) => {
                const totalChallengesCount = value.length || 1;

                const progressCombined =
                  value
                    .flatMap((learningPath: any) => learningPath.progress)
                    .reduce((a: any, b: any) => a + b, 0) /
                  totalChallengesCount;

                return (progressCombined * 100).toFixed(1) + "%";
              },
              disableFilters: true,
              sortType: memoizedSorting,
            },
          ]}
          data={gameProfilesData?.allGameProfiles}
        />
      </Box>
    </div>
  );
};

export default withChangeAnimation(UserDetails);
