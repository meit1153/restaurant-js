const { Pool } = require('pg');
const config = require('../../config');
const { prependOnceListener } = require('../app');

module.exports = {
    getConnection: async () => {
        try{
            const pool = new Pool(config.db);
            pool.on('error', (err) => {
                console.error(`Some error occurred on PG = $(1)`, err)
            });

            return pool;
        } catch (e) {
            console.error(`Could not initialize postgres connection: $(1)`,e);
            return null;
        }
    },
};