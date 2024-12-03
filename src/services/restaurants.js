const pool = require('../loaders/postgres');
const { HTTP_STATUS_CODES } = require('../../contants');
const jwt = require('../utils/jwt');
const { db } = require('../../config');

const searchRestaurant = async (req, res, next) => {
    var rest = {}

    search_param = req.query.rest ? `%${req.query.rest}%` : null;
    if (search_param){
        try{
            db = await pool.getConnection();

            const {rowCount, rows} = await db.query('SELECT DISTINCT \
                                r.id AS restaurant_id, \
                                r.name AS restaurant_name, \
                                r.phone_number, \
                                r.type AS restaurant_type, \
                                r.description AS restaurant_description, \
                                r.dollar_signs, \
                                r.pickup_enabled, \
                                r.delivery_enabled, \
                                r.is_open, \
                                r.weighted_rating_value, \
                                r.aggregated_rating_count \
                            FROM \
                                restaurants r \
                            LEFT JOIN \
                                menus m \
                            ON \
                                r.id = m.restaurant_id \
                            LEFT JOIN \
                                menu_items mi \
                            ON \
                                m.id = mi.menu_id \
                            WHERE \
                                r.name ILIKE $1 \
                                OR mi.name ILIKE $1;', [`%${search_param}%`]);
            
            if ( rowCount === 0 ){
                return res.status(HTTP_STATUS_CODES['SUCCESS']).send( {message: 'No restaurant found'});
            }
            return res.status(HTTP_STATUS_CODES['SUCCESS']).send({message: 'Restaurant Found', body: rows});
        
        } catch (err) {
            return next(err);
        }
    } else {
        db = await pool.getConnection()
        const {rowCount, rows} = await db.query('SELECT DISTINCT \
                            r.id AS restaurant_id, \
                            r.name AS restaurant_name, \
                            r.phone_number, \
                            r.type AS restaurant_type, \
                            r.description AS restaurant_description, \
                            r.dollar_signs, \
                            r.pickup_enabled, \
                            r.delivery_enabled, \
                            r.is_open, \
                            r.weighted_rating_value, \
                            r.aggregated_rating_count \
                        FROM \
                            restaurants r')
        return res.status(HTTP_STATUS_CODES['SUCCESS']).send({message: 'Restaurant Found', body: rows})
    }
};


const menuRestaurant = async (req, res, next) => {
    restaurant_id = req.query.uuid ? `${req.query.uuid}` : null;
    if (restaurant_id){
        try{
            db = await pool.getConnection();

            const {rowCount, rows} = await db.query('SELECT \
                            mi.id AS menu_item_id, \
                            mi.name AS menu_item_name, \
                            mi.price AS menu_item_price, \
                            mi.description AS menu_item_description, \
                            mi.is_available, \
                            mi.created_at, \
                            mi.updated_at \
                        FROM \
                            menu_items mi \
                        INNER JOIN \
                            menus m \
                        ON \
                            mi.menu_id = m.id \
                        INNER JOIN \
                            restaurants r \
                        ON \
                            m.restaurant_id = r.id \
                        WHERE \
                            r.id = $1;', [restaurant_id]);
            if ( rowCount === 0 ){
                return res.status(HTTP_STATUS_CODES['SUCCESS']).send( {message: 'No menu found'});
            }
            return res.status(HTTP_STATUS_CODES['SUCCESS']).send({message: 'Menu Found', body:rows});
        } catch(err){
            return next(err);
        }

    } else {
        res.status(HTTP_STATUS_CODES['BAD_REQUEST']).send({error: 'Restaurant is not selected'});
    }
};


const addToCart = async (req, res, next) => {
    const { items } = req.body; // Expecting an array of items: [{ menu_item_id, quantity, price }]
    
    if (!req.user) {
        return res
            .status(HTTP_STATUS_CODES['UNAUTHORIZE'])
            .send({ error: "User not authenticated" });
    }

    const user_id = req.user?.user_id;

    if (!Array.isArray(items) || items.length === 0) {
        return res
            .status(HTTP_STATUS_CODES['BAD_REQUEST'])
            .send({ error: 'Missing or invalid items array' });
    }

    try {
        const db = await pool.getConnection();
        await db.query('BEGIN');

        // Insert or find the cart for the user
        const cartResult = await db.query(
            `INSERT INTO cart (user_id)
             VALUES ($1)
             ON CONFLICT (user_id) DO UPDATE SET user_id = $1
             RETURNING id AS cart_id;`,
            [user_id]
        );

        const cart_id = cartResult.rows[0].cart_id;

        // Build the query to add all items
        const values = [];
        const placeholders = items
            .map((item, index) => {
                const { menu_item_id, quantity, price } = item;
                const totalPrice = quantity * price;
                values.push(cart_id, menu_item_id, quantity, totalPrice);
                const offset = index * 4;
                return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`;
            })
            .join(',');

        const combinedQuery = `
            INSERT INTO cart_items (cart_id, menu_item_id, quantity, price)
            VALUES ${placeholders};
        `;

        // Execute the query
        await db.query(combinedQuery, values);

        await db.query('COMMIT');
        res.status(HTTP_STATUS_CODES['CREATED']).send({ message: "Items added to cart successfully" });
    } catch (err) {
        console.log(err);
        const db = await pool.getConnection();
        await db.query('ROLLBACK');
        console.error("Error adding to cart:", err);
        next(err);
    }
};


const getCartDetails = async (req, res, next) => {
    if (!req.user) {
        return res.status(HTTP_STATUS_CODES['UNAUTHORIZED']).send({ error: "User not authenticated" });
    }

    const user_id = req.user?.user_id;

    try {
        const db = await pool.getConnection();

        const query = `
            SELECT 
                ci.menu_item_id,
                ci.quantity,
                ci.price
            FROM 
                cart c
            INNER JOIN 
                cart_items ci ON c.id = ci.cart_id
            WHERE 
                c.user_id = $1;
        `;

        const { rows } = await db.query(query, [user_id]);

        // Calculate total amount
        const total_amount = rows.reduce((sum, item) => 
            sum + (parseFloat(item.price)), 
        0);

        const tax = total_amount * 0.18;
        const total_with_tax = total_amount + tax;

        // Format the result as requested
        const result = {
            items: rows.map(row => ({
                menu_item_id: row.menu_item_id,
                quantity: row.quantity,
                price: row.price,
            })),
            total_amount: parseFloat(total_amount.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            grand_total: parseFloat(total_with_tax.toFixed(2))

        };

        return res.status(HTTP_STATUS_CODES['SUCCESS']).send(result);
    } catch (err) {
        console.error("Error fetching cart details:", err);
        return next(err);
    }
};



module.exports = {
    searchRestaurant,
    menuRestaurant,
    addToCart,
    getCartDetails
}