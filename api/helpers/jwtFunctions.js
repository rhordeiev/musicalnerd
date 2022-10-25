const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.generateAccessToken = (id, expirationTime) =>
  jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: expirationTime,
  });

// eslint-disable-next-line consistent-return
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return false;
  const id = jwt.verify(token, process.env.TOKEN_SECRET);
  req.id = id;
  next();
  // if (err) return res.sendStatus(403);
};
