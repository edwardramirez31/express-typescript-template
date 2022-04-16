import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import secret, { TOKEN_EXPIRATION, TOKEN_REFRESH_EXPIRATION } from '../constants';
import User from '../models/user';
import Handler from '../types/api';
import RefreshToken from '../models/refreshToken';

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ id: userId }, secret, { expiresIn: TOKEN_EXPIRATION });
  const refreshToken = crypto.randomBytes(40).toString('hex');
  return { accessToken, refreshToken };
};

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
    const { accessToken, refreshToken } = generateTokens(newUser._id);
    // save refresh token
    RefreshToken.create({
      user: newUser._id,
      token: refreshToken,
      expires: Date.now() + TOKEN_REFRESH_EXPIRATION * 1000,
    });

    return res.status(201).json({
      email: newUser.email,
      id: newUser._id,
      fullName: newUser.fullName,
      accessToken,
      refreshToken,
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
  const { accessToken, refreshToken } = generateTokens(user._id);

  // save refresh token
  RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expires: Date.now() + TOKEN_REFRESH_EXPIRATION * 1000,
  });

  return res.status(200).json({
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    accessToken,
    refreshToken,
  });
};

export const refreshTokenHandler: Handler = async (req, res) => {
  const {
    body: { token },
  } = req;

  if (!token) {
    return res.status(400).json({ message: 'token not sent' });
  }

  const refresh = await RefreshToken.findOne({ token });

  if (!refresh) {
    return res.status(400).json({ message: 'token does not exist' });
  }
  if (refresh.isExpired) {
    return res.status(403).json({
      message: 'Refresh token was expired. Please make a new login request',
    });
  }

  const { accessToken, refreshToken } = generateTokens(refresh.user.toString());
  // save refresh token
  RefreshToken.create({
    user: refresh.user.toString(),
    token: refreshToken,
    expires: Date.now() + TOKEN_REFRESH_EXPIRATION * 1000,
  });
  // remove old token
  await refresh.remove();
  return res.status(200).json({
    accessToken,
    refreshToken,
  });
};

export const logout: Handler = async (req, res) => {
  const { token } = req.body;
  const refresh = await RefreshToken.findOne({ token });
  if (!refresh) {
    return res.status(400).json({ message: 'token does not exist' });
  }
  await refresh.remove();
  return res.status(200).json({ message: 'logged out' });
};
