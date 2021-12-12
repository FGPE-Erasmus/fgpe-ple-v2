import { useQuery } from "@apollo/client";
import { Box, Skeleton } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getPlayerQuery_player_game,
  getPlayerQuery_player_learningPath,
} from "../../generated/getPlayerQuery";
import { getPlayerSubmissionsQuery } from "../../generated/getPlayerSubmissionsQuery";
import { GET_PLAYER_SUBMISSIONS } from "../../graphql/getPlayerSubmissions";
import { checkIfConnectionAborted } from "../../utilities/ErrorMessages";
import PlayerAttemptsTable from "./PlayerAttemptsTable";

const SubmissionsTable = ({
  userId,
  gameId,
  onSubmissionRowClick,
  learningPaths: gameData,
}: {
  userId: string;
  gameId: string;
  onSubmissionRowClick: (row: any) => void;
  learningPaths: getPlayerQuery_player_learningPath[];
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { t } = useTranslation();

  const {
    data: playerData,
    error: playerError,
    loading: playerLoading,
    refetch: refetchPlayerData,
  } = useQuery<getPlayerSubmissionsQuery>(GET_PLAYER_SUBMISSIONS, {
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
    <div>
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
              onRowClick={onSubmissionRowClick}
              playerData={playerData}
              gameData={gameData}
            />
          )}
        </Box>
      </Skeleton>
    </div>
  );
};

export default SubmissionsTable;
