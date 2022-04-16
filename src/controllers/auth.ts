import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import secret from '../constants';
import User from '../models/user';
import Handler from '../types/api';

const generateToken = (userId: string) => jwt.sign({ id: userId }, secret, { expiresIn: '1d' });

export const register: Handler = async (req, res) => {
  const { email, fullName, password } = req.body;
  if (!email || !fullName || !password) {
    return res.status(400).json({ message: 'Bad data' });
  }
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const newUser = await User.create({ email, fullName, password: hashedPassword });

  if (newUser) {
    return res.status(201).json({
      email: newUser.email,
      id: newUser._id,
      fullName: newUser.fullName,
      token: generateToken(newUser._id),
    });
  }

  return res.status(400).json({ message: 'invalid user data' });
};

export const login: Handler = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User does not exist' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  return res.status(200).json({
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    token: generateToken(user._id),
  });
};
