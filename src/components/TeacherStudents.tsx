import {
  Box,
  Heading,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { getInstructorGames } from "../generated/getInstructorGames";

const getPlayers = (data: getInstructorGames | undefined) => {
  if (!data) {
    return [];
  }

  const players = data.games.flatMap((game) => {
    return game.players.flatMap((player) => {
      const totalExercises = player.learningPath.flatMap((learningPath) =>
        learningPath.refs.flatMap((ref) => ref)
      );

      const progress = {
        total: totalExercises.length,
        progress: totalExercises.filter((item) => item.solved).length,
      };

      return { ...player, progress, game };
    });
  });

  //   const playersNoDuplicates =  Array.from(new Set(players.map(JSON.stringify))).map(JSON.parse);

  console.log("PLAYERS", players);

  return players;
};

const TeacherStudents = ({
  gamesData,
}: {
  gamesData: getInstructorGames | undefined;
}) => {
  const players = getPlayers(gamesData);

  return (
    <Box>
      <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
        Your all students
      </Heading>

      <Box width="100%" overflowY="scroll">
        <Table variant="simple">
          {/* <TableCaption>Players enrolled in this game</TableCaption> */}
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Last Name</Th>
              {/* <Th>Email</Th> */}
              <Th>Game</Th>
              <Th>Submissions</Th>
              <Th>Validations</Th>
              <Th>Group</Th>
              <Th>Progress</Th>
            </Tr>
          </Thead>
          <Tbody>
            {players?.map((player, i) => {
              return (
                <Tr>
                  <Td>{player.user.firstName}</Td>
                  <Td>{player.user.lastName}</Td>
                  {/* <Td>{player.user.email}</Td> */}
                  <Td>{player.game.name}</Td>
                  <Td>{player.submissions.length}</Td>
                  <Td>{player.validations.length}</Td>
                  <Td>{player.group?.name || "-"}</Td>
                  <Td>
                    {player.progress.progress}/{player.progress.total}
                  </Td>
                </Tr>
              );
            })}

            {/* {data?.games < 1 && (
            <Tr>
              <Td>-</Td>
              <Td>-</Td>
              <Td>-</Td>
            </Tr>
          )} */}

            {/* {data.game.players.map((player, i) => {
            return (
              <Tr key={i}>
                <Td>inches</Td>
                <Td>millimetres (mm)</Td>
                <Td>25.4</Td>
              </Tr>
            );
          })} */}
          </Tbody>
          {/* {data.game.players.length > 7 && (
          <Tfoot>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th>multiply by</Th>
            </Tr>
          </Tfoot>
        )} */}
        </Table>
      </Box>
    </Box>
  );
};

export default TeacherStudents;
