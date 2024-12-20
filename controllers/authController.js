const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signup = async (req, res ) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send('Username and password are required.');
  try {
    let user = await User.findOne({ where: { username } });
    if (user) return res.status(400).send('User already exists.');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = await User.create({ username, password: hashedPassword });
    res.status(201).send( 'User created.' );
  } catch (error) {
    res.status(400).send(error);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username and password are required.');
  }
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).send('Invalid username or password.');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send('Invalid username or password.');
    }
    const accessToken = jwt.sign(
      { _id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' } 
    );
    res.status(200).send({accessToken});
  } catch (error) {
    res.status(500).send({ error: 'An error occurred during login.' });
  }
};

const logout = (req, res) => {
  res.status(200).send('User logged out.');
};

module.exports = { signup, login, logout };