import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Kbd,
  Select,
  Stack,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import ZoomContext from "../../context/ZoomContext";
import { SettingsContext } from "./SettingsContext";

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
  const { t } = useTranslation();

  const { zoomFactor, setZoomFactor } = useContext(ZoomContext);
  const { colorMode, toggleColorMode } = useColorMode();
  const {
    setEditorTheme,
    editorTheme,
    setTerminalTheme,
    terminalTheme,
    setTerminalFontSize,
    terminalFontSize,
    isSkulptEnabled,
    setSkulptEnabled,
  } = useContext(SettingsContext);

  const toggleSkulpt = () => {
    if (isSkulptEnabled) {
      localStorage.setItem("skulpt", "false");
      setSkulptEnabled(false);
    } else {
      localStorage.setItem("skulpt", "true");
      setSkulptEnabled(true);
    }
  };

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
                  {t("settings.darkMode")}
                </FormLabel>
                <Switch
                  id="dark-mode"
                  isChecked={colorMode === "dark"}
                  onChange={toggleColorMode}
                />
              </FormControl>

              <FormControl display="flex" flexDirection="column" w="100%">
                <FormLabel mb="0">{t("settings.editorTheme")}</FormLabel>
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
                <FormLabel mb="0">{t("settings.terminalTheme")}</FormLabel>
                <Select
                  value={terminalTheme}
                  onChange={(e) => changeTerminalTheme(e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </Select>
              </FormControl>

              <FormControl display="flex" flexDirection="column" w="100%">
                <FormLabel mb="0">{t("settings.platformZoom")}</FormLabel>
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
                <FormLabel mb="0">{t("settings.terminalFontSize")}</FormLabel>
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
                <Text fontSize="xs">{t("settings.editorMenuTip")}</Text>
              </FormControl>

              <Box>
                {/* <Heading as="h2" size="sm">
                  Keyboard shortcuts:
                </Heading> */}
                <Box>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>{t("settings.keyCombination")}</Th>
                        <Th>{t("settings.action")}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>
                          <Kbd>ctrl</Kbd> + <Kbd>enter</Kbd>
                        </Td>
                        <Td>{t("playground.menu.run")}</Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Kbd>ctrl</Kbd> + <Kbd>\</Kbd>
                        </Td>
                        <Td>{t("playground.menu.submit")}</Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Kbd>ctrl</Kbd> + <Kbd>m</Kbd>
                        </Td>
                        <Td>{t("playground.menu.reload")}</Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Kbd>ctrl</Kbd> + <Kbd>,</Kbd>
                        </Td>
                        <Td>{t("playground.menu.restore")}</Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Kbd>F1</Kbd>{" "}
                          <Text as="span" fontSize={11}>
                            {t("settings.inEditor")}
                          </Text>
                        </Td>
                        <Td>{t("settings.editorMenu")}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
              </Box>

              <FormControl display="flex" alignItems="center" w="100%">
                <FormLabel htmlFor="dark-mode" mb="0">
                  Skulpt (Python)
                </FormLabel>
                <Switch
                  id="skulpt-on-off"
                  isChecked={isSkulptEnabled}
                  onChange={toggleSkulpt}
                />
              </FormControl>
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              {t("Cancel")}
            </Button>
            {/* <Button color="blue">Save</Button> */}
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default Settings;
