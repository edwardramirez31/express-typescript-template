import { IS_DEVELOPMENT_ENV } from '../constants/index';
import { ErrorMiddlewareHandler } from '../types/api';

const errorMiddleware: ErrorMiddlewareHandler = (err, _req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  if (IS_DEVELOPMENT_ENV) {
    res.status(status).json({ status, message, stack: err.stack });
  } else {
    res.status(status).json({ status, message });
  }
  next();
};

export default errorMiddleware;
