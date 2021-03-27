import React, { useContext } from "react";
import { useQuery, gql } from "@apollo/client";
import { PlayerGameProfiles } from "../generated/PlayerGameProfiles";
import { useKeycloak } from "@react-keycloak/web";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";

import NavContext from "../context/NavContext";

import {
  Box,
  Divider,
  Heading,
  StackDivider,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

const Game = ({ name, description }: { name: string; description: string }) => {
  const color = useColorModeValue("gray.100", "gray.700");

  return (
    <GameStyled bg={color}>
      <div>
        <Heading size="lg">{name}</Heading>
        <div>{description}</div>
      </div>
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
                name={gameProfile.game.name}
                description={
                  gameProfile.game.description
                    ? gameProfile.game.description
                    : "No description"
                }
              />
            </Link>
          );
        })}
        {/* <Box h="40px" bg="yellow.200">
        1
      </Box>
      <Box h="40px" bg="tomato">
        2
      </Box>
      <Box h="40px" bg="pink.100">
        3
      </Box> */}
      </VStack>
    </Box>
    // <GamesWrapper>
    //   <h4 style={{ margin: 10, marginTop: 30 }}>Available games:</h4>
    //   {data.myGameProfiles.map((gameProfile, i) => {
    //     return (
    //       <Link
    //         key={i}
    //         to={{
    //           pathname: "/profile/game",
    //           state: { gameId: gameProfile.game.id },
    //         }}
    //         onClick={() =>
    //           setActiveGame({
    //             id: gameProfile.game.id,
    //             name: gameProfile.game.name,
    //           })
    //         }
    //       >
    //         <Game variant="outline">
    //           <div>
    //             <h3>{gameProfile.game.name}</h3>
    //             <div>{gameProfile.game.description}</div>
    //           </div>
    //         </Game>
    //       </Link>
    //     );
    //   })}
    // </GamesWrapper>
  );
};

const GamesWrapper = styled(Box)`
  /* a {
    color: black;
  } */
`;

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
