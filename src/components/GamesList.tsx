import React, { useContext } from "react";
import { useQuery, gql } from "@apollo/client";
import {
  PlayerGameProfiles,
  PlayerGameProfiles_myGameProfiles_game,
} from "../generated/PlayerGameProfiles";
import { useKeycloak } from "@react-keycloak/web";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";

import NavContext from "../context/NavContext";

import {
  Box,
  Divider,
  Flex,
  Heading,
  StackDivider,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

// name={gameProfile.game.name}
//                 description={
//                   gameProfile.game.description
//                     ? gameProfile.game.description
//                     : "No description"
//                 }

const Game = ({ game }: { game: PlayerGameProfiles_myGameProfiles_game }) => {
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
            <Box>Challenges: 2/4</Box>
            <Box>Rank: 1/43</Box>
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
              <Game game={gameProfile.game} />
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
