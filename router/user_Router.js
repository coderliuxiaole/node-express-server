const express = require('express');
const router = express.Router();

const user = require('../router_handler/user_Handler');

// 1. 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');
// 2. 导入需要的验证规则对象
const userRegAndLoing = require('../schema/user_schema').reg_login_schema;

// 用户注册路由
router.post('/reguser', expressJoi(userRegAndLoing), user.regUser);

// 用户登录路由
router.post('/login', expressJoi(userRegAndLoing), user.login);


module.exports = router;