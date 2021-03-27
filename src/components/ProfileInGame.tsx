import React, { useContext } from "react";
import withChangeAnimation from "../utilities/withChangeAnimation";
import { useQuery, gql } from "@apollo/client";
import Error from "./Error";

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
import { LockIcon, CheckIcon } from "@chakra-ui/icons";
import { useParams } from "react-router-dom";
import Leaderboards from "./Leaderboards";
import { useTranslation } from "react-i18next";

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

const ProfileInGame = () => {
  const { setActiveChallenge } = useContext(NavContext);
  const { gameId } = useParams<ParamTypes>();
  const { t } = useTranslation();

  const {
    loading: loadingProfile,
    error: errorProfile,
    data: dataProfile,
  } = useQuery<ProfileInGameQuery>(PROFILE_IN_GAME, {
    variables: { gameId },
  });

  if (!gameId) {
    return <Text>Game ID not provided</Text>;
  }

  if (loadingProfile) return <div>Loading...</div>;

  if (errorProfile) {
    console.log("error", errorProfile);
    return <Error errorContent={JSON.stringify(errorProfile)} />;
  }

  if (!dataProfile) return <Text>no data</Text>;

  return (
    <Box>
      <Heading as="h3" size="lg">
        {t("Game")}: {dataProfile.profileInGame.game.name}
      </Heading>
      <Box>
        <Leaderboards gameId={gameId} />
      </Box>

      <Box>
        {dataProfile.profileInGame.learningPath.map((learningPath, i) => {
          return (
            !learningPath.challenge.parentChallenge && (
              <ParentChallenge
                key={i}
                available={learningPath.state == State.AVAILABLE}
                withoutChildren={isChallengeWithoutChildren(
                  getChallengeChildren(
                    learningPath.challenge,
                    dataProfile.profileInGame.learningPath
                  )
                )}
              >
                {learningPath.state != State.AVAILABLE &&
                  (learningPath.progress == 1 ? (
                    <CheckIcon w={6} h={6} m={4} float="right" />
                  ) : (
                    <LockIcon w={6} h={6} m={4} float="right" />
                  ))}

                {!isChallengeWithoutChildren(
                  getChallengeChildren(
                    learningPath.challenge,
                    dataProfile.profileInGame.learningPath
                  )
                ) && (
                  <div className="challenge-info">
                    <h3>{learningPath.challenge.name}</h3>
                    <p>{learningPath.challenge.description}</p>
                  </div>
                )}

                {getChallengeChildren(
                  learningPath.challenge,
                  dataProfile.profileInGame.learningPath
                )?.map((childChallenge, i) => {
                  return (
                    childChallenge && (
                      <ChildrenChallenge>
                        <Link
                          key={i}
                          to={{
                            pathname: "/profile/game/challenge",
                            state: {
                              gameId: dataProfile.profileInGame.game.id,
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
                    dataProfile.profileInGame.learningPath
                  )
                ) && (
                  <Link
                    to={{
                      pathname: `/game/${dataProfile.profileInGame.game.id}/challenge/${learningPath.challenge.id}`,
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
  const color = useColorModeValue("gray.100", "gray.700");
  const progressBarBg = useColorModeValue("gray.200", "gray.800");

  const textColor = useColorModeValue("black", "white");

  return (
    <Box bg={color} p={3} borderRadius={5}>
      <Heading size="md" color={textColor}>
        {name}
      </Heading>
      <Text color={textColor}>{description}</Text>
      <Progress
        colorScheme="blue"
        size="lg"
        value={progress * 100}
        marginTop={2}
        borderRadius={5}
        bg={progressBarBg}
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

  border-radius: 5px;
  padding: 15px;
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
