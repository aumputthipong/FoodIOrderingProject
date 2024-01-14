const express = require("express");
const pool = require("../config");
const Joi = require('joi')
const bcrypt = require('bcrypt')
const { isLoggedIn } = require('../middlewares')

router = express.Router();

router.post("/updatecart/:shopId", isLoggedIn, async function (req, res, next) {
    const cart = req.body.cart;

    const conn = await pool.getConnection()
    await conn.beginTransaction()
    

    try {
        for (let i = 0; i < cart.length; i++) {
            const data = cart[i];

            // checkว่ามีของอยู่แล้วไหม
            const [rows1, fields1] = await conn.query(
                "SELECT * From cart_items JOIN carts ON(cart_items.cart_id = carts.id) where cart_items.product_id = ? and user_id = ?", [data.id, req.user.id]
            )
            // มีตะกร้าของร้านนี้ไหม
            const [rowscheckcart, fields3] = await conn.query(
                "SELECT * FROM carts  where user_id = ? and shop_id = ?", [req.user.id, req.params.shopId],
            )
            // ถ้าไม่มีก็สร้าง
            if (rowscheckcart.length === 0) {
                await conn.query(
                    'INSERT INTO carts(user_id,shop_id) VALUES (?,?)',
                    [req.user.id, req.params.shopId]
                )
            }
            // หาตะกร้าใบที่จะใส่
            const [rowsselectcart, fields4] = await conn.query(
                "SELECT * FROM carts  where user_id = ? and shop_id = ?", [req.user.id, req.params.shopId],
            )


            if (rows1.length === 0) {
                await conn.query(
                    "insert INTO cart_items (cart_id , product_id, quantity) VALUES(?, ?, ?)", [rowsselectcart[0].id, data.id, data.quantity]
                )
            }
            else {
                await conn.query(
                    "UPDATE cart_items SET quantity = ? WHERE product_id = ? AND cart_id = ?", [data.quantity, data.id, data.cart_id]
                )
            }
        }
        //   res.status(500).json(rowsselectcart)
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

    const StatusShopOwner = async (req, res, next) => {
        console.log(req.user.id)
        if (req.user.role === 'admin') {
               return next()
             }
         const [[shop]] = await pool.query('SELECT * FROM products JOIN shops on (products.shop_id= shops.id) where products.id = ?', [req.params.queueitemId])
       
         if (shop.create_by_id !== req.user.id) {
           return res.status(403).send('You do not have permission to perform this action')
         }
       
         next()
       }

// ลบของในตะกร้า
router.delete("/delete/:productId", isLoggedIn, async function (req, res, next) {

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try {
        const [rowsselectcart, fields2] = await conn.query(
            "SELECT * FROM cart_items JOIN carts ON (carts.id = cart_items.cart_id) where user_id = ? and product_id = ?", [req.user.id, req.params.productId]
        )
        console.log({ test: rowsselectcart })
        await pool.query(
            "DELETE FROM cart_items WHERE product_id = ? AND cart_id = ?",
            [req.params.productId, rowsselectcart[0].cart_id]
        );
        const [checkcartafterdelete, fields3] = await conn.query(
            "SELECT * FROM carts JOIN cart_items ON (carts.id = cart_items.cart_id) where user_id = ? AND cart_id = ?", [req.user.id, rowsselectcart[0].cart_id]
        )
        console.log({ checkcartafterdelete })
        if (checkcartafterdelete.length === 1) {
            await pool.query(
                "DELETE FROM carts WHERE id = ?",
                [rowsselectcart[0].cart_id]
            )
        }

        res.json("success");
        await conn.commit()
        res.redirect('/')
    } catch (err) {
        await conn.rollback();
        next(err);
    } finally {
        console.log('finally')
        conn.release();
    }
}
);


router.get("/shop/cart/:shopId", isLoggedIn, async function (req, res, next) {
    const promise1 = pool.query(`SELECT * FROM carts JOIN cart_items 
    ON (carts.id = cart_items.cart_id) JOIN products ON(cart_items.product_id = products.id)
    WHERE user_id = ? and products.shop_id= ?;`, [
        req.user.id, req.params.shopId,
    ]);

    // Use Promise.all() to make sure that all queries are successful
    Promise.all([promise1,])
        .then((results) => {
            const [cart, blogFields] = results[0];
            res.json({
                cart: cart,
                error: null,
            });

        })
        .catch((err) => {
            return res.status(500).json(err);
        });
});

router.get("/shop/cartdetail", isLoggedIn, async function (req, res, next) {


    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {

        const promise1 = conn.query(`SELECT *,cart_items.id as cart_items_id  FROM carts JOIN cart_items 
        ON (carts.id = cart_items.cart_id) JOIN products ON(cart_items.product_id = products.id)
        WHERE user_id = ?;`, [req.user.id]);

        const promise2 = conn.query(`SELECT carts.id,carts.shop_id,shops.name,shops.picture,shops.description, shops.create_by_id FROM carts join shops on(carts.shop_id = shops.id) where user_id = ?`, [req.user.id]);

        const promise3 = conn.query(`SELECT carts.shop_id, SUM(price*quantity) AS totalprice FROM carts JOIN cart_items 
        ON (carts.id = cart_items.cart_id) JOIN products ON(cart_items.product_id = products.id)
        WHERE user_id = ? GROUP BY shop_id;`, [req.user.id])
        const results = await Promise.all([promise1, promise2, promise3]);

        const [cart, blogFields] = results[0];
        const [shops, shopFields] = results[1];
        const [prices, priceFields] = results[2];

        await conn.commit();

        res.json({
            cart: cart,
            shops: shops,
            prices: prices,
            error: null,
        });
    } catch (err) {
        await conn.rollback();
        return res.status(500).json(err);
    } finally {
        conn.release();
    }
});

router.put("/cartdetail/addquantity/:itemId", isLoggedIn, async function (req, res, next) {

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try {
        const [rowscheckquantity,field1] = await conn.query(`SELECT * FROM carts JOIN cart_items 
        ON (carts.id = cart_items.cart_id) JOIN products ON(cart_items.product_id = products.id)
        WHERE user_id = ? and cart_items.id =?;`, [req.user.id,req.params.itemId])

        const [rows1,field2] = await conn.query(`UPDATE cart_items SET quantity = ? WHERE cart_items.id =?;`, [(rowscheckquantity[0].quantity+1),req.params.itemId])

        res.json("success");
        await conn.commit()
        res.redirect('/')
    } catch (err) {
        await conn.rollback();
        next(err);
    } finally {
        console.log('finally')
        conn.release();
    }
}
);
router.put("/cartdetail/reducequantity/:itemId", isLoggedIn, async function (req, res, next) {
    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try {
        const [rowscheckquantity,field1] = await conn.query(`SELECT * FROM carts JOIN cart_items 
        ON (carts.id = cart_items.cart_id) JOIN products ON(cart_items.product_id = products.id)
        WHERE user_id = ? and cart_items.id =?;`, [req.user.id,req.params.itemId])

        const [rows1,field2] = await conn.query(`UPDATE cart_items SET quantity = ? WHERE cart_items.id =?;`, [(rowscheckquantity[0].quantity-1),req.params.itemId])

        res.json("success");
        await conn.commit()
        res.redirect('/')
    } catch (err) {
        await conn.rollback();
        next(err);
    } finally {
        console.log('finally')
        conn.release();
    }
}
);


exports.router = router