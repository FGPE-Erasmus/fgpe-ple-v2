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
  Heading,
  Input,
  Select,
  Stack,
  Switch,
  useColorMode,
  Kbd,
  useDisclosure,
  TableCaption,
  Table,
  Tr,
  Td,
  Tbody,
  Thead,
  Th,
  Text,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { SettingsContext } from "./SettingsContext";
import ZoomContext from "../../context/ZoomContext";

// import monacoThemes from "monaco-themes/themes/themelist.json";

const Settings = ({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  const { zoomFactor, setZoomFactor } = useContext(ZoomContext);
  const { colorMode, toggleColorMode } = useColorMode();
  const {
    setEditorTheme,
    editorTheme,
    setTerminalTheme,
    terminalTheme,
    setTerminalFontSize,
    terminalFontSize,
  } = useContext(SettingsContext);

  const changeEditorTheme = (newTheme: string) => {
    setEditorTheme(newTheme);
    localStorage.setItem("editorTheme", newTheme);
  };

  const changeTerminalTheme = (newTheme: string) => {
    setTerminalTheme(newTheme);
    localStorage.setItem("terminalTheme", newTheme);
  };

  const changeTerminalFontSize = (newSize: string) => {
    setTerminalFontSize(newSize);
    localStorage.setItem("terminalFontSize", newSize);
  };

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
                <Select
                  value={editorTheme}
                  onChange={(e) => changeEditorTheme(e.target.value)}
                >
                  {["vs-dark", "light"].map((theme, i) => (
                    <option value={theme} key={i}>
                      {theme}
                    </option>
                  ))}
                  {/* {Object.entries(monacoThemes).map(([themeId, themeName]) => (
                    <option value={themeId} key={themeId}>
                      {themeName}
                    </option>
                  ))} */}
                </Select>
              </FormControl>

              <FormControl display="flex" flexDirection="column" w="100%">
                <FormLabel mb="0">Terminal theme</FormLabel>
                <Select
                  value={terminalTheme}
                  onChange={(e) => changeTerminalTheme(e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </Select>
              </FormControl>

              <FormControl display="flex" flexDirection="column" w="100%">
                <FormLabel mb="0">Platform zoom</FormLabel>
                <Select
                  value={zoomFactor}
                  onChange={(e) => {
                    localStorage.setItem("zoom", e.target.value);
                    setZoomFactor(Number(e.target.value));
                  }}
                >
                  {[0.85, 0.9, 0.95, 1, 1.05, 1.1, 1.15, 1.2, 1.25].map(
                    (item, i) => {
                      return (
                        <option key={i} value={item}>
                          {(item * 100).toFixed(0)}%
                        </option>
                      );
                    }
                  )}
                </Select>
              </FormControl>

              <FormControl display="flex" flexDirection="column" w="100%">
                <FormLabel mb="0">Terminal font size</FormLabel>
                <Select
                  value={terminalFontSize}
                  onChange={(e) => changeTerminalFontSize(e.target.value)}
                >
                  {[13, 14, 15, 16, 17, 18].map((item, i) => {
                    return (
                      <option key={i} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </Select>
                <Text fontSize="xs">
                  Use the <b>editor menu</b> to change its zoom and other
                  parameters
                </Text>
              </FormControl>

              <Box>
                {/* <Heading as="h2" size="sm">
                  Keyboard shortcuts:
                </Heading> */}
                <Box>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Key combination</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>
                          <Kbd>ctrl</Kbd> + <Kbd>enter</Kbd>
                        </Td>
                        <Td>Run</Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Kbd>ctrl</Kbd> + <Kbd>\</Kbd>
                        </Td>
                        <Td>Submit</Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Kbd>ctrl</Kbd> + <Kbd>m</Kbd>
                        </Td>
                        <Td>Save</Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Kbd>ctrl</Kbd> + <Kbd>,</Kbd>
                        </Td>
                        <Td>Restore</Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Kbd>F1</Kbd>{" "}
                          <Text as="span" fontSize={11}>
                            (in editor)
                          </Text>
                        </Td>
                        <Td>Editor Menu</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
              </Box>
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
