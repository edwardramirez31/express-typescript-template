const secret = process.env.JWT_SECRET || 'jsvknakln';

export const TOKEN_EXPIRATION = 3600;

export const TOKEN_REFRESH_EXPIRATION = 86400;

export default secret;
