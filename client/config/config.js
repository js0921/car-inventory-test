export const apiPath = 'api';

export const APP_HOST = process.env.APP_HOST || 'localhost';
export const APP_PORT = process.env.APP_PORT || 3000;
export const HOST = `${APP_HOST}:${APP_PORT}/`;

export const API_HOST = process.env.API_HOST || 'localhost';
export const API_PORT = process.env.API_PORT || 3000;
export const API_URL = `http://${API_HOST}:${API_PORT}/${apiPath}`;
export const JWT_TOKEN = 'token';