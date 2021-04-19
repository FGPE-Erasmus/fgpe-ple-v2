import { gql, useQuery } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { getGameByIdQuery } from "../../generated/getGameByIdQuery";
import ColumnFilter from "../TableComponent/ColumnFilter";
import TableComponent from "../TableComponent";
import Error from "../Error";
import { getChallengesQuery } from "../../generated/getChallengesQuery";

const GET_CHALLENGES = gql`
  query getChallengesQuery($gameId: String!) {
    challenges(gameId: $gameId) {
      id
      name
      refs {
        id
      }
    }
  }
`;

const ExercisesStats = ({
  gameData,
  gameId,
}: {
  gameData: getGameByIdQuery;
  gameId: string;
}) => {
  const { t } = useTranslation();

  const {
    data: challengesData,
    error: challengesError,
    loading: challengesLoading,
  } = useQuery<getChallengesQuery>(GET_CHALLENGES, {
    variables: {
      gameId,
    },
    skip: !gameId,
    fetchPolicy: "no-cache",
  });

  if (challengesLoading) {
    return <div>{t("Loading")}</div>;
  }

  if (challengesError) {
    return <Error errorContent={JSON.stringify(challengesError)} />;
  }

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
            accessor: "resultsTotal",
            disableFilters: true,
          },
          {
            Header: t("table.acceptedResults"),
            accessor: "acceptedResults",
            disableFilters: true,
          },
          {
            Header: t("table.difficulty"),
            accessor: (row: any) =>
              row.resultsTotal > 0
                ? `${100 - (row.acceptedResults / row.resultsTotal) * 100}%`
                : "-",
            disableFilters: true,
          },
        ]}
        data={[]}
      />
    </Box>
  );
};

export default ExercisesStats;
