require('dotenv').config();
const { SignJWT, jwtVerify } = require("jose");

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

async function generateToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);
}

async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  try {
    const { payload } = await jwtVerify(token, secret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({message: "Invalid or expired token"});
  }
}

module.exports = { generateToken, authenticateToken };