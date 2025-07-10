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

const checkShop = Joi.object({
  shopname: Joi.string().required(),
  describe: Joi.string().required(),
})

const HaveShop = async (req, res, next) => {
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
  const [rows, fields] = await pool.query('SELECT * FROM shops WHERE create_by_id=?', [req.user.id])
  //  console.log({มีร้านยัง:rows.length})
  if (rows.length > 0) {
    res.status(400).json({
      details: {
        message: "คุณมีร้านแล้ว (You already have shop)"
      }
    });
  }
  else {
    next()
  }
}



router.post("/createshop", isLoggedIn, HaveShop, upload.single('shop_image'), async function (req, res, next) {
  try {
    await checkShop.validateAsync(req.body, { abortEarly: false })
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

  const shopname = req.body.shopname;
  const describe = req.body.describe;

  try {
    await conn.query(
      "INSERT INTO shops(name, picture, description, create_by_id) VALUES(?, ?, ?, ?);",

      [shopname, file.path.substr(6), describe, req.user.id]
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
  const [[shop]] = await pool.query('SELECT * FROM shops WHERE id=?', [req.params.id])
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


router.put("/shopupdate/:id", isLoggedIn, ShopOwner, upload.single('shop_image'), async function (req, res, next) {
  try {
    await checkShop.validateAsync(req.body, { abortEarly: false })
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

  const shopname = req.body.shopname;
  const describe = req.body.describe;

  try {
    // console.log(content)
    let results = await conn.query(
      "UPDATE shops SET name=?, description=? ,picture=? WHERE id=?", [shopname, describe, file.path.substr(6), req.params.id]
    )
    await conn.commit()
    res.send("success!");
  } catch (err) {
    await conn.rollback();
    // next(err);
    res.status(400).json(err.toString());
  } finally {
    console.log('finally')
    conn.release();
  }
  return;
});
exports.router = router;
