// 文章路由
const express = require('express');
const router = express.Router();

// 包含路由处理函数
const artHandeler = require('../router_handler/artcate_Handler');
// 1. 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');
// 添加文章分类的校验规则
const articleAdd = require('../schema/artcate_schema').add_cate_schema;

// 删除文章分类的校验规则
const articleDelete = require('../schema/artcate_schema').delete_cate_schema;

// 根据id获取文章分类列表校验规则
const articleGetArtCates = require('../schema/artcate_schema').get_cate_schema;

// 根据 id 更新文章分类列表校验规则
const articleUpdateCates = require('../schema/artcate_schema').update_cate_schema;
const getArticleById_schema = require('../schema/artcate_schema').getArticleById_schema;

// 获取分类列表
router.get('/getCates', artHandeler.getArtCates)

// 新增文章分类
router.post('/addCates', expressJoi(articleAdd), artHandeler.addArtCates)

// 删除文章分类
router.get('/deleteCate/:id', expressJoi(articleDelete), artHandeler.deleteArtCates);

// 根据 id 获取文章分类
router.get('/getArtCatesById/:id', expressJoi(articleGetArtCates), artHandeler.getArtCatesById);

// 根据分类 id 获取对应的文章
router.get('/getArticleById/:cate_id', expressJoi(getArticleById_schema), artHandeler.getArticleById);

// 根据 id 更新文章分类
router.post('/updateArtCateById', expressJoi(articleUpdateCates), artHandeler.updateCateById);

module.exports = router;