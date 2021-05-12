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
}: {
  playerData: getPlayerQuery;
}) => {
  const { t } = useTranslation();

  return (
    <Box>
      <TableComponent
        columns={[
          {
            Header: t("Game"),
            accessor: "reward.name",
            Filter: ({ column }: { column: any }) => (
              <ColumnFilter
                column={column}
                placeholder={t("placeholders.name")}
              />
            ),
          },
          {
            Header: t("Game"),
            accessor: "reward.description",
            Filter: ({ column }: { column: any }) => (
              <ColumnFilter
                column={column}
                placeholder={t("placeholders.name")}
              />
            ),
          },
          {
            Header: t("Game"),
            accessor: "reward.kind",
            Filter: ({ column }: { column: any }) => (
              <ColumnFilter
                column={column}
                placeholder={t("placeholders.name")}
              />
            ),
          },
        ]}
        data={playerData.player.rewards}
      />
    </Box>
  );
};

export default PlayerAttemptsTable;
