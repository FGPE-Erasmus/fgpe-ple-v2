import { useQuery } from "@apollo/client";
import { Box, Skeleton } from "@chakra-ui/react";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getPlayerRewardsQuery } from "../../generated/getPlayerRewardsQuery";
import { GET_PLAYER_REWARDS } from "../../graphql/getPlayerRewards";
import { checkIfConnectionAborted } from "../../utilities/ErrorMessages";
import RefreshCacheMenu from "../RefreshCacheMenu";
import TableComponent from "../TableComponent";
import ColumnFilter from "../TableComponent/ColumnFilter";

dayjs.extend(LocalizedFormat);

const PlayerAttemptsTable = ({
  userId,
  gameId,
}: {
  userId: string;
  gameId: string;
}) => {
  const { t } = useTranslation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: playerData,
    error: playerError,
    loading: playerLoading,
    refetch: refetchPlayerData,
  } = useQuery<getPlayerRewardsQuery>(GET_PLAYER_REWARDS, {
    variables: { userId, gameId },
    skip: !userId || !gameId,
    fetchPolicy: "network-only",
    onError: async (err) => {
      const isServerConnectionError = checkIfConnectionAborted(err);
      if (isServerConnectionError) {
        setIsRefreshing(true);
        await refetchPlayerData();
        setIsRefreshing(false);
      }
    },
  });

  return (
    <Box>
      <RefreshCacheMenu loading={playerLoading} refetch={refetchPlayerData} />
      <AnimatePresence>
        {playerError && !isRefreshing && (
          <motion.div
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{ maxHeight: 50, opacity: 1 }}
            exit={{ maxHeight: 0, opacity: 0 }}
            style={{ width: "100%", textAlign: "center" }}
          >
            {t("error.title")}
            <br /> {t("error.description")}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
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
      <Skeleton isLoaded={!playerLoading && !playerError}>
        <Box minH={200}>
          {playerData && (
            <TableComponent
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
