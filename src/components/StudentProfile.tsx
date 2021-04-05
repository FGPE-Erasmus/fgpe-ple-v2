import React, { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import withChangeAnimation from "../utilities/withChangeAnimation";
import GamesList from "./GamesList";
import { useQuery, gql } from "@apollo/client";
import { PlayerGameProfiles } from "../generated/PlayerGameProfiles";
import Rewards from "./Rewards";
import { Heading, Spacer } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Error from "./Error";
import { SERVER_ERRORS } from "../utilities/ErrorMessages";

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
      learningPath {
        id
        progress
        refs {
          solved
        }
      }
      rewards {
        id
        reward {
          id
          name
          description
          image
          kind
          cost
          createdAt
          game {
            name
          }
          parentChallenge {
            name
          }
        }
      }
    }
  }
`;

const StudentProfile: React.ComponentType = () => {
  const { t, i18n } = useTranslation();
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
    return <div>{t("Loading")}</div>;
  }

  if (!loading && error) {
    const isServerConnectionError = error.graphQLErrors[0].message.includes(
      SERVER_ERRORS.ECONNABORTED
    );

    if (isServerConnectionError) {
      return <Error serverConnectionError />;
    } else {
      return <Error errorContent={JSON.stringify(error)} />;
    }
  }

  if (!data) {
    return <Error errorContent={"No data"} />;
  }

  return (
    <div>
      {/* Hello, {userProfile?.firstName} {userProfile?.lastName} */}
      <Heading as="h3" size="md" marginTop={5} marginBottom={5}>
        {t("Rewards")}
      </Heading>
      <Rewards data={data} />

      <Heading as="h3" size="md" marginTop={10}>
        {t("Games")}
      </Heading>

      <GamesList data={data} />
      {data.myGameProfiles.length < 1 && t("No games")}
    </div>
  );
};

export default withChangeAnimation(StudentProfile);
