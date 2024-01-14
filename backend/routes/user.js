const express = require("express");
const pool = require("../config");
const Joi = require('joi')
const bcrypt = require('bcrypt')
const { generateToken } = require("../utils/token");
const { isLoggedIn } = require('../middlewares')


router = express.Router();
// custom f
const passwordValidator = (value, helpers) => {
    if (value.length < 8) {
        throw new Joi.ValidationError('Password must contain at least 8 characters')
    }
    if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/))) {
        throw new Joi.ValidationError('Password must be harder')
    }
    return value
}
// custom f
const usernameValidator = async (value, helpers) => {
    const [rows, _] = await pool.query(
        "SELECT username FROM users WHERE username = ?",
        [value]
    )
    if (rows.length > 0) {
        const message = 'มีชื่อผู้ใช้นี้แล้ว (This user is already taken)'
        throw new Joi.ValidationError(message, { message })
    }
    return value
}

const signupSchema = Joi.object({
    email: Joi.string().email().max(100).required(), // ต้องกรอก และ เป็น email ที่ถูกต้อง,
    mobile: Joi.string().required().pattern(/0[0-9]{9}/),
    first_name: Joi.string().required().max(150),// ต้องกรอก ไม่เกิน 150 ตัวอักษร
    last_name: Joi.string().required().max(150),// ต้องกรอก ไม่เกิน 150 ตัวอักษร
    password: Joi.string().required().custom(passwordValidator),
    confirm_password: Joi.string().required().equal(Joi.ref('password')), // ต้องเหมือนกับ password
    username: Joi.string().required().min(5).external(usernameValidator),
    role: Joi.string().required(),
})

router.post('/user/signup', async (req, res, next) => {
    try {
        await signupSchema.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).json(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const username = req.body.username
    const password = await bcrypt.hash(req.body.password, 5)
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const email = req.body.email
    const mobile = req.body.mobile
    const role = req.body.role

    try {
        const [rows1,fields1] = await conn.query(
            'INSERT INTO users(username, password, first_name, last_name, email, mobile,role) ' +
            'VALUES (?, ?, ?, ?, ?, ?,?)',
            [username, password, first_name, last_name, email, mobile,role]
          
        )
        // await conn.query(
        //     'INSERT INTO carts(user_id) VALUES (?)',
        //     [rows1.insertId]
        // )
        conn.commit()
        res.status(201).send()
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
})

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

router.post("/user/login", async (req, res, next) => {
    try {
        await loginSchema.validateAsync(req.body, { abortEarly: false });
    } catch (err) {
        return res.status(400).send(err);
    }
    const username = req.body.username;
    const password = req.body.password;

    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
        // Check if username is correct
        const [users] = await conn.query("SELECT * FROM users WHERE username=?", [
            username,
        ]);
        const user = users[0];
        if (!user) {
            throw new Error("Incorrect username or password");
        }

        // Check if password is correct
        if (!(await bcrypt.compare(password, user.password))) {
            throw new Error("Incorrect username or password");
        }

        // Check if token already existed
        const [tokens] = await conn.query("SELECT * FROM tokens WHERE user_id=?", [
            user.id,
        ]);
        let token = tokens[0]?.token;
        if (!token) {
            // Generate and save token into database
            token = generateToken();
            await conn.query("INSERT INTO tokens(user_id, token) VALUES (?, ?)", [
                user.id,
                token,
            ]);
        }

        conn.commit();
        res.status(200).json({ token: token });
    } catch (error) {
        conn.rollback();
        res.status(400).json(error.toString());
    } finally {
        conn.release();
    }
});
router.get("/user/me", isLoggedIn, async (req, res, next) => {
    // req.user ถูก save ข้อมูล user จาก database ใน middleware function "isLoggedIn"
    res.json(req.user);
});

exports.router = router