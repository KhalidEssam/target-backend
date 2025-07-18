// middleware/auth.js
const OktaJwtVerifier = require("@okta/jwt-verifier");

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: "https://dev-36372109.okta.com/oauth2/default",
  clientId: process.env.clientId,
  assertClaims: {
    aud: "api://default", // Make sure this matches the API audience in Okta
  },
});

const authenticationRequired = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const accessToken = match[1];

  try {
    const jwt = await oktaJwtVerifier.verifyAccessToken(accessToken, "api://default");
    req.user = jwt.claims; // Add user info to request
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticationRequired;
