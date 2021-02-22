import React from "react";

const ZoomContext = React.createContext<{
  zoomFactor: number;
  setZoomFactor: (value: number) => void;
}>({
  zoomFactor: 1,
  setZoomFactor: (value) => {},
});

export default ZoomContext;
