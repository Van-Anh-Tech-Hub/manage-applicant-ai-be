import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import {
    ApolloServerPluginLandingPageLocalDefault,
    ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { json } from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import device from 'express-device';
import session, { SessionOptions } from 'express-session';
import { createServer } from 'http';
import notifier from 'node-notifier';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import connectSessionSequelize from 'connect-session-sequelize';

import config from '#config';
import schema from '#shared/graphql/schema';
import pubsub from '#shared/graphql/pubsub';
import sequelize from '#shared/database/sequelize';
import { mainRouter } from '#modules/rest-api';

(async () => {
    const app = express();
    const SequelizeStore = connectSessionSequelize(session.Store);
    const sessionStore = new SequelizeStore({
        db: sequelize,
    });

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json({ limit: config.BODY_PARSER_LIMIT }));
    app.use(compression());
    app.use(express.static(config.UPLOAD_FOLDER));
    app.use(device.capture());

    const sessionOptions: SessionOptions = {
        name: config.SESSION.NAME,
        secret: config.SESSION.SECRET,
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: config.SESSION.MAX_AGE,
        },
    };

    if (config.IS_STAG || config.IS_PROD) {
        app.set('trust proxy', 1); // trust first proxy

        if (sessionOptions.cookie) {
            sessionOptions.cookie.secure = true; // serve secure cookies
            sessionOptions.cookie.sameSite = 'none'; // For cross-site cookie handling
        }
    }

    app.use(session(sessionOptions));
    sessionStore.sync();

    const corsOptionsDelegate = {
        origin(requestOrigin, callback) {
            let newOrigin;

            if (!config.IS_PROD) {
                newOrigin = false;
            } else {
                if (config.CORS_WHITELIST.indexOf(requestOrigin) !== -1 || !requestOrigin) {
                    newOrigin = true;
                } else {
                    newOrigin = false;
                }
            }

            callback(null, { origin: newOrigin, credentials: true });
        },
        credentials: true,
    };

    app.use(
        config.RESTAPI_ENDPOINT,
        cors<cors.CorsRequest>(corsOptionsDelegate),
        // authCtr.checkAuthorizedRest,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        mainRouter,
    );

    const httpServer = createServer(app);

    // Create our WebSocket server using the HTTP server we just set up.
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: config.GRAPHQL_ENDPOINT,
    });

    const serverCleanup = useServer(
        {
            schema,
            context: () => ({ pubsub }),
        },
        wsServer,
    );

    // Set up ApolloServer.
    const server = new ApolloServer({
        schema,
        csrfPrevention: config.IS_DEV || config.IS_STAG ? false : true,
        // cache: config.IS_DEV ? 'bounded' : new KeyvAdapter(new Keyv('redis://localhost:6379')),
        cache: 'bounded',
        plugins: [
            ...(config.getCurrentEnvironment() === 'PRODUCTION'
                ? [ApolloServerPluginLandingPageProductionDefault()]
                : [ApolloServerPluginLandingPageLocalDefault()]),
            // Proper shutdown for the HTTP server.
            ApolloServerPluginDrainHttpServer({ httpServer }),
            // Proper shutdown for the WebSocket server.
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
        ...(config.IS_STAG
            ? {
                introspection: true,
                includeStacktraceInErrorResponses: true,
            }
            : config.IS_DEV
                ? {
                    introspection: true,
                    includeStacktraceInErrorResponses: true,
                }
                : {}),
    });

    await server.start();

    app.use(
        config.GRAPHQL_ENDPOINT,
        cors<cors.CorsRequest>(corsOptionsDelegate),
        json({ limit: config.BODY_PARSER_LIMIT }),
        expressMiddleware(server, {
            context: async ({ req }) => {
                return {
                    req,
                };
            },
        }),
    );

    sequelize.sync({ alter: false })
        .then(() => {
            console.log('🚀🚀 Connected to the database successfully 🚀🚀');
            httpServer.listen(config.PORT, () => {
                notifier.notify({
                    title: 'Success',
                    message: 'Server started!',
                });

                console.info(`🚀🚀 Running RestAPI on http://${config.HOST_NAME}:${config.PORT}${config.GRAPHQL_ENDPOINT} 🚀🚀`);
            });
        })
        .catch((err) => {
            console.error('Unable to connect to the database:', err);
        });

    process.on('SIGINT', async () => {
        await serverCleanup.dispose();
        console.info('Gracefully shutting down server...');
    });
})();
