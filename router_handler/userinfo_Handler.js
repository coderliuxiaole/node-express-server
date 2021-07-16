const db = require('../db/mysql');
const bcrypt = require('bcryptjs');
const jwt = require('express-jwt');

// 获取用户信息 测试OK
module.exports.getUserInfo = (req, res) => {

    // console.log(req.user);

    const sqlStr = 'SELECT ID,USERNAME, NICKNAME, EMAIL,USER_PIC FROM EV_USERS WHERE ID=?';
    db.query(sqlStr, req.user.id, (err, result) => {
        if (err) return res.msg(2, '执行SQL语句失败!');

        if (result.length !== 1) return res.msg(2, '获取用户信息失败!');

        // 成功后返回信息给客户端
        res.send({
            status: 0,
            message: '获取用户信息成功!',
            data: result[0]
        })
    })
}

// 更新用户信息  测试OK
module.exports.updateUserInfo = (req, res) => {
    const sqlStr = 'UPDATE EV_USERS SET NICKNAME=?, EMAIL=? WHERE ID=?';
    db.query(sqlStr, [req.body.nickname, req.body.email, req.user.id], (err, result) => {
        // 数据执行失败
        if (err) return res.msg(2, err.message);

        // 执行成功 但数据没有发生改变
        if (result.affectedRows !== 1) return res.msg(2, '更新用户信息失败!');

        // 成功的结果
        res.msg(0, '用户信息更新成功!');
    })
}

// 修改用户密码 测试OK
module.exports.updatePassword = (req, res) => {
    const sqlStr = 'select * from ev_users where id=?';
    db.query(sqlStr, req.user.id, (err, result) => {
        // 数据执行遇到错误
        if (err) return res.msg(2, err.message);

        // 判断用户时候不存在
        if (result.length !== 1) return res.msg(1, '该用户不存在!');

        // 判断原密码是否正确
        const pwdResult = bcrypt.compareSync(req.body.oldPwd, result[0].password);
        if (!pwdResult) return res.msg(1, '原密码不正确!');

        // 判断修改后的密码是否和原密码相等
        const repwd = bcrypt.compareSync(req.body.newPwd, result[0].password);
        if (repwd) return res.msg(1, '密码修改失败,不能和原密码一致!');

        // 成功
        const sqlStr = 'update ev_users set password=? where id=?';
        const newPassword = bcrypt.hashSync(req.body.newPwd, 10);

        db.query(sqlStr, [newPassword, req.user.id], (err, result) => {

            // 数据执行错误
            if (err) return res.msg(1, '数据执行失败!')

            // 判断结果是否正确
            if (result.affectedRows !== 1) return res.msg(1, '密码修改失败!');

            // 成功
            res.msg(0, '密码修改成功')
        })
    })
}

// 修改用户头像  测试OK
module.exports.updateUserAvatar = (req, res) => {
    const sqlStr = 'UPDATE EV_USERS SET USER_PIC= ? WHERE ID= ?';
    db.query(sqlStr, [req.body.avatar, req.user.id], (err, result) => {
        // 判断数据执行错误
        if (err) return res.msg(1, '数据执行遇到错误!');
      
        // 判断结果是否执行成功
        if (result.affectedRows !== 1) return res.msg(1, '头像更换失败!');

        // 成功
        res.msg(0, '用户头像更新成功!');
    })
}