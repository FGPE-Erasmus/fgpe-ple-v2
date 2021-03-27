import { Input } from "@chakra-ui/react";
import React from "react";

const ColumnFilter = ({
  column,
  placeholder,
}: {
  column: any;
  placeholder?: string;
}) => {
  const { filterValue, setFilter } = column;

  return (
    <Input
      width="100%"
      size="xs"
      placeholder={placeholder ? placeholder : ""}
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value)}
    />
  );
};

export default ColumnFilter;
