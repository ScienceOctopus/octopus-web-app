const SESSION_COOKIE_NAME = "Octopus API (Node.js) Session Identifier";

const getUserFromSession = req => {
  const session = req.cookies[SESSION_COOKIE_NAME];

  const sessionState = global.sessions[session];
  if (!sessionState) {
    return undefined;
  }

  return sessionState.user;
};

module.exports = {
  SESSION_COOKIE_NAME,
  getUserFromSession,
};
