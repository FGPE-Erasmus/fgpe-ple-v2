import { Alert, AlertIcon, Box, Heading } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { getInstructorGames } from "../generated/getInstructorGames";
import TableComponent from "./TableComponent";
import ColumnFilter from "./TableComponent/ColumnFilter";

const getPlayers = (data: getInstructorGames | undefined) => {
  if (!data) {
    return [];
  }

  const players = data.myGames.flatMap((game) => {
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

  return players;
};

const TeacherStudents = ({
  gamesData,
}: {
  gamesData: getInstructorGames | undefined;
}) => {
  const history = useHistory();

  const players = getPlayers(gamesData);
  const { t } = useTranslation();

  return (
    <>
      <Box>
        <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
          {t("All your students")}
        </Heading>

        {players.length === 0 && (
          <Alert status="info">
            <AlertIcon />
            {t("You have no students yet")}
          </Alert>
        )}

        <Box>
          <TableComponent
            onRowClick={(row: typeof players[number]) => {
              history.push({
                pathname: `/teacher/student-details/${row.user.id}`,
              });
            }}
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
            data={players}
          />
        </Box>
      </Box>
    </>
  );
};

export default TeacherStudents;
