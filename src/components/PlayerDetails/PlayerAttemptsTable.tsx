import { Heading, Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  getPlayerQuery,
  getPlayerQuery_player_game,
} from "../../generated/getPlayerQuery";
import TableComponent from "../TableComponent";
import ColumnFilter from "../TableComponent/ColumnFilter";

dayjs.extend(LocalizedFormat);

const getNameForExerciseId = (
  exerciseId: string,
  playerGame: getPlayerQuery_player_game
) => {
  const challenges = playerGame.challenges;
  for (let i = 0; i < challenges.length; i++) {
    for (let ii = 0; ii < challenges[i].refs.length; ii++) {
      if (challenges[i].refs[ii].id === exerciseId) {
        return challenges[i].refs[ii].name;
      }
    }
  }
};

const PlayerAttemptsTable = ({
  playerData,
  isValidationsTable,
  onRowClick,
}: {
  playerData: getPlayerQuery;
  isValidationsTable?: boolean;
  onRowClick?: (row: any) => void;
}) => {
  const { t } = useTranslation();

  return (
    <Box>
      <TableComponent
        onRowClick={(row: any) => {
          onRowClick &&
            onRowClick({
              ...row,
              exerciseId: getNameForExerciseId(
                row.exerciseId,
                playerData.player.game
              ),
            });
        }}
        columns={[
          {
            Header: t("Exercise"),
            accessor: ({ exerciseId }: { exerciseId: string }) =>
              getNameForExerciseId(exerciseId, playerData.player.game),
            Filter: ({ column }: { column: any }) => (
              <ColumnFilter column={column} placeholder={"abc"} />
            ),
          },
          {
            Header: t("Language"),
            accessor: "language",
            Filter: ({ column }: { column: any }) => (
              <ColumnFilter column={column} placeholder={"abc"} />
            ),
          },
          {
            Header: t("Result"),
            accessor: "result",
            Filter: ({ column }: { column: any }) => (
              <ColumnFilter column={column} placeholder={"abc"} />
            ),
          },
          {
            Header: t("Submitted at"),
            accessor: ({ submittedAt }: { submittedAt: Date }) =>
              dayjs(submittedAt).format("lll"),
            Filter: ({ column }: { column: any }) => (
              <ColumnFilter column={column} placeholder={"abc"} />
            ),
          },
        ]}
        data={
          isValidationsTable
            ? playerData.player.validations
            : playerData.player.submissions
        }
      />
    </Box>
  );
};

export default PlayerAttemptsTable;
