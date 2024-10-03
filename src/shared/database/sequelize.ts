import { Sequelize } from 'sequelize';
import tedious from 'tedious'; 

import config from '#config';

const sequelize = new Sequelize(config.DB_DATABASE, config.DB_USER, config.DB_PASSWORD, {
    host: config.DB_SERVER,
    dialect: 'mssql',
    dialectModule: tedious,
    logging: !config.IS_PROD,
    timezone: "+07:00",
    define: {
        freezeTableName: true,
        timestamps: false,
    },
});

export default sequelize;
