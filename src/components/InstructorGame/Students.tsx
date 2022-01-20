import {
  MutationFunctionOptions,
  OperationVariables,
  FetchResult,
  ApolloQueryResult,
  useQuery,
} from "@apollo/client";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  useDisclosure,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { gameDetailsGetGameByIdQuery } from "../../generated/gameDetailsGetGameByIdQuery";
import { getGameByIdQuery_game_players } from "../../generated/getGameByIdQuery";
import { getStudentsDetailsByGameIdQuery } from "../../generated/getStudentsDetailsByGameIdQuery";
import { GET_STUDENTS_DETAILS_BY_GAME_ID } from "../../graphql/getStudentsDetails";
import { checkIfConnectionAborted } from "../../utilities/ErrorMessages";
import { useNotifications } from "../Notifications";
import RefreshCacheMenu from "../RefreshCacheMenu";
import TableComponent from "../TableComponent";
import ColumnFilter from "../TableComponent/ColumnFilter";
import AddGroupModal from "./AddGroupModal";
import SetGroupModal from "./SetGroupModal";

interface ContextI {
  autoAssignGroupsLoading: boolean;
  setLoading: (v: boolean) => void;
  autoAssignGroups: (
    options?: MutationFunctionOptions<any, OperationVariables> | undefined
  ) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;
  refetchGame: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<gameDetailsGetGameByIdQuery>>;
  getSelectedStudentsAndRemoveFromGroups: () => Promise<void>;
  getSelectedStudentAndRemoveFromGame: () => Promise<void>;
  gameId: string;
}

