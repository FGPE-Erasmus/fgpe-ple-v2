import React, { useState } from "react";
import "./i18n/config";
import { useTranslation } from "react-i18next";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import styled from "@emotion/styled";
import { AnimatePresence } from "framer-motion";

import Homepage from "./components/HomePage";
// import MainLoading from "./components/MainLoading";
import ProfileInGame from "./components/ProfileInGame";
import Challenge from "./components/Challenge";
import PrivateRoute from "./utilities/PrivateRoute";

import ZoomContext from "./context/ZoomContext";
import StudentProfile from "./components/StudentProfile";
import TeacherProfile from "./components/TeacherProfile";
import Profile from "./components/Profile";
import Alerts from "./components/Alerts";
import InstructorGame from "./components/InstructorGame";

const getZoomFactorFromLocalStorage = () => {
  const zoomFactor = localStorage.getItem("zoom");
  return zoomFactor ? Number(zoomFactor) : null;
};

const MainWrapper = styled.div`
  max-width: 1140px;
  padding: 15px;
  margin: auto;
`;

function App() {
  const { ready } = useTranslation();
  const [zoomFactor, setZoomFactor] = useState(
    getZoomFactorFromLocalStorage() || 1
  );
  // const [activeChallenge, setActiveChallenge] = useState<{
  //   id: string;
  //   name: string;
  // } | null>(null);
  // const [activeGame, setActiveGame] = useState<{
  //   id: string;
  //   name: string;
  // } | null>(null);
  // const [playerId, setPlayerId] = useState<null | string>(null);

  // console.log(process.env.REACT_APP_KEYCLOAK_CLIENT_ID);
  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Route
        render={({ location }) => (
          <>
            {/* <MainLoading /> */}
            {/* <NavContext.Provider
              value={{
                activeChallenge: activeChallenge,
                setActiveChallenge: setActiveChallenge,
                activeGame: activeGame,
                setActiveGame: setActiveGame,
              }}
            > */}
            {/* <MainContext.Provider
              value={{
                playerId: null,
                setPlayerId: setPlayerId,
              }}
            > */}
            <ZoomContext.Provider
              value={{
                zoomFactor,
                setZoomFactor: (value: number) => {
                  setZoomFactor(value);
                },
              }}
            >
              <ZoomWrapper zoomFactor={zoomFactor}>
                {/* <Alerts /> */}
                <Navbar />
                <MainWrapper>
                  <AnimatePresence exitBeforeEnter initial={false}>
                    <Switch location={location} key={location.pathname}>
                      <Route
                        exact
                        path="/(|learning-platform)/"
                        component={Homepage}
                      />
                      <PrivateRoute
                        exact
                        path="/profile"
                        roles={["student", "teacher"]}
                        component={Profile}
                      />

                      <PrivateRoute
                        exact
                        path="/game/:gameId"
                        roles={["student"]}
                        component={ProfileInGame}
                      />

                      <PrivateRoute
                        exact
                        path="/teacher/game/:gameId"
                        roles={["teacher"]}
                        component={InstructorGame}
                      />

                      <PrivateRoute
                        exact
                        path="/game/:gameId/challenge/:challengeId"
                        roles={["student"]}
                        component={Challenge}
                      />
                    </Switch>
                  </AnimatePresence>
                </MainWrapper>
              </ZoomWrapper>
            </ZoomContext.Provider>
            {/* </MainContext.Provider> */}
            {/* </NavContext.Provider> */}
          </>
        )}
      />
    </BrowserRouter>
    // {/* <h2>{t("title")}</h2>
    //   <p>{t("description.part1")}</p>
    //   <p>{t("description.part2")}</p>

    //   <button
    //     onClick={() => {
    //       i18n.changeLanguage("pl");
    //     }}
    //   >
    //     Polski
    //   </button>
    //   <button
    //     onClick={() => {
    //       i18n.changeLanguage("en");
    //     }}
    //   >
    //     English
    //   </button> */}
  );
}

const ZoomWrapper = styled.div<{ zoomFactor: number }>`
  zoom: ${({ zoomFactor }) => zoomFactor};
`;

export default App;
