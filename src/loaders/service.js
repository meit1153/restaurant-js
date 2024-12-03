const { userLogin } = require('../services/auth');

module.exports = {
    init: ({ postgres }) => {
        return userLogin;
    }
}