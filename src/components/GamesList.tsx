import React, { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { PlayerGameProfiles } from "../generated/PlayerGameProfiles";
import { useKeycloak } from "@react-keycloak/web";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";

const PLAYER_GAME_PROFILES = gql`
  query PlayerGameProfiles {
    myGameProfiles {
      id
      game {
        id
        name
        description
      }
      user {
        id
        username
        email
      }
      group {
        id
        name
      }
    }
  }
`;

const GamesList = () => {
  const { keycloak } = useKeycloak();

  const { data, error, loading } = useQuery<PlayerGameProfiles>(
    PLAYER_GAME_PROFILES
  );
  if (error) {
    console.log("ERROR", error.graphQLErrors);
    // console.log("CRAZY TOKEN", keycloak);
    // if (error.message === "Forbidden resource") {
    //   keycloak.updateToken(1).then((res) => {
    //     console.log("token?", res);
    //   });
    //   console.log("siup");
    // }
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data.</div>;
  }

  return (
    <div>
      Available games:{" "}
      {data.myGameProfiles.map((gameProfile, i) => {
        return (
          <Link
            key={i}
            to={{
              pathname: "/profile/game",
              state: { gameId: gameProfile.game.id },
            }}
          >
            <Game>
              <div>
                {gameProfile.game.name}
                <div>{gameProfile.game.description}</div>
              </div>
            </Game>
          </Link>
        );
      })}
    </div>
  );
};

const Game = styled.div`
  height: 100px;
  width: 400px;
  border-radius: 5px;
  background-color: white;
  display: flex;
  align-items: center;
  padding: 15px;
  transition: transform 0.5s;
  &:hover {
    transform: scale(1.1);
  }
  & > div > div {
    font-size: 12px;
  }
`;

export default GamesList;
