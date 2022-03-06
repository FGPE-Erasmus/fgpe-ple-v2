import { useQuery } from "@apollo/client";
import {
  Alert,
  AlertIcon,
  Box,
  Heading,
  Skeleton,
  useColorModeValue,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { getTeacherGamesQuery } from "../generated/getTeacherGamesQuery";
import { GET_TEACHER_GAMES } from "../graphql/getTeacherGamesQuery";
import { checkIfConnectionAborted } from "../utilities/ErrorMessages";
import RefreshCacheMenu from "./RefreshCacheMenu";
import TableComponent from "./TableComponent";
import ColumnFilter from "./TableComponent/ColumnFilter";

export const checkIsActive = (row: any) => {
  if (row.state !== "OPEN") {
    return false;
  }

  if (!row.startDate && !row.endDate) {
    return true;
  }

  if (row.startDate && !row.endDate) {
    return dayjs(row.startDate).isBefore(dayjs());
  }

  if (!row.startDate && row.endDate) {
    return dayjs(row.endDate).isAfter(dayjs());
  }

  const startDate = dayjs(row.startDate);
  const endDate = dayjs(row.endDate);

  if (startDate.isBefore(dayjs(new Date()))) {
    if (endDate.isAfter(dayjs())) {
      return true;
    }
  }

  return false;
};

const InstructorGames = () => {
  const memoizedSortFunc = useMemo(
    () => (rowA: any, rowB: any) => {
      const a = rowA.original.name;

      const b = rowB.original.name;

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
    data: teacherGamesData,
    error: teacherGamesError,
    loading: teacherGamesLoading,
    refetch: refetchTeacherGames,
  } = useQuery<getTeacherGamesQuery>(GET_TEACHER_GAMES, {
    fetchPolicy: "cache-first",
    onError: async (err) => {
      const isServerConnectionError = checkIfConnectionAborted(err);
      if (isServerConnectionError) {
        setIsRefreshing(true);
        await refetchTeacherGames();
        setIsRefreshing(false);
      }
    },
  });

  return (
    <div>
      <AnimatePresence>
        {teacherGamesError && !isRefreshing && (
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
      <Box>
        <Skeleton isLoaded={!teacherGamesLoading && !teacherGamesError}>
          <Box minH={200}>
            {teacherGamesData?.myGames.length === 0 && (
              <Alert status="info">
                <AlertIcon />
                {t("No games available")}
              </Alert>
            )}

            {teacherGamesData && (
              <Box>
                <TableComponent
                  refreshData={refetchTeacherGames}
                  contextMenu={
                    <RefreshCacheMenu
                      loading={teacherGamesLoading}
                      refetch={refetchTeacherGames}
                    />
                  }
                  onRowClick={(row) => {
                    history.push({
                      pathname: `/teacher/game/${row.id}`,
                    });
                  }}
                  columns={[
                    {
                      Header: t("table.gameName"),
                      accessor: (row: any) => {
                        const isActive = checkIsActive(row);
                        return isActive ? (
                          row.name
                        ) : (
                          <span style={{ opacity: 0.4 }}>{row.name}</span>
                        );
                      },
                      Cell: ({ value }: { value: any }) => {
                        return value ? value : "-";
                      },
                      Filter: ({ column }: { column: any }) => (
                        <ColumnFilter
                          column={column}
                          placeholder={t("placeholders.gameName")}
                        />
                      ),
                      sortType: memoizedSortFunc,
                    },
                    {
                      Header: t("table.gameDescription"),
                      accessor: "description",
                      Cell: ({ value }: { value: any }) => {
                        return value ? value : "-";
                      },
                      Filter: ({ column }: { column: any }) => (
                        <ColumnFilter
                          column={column}
                          placeholder={t("placeholders.gameDescription")}
                        />
                      ),
                    },
                    {
                      Header: t("table.numberOfPlayers"),
                      accessor: "players.length",
                      Filter: ({ column }: { column: any }) => (
                        <ColumnFilter
                          column={column}
                          placeholder={t("placeholders.numberOfPlayers")}
                        />
                      ),
                    },
                    {
                      Header: t("addGame.private"),
                      accessor: "private",
                      Cell: ({ value }: { value: any }) => {
                        return value ? t("Yes") : t("No");
                      },
                      disableFilters: true,
                      sortType: memoizedSortFunc,
                    },
                    // {
                    //   Header: t("Active"),
                    //   accessor: (row: any) => {
                    //     if (row.state != "OPEN") {
                    //       return false;
                    //     }

                    //     if (!row.startDate && !row.endDate) {
                    //       return true;
                    //     }

                    //     if (row.startDate && !row.endDate) {
                    //       return dayjs(row.startDate).isBefore(dayjs());
                    //     }

                    //     if (!row.startDate && row.endDate) {
                    //       return dayjs(row.endDate).isAfter(dayjs());
                    //     }

                    //     const startDate = dayjs(row.startDate);
                    //     const endDate = dayjs(row.endDate);

                    //     if (startDate.isBefore(dayjs(new Date()))) {
                    //       console.log("it happened");
                    //       if (endDate.isAfter(dayjs())) {
                    //         return true;
                    //       }
                    //     }

                    //     return false;
                    //   },
                    //   Cell: ({ value }: { value: any }) => {
                    //     return <span>{value ? "Yes" : "No"}</span>;
                    //   },
                    //   disableFilters: true,
                    // },
                  ]}
                  data={teacherGamesData?.myGames}
                />
              </Box>
            )}
          </Box>
        </Skeleton>
      </Box>
    </div>
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
          <Heading size="sm">{name}</Heading>
          {description && <div>{description}</div>}
        </div>
      </GameStyled>
    </Link>
  );
};

const GameStyled = styled(Box)`
  height: 50px;
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
