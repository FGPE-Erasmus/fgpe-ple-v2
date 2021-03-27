import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useTranslation } from "react-i18next";
import { getGroupRankingsQuery } from "../generated/getGroupRankingsQuery";
import { getLeaderboardsQuery } from "../generated/getLeaderboardsQuery";
import Error from "./Error";

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
  const {
    loading: loadingLeaderboards,
    error: errorLeaderboards,
    data: dataLeaderboards,
  } = useQuery<getLeaderboardsQuery>(GET_LEADERBOARDS, {
    variables: { gameId },
  });

  if (loadingLeaderboards) {
    return <div>Loading...</div>;
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

  return (
    <div>
      {dataGroupRankings?.groupRankings.map((participant, i) => {
        return <span key={i}>{participant.player?.user.username}</span>;
      })}
    </div>
  );
};

export default Leaderboards;
