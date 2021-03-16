import React from "react";
import withChangeAnimation from "../utilities/withChangeAnimation";

import {
  Progress,
  Text,
  Heading,
  Box,
  useColorModeValue,
  Skeleton,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { getGameByIdQuery } from "../generated/getGameByIdQuery";

interface ParamTypes {
  gameId: string;
}

const GET_GAME_BY_ID = gql`
  query getGameByIdQuery($gameId: String!) {
    game(id: $gameId) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

const InstructorGame = () => {
  const { gameId } = useParams<ParamTypes>();

  const { data, error, loading } = useQuery<getGameByIdQuery>(GET_GAME_BY_ID, {
    variables: {
      gameId,
    },
  });

  if (!gameId) {
    return <Text>Game ID not provided</Text>;
  }

  if (!loading && error) {
    return <div>Error</div>;
  }

  return (
    <div>
      <Skeleton isLoaded={!loading}>
        <Box>Game: {data?.game.name}</Box>
      </Skeleton>
    </div>
  );
};

export default withChangeAnimation(InstructorGame);
