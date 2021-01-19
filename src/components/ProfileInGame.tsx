import React, { useContext } from "react";
import withChangeAnimation from "../utilities/withChangeAnimation";
import { useQuery, gql } from "@apollo/client";
import {
  ProfileInGameQuery,
  ProfileInGameQuery_profileInGame_learningPath,
  ProfileInGameQuery_profileInGame_learningPath_challenge_parentChallenge,
} from "../generated/ProfileInGameQuery";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { State } from "../generated/globalTypes";
import NavContext from "../context/NavContext";

import {
  Progress,
  Text,
  Heading,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import { useParams } from "react-router-dom";

interface ParamTypes {
  gameId: string;
}

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
          parentChallenge {
            id
            name
            description
          }
        }
        state
        progress
        startedAt
        openedAt
        endedAt
        refs {
          activity {
            id
          }
          solved
        }
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

const getChallengeChildren = (
  parentChallenge: ProfileInGameQuery_profileInGame_learningPath_challenge_parentChallenge | null,
  learningPath: ProfileInGameQuery_profileInGame_learningPath[]
) => {
  if (!parentChallenge) {
    return null;
  }

  // return learningPath.map(({ challenge }, i) => {
  //   return challenge;
  // });

  return learningPath.map(({ challenge }, i) => {
    if (challenge.parentChallenge?.id == parentChallenge.id) {
      return challenge;
    }
  });
};

const isChallengeWithoutChildren = (children: any) => {
  if (!children) {
    return false;
  } else {
    return true;
  }
};

const ProfileInGame = ({
  location,
}: {
  location: { state: { gameId: string } };
}) => {
  const { setActiveChallenge } = useContext(NavContext);
  const { gameId } = useParams<ParamTypes>();

  const { loading, error, data } = useQuery<ProfileInGameQuery>(
    PROFILE_IN_GAME,
    {
      variables: { gameId },
    }
  );
  if (!gameId) {
    return <Text>Game ID not provided</Text>;
  }

  if (loading) return null;
  if (error) {
    console.log("error", error);
    return <Text>error</Text>;
  }
  if (!data) return <Text>no data</Text>;

  return (
    <Box>
      <Heading as="h3" size="lg">
        Game: {data.profileInGame.game.name}
      </Heading>
      <Box>
        {data.profileInGame.learningPath.map((learningPath, i) => {
          return (
            !learningPath.challenge.parentChallenge && (
              <ParentChallenge
                key={i}
                available={learningPath.state == State.AVAILABLE}
                withoutChildren={isChallengeWithoutChildren(
                  getChallengeChildren(
                    learningPath.challenge,
                    data.profileInGame.learningPath
                  )
                )}
              >
                {learningPath.state != State.AVAILABLE && (
                  <LockIcon w={6} h={6} float="right" />
                )}

                {!isChallengeWithoutChildren(
                  getChallengeChildren(
                    learningPath.challenge,
                    data.profileInGame.learningPath
                  )
                ) && (
                  <div className="challenge-info">
                    <h3>{learningPath.challenge.name}</h3>
                    <p>{learningPath.challenge.description}</p>
                  </div>
                )}

                {getChallengeChildren(
                  learningPath.challenge,
                  data.profileInGame.learningPath
                )?.map((childChallenge, i) => {
                  return (
                    childChallenge && (
                      <ChildrenChallenge>
                        <Link
                          key={i}
                          to={{
                            pathname: "/profile/game/challenge",
                            state: {
                              gameId: data.profileInGame.game.id,
                              challengeId: childChallenge.id,
                            },
                          }}
                          onClick={() =>
                            setActiveChallenge({
                              id: childChallenge.id,
                              name: childChallenge.name,
                            })
                          }
                        >
                          <h4>{childChallenge.name}</h4>
                          <Text>{childChallenge.description}</Text>
                        </Link>
                      </ChildrenChallenge>
                    )
                  );
                })}

                {isChallengeWithoutChildren(
                  getChallengeChildren(
                    learningPath.challenge,
                    data.profileInGame.learningPath
                  )
                ) && (
                  <Link
                    to={{
                      pathname: `/game/${data.profileInGame.game.id}/challenge/${learningPath.challenge.id}`,
                    }}
                    onClick={() =>
                      setActiveChallenge({
                        id: learningPath.challenge.id,
                        name: learningPath.challenge.name,
                      })
                    }
                  >
                    <ChallengeBox
                      progress={learningPath.progress}
                      name={learningPath.challenge.name}
                      description={
                        learningPath.challenge.description
                          ? learningPath.challenge.description
                          : "No description"
                      }
                    />
                  </Link>
                )}
              </ParentChallenge>
            )
          );
        })}
      </Box>
    </Box>
  );
};

const ChallengeBox = ({
  progress,
  name,
  description,
}: {
  progress: number;
  name: string;
  description: string;
}) => {
  const color = useColorModeValue("borderDark", "borderLight");

  return (
    <Box bg={color} p={3} borderRadius={5}>
      <Heading size="md">{name}</Heading>
      <Text>{description}</Text>
      <Progress
        colorScheme="blue"
        size="lg"
        value={progress * 100}
        marginTop={2}
        borderRadius={5}
      />
    </Box>
  );
};

// const ParentChallenge = styled.div``;

const ChildrenChallenge = styled.div`
  margin-bottom: 12px;
  padding: 10px;
  p {
    font-size: 13px;
  }
  transition: transform 0.5s;

  &:hover {
    transform: scale(0.97);
  }
`;

const ParentChallenge = styled.div<{
  available: boolean;
  withoutChildren: boolean;
}>`
  .challenge-info {
    margin-bottom: 12px;
  }

  margin-bottom: 20px;
  border-radius: 5px;
  padding: 25px;
  transition: transform 0.5s;
  cursor: ${({ available }) => (available ? "pointer" : "initial")};
  h3 {
    margin-bottom: 15px;
  }

  a {
    color: black;
  }

  &:hover {
    transform: scale(0.97);
  }

  opacity: ${({ available }) => (available ? "1" : 0.5)};
  pointer-events: ${({ available }) => (available ? "all" : "none")};
`;

export default withChangeAnimation(ProfileInGame);
