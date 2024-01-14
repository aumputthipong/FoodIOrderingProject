const express = require("express");
const path = require("path")
const pool = require("../config");
const multer = require('multer');
const { isLoggedIn } = require('../middlewares')
const Joi = require('joi')

router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './static/uploads') // path to save file
    },
    filename: function (req, file, callback) {
        // set file name
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

const checkProduct = Joi.object({
    pro_name: Joi.string().required(),
    pro_description: Joi.string().required(),
    pro_price: Joi.number().required()
})

router.get("/shop/detail/:id", async function (req, res, next) {
    const promise1 = pool.query("SELECT * FROM shops WHERE id=?", [
        req.params.id,
    ]);
    const promise2 = pool.query("SELECT * FROM products WHERE shop_id=?", [req.params.id]);

    // const promise3 = pool.query("SELECT * FROM carts JOIN cart_items ON carts.id = cart_id JOIN products ON cart_items.product_id = products.id WHERE shop_id=?", [req.params.id]);

    // Use Promise.all() to make sure that all queries are successful
    Promise.all([promise1, promise2])
        .then((results) => {
            const [shops, blogFields] = results[0];
            const [products, productFields] = results[1];
            res.json({
                shop: shops[0],
                products: products,
                error: null,
            });

        })
        .catch((err) => {
            return res.status(500).json(err);
        });
});

const ShopOwner = async (req, res, next) => {
    console.log(req.user)
    if (req.user.role === 'admin') {
      return next()
    }
    if (req.user.role === 'customer') {
      res.status(400).json({
        details: {
          message: "คุณไม่มีสิทธิ์ (You dont have permission in this section)"
        }
      });
    }
    const [[shop]] = await pool.query('SELECT * FROM shops WHERE id=?', [req.params.shopid])
      // console.log({ test: shop.create_by_id })
      if (shop.create_by_id !== req.user.id) {
        res.status(400).json({
          details: {
            message: "คุณไม่มีสิทธิ์ (You dont have permission in this section)"
          }
        });
      }
    else {
      next()
    }
  }

router.post("/createproduct/:shopid", isLoggedIn,ShopOwner, upload.single('product_image'), async function (req, res, next) {
    try {
        await checkProduct.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).json(err)
    }

    const pro_name = req.body.pro_name
    const pro_description = req.body.pro_description
    const pro_price = req.body.pro_price

    const file = req.file;
    if (!file) {
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
    }

    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {
        const [rows1, field1] = await conn.query(
            "INSERT INTO `products` (`name`, `description`, `picture`,`price`,`status`,`shop_id`) VALUES (?,?,?,?,'not-available',?)",
            [pro_name, pro_description, file.path.substr(6), pro_price, req.params.shopid],
        )

        await conn.commit();
        res.redirect('/')
    } catch (err) {

        await conn.rollback();
        next(err)
    } finally {
        conn.release();
    }
});


router.put("/productupdate/:proId", isLoggedIn, upload.single('pro_image'), async function (req, res, next) {
    try {
        await checkProduct.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).json(err)
    }
  
    const conn = await pool.getConnection()
    await conn.beginTransaction();
  
    const file = req.file;
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
  
    const pro_name = req.body.proname;
    const pro_describe = req.body.prodescribe;
    const pro_price = req.body.proprice;
  
    try {
      // console.log(content)
         await conn.query(
        "UPDATE products SET name=?, description=? ,picture=?, price=? WHERE id = ?",[pro_name, pro_describe,file.path.substr(6),pro_price, req.params.proId]
      )
  
      await conn.commit()
      res.send("success!");
    } catch (err) {
      await conn.rollback();
      next(err);
    } finally {
      console.log('finally')
      conn.release();
    }
    return;
  });
  

router.get("/createproduct/:id", isLoggedIn, async function (req, res, next) {
    const promise1 = pool.query("SELECT * FROM shops WHERE id=?", [
        req.params.id,
    ]);

    // Use Promise.all() to make sure that all queries are successful
    Promise.all([promise1,])
        .then((results) => {
            const [shops, shopFields] = results[0];

            res.json({
                shop: shops[0],
                error: null,
            });
        })
        .catch((err) => {
            return res.status(500).json(err);
        });
});


   
router.post("/updatestatus/:productId", isLoggedIn, async function (req, res, next) {
    const product = req.body.product;

    const conn = await pool.getConnection()
    await conn.beginTransaction()
        
    try {
        await conn.query(
            "UPDATE products SET products.status = ? WHERE id = ?", [product.status, req.params.productId]
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

exports.router = router;