import dotenv from 'dotenv';

import { E_Environment, I_Config } from '#shared/typescript';

dotenv.config();

const requiredEnv = (key: string, allowEmpty: boolean = false): string => {
    const value = process.env[key];
    if (!value && !allowEmpty) {
        throw new Error(`Environment variable ${key} is required`);
    }
    return value || '';
};

const requiredIntEnv = (key: string): number => {
    const value = requiredEnv(key);
    const intValue = parseInt(value);
    if (isNaN(intValue)) {
        throw new Error(`Environment variable ${key} must be a valid number`);
    }
    return intValue;
};

const isProdEnv = process.env.NODE_ENV === 'production';
const isStagingEnv = isProdEnv && process.env.ENV === 'staging';
const isProd = isProdEnv && process.env.ENV === 'production';
const isDev = !isProdEnv;

const config: I_Config = {
    IS_DEV: isDev,
    IS_STAG: isStagingEnv,
    IS_PROD: isProd,
    getCurrentEnvironment: () =>
        isProd ? E_Environment.PRODUCTION : isStagingEnv ? E_Environment.STAGING : E_Environment.DEVELOPMENT,
    BODY_PARSER_LIMIT: requiredEnv('BODY_PARSER_LIMIT'),
    SESSION: {
        COLLECTION_NAME: requiredEnv('SESSION_COLLECTION_NAME'),
        SECRET: requiredEnv('SESSION_SECRET'),
        MAX_AGE: requiredIntEnv('SESSION_MAX_AGE'),
        TTL: requiredIntEnv('SESSION_TTL'),
    },
    SECRET: requiredEnv('SECRET'),
    UPLOAD_FOLDER: requiredEnv('UPLOAD_FOLDER'),
    CORS_WHITELIST: requiredEnv('CORS_WHITELIST').split(','),
    HOST_NAME: requiredEnv('HOST_NAME'),
    PORT: requiredIntEnv('PORT'),
    RESTAPI_ENDPOINT: requiredEnv('RESTAPI_ENDPOINT'),
    DB_USER: requiredEnv('DB_USER'),
    DB_PASSWORD: requiredEnv('DB_PASSWORD'),
    DB_SERVER: requiredEnv('DB_SERVER'),
    DB_DATABASE: requiredEnv('DB_DATABASE'),
};

export default config;
