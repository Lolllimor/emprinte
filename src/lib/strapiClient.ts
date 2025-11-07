import { strapi } from '@strapi/client';

const baseURL = 'http://localhost:1337/api';

const authToken = process.env.STRAPI_API_TOKEN;

const config = authToken ? { baseURL, auth: authToken } : { baseURL };

export const strapiClient = strapi(config);
