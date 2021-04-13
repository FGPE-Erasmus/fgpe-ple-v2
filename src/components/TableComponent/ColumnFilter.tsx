import { Input, Select } from "@chakra-ui/react";
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

interface OptionI {
  value: any;
  text: string;
}

export const ColumnSelectFilter = ({
  column,
  placeholder,
  options,
}: {
  column: any;
  placeholder?: string;
  options: OptionI[];
}) => {
  const { filterValue, setFilter } = column;

  return (
    <Select
      size="sm"
      height="1.5rem"
      value={filterValue}
      onChange={(e) => {
        console.log(e.target.value);
        setFilter(e.target.value);
      }}
    >
      {options.map((optionObj, i) => (
        <option value={optionObj.value} key={i}>
          {optionObj.text}
        </option>
      ))}
    </Select>
  );
};

export default ColumnFilter;
