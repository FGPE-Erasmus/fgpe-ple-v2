import React from "react";
import withChangeAnimation from "../utilities/withChangeAnimation";
import { useQuery, gql } from "@apollo/client";
import { FindChallenge } from "../generated/FindChallenge";
import { Link } from "react-router-dom";

const FIND_CHALLENGE = gql`
  query FindChallenge($gameId: String!) {
    challenges(gameId: $gameId) {
      id
      name
      description
      difficulty
      mode
      modeParameters
      locked
      hidden
      refs
    }
  }
`;

const ProfileInGame = ({
  location,
}: {
  location: { state: { gameId: string } };
}) => {
  const { gameId } = location.state;
  const { loading, error, data } = useQuery<FindChallenge>(FIND_CHALLENGE, {
    variables: { gameId },
  });
  if (!gameId) {
    return <div>Game ID not provided</div>;
  }

  if (loading) return null;
  if (error) return <div>error</div>;
  if (!data) return <div>no data</div>;

  return (
    <div>
      {data.challenges.map((challenge, i) => {
        return (
          <div key={i}>
            {challenge.locked ? (
              challenge.name
            ) : (
              <Link
                to={{
                  pathname: "/game",
                  state: { challengeId: challenge.id },
                }}
              >
                {challenge.name}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default withChangeAnimation(ProfileInGame);
