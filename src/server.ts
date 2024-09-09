import express from 'express';
import session, { SessionOptions } from 'express-session';
import cors from 'cors';
import compression from 'compression';
import device from 'express-device';
import { createServer } from 'http';
import notifier from 'node-notifier';

import config from '#config';
import sequelize from '#shared/database';
import { rootRouter } from './rootRouter';

(async () => {
    const app = express();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json({ limit: config.BODY_PARSER_LIMIT }));
    app.use(compression());
    app.use(express.static(config.UPLOAD_FOLDER));
    app.use(device.capture());

    const sessionOptions: SessionOptions = {
        secret: config.SESSION.SECRET,
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
        rootRouter,
    );

    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error('Error:', err);

        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({
            message: err.message,
            ...(config.IS_DEV && err)
        });
    });

    const httpServer = createServer(app);

    // Connect to SQL Server using Sequelize
    // Chỉ để true khi chạy lần đầu để tạo bảng
    sequelize.sync({ alter: true })
        .then(() => {
            console.log('🚀🚀 Connected Connected to the database successfully 🚀🚀');
            httpServer.listen(config.PORT, () => {
                notifier.notify({
                    title: 'Success',
                    message: 'Server started!',
                });

                console.info(`🚀🚀 Running RestAPI on http://${config.HOST_NAME}:${config.PORT}${config.RESTAPI_ENDPOINT} 🚀🚀`);
            });
        })
        .catch((err) => {
            console.error('Unable to connect to the database:', err);
        });


    process.on('SIGINT', async () => {
        console.info('Gracefully shutting down server...');
        await sequelize.close();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        console.info('Gracefully shutting down server...');
        await sequelize.close();
        process.exit(0);
    });
})();
