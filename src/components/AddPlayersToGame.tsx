import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
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
import { GET_GROUPS } from "../graphql/getGroups";
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { REMOVE_MULTIPLE_FROM_GAME } from "../graphql/removeMultipleFromGame";
import { ADD_MULTIPLE_TO_GAME } from "../graphql/addMultipleToGame";
import { useNotifications } from "./Notifications";

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

const AddPlayersToGame = () => {
  const [isUserSelected, setIsUserSelected] = useState<boolean>(false);
  const selectedUsersRef = useRef<any>([]);
  const { add: addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);

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
    addUsersToGame,
    { data: addPlayerData, loading: addPlayerLoading },
  ] = useMutation(ADD_MULTIPLE_TO_GAME);

  const [
    removeUsersFromGame,
    { data: removePlayerData, loading: removePlayerLoading },
  ] = useMutation(REMOVE_MULTIPLE_FROM_GAME);

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

  const getSelectedUsersIds = () => {
    return selectedUsersRef.current.map((user: any) => user.id);
  };

  const getSelectedUsersAndRemoveFromGame = async () => {
    setLoading(true);
    const selectedUsersIds = getSelectedUsersIds();

    try {
      await removeUsersFromGame({
        variables: {
          gameId,
          usersIds: selectedUsersIds,
        },
      });

      await refetchGame();
    } catch (err) {
      addNotification({
        status: "error",
        title: t("error.removePlayers.title"),
        description: t("error.removePlayers.description"),
      });
    }

    setLoading(false);
  };

  const getSelectedUsersAndAddToGame = async () => {
    setLoading(true);
    const selectedUsersIds = getSelectedUsersIds();

    await addUsersToGame({
      variables: {
        gameId,
        usersIds: selectedUsersIds,
      },
    });

    await refetchGame();
    setLoading(false);
  };

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

        <Divider marginBottom={25} />

        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" size="sm" marginTop={5} marginBottom={5}>
            {t("Students")}
          </Heading>

          <Menu>
            <MenuButton
              disabled={!isUserSelected}
              size="sm"
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              {t("Actions")}
            </MenuButton>

            <MenuList>
              <MenuItem onClick={getSelectedUsersAndAddToGame}>
                {t("Add to the game")}
              </MenuItem>
              <MenuItem onClick={getSelectedUsersAndRemoveFromGame}>
                {t("Remove from the game")}
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        <Box>
          <TableComponent
            loading={loading}
            selectableRows
            setIsAnythingSelected={setIsUserSelected}
            setSelectedStudents={(rows: typeof dataUsers.usersByRole[]) => {
              selectedUsersRef.current = rows;
            }}
            columns={[
              {
                Header: t("table.enrolled"),
                accessor: (row: any) =>
                  !!dataGame.game.players.find(
                    (gamePlayer) => gamePlayer.user.id === row.id
                  ),
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
                Cell: ({ value }: { value: any }) =>
                  value ? t("Yes") : t("No"),
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
