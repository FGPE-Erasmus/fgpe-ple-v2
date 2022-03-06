import { useQuery } from "@apollo/client";
import { Box, Skeleton } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { activityStatsAndChallengeNamesQuery } from "../../generated/activityStatsAndChallengeNamesQuery";
import { getGameByIdQuery_game_challenges_refs } from "../../generated/getGameByIdQuery";
import { GET_ACTIVITY_STATS_AND_CHALLENGE_NAMES } from "../../graphql/getActivityStatsAndChallengeNames";
import { checkIfConnectionAborted } from "../../utilities/ErrorMessages";
import Error from "../Error";
import RefreshCacheMenu from "../RefreshCacheMenu";
import TableComponent from "../TableComponent";
import ColumnFilter from "../TableComponent/ColumnFilter";

const getActivitiesList = (gameData: activityStatsAndChallengeNamesQuery) => {
  let activities: getGameByIdQuery_game_challenges_refs[] = [];
  gameData.game.challenges.forEach((challenge) => {
    challenge.refs.forEach((ref) => {
      activities.push(ref);
    });
  });

  return activities;
};

interface StatsInterface {
  id: string;
  nrOfSubmissionsByActivity: number;
  nrOfSubmissionsByActivityAndResult: { ACCEPT: number; WRONG_ANSWER: number };
}

const getActivitiesStats = (
  statsData: activityStatsAndChallengeNamesQuery,
  activitiesList: getGameByIdQuery_game_challenges_refs[]
) => {
  const stats = statsData.stats;
  let activitiesStatsArray: StatsInterface[] = [];

  activitiesList.forEach(({ name, id }) => {
    if (name && id) {
      const activityWithStats: StatsInterface = {
        id: name,
        nrOfSubmissionsByActivity: stats.nrOfSubmissionsByActivity[id]
          ? stats.nrOfSubmissionsByActivity[id]
          : 0,
        nrOfSubmissionsByActivityAndResult: stats
          .nrOfSubmissionsByActivityAndResult[id]
          ? stats.nrOfSubmissionsByActivityAndResult[id]
          : 0,
      };

      activitiesStatsArray.push(activityWithStats);
    }
  });

  return activitiesStatsArray;
};

const ActivitiesStats = ({ gameId }: { gameId: string }) => {
  const { t } = useTranslation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: statsData,
    error: statsError,
    loading: statsLoading,
    refetch: refetchStats,
  } = useQuery<activityStatsAndChallengeNamesQuery>(
    GET_ACTIVITY_STATS_AND_CHALLENGE_NAMES,
    {
      variables: {
        gameId,
      },
      skip: !gameId,
      fetchPolicy: "cache-first",
      onError: async (err) => {
        const isServerConnectionError = checkIfConnectionAborted(err);
        if (isServerConnectionError) {
          setIsRefreshing(true);
          await refetchStats();
          setIsRefreshing(false);
        }
      },
    }
  );

  if (!statsData && !statsLoading) {
    return <Error errorContent={"Couldn't load data"} />;
  }

  return (
    <Box>
      <AnimatePresence>
        {statsError && !isRefreshing && (
          <motion.div
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{ maxHeight: 50, opacity: 1 }}
            exit={{ maxHeight: 0, opacity: 0 }}
            style={{ width: "100%", textAlign: "center" }}
          >
            {t("error.title")}
            <br /> {t("error.description")}
          </motion.div>
        )}
      </AnimatePresence>
      <Skeleton isLoaded={!statsLoading && !statsError}>
        <Box minH={200}>
          {statsData && !statsLoading && !statsError && (
            <TableComponent
              refreshData={refetchStats}
              contextMenu={
                <RefreshCacheMenu
                  loading={statsLoading}
                  refetch={refetchStats}
                />
              }
              columns={[
                {
                  Header: t("table.Exercise"),
                  accessor: "id",
                  Filter: ({ column }: { column: any }) => (
                    <ColumnFilter
                      column={column}
                      placeholder={t("placeholders.exercise")}
                    />
                  ),
                },
                {
                  Header: t("table.totalSubmissions"),
                  accessor: "nrOfSubmissionsByActivity",
                  disableFilters: true,
                },
                {
                  Header: t("table.acceptedResults"),
                  accessor: "nrOfSubmissionsByActivityAndResult.ACCEPT",
                  Cell: ({ value }: { value: any }) => (value ? value : 0),
                  disableFilters: true,
                },
                {
                  Header: t("table.difficulty"),
                  accessor: (row: any) => {
                    // console.log("row", row);
                    const acceptedSubmissions =
                      row.nrOfSubmissionsByActivityAndResult.ACCEPT || 0;
                    const totalSubmissions = row.nrOfSubmissionsByActivity;

                    return `${
                      totalSubmissions > 0
                        ? `${(
                            100 -
                            (acceptedSubmissions / totalSubmissions) * 100
                          ).toFixed(1)}%`
                        : "-"
                    }`;
                  },
                  disableFilters: true,
                },
              ]}
              data={getActivitiesStats(statsData, getActivitiesList(statsData))}
            />
          )}
        </Box>
      </Skeleton>
    </Box>
  );
};

export default ActivitiesStats;
