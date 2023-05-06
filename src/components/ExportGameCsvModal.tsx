import {
  DocumentNode,
  OperationVariables,
  useApolloClient,
} from "@apollo/client";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useTranslation } from "react-i18next";
import { getGameChallenges } from "../generated/getGameChallenges";
import {
  getGamePlayersQuery,
  getGamePlayersQuery_game_players,
} from "../generated/getGamePlayersQuery";
import { getPlayerFullSubmissionsQuery } from "../generated/getPlayerFullSubmissionsQuery";
import { getPlayerFullValidationsQuery } from "../generated/getPlayerFullValidationsQuery";
import { getPlayerRewardsQuery } from "../generated/getPlayerRewardsQuery";
import { GET_CHALLENGES_BY_GAME } from "../graphql/getChallengesByGame";
import { GET_GAME_PLAYERS } from "../graphql/getGamePlayers";
import { GET_PLAYER_FULL_SUBMISSIONS } from "../graphql/getPlayerFullSubmissions";
import { GET_PLAYER_FULL_VALIDATIONS } from "../graphql/getPlayerFullValidations";
import { GET_PLAYER_REWARDS } from "../graphql/getPlayerRewards";
import { useNotifications } from "./Notifications";

function isString(value: any) {
  return typeof value === "string" || value instanceof String;
}

