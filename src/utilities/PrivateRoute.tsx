import { useKeycloak } from "@react-keycloak/web";
import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { motion } from "framer-motion";
import { rolesTypes } from "./types";

interface PrivateRouteI extends RouteProps {
  component: React.ComponentType<any>;
  roles: rolesTypes;
  redirectTo?: string;
}

export default function PrivateRoute({
  component: Component,
  roles,
  redirectTo,
  ...rest
}: PrivateRouteI) {
  const { keycloak } = useKeycloak();

  const isAuthorized = (roles: rolesTypes) => {
    if (keycloak && roles) {
      return roles.some((r) => {
        console.log("UNATHORIZED");

        const realm = keycloak.hasRealmRole(r);
        const resource = keycloak.hasResourceRole(r);
        return realm || resource;
      });
    }
    return false;
  };

  return (
    <Route
      {...rest}
      render={(props) => {
        return isAuthorized(roles) ? (
          <Component {...props} />
        ) : (
          <motion.div exit="undefined">
            <Redirect to={{ pathname: redirectTo ? redirectTo : "/" }} />
          </motion.div>
        );
      }}
    />
  );
}
