import React from "react";

const DebugReloadButton = () => {
  if (process.env.NODE_ENV !== "development") return null;

  // Style is here to not be computed in production
  const style = {
    position: "fixed",
    bottom: 20,
    left: 20,
    height: 40,
    backgroundColor: "teal",
    borderRadius: 8,
    boxShadow: "none",
    color: "white",
    display: "flex",
    alignItems: "center",
    padding: 8,
    cursor: "pointer",
  };

  return (
    <div onClick={switchMode} style={style}>
      Switch to {process.DEBUG_MODE ? "production" : "debug"}
    </div>
  );
};

const switchMode = () => {
  window.sessionStorage.DEBUG_PREVENT =
    window.sessionStorage.DEBUG_PREVENT === "true" ? "false" : "true";

  console.log("Debug mode prevention: " + window.sessionStorage.DEBUG_PREVENT);
  window.location.reload();
};

export default DebugReloadButton;
