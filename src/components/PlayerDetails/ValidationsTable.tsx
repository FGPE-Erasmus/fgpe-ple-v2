import { useQuery } from "@apollo/client";
import { Box, Skeleton } from "@chakra-ui/react";
import React from "react";
import { getPlayerSubmissionsQuery } from "../../generated/getPlayerSubmissionsQuery";
import { getPlayerValidationsQuery } from "../../generated/getPlayerValidationsQuery";
import { GET_PLAYER_SUBMISSIONS } from "../../graphql/getPlayerSubmissions";
import { GET_PLAYER_VALIDATIONS } from "../../graphql/getPlayerValidations";
import PlayerAttemptsTable from "./PlayerAttemptsTable";

const ValidationsTable = ({
  userId,
  gameId,
  onValidationRowClick,
}: {
  userId: string;
  gameId: string;
  onValidationRowClick: (row: any) => void;
}) => {
  const {
    data: playerData,
    error: playerError,
    loading: playerLoading,
  } = useQuery<getPlayerValidationsQuery>(GET_PLAYER_VALIDATIONS, {
    variables: { userId, gameId },
    skip: !userId || !gameId,
    fetchPolicy: "network-only",
  });

  return (
    <Skeleton isLoaded={!playerLoading && !playerError}>
      <Box minHeight={200}>
        {playerData && (
          <PlayerAttemptsTable
            onRowClick={onValidationRowClick}
            isValidationsTable
            playerData={playerData}
          />
        )}
      </Box>
    </Skeleton>
  );
};

export default ValidationsTable;
