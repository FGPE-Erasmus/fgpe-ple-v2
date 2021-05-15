import { useMutation, useQuery } from "@apollo/client";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  getGameByIdQuery,
  getGameByIdQuery_game_players,
} from "../../generated/getGameByIdQuery";
import { getOverallStats } from "../../generated/getOverallStats";
import { removeMultipleFromGameMutation } from "../../generated/removeMultipleFromGameMutation";
import { AUTO_ASSIGN_GROUPS } from "../../graphql/autoAssignGroups";
import { GET_GAME_BY_ID } from "../../graphql/getGameById";
import { GET_OVERALL_STATS } from "../../graphql/getOverallStats";
import { REMOVE_MULTIPLE_FROM_GAME } from "../../graphql/removeMultipleFromGame";
import { REMOVE_MULTIPLE_FROM_GROUP } from "../../graphql/removeMultipleFromGroup";
import { checkIfConnectionAborted } from "../../utilities/ErrorMessages";
import withChangeAnimation from "../../utilities/withChangeAnimation";
import DetailsCard from "../DetailsCard";
import Error from "../Error";
import { useNotifications } from "../Notifications";
import TableComponent from "../TableComponent";
import ColumnFilter from "../TableComponent/ColumnFilter";
import ActivitiesStats from "./ActivitiesStats";
import AddGroupModal from "./AddGroupModal";
import ChangeDetailsModal from "./ChangeDetailsModal";
import SetGroupModal from "./SetGroupModal";
import dayjs from "dayjs";

interface ParamTypes {
  gameId: string;
}

