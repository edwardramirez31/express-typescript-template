import jwt, { TokenExpiredError } from 'jsonwebtoken';
import secret from '../constants';
import { MiddlewareHandler } from '../types/api';
import User from '../models/user';

const authMiddleware: MiddlewareHandler = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    // check bearer is present
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.split(' ')[1];
      const decoded = jwt.verify(token, secret);
      const id = typeof decoded === 'string' ? decoded : decoded.id;
      // get user
      const user = await User.findById(id).select('-password');
      if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
      }
      req.user = user;
      return next();
    }
    return res.status(401).json({ message: 'token not present' });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);

    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ message: 'token has expired' });
    }
    return res.status(401).json({ message: 'unauthorized' });
  }
};

export default authMiddleware;