export const escapeQuote = (v: any) => {
  const objectKeys = Object.keys(v);

  for (let i = 0; i < objectKeys.length; i++) {
    if (isString(v[objectKeys[i]])) {
      v[objectKeys[i]] = v[objectKeys[i]].replace(/"/g, '""');
    }
  }

  return v;
};

export function useLazyQuery<TData = any, TVariables = OperationVariables>(
  query: DocumentNode
) {
  const client = useApolloClient();
  return React.useCallback(
    (variables: TVariables) =>
      client.query<TData, any>({
        query: query,
        variables: variables,
        fetchPolicy: "no-cache",
      }),
    [client]
  );
}

const preparePlayersForCSV = (
  players: getGamePlayersQuery_game_players[],
  gameName: string,
  gameId: string
) => {
  return players.map((player) => {
    const convertedPlayer: any = {
      ...player,
      group: player.group ? player.group.name : "-",
      firstName: player.user.firstName,
      lastName: player.user.lastName,
      userId: player.user.id,
      gameName,
      gameId,
      username: player.user.username,
      email: player.user.email,
    };

    delete convertedPlayer["__typename"];
    delete convertedPlayer["user"];

    return convertedPlayer;
  });
};

const ExportGameCsvModal = ({
  isOpen,
  onOpen,
  onClose,
  gameId,
  gameName,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  gameId: string;
  gameName: string;
}) => {
  const { add: addNotification } = useNotifications();

  const { t } = useTranslation();

  const [readyToDownload, setReadyToDownload] = useState({
    validations: false,
    submissions: false,
    players: false,
    rewards: false,
    challenges: false,
  });

  const [loading, setLoading] = useState({
    players: false,
    validations: false,
    submissions: false,
    rewards: false,
    challenges: false,
  });
  const [players, setPlayers] = useState<getGamePlayersQuery_game_players[]>();
  const [playersValidations, setPlayersValidations] = useState<any>([]);
  const [playersSubmissions, setPlayersSubmissions] = useState<any>([]);
  const [playersRewards, setPlayersRewards] = useState<any>([]);
  const [gameChallenges, setGameChallenges] = useState<any[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setReadyToDownload({
        validations: false,
        submissions: false,
        players: false,
        rewards: false,
        challenges: false,
      });
    }
  }, [isOpen]);

  // const [playerValidationsLoadingState, setPlayerValidationsLoadingState] =
  //   useState<null | {
  //     done: number;
  //     total: number;
  //   }>();

  // const [playersSubmissionsState, setPlayersSubmissionsState] =
  //   useState<null | {
  //     done: number;
  //     total: number;
  //   }>();

  const getGameChallenges = useLazyQuery<getGameChallenges>(
    GET_CHALLENGES_BY_GAME
  );

  const getUserGameRewards =
    useLazyQuery<getPlayerRewardsQuery>(GET_PLAYER_REWARDS);
  const getGamePlayers = useLazyQuery<getGamePlayersQuery>(GET_GAME_PLAYERS);
  const getPlayerFullValidations = useLazyQuery<getPlayerFullValidationsQuery>(
    GET_PLAYER_FULL_VALIDATIONS
  );

  const getPlayerFullSubmissions = useLazyQuery<getPlayerFullSubmissionsQuery>(
    GET_PLAYER_FULL_SUBMISSIONS
  );

  const getAllRewards = async () => {
    setLoading({
      ...loading,
      rewards: true,
    });

    setReadyToDownload({
      ...readyToDownload,
      rewards: false,
    });

    let playersData = players;

    if (!players) {
      const res = await getGamePlayers({ gameId });
      setPlayers(res.data.game.players);
      playersData = res.data.game.players;
    }

    if (!playersData || playersData.length < 1) {
      console.log(" no players");
      addNotification({
        title: t("error.noData.title"),
        description: t("error.noData.description"),
        status: "error",
      });

      setLoading({
        ...loading,
        rewards: false,
      });

      setReadyToDownload({ ...readyToDownload, rewards: false });
      return;
    }

    let playersRewards1: any = [];
    let rewardsCount = 0;
    let causedError = false;

    for (let i = 0; i < playersData.length; i++) {
      try {
        const userId = playersData[i].user.id as string;

        const rewards = await getUserGameRewards({
          gameId,
          userId,
        });

        if (rewards.data.player.rewards.length > 0) {
          rewardsCount++;
        }

        const rewardsConverted = rewards.data.player.rewards.map((reward) => {
          return {
            userId,
            rewardId: reward.reward.id,
            rewardDescription: reward.reward.description,
            rewardKind: reward.reward.kind,
            rewardName: reward.reward.name,
            gameName,
            gameId,
          };
        });

        playersRewards1 = [...playersRewards1, ...rewardsConverted];
      } catch (err) {
        causedError = true;
      }
    }

    if (causedError) {
      addNotification({
        title: t("error.csvProblemWithOneOrMore.title"),
        description: t("error.csvProblemWithOneOrMore.description"),
        status: "error",
      });
    }

    if (rewardsCount < 1) {
      console.log("no rewards");

      addNotification({
        title: t("error.noData.title"),
        description: t("error.noData.description"),
        status: "error",
      });

      setLoading({
        ...loading,
        rewards: false,
      });

      setReadyToDownload({ ...readyToDownload, rewards: false });

      return;
    }

    setPlayersRewards(playersRewards1);

    setLoading({
      ...loading,
      rewards: false,
    });

    setReadyToDownload({ ...readyToDownload, rewards: true });
  };

  const getPlayers = async () => {
    setLoading({
      ...loading,
      players: true,
    });

    setReadyToDownload({
      ...readyToDownload,
      players: false,
    });

    const res = await getGamePlayers({
      gameId,
    });

    if (!res.data.game.players) {
      setReadyToDownload({
        ...readyToDownload,
        players: false,
      });
      setLoading({
        ...loading,
        players: false,
      });
      return;
    }

    console.log("PLAYERS", res.data.game.players);
    if (res.data.game.players.length < 1) {
      console.log("error no player");
      addNotification({
        title: t("error.noData.title"),
        description: t("error.noData.description"),
        status: "error",
      });

      setReadyToDownload({
        ...readyToDownload,
        players: false,
      });
      setLoading({
        ...loading,
        players: false,
      });
      return;
    }

    setPlayers(res.data.game.players);

    setReadyToDownload({
      ...readyToDownload,
      players: true,
    });
    setLoading({
      ...loading,
      players: false,
    });
  };

  const getAttempts = async (downloadValidations: boolean) => {
    if (downloadValidations) {
      setReadyToDownload({
        ...readyToDownload,
        validations: false,
      });
    } else {
      setReadyToDownload({
        ...readyToDownload,
        submissions: false,
      });
    }

    setLoading({
      ...loading,
      submissions: !downloadValidations,
      validations: downloadValidations,
    });

    let playersData = players;

    if (!players) {
      const res = await getGamePlayers({ gameId });
      setPlayers(res.data.game.players);
      playersData = res.data.game.players;
    }

    console.log("p data", playersData);
    if (!playersData || playersData.length < 1) {
      console.log("error no data");
      addNotification({
        title: t("error.noData.title"),
        description: t("error.noData.description"),
        status: "error",
      });
      if (downloadValidations) {
        setLoading({
          ...loading,
          validations: false,
        });

        setReadyToDownload({ ...readyToDownload, validations: false });
      } else {
        setLoading({
          ...loading,
          submissions: false,
        });

        setReadyToDownload({ ...readyToDownload, submissions: false });
      }
      return;
    }

    let attemptsCount = 0;
    let playersAttempts: any = [];
    let causedErrors = false;

    for (let i = 0; i < playersData.length; i++) {
      try {
        let userId = playersData[i].user.id as string;

        const res1 = downloadValidations
          ? await getPlayerFullValidations({
              userId: userId,
              gameId,
            })
          : await getPlayerFullSubmissions({
              userId: userId,
              gameId,
            });

        if (downloadValidations) {
          if (
            (res1.data as getPlayerFullValidationsQuery).validations.length > 0
          ) {
            attemptsCount++;
          }

          console.log("attempts", attemptsCount);

          const convertedValidations = (
            res1.data as getPlayerFullValidationsQuery
          ).validations.map((validation) => {
            let converted: any = { ...validation };
            delete converted["player"];
            converted.metrics = JSON.stringify(converted.metrics);
            converted.player = validation.player.id;
            converted.outputs = JSON.stringify(converted.outputs);
            converted.userExecutionTimes = JSON.stringify(
              converted.userExecutionTimes
            );
            converted.gameId = gameId;
            converted.gameName = gameName;
            return { ...converted, user: userId };
          });

          // console.log("SETTINGS VALIDATIONS", [
          //   ...playersValidations,
          //   ...convertedValidations,
          // ]);

          playersAttempts = [...playersAttempts, ...convertedValidations];
        } else {
          if (
            (res1.data as getPlayerFullSubmissionsQuery).submissions.length > 0
          ) {
            attemptsCount++;
          }

          const convertedSubmissions = (
            res1.data as getPlayerFullSubmissionsQuery
          ).submissions.map((submission) => {
            let converted: any = { ...submission };
            delete converted["player"];
            converted.metrics = JSON.stringify(converted.metrics);
            converted.player = submission.player.id;
            converted.gameId = gameId;
            converted.gameName = gameName;

            return { ...converted, user: userId };
          });

          playersAttempts = [...playersAttempts, ...convertedSubmissions];
        }
      } catch (err) {
        causedErrors = true;
      }
    }

    if (causedErrors) {
      addNotification({
        title: t("error.csvProblemWithOneOrMore.title"),
        description: t("error.csvProblemWithOneOrMore.description"),
        status: "error",
      });
    }

    if (attemptsCount < 1) {
      addNotification({
        title: t("error.noData.title"),
        description: t("error.noData.description"),
        status: "error",
      });

      if (downloadValidations) {
        setLoading({
          ...loading,
          validations: false,
        });

        setReadyToDownload({ ...readyToDownload, validations: false });
      } else {
        setLoading({
          ...loading,
          submissions: false,
        });

        setReadyToDownload({ ...readyToDownload, submissions: false });
      }

      return;
    }

    if (downloadValidations) {
      setPlayersValidations([...playersAttempts]);
    } else {
      setPlayersSubmissions([...playersAttempts]);
    }

    if (downloadValidations) {
      setLoading({
        ...loading,
        validations: false,
      });

      console.log("settings download reeady");

      setReadyToDownload({ ...readyToDownload, validations: true });
    } else {
      setLoading({
        ...loading,
        submissions: false,
      });

      setReadyToDownload({ ...readyToDownload, submissions: true });
    }

    // done();
  };

  const getChallengesForGame = async () => {
    setLoading({
      ...loading,
      challenges: true,
    });

    setReadyToDownload({
      ...readyToDownload,
      challenges: false,
    });

    const challenges = await getGameChallenges({
      gameId,
    });

    if (!challenges) {
      setLoading({
        ...loading,
        challenges: false,
      });
    }

    let allExercises: {
      challengeName: string;
      challengeId: string;
      exerciseName: string | null;
      exerciseId: string | null;
    }[] = [];

    challenges.data.challenges.forEach((challenge) => {
      const refs = challenge.refs;

      const refsConverted = refs.map((ref) => {
        return {
          challengeName: challenge.name,
          challengeId: challenge.id,
          exerciseName: ref.name,
          exerciseId: ref.id,
        };
      });

      allExercises = [...allExercises, ...refsConverted];
    });

    setGameChallenges(allExercises);

    setReadyToDownload({
      ...readyToDownload,
      challenges: true,
    });

    setLoading({
      ...loading,
      challenges: false,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>CSV {t("Export")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack
            divider={<StackDivider borderColor="gray.500" />}
            spacing={1}
            align="stretch"
          >
            <Flex h="40px" justifyContent="space-between" alignItems="center">
              <Text>{t("Game profiles")}</Text>
              {/* {gamePlayersData &&
                !playersLoading &&
                !playersError &&
                downloadPlayers && (
                  <CSVDownload
                    data={preparePlayersForCSV(gamePlayersData.game.players)}
                    target="_blank"
                  />
                )}
                */}

              {readyToDownload.players ? (
                <CSVLink
                  data={
                    readyToDownload.players
                      ? preparePlayersForCSV(
                          players as getGamePlayersQuery_game_players[],
                          gameName,
                          gameId
                        ).map((v: any) => escapeQuote(v))
                      : []
                  }
                >
                  <Button size="sm">{t("Export")}</Button>
                </CSVLink>
              ) : (
                <Button
                  size="sm"
                  isLoading={loading.players}
                  onClick={getPlayers}
                >
                  {t("Download")}
                </Button>
              )}
            </Flex>
            <Flex h="40px" justifyContent="space-between" alignItems="center">
              <Text>{t("submissions")}</Text>

              {readyToDownload.submissions ? (
                <CSVLink
                  data={
                    readyToDownload.submissions
                      ? playersSubmissions.map((v: any) => escapeQuote(v))
                      : []
                  }
                >
                  <Button size="sm">{t("Export")}</Button>
                </CSVLink>
              ) : (
                <Button
                  size="sm"
                  isLoading={loading.submissions}
                  onClick={async () => {
                    try {
                      await getAttempts(false);
                    } catch (err) {
                      addNotification({
                        title: t("error.unknownProblem.title"),
                        description: t("error.unknownProblem.description"),
                        status: "error",
                      });

                      setLoading({ ...loading, submissions: false });
                    }
                  }}
                >
                  {t("Download")}
                </Button>
              )}
            </Flex>
            <Flex h="40px" justifyContent="space-between" alignItems="center">
              <Text>{t("validations")}</Text>
              {readyToDownload.validations ? (
                <CSVLink
                  data={
                    readyToDownload.validations
                      ? playersValidations.map((v: any) => escapeQuote(v))
                      : []
                  }
                >
                  <Button size="sm">{t("Export")}</Button>
                </CSVLink>
              ) : (
                <Button
                  isLoading={loading.validations}
                  size="sm"
                  onClick={async () => {
                    try {
                      await getAttempts(true);
                    } catch (err) {
                      addNotification({
                        title: t("error.unknownProblem.title"),
                        description: t("error.unknownProblem.description"),
                        status: "error",
                      });

                      setLoading({ ...loading, validations: false });
                    }
                  }}
                >
                  {t("Download")}
                </Button>
              )}
            </Flex>
            <Flex h="40px" justifyContent="space-between" alignItems="center">
              <Text>{t("Rewards")}</Text>
              {readyToDownload.rewards ? (
                <CSVLink
                  data={
                    readyToDownload.rewards
                      ? playersRewards.map((v: any) => escapeQuote(v))
                      : []
                  }
                >
                  <Button size="sm">{t("Export")}</Button>
                </CSVLink>
              ) : (
                <Button
                  isLoading={loading.rewards}
                  size="sm"
                  onClick={async () => {
                    try {
                      await getAllRewards();
                    } catch (err) {
                      addNotification({
                        title: t("error.unknownProblem.title"),
                        description: t("error.unknownProblem.description"),
                        status: "error",
                      });

                      setLoading({ ...loading, rewards: false });
                    }
                  }}
                >
                  {t("Download")}
                </Button>
              )}
            </Flex>
            <Flex h="40px" justifyContent="space-between" alignItems="center">
              <Text>{t("Challenges")}</Text>
              {readyToDownload.challenges ? (
                <CSVLink
                  data={
                    readyToDownload.challenges
                      ? gameChallenges.map((v: any) => escapeQuote(v))
                      : []
                  }
                >
                  <Button size="sm">{t("Export")}</Button>
                </CSVLink>
              ) : (
                <Button
                  isLoading={loading.challenges}
                  size="sm"
                  onClick={async () => {
                    try {
                      await getChallengesForGame();
                    } catch (err) {
                      addNotification({
                        title: t("error.unknownProblem.title"),
                        description: t("error.unknownProblem.description"),
                        status: "error",
                      });

                      setLoading({ ...loading, challenges: false });
                    }
                  }}
                >
                  {t("Download")}
                </Button>
              )}
            </Flex>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            {t("Close")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExportGameCsvModal;
