const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');
const uploads = multer({ dest: path.join(__dirname, '../uploads') })

const expressJoi = require('@escook/express-joi')
// 发布文章校验规则
const addArticleSchema = require('../schema/article_schema').add_article_schema;

// 删除文章校验规则
const deleteArticleSchema = require('../schema/article_schema').Delete_Article_Schema;
const updateArtcile = require('../schema/article_schema').update_article_schema;
const getArtcileList = require('../schema/article_schema').get_artcileList_schema;

// 文章管理 处理函数
const articleHandler = require('../router_handler/article_Handler')

//  文章发布
router.post('/addArtcile', uploads.single('cover_img'), expressJoi(addArticleSchema), articleHandler.articleAdd)

// 文章列表
router.get('/getArtcileList', expressJoi(getArtcileList), articleHandler.articleGetList);

// 根据 id 删除文章
router.get('/delete/:id', expressJoi(deleteArticleSchema), articleHandler.articleDeleteById);

// 根据 id 获取文章
router.get('/getArtcile/:id', expressJoi(updateArtcile), articleHandler.articleGetById);

// 根据 id 更新文章
router.post('/articleEdit', uploads.single('cover_img'), expressJoi(updateArtcile), articleHandler.articleUpdateById);

module.exports = router;