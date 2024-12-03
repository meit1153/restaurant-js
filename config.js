module.exports = {
    PORT: process.env.PORT || 3001,
    db: {
        user: process.env.DB_USER || 'meit',
        host: process.env.DB_HOST || 'host.docker.internal',
        database: process.env.DB_NAME || 'restaurant',
        password: process.env.DB_USER_PASSWORD || 'meit@1991',
        port: 5432,
    },
    TOKEN_SECRET: process.env.TOKEN_SECRET || 'asfdniaudoqnkdkds#7673j2rokjndaskjfb@'
}