import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
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
  data: dataProp,
  dontRecomputeChange,
}: {
  columns: any;
  data: any;
  dontRecomputeChange?: boolean;
}) => {
  const { i18n } = useTranslation();
  const columns = useMemo(() => columnsProp, [
    dontRecomputeChange ? null : columnsProp,
    i18n.language,
  ]);
  const data = useMemo(() => dataProp, [
    dontRecomputeChange ? null : dataProp,
    i18n.language,
  ]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useSortBy,
    usePagination
    // useFlexLayout
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,

    prepareRow,
  } = tableInstance;

  const { page, state, gotoPage }: any = tableInstance;
  const { pageSize, pageIndex } = state;

  return (
    <ScrollbarWrapper>
      <Box overflowX="auto">
        <Table {...getTableProps()} maxWidth="100%">
          <Thead userSelect="none">
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any, i) => (
                  <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <Flex justifyContent="space-between">
                      {column.render("Header")}
                      <Box float="right" textAlign="right">
                        {column.isSorted ? (
                          <>
                            <AnimatedSortIcon
                              icon={<TiArrowSortedDown fontSize={16} />}
                              isVisible={column.isSortedDesc}
                            />
                            <AnimatedSortIcon
                              icon={<TiArrowSortedUp fontSize={16} />}
                              isVisible={!column.isSortedDesc}
                            />
                          </>
                        ) : (
                          <TiArrowUnsorted fontSize={16} />
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
                {headerGroup.headers.map((column: any, i) =>
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
            {page.map((row: any) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell: any) => (
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
          initial={{ opacity: 0, y: -25, maxHeight: 0, maxWidth: 0 }}
          animate={{ opacity: 1, y: 0, maxHeight: 15, maxWidth: 15 }}
          exit={{ opacity: 0, y: -25, maxHeight: 0, maxWidth: 0 }}
        >
          {icon}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TableComponent;
