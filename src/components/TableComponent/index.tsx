import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { Fragment, useMemo } from "react";
import {
  useTable,
  useSortBy,
  useFilters,
  useResizeColumns,
  useBlockLayout,
  useFlexLayout,
  usePagination,
  TableInstance,
  useRowState,
} from "react-table";
import Pagination from "react-js-pagination";

import {
  TiArrowSortedDown,
  TiArrowSortedUp,
  TiArrowUnsorted,
} from "react-icons/ti";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import ScrollbarWrapper from "../ScrollbarWrapper";

const TableComponent = ({
  columns: columnsProp,
  data,
  dontRecomputeChange,
  onClickFunc,
}: {
  columns: any;
  data: any;
  dontRecomputeChange?: boolean;
  /** Function invoked after clicking on row (has access to row.original)  */
  onClickFunc?: (row: any) => void;
}) => {
  const { colorMode } = useColorMode();
  const { i18n } = useTranslation();
  const columns = useMemo(() => columnsProp, [
    dontRecomputeChange ? null : columnsProp,
    i18n.language,
  ]);

  // const data = useMemo(() => dataProp, [
  //   dontRecomputeChange ? null : dataProp,
  //   i18n.language,
  // ]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useSortBy,
    usePagination,
    useRowState
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
  } = tableInstance;

  const { page, state, gotoPage } = tableInstance;
  const { pageSize, pageIndex } = state;

  return (
    <ScrollbarWrapper>
      <Box overflowX="auto">
        <Table {...getTableProps()} maxWidth="100%">
          <Thead userSelect="none">
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, i) => (
                  <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <Flex justifyContent="space-between">
                      <Box color={column.isSorted ? "deepskyblue" : "default"}>
                        {column.render("Header")}
                      </Box>

                      <Box float="right" textAlign="right">
                        {column.isSorted ? (
                          <Box color="deepskyblue">
                            <AnimatedSortIcon
                              icon={<TiArrowSortedDown fontSize={16} />}
                              isVisible={column.isSortedDesc ? true : false}
                            />
                            <AnimatedSortIcon
                              icon={<TiArrowSortedUp fontSize={16} />}
                              isVisible={!column.isSortedDesc ? true : false}
                            />
                          </Box>
                        ) : (
                          !column.disableSortBy && (
                            <TiArrowUnsorted fontSize={16} />
                          )
                        )}

                        {/* {column.canFilter ? column.render("Filter") : null} */}
                      </Box>
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}

            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()} padding={0}>
                {headerGroup.headers.map((column, i) =>
                  column.canFilter ? (
                    <Th {...column.getHeaderProps()} padding={2}>
                      {column.render("Filter")}
                    </Th>
                  ) : (
                    <Th key={i}>- </Th>
                  )
                )}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <Tr
                  {...row.getRowProps()}
                  style={{
                    cursor: onClickFunc ? "pointer" : "inherit",
                  }}
                  onClick={() =>
                    onClickFunc ? onClickFunc(row.original) : null
                  }
                  transition="all 0.5s"
                  _hover={
                    onClickFunc
                      ? { bg: colorMode == "dark" ? "gray.700" : "gray.200" }
                      : {}
                  }
                >
                  {row.cells.map((cell) => (
                    <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
      <PaginationStyled>
        <Pagination
          activePage={pageIndex + 1}
          itemsCountPerPage={pageSize}
          totalItemsCount={data.length}
          pageRangeDisplayed={5}
          onChange={(pageNumber: number) => {
            gotoPage(pageNumber - 1);
          }}
        />
      </PaginationStyled>
    </ScrollbarWrapper>
  );
};

const PaginationStyled = styled.div`
  .pagination {
    height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    li {
      list-style: none;
    }

    .disabled {
      opacity: 0.2;
      pointer-events: none;
    }

    .active {
      color: deepskyblue;
    }
  }

  width: 200px;

  margin: auto;
`;

const AnimatedSortIcon = ({
  icon,
  isVisible,
}: {
  icon: React.ReactNode;
  isVisible: boolean;
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, maxHeight: 0, maxWidth: 0 }}
          animate={{ opacity: 1, maxHeight: 5, maxWidth: 20 }}
          exit={{ opacity: 0, maxHeight: 0, maxWidth: 0 }}
        >
          {icon}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TableComponent;
