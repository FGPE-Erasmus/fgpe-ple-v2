import { Box } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { activityStatsAndChallengeNamesQuery } from "../../generated/activityStatsAndChallengeNamesQuery";
import { getGameByIdQuery_game_challenges_refs } from "../../generated/getGameByIdQuery";
import {
  getActivitiesList,
  getActivitiesStats,
} from "../InstructorGame/ActivitiesStats";
import RefreshCacheMenu from "../RefreshCacheMenu";
import TableComponent from "../TableComponent";
import ColumnFilter from "../TableComponent/ColumnFilter";

const statsData: activityStatsAndChallengeNamesQuery = {
  game: {
    id: "60e8ad92c88f75305c72d211",
    challenges: [
      {
        name: "3 Breaths a Beginner",
        refs: [
          {
            name: "Oddish or Evenish",
            id: "32897c1a-da97-40c2-a9f5-8305fc310750",
            __typename: "Activity",
          },
          {
            name: "Find the Smallest and Biggest Numbers",
            id: "3e766a76-bd5e-480b-800f-31d1611b1e73",
            __typename: "Activity",
          },
          {
            name: "Binary search",
            id: "ac123f69-a27e-433c-9455-480cf3f5c31d",
            __typename: "Activity",
          },
        ],
        __typename: "Challenge",
      },
      {
        name: "Ultimate Test",
        refs: [
          {
            name: "All About Anonymous Functions: Adding Suffixes",
            id: "db6a4f54-2aeb-4502-823a-92914aa8e60b",
            __typename: "Activity",
          },
        ],
        __typename: "Challenge",
      },
    ],
    __typename: "Game",
  },
  stats: {
    nrOfSubmissions: 14,
    nrOfValidations: 32,
    nrOfSubmissionsByActivity: {
      "32897c1a-da97-40c2-a9f5-8305fc310750": 6,
      "ac123f69-a27e-433c-9455-480cf3f5c31d": 2,
      "3e766a76-bd5e-480b-800f-31d1611b1e73": 5,
      "db6a4f54-2aeb-4502-823a-92914aa8e60b": 1,
    },
    nrOfValidationsByActivity: {
      "32897c1a-da97-40c2-a9f5-8305fc310750": 21,
      "ac123f69-a27e-433c-9455-480cf3f5c31d": 2,
      "3e766a76-bd5e-480b-800f-31d1611b1e73": 9,
    },
    nrOfSubmissionsByActivityAndResult: {
      "32897c1a-da97-40c2-a9f5-8305fc310750": {
        WRONG_ANSWER: 5,
        ACCEPT: 1,
      },
      "ac123f69-a27e-433c-9455-480cf3f5c31d": {
        ACCEPT: 2,
      },
      "3e766a76-bd5e-480b-800f-31d1611b1e73": {
        WRONG_ANSWER: 2,
        RUNTIME_ERROR: 2,
        ACCEPT: 1,
      },
      "db6a4f54-2aeb-4502-823a-92914aa8e60b": {
        ACCEPT: 1,
      },
    },
    nrOfValidationsByActivityAndResult: {
      "32897c1a-da97-40c2-a9f5-8305fc310750": {
        ACCEPT: 18,
        RUNTIME_ERROR: 3,
      },
      "ac123f69-a27e-433c-9455-480cf3f5c31d": {
        ACCEPT: 2,
      },
      "3e766a76-bd5e-480b-800f-31d1611b1e73": {
        RUNTIME_ERROR: 5,
        ACCEPT: 4,
      },
    },
    __typename: "Stats",
  },
};

const TutorialActivitesTable = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Box minH={200}>
        {statsData && (
          <TableComponent
            dataCy="activities-table"
            refreshData={(() => {}) as any}
            contextMenu={
              <RefreshCacheMenu loading={false} refetch={(() => {}) as any} />
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
    </div>
  );
};

export default TutorialActivitesTable;