const Students = ({
  gameId,
  loading,
  autoAssignGroupsLoading,
  setLoading,
  autoAssignGroups,
  refetchGame,
  getSelectedStudentsAndRemoveFromGroups,
  getSelectedStudentAndRemoveFromGame,
}: {
  gameId: string;
  loading: boolean;
} & ContextI) => {
  const {
    isOpen: isAddGroupModalOpen,
    onOpen: onAddGroupModalOpen,
    onClose: onAddGroupModalClose,
  } = useDisclosure();

  const {
    isOpen: isSetGroupModalOpen,
    onOpen: onSetGroupModalOpen,
    onClose: onSetGroupModalClose,
  } = useDisclosure();

  const history = useHistory();
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
  const selectedStudentsRef = useRef([]);
  const [isStudentSelected, setIsStudentSelected] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: studentsDetailsData,
    error: studentsDetailsError,
    loading: studentsDetailsLoading,
    refetch: refetchStudentsDetails,
  } = useQuery<getStudentsDetailsByGameIdQuery>(
    GET_STUDENTS_DETAILS_BY_GAME_ID,
    {
      variables: {
        gameId,
      },
      skip: !gameId,
      fetchPolicy: "cache-first",
      onError: async (err) => {
        const isServerConnectionError = checkIfConnectionAborted(err);
        if (isServerConnectionError) {
          setIsRefreshing(true);
          await refetchStudentsDetails();
          setIsRefreshing(false);
        }
      },
    }
  );

  const { t } = useTranslation();

  return (
    <>
      <AddGroupModal
        isOpen={isAddGroupModalOpen}
        onClose={onAddGroupModalClose}
        gameId={gameId}
      />
      {studentsDetailsData && (
        <SetGroupModal
          gameId={gameId}
          groupsData={studentsDetailsData.game.groups}
          onClose={onSetGroupModalClose}
          isOpen={isSetGroupModalOpen}
          selectedStudentsRef={selectedStudentsRef}
          refetch={refetchStudentsDetails}
        />
      )}
      <Box>
        <AnimatePresence>
          {studentsDetailsError && !isRefreshing && (
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

        <Skeleton isLoaded={!studentsDetailsLoading && !studentsDetailsError}>
          <Box minH={200}>
            {studentsDetailsData &&
              !studentsDetailsLoading &&
              !studentsDetailsError && (
                <TableComponent
                  contextMenu={
                    <>
                      <ContextMenu
                        studentsDetailsLoading={studentsDetailsLoading}
                        refetchStudentsDetails={refetchStudentsDetails}
                        autoAssignGroupsLoading={autoAssignGroupsLoading}
                        setLoading={setLoading}
                        autoAssignGroups={autoAssignGroups}
                        refetchGame={refetchGame}
                        isStudentSelected={isStudentSelected}
                        onSetGroupModalOpen={onSetGroupModalOpen}
                        getSelectedStudentsAndRemoveFromGroups={
                          getSelectedStudentsAndRemoveFromGroups
                        }
                        getSelectedStudentAndRemoveFromGame={
                          getSelectedStudentAndRemoveFromGame
                        }
                        gameId={gameId}
                        onAddGroupModalOpen={onAddGroupModalOpen}
                      />
                    </>
                  }
                  loading={loading}
                  onRowClick={(row: getGameByIdQuery_game_players) => {
                    history.push({
                      pathname: `/teacher/player-details/${row.user.id}/${gameId}`,
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
                            .flatMap(
                              (learningPath: any) => learningPath.progress
                            )
                            .reduce((a: any, b: any) => a + b, 0) /
                          totalChallengesCount;

                        return (progressCombined * 100).toFixed(1) + "%";
                      },
                      disableFilters: true,
                      sortType: memoizedSortFunc,
                    },
                  ]}
                  data={studentsDetailsData.game.players}
                />
              )}
          </Box>
        </Skeleton>
      </Box>
    </>
  );
};

const ContextMenu = ({
  autoAssignGroupsLoading,
  setLoading,
  autoAssignGroups,
  refetchGame,
  isStudentSelected,
  onSetGroupModalOpen,
  getSelectedStudentsAndRemoveFromGroups,
  getSelectedStudentAndRemoveFromGame,
  gameId,
  onAddGroupModalOpen,
  studentsDetailsLoading,
  refetchStudentsDetails,
}: ContextI & {
  isStudentSelected: boolean;
  studentsDetailsLoading: boolean;
  refetchStudentsDetails: () => Promise<any>;
  onAddGroupModalOpen: () => void;
  onSetGroupModalOpen: () => void;
}) => {
  const { add: addNotification } = useNotifications();
  const { t } = useTranslation();

  return (
    <Flex justifyContent="flex-end" marginBottom={4}>
      <RefreshCacheMenu
        loading={studentsDetailsLoading}
        refetch={refetchStudentsDetails}
      />
      <Button
        marginLeft={2}
        marginRight={2}
        size="sm"
        isLoading={autoAssignGroupsLoading}
        disabled={autoAssignGroupsLoading}
        onClick={async () => {
          setLoading(true);
          try {
            await autoAssignGroups({
              variables: {
                gameId,
              },
            });
            await refetchGame();
          } catch (err) {
            addNotification({
              status: "error",
              title: t("error.autoAssign.title"),
              description: t("error.autoAssign.description"),
            });
          }
          setLoading(false);
        }}
      >
        {t("Auto-assign groups")}
      </Button>
      <Button marginRight={2} size="sm" onClick={onAddGroupModalOpen}>
        {t("Add new group")}
      </Button>

      <Menu>
        <MenuButton
          disabled={!isStudentSelected}
          size="sm"
          as={Button}
          rightIcon={<ChevronDownIcon />}
        >
          {t("Actions")}
        </MenuButton>

        <MenuList>
          <MenuItem onClick={onSetGroupModalOpen}>{t("Set group")}</MenuItem>
          <MenuItem onClick={getSelectedStudentsAndRemoveFromGroups}>
            {t("Remove from the group")}
          </MenuItem>
          <MenuItem onClick={getSelectedStudentAndRemoveFromGame}>
            {t("Remove from the game")}
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default Students;
