import { ChevronDownIcon, HamburgerIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useKeycloak } from "@react-keycloak/web";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiUserCircle } from "react-icons/bi";
import { IoLanguage } from "react-icons/io5";
import { VscColorMode } from "react-icons/vsc";
import { NavLink } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import NavContext from "../context/NavContext";
import LogoSVG from "../images/logo.svg";
import ChangeLanguageModal from "./ChangeLanguageModal";
import { Text } from "@chakra-ui/react";

const Logo = styled.div`
  background: url(${LogoSVG});
  width: 100px;
  height: 50px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  top: 8px;
`;

const Navbar = () => {
  const breadcrumbs = useBreadcrumbs();
  const {
    isOpen: isOpenLanguageModal,
    onOpen: onOpenLanguageModal,
    onClose: onCloseLanguageModal,
  } = useDisclosure();

  const { t, i18n } = useTranslation();

  const { activeGame } = useContext(NavContext);
  const { keycloak, initialized } = useKeycloak();

  // const resetActiveGameAndChallenge = () => {
  //   activeGameAndChallenge.setActiveChallenge(null);
  //   activeGameAndChallenge.setActiveGame(null);
  // };

  const { colorMode, toggleColorMode } = useColorMode();
  const [userProfile, setUserProfile] =
    useState<null | Keycloak.KeycloakProfile>(null);

  const loadUserProfile = async () => {
    setUserProfile(await keycloak.loadUserProfile());
  };

  useEffect(() => {
    if (initialized) {
      loadUserProfile();
    }
  }, [initialized]);

  return (
    <>
      <ChangeLanguageModal
        onClose={onCloseLanguageModal}
        onOpen={onOpenLanguageModal}
        isOpen={isOpenLanguageModal}
      />
      <NavbarStyled>
        <Flex px={2} justifyContent="space-between" alignItems="center" height="100%">
          <Box width={1 / 2}>
            <NavLink to={keycloak.authenticated ? "/profile" : "/"}>
              <Logo />
            </NavLink>
            {/* {activeGame && activeGame.name} */}
          </Box>

          <Flex
            width={1 / 2}
            justifyContent="flex-end"
            alignItems="flex-end"
            display={{ base: "none", md: "flex" }}
          >
            {keycloak.authenticated && (
              <Box>
                <NavLink to="/profile">
                  <IconButton
                    height={6}
                    _focus={{}}
                    variant="link"
                    colorScheme="gray"
                    aria-label="Profile"
                    icon={<BiUserCircle fontSize={24} />}
                  />
                </NavLink>
              </Box>
            )}

            {keycloak.authenticated && (
              <Box>
                <NavLink to="/profile/settings">
                  <IconButton
                    height={6}
                    _focus={{}}
                    variant="link"
                    colorScheme="gray"
                    aria-label="Settings"
                    icon={<SettingsIcon fontSize={20} />}
                  />
                </NavLink>
              </Box>
            )}

            <Box>
              <IconButton
                height={6}
                _focus={{}}
                onClick={toggleColorMode}
                variant="link"
                colorScheme="gray"
                aria-label="Toggle color mode"
                icon={<VscColorMode fontSize={24} />}
              />
            </Box>
            <Box>
              <IconButton
                height={6}
                _focus={{}}
                onClick={onOpenLanguageModal}
                variant="link"
                colorScheme="gray"
                aria-label="Change language"
                icon={<IoLanguage fontSize={24} />}
              />
            </Box>

            <Box marginLeft={5}>
              {keycloak.authenticated ? (
                <button onClick={() => keycloak.logout()}>{t("Logout")}</button>
              ) : (
                <button
                  onClick={() => {
                    keycloak.login({
                      redirectUri: `${window.location.origin}${process.env.PUBLIC_URL}/profile`,
                    });
                  }}
                >
                  {t("Login")}
                </button>
              )}
            </Box>

            {/* <IconButton
              onClick={toggleColorMode}
              aria-label="Toggle theme"
              icon={colorMode === "light" ? <SunIcon /> : <MoonIcon />}
            /> */}
          </Flex>
          <Box display={{ base: "box", md: "none" }}>
            <Menu>
              <MenuButton as={Button}>
                <HamburgerIcon />
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <NavLink to="/profile">
                    <Flex color={colorMode === "dark" ? "white" : "black"}>
                      <IconButton
                        height={6}
                        _focus={{}}
                        variant="link"
                        colorScheme="gray"
                        aria-label="Profile"
                        icon={<BiUserCircle fontSize={24} />}
                      />
                      {t("Your games")}
                    </Flex>
                  </NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink to="/profile/settings">
                    <Flex color={colorMode === "dark" ? "white" : "black"}>
                      <IconButton
                        height={6}
                        _focus={{}}
                        variant="link"
                        colorScheme="gray"
                        aria-label="Settings"
                        icon={<SettingsIcon fontSize={20} />}
                      />
                      {t("Account settings")}
                    </Flex>
                  </NavLink>
                </MenuItem>
                <MenuItem onClick={toggleColorMode}>
                  <IconButton
                    height={6}
                    _focus={{}}
                    variant="link"
                    colorScheme="gray"
                    aria-label="Toggle color mode"
                    icon={<VscColorMode fontSize={24} />}
                  />
                  {t("settings.darkMode")}
                </MenuItem>
                <MenuItem onClick={onOpenLanguageModal}>
                  <IconButton
                    height={6}
                    _focus={{}}
                    variant="link"
                    colorScheme="gray"
                    aria-label="Change language"
                    icon={<IoLanguage fontSize={24} />}
                  />
                  {t("Language")}
                </MenuItem>
                {keycloak.authenticated ? (
                  <MenuItem onClick={() => keycloak.logout()} paddingLeft={6}>
                    {t("Logout")}
                  </MenuItem>
                ) : (
                  <MenuItem
                    paddingLeft={6}
                    onClick={() => {
                      keycloak.login({
                        redirectUri: `${window.location.origin}${process.env.PUBLIC_URL}/profile`,
                      });
                    }}
                  >
                    {t("Login")}
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </Box>

          {/* </UserMenu> */}
        </Flex>
      </NavbarStyled>
    </>
  );
};

const UserMenu = styled.div`
  /* display: flex; */
  justify-content: center;
  align-items: center;
  width: 150px;
  float: right;

  * {
    margin-left: 15px;
  }
`;

const UserIconStyled = styled.img`
  height: 25px;
  cursor: pointer;
  transition: transform 0.5s;

  &:hover {
    transform: scale(1.2);
  }
`;

const NavbarStyled = styled(Box)`
  a {
    /* margin-right: 15px; */
    color: black;
  }

  height: 65px;
  z-index: 999;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.05);
  & > div {
    /* max-width: 1140px; */
    padding: 0px 20px;
    margin: auto;
  }
`;

export default Navbar;
