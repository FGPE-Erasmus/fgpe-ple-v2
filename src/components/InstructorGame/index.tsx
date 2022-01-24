import { useMutation, useQuery } from "@apollo/client";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useParams } from "react-router-dom";
import { gameDetailsGetGameByIdQuery } from "../../generated/gameDetailsGetGameByIdQuery";
import { getGameByIdQuery_game_players } from "../../generated/getGameByIdQuery";
import { getOverallStats } from "../../generated/getOverallStats";
import { removeMultipleFromGameMutation } from "../../generated/removeMultipleFromGameMutation";
import { AUTO_ASSIGN_GROUPS } from "../../graphql/autoAssignGroups";
import { GAME_DETAILS_GET_GAME_BY_ID } from "../../graphql/gameDetailsGetGameById";
import { GET_OVERALL_STATS } from "../../graphql/getOverallStats";
import { REMOVE_MULTIPLE_FROM_GAME } from "../../graphql/removeMultipleFromGame";
import { REMOVE_MULTIPLE_FROM_GROUP } from "../../graphql/removeMultipleFromGroup";
import { checkIfConnectionAborted } from "../../utilities/ErrorMessages";
import withChangeAnimation from "../../utilities/withChangeAnimation";
import DetailsCard from "../DetailsCard";
import Error from "../Error";
import ExportGameCsvModal from "../ExportGameCsvModal";
import { useNotifications } from "../Notifications";
import RefreshCacheMenu from "../RefreshCacheMenu";
import ActivitiesStats from "./ActivitiesStats";
import ChangeDetailsModal from "./ChangeDetailsModal";
import Students from "./Students";

interface ParamTypes {
  gameId: string;
}

