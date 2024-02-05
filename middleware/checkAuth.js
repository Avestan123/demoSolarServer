const jwt = require('jsonwebtoken');
const Employee = require("../models/employee"); // Assuming you have an Employee model

const checkAuth = async (req, res, next) => {
  const rawToken = req.headers.authorization;
  // console.log(rawToken);
  const token = rawToken.replace('Bearer ', '');
  const secret_key = process.env.SECRET_KEY;
  if (!token) {
    return res.status(401).json({ status: 401, message: 'Unauthorized: No token provided' });
  }
  try {
    // Verify the token using your secret key
    const decodedToken = jwt.verify(token, secret_key);

    // Fetch the authenticated user from the database based on the decoded token
    const user = await Employee.findById(decodedToken._id);
   
    if (!user) {
      return res.status(401).json({ status: 401, message: 'Unauthorized: Invalid user' });
    }
    // Set the authenticated user in the request object
    req.user = user;
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

module.exports = checkAuth;