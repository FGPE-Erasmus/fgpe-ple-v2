import { Box } from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { ContextMenu } from "../InstructorGame/Students";
import { useNotifications } from "../Notifications";
import TableComponent from "../TableComponent";
import ColumnFilter from "../TableComponent/ColumnFilter";
import tutorialGameStudentsData from "./tutorialGameStudentsData";

const studentsDetailsData = tutorialGameStudentsData;

const TutorialGameStudents = ({
  setRemoveStudentsStepCorrect,
  enableTutorialFunctions1,
  enableTutorialFunctions2,
  tutorialGameId,
}: {
  setRemoveStudentsStepCorrect: () => void;
  enableTutorialFunctions1: boolean;
  enableTutorialFunctions2: boolean;
  tutorialGameId: string;
}) => {
  const { add: addNotification } = useNotifications();
  const selectedStudentsRef = useRef<any>([]);
  const [students, setStudents] = useState<any>(
    studentsDetailsData.game.players
  );

  const memoizedSortFunc = useMemo(
    () => (rowA: any, rowB: any) => {
      const a =
        rowA.original.learningPath
          .flatMap((learningPath: any) => learningPath.progress)
          .reduce((a: any, b: any) => a + b, 0) /
        rowA.original.learningPath.length;

      const b =
        rowB.original.learningPath
          .flatMap((learningPath: any) => learningPath.progress)
          .reduce((a: any, b: any) => a + b, 0) /
        rowB.original.learningPath.length;

      if (a > b) return 1;

      if (b > a) return -1;

      return 0;
    },
    []
  );
  const { t } = useTranslation();
  const [isStudentSelected, setIsStudentSelected] = useState<boolean>(false);

  const history = useHistory();

  return (
    <div>
      <Box minH={200}>
        {studentsDetailsData && (
          <TableComponent
            dataCy="students-table"
            refreshData={(() => {}) as any}
            contextMenu={
              <>
                <ContextMenu
                  studentsDetailsLoading={false}
                  refetchStudentsDetails={(() => {}) as any}
                  autoAssignGroupsLoading={false}
                  setLoading={(() => {}) as any}
                  autoAssignGroups={
                    (() => {
                      if (!enableTutorialFunctions1) return;

                      return addNotification({
                        status: "error",
                        title: t("Incorrect option selected"),
                        description: t(
                          'Choose the "Remove from the game" option to remove the students from the game.'
                        ),
                      });
                    }) as any
                  }
                  refetchGame={(() => {}) as any}
                  isStudentSelected={isStudentSelected}
                  onSetGroupModalOpen={
                    (() => {
                      if (!enableTutorialFunctions1) return;

                      return addNotification({
                        status: "error",
                        title: t("Incorrect option selected"),
                        description: t(
                          'Choose the "Remove from the game" option to remove the students from the game.'
                        ),
                      });
                    }) as any
                  }
                  getSelectedStudentsAndRemoveFromGroups={
                    (() => {
                      if (!enableTutorialFunctions1) return;

                      return addNotification({
                        status: "error",
                        title: t("Incorrect option selected"),
                        description: t(
                          'Choose the "Remove from the game" option to remove the students from the game.'
                        ),
                      });
                    }) as any
                  }
                  getSelectedStudentAndRemoveFromGame={
                    (() => {
                      if (!enableTutorialFunctions1) return;

                      const isSelectedStudentsArrayCorrect =
                        selectedStudentsRef.current.every(
                          (student: any) =>
                            student.stats.nrOfSubmissions === 0 &&
                            student.stats.nrOfValidations === 0
                        );

                      if (!isSelectedStudentsArrayCorrect) {
                        return addNotification({
                          status: "error",
                          title: t("Incorrect students selected"),
                          description: t(
                            "Choose only inactive students and remove them from the game. These students have not submitted or validated anything yet."
                          ),
                        });
                      }

                      if (selectedStudentsRef.current.length < 2) {
                        return addNotification({
                          status: "error",
                          title: t("There are more inactive students"),
                          description: t(
                            "Choose 2 or more inactive students and remove them from the game"
                          ),
                        });
                      }

                      const studentsFiltered = students.filter(
                        (student: any) =>
                          !selectedStudentsRef.current.some(
                            (selectedStudent: any) =>
                              selectedStudent.user.id === student.user.id
                          )
                      );

                      setStudents(studentsFiltered);

                      addNotification({
                        status: "success",
                        title: t("Students removed from the game"),
                        description: t(
                          "The students have been successfully removed from the game"
                        ),
                      });

                      return setRemoveStudentsStepCorrect();
                    }) as any
                  }
                  gameId={"123"}
                  onAddGroupModalOpen={
                    (() => {
                      if (!enableTutorialFunctions1) return;

                      return addNotification({
                        status: "error",
                        title: t("Incorrect option selected"),
                        description: t(
                          'Choose the "Remove from the game" option to remove the students from the game.'
                        ),
                      });
                    }) as any
                  }
                />
              </>
            }
            loading={false}
            onRowClick={(row: any) => {
              if (!enableTutorialFunctions2) return;
              const isBestStudentSelected = row.learningPath.every(
                (lp: any) => lp.progress === 1
              );

              if (!isBestStudentSelected) {
                return addNotification({
                  status: "error",
                  title: t("Incorrect student selected"),
                  description: t(
                    "Choose the student with the highest progress."
                  ),
                });
              }

              history.push({
                pathname: `/teacher/tutorial/player-details/${row.user.id}/${tutorialGameId}`,
              });
            }}
            selectableRows
            setIsAnythingSelected={setIsStudentSelected}
            setSelectedStudents={(rows: any) => {
              selectedStudentsRef.current = rows;
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
                    placeholder={t("table.group")}
                  />
                ),
              },
              {
                Header: t("table.progress"),
                accessor: "learningPath",
                Cell: ({ value }: { value: any }) => {
                  const totalChallengesCount = value.length || 1;

                  const progressCombined =
                    value
                      .flatMap((learningPath: any) => learningPath.progress)
                      .reduce((a: any, b: any) => a + b, 0) /
                    totalChallengesCount;

                  return (progressCombined * 100).toFixed(1) + "%";
                },
                disableFilters: true,
                sortType: memoizedSortFunc,
              },
            ]}
            // data={studentsDetailsData.game.players}
            data={students}
          />
        )}
      </Box>
    </div>
  );
};

export default TutorialGameStudents;
