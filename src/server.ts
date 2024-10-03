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
import session, { SessionOptions } from 'express-session';
import passport from 'passport';
import { createServer } from 'http';
import notifier from 'node-notifier';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import config from '#config';
import schema from '#shared/graphql/schema';
import pubsub from '#shared/graphql/pubsub';
import sequelize from '#shared/database/sequelize';

(async () => {
    const app = express();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json({ limit: config.BODY_PARSER_LIMIT }));
    app.use(compression());

    const sessionOptions: SessionOptions = {
        secret: config.SESSION.SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: config.SESSION.MAX_AGE,
            secure: config.IS_PROD, 
            sameSite: 'lax',
        },
    };

    app.use(session(sessionOptions));
    app.use(passport.initialize());
    app.use(passport.session());

    const corsOptionsDelegate = {
        origin(requestOrigin, callback) {
            let newOrigin = config.CORS_WHITELIST.indexOf(requestOrigin) !== -1 || !requestOrigin;
            callback(null, { origin: newOrigin, credentials: true });
        },
        credentials: true,
    };

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

    const server = new ApolloServer({
        schema,
        plugins: [
            ...(config.getCurrentEnvironment() === 'PRODUCTION'
                ? [ApolloServerPluginLandingPageProductionDefault()]
                : [ApolloServerPluginLandingPageLocalDefault()]),
            ApolloServerPluginDrainHttpServer({ httpServer }),
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
        introspection: true,
        includeStacktraceInErrorResponses: true,
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
            console.log('🚀🚀 Connected Connected to the database successfully 🚀🚀');
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