const InstructorGame = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const {
    isOpen: isDetailsModalOpen,
    onOpen: onDetailsModalOpen,
    onClose: onDetailsModalClose,
  } = useDisclosure();

  const {
    isOpen: isAddGroupModalOpen,
    onOpen: onAddGroupModalOpen,
    onClose: onAddGroupModalClose,
  } = useDisclosure();

  const {
    isOpen: isSetGroupModalOpen,
    onOpen: onSetGroupModalOpen,
    onClose: onSetGroupModalClose,
  } = useDisclosure();

  const { add: addNotification } = useNotifications();

  const { gameId } = useParams<ParamTypes>();
  const { t } = useTranslation();

  const selectedStudentsRef = useRef([]);
  const [isStudentSelected, setIsStudentSelected] = useState<boolean>(false);

  const [removeMultipleFromGame] = useMutation<removeMultipleFromGameMutation>(
    REMOVE_MULTIPLE_FROM_GAME
  );

  const [removeMultipleFromGroup] = useMutation(REMOVE_MULTIPLE_FROM_GROUP);

  const [
    autoAssignGroups,
    { data: autoAssignGroupsData, loading: autoAssignGroupsLoading },
  ] = useMutation(AUTO_ASSIGN_GROUPS);

  const {
    data: overallStatsData,
    error: overallStatsError,
    loading: overallStatsLoading,
  } = useQuery<getOverallStats>(GET_OVERALL_STATS, {
    variables: {
      gameId,
    },
    skip: !gameId,
    fetchPolicy: "no-cache",
  });

  const {
    data: gameData,
    error: gameError,
    loading: gameLoading,
    refetch: gameRefetch,
  } = useQuery<getGameByIdQuery>(GET_GAME_BY_ID, {
    variables: {
      gameId,
    },
    skip: !gameId,
    fetchPolicy: "no-cache",
  });

  if (!gameId) {
    return <div>Game ID not provided</div>;
  }

  if (gameLoading) {
    return <div>{t("Loading")}</div>;
  }

  if (!gameLoading && gameError) {
    const isServerConnectionError = checkIfConnectionAborted(gameError);

    if (isServerConnectionError) {
      return <Error serverConnectionError />;
    } else {
      return <Error errorContent={JSON.stringify(gameError)} />;
    }
  }

  if (!gameData) {
    return <Error status="warning" errorContent={"No data"} />;
  }

  const getSelectedPlayers = () => {
    return selectedStudentsRef.current.map(
      (student: getGameByIdQuery_game_players) => student.id
    );
  };

  const getSelectedUsers = () => {
    return selectedStudentsRef.current.map(
      (student: getGameByIdQuery_game_players) => student.user.id
    );
  };

  const getSelectedStudentAndRemoveFromGame = async () => {
    setLoading(true);
    const selectedStudentsUserIds = getSelectedUsers();
    try {
      await removeMultipleFromGame({
        variables: {
          gameId,
          usersIds: selectedStudentsUserIds,
        },
      });

      await gameRefetch();
    } catch (err) {
      addNotification({
        status: "error",
        title: t("error.removePlayers.title"),
        description: t("error.removePlayers.description"),
      });
    }
    setLoading(false);
  };

  const getSelectedStudentsAndRemoveFromGroups = async () => {
    setLoading(true);
    const selectedStudentsPlayerIds = getSelectedPlayers();
    try {
      await removeMultipleFromGroup({
        variables: {
          gameId,
          playersIds: selectedStudentsPlayerIds,
        },
      });

      await gameRefetch();
    } catch (err) {
      addNotification({
        status: "error",
        title: t("error.title"),
        description: t("error.description"),
      });
    }
    setLoading(false);
  };

  return (
    <>
      <ChangeDetailsModal
        defaultStartDate={gameData.game.startDate}
        defaultEndDate={gameData.game.endDate}
        gameId={gameId}
        isOpen={isDetailsModalOpen}
        onClose={onDetailsModalClose}
        isGamePrivate={gameData.game.private}
        refetchGame={gameRefetch}
      />
      <AddGroupModal
        isOpen={isAddGroupModalOpen}
        onClose={onAddGroupModalClose}
        gameId={gameId}
      />
      <SetGroupModal
        gameId={gameId}
        groupsData={gameData.game.groups}
        onClose={onSetGroupModalClose}
        isOpen={isSetGroupModalOpen}
        selectedStudentsRef={selectedStudentsRef}
        refetch={gameRefetch}
      />

      <div>
        {gameData.game.players.length < 1 && (
          <>
            <Alert status="info">
              <AlertIcon />
              {t("teacher.noPlayersAlert")}
            </Alert>
          </>
        )}
        <Flex width="100%" justifyContent="space-between" alignItems="center">
          <Box>
            <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
              {t("Game")}: {gameData.game.name}
            </Heading>
          </Box>
          <HStack>
            <Link
              to={{
                pathname: "/profile",
              }}
            >
              <Button variant="outline">{t("Back")}</Button>
            </Link>
            <Button onClick={onDetailsModalOpen}>
              {t("Change availability")}
            </Button>

            <Link
              to={{
                pathname: `/teacher/game/${gameId}/add-players`,
              }}
            >
              <Button>{t("Add or remove players")}</Button>
            </Link>
          </HStack>
        </Flex>

        <Flex
          margin="auto"
          width="100%"
          justifyContent="space-between"
          flexDirection={{ base: "column", md: "row" }}
        >
          <DetailsCard
            badgeContent
            flexDirection="row"
            title={"Number of submissions"}
            content={
              overallStatsData
                ? overallStatsData.stats.nrOfSubmissions.toString()
                : "..."
            }
          />
          <DetailsCard
            badgeContent
            flexDirection="row"
            title={"Number of validations"}
            content={
              overallStatsData
                ? overallStatsData.stats.nrOfValidations.toString()
                : "..."
            }
          />
          <DetailsCard
            badgeContent
            flexDirection="row"
            title={"Number of players"}
            content={gameData.game.players.length.toString()}
          />
        </Flex>

        <Flex
          margin="auto"
          width="100%"
          justifyContent="space-between"
          flexDirection={{ base: "column", md: "row" }}
        >
          <DetailsCard
            badgeContent
            flexDirection="row"
            title={t("addGame.startDate")}
            content={dayjs(gameData.game.startDate).format("DD/MM/YYYY")}
          />
          <DetailsCard
            badgeContent
            flexDirection="row"
            title={t("addGame.endDate")}
            content={dayjs(gameData.game.endDate).format("DD/MM/YYYY")}
          />
          <DetailsCard
            badgeContent
            flexDirection="row"
            title={t("addGame.private")}
            content={gameData.game.private ? t("Yes") : t("No")}
          />
        </Flex>
        <Divider marginBottom={50} />

        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" size="sm" marginTop={5} marginBottom={5}>
            {t("Students")}
          </Heading>

          <Flex>
            <Button
              marginRight={2}
              size="sm"
              isLoading={autoAssignGroupsLoading}
              disabled={autoAssignGroupsLoading}
              onClick={async () => {
                setLoading(true);
                try {
                  await autoAssignGroups({
                    variables: {
                      gameId,
                    },
                  });
                  await gameRefetch();
                } catch (err) {
                  addNotification({
                    status: "error",
                    title: t("error.autoAssign.title"),
                    description: t("error.autoAssign.description"),
                  });
                }
                setLoading(false);
              }}
            >
              {t("Auto-assign groups")}
            </Button>
            <Button marginRight={2} size="sm" onClick={onAddGroupModalOpen}>
              {t("Add new group")}
            </Button>

            <Menu>
              <MenuButton
                disabled={!isStudentSelected}
                size="sm"
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                {t("Actions")}
              </MenuButton>

              <MenuList>
                <MenuItem onClick={onSetGroupModalOpen}>
                  {t("Set group")}
                </MenuItem>
                <MenuItem onClick={getSelectedStudentsAndRemoveFromGroups}>
                  {t("Remove from the group")}
                </MenuItem>
                <MenuItem onClick={getSelectedStudentAndRemoveFromGame}>
                  {t("Remove from the game")}
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        <Box>
          <TableComponent
            loading={loading}
            onRowClick={(row: getGameByIdQuery_game_players) => {
              history.push({
                pathname: `/teacher/player-details/${row.user.id}/${gameId}`,
              });
            }}
            selectableRows
            setIsAnythingSelected={setIsStudentSelected}
            setSelectedStudents={(rows: any) => {
              selectedStudentsRef.current = rows;
            }}
            columns={[
              {
                Header: t("table.name"),
                accessor: "user.firstName",
                Filter: ({ column }: { column: any }) => (
                  <ColumnFilter
                    column={column}
                    placeholder={t("placeholders.name")}
                  />
                ),
              },
              {
                Header: t("table.lastName"),
                accessor: "user.lastName",
                Filter: ({ column }: { column: any }) => (
                  <ColumnFilter
                    column={column}
                    placeholder={t("placeholders.lastName")}
                  />
                ),
              },

              {
                Header: t("table.submissions"),
                accessor: "stats.nrOfSubmissions",
                Filter: ({ column }: { column: any }) => (
                  <ColumnFilter column={column} placeholder="123" />
                ),
              },
              {
                Header: t("table.validations"),
                accessor: "stats.nrOfValidations",
                Filter: ({ column }: { column: any }) => (
                  <ColumnFilter column={column} placeholder="123" />
                ),
              },
              {
                Header: t("table.group"),
                accessor: "group.name",
                Cell: ({ value }: { value: any }) => {
                  return value ? value : "-";
                },
                Filter: ({ column }: { column: any }) => (
                  <ColumnFilter
                    column={column}
                    placeholder={t("table.group")}
                  />
                ),
              },
            ]}
            data={gameData.game.players}
          />
        </Box>

        <Heading as="h3" size="sm" marginTop={5} marginBottom={5}>
          {t("Activities")}
        </Heading>
        <ActivitiesStats gameData={gameData} gameId={gameId} />
      </div>
    </>
  );
};

export default withChangeAnimation(InstructorGame);
