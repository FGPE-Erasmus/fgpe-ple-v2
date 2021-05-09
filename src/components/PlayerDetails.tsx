import { Box } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import withChangeAnimation from "../utilities/withChangeAnimation";
import Error from "./Error";

/** Returns page with game player details such as submissions, validations, submitted code, code results etc.
 *  Needs userId and gameId url params
 */
const PlayerDetails = () => {
  const { t } = useTranslation();
  const { userId, gameId } = useParams<{ userId: string; gameId: string }>();

  if (!userId || !gameId) {
    return <Error />;
  }

  return (
    <Box>
      {userId}
      <br />
      {gameId}
    </Box>
  );
};

export default withChangeAnimation(PlayerDetails);
