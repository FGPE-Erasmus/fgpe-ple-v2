import { useQuery } from "@apollo/client";
import { Box, Button, useDisclosure } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { playerHintsQuery } from "../../generated/playerHintsQuery";
import { rewardReceivedStudentSubscription_rewardReceivedStudent_reward } from "../../generated/rewardReceivedStudentSubscription";
import { GET_PLAYER_HINTS } from "../../graphql/getPlayerHints";
import HintsModal from "./HintsModal";

const Hints = ({
  challengeId,
  gameId,
  hints,
}: {
  challengeId: string;
  gameId: string;
  hints: rewardReceivedStudentSubscription_rewardReceivedStudent_reward[];
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();

  const {
    data: playerHintsData,
    error: playerHintsError,
    loading: playerHintsLoading,
    refetch: playerHintsRefetch,
  } = useQuery<playerHintsQuery>(GET_PLAYER_HINTS, {
    variables: { gameId, challengeId },
    skip: !challengeId,
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (playerHintsData) {
      if (playerHintsData.playerHints.length > 0) {
        playerHintsRefetch();
      }
    }

    // playerHintsData?.playerHints.forEach((hint) => {
    //   hint.
    // })
  }, [hints]);

  const shouldDisplayHintsButton =
    hints.length > 0 ||
    (playerHintsData ? playerHintsData?.playerHints.length > 0 : false);

  return challengeId && shouldDisplayHintsButton && !playerHintsError ? (
    <Box position="absolute" right={5} bottom={3}>
      <HintsModal
        onClose={onClose}
        isOpen={isOpen}
        playerHints={
          playerHintsData
            ? playerHintsData.playerHints.length > 0
              ? playerHintsData.playerHints
              : hints
            : hints
        }
      />
      <Button
        isLoading={playerHintsLoading}
        colorScheme="blue"
        size="sm"
        onClick={onOpen}
      >
        {t("Hints")}
      </Button>
    </Box>
  ) : (
    <></>
  );
};

export default Hints;
