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
  Flex,
  Table,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Button,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { getGameByIdQuery } from "../generated/getGameByIdQuery";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

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
      players {
        id
        user {
          email
          id
          firstName
          lastName
        }
      }
    }
  }
`;

const InstructorGame = () => {
  const { gameId } = useParams<ParamTypes>();
  const { t } = useTranslation();

  const { data, error, loading } = useQuery<getGameByIdQuery>(GET_GAME_BY_ID, {
    variables: {
      gameId,
    },
    skip: !gameId,
    fetchPolicy: "no-cache",
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

  if (!data) {
    return <Error status="warning" errorContent={"No data"} />;
  }

  return (
    <div>
      {data.game.players.length < 1 && (
        <>
          <Alert status="info">
            <AlertIcon />
            This game has not players. Add any to start.
          </Alert>
        </>
      )}

      <Flex width="100%" justifyContent="space-between" alignItems="center">
        <Box>
          <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
            {t("Game")}: {data.game.name}
          </Heading>
        </Box>
        <Box>
          <Link
            to={{
              pathname: `/teacher/game/${gameId}/add-players`,
            }}
            onClick={() => {}}
          >
            <Button>Add or remove players</Button>
          </Link>
        </Box>
      </Flex>

      <Table variant="simple">
        {/* <TableCaption>Players enrolled in this game</TableCaption> */}
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Last Name</Th>
            <Th>Email</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.game.players.length < 1 && (
            <Tr>
              <Td>-</Td>
              <Td>-</Td>
              <Td>-</Td>
            </Tr>
          )}

          {data.game.players.map((player, i) => {
            return (
              <Tr key={i}>
                <Td>{player.user.firstName}</Td>
                <Td>{player.user.lastName}</Td>
                <Td>{player.user.email}</Td>
              </Tr>
            );
          })}
        </Tbody>
        {data.game.players.length > 7 && (
          <Tfoot>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th>multiply by</Th>
            </Tr>
          </Tfoot>
        )}
      </Table>
    </div>
  );
};

export default withChangeAnimation(InstructorGame);
