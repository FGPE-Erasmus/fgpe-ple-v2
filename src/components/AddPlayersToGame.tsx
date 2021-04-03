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
} from "@chakra-ui/react";
import React, { useState } from "react";
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
import ColumnFilter from "./TableComponent/ColumnFilter";
import { useTranslation } from "react-i18next";

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
    data: dataUsers,
    error: errorUsers,
    loading: loadingUsers,
  } = useQuery<usersByRoleQuery>(USERS_BY_ROLE_QUERY, {
    variables: { role: "student" },
    fetchPolicy: "no-cache",
  });

  if (loadingUsers || loadingGame) {
    return <div>Loading...</div>;
  }

  if (!dataGame || !dataUsers) {
    return <div>No data</div>;
  }

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
            {t("Game")}: {dataGame.game.name}
          </Heading>
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

      <Box>
        <TableComponent
          dontRecomputeChange
          columns={[
            {
              Header: t("table.enrolled"),
              accessor: "id",
              disableFilters: true,
              width: 100,

              disableSortBy: true,
              Cell: ({ value }: { value: any }) => {
                return (
                  <PlayerCheckbox
                    addPlayer={addPlayer}
                    removePlayer={removePlayer}
                    refetchGame={refetchGame}
                    gameId={gameId}
                    userId={value}
                    initialChecked={
                      !!dataGame.game.players.find(
                        (gamePlayer) => gamePlayer.user.id === value
                      )
                    }
                  />
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

            // {
            //   Header: t("table.submissions"),
            //   accessor: "submissions.length",
            //   Filter: ({ column }: { column: any }) => (
            //     <ColumnFilter column={column} placeholder="123" />
            //   ),
            // },
            // {
            //   Header: t("table.validations"),
            //   accessor: "validations.length",
            //   Filter: ({ column }: { column: any }) => (
            //     <ColumnFilter column={column} placeholder="123" />
            //   ),
            // },
            // {
            //   Header: t("table.group"),
            //   accessor: "group.name",
            //   Cell: ({ value }: { value: any }) => {
            //     return value ? value : "-";
            //   },
            //   Filter: ({ column }: { column: any }) => (
            //     <ColumnFilter
            //       column={column}
            //       placeholder={t("placeholders.group")}
            //     />
            //   ),
            // },
          ]}
          data={dataUsers.usersByRole}
        />
      </Box>
      {/* 
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th width={30}>Enrolled</Th>
            <Th>First Name</Th>
            <Th>Last Name</Th>
            <Th>Email</Th>
          </Tr>
          <Tr>
            <Th>-</Th>
            <Th>
              <Input
                size="xs"
                placeholder="John"
                value={tableFilters.firstName}
                onChange={(e) =>
                  setTableFilters({
                    ...tableFilters,
                    firstName: e.target.value,
                  })
                }
              />
            </Th>
            <Th>
              <Input
                size="xs"
                placeholder="Smith"
                value={tableFilters.lastName}
                onChange={(e) =>
                  setTableFilters({
                    ...tableFilters,
                    lastName: e.target.value,
                  })
                }
              />
            </Th>
            <Th>
              <Input
                size="xs"
                placeholder="E-Mail"
                value={tableFilters.email}
                onChange={(e) =>
                  setTableFilters({
                    ...tableFilters,
                    email: e.target.value,
                  })
                }
              />
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {dataUsers?.usersByRole.map((user, i) => {
            if (!user.email) {
              user.email = "N/A";
            }
            if (!user.firstName) {
              user.firstName = "N/A";
            }

            if (!user.lastName) {
              user.lastName = "N/A";
            }

            if (
              !user.firstName
                .toLowerCase()
                .includes(tableFilters.firstName.toLowerCase())
            ) {
              return;
            }

            if (
              !user.lastName
                .toLowerCase()
                .includes(tableFilters.lastName.toLowerCase())
            ) {
              return;
            }

            if (
              !user.email
                .toLowerCase()
                .includes(tableFilters.email.toLowerCase())
            ) {
              return;
            }

            return (
              <Tr key={i}>
                <Td>
                  <Box display="flex">
                    <PlayerCheckbox
                      addPlayer={addPlayer}
                      removePlayer={removePlayer}
                      gameId={gameId}
                      userId={user.id}
                      initialChecked={
                        !!dataGame.game.players.find(
                          (gamePlayer) => gamePlayer.user.id === user.id
                        )
                      }
                    />
                  </Box>
                </Td>
                <Td>{user.firstName}</Td>
                <Td>{user.lastName}</Td>
                <Td>{user.email}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table> */}
    </Box>
  );
};

const PlayerCheckbox = ({
  initialChecked,
  userId,
  gameId,
  addPlayer,
  removePlayer,
  refetchGame,
}: {
  initialChecked: boolean;
  userId: string | null;
  gameId: string;
  addPlayer: (
    options?: MutationFunctionOptions<any, Record<string, any>> | undefined
  ) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;
  removePlayer: (
    options?: MutationFunctionOptions<any, Record<string, any>> | undefined
  ) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;
  refetchGame: () => void;
}) => {
  const [checked, setChecked] = useState(initialChecked);
  const [loading, setLoading] = useState(false);

  const addOrRemovePlayer = async (add: boolean) => {
    setLoading(true);
    if (add) {
      const res = await addPlayer({
        variables: {
          gameId,
          userId,
        },
      });
      setLoading(false);

      if (!res.errors) {
        setChecked(true);
      }
    } else {
      const res = await removePlayer({
        variables: {
          gameId,
          userId,
        },
      });
      setLoading(false);

      if (!res.errors) {
        setChecked(false);
      }
    }
  };

  return (
    <>
      <Checkbox
        disabled={loading}
        isChecked={checked}
        colorScheme={loading ? "orange" : "blue"}
        onChange={(e) => {
          addOrRemovePlayer(e.target.checked);
        }}
      />
      {loading && <Spinner size="sm" marginLeft={2} />}
    </>
  );
};

export default withChangeAnimation(AddPlayersToGame);
