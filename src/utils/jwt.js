const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../../config');

const generateAccessToken = (email) => {
    return jwt.sign(email, TOKEN_SECRET, {});
}

const authenticationToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

module.exports = {
    generateAccessToken,
    authenticationToken
}