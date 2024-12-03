const pool = require('../loaders/postgres');
const { HTTP_STATUS_CODES } = require('../../contants');
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt')

const userLogin = async (req, res, next) => {
    var user = {}, pass_from_db, user_id;

    user.email = req.body.email;
    user.password = req.body.password;

    if (user.email){
        try{
            db = await pool.getConnection()
            // console.log(db)
            const {rowCount, rows} = await db.query('Select password, id From "users" where email = $1;', [user.email]);
            if ( rowCount === 0 ) {
                return res.status(HTTP_STATUS_CODES['BAD_REQUEST']).send( {error: 'User not found'});
            }
            pass_from_db = rows[0].password;
            user_id = rows[0].id;
            bcrypt.compare(user.password, pass_from_db, (err, result) =>{
                if (result) {
                    const token = jwt.generateAccessToken({email: user.email, user_id: user_id});
                    res.status(200).send({ message: 'Authenticated successfully', token: token});
                } else {
                    res.status(401).send({ error: 'Wrong password'});
                }
            });
        } catch(err) {
            return next(err);
        }
    } else {
        res.status(HTTP_STATUS_CODES['BAD_REQUEST']).send({error: 'email not specified'})
    }
};

const userCreate = async (req, res, next) => {
    var user = {}, encrypt_pass;
    const saltRounds = 10;
    user.email = req.body.email;
    user.password = req.body.password;
    user.type = req.body.user_type;
    is_active = req.body.is_active;
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.phone_no = req.body.phone;

    if (user.email && user.password && user.type && user.first_name && user.last_name){
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        try{
            db = await pool.getConnection()
            const response = await db.query('WITH inserted_user AS ( INSERT INTO "users" (email, password, user_type, is_active) \
                        VALUES ($1, $2, $3, TRUE) RETURNING id) INSERT INTO "user_profiles" \
                        (first_name, last_name, user_id, phone_number) \
                        VALUES ($4, $5, (SELECT id FROM inserted_user), $6);', [user.email, hashedPassword, user.type, user.first_name, user.last_name, user.phone_no])
            res.json({
                message: 'User created successfully',

            });
        } catch(err){
            return next(err);
        }

    } else {
        res.status(HTTP_STATUS_CODES['BAD_REQUEST']).send({error: 'Please fill all user information'})

    }
};

module.exports = {
    userLogin,
    userCreate
}


