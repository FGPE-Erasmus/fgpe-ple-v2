import React from "react";
import withChangeAnimation from "../utilities/withChangeAnimation";
import { useQuery, gql } from "@apollo/client";
import { ProfileInGameQuery } from "../generated/ProfileInGameQuery";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { State } from "../generated/globalTypes";

const PROFILE_IN_GAME = gql`
  query ProfileInGameQuery($gameId: String!) {
    profileInGame(gameId: $gameId) {
      id
      game {
        id
        name
      }
      user {
        id
        username
      }
      group {
        id
      }
      points
      rewards {
        id
        reward {
          id
          name
        }
        count
      }
      learningPath {
        id
        challenge {
          id
          name
          description
        }
        state
        startedAt
        openedAt
        endedAt
      }
      submissions {
        id
        exerciseId
        result
        grade
      }
      createdAt
      updatedAt
    }
  }
`;

const ProfileInGame = ({
  location,
}: {
  location: { state: { gameId: string } };
}) => {
  const { gameId } = location.state;
  const { loading, error, data } = useQuery<ProfileInGameQuery>(
    PROFILE_IN_GAME,
    {
      variables: { gameId },
    }
  );
  if (!gameId) {
    return <div>Game ID not provided</div>;
  }

  if (loading) return null;
  if (error) {
    console.log("error", error);
    return <div>error</div>;
  }
  if (!data) return <div>no data</div>;

  return (
    <div>
      <h2>Game: {data.profileInGame.game.name}</h2>
      <div>
        {data.profileInGame.learningPath.map((learningPath, i) => {
          return (
            <Link
              key={i}
              to={{
                pathname: "/profile/game/challenge",
                state: {
                  gameId: data.profileInGame.game.id,
                  challengeId: learningPath.challenge.id,
                },
              }}
            >
              <Challenge available={learningPath.state == State.AVAILABLE}>
                <h3>{learningPath.challenge.name}</h3>
                <p>{learningPath.challenge.description}</p>
                {/* {learningPath.challenge.refs.map((exercise, i) => {
                return <div key={i}>{exercise.id}</div>;
              })} */}
              </Challenge>
            </Link>
          );
        })}
      </div>
      {/* {data.challenges.map((challenge, i) => {
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
      })} */}
    </div>
  );
};

const Challenge = styled.div<{ available: boolean }>`
  background-color: ${({ theme }) => theme.backgroundVariant};
  margin-bottom: 10px;
  border-radius: 5px;
  padding: 25px;
  transition: transform 0.5s;
  cursor: ${({ available }) => (available ? "pointer" : "initial")};
  h3 {
    margin-bottom: 15px;
  }

  &:hover {
    transform: scale(0.97);
  }

  opacity: ${({ available }) => (available ? "1" : 0.5)};
  pointer-events: ${({ available }) => (available ? "all" : "none")};
`;

export default withChangeAnimation(ProfileInGame);
