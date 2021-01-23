import React, { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import withChangeAnimation from "../utilities/withChangeAnimation";
import GamesList from "./GamesList";
import { useQuery, gql } from "@apollo/client";
import { PlayerGameProfiles } from "../generated/PlayerGameProfiles";
import Rewards from "./Rewards";

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
      rewards {
        id
        reward {
          id
          name
          description
          image
        }
      }
    }
  }
`;

const Profile: React.ComponentType = () => {
  const { keycloak, initialized } = useKeycloak();
  const { data, error, loading } = useQuery<PlayerGameProfiles>(
    PLAYER_GAME_PROFILES
  );

  const [
    userProfile,
    setUserProfile,
  ] = useState<null | Keycloak.KeycloakProfile>(null);
  //   console.log("userProfile", userProfile);
  const loadUserProfile = async () => {
    setUserProfile(await keycloak.loadUserProfile());
  };

  useEffect(() => {
    if (initialized) {
      loadUserProfile();
    }
  }, [initialized]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.log("ERROR", error);
  }

  if (!data) {
    return <div>Couldn't fetch data</div>;
  }
  return (
    <div>
      {/* Hello, {userProfile?.firstName} {userProfile?.lastName} */}
      {data.myGameProfiles.length < 1 &&
        "Unfortunately you are not enrolled in any games at the moment."}
      <Rewards data={data} />
      <GamesList data={data} />
    </div>
  );
};

export default withChangeAnimation(Profile);
