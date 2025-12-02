export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};
export const OTP_VALIDITY_PERIOD = 10 * 60 * 1000; // 10 minutes en millisecondes
export const PASSWORD_RESET_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes en millisecondes
export const TOKEN_VALIDITY_PERIOD = 7 * 24 * 60 * 60 * 1000; // 7 jours en millisecondes
export const ADMIN_TOKEN_VALIDITY_PERIOD = 24 * 60 * 60 * 1000; // 1 jour en millisecondes
export const APP_NAME = "Infactor App";
export const APP_URL = "http://localhost:3000";
