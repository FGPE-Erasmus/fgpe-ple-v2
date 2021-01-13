import React, { useContext } from "react";
import { useQuery, gql } from "@apollo/client";
import { PlayerGameProfiles } from "../generated/PlayerGameProfiles";
import { useKeycloak } from "@react-keycloak/web";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";

import NavContext from "../context/NavContext";

const GamesList = ({ data }: { data: PlayerGameProfiles }) => {
  const { keycloak } = useKeycloak();
  const { setActiveGame } = useContext(NavContext);

  // const { data, error, loading } = useQuery<PlayerGameProfiles>(
  //   PLAYER_GAME_PROFILES
  // );
  // if (error) {
  //   console.log("ERROR", error.graphQLErrors);
  //   // console.log("CRAZY TOKEN", keycloak);
  //   // if (error.message === "Forbidden resource") {
  //   //   keycloak.updateToken(1).then((res) => {
  //   //     console.log("token?", res);
  //   //   });
  //   //   console.log("siup");
  //   // }
  // }
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (!data) {
  //   return <div>No data.</div>;
  // }

  return (
    <GamesWrapper>
      <h4 style={{ margin: 10, marginTop: 30 }}>Available games:</h4>
      {data.myGameProfiles.map((gameProfile, i) => {
        return (
          <Link
            key={i}
            to={{
              pathname: "/profile/game",
              state: { gameId: gameProfile.game.id },
            }}
            onClick={() =>
              setActiveGame({
                id: gameProfile.game.id,
                name: gameProfile.game.name,
              })
            }
          >
            <Game>
              <div>
                <h3>{gameProfile.game.name}</h3>
                <div>{gameProfile.game.description}</div>
              </div>
            </Game>
          </Link>
        );
      })}
    </GamesWrapper>
  );
};

const GamesWrapper = styled.div`
  a {
    color: black;
  }
`;

const Game = styled.div`
  height: 100px;
  width: 100%;
  border-radius: 5px;
  background-color: white;
  display: flex;
  align-items: center;
  padding: 15px;
  transition: transform 0.5s;
  &:hover {
    transform: scale(0.97);
  }
  & > div > div {
    font-size: 12px;
  }
`;

export default GamesList;
