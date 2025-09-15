import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is not defined in .env");
}

function generateToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET_KEY, { expiresIn: "24h" });
}


export default generateToken;
