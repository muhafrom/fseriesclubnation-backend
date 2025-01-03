require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.EMAIL_PASSWORD 
  }
});

const signup = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).send({error: { messeage: 'Username, password, and email are required.'}});
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send({error: { messeage: 'Invalid email format.'}});
  }
  
  try {
    let user = await User.findOne({ where: { username } });
    if (user) return res.status(400).send({error: { messeage: 'Username is already taken.'}});

    user = await User.findOne({ where: { email } });
    if (user) return res.status(400).send({error: { messeage: 'Email is already registered.'}});
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user = await User.create({ username, password: hashedPassword, email });

    const mailOptions = {
      from: `"${process.env.APP_NAME}" <${process.env.EMAIL}>`,
      to: email,
      subject: `Welcome to ${process.env.APP_NAME}!`,
      text: process.env.WELCOME_MESSAGE
      .replace('{{username}}', username)
      .replace('{{APP_NAME}}', process.env.APP_NAME)
      .replace('{{APP_NAME}}', process.env.APP_NAME),
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
      }
      console.log('Email sent.');
      res.status(201).send({success: { messeage: 'User created.'}});
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send({error: { messeage: 'An error occurred. Please try again.'}});
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({error: { messeage: 'Invalid username or password.'} });
  }
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).send({error: { messeage: 'Invalid username or password.'} });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({error: { messeage: 'Invalid username or password.'} });
    }
    
    const accessToken = jwt.sign(
      { _id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '31d' }
    );
    res.status(200).send({ accessToken });
  } catch (error) {
    res.status(500).send({error: { messeage: 'An error occurred. Please try again.'} });
  }
};

const logout = (req, res) => {
  res.status(200).send({success: { messeage: 'User logged out.'} });
};

module.exports = { signup, login, logout };