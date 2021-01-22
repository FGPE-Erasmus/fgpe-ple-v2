import {
  Box,
  Button,
  color,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Switch,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import monacoThemes from "monaco-themes/themes/themelist.json";

const Settings = ({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Settings</DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px">
              <FormControl display="flex" alignItems="center" w="100%">
                <FormLabel htmlFor="dark-mode" mb="0">
                  Dark mode
                </FormLabel>
                <Switch
                  id="dark-mode"
                  isChecked={colorMode == "dark"}
                  onChange={toggleColorMode}
                />
              </FormControl>

              <FormControl display="flex" flexDirection="column" w="100%">
                <FormLabel mb="0">Editor theme</FormLabel>
                <Select placeholder="Select option" value="vs-dark">
                  {["vs-dark", "light"].map((theme, i) => (
                    <option value={theme} key={i}>
                      {theme}
                    </option>
                  ))}
                  {Object.entries(monacoThemes).map(([themeId, themeName]) => (
                    <option value={themeId} key={themeId}>
                      {themeName}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl display="flex" flexDirection="column" w="100%">
                <FormLabel htmlFor="dark-mode" mb="0">
                  Terminal theme
                </FormLabel>
                <Select placeholder="Select option" value="dark">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </Select>
              </FormControl>
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            {/* <Button color="blue">Save</Button> */}
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default Settings;
