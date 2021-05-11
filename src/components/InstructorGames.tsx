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
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { getInstructorGames } from "../generated/getInstructorGames";
import TableComponent from "./TableComponent";
import ColumnFilter from "./TableComponent/ColumnFilter";

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
                accessor: "name",
                Filter: ({ column }: { column: any }) => (
                  <ColumnFilter
                    column={column}
                    placeholder={t("placeholders.gameName")}
                  />
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
