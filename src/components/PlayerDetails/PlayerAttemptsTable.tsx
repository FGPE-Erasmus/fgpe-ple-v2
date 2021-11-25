import { Heading, Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  getPlayerQuery,
  getPlayerQuery_player_game,
} from "../../generated/getPlayerQuery";
import {
  getPlayerSubmissionsQuery,
  getPlayerSubmissionsQuery_player_game,
} from "../../generated/getPlayerSubmissionsQuery";
import { getPlayerValidationsQuery } from "../../generated/getPlayerValidationsQuery";
import TableComponent from "../TableComponent";
import ColumnFilter from "../TableComponent/ColumnFilter";

dayjs.extend(LocalizedFormat);

const getNameForExerciseId = (
  exerciseId: string,
  playerGame: getPlayerSubmissionsQuery_player_game,
  getChallengeName?: boolean
) => {
  const challenges = playerGame.challenges;
  for (let i = 0; i < challenges.length; i++) {
    for (let ii = 0; ii < challenges[i].refs.length; ii++) {
      if (challenges[i].refs[ii].id === exerciseId) {
        if (getChallengeName) {
          return challenges[i].name;
        }
        return challenges[i].refs[ii].name;
      }
    }
  }
};

type PlayerSubmissionsTable = {
  isValidationsTable: false;
  playerData: getPlayerSubmissionsQuery;
  onRowClick?: (row: any) => void;
};

type PlayerValidationsTable = {
  isValidationsTable: true;
  playerData: getPlayerValidationsQuery;
  onRowClick?: (row: any) => void;
};

type PlayerAttempsTableType = PlayerSubmissionsTable | PlayerValidationsTable;

// type PlayerAttemptsTableType =
//   | {
//       onRowClick?: (row: any) => void;
//     }
//   | {
//       isValidationsTable: true;
//       playerData: getPlayerValidationsQuery;
//     }
//   | {
//       isValidationsTable: false;
//       playerData: getPlayerSubmissionsQuery;
//     };
/** a player attempt is a working name of a submission or validation */
const PlayerAttemptsTable = ({
  playerData,
  isValidationsTable,
  onRowClick,
}: {
  isValidationsTable?: boolean;
  playerData: any;
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
            Header: t("Challenges"),
            accessor: ({ exerciseId }: { exerciseId: string }) =>
              getNameForExerciseId(exerciseId, playerData.player.game, true),
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
