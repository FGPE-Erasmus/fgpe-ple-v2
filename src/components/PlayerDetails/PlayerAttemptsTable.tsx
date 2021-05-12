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
        onRowClick={onRowClick}
        columns={[
          {
            Header: t("Exercise"),
            accessor: "exerciseId",
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
