import dotenv from 'dotenv';

dotenv.config();

export interface EnvVariables {
  port: number | string;
  ACCESS_TOKEN_SECRET: string;
  SESSION_SECRET: string;
  WEBSITE_URL: string;
  DOMAIN: string;
  mongoConnection: string;
  DEFAULT_PAGINATION_NUMBER: string;
  STRIPE_PUBLISHABLE_KEY: string;
  STRIPE_SECRET_KEY: string;
}
const env: EnvVariables = {
  port: process.env.PORT ?? 8080,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  SESSION_SECRET: process.env.SESSION_SECRET as string,
  DOMAIN: process.env.DOMAIN as string,
  WEBSITE_URL: process.env.WEBSITE_URL as string,
  mongoConnection: process.env.MONGO_CONNECTION as string,
  DEFAULT_PAGINATION_NUMBER: process.env.DEFAULT_PAGINATION_NUMBER as string,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY as string,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
};

export default env;
