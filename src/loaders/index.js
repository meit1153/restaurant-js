const postgres = require("./postgres");
const serviceLoadder = require('./service');

module.exports = {
        run: () => {
            return new Promise(async (resolve) => {
                pgClient = await postgres.getConnection();
                const service = serviceLoadder.init({ postgres: pgClient });

                resolve({ service });
            });
        },
};