import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Input,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import withChangeAnimation from "../utilities/withChangeAnimation";
import {
  FetchResult,
  gql,
  MutationFunctionOptions,
  useMutation,
  useQuery,
} from "@apollo/client";

import { usersByRoleQuery } from "../generated/usersByRoleQuery";
import { gameQuery } from "../generated/gameQuery";

import { motion, AnimatePresence } from "framer-motion";
import { table } from "console";
import TableComponent from "./TableComponent";
import ColumnFilter, {
  ColumnSelectFilter,
} from "./TableComponent/ColumnFilter";
import { useTranslation } from "react-i18next";
import { Cell } from "react-table";
import GenerateInviteLinkModal from "./GenerateInviteLinkModal";
import { getGroupsQuery } from "../generated/getGroupsQuery";
import { GET_GROUPS } from "../graphql/GET_GROUPS";

interface ParamTypes {
  gameId: string;
}

const GAME_QUERY = gql`
  query gameQuery($gameId: String!) {
    game(id: $gameId) {
      id
      name
      players {
        id
        user {
          id
        }
      }
    }
  }
`;

const USERS_BY_ROLE_QUERY = gql`
  query usersByRoleQuery($role: String!) {
    usersByRole(role: $role) {
      id
      emailVerified
      username
      firstName
      lastName
      username
      email
    }
  }
`;

const ADD_PLAYER_TO_GAME = gql`
  mutation addPlayerToGameMutation($gameId: String!, $userId: String!) {
    addToGame(gameId: $gameId, userId: $userId) {
      id
      game {
        id
      }
      user {
        username
      }
    }
  }
`;

const REMOVE_PLAYER_FROM_GAME = gql`
  mutation removePlayerFromGameMutation($gameId: String!, $userId: String!) {
    removeFromGame(gameId: $gameId, userId: $userId) {
      id
    }
  }
`;

const AddPlayersToGame = () => {
  const {
    isOpen: isGenerateInviteModalOpen,
    onOpen: onGenerateInviteModalOpen,
    onClose: onGenerateInviteModalClose,
  } = useDisclosure();

  const { t } = useTranslation();

  const { gameId } = useParams<ParamTypes>();
  const [tableFilters, setTableFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [
    addPlayer,
    { data: addPlayerData, loading: addPlayerLoading },
  ] = useMutation(ADD_PLAYER_TO_GAME);

  const [
    removePlayer,
    { data: removePlayerData, loading: removePlayerLoading },
  ] = useMutation(REMOVE_PLAYER_FROM_GAME);

  const {
    data: dataGame,
    error: errorGame,
    loading: loadingGame,
    refetch: refetchGame,
  } = useQuery<gameQuery>(GAME_QUERY, {
    variables: { gameId },
    fetchPolicy: "no-cache",
  });

  const {
    data: dataGroups,
    error: errorGroups,
    loading: loadingGroups,
  } = useQuery<getGroupsQuery>(GET_GROUPS, {
    variables: { gameId },
    fetchPolicy: "no-cache",
  });

  const {
    data: dataUsers,
    error: errorUsers,
    loading: loadingUsers,
  } = useQuery<usersByRoleQuery>(USERS_BY_ROLE_QUERY, {
    variables: { role: "student" },
    fetchPolicy: "no-cache",
  });

  if (loadingUsers || loadingGame || loadingGroups) {
    return <div>Loading...</div>;
  }

  if (!dataGame || !dataUsers || !dataGroups) {
    return <div>No data</div>;
  }

  return (
    <>
      <GenerateInviteLinkModal
        onClose={onGenerateInviteModalClose}
        isOpen={isGenerateInviteModalOpen}
        groupsData={dataGroups}
        gameId={gameId}
      />
      <Box>
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
              {t("Game")}: {dataGame.game.name}
            </Heading>
          </Box>
          <Flex>
            <Box marginRight={2}>
              <Button onClick={onGenerateInviteModalOpen}>
                {t("Generate invite link")}
              </Button>
            </Box>

            <Box>
              <Link
                to={{
                  pathname: `/teacher/game/${gameId}`,
                }}
              >
                <Button>{t("Proceed")}</Button>
              </Link>
            </Box>
          </Flex>
        </Flex>

        <Box>
          <TableComponent
            // dontRecomputeChange
            columns={[
              {
                Header: t("table.enrolled"),
                accessor: "id",
                // disableFilters: true,
                width: 100,
                disableSortBy: true,
                filter: (rows: any[], id: string, filterValue: any) => {
                  return rows.filter((row) => {
                    if (filterValue == "all") {
                      return true;
                    }
                    const isEnrolled = !!dataGame.game.players.find(
                      (gamePlayer) => gamePlayer.user.id === row.original.id
                    );
                    if (isEnrolled && filterValue == "true") {
                      return true;
                    }

                    if (!isEnrolled && filterValue != "true") {
                      return true;
                    }

                    return false;
                  });
                },
                Filter: ({ column }: { column: any }) => (
                  <ColumnSelectFilter
                    column={column}
                    options={[
                      {
                        text: t("All"),
                        value: "all",
                      },
                      {
                        text: t("Enrolled"),
                        value: true,
                      },
                      { text: t("Not enrolled"), value: false },
                    ]}
                  />
                ),
                Cell: ({
                  cell,
                  value,
                  row,
                  state,
                  setState,
                  setRowState,
                }: {
                  cell: Cell;
                  value: any;
                  row: number;
                  state: any;
                  setState: (value: any) => void;
                  setRowState: (value: any) => void;
                }) => {
                  return (
                    <>
                      <Checkbox
                        isChecked={
                          !!dataGame.game.players.find(
                            (gamePlayer) => gamePlayer.user.id === value
                          )
                        }
                        disabled={cell.state.loading ? true : false}
                        colorScheme={cell.state.loading ? "orange" : "blue"}
                        onChange={async (e) => {
                          cell.setState({ loading: true });

                          if (!e.target.checked) {
                            await removePlayer({
                              variables: {
                                gameId,
                                userId: value,
                              },
                            });
                          } else {
                            await addPlayer({
                              variables: {
                                gameId,
                                userId: value,
                              },
                            });
                          }

                          cell.setState({ loading: false });
                          refetchGame();
                        }}
                      />
                      {cell.state.loading && (
                        <Spinner size="sm" marginLeft={2} />
                      )}
                    </>
                  );
                },
              },
              {
                Header: t("table.name"),
                accessor: "firstName",
                Filter: ({ column }: { column: any }) => (
                  <ColumnFilter
                    column={column}
                    placeholder={t("placeholders.name")}
                  />
                ),
              },
              {
                Header: t("table.lastName"),
                accessor: "lastName",
                Filter: ({ column }: { column: any }) => (
                  <ColumnFilter
                    column={column}
                    placeholder={t("placeholders.lastName")}
                  />
                ),
              },
              {
                Header: t("table.email"),
                accessor: "email",
                Filter: ({ column }: { column: any }) => (
                  <ColumnFilter
                    column={column}
                    placeholder={t("placeholders.email")}
                  />
                ),
              },
            ]}
            data={dataUsers.usersByRole}
          />
        </Box>
      </Box>
    </>
  );
};

export default withChangeAnimation(AddPlayersToGame);
