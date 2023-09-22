var jwt = require("jsonwebtoken");

const JWT_SECRET = "sanyasecrettoken";

const fetchuser = (req, res, next) => {
  // Get user from jwt token
  const token = req.header('auth-token');
  // console.log('Received token:', token); // Add this line
  if (!token) {
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET); // Use the variable data instead of string
    console.log('Decoded data:', data); // Add this line
    req.user = data.user; // Use data.user to access the user object
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchuser;
