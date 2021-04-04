import { gql, useQuery } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getGroupRankingsQuery } from "../generated/getGroupRankingsQuery";
import { getLeaderboardsQuery } from "../generated/getLeaderboardsQuery";
import Error from "./Error";
import TableComponent from "./TableComponent/TableNoSorting";
import ColumnFilter from "./TableComponent/ColumnFilter";
import { m } from "framer-motion";
import { useKeycloak } from "@react-keycloak/web";

const GET_LEADERBOARDS = gql`
  query getLeaderboardsQuery($gameId: String!) {
    leaderboards(gameId: $gameId) {
      id
      game {
        id
        name
      }
      parentChallenge {
        id
      }
      name
    }
  }
`;

const GET_GROUP_RANKINGS = gql`
  query getGroupRankingsQuery($gameId: String!, $leaderboardId: String!) {
    groupRankings(gameId: $gameId, leaderboardId: $leaderboardId) {
      player {
        id
        group {
          id
          name
        }
        user {
          id
          username
        }
      }
      score
    }
  }
`;

const Leaderboards = ({ gameId }: { gameId: string }) => {
  const { t } = useTranslation();

  const {
    loading: loadingLeaderboards,
    error: errorLeaderboards,
    data: dataLeaderboards,
  } = useQuery<getLeaderboardsQuery>(GET_LEADERBOARDS, {
    variables: { gameId },
  });

  if (loadingLeaderboards) {
    return <div>{t("Loading")}</div>;
  }

  if (errorLeaderboards) {
    return <Error errorContent={JSON.stringify(errorLeaderboards)} />;
  }

  if (!dataLeaderboards && !loadingLeaderboards) {
    return <Error errorContent={"Unknown error"} />;
  }

  return (
    <>
      {dataLeaderboards?.leaderboards.map((leaderboard, i) => {
        if (leaderboard.id) {
          return (
            <Ranking key={i} leaderboardId={leaderboard.id} gameId={gameId} />
          );
        }
      })}
    </>
  );
};

const Ranking = ({
  gameId,
  leaderboardId,
}: {
  gameId: string;
  leaderboardId: string;
}) => {
  const { t } = useTranslation();
  const { keycloak } = useKeycloak();

  // useEffect(() => {
  //   keycloak.loadUserInfo();
  // }, []);

  const {
    loading: loadingGroupRankings,
    error: errorGroupRankings,
    data: dataGroupRankings,
  } = useQuery<getGroupRankingsQuery>(GET_GROUP_RANKINGS, {
    variables: { gameId, leaderboardId },
  });

  if (loadingGroupRankings) {
    return <div>{t("Loading")}</div>;
  }

  if (errorGroupRankings) {
    console.log("ERROR", errorGroupRankings);
    return <Error errorContent={JSON.stringify(errorGroupRankings)} />;
  }

  if (!dataGroupRankings && !loadingGroupRankings) {
    return <Error errorContent={JSON.stringify("No data")} />;
  }

  if (!dataGroupRankings) {
    return <Error errorContent={JSON.stringify("No data")} />;
  }

  return (
    <Box>
      <TableComponent
        dontRecomputeChange
        columns={[
          {
            Header: t("Rank"),
            accessor: "",
            Cell: (row: { row: { id: string } }) => {
              return <div>{Number(row.row.id) + 1}</div>;
            },
            disableSortBy: true,
            disableFilters: true,
          },
          {
            Header: t("table.username"),
            accessor: "player.user.username",
            Cell: ({ value }: { value: any }) =>
              keycloak.profile?.username == value ? (
                <Box color="deepskyblue">{value}</Box>
              ) : (
                <Box>{value}</Box>
              ),
            Filter: ({ column }: { column: any }) => (
              <ColumnFilter
                column={column}
                placeholder={t("placeholders.username")}
              />
            ),
          },
          // {
          //   Header: t("table.points"),
          //   accessor: "score.points",
          //   Filter: ({ column }: { column: any }) => (
          //     <ColumnFilter
          //       column={column}
          //       placeholder={t("placeholders.points")}
          //     />
          //   ),
          // },
        ]}
        data={dataGroupRankings.groupRankings}
      />
    </Box>
  );
};

export default Leaderboards;
