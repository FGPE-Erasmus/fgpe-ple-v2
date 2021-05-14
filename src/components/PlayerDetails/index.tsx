import { useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  getPlayerQuery,
  getPlayerQuery_player_game,
  getPlayerQuery_player_submissions,
  getPlayerQuery_player_validations,
} from "../../generated/getPlayerQuery";
import { GET_PLAYER } from "../../graphql/getPlayer";
import { checkIfConnectionAborted } from "../../utilities/ErrorMessages";
import withChangeAnimation from "../../utilities/withChangeAnimation";
import DetailsCard from "../DetailsCard";
import Error from "../Error";
import TableComponent from "../TableComponent";
import ColumnFilter from "../TableComponent/ColumnFilter";
import PlayerAttemptsTable from "./PlayerAttemptsTable";
import PlayerRewards from "./PlayerRewards";
import { REMOVE_SINGLE_FROM_GAME } from "../../graphql/removeSingleFromGame";
import { useNotifications } from "../Notifications";
import AttemptModal from "./AttemptModal";
import SetGroupForSingleModal from "./SetGroupForSingleModal";

/** Returns page with game player details such as submissions, validations, submitted code, code results etc.
 *  Needs userId and gameId url params
 */
const PlayerDetails = () => {
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

  const [activeAttempt, setActiveAttempt] =
    useState<Partial<getPlayerQuery_player_validations>>();

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

  const onRowClick = (row: any) => {
    setActiveAttempt({
      exerciseId: row.exerciseId,
      program: row.program,
      result: row.result,
      metrics: row.metrics,
      submittedAt: row.submittedAt,
      feedback: row.feedback,
      language: row.language,
      outputs: row.outputs ? row.outputs : undefined,
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
      <AttemptModal
        onClose={onCloseAttempt}
        isOpen={isOpenAttempt}
        activeAttempt={activeAttempt}
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
          title={t("Group")}
          content={playerData.player.group?.name || "-"}
        />
        <DetailsCard
          title={t("Number of submissions")}
          content={playerData.player.stats.nrOfSubmissions.toString()}
        />
        <DetailsCard
          title={t("Number of validations")}
          content={playerData.player.stats.nrOfValidations.toString()}
        />
      </Flex>

      <Divider marginBottom={8} />

      <Heading as="h3" size="sm" marginTop={5} marginBottom={5}>
        {t("submissions")}
      </Heading>
      <PlayerAttemptsTable onRowClick={onRowClick} playerData={playerData} />

      <Heading as="h3" size="sm" marginTop={5} marginBottom={5}>
        {t("validations")}
      </Heading>
      <PlayerAttemptsTable
        onRowClick={onRowClick}
        playerData={playerData}
        isValidationsTable
      />

      <Heading as="h3" size="sm" marginTop={5} marginBottom={5}>
        {t("Rewards")}
      </Heading>
      <PlayerRewards playerData={playerData} />
    </Box>
  );
};

export default withChangeAnimation(PlayerDetails);
