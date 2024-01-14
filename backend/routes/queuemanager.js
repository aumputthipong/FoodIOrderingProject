const express = require("express");
const pool = require("../config");
const Joi = require('joi')
const bcrypt = require('bcrypt')
const { isLoggedIn } = require('../middlewares')

router = express.Router();


router.get("/queuemanage", isLoggedIn, async function (req, res, next) {

    // SELECT ข้อมูล
    const promise1 = pool.query(`Select queues.id,queues.status,first_name
    ,mobile,user_id,queues.shop_id, SUM(price*quantity) AS totalprice
    ,DATE_FORMAT(datetime, '%Y-%m-%d') AS date
    ,DATE_FORMAT(datetime, '%H:%i:%s') AS time
    From queues JOIN users on(users.id = queues.user_id)
    JOIN queue_items ON(queues.id=queue_items.queue_id)
    JOIN products ON(products.id=queue_items.product_id)
    WHERE queues.shop_id = (SELECT id from shops  
        where create_by_id  =?) AND queues.status = 'waiting'
          GROUP BY queues.id
        order by time asc;`, [
        req.user.id,
    ]);

    const promise2 = pool.query(`SELECT *,queue_items.id as queueitem_id FROM queue_items JOIN products ON (products.id = queue_items.product_id)
    JOIN queues ON(queues.id = queue_items.queue_id)
    WHERE queues.shop_id = (SELECT id from shops  
            where create_by_id  =?) AND queues.status = 'waiting'
    `, [
        req.user.id,
    ]);

    const promise3 = pool.query(`Select queues.id,queues.status,first_name
    ,mobile,user_id,queues.shop_id, SUM(price*quantity) AS totalprice
    ,DATE_FORMAT(datetime, '%Y-%m-%d') AS date
    ,DATE_FORMAT(datetime, '%H:%i:%s') AS time
    From queues JOIN users on(users.id = queues.user_id)
    JOIN queue_items ON(queues.id=queue_items.queue_id)
    JOIN products ON(products.id=queue_items.product_id)
    WHERE queues.shop_id = (SELECT id from shops  
        where create_by_id  =?) AND queues.status = 'finish'
          GROUP BY queues.id
        order by time asc;`, [
        req.user.id,
    ]);

    const promise4 = pool.query(`SELECT * FROM queue_items JOIN products ON (products.id = queue_items.product_id)
    JOIN queues ON(queues.id = queue_items.queue_id)
    WHERE queues.shop_id = (SELECT id from shops  
            where create_by_id  =?) AND queues.status = 'finish'
    `, [
        req.user.id,
    ]);
    // Use Promise.all() to make sure that all queries are successful
    Promise.all([promise1, promise2, promise3, promise4])
        .then((results) => {
            const [queues, blogFields] = results[0];
            const [queueitems, itemFields] = results[1];
            const [queuesfinish, qFields] = results[2];
            const [queueitemsfinish, qiFields] = results[3];
            res.json({
                queues: queues,
                queueitems: queueitems,
                queuesfinish: queuesfinish,
                queueitemsfinish: queueitemsfinish,
                error: null,
            });
        })
        .catch((err) => {
            return res.status(500).json(err);
        });
    });
    
    

router.put("/updatestatus/:queueId", isLoggedIn, async function (req, res, next) {
    const queue = req.body.queue;

    const conn = await pool.getConnection()
    await conn.beginTransaction()
        
    try {
        await conn.query(
            "UPDATE queues SET queues.status = ? WHERE id = ?", [queue.status, req.params.queueId]
        )
        await conn.commit()
        res.redirect('/')
    } catch (err) {
        await conn.rollback();
        next(err);
    } finally {
        console.log('finally')
        conn.release();
    }
});


router.put("/updateitemstatus/:queueitemId", isLoggedIn, async function (req, res, next) {
    const queueItemId = req.params.queueitemId;

    const conn = await pool.getConnection();
    await conn.beginTransaction();
    
    try {
        const [rows] = await conn.query("SELECT id, `check` FROM queue_items WHERE id = ?", [queueItemId]);

        if (rows.length > 0) {
            const currentCheckStatus = rows[0].check;
            const newCheckStatus = currentCheckStatus === 0 ? 1 : 0;

            await conn.query("UPDATE queue_items SET `check` = ? WHERE id = ?", [newCheckStatus, queueItemId]);
            await conn.commit();
            
            res.json(newCheckStatus);
        } else {
            res.status(404).json({ error: "Queue item not found" });
        }
        await conn.commit()
        res.json(rows[0].check)
    } catch (err) {
        await conn.rollback();
        next(err);
    } finally {
        console.log('finally')
        conn.release();
    }
});


exports.router = router