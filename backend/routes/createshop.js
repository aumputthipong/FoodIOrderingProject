const express = require("express");
const path = require("path")
const pool = require("../config");
const multer = require('multer');

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

// renderหน้าcreateitem
router.get("/createshop", async function (req, res, next) {
  try {
    return res.render("shop/createitem", { 
    });
  } catch (err) {
    return next(err)
  }
});

router.post("/addpawnitem", upload.single('myImage'), async function (req, res, next) {
    // Your code here
    const file = req.file;
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
  
    const name = req.body.shopname;
    const describe = req.body.describe;
  
    const conn = await pool.getConnection()
    await conn.beginTransaction();
  
    try {
        await conn.query(
        "INSERT INTO shops(name,picture,description) VALUES(?, ?, ?);",

        [name ,file.path.substr(6), describe]
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
