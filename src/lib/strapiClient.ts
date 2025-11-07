import { strapi } from '@strapi/client';

const baseURL = 'https://emprinte-be.onrender.com/api';

const authToken = process.env.STRAPI_API_TOKEN;

const config = authToken ? { baseURL, auth: authToken } : { baseURL };

export const strapiClient = strapi(config);
