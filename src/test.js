const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const id = 'ashauhsuahsa';

const token = jwt.sign(
  {
    id,
  },
  process.env.AUTH_SECRET,
  {
    expiresIn: '1d',
  }
);

console.log(token);

const decoded = jwt.verify(token, process.env.AUTH_SECRET);

console.log(decoded.id);
