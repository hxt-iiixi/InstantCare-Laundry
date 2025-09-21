const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = auth;
