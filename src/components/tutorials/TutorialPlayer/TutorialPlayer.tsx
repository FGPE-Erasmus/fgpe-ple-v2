import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link as ChakraLink,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { useCallback, useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useParams } from "react-router-dom";
import { getPlayerValidationsQuery_player_validations } from "../../../generated/getPlayerValidationsQuery";
import withChangeAnimation from "../../../utilities/withChangeAnimation";
import DetailsCard from "../../DetailsCard";
import { useNotifications } from "../../Notifications";
import RefreshCacheMenu from "../../RefreshCacheMenu";
import AttemptModal from "./AttemptModal";
import PlayerRewards from "./PlayerRewards";

/** Progress Modal doesn't do any requests - it can be used for this tutorial */
import ProgressModal from "../../PlayerDetails/ProgressModal";
import { teacherProfileTutorialData } from "../../TutorialWizard/teacherProfileTutorialData";
import mockPlayerData from "./mocks/playerData";
import mockRewardsData from "./mocks/rewardsData";
import mockSubmissionsData, { mockSubmissions } from "./mocks/submissionsData";
import mockValidationsData, { mockValidations } from "./mocks/validationsData";
import SubmissionsTable from "./SubmissionsTable";
import ValidationsTable from "./ValidationsTable";
import TutorialWizard from "../../TutorialWizard";
import NavContext from "../../../context/NavContext";
import { QuestionOutlineIcon } from "@chakra-ui/icons";

/** Returns page with game player details such as submissions, validations, submitted code, code results etc.
 *  Needs userId and gameId url params
 */
