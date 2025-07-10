const express = require("express");
const pool = require("../config");
const Joi = require('joi')
const bcrypt = require('bcrypt')
const { isLoggedIn } = require('../middlewares')

router = express.Router();


    

router.get("/queue", isLoggedIn, async function (req, res, next) {
    try {
        // waiting items
        const promise1 = pool.query(`
            SELECT qi.queue_id, q.user_id, q.shop_id, qi.product_id, qi.quantity,
                   p.name, p.picture, p.price
            FROM queues q
            JOIN queue_items qi ON q.id = qi.queue_id
            JOIN products p ON qi.product_id = p.id
            WHERE q.user_id = ? AND q.status = 'waiting'
        `, [req.user.id]);

        // waiting queues summary
        const promise2 = pool.query(`
            SELECT q.id, s.name, SUM(p.price * qi.quantity) AS totalprice,
                   DATE_FORMAT(q.datetime, '%Y-%m-%d') AS date,
                   DATE_FORMAT(q.datetime, '%H:%i:%s') AS time
            FROM queues q
            JOIN shops s ON s.id = q.shop_id
            JOIN queue_items qi ON q.id = qi.queue_id
            JOIN products p ON qi.product_id = p.id
            WHERE q.user_id = ? AND q.status = 'waiting'
            GROUP BY q.id
        `, [req.user.id]);

        // finished items
        const promise3 = pool.query(`
            SELECT qi.queue_id, q.user_id, q.shop_id, qi.product_id, qi.quantity,
                   p.name, p.picture, p.price
            FROM queues q
            JOIN queue_items qi ON q.id = qi.queue_id
            JOIN products p ON qi.product_id = p.id
            WHERE q.user_id = ? AND q.status = 'finish'
        `, [req.user.id]);

        // finished queues summary
        const promise4 = pool.query(`
            SELECT q.id, s.name AS shop_name, SUM(p.price * qi.quantity) AS totalprice,
                   DATE_FORMAT(q.datetime, '%Y-%m-%d') AS date,
                   DATE_FORMAT(q.datetime, '%H:%i:%s') AS time
            FROM queues q
            JOIN shops s ON s.id = q.shop_id
            JOIN queue_items qi ON q.id = qi.queue_id
            JOIN products p ON qi.product_id = p.id
            WHERE q.user_id = ? AND q.status = 'finish'
            GROUP BY q.id
        `, [req.user.id]);

        const results = await Promise.all([promise1, promise2, promise3, promise4]);

        const [queueitems] = results[0];
        const [queues] = results[1];
        const [queueitemsfinish] = results[2];
        const [queuesfinish] = results[3];

        res.json({
            queueitems,
            queues,
            queueitemsfinish,
            queuesfinish,
            error: null,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.toString() });
    }
});

router.post("/addqueue/:cartId", isLoggedIn, async function (req, res, next) {
    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try {
        
        const [rowscartItem, cartitemfields] = await conn.query(
            "SELECT * FROM cart_items JOIN products ON(products.id = cart_items.product_id)where cart_id = ?", [req.params.cartId]
        )

        const [queues, queuefields] = await conn.query(
            `INSERT INTO queues(status, user_id, datetime, shop_id) VALUES ('waiting',?,CURRENT_TIMESTAMP,?)`,
            [req.user.id, rowscartItem[0].shop_id]
        )
        for (let i = 0; i < rowscartItem.length; i++) {
            const data = rowscartItem[i];
            await conn.query(
                'INSERT INTO queue_items(queue_id, product_id, quantity) VALUES (?,?,?)',
                [queues.insertId, data.product_id, data.quantity]
            )
        }

        //  ลบของในตะกร้าที่อยู่ในตะกร้านั้น
        await conn.query(
            "DELETE FROM cart_items where cart_id =? ", [req.params.cartId]
        )
        //    ลบตะกร้า
        await conn.query(
            "DELETE FROM carts where carts.id =? ", [req.params.cartId]
        )

        await conn.commit()
        res.json(queues.insertId);
    } catch (err) {
        await conn.rollback();
        next(err);
    } finally {
        console.log('finally')
        conn.release();
    }
});


exports.router = router