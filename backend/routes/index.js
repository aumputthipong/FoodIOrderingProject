const express = require("express");
const pool = require("../config");

router = express.Router();


// หน้าแรก
router.get("/", async function (req, res, next) {
  try {
    const search = req.query.search || ''
    let sql = 'SELECT * FROM shops;'
    let cond = []

    if (search.length > 0) {
      sql = 'SELECT * FROM shop WHERE title LIKE ? ;'
      cond = [`%${search}%`,]
    }
    const [rows, fields] = await pool.query(sql, cond);
    return res.json(rows);
  } catch (err) {
  }
  return res.status(500).json(err)
});

exports.router = router;
