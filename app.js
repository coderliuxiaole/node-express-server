const express = require('express');
const app = express();
const joi = require('@hapi/joi');

// 跨域
const cors = require('cors');
app.use(cors())

// 解析表单数据
app.use(express.urlencoded({ extended: false }))

// 返回值中间件
app.use((req, res, next) => {
    res.msg = function (status, err
    ) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
        })
    }
    next();
})

// 配置解析 Token 的中间件
const expressJWT = require('express-jwt')
const config = require('./config')
app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api/] }))

// 静态托管
app.use('/uploads', express.static('./uploads'));

// 登录注册 路由
const user = require('./router/user_Router');
app.use('/api', user);

// 用户个人信息 路由
const userinfo = require('./router/userinfo_Router');
app.use('/my', userinfo);

// 文章类别管理 路由
const artCate = require('./router/artcate_Router');
app.use('/my/article', artCate);

// 文章管理 路由
const article = require('./router/article_Router');
app.use('/my/article', article);

// 定义错误级别的中间件
app.use((err, req, res, next) => {
    console.log(err)
    // 验证失败导致的错误
    if (err instanceof joi.ValidationError) return res.msg(2, err)
    // 身份认证失败后的错误
    if (err.name === 'UnauthorizedError') return res.msg(2, '身份认证失败！')
    // 未知的错误
    res.msg(2, err)
})

app.listen(8080, () => {
    console.log('服务器启动成功!   http://127.0.0.1:8080/');
})