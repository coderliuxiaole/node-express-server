const express = require('express');
const router = express.Router();

// 导入处理函数的包
const userinfoHandler = require('../router_handler/userinfo_Handler');

const expressJoi = require('@escook/express-joi')
const { updateUserInfo, updatePssword, updateAvatar } = require('../schema/user_schema')
// 获取用户信息
router.get('/getUserinfo', userinfoHandler.getUserInfo);

// 更新用户信息
router.post('/updateUserinfo', expressJoi(updateUserInfo) ,userinfoHandler.updateUserInfo);

// 修改用户密码
router.post('/updateUserPassword', expressJoi(updatePssword), userinfoHandler.updatePassword);


// 更新用户头像
router.post('/updateUserAvatar', expressJoi(updateAvatar) , userinfoHandler.updateUserAvatar);
module.exports = router;