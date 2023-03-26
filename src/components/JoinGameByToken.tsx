import { useMutation } from "@apollo/client";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { joinGameWithEnrollTokenMutation } from "../generated/joinGameWithEnrollTokenMutation";
import { joinGroupWithToken } from "../generated/joinGroupWithToken";
import { JOIN_GAME_WITH_ENROLL_TOKEN } from "../graphql/joinGameWithEnrollToken";
import { JOIN_GROUP_WITH_TOKEN } from "../graphql/joinGroupWithToken";
import withChangeAnimation from "../utilities/withChangeAnimation";

const JoinGameByToken = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);

  const { gameToken, groupToken } = useParams<{
    gameToken?: string;
    groupToken?: string;
  }>();

  const [joinGameWithToken, { error: joinGameError }] =
    useMutation<joinGameWithEnrollTokenMutation>(JOIN_GAME_WITH_ENROLL_TOKEN);

  const [joinGroupWithToken, { error: joinGroupError }] =
    useMutation<joinGroupWithToken>(JOIN_GROUP_WITH_TOKEN);

  const joinGameOnly = async (runLoading?: boolean) => {
    try {
      runLoading && setLoading(true);

      const game = await joinGameWithToken({
        variables: {
          token: gameToken,
        },
      });
      setGame(game.data?.enrollWithToken.game.name || null);
      setGameId(game.data?.enrollWithToken.game.id || null);
      runLoading && setLoading(false);
      return game;
    } catch (err) {
      console.log(err);
    }
    runLoading && setLoading(false);
  };

  const joinGameAndGroup = async () => {
    setLoading(true);
    const game = await joinGameOnly();

    if (game && game.data) {
      try {
        await joinGroupWithToken({
          variables: {
            token: groupToken,
            gameId: game.data.enrollWithToken.game.id,
          },
        });
      } catch (err) {
        console.log(err);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    console.log(1, gameToken, 2, groupToken);

    if (gameToken && !groupToken) {
      joinGameOnly(true);
    }

    if (gameToken && groupToken) {
      joinGameAndGroup();
    }
  }, []);

  return (
    <Alert
      status={
        loading ? "info" : joinGameError || joinGroupError ? "error" : "success"
      }
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="200px"
      maxW="600px"
      margin="auto"
      cursor={
        loading
          ? "default"
          : joinGameError || joinGroupError
          ? "default"
          : "pointer"
      }
      onClick={() => {
        if (gameId) {
          history.push({
            pathname: `/game/${gameId}`,
          });
        }
      }}
    >
      {loading ? <Spinner size="xl" /> : <AlertIcon boxSize="40px" mr={0} />}
      <AlertTitle mt={4} mb={1} fontSize="lg">
        {joinGameError || joinGroupError
          ? t("error.joinGameOrGroup.title")
          : t("success.joinGameOrGroup.title", {
              game,
            })}
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        {joinGameError || joinGroupError
          ? t("error.joinGameOrGroup.description")
          : t("success.joinGameOrGroup.description")}
      </AlertDescription>
    </Alert>
  );
};

export default withChangeAnimation(JoinGameByToken);
