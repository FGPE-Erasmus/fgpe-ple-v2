import { useKeycloak } from "@react-keycloak/web";
import React from "react";
import StudentProfile from "./StudentProfile";
import TeacherProfile from "./TeacherProfile";

enum Roles {
  teacher = "teacher",
  student = "student",
}

const Profile = () => {
  const { keycloak } = useKeycloak();

  if (keycloak.hasRealmRole(Roles.teacher)) {
    return <TeacherProfile />;
  } else {
    return <StudentProfile />;
  }
};

export default Profile;
