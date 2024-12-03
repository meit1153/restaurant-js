const express = require('express');
const loaders = require('./loaders');
const restaurantRoutes = require('./routes');

const app = express();

loaders
    .run()
    .then(({ service }) => {
        app.use(express.urlencoded({limit: '5mb', extended: true }));
        app.use(express.json({ limit: '5mb' }));

        app.get('/', (req, res) => {
            res.json({status: true});
        });

        app.use('/restaurant', restaurantRoutes)

        process.on('uncaughtException', (err) => {
            console.error(`uncaughtException error: $1`, err)
            process.exit(1);
        });

        process.on('unhandledRejection', (err) => {
            console.error(`uncaughtRejection error: $1`, err);
            process.exit(1);
        });
    })
    .catch((err) => {
        console.error(`Could not initialize server: $(1)`, err);
        process.exit(1);
    });

    module.exports = app;