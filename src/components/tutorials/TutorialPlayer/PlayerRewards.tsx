import { Box, Skeleton } from "@chakra-ui/react";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import RefreshCacheMenu from "../../RefreshCacheMenu";
import TableComponent from "../../TableComponent";
import ColumnFilter from "../../TableComponent/ColumnFilter";

dayjs.extend(LocalizedFormat);

const PlayerAttemptsTable = ({
  // userId,
  // gameId,
  playerData,
}: {
  // userId: string;
  // gameId: string;
  playerData: any;
}) => {
  const { t } = useTranslation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  return (
    <Box>
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            data-cy="server-connection-error"
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{ maxHeight: 50, opacity: 1 }}
            exit={{ maxHeight: 0, opacity: 0 }}
            style={{ width: "100%", textAlign: "center" }}
          >
            {t("error.serverConnection.title")}{" "}
            {t("error.serverConnection.description")}
          </motion.div>
        )}
      </AnimatePresence>
      <Skeleton isLoaded={true}>
        <Box minH={200}>
          {playerData && (
            <TableComponent
              dataCy="rewards-table"
              refreshData={(() => {}) as any}
              contextMenu={
                <RefreshCacheMenu loading={false} refetch={(() => {}) as any} />
              }
              columns={[
                {
                  Header: t("Name"),
                  accessor: "reward.name",
                  Filter: ({ column }: { column: any }) => (
                    <ColumnFilter
                      column={column}
                      placeholder={t("placeholders.string")}
                    />
                  ),
                },
                {
                  Header: t("Description"),
                  accessor: "reward.description",
                  Filter: ({ column }: { column: any }) => (
                    <ColumnFilter
                      column={column}
                      placeholder={t("placeholders.string")}
                    />
                  ),
                },
                {
                  Header: t("Kind"),
                  accessor: "reward.kind",
                  Filter: ({ column }: { column: any }) => (
                    <ColumnFilter
                      column={column}
                      placeholder={t("placeholders.string")}
                    />
                  ),
                },
              ]}
              data={playerData.player.rewards}
            />
          )}
        </Box>
      </Skeleton>
    </Box>
  );
};

export default PlayerAttemptsTable;
