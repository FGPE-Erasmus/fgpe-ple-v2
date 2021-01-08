import React, { useState } from "react";
import withChangeAnimation from "../utilities/withChangeAnimation";
import CodeEditor from "../components/CodeEditor";

const Challenge = ({
  location,
}: {
  location: { state: { challengeId: string } };
}) => {
  const { challengeId } = location.state;
  const [code, setCode] = useState("// You can start coding here");
  if (!challengeId) {
    return <div>Challenge ID not provided</div>;
  }

  return (
    <div>
      Challenge: {challengeId}
      <CodeEditor code={code} setCode={setCode} />
    </div>
  );
};

export default withChangeAnimation(Challenge);
