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
import { useTranslation } from "react-i18next";
import { getInstructorGames } from "../generated/getInstructorGames";
import TableComponent from "./TableComponent";
import ColumnFilter from "./TableComponent/ColumnFilter";

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
  const { t } = useTranslation();

  return (
    <Box>
      <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
        {t("All your students")}
      </Heading>
      <Box>
        <TableComponent
          columns={[
            {
              Header: t("table.name"),
              accessor: "user.firstName",
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter
                  column={column}
                  placeholder={t("placeholders.name")}
                />
              ),
            },
            {
              Header: t("table.lastName"),
              accessor: "user.lastName",
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter
                  column={column}
                  placeholder={t("placeholders.lastName")}
                />
              ),
            },
            {
              Header: t("table.game"),
              accessor: "game.name",
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter
                  column={column}
                  placeholder={t("placeholders.game")}
                />
              ),
            },
            {
              Header: t("table.submissions"),
              accessor: "submissions.length",
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter column={column} placeholder="123" />
              ),
            },
            {
              Header: t("table.validations"),
              accessor: "validations.length",
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter column={column} placeholder="123" />
              ),
            },
            {
              Header: t("table.group"),
              accessor: "group.name",
              Cell: ({ value }: { value: any }) => {
                return value ? value : "-";
              },
              Filter: ({ column }: { column: any }) => (
                <ColumnFilter
                  column={column}
                  placeholder={t("placeholders.group")}
                />
              ),
            },
            {
              Header: t("table.progress"),
              accessor: "progress",
              Cell: ({ value }: { value: any }) => {
                return `${value.progress}/${value.total}`;
              },
              disableFilters: true,
            },
          ]}
          data={players.flatMap((i) => [i, i])}
        />
      </Box>

      {/* <Box width="100%" overflow="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Last Name</Th>
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

  
          </Tbody>
     
        </Table>
      </Box> */}
    </Box>
  );
};

export default TeacherStudents;
