import { Heading, Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

import React from "react";
import { useTranslation } from "react-i18next";
import { getPlayerQuery } from "../../generated/getPlayerQuery";
import TableComponent from "../TableComponent";
import ColumnFilter from "../TableComponent/ColumnFilter";

dayjs.extend(LocalizedFormat);

const PlayerAttemptsTable = ({
  playerData,
  isValidationsTable,
}: {
  playerData: getPlayerQuery;
  isValidationsTable?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <Box>
      <TableComponent
        columns={[
          {
            Header: t("Game"),
            accessor: "exerciseId",
            Filter: ({ column }: { column: any }) => (
              <ColumnFilter
                column={column}
                placeholder={t("placeholders.name")}
              />
            ),
          },
          {
            Header: t("Game"),
            accessor: "language",
            Filter: ({ column }: { column: any }) => (
              <ColumnFilter
                column={column}
                placeholder={t("placeholders.name")}
              />
            ),
          },
          {
            Header: t("Game"),
            accessor: "result",
            Filter: ({ column }: { column: any }) => (
              <ColumnFilter
                column={column}
                placeholder={t("placeholders.name")}
              />
            ),
          },
          {
            Header: t("Game"),
            accessor: ({ submittedAt }: { submittedAt: Date }) =>
              dayjs(submittedAt).format("lll"),
            Filter: ({ column }: { column: any }) => (
              <ColumnFilter
                column={column}
                placeholder={t("placeholders.name")}
              />
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
