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
} from "../generated/PlayerGameProfiles";
import { checkIsActive } from "./InstructorGames";

// name={gameProfile.game.name}
//                 description={
//                   gameProfile.game.description
//                     ? gameProfile.game.description
//                     : "No description"
//                 }

const Game = ({
  game,
  small,
  progress,
}: {
  game: PlayerGameProfiles_myGameProfiles_game;
  progress: number;
  small?: number;
}) => {
  const color = useColorModeValue("gray.100", "gray.700");
  const { t } = useTranslation();

  return (
    <GameStyled
      bg={color}
      opacity={game.state === "LOCKED" ? 0.5 : 1}
      pointerEvents={game.state === "LOCKED" ? "none" : "all"}
      small={small}
    >
      <Flex justifyContent="space-between" width="100%" alignItems="center">
        <Box>
          <div>
            <Heading size={small ? "md" : "lg"}>{game.name}</Heading>
            <div>
              {game.description ? game.description : t("No description")}
            </div>
          </div>
        </Box>
        <Box paddingRight={4} display={{ base: "none", sm: "block" }}>
          <Flex flexDirection="column" fontSize={14}>
            <Box>
              {t("table.progress")}: {(progress * 100).toFixed(1)}%
            </Box>
          </Flex>
        </Box>
      </Flex>
    </GameStyled>
  );
};

export const isGameAvailable = (gameData: {
  state: string;
  endDate: Date;
  startDate: Date;
  [key: string]: any;
}) => {
  return checkIsActive({
    state: gameData.state,
    endDate: gameData.endDate,
    startDate: gameData.startDate,
  });
};

const GamesList = ({ data }: { data: PlayerGameProfiles }) => {
  const { keycloak } = useKeycloak();
  const { setActiveGame } = useContext(NavContext);
  const small = data.myGameProfiles.length > 5 ? 1 : 0;

  return (
    <Box>
      <Divider marginTop={4} />

      <VStack
        divider={<StackDivider />}
        spacing={small ? 2 : 4}
        align="stretch"
        marginTop={4}
      >
        {data.myGameProfiles.map((gameProfile, i) => {
          if (isGameAvailable(gameProfile.game)) {
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
                  small={small}
                  progress={
                    gameProfile.learningPath
                      .flatMap((learningPath) => learningPath.progress)
                      .reduce((a, b) => a + b, 0) /
                    (gameProfile.learningPath.length || 1)
                  }
                />
              </Link>
            );
          }
        })}
      </VStack>
    </Box>
  );
};

const GameStyled = styled(Box)<{ locked?: boolean; small?: number }>`
  min-height: ${({ small }) => (small ? 50 : 80)}px;
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
