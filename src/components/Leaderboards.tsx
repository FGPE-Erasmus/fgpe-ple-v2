import { gql, useQuery } from "@apollo/client";
import React from "react";
import { getGroupRankingsQuery } from "../generated/getGroupRankingsQuery";
import { getLeaderboardsQuery } from "../generated/getLeaderboardsQuery";

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
    return <div>Error.</div>;
  }

  if (!dataLeaderboards && !loadingLeaderboards) {
    return <div>Error.</div>;
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
  const {
    loading: loadingGroupRankings,
    error: errorGroupRankings,
    data: dataGroupRankings,
  } = useQuery<getGroupRankingsQuery>(GET_GROUP_RANKINGS, {
    variables: { gameId, leaderboardId },
  });

  if (loadingGroupRankings) {
    return <div>Loading...</div>;
  }

  if (errorGroupRankings) {
    console.log("ERROR", errorGroupRankings);
    return <div>Error. Error.</div>;
  }

  if (!dataGroupRankings && !loadingGroupRankings) {
    return <div>Error. No data</div>;
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
