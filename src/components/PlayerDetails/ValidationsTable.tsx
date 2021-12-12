import { useQuery } from "@apollo/client";
import { Box, Skeleton } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  getPlayerQuery_player_game,
  getPlayerQuery_player_learningPath,
} from "../../generated/getPlayerQuery";
import { getPlayerValidationsQuery } from "../../generated/getPlayerValidationsQuery";
import { GET_PLAYER_VALIDATIONS } from "../../graphql/getPlayerValidations";
import { checkIfConnectionAborted } from "../../utilities/ErrorMessages";
import PlayerAttemptsTable from "./PlayerAttemptsTable";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import RefreshCacheMenu from "../RefreshCacheMenu";

const ValidationsTable = ({
  userId,
  gameId,
  onValidationRowClick,
  learningPaths: gameData,
}: {
  userId: string;
  gameId: string;
  onValidationRowClick: (row: any) => void;
  learningPaths: getPlayerQuery_player_learningPath[];
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { t } = useTranslation();

  const {
    data: playerData,
    error: playerError,
    loading: playerLoading,
    refetch: refetchPlayerData,
  } = useQuery<getPlayerValidationsQuery>(GET_PLAYER_VALIDATIONS, {
    variables: { userId, gameId },
    skip: !userId || !gameId,
    fetchPolicy: "cache-first",
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
    <div>
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
        <Box minHeight={200}>
          {playerData && (
            <PlayerAttemptsTable
              onRowClick={onValidationRowClick}
              isValidationsTable
              playerData={playerData}
              gameData={gameData}
            />
          )}
        </Box>
      </Skeleton>
    </div>
  );
};

export default ValidationsTable;
