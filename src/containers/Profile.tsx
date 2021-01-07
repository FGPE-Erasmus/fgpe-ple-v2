import React, { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import withChangeAnimation from "../utilities/withChangeAnimation";

const Profile: React.ComponentType = () => {
  const { keycloak, initialized } = useKeycloak();
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

  return (
    <div>
      Hello, {userProfile?.firstName} {userProfile?.lastName}
    </div>
  );
};

export default withChangeAnimation(Profile);
