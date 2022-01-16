import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Heading,
  Icon,
  Progress,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import { useTranslation } from "react-i18next";
import { BiCheck, BiCircle, BiXCircle } from "react-icons/bi";
import { HiLockClosed, HiLockOpen } from "react-icons/hi";
import { Link, Redirect, useParams } from "react-router-dom";
import { State } from "../generated/globalTypes";
import {
  ProfileInGameQuery,
  ProfileInGameQuery_profileInGame_learningPath,
  ProfileInGameQuery_profileInGame_learningPath_challenge_parentChallenge,
} from "../generated/ProfileInGameQuery";
import { checkIfConnectionAborted } from "../utilities/ErrorMessages";
import withChangeAnimation from "../utilities/withChangeAnimation";
import Error from "./Error";
import { isGameAvailable } from "./GamesList";
import RankingTable from "./RankingTable";

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
        startDate
        endDate
        state
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
      }
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
    if (challenge.parentChallenge?.id === parentChallenge.id) {
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

const getIconForLearningPathState = (state: State) => {
  switch (state) {
    case State.AVAILABLE:
      return BiCircle;

    case State.COMPLETED:
      return BiCheck;

    case State.FAILED:
      return BiXCircle;

    case State.HIDDEN:
      return HiLockClosed;

    case State.LOCKED:
      return HiLockClosed;

    case State.OPENED:
      return HiLockOpen;

    case State.REJECTED:
      return HiLockClosed;

    default:
      return BiCircle;
  }
};

const ProfileInGame = () => {
  // const { setActiveChallenge } = useContext(NavContext);
  const { gameId } = useParams<ParamTypes>();
  const { t } = useTranslation();

  const {
    loading: loadingProfile,
    error: errorProfile,
    data: dataProfile,
  } = useQuery<ProfileInGameQuery>(PROFILE_IN_GAME, {
    fetchPolicy: "no-cache",
    variables: { gameId },
  });

  if (!gameId) {
    return <Text>Game ID not provided</Text>;
  }

  if (loadingProfile) return <div>{t("Loading")}</div>;

  if (!loadingProfile && errorProfile) {
    const isServerConnectionError = checkIfConnectionAborted(errorProfile);

    if (isServerConnectionError) {
      return <Error serverConnectionError />;
    } else {
      return <Error errorContent={JSON.stringify(errorProfile)} />;
    }
  }

  if (!dataProfile) return <Text>no data</Text>;

  if (!isGameAvailable(dataProfile.profileInGame.game)) {
    return <Redirect to="/profile" />;
  }

  return (
    <Box>
      {/* Breadcrumb has been removed, because there's a game name in the header */}
      {/* <BreadcrumbComponent
        gameName={dataProfile.profileInGame.game.name}
        gameId={gameId}
      /> */}

      <Heading as="h3" size="lg">
        {t("Game")}: {dataProfile.profileInGame.game.name}
      </Heading>
      <Box>
        <RankingTable gameId={gameId} />
      </Box>

      <Heading as="h3" size="md">
        {t("Challenges")}
      </Heading>
      <Box>
        {dataProfile.profileInGame.learningPath.map((learningPath, i) => {
          if (
            learningPath.state === State.HIDDEN ||
            learningPath.state === State.REJECTED
          ) {
            return;
          }

          return (
            !learningPath.challenge.parentChallenge && (
              <ParentChallenge
                key={i}
                available={learningPath.state !== State.LOCKED}
                withoutChildren={isChallengeWithoutChildren(
                  getChallengeChildren(
                    learningPath.challenge,
                    dataProfile.profileInGame.learningPath
                  )
                )}
              >
                {
                  <Icon
                    w={6}
                    h={6}
                    m={4}
                    float="right"
                    as={getIconForLearningPathState(learningPath.state)}
                  />
                }

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
                          // onClick={() =>
                          //   setActiveChallenge({
                          //     id: childChallenge.id,
                          //     name: childChallenge.name,
                          //   })
                          // }
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
                    // onClick={() =>
                    //   setActiveChallenge({
                    //     id: learningPath.challenge.id,
                    //     name: learningPath.challenge.name,
                    //   })
                    // }
                  >
                    <ChallengeBox
                      progress={learningPath.progress}
                      name={learningPath.challenge.name}
                      description={
                        learningPath.challenge.description
                          ? learningPath.challenge.description
                          : t("No description")
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
