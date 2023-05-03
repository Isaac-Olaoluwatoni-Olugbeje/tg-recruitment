const jwt = require('jsonwebtoken');

// Middleware to check if user is an operator
const checkOperator = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // If no authorization header is present, return an error response
    return res.status(401).send('Authorization header missing');
  }
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, "root");
  const authLevel = decodedToken.authorizationLevel;

  if (authLevel !== 'operator') {
    // If user is not an operator, return an error response
    return res.status(403).send('Unauthorized');
  } 
  // User is an operator, continue to next middleware function
  next();
};

module.exports = checkOperator;