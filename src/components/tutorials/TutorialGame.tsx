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
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useCallback, useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useParams } from "react-router-dom";
import NavContext from "../../context/NavContext";
import DetailsCard from "../DetailsCard";
import { useNotifications } from "../Notifications";
import RefreshCacheMenu from "../RefreshCacheMenu";
import TutorialWizard from "../TutorialWizard";
import {
  teacherGameTutorialData,
  teacherOveralStatsTutorialData,
} from "../TutorialWizard/gameData";
import { teacherProfileTutorialData } from "../TutorialWizard/teacherProfileTutorialData";
import TutorialActivitesTable from "./TutorialActivitesTable";
import TutorialGameStudents from "./TutorialGameStudents";

const TutorialGame = () => {
  const { add: addNotification } = useNotifications();

  const [enableTutorialFunctions1, setEnableTutorialFunctions1] =
    useState(false);
  const [enableTutorialFunctions2, setEnableTutorialFunctions2] =
    useState(false);
  const [isRemoveStudentsStepCorrect, setRemoveStudentsStepCorrect] =
    useState(false);
  const { setShouldBaseTutorialStart } = useContext(NavContext);
  const [isTutorialWizardOpen, setTutorialWizardOpen] = useState(true);
  const history = useHistory();

  const tutorialStepGameDetails = useRef<HTMLInputElement>();
  const setRefStepGameDetails = useCallback((node: any) => {
    tutorialStepGameDetails.current = node;
  }, []);

  const tutorialStepGameHeader = useRef<HTMLInputElement>();
  const setRefStepGameHeader = useCallback((node: any) => {
    tutorialStepGameHeader.current = node;
  }, []);

  const tutorialStepStudents = useRef<HTMLInputElement>();
  const setRefStepStudents = useCallback((node: any) => {
    tutorialStepStudents.current = node;
  }, []);

  const tutorialStepActivities = useRef<HTMLInputElement>();
  const setRefStepActivities = useCallback((node: any) => {
    tutorialStepActivities.current = node;
  }, []);

  const { t } = useTranslation();
  const { tutorialGameId } = useParams<{
    tutorialGameId: string;
  }>();

  const gameData = {
    game: {
      ...teacherProfileTutorialData.find((game) => game.id === tutorialGameId),
      ...teacherGameTutorialData,
    },
  };

  if (!gameData.game) {
    return <div>Tutorial Game not found</div>;
  }

  const lastSubmissionDate = gameData?.game.submissions[0]?.submittedAt;
  const overallStatsData = teacherOveralStatsTutorialData;

  return (
    <>
      <TutorialWizard
        isTutorialWizardOpen={isTutorialWizardOpen}
        setTutorialWizardOpen={setTutorialWizardOpen}
        onClose={() => {
          // redirect to homepage
          setShouldBaseTutorialStart(false);
          history.push("/profile");
        }}
        steps={[
          {
            content: `This is the game page. Here you can see the details of the game and the players that are participating in it.\n\nYou can also add or remove players from the game, modify availability and export the data to a CSV file.`,
            scrollToTop: true,
          },
          {
            ref: tutorialStepGameHeader as any,
            content: `Here's the main menu that you can use to navigate through the game settings.\n\n- "Back" will take you to the main dashboard.\n\n- "Refresh" will refresh the data on the page.\n\n- "Change availability" will show a modal with all availability related options.\n\n- "Add or remove players" will point you to a different page where you can add or remove players from the game.\n\n- "CSV" will export the data to a CSV file.\n\nYou can learn more about these options in the special tutorial available under the "?" icon - let's focus on basics for now.`,
            top: 100,
          },
          {
            ref: tutorialStepGameDetails as any,
            content: `The details of the game are shown here.\n\n- "Submission" is an attempt to submit an answer to a question.\n- "Validation" is when a player just checks the code.\n- "Number of players" shows how many players are participating in the game.\n\n- Start and end dates are the dates when the game is available to players.\n- Private game is a game that is not visible to other players or teachers and only invited people can join it.\n\n- "Created at" is the date when the game was created.\n- "Last submission date" is the date of the last submission to the game.`,
          },
          {
            ref: tutorialStepStudents as any,
            content: `Here you can see the list of players that are participating in the game.\n\nYou can remove players directly from here or from the "Add or remove players" button in the main menu.\n\nYou can also manage groups here - the context menu on the right side of the table will allow you to create, edit or delete groups.\n\nClick "Next" to look at the Activities table`,
            menuOnTop: true,
            top: -200,
            scrollToTop: true,
          },
          {
            ref: tutorialStepActivities as any,
            content: `Activities table shows how difficult the exercises are.\n\nThe higher the difficulty value the harder the exercise is - a value of 100% means that the exercise may be too hard for the players, whereas 0% means that the exercise may be too easy.\n\n"Oddish or Evenish" is quite easy. "Binary search" seems to be impossible to solve.`,
            menuOnTop: true,
            top: -180,
          },
          {
            ref: tutorialStepStudents as any,
            content: `Ok, let's check what you've learned.\n\nFind some inactive players, select them and remove from the game (an inactive player has no validations and submissions). Remember - you cannot undo this action.`,
            menuOnTop: true,
            top: -120,
            scrollToTop: true,
            canGoNext: isRemoveStudentsStepCorrect,

            onStepEnter: () => {
              if (!enableTutorialFunctions1) {
                setEnableTutorialFunctions1(true);
              }
            },
          },
          {
            ref: tutorialStepStudents as any,
            content: `Reset all filters. Sort the table and click on the student that solved the most exercises. Let's see how he did it.`,
            menuOnTop: true,
            top: -80,
            scrollToTop: true,
            onStepEnter: () => {
              if (!enableTutorialFunctions2) {
                setEnableTutorialFunctions2(true);
              }
            },
          },
        ]}
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
        <div ref={setRefStepGameHeader}>
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
                style={{
                  pointerEvents: "none",
                }}
              >
                <Button variant="outline">{t("Back")}</Button>
              </Link>

              <RefreshCacheMenu
                loading={false}
                refetch={async () => {
                  console.log("you dont need to");
                }}
                size="md"
              />
              <Button onClick={() => {}} data-cy="change-availability-button">
                {t("Change availability")}
              </Button>
              <Link
                to={{
                  pathname: `/teacher/game/${tutorialGameId}/add-players`,
                }}
                data-cy="add-players"
                style={{
                  pointerEvents: "none",
                }}
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
              <Button
                onClick={() => {}}
                data-cy="csv-export"
                style={{
                  pointerEvents: "none",
                }}
              >
                CSV
              </Button>

              <Tooltip label={t("Show basic game tutorial")}>
                <IconButton
                  onClick={() => {
                    addNotification({
                      title: t("Tutorial"),
                      description: t("This button opens this exact tutorial!"),
                    });
                  }}
                  aria-label="Open tutorial"
                  icon={<QuestionOutlineIcon />}
                />
              </Tooltip>
            </HStack>
          </Flex>
        </div>
        <div ref={setRefStepGameDetails}>
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
        </div>

        <Accordion allowToggle allowMultiple marginTop={3}>
          <AccordionItem ref={setRefStepStudents}>
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
                    <TutorialGameStudents
                      tutorialGameId={tutorialGameId}
                      enableTutorialFunctions1={enableTutorialFunctions1}
                      enableTutorialFunctions2={enableTutorialFunctions2}
                      setRemoveStudentsStepCorrect={() =>
                        setRemoveStudentsStepCorrect(true)
                      }
                    />
                  )}
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
          <AccordionItem ref={setRefStepActivities}>
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
                  {isExpanded && <TutorialActivitesTable />}
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default TutorialGame;
