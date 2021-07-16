const db = require("../db/mysql");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

// 注册处理函数
module.exports.regUser = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    // 判断用户名或者密码不能为空
    if (!username || !password) {
        return res.send({
            status: 1,
            message: '账户注册失败,用户名或者密码不能为空!'
        })
    }

    const sqlStr = 'SELECT * FROM EV_USERS WHERE USERNAME=?';
    db.query(sqlStr, username, (err, result) => {
        // 如果数据库遇到错误的提示
        if (err) return res.send('SQL语句执行遇到错误!' + err.message);

        // 判断用户名是否被占用
        if (result.length != 0) {
            return res.send({
                status: 1,
                message: '账户注册失败,用户名已经存在!',
            })
        }

        // 如果没有被占用的话执行的sql
        const sqlStr = 'INSERT INTO EV_USERS (USERNAME,PASSWORD) VALUES(?,?)';

        // 密码加密
        password = bcrypt.hashSync(password, 10);
        db.query(sqlStr, [username, password], (err, result) => {
            // 数据库执行遇到错误的提示
            if (err) return res.send('数据执行遇到错误' + err.message);

            // 判断当数据执行成之后的提示
            if (result.affectedRows == 1) {
                res.send({
                    status: 0,
                    message: '账户注册成功!'
                })
            }
        })
    })
}


// 登录处理函数
module.exports.login = (req, res) => {
    let userinfo = req.body;
    const sqlStr = 'SELECT * FROM EV_USERS WHERE USERNAME=?';

    // 判断账号是否存在
    db.query(sqlStr, userinfo.username, (err, result) => {
        // 数据执行失败时的提示
        if (err) return res.msg(2, '数据执行时遇到错误!');

        // 账号不存在
        if (result.length == 0) { return res.msg(1, '登录失败,用户名不存在!') }

        // 判断密码
        const compaerResult = bcrypt.compareSync(userinfo.password, result[0].password);
        if (!compaerResult) return res.msg(1, '登录失败,账户名或者密码错误!');

        // 生成登录后的用户对象
        const user = { ...result[0], password: null, user_pic: null }

        // 生成token
        const token = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn});
        // 登录成功后返回用户信息
        res.send({
            status: 0,
            message: '用户登录成功!',
            token: 'Bearer ' + token
        })

    })
}


