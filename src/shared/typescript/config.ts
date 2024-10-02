export enum E_Environment {
  PRODUCTION = 'PRODUCTION',
  STAGING = 'STAGING',
  DEVELOPMENT = 'DEVELOPMENT',
}

export interface I_SessionConfig {
  COLLECTION_NAME: string;
  SECRET: string;
  MAX_AGE: number;
  TTL: number;
}

export interface I_Config {
  IS_DEV: boolean;
  IS_STAG: boolean;
  IS_PROD: boolean;
  getCurrentEnvironment: () => E_Environment;
  BODY_PARSER_LIMIT: string;
  SESSION: I_SessionConfig;
  SECRET: string;
  UPLOAD_FOLDER: string;
  CORS_WHITELIST: string[];
  HOST_NAME: string;
  PORT: number;
  RESTAPI_ENDPOINT: string;
  GRAPHQL_ENDPOINT: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_SERVER: string;
  DB_DATABASE: string;
}
