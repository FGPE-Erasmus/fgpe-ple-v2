import { Box, Skeleton } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getPlayerQuery_player_learningPath } from "../../../generated/getPlayerQuery";
import { getPlayerValidationsQuery } from "../../../generated/getPlayerValidationsQuery";
import PlayerAttemptsTable from "../../PlayerDetails/PlayerAttemptsTable";
import RefreshCacheMenu from "../../RefreshCacheMenu";

const ValidationsTable = ({
  //   userId,
  //   gameId,
  onValidationRowClick,
  learningPaths: gameData,
  playerData,
}: {
  //   userId: string;
  //   gameId: string;
  onValidationRowClick: (row: any) => void;
  learningPaths: getPlayerQuery_player_learningPath[];
  playerData: getPlayerValidationsQuery;
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { t } = useTranslation();

  const mockRefetch = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    });
  };

  return (
    <div>
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
        <Box minHeight={200}>
          {playerData && (
            <PlayerAttemptsTable
              dataCy="validations-table"
              contextMenu={
                <RefreshCacheMenu loading={false} refetch={mockRefetch} />
              }
              onRowClick={onValidationRowClick}
              isValidationsTable
              playerData={playerData}
              gameData={gameData}
              refreshData={mockRefetch}
            />
          )}
        </Box>
      </Skeleton>
    </div>
  );
};

export default ValidationsTable;
