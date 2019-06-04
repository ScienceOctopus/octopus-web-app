import React from "react";

export const LoginDataContext = React.createContext({
  user: undefined,
  login: () => {},
});
