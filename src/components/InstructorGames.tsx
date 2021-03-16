import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Flex,
  Heading,
  Skeleton,
  StackDivider,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import { getInstructorGames } from "../generated/getInstructorGames";

const INSTRUCTOR_GAMES = gql`
  query getInstructorGames {
    games {
      id
      name
      description
    }
  }
`;

const InstructorGames = () => {
  const { data, error, loading } = useQuery<getInstructorGames>(
    INSTRUCTOR_GAMES
  );

  if (!loading && error) {
    return <div>Error</div>;
  }

  return (
    <Box>
      <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
        Games
      </Heading>
      {data?.games.length == 0 && <div>No games available</div>}
      <VStack
        divider={<StackDivider />}
        spacing={4}
        align="stretch"
        marginTop={4}
      >
        {data?.games.map((game, i) => {
          return (
            <Skeleton key={i} isLoaded={!loading}>
              <Game
                id={game.id}
                name={game.name}
                description={game.description}
              />
            </Skeleton>
          );
        })}
      </VStack>
    </Box>
  );
};

const Game = ({
  name,
  description,
  id,
}: {
  name: string;
  description: string | null;
  id: string;
}) => {
  const color = useColorModeValue("gray.100", "gray.700");

  return (
    <Link
      to={{
        pathname: `/teacher/game/${id}`,
      }}
      onClick={() => {}}
    >
      <GameStyled bg={color}>
        <div>
          <Heading size="lg">{name}</Heading>
          {description && <div>{description}</div>}
        </div>
      </GameStyled>
    </Link>
  );
};

const GameStyled = styled(Box)`
  height: 80px;
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

export default InstructorGames;
