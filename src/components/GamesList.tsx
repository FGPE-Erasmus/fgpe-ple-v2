import {
  Box,
  Divider,
  Flex,
  Heading,
  StackDivider,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useKeycloak } from "@react-keycloak/web";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import NavContext from "../context/NavContext";
import {
  PlayerGameProfiles,
  PlayerGameProfiles_myGameProfiles_game,
  PlayerGameProfiles_myGameProfiles_learningPath,
} from "../generated/PlayerGameProfiles";

// name={gameProfile.game.name}
//                 description={
//                   gameProfile.game.description
//                     ? gameProfile.game.description
//                     : "No description"
//                 }

const getProgress = (
  learningPaths: PlayerGameProfiles_myGameProfiles_learningPath[]
) => {
  let exercisesCount = 0;
  let solvedExercisesCount = 0;

  for (let i = 0; i < learningPaths.length; i++) {
    exercisesCount += learningPaths[i].refs.length;
    solvedExercisesCount += learningPaths[i].refs.filter(
      (ref) => ref.solved
    ).length;
  }

  return { solved: solvedExercisesCount, total: exercisesCount };
};

const Game = ({
  game,
  progress,
}: {
  game: PlayerGameProfiles_myGameProfiles_game;
  progress: { solved: number; total: number };
}) => {
  const color = useColorModeValue("gray.100", "gray.700");
  const { t } = useTranslation();

  return (
    <GameStyled bg={color}>
      <Flex justifyContent="space-between" width="100%" alignItems="center">
        <Box>
          <div>
            <Heading size="lg">{game.name}</Heading>
            <div>
              {game.description ? game.description : t("No description")}
            </div>
          </div>
        </Box>
        <Box paddingRight={4} display={{ base: "none", sm: "block" }}>
          <Flex flexDirection="column" fontSize={14}>
            <Box>
              {t("Challenges")}: {progress.solved + "/" + progress.total}
            </Box>
          </Flex>
        </Box>
      </Flex>
    </GameStyled>
  );
};

const GamesList = ({ data }: { data: PlayerGameProfiles }) => {
  const { keycloak } = useKeycloak();
  const { setActiveGame } = useContext(NavContext);

  return (
    <Box>
      <Divider marginTop={4} />

      <VStack
        divider={<StackDivider />}
        spacing={4}
        align="stretch"
        marginTop={4}
      >
        {data.myGameProfiles.map((gameProfile, i) => {
          return (
            <Link
              key={i}
              to={{
                pathname: `/game/${gameProfile.game.id}`,
              }}
              onClick={() =>
                setActiveGame({
                  id: gameProfile.game.id,
                  name: gameProfile.game.name,
                })
              }
            >
              <Game
                game={gameProfile.game}
                progress={getProgress(gameProfile.learningPath)}
              />
            </Link>
          );
        })}
      </VStack>
    </Box>
  );
};

const GameStyled = styled(Box)`
  height: 100px;
  width: 100%;
  border-radius: 5px;
  /* background-color: white; */
  display: flex;
  align-items: center;
  padding: 15px;
  transition: transform 0.5s;
  &:hover {
    transform: scale(0.97);
  }
  & > div > div {
    font-size: 12px;
  }
`;

export default GamesList;
