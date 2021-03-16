import React from "react";
import withChangeAnimation from "../utilities/withChangeAnimation";
import GamesList from "./GamesList";
import InstructorGames from "./InstructorGames";

const TeacherProfile = () => {
  return (
    <div>
      Hello teacher
      <InstructorGames />
    </div>
  );
};

export default withChangeAnimation(TeacherProfile);
