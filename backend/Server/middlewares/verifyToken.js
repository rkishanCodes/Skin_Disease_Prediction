import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Extract token
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // Attach decoded user data to the request
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized, invalid token" });
  }
};
