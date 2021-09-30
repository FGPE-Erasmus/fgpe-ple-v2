import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { getInstructorGames } from "../generated/getInstructorGames";
import TableComponent from "./TableComponent";
import ColumnFilter from "./TableComponent/ColumnFilter";
import dayjs from "dayjs";

export const checkIsActive = (row: any) => {
  if (row.state != "OPEN") {
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

const InstructorGames = ({
  data,
  refetch,
}: {
  data: getInstructorGames | undefined;
  refetch: () => void;
}) => {
  const history = useHistory();

  const { t } = useTranslation();

  console.log("DATA", data);
  return (
    <>
      <Box>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
            {t("Your games")}
          </Heading>

          <Link to="/teacher/manage-games">
            <Button marginRight={5}>{t("Manage games")}</Button>
          </Link>
        </Flex>

        {data?.myGames.length == 0 && (
          <Alert status="info">
            <AlertIcon />
            {t("No games available")}
          </Alert>
        )}

        <Box>
          <TableComponent
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
                Filter: ({ column }: { column: any }) => (
                  <ColumnFilter
                    column={column}
                    placeholder={t("placeholders.gameName")}
                  />
                ),
                sortType: useMemo(
                  () => (rowA: any, rowB: any) => {
                    const a = rowA.original.name;

                    const b = rowB.original.name;

                    if (a > b) return 1;

                    if (b > a) return -1;

                    return 0;
                  },
                  []
                ),
              },
              {
                Header: t("table.gameDescription"),
                accessor: "description",
                Cell: ({ value }: { value: any }) => {
                  return <span>{value ? value : "-"}</span>;
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
                  return <span>{value ? t("Yes") : t("No")}</span>;
                },
                disableFilters: true,
                sortType: useMemo(
                  () => (rowA: any, rowB: any) => {
                    const a = rowA.original.private;

                    const b = rowB.original.private;

                    if (a > b) return 1;

                    if (b > a) return -1;

                    return 0;
                  },
                  []
                ),
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
            data={data?.myGames}
          />
        </Box>
      </Box>
    </>
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
