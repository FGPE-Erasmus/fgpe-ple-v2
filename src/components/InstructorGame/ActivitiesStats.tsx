import { Box } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { gameDetailsGetGameByIdQuery } from "../../generated/gameDetailsGetGameByIdQuery";
import { getGameByIdQuery_game_challenges_refs } from "../../generated/getGameByIdQuery";
import { getOverallStats } from "../../generated/getOverallStats";
import Error from "../Error";
import TableComponent from "../TableComponent";
import ColumnFilter from "../TableComponent/ColumnFilter";

const getActivitiesList = (gameData: gameDetailsGetGameByIdQuery) => {
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
  statsData: getOverallStats,
  activitiesList: getGameByIdQuery_game_challenges_refs[]
) => {
  const stats = statsData.stats;

  // console.log("stats", stats);
  let activitiesStatsArray: StatsInterface[] = [];

  activitiesList.forEach(({ name }) => {
    if (name) {
      const activityWithStats: StatsInterface = {
        id: name,
        nrOfSubmissionsByActivity: stats.nrOfSubmissionsByActivity[name]
          ? stats.nrOfSubmissionsByActivity[name]
          : 0,
        nrOfSubmissionsByActivityAndResult: stats
          .nrOfSubmissionsByActivityAndResult[name]
          ? stats.nrOfSubmissionsByActivityAndResult[name]
          : 0,
      };

      activitiesStatsArray.push(activityWithStats);
    }
  });

  return activitiesStatsArray;
};

const ActivitiesStats = ({
  gameData,
  gameId,
  statsData,
}: {
  gameData: gameDetailsGetGameByIdQuery;
  gameId: string;
  statsData: getOverallStats | undefined;
}) => {
  const { t } = useTranslation();

  const activitiesList = getActivitiesList(gameData);
  // const {
  //   data: statsData,
  //   error: statsError,
  //   loading: statsLoading,
  // } = useQuery<getOverallStats>(GET_OVERALL_STATS, {
  //   variables: {
  //     gameId,
  //   },
  //   skip: !gameId,
  //   fetchPolicy: "network-only",
  // });

  // if (statsLoading) {
  //   return <div>{t("Loading")}</div>;
  // }

  // if (statsError) {
  //   return <Error errorContent={JSON.stringify(statsError)} />;
  // }

  if (!statsData) {
    return <Error errorContent={"Couldn't load data"} />;
  }

  const activitesStats = getActivitiesStats(statsData, activitiesList);

  // const exercisesStats = getExerciseStats(gameData, challengesData);

  return (
    <Box>
      <TableComponent
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
        data={activitesStats}
      />
    </Box>
  );
};

export default ActivitiesStats;
