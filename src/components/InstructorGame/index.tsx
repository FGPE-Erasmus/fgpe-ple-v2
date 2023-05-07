import { useMutation, useQuery } from "@apollo/client";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
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
  IconButton,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Redirect, useHistory, useParams } from "react-router-dom";
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
import { teacherProfileTutorialData } from "../TutorialWizard/teacherProfileTutorialData";
import ActivitiesStats from "./ActivitiesStats";
import ChangeDetailsModal from "./ChangeDetailsModal";
import Students from "./Students";

interface ParamTypes {
  gameId: string;
}

const InstructorGame = () => {
  const history = useHistory();
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

  const lastSubmissionDate = gameData?.game.submissions[0]?.submittedAt;

  if (teacherProfileTutorialData.map((i) => i.id).includes(gameId)) {
    // redirect to tutorial
    return <Redirect to={`/teacher/tutorial/game/${gameId}`} />;
  }

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
      return <Error errorContent={gameError || overallStatsError} />;
    }
  }

  if (!gameData || !overallStatsData) {
    return (
      <Error status="warning" errorContent={gameError || overallStatsError} />
    );
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
        gameName={gameData.game.name}
      />

      <ChangeDetailsModal
        defaultStartDate={gameData.game.startDate}
        defaultEndDate={gameData.game.endDate}
        gameId={gameId}
        isOpen={isDetailsModalOpen}
        onClose={onDetailsModalClose}
        isGamePrivate={gameData.game.private}
        refetchGame={refetchGame}
        isGameArchival={gameData.game.archival}
      />

      <div>
        {gameData.game.archival && (
          <Alert
            status="warning"
            marginBottom={2}
            data-cy="archival-game-alert"
          >
            <AlertIcon />
            {t("This is an archival game")}
          </Alert>
        )}
        {gameData.game.players.length < 1 && (
          <Alert status="info" data-cy="no-players-alert">
            <AlertIcon />
            {t("teacher.noPlayersAlert")}
          </Alert>
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
            <Button
              onClick={onDetailsModalOpen}
              data-cy="change-availability-button"
            >
              {t("Change availability")}
            </Button>
            <Link
              to={{
                pathname: `/teacher/game/${gameId}/add-players`,
              }}
              data-cy="add-players"
            >
              {gameData.game.archival ? (
                <Tooltip
                  label={t("This is an archival game")}
                  aria-label="A tooltip"
                  bg="gray.300"
                  color="black"
                  hasArrow
                >
                  <Box>
                    <Button disabled={gameData.game.archival}>
                      {t("Add or remove players")}
                    </Button>
                  </Box>
                </Tooltip>
              ) : (
                <Button>{t("Add or remove players")}</Button>
              )}
            </Link>
            <Button onClick={onExportCsvModalOpen} data-cy="csv-export">
              CSV
            </Button>

            <Tooltip label={t("Show basic player profile tutorial")}>
              <IconButton
                onClick={() => {
                  history.push(
                    "/teacher/tutorial/player-details/f3124287-9db1-46e5-bd20-c628fd714637/tutorial-1"
                  );
                }}
                aria-label="Open tutorial"
                icon={<QuestionOutlineIcon />}
              />
            </Tooltip>
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

        <Flex
          margin="auto"
          width="100%"
          justifyContent="space-between"
          flexDirection={{ base: "column", md: "row" }}
        >
          <DetailsCard
            badgeContent
            flexDirection="row"
            title={t("addGame.createdAt")}
            content={
              gameData.game.createdAt
                ? dayjs(gameData.game.createdAt).format("DD/MM/YYYY")
                : "-"
            }
          />
          <DetailsCard
            badgeContent
            flexDirection="row"
            title={t("addGame.lastSubmission")}
            content={
              lastSubmissionDate
                ? dayjs(lastSubmissionDate).format("DD/MM/YYYY")
                : "-"
            }
          />
        </Flex>

        <Accordion allowToggle allowMultiple marginTop={3}>
          <AccordionItem>
            {({ isExpanded }: { isExpanded: boolean }) => (
              <>
                <AccordionButton data-cy="students-accordion">
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
                      selectedStudentsRef={selectedStudentsRef}
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
                <AccordionButton data-cy="activities-accordion">
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
      </div>
    </>
  );
};

export default withChangeAnimation(InstructorGame);
