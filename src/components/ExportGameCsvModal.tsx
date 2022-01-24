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
import { CSVDownload } from "react-csv";
import {
  getGamePlayersQuery,
  getGamePlayersQuery_game_players,
} from "../generated/getGamePlayersQuery";
import { getPlayerFullSubmissionsQuery } from "../generated/getPlayerFullSubmissionsQuery";
import { getPlayerFullValidationsQuery } from "../generated/getPlayerFullValidationsQuery";
import { GET_GAME_PLAYERS } from "../graphql/getGamePlayers";
import { GET_PLAYER_FULL_SUBMISSIONS } from "../graphql/getPlayerFullSubmissions";
import { GET_PLAYER_FULL_VALIDATIONS } from "../graphql/getPlayerFullValidations";

export function useLazyQuery<TData = any, TVariables = OperationVariables>(
  query: DocumentNode
) {
  const client = useApolloClient();
  return React.useCallback(
    (variables: TVariables) =>
      client.query<TData, TVariables>({
        query: query,
        variables: variables,
        fetchPolicy: "no-cache",
      }),
    [client]
  );
}

const preparePlayersForCSV = (players: getGamePlayersQuery_game_players[]) => {
  return players.map((player) => {
    const convertedPlayer: any = {
      ...player,
      group: player.group ? player.group.name : "-",
      firstName: player.user.firstName,
      lastName: player.user.lastName,
      userId: player.user.id,
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
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  gameId: string;
}) => {
  const [readyToDownload, setReadyToDownload] = useState({
    validations: false,
    submissions: false,
    players: false,
  });

  const [loading, setLoading] = useState({
    players: false,
    validations: false,
    submissions: false,
  });
  const [players, setPlayers] = useState<getGamePlayersQuery_game_players[]>();
  const [playersValidations, setPlayersValidations] = useState<any>([]);
  const [playersSubmissions, setPlayersSubmissions] = useState<any>([]);

  useEffect(() => {
    if (!isOpen) {
      setReadyToDownload({
        validations: false,
        submissions: false,
        players: false,
      });
    }
  }, [isOpen]);

  const [playerValidationsLoadingState, setPlayerValidationsLoadingState] =
    useState<null | {
      done: number;
      total: number;
    }>();

  const [playersSubmissionsState, setPlayersSubmissionsState] =
    useState<null | {
      done: number;
      total: number;
    }>();

  const getGamePlayers = useLazyQuery<getGamePlayersQuery>(GET_GAME_PLAYERS);
  const getPlayerFullValidations = useLazyQuery<getPlayerFullValidationsQuery>(
    GET_PLAYER_FULL_VALIDATIONS
  );

  const getPlayerFullSubmissions = useLazyQuery<getPlayerFullSubmissionsQuery>(
    GET_PLAYER_FULL_SUBMISSIONS
  );

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

    if (!playersData) {
      return;
    }

    for (let i = 0; i < playersData.length; i++) {
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

          return { ...converted, user: userId };
        });

        setPlayersValidations([...playersValidations, ...convertedValidations]);
      } else {
        const convertedSubmissions = (
          res1.data as getPlayerFullSubmissionsQuery
        ).submissions.map((submission) => {
          let converted: any = { ...submission };
          delete converted["player"];
          converted.metrics = JSON.stringify(converted.metrics);
          converted.player = submission.player.id;

          return { ...converted, user: userId };
        });

        setPlayersSubmissions([...playersSubmissions, ...convertedSubmissions]);
      }
    }

    if (downloadValidations) {
      setLoading({
        ...loading,
        validations: false,
      });

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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>CSV Export</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack
            divider={<StackDivider borderColor="gray.500" />}
            spacing={1}
            align="stretch"
          >
            <Flex h="40px" justifyContent="space-between" alignItems="center">
              <Text>Students game profiles</Text>
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

              {readyToDownload.players && (
                <CSVDownload
                  data={
                    readyToDownload.players
                      ? preparePlayersForCSV(
                          players as getGamePlayersQuery_game_players[]
                        )
                      : []
                  }
                />
              )}

              <Button
                size="sm"
                isLoading={loading.players}
                onClick={getPlayers}
              >
                Download
              </Button>
            </Flex>
            <Flex h="40px" justifyContent="space-between" alignItems="center">
              <Text>All submissions</Text>

              {readyToDownload.submissions && (
                <CSVDownload
                  data={readyToDownload.submissions ? playersSubmissions : []}
                />
              )}

              <Button
                size="sm"
                isLoading={loading.submissions}
                onClick={async () => {
                  await getAttempts(false);
                }}
              >
                Download
              </Button>
            </Flex>
            <Flex h="40px" justifyContent="space-between" alignItems="center">
              <Text>All validations</Text>
              <Button
                isLoading={loading.validations}
                size="sm"
                onClick={async () => {
                  await getAttempts(true);
                }}
              >
                Download
              </Button>
              {readyToDownload.validations && (
                <CSVDownload
                  data={readyToDownload.validations ? playersValidations : []}
                />
              )}
            </Flex>
            <Flex h="40px" justifyContent="space-between" alignItems="center">
              <Text>All rewards</Text>
              <Button size="sm">Download</Button>{" "}
            </Flex>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExportGameCsvModal;
