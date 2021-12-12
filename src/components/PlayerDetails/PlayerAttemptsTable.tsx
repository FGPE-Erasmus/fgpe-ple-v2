import { Heading, Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  getPlayerQuery,
  getPlayerQuery_player_game,
  getPlayerQuery_player_learningPath,
} from "../../generated/getPlayerQuery";
import { getPlayerSubmissionsQuery } from "../../generated/getPlayerSubmissionsQuery";
import { getPlayerValidationsQuery } from "../../generated/getPlayerValidationsQuery";
import TableComponent from "../TableComponent";
import ColumnFilter from "../TableComponent/ColumnFilter";

dayjs.extend(LocalizedFormat);

const getNameForExerciseId = (
  exerciseId: string,
  learningPaths: getPlayerQuery_player_learningPath[],
  getChallengeName?: boolean
) => {
  const challenges = learningPaths;
  // const challenges = playerGame.challenges;
  for (let i = 0; i < challenges.length; i++) {
    for (let ii = 0; ii < challenges[i].challenge.refs.length; ii++) {
      if (challenges[i].challenge.refs[ii].id === exerciseId) {
        if (getChallengeName) {
          return challenges[i].challenge.name;
        }
        return challenges[i].challenge.refs[ii].name;
      }
    }
  }
};

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
  gameData,
}: {
  isValidationsTable?: boolean;
  playerData: any;
  gameData: getPlayerQuery_player_learningPath[];
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
              exerciseId: getNameForExerciseId(row.exerciseId, gameData),
            });
        }}
        columns={[
          {
            Header: t("Exercise"),
            accessor: ({ exerciseId }: { exerciseId: string }) =>
              getNameForExerciseId(exerciseId, gameData),
            Filter: ({ column }: { column: any }) => (
              <ColumnFilter column={column} placeholder={"abc"} />
            ),
          },
          {
            Header: t("Challenges"),
            accessor: ({ exerciseId }: { exerciseId: string }) =>
              getNameForExerciseId(exerciseId, gameData, true),
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
