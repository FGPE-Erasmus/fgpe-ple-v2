import { EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
} from "@chakra-ui/react";
import React, { useState } from "react";

interface EditableProps {
  defaultValue: string;
  label: string;
  onChange: (value: string) => Promise<void>;
}

const Editable = ({ defaultValue, label, onChange }: EditableProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(false);

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Flex justifyContent="space-between">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!isEditing}
        />
        {!isEditing ? (
          <IconButton
            marginLeft={2}
            onClick={() => setIsEditing(true)}
            aria-label="Edit"
            icon={<EditIcon />}
          />
        ) : (
          <Flex>
            <IconButton
              isLoading={loading}
              marginLeft={2}
              onClick={async () => {
                setLoading(true);
                try {
                  await onChange(value);
                } catch (err) {
                  setValue(defaultValue);
                }
                setLoading(false);
                setIsEditing(false);
              }}
              aria-label="Accept"
              icon={<CheckIcon />}
            />
            <IconButton
              marginLeft={2}
              onClick={() => {
                setValue(defaultValue);
                setIsEditing(false);
              }}
              aria-label="Cancel"
              icon={<CloseIcon />}
            />
          </Flex>
        )}
      </Flex>
    </FormControl>
  );
};

export default Editable;
