export enum ErrorMessage {
  notRegistered = 'User not registered!',
  wrongCredentials = 'Wrong username or password!',
  logoutError = 'Unable to logout!',
  userNotFound = 'User not found!',
  keyNotUpdated = 'API key not updated!',
  invalidKey = 'Invalid API key!',
  invalidToken = 'Invalid token!',
  internalError = 'Internal server error!',
  unsavedData = 'Unable to save data!',
  invalidFormat = 'Invalid request format!',
  tooManyRequests = 'Too many requests, please try again later.',
  usernameTaken = 'This username is already taken',
  existingUser = 'User with this email already exists',
  data_not_found = 'Data not found!',
}

export enum ErrorStatus {
  notRegistered = 400,
  wrongCredentials = 401,
  logoutError = 500,
  userNotFound = 404,
  keyNotUpdated = 500,
  invalidKey = 403,
  invalidToken = 401,
  internalError = 500,
  unsavedData = 500,
  invalidFormat = 400,
  tooManyRequests = 429,
  usernameTaken = 409,
  existingUser = 409,
  data_not_found = 404,
}

export type ErrorMessageKey = keyof typeof ErrorMessage;
