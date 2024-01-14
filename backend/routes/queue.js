const express = require("express");
const pool = require("../config");
const Joi = require('joi')
const bcrypt = require('bcrypt')
const { isLoggedIn } = require('../middlewares')

router = express.Router();


    

router.get("/queue", isLoggedIn, async function (req, res, next) {
    // q ที่waiting
    const promise1 = pool.query(`SELECT queue_items.queue_id, user_id,  
    queues.shop_id, queue_items.product_id, quantity 
    ,products.name,products.picture,products.price
    FROM queues JOIN queue_items ON(queues.id = queue_id) 
    JOIN products ON(queue_items.product_id = products.id)
    WHERE user_id=? and queues.status = 'waiting'`, [
        req.user.id,
    ]);
    const promise2 = pool.query(`SELECT queues.id, shops.name,  SUM(product_id*quantity)AS totalprice,
    DATE_FORMAT(datetime, '%Y-%m-%d') AS date,
    DATE_FORMAT(datetime, '%H:%i:%s') AS time
    FROM queues JOIN shops On(shops.id = queues.shop_id) JOIN queue_items ON (queues.id = queue_items.queue_id)
    WHERE user_id=? and status = 'waiting'
    group by queues.id`, [
        req.user.id,
    ]);
    // itemเสร็จ
    const promise3 = pool.query(`SELECT queue_items.queue_id, user_id,  
    queues.shop_id, queue_items.product_id, quantity 
    ,products.name,products.picture,products.price
    FROM queues JOIN queue_items ON(queues.id = queue_id) 
    JOIN products ON(queue_items.product_id = products.id)
    WHERE user_id=? and queues.status = 'finish'`, [
        req.user.id,
    ]);
    const promise4 = pool.query(`SELECT queues.id,shops.name AS shop_name,  SUM(product_id*quantity)AS totalprice,
    DATE_FORMAT(datetime, '%Y-%m-%d') AS date,
    DATE_FORMAT(datetime, '%H:%i:%s') AS time
    FROM queues JOIN shops On(shops.id = queues.shop_id) JOIN queue_items ON (queues.id = queue_items.queue_id)
    WHERE user_id=? and status = 'finish'
    group by queues.id`, [
        req.user.id,
    ]);
  
    // Use Promise.all() to make sure that all queries are successful
    Promise.all([promise1,promise2,promise3,promise4])
        .then((results) => {
            const [queueitems, blogFields] = results[0];
            const [queues, productFields] = results[1];
            const [queueitemsfinish, qifFields] = results[2];
            const [queuesfinish, qfFields] = results[3];
            res.json({
                queueitems: queueitems,
                queues: queues,
                queueitemsfinish: queueitemsfinish,
                queuesfinish: queuesfinish,
                error: null,
            });
        })
        .catch((err) => {
            return res.status(500).json(err);
        });
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