const TutorialPlayerDetails = () => {
  const [attemptValidationStepReady, setAttemptValidationStepReady] =
    useState(false);
  const [attemptStepReady, setAttemptStepReady] = useState(false);
  const [progressStepReady, setProgressStepReady] = useState(false);

  const [progressCloseStepReady, setCloseProgressStepReady] = useState(false);
  const { setShouldBaseTutorialStart } = useContext(NavContext);
  const [isTutorialWizardOpen, setTutorialWizardOpen] = useState(true);
  const [
    detailedSubmissionOrValidationData,
    setDetailedSubmissionOrValidationData,
  ] = useState<
    Partial<{
      id: string;
      feedback: string | null;
      program: string | null;
      outputs: any | null;
    }>
  >();

  const tutorialStepPlayerDetails = useRef<HTMLInputElement>();
  const setRefStepPlayerDetails = useCallback((node: any) => {
    tutorialStepPlayerDetails.current = node;
  }, []);

  const tutorialStepPlayerHeader = useRef<HTMLInputElement>();
  const setRefStepPlayerHeader = useCallback((node: any) => {
    tutorialStepPlayerHeader.current = node;
  }, []);

  const tutorialStepProgress = useRef<HTMLInputElement>();
  const setRefStepProgress = useCallback((node: any) => {
    tutorialStepProgress.current = node;
  }, []);

  const tutorialStepSubmissions = useRef<HTMLInputElement>();
  const setRefStepSubmissions = useCallback((node: any) => {
    tutorialStepSubmissions.current = node;
  }, []);

  const tutorialStepSubmissionAttempt = useRef<HTMLInputElement>();
  const setRefStepSubmissionAttempt = useCallback((node: any) => {
    tutorialStepSubmissionAttempt.current = node;
  }, []);

  const tutorialStepValidations = useRef<HTMLInputElement>();
  const setRefStepValidations = useCallback((node: any) => {
    tutorialStepValidations.current = node;
  }, []);

  const tutorialStepRewards = useRef<HTMLInputElement>();
  const setRefStepRewards = useCallback((node: any) => {
    tutorialStepRewards.current = node;
  }, []);

  const {
    isOpen: isOpenProgress,
    onOpen: onOpenProgress,
    onClose: onCloseProgress,
  } = useDisclosure();
  const {
    isOpen: isOpenAttempt,
    onOpen: onOpenAttempt,
    onClose: onCloseAttempt,
  } = useDisclosure();

  const { add: addNotification } = useNotifications();
  const history = useHistory();
  const { t } = useTranslation();
  const { userId, tutorialGameId } = useParams<{
    userId: string;
    tutorialGameId: string;
  }>();

  const game = teacherProfileTutorialData.find(
    (game) => game.id === tutorialGameId
  );

  const playerData = {
    player: {
      ...mockPlayerData.player,
      game: game ? game : mockPlayerData.player.game,
    },
  };

  const [activeAttempt, setActiveAttempt] = useState<
    Partial<getPlayerValidationsQuery_player_validations> & {
      isSubmission: boolean;
    }
  >();

  const onSubmissionRowClick = (row: any) => {
    onRowClick(row, true);
  };

  const onRowClick = (row: any, isSubmission?: boolean) => {
    setActiveAttempt({
      id: row.id,
      exerciseId: row.exerciseId,
      // program: row.program,
      result: row.result,
      // metrics: row.metrics,
      submittedAt: row.submittedAt,
      // feedback: row.feedback,
      language: row.language,
      // outputs: row.outputs ? row.outputs : undefined,
      isSubmission: isSubmission ? isSubmission : false,
    });

    const mockedSubmission = mockSubmissions.find(
      (submission) => submission.submission.id === row.id
    );

    const mockedValidation = mockValidations.find(
      (validation) => validation.validation.id === row.id
    );

    if (mockedSubmission) {
      setDetailedSubmissionOrValidationData(mockedSubmission.submission);
    }

    if (mockedValidation) {
      console.log("MOCK VALIDATION", mockedValidation);
      setDetailedSubmissionOrValidationData(mockedValidation.validation);
    }

    setAttemptStepReady(true);
    onOpenAttempt();

    if (mockedValidation) {
      if (detailedSubmissionOrValidationData?.id) {
        setAttemptValidationStepReady(true);
      }
    }
  };

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
            content: `This is the game profile page. Here you can see the player's progress, submissions, validations and rewards.\n\nUsers can have multiple profiles - one for each game they are playing.`,
            scrollToTop: true,
          },
          {
            ref: tutorialStepPlayerHeader as any,
            content: `Here you can see the player's name and a link to their user page. We'll come back to this later.\n\nYou can also refresh the data, remove the player from the game or change the group the player is in.`,
            scrollToTop: true,
            top: 50,
          },
          {
            ref: tutorialStepPlayerDetails as any,
            content: `Player details are shown here. You can see the game the player is playing, the group they are in, the number of submissions and validations they have made and their progress in the game.\n\nThe progress card is active - click on it to get more details about the player's progress.`,
            scrollToTop: true,
            top: 80,
            canGoNext: progressStepReady,
            forceNext: progressStepReady,
          },
          {
            content: `Progress is shown here. You can see the challenges the player has completed and their progress in each challenge.\n\nClick on the "Close" button to close the progress modal.`,
            ref: tutorialStepProgress as any,
            top: 400,
            canGoNext: progressCloseStepReady,
            forceNext: progressCloseStepReady,
          },
          {
            content:
              "A submission is a player's attempt to solve a challenge. It's evaluated - player gets points and feedback, in contrast to a validation which is just a simple code execution.\n\nClick on a submission to see more details about it.",
            ref: tutorialStepSubmissions as any,
            top: -130,
            scrollToTop: true,
            canGoNext: attemptStepReady,
            forceNext: attemptStepReady,
          },
          {
            content: `This is the submission details modal. Here you can see the player's submitted code. The "Result" informs you if the submission was successful or not.\n\nIt's a good idea to check the player's code especially if the player reports a bug or a problem with the challenge.\n\nLet's check validations now.`,
            ref: tutorialStepSubmissionAttempt as any,
            elementId: "attempt-modal-stack",
          },
          {
            top: -130,
            ref: tutorialStepValidations as any,
            content:
              "The validations table shows the player's validations. Unlike submissions, validations are not evaluated - they are just simple code executions to help the player debug their code.\n\nClick on a validation to see more details about it.",
            onStepEnter: () => {
              onCloseAttempt();
              // setActiveAttempt(undefined);
              // setDetailedSubmissionOrValidationData(undefined);
            },
            canGoNext: attemptValidationStepReady,
            forceNext: attemptValidationStepReady,
          },
          {
            onStepEnter: () => {
              onOpenAttempt();
            },
            ref: tutorialStepSubmissionAttempt as any,
            content:
              "This is the validation details modal. You can check here also the code outputs.\n\nThis code is not evaluated by the platform. In this way, players can freely experiment with their code before submitting it for evaluation.",
            elementId: "attempt-modal-stack-2",
          },
          {
            onStepEnter: () => {
              onCloseAttempt();
            },
            content:
              "Last but not least, you can see the player's rewards here. Rewards are given to players for completing challenges and can be used to unlock new challenges.",
            ref: tutorialStepRewards as any,
            top: -100,
            additionalMargin: 100,
          },
          {
            ref: tutorialStepPlayerHeader as any,
            content: `That's it! You can now proceed to the player's user page by clicking on their name.\n\nYou can also close the tutorial by clicking on the "Close" button.`,
            scrollToTop: true,
            top: 50,
          },
        ]}
      />
      <Box>
        {progressStepReady && (
          <Box
            position={"absolute"}
            width="500px"
            height="380px"
            ref={setRefStepProgress}
            left="calc(50% - 250px)"
            onClick={() => {
              setCloseProgressStepReady(true);
              onCloseProgress();
            }}
            cursor="pointer"
          />
        )}
        <ProgressModal
          onClose={() => {
            onCloseProgress();
            setCloseProgressStepReady(true);
          }}
          isOpen={isOpenProgress}
          learningPaths={playerData.player.learningPath}
        />
        <AttemptModal
          tutorialElementId={
            attemptValidationStepReady
              ? "attempt-modal-stack-2"
              : "attempt-modal-stack"
          }
          ref={setRefStepSubmissionAttempt}
          detailedSubmissionOrValidationData={
            detailedSubmissionOrValidationData
          }
          setDetailedSubmissionOrValidationData={
            setDetailedSubmissionOrValidationData
          }
          onClose={onCloseAttempt}
          isOpen={isOpenAttempt}
          activeAttempt={activeAttempt}
          gameId={tutorialGameId}
        />

        <Flex
          justifyContent="space-between"
          alignItems="center"
          marginBottom={4}
          ref={setRefStepPlayerHeader}
        >
          <Heading as="h3" size="md">
            {t("Game profile")}:{" "}
            <Link
              to={`/teacher/tutorial/student-details/${userId}`}
              data-cy="link-to-player"
              style={{
                pointerEvents: !(attemptStepReady && attemptValidationStepReady)
                  ? "none"
                  : "all",
              }}
            >
              <ChakraLink color="blue.500">
                {playerData.player.user.firstName}{" "}
                {playerData.player.user.lastName}
              </ChakraLink>
            </Link>
          </Heading>

          <HStack spacing={2}>
            <RefreshCacheMenu
              loading={false}
              refetch={(() => {}) as any}
              size="md"
            />
            <Button
              data-cy="remove-from-game"
              isLoading={false}
              onClick={async () => {
                try {
                  // history.push({
                  //   pathname: `/teacher/game/${tutorialGameId}`,
                  // });

                  addNotification({
                    status: "success",
                    title: t("success.title"),
                    description: t(
                      "Normally, this would remove the player from the game"
                    ),
                  });
                } catch (err) {
                  addNotification({
                    status: "error",
                    title: t("error.title"),
                    description: t("error.description"),
                  });
                }
              }}
            >
              {t("Remove from the game")}
            </Button>
            <Button
              onClick={() => {}}
              data-cy="change-group"
              style={{
                pointerEvents: !(attemptStepReady && attemptValidationStepReady)
                  ? "none"
                  : "all",
              }}
            >
              {t("Change group")}
            </Button>
            <Link
              to={`/teacher/tutorial/student-details/${userId}`}
              data-cy="user-profile"
              style={{
                pointerEvents: !(attemptStepReady && attemptValidationStepReady)
                  ? "none"
                  : "all",
              }}
            >
              <Button>{t("User profile")}</Button>
            </Link>

            <Tooltip label={t("Show basic player profile tutorial")}>
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

        <Flex
          flexDirection={{ base: "column", md: "row" }}
          ref={setRefStepPlayerDetails}
        >
          <Box width="100%" marginRight={{ base: 0, md: 2 }}>
            <Link to={`/teacher/game/${tutorialGameId}`} data-cy="game-link">
              <DetailsCard
                title={t("Game")}
                content={playerData.player.game.name}
                active
              />
            </Link>
          </Box>

          <DetailsCard
            title={t("table.group")}
            content={playerData.player.group?.name || "-"}
          />
          <DetailsCard
            title={t("table.submissions")}
            content={playerData.player.stats.nrOfSubmissions.toString()}
          />
          <DetailsCard
            title={t("table.validations")}
            content={playerData.player.stats.nrOfValidations.toString()}
          />

          <DetailsCard
            active
            onClick={() => {
              setProgressStepReady(true);
              onOpenProgress();
            }}
            title={t("table.progress")}
            content={
              (
                (playerData.player.learningPath
                  .flatMap((learningPath: any) => learningPath.progress)
                  .reduce((a: any, b: any) => a + b, 0) /
                  playerData.player.learningPath.length) *
                100
              ).toFixed(1) + "%"
            }
          />
        </Flex>

        <Divider marginBottom={8} />

        <Accordion allowToggle allowMultiple>
          <AccordionItem ref={setRefStepSubmissions}>
            {({ isExpanded }: { isExpanded: boolean }) => (
              <>
                <AccordionButton data-cy="submissions-accordion">
                  <Box flex="1" textAlign="left">
                    <Heading as="h3" size="sm" marginTop={2} marginBottom={2}>
                      {t("submissions")}
                    </Heading>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4} marginTop={2} marginBottom={10}>
                  {isExpanded && (
                    <SubmissionsTable
                      playerData={mockSubmissionsData}
                      onSubmissionRowClick={onSubmissionRowClick}
                      learningPaths={playerData.player.learningPath}
                    />
                  )}
                </AccordionPanel>
              </>
            )}
          </AccordionItem>

          <AccordionItem ref={setRefStepValidations}>
            {({ isExpanded }: { isExpanded: boolean }) => (
              <>
                <AccordionButton data-cy="validations-accordion">
                  <Box flex="1" textAlign="left">
                    <Heading as="h3" size="sm" marginTop={2} marginBottom={2}>
                      {t("validations")}
                    </Heading>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4} marginTop={2} marginBottom={10}>
                  {isExpanded && (
                    <ValidationsTable
                      playerData={mockValidationsData}
                      onValidationRowClick={onRowClick}
                      learningPaths={playerData.player.learningPath}
                    />
                  )}
                </AccordionPanel>
              </>
            )}
          </AccordionItem>

          <AccordionItem ref={setRefStepRewards}>
            {({ isExpanded }: { isExpanded: boolean }) => (
              <>
                <AccordionButton data-cy="rewards-accordion">
                  <Box flex="1" textAlign="left">
                    <Heading as="h3" size="sm" marginTop={2} marginBottom={2}>
                      {t("Rewards")}
                    </Heading>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4} marginTop={2} marginBottom={10}>
                  <AnimatePresence>
                    {isExpanded && (
                      <PlayerRewards playerData={mockRewardsData} />
                    )}
                  </AnimatePresence>
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        </Accordion>
      </Box>
    </>
  );
};

export default withChangeAnimation(TutorialPlayerDetails);
