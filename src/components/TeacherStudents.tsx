import { useQuery } from "@apollo/client";
import { Alert, AlertIcon, Box, Skeleton } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { getTeacherStudentsDetails } from "../generated/getTeacherStudentsDetails";
import { GET_TEACHER_STUDENTS_DETAILS } from "../graphql/getTeacherStudentsDetails";
import { checkIfConnectionAborted } from "../utilities/ErrorMessages";
import RefreshCacheMenu from "./RefreshCacheMenu";
import TableComponent from "./TableComponent";
import ColumnFilter from "./TableComponent/ColumnFilter";

const getPlayers = (data: getTeacherStudentsDetails | undefined) => {
  if (!data) {
    return [];
  }

  const players = data.myGames.flatMap((game) => {
    return game.players.flatMap((player) => {
      // const totalExercises = player.learningPath.flatMap((learningPath) =>
      //   learningPath.refs.flatMap((ref) => ref)
      // );

      // const progress = {
      //   total: totalExercises.length,
      //   progress: totalExercises.filter((item) => item.solved).length,
      // };

      const totalChallengesCount = player.learningPath.length || 1;

      const progressCombined =
        player.learningPath
          .flatMap((learningPath) => learningPath.progress)
          .reduce((a, b) => a + b, 0) / totalChallengesCount;

      return { ...player, progress: progressCombined, game };
    });
  });

  return players;
};

const TeacherStudents = () => {
  const memoizedSortFunc = useMemo(
    () => (rowA: any, rowB: any) => {
      const a = rowA.original.progress;
      const b = rowB.original.progress;

      if (a > b) return 1;

      if (b > a) return -1;

      return 0;
    },
    []
  );
  const history = useHistory();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { t } = useTranslation();

  const {
    data: teacherStudentsData,
    error: teacherStudentsError,
    loading: teacherStudentsLoading,
    refetch: refetchTeacherStudents,
  } = useQuery<getTeacherStudentsDetails>(GET_TEACHER_STUDENTS_DETAILS, {
    fetchPolicy: "cache-first",
    onError: async (err) => {
      const isServerConnectionError = checkIfConnectionAborted(err);
      if (isServerConnectionError) {
        setIsRefreshing(true);
        await refetchTeacherStudents();
        setIsRefreshing(false);
      }
    },
  });

  const players = getPlayers(teacherStudentsData);

  return (
    <div>
      <Box>
        <AnimatePresence>
          {teacherStudentsError && !isRefreshing && (
            <motion.div
              initial={{ maxHeight: 0, opacity: 0 }}
              animate={{ maxHeight: 50, opacity: 1 }}
              exit={{ maxHeight: 0, opacity: 0 }}
              style={{ width: "100%", textAlign: "center" }}
            >
              {t("error.title")}
              <br /> {t("error.description")}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isRefreshing && (
            <motion.div
              initial={{ maxHeight: 0, opacity: 0 }}
              animate={{ maxHeight: 50, opacity: 1 }}
              exit={{ maxHeight: 0, opacity: 0 }}
              style={{ width: "100%", textAlign: "center" }}
            >
              {t("error.serverConnection.title")}{" "}
              {t("error.serverConnection.description")}
            </motion.div>
          )}
        </AnimatePresence>
        {/* <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
          {t("All your students")}
        </Heading> */}
        <Skeleton isLoaded={!teacherStudentsLoading && !teacherStudentsError}>
          <Box minH={200}>
            {players.length === 0 && (
              <Alert status="info">
                <AlertIcon />
                {t("You have no students yet")}
              </Alert>
            )}
            {teacherStudentsData && (
              <Box>
                <TableComponent
                  refreshData={refetchTeacherStudents}
                  contextMenu={
                    <RefreshCacheMenu
                      loading={teacherStudentsLoading}
                      refetch={refetchTeacherStudents}
                    />
                  }
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
                      accessor: "stats.nrOfSubmissions",
                      Filter: ({ column }: { column: any }) => (
                        <ColumnFilter column={column} placeholder="123" />
                      ),
                    },
                    {
                      Header: t("table.validations"),
                      accessor: "stats.nrOfValidations",
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
                        return (value * 100).toFixed(1) + "%";
                      },
                      disableFilters: true,
                      sortType: memoizedSortFunc,
                    },
                  ]}
                  data={players}
                />
              </Box>
            )}
          </Box>
        </Skeleton>
      </Box>
    </div>
  );
};

export default TeacherStudents;
