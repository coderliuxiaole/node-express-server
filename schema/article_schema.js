// 导入定义验证规则的模块
const joi = require('@hapi/joi')

// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
const content = joi.string().required().allow('')
const state = joi.string().valid('已发布', '草稿').required()

const id = joi.number().integer().min(1).required();

// 分页数据查询
const pagenum = joi.number().integer().min(1).required();
const pagesize = joi.number().integer().min(1).required();

// 验证规则对象 - 发布文章
module.exports.add_article_schema = {
    body: {
        title,
        cate_id,
        content,
        state,
    },
}

module.exports.Delete_Article_Schema = {
    params: {
        id,
    }
}

module.exports.update_article_schema = {
    body: {
        id,
        title,
        cate_id,
        content,
        state,
    },
}

module.exports.get_artcileList_schema = {
    query: {
        pagenum,
        pagesize,
        cate_id,
        state
    }
}