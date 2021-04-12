import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Flex,
  Heading,
  Skeleton,
  StackDivider,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { getInstructorGames } from "../generated/getInstructorGames";
import AddGameModal from "./AddGameModal";
import Error from "./Error";
import ColumnFilter from "./TableComponent/ColumnFilter";
import TableComponent from "./TableComponent";

const InstructorGames = ({
  data,
  refetch,
}: {
  data: getInstructorGames | undefined;
  refetch: () => void;
}) => {
  const history = useHistory();

  const { t } = useTranslation();
  const {
    isOpen: isAddGameModalOpen,
    onOpen: onAddGameModalOpen,
    onClose: onAddGameModalClose,
  } = useDisclosure();

  console.log("DATA", data);
  return (
    <>
      <AddGameModal
        isOpen={isAddGameModalOpen}
        onOpen={onAddGameModalOpen}
        onClose={onAddGameModalClose}
        refetchGames={refetch}
      />
      <Box>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
            {t("Your games")}
          </Heading>

          <Button onClick={onAddGameModalOpen}>{t("Add new game")}</Button>
        </Flex>

        <Box>
          <TableComponent
            onClickFunc={(row) => {
              history.push({
                pathname: `/teacher/game/${row.id}`,
              });
            }}
            columns={[
              {
                Header: t("table.gameName"),
                accessor: "name",
                onClick: () => console.log("xd"),
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

        {data?.myGames.length == 0 && <div>{t("No games available")}</div>}
        {/* <VStack
          divider={<StackDivider />}
          spacing={2}
          align="stretch"
          marginTop={4}
        >
          {data?.myGames.map((game, i) => {
            return (
              <Game
                id={game.id}
                name={game.name}
                description={game.description}
                key={i}
              />
            );
          })}
        </VStack> */}
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
