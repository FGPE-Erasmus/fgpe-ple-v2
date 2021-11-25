import { useQuery } from "@apollo/client";
import { Box, Skeleton } from "@chakra-ui/react";
import React from "react";
import { getPlayerSubmissionsQuery } from "../../generated/getPlayerSubmissionsQuery";
import { GET_PLAYER_SUBMISSIONS } from "../../graphql/getPlayerSubmissions";
import PlayerAttemptsTable from "./PlayerAttemptsTable";

const SubmissionsTable = ({
  userId,
  gameId,
  onSubmissionRowClick,
}: {
  userId: string;
  gameId: string;
  onSubmissionRowClick: (row: any) => void;
}) => {
  const {
    data: playerData,
    error: playerError,
    loading: playerLoading,
  } = useQuery<getPlayerSubmissionsQuery>(GET_PLAYER_SUBMISSIONS, {
    variables: { userId, gameId },
    skip: !userId || !gameId,
    fetchPolicy: "network-only",
  });

  return (
    <Skeleton isLoaded={!playerLoading && !playerError}>
      <Box minHeight={200}>
        {playerData && (
          <PlayerAttemptsTable
            onRowClick={onSubmissionRowClick}
            playerData={playerData}
          />
        )}
      </Box>
    </Skeleton>
  );
};

export default SubmissionsTable;
