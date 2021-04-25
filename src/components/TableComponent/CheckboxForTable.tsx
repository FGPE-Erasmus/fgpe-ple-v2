import { Checkbox } from "@chakra-ui/react";
import React from "react";

const CheckboxForTable = React.forwardRef(
  ({ indeterminate, ...rest }: any, ref: any) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <Checkbox
        type="checkbox"
        ref={resolvedRef}
        {...rest}
        isChecked={rest.checked}
      />
    );
  }
);

export default CheckboxForTable;
