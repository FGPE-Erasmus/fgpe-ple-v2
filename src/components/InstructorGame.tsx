import React from "react";
import withChangeAnimation from "../utilities/withChangeAnimation";
import Error from "./Error";

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
    skip: !gameId,
  });

  if (!gameId) {
    return <div>Game ID not provided</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!loading && error) {
    return <Error errorContent={JSON.stringify(error)} />;
  }

  return (
    <div>
      <Box>Game: {data?.game.name}</Box>
    </div>
  );
};

export default withChangeAnimation(InstructorGame);