const InstructorGame = () => {
  const [loading, setLoading] = useState(false);

  const {
    isOpen: isExportCsvModalOpen,
    onOpen: onExportCsvModalOpen,
    onClose: onExportCsvModalClose,
  } = useDisclosure();

  const {
    isOpen: isDetailsModalOpen,
    onOpen: onDetailsModalOpen,
    onClose: onDetailsModalClose,
  } = useDisclosure();

  const { add: addNotification } = useNotifications();

  const { gameId } = useParams<ParamTypes>();
  const { t } = useTranslation();

  const selectedStudentsRef = useRef([]);

  const [removeMultipleFromGame] = useMutation<removeMultipleFromGameMutation>(
    REMOVE_MULTIPLE_FROM_GAME
  );

  const [removeMultipleFromGroup] = useMutation(REMOVE_MULTIPLE_FROM_GROUP);

  const [autoAssignGroups, { loading: autoAssignGroupsLoading }] =
    useMutation(AUTO_ASSIGN_GROUPS);

  const {
    data: overallStatsData,
    error: overallStatsError,
    loading: overallStatsLoading,
    refetch: refetchOverallStats,
  } = useQuery<getOverallStats>(GET_OVERALL_STATS, {
    variables: {
      gameId,
    },
    skip: !gameId,
    fetchPolicy: "cache-first",
  });

  const {
    data: gameData,
    error: gameError,
    loading: gameLoading,
    refetch: refetchGame,
  } = useQuery<gameDetailsGetGameByIdQuery>(GAME_DETAILS_GET_GAME_BY_ID, {
    variables: {
      gameId,
    },
    skip: !gameId,
    fetchPolicy: "cache-first",
  });

  if (!gameId) {
    return <div>Game ID not provided</div>;
  }

  if (gameLoading || overallStatsLoading) {
    return <div>{t("Loading")}</div>;
  }

  if (!gameLoading && !overallStatsLoading && gameError) {
    const isServerConnectionError = checkIfConnectionAborted(gameError);

    if (isServerConnectionError) {
      return <Error serverConnectionError />;
    } else {
      return (
        <Error errorContent={JSON.stringify(gameError || overallStatsError)} />
      );
    }
  }

  if (!gameData || !overallStatsData) {
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

      await refetchGame();
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
      <ExportGameCsvModal
        isOpen={isExportCsvModalOpen}
        onOpen={onExportCsvModalOpen}
        onClose={onExportCsvModalClose}
        gameId={gameId}
      />

      <ChangeDetailsModal
        defaultStartDate={gameData.game.startDate}
        defaultEndDate={gameData.game.endDate}
        gameId={gameId}
        isOpen={isDetailsModalOpen}
        onClose={onDetailsModalClose}
        isGamePrivate={gameData.game.private}
        refetchGame={refetchGame}
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
            <RefreshCacheMenu
              loading={gameLoading}
              refetch={async () => {
                await refetchOverallStats();
                await refetchGame();
              }}
              size="md"
            />
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

            <Button onClick={onExportCsvModalOpen}>CSV</Button>
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
            title={t("table.submissions")}
            content={
              overallStatsData
                ? overallStatsData.stats.nrOfSubmissions.toString()
                : "..."
            }
          />
          <DetailsCard
            badgeContent
            flexDirection="row"
            title={t("table.validations")}
            content={
              overallStatsData
                ? overallStatsData.stats.nrOfValidations.toString()
                : "..."
            }
          />
          <DetailsCard
            badgeContent
            flexDirection="row"
            title={t("table.numberOfPlayers")}
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
            content={
              gameData.game.startDate
                ? dayjs(gameData.game.startDate).format("DD/MM/YYYY")
                : "-"
            }
          />
          <DetailsCard
            badgeContent
            flexDirection="row"
            title={t("addGame.endDate")}
            content={
              gameData.game.endDate
                ? dayjs(gameData.game.endDate).format("DD/MM/YYYY")
                : "-"
            }
          />
          <DetailsCard
            badgeContent
            flexDirection="row"
            title={t("addGame.private")}
            content={gameData.game.private ? t("Yes") : t("No")}
          />
        </Flex>
        {/* <Divider marginBottom={10} /> */}

        <Accordion allowToggle allowMultiple marginTop={3}>
          <AccordionItem>
            {({ isExpanded }: { isExpanded: boolean }) => (
              <>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Heading as="h3" size="sm" marginTop={2} marginBottom={2}>
                      {t("Students")}
                    </Heading>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4} marginTop={2} marginBottom={10}>
                  {isExpanded && (
                    <Students
                      gameId={gameId}
                      loading={loading}
                      autoAssignGroupsLoading={autoAssignGroupsLoading}
                      setLoading={setLoading}
                      autoAssignGroups={autoAssignGroups}
                      refetchGame={refetchGame}
                      getSelectedStudentsAndRemoveFromGroups={
                        getSelectedStudentsAndRemoveFromGroups
                      }
                      getSelectedStudentAndRemoveFromGame={
                        getSelectedStudentAndRemoveFromGame
                      }
                    />
                  )}
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
          <AccordionItem>
            {({ isExpanded }: { isExpanded: boolean }) => (
              <>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Heading as="h3" size="sm" marginTop={2} marginBottom={2}>
                      {t("Activities")}
                    </Heading>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4} marginTop={2} marginBottom={10}>
                  {isExpanded && <ActivitiesStats gameId={gameId} />}
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        </Accordion>
        {/* 
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
                  await refetchGame();
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
              {
                Header: t("table.progress"),
                accessor: "learningPath",
                Cell: ({ value }: { value: any }) => {
                  const totalChallengesCount = value.length || 1;

                  const progressCombined =
                    value
                      .flatMap((learningPath: any) => learningPath.progress)
                      .reduce((a: any, b: any) => a + b, 0) /
                    totalChallengesCount;

                  return (progressCombined * 100).toFixed(1) + "%";
                },
                disableFilters: true,
                sortType: memoizedSorting,
              },
            ]}
            data={gameData.game.players}
          />
        </Box> */}

        {/* <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" size="sm" marginTop={5} marginBottom={5}>
            {t("Activities")}
          </Heading>
        </Flex>

        <ActivitiesStats
          gameData={gameData}
          gameId={gameId}
          statsData={overallStatsData}
        /> */}
      </div>
    </>
  );
};

export default withChangeAnimation(InstructorGame);
