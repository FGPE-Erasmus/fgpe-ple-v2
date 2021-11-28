import { useMutation, useQuery } from "@apollo/client";
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
  useDisclosure,
} from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useParams } from "react-router-dom";
import { getPlayerQuery } from "../../generated/getPlayerQuery";
import { getPlayerValidationsQuery_player_validations } from "../../generated/getPlayerValidationsQuery";
import { GET_PLAYER } from "../../graphql/getPlayer";
import { REMOVE_SINGLE_FROM_GAME } from "../../graphql/removeSingleFromGame";
import { checkIfConnectionAborted } from "../../utilities/ErrorMessages";
import withChangeAnimation from "../../utilities/withChangeAnimation";
import DetailsCard from "../DetailsCard";
import Error from "../Error";
import { useNotifications } from "../Notifications";
import AttemptModal from "./AttemptModal";
import PlayerRewards from "./PlayerRewards";
import ProgressModal from "./ProgressModal";
import SetGroupForSingleModal from "./SetGroupForSingleModal";
import SubmissionsTable from "./SubmissionsTable";
import ValidationsTable from "./ValidationsTable";

/** Returns page with game player details such as submissions, validations, submitted code, code results etc.
 *  Needs userId and gameId url params
 */
const PlayerDetails = () => {
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
  const {
    isOpen: isOpenGroupSet,
    onOpen: onOpenGroupSet,
    onClose: onCloseGroupSet,
  } = useDisclosure();

  const { add: addNotification } = useNotifications();
  const history = useHistory();
  const { t } = useTranslation();
  const { userId, gameId } = useParams<{ userId: string; gameId: string }>();

  const [activeAttempt, setActiveAttempt] = useState<
    Partial<getPlayerValidationsQuery_player_validations> & {
      isSubmission: boolean;
    }
  >();

  const [removeFromGame, { loading: removeSingleLoading }] = useMutation(
    REMOVE_SINGLE_FROM_GAME
  );

  const {
    data: playerData,
    error: playerError,
    loading: playerLoading,
    refetch: playerRefetch,
  } = useQuery<getPlayerQuery>(GET_PLAYER, {
    variables: { userId, gameId },
    skip: !userId || !gameId,
    fetchPolicy: "network-only",
  });

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
    onOpenAttempt();
  };

  if (!userId || !gameId) {
    return <Error />;
  }

  if (!playerLoading && playerError) {
    const isServerConnectionError = checkIfConnectionAborted(playerError);

    if (isServerConnectionError) {
      return <Error serverConnectionError />;
    } else {
      return <Error errorContent={JSON.stringify(playerError)} />;
    }
  }

  if (playerLoading || !playerData) {
    return <Box>{t("Loading")}</Box>;
  }

  return (
    <Box>
      <ProgressModal
        onClose={onCloseProgress}
        isOpen={isOpenProgress}
        learningPaths={playerData.player.learningPath}
      />
      <AttemptModal
        onClose={onCloseAttempt}
        isOpen={isOpenAttempt}
        activeAttempt={activeAttempt}
        gameId={gameId}
      />
      <SetGroupForSingleModal
        onClose={onCloseGroupSet}
        isOpen={isOpenGroupSet}
        groupsData={playerData.player.game.groups}
        playerId={playerData.player.id}
        gameId={gameId}
        refetch={playerRefetch}
      />
      <Flex justifyContent="space-between" alignItems="center" marginBottom={4}>
        <Heading as="h3" size="md">
          {t("Game profile")}: {playerData.player.user.firstName}{" "}
          {playerData.player.user.lastName}
        </Heading>

        <HStack spacing={2}>
          <Button
            isLoading={removeSingleLoading}
            onClick={async () => {
              try {
                await removeFromGame({
                  variables: {
                    userId,
                    gameId,
                  },
                });

                history.push({
                  pathname: `/teacher/game/${gameId}`,
                });

                addNotification({
                  status: "success",
                  title: t("success.title"),
                  description: t("success.description"),
                });
              } catch (err) {
                addNotification({
                  status: "error",
                  title: t("error.title"),
                  description: t("error.description"),
                });

                console.log(err);
              }
            }}
          >
            {t("Remove from the game")}
          </Button>
          <Button onClick={onOpenGroupSet}>{t("Change group")}</Button>
          <Link to={`/teacher/student-details/${userId}`}>
            <Button>{t("User profile")}</Button>
          </Link>
        </HStack>
      </Flex>

      <Flex flexDirection={{ base: "column", md: "row" }}>
        <Box width="100%" marginRight={{ base: 0, md: 2 }}>
          <Link to={`/teacher/game/${gameId}`}>
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
        {/* {playerData.player.game} */}
        <DetailsCard
          active
          onClick={onOpenProgress}
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
        <AccordionItem>
          {({ isExpanded }: { isExpanded: boolean }) => (
            <>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Heading as="h3" size="sm" marginTop={2} marginBottom={2}>
                    {t("submissions")}
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel pb={4} marginTop={2} marginBottom={10}>
                {/* <PlayerAttemptsTable
                  onRowClick={onSubmissionRowClick}
                  playerData={playerData}
                /> */}
                {isExpanded && (
                  <SubmissionsTable
                    userId={userId}
                    gameId={gameId}
                    onSubmissionRowClick={onSubmissionRowClick}
                    gameData={playerData.player.game}
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
                    {t("validations")}
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel pb={4} marginTop={2} marginBottom={10}>
                {/* <PlayerAttemptsTable
                  onRowClick={onRowClick}
                  playerData={playerData}
                  isValidationsTable
                /> */}
                {isExpanded && (
                  <ValidationsTable
                    userId={userId}
                    gameId={gameId}
                    onValidationRowClick={onRowClick}
                    gameData={playerData.player.game}
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
                    {t("Rewards")}
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel pb={4} marginTop={2} marginBottom={10}>
                <AnimatePresence>
                  {isExpanded && (
                    <PlayerRewards gameId={gameId} userId={userId} />
                  )}
                </AnimatePresence>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default withChangeAnimation(PlayerDetails);
