import { useQuery } from "@apollo/client";
import { Box, Skeleton } from "@chakra-ui/react";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import React from "react";
import { useTranslation } from "react-i18next";
import { getPlayerRewardsQuery } from "../../generated/getPlayerRewardsQuery";
import { GET_PLAYER_REWARDS } from "../../graphql/getPlayerRewards";
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

  const {
    data: playerData,
    error: playerError,
    loading: playerLoading,
  } = useQuery<getPlayerRewardsQuery>(GET_PLAYER_REWARDS, {
    variables: { userId, gameId },
    skip: !userId || !gameId,
    fetchPolicy: "network-only",
  });

  return (
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
      </Box>{" "}
    </Skeleton>
  );
};

export default PlayerAttemptsTable;
