// 文章路由处理函数
const { query } = require('../db/mysql');
const db = require('../db/mysql');

// 获取文章分类列表
module.exports.getArtCates = (req, res) => {
    const sqlStr = 'select * from ev_article_cate where is_delete=0 order by id asc';
    db.query(sqlStr, (err, result) => {
        if (err) return res.msg(2, 'MySql数据执行失败!');
        res.send({
            status: 0,
            message: '获取文章分类成功',
            data: result
        })
    })
}

// 新增文章分类列表
module.exports.addArtCates = (req, res) => {
    // 查询文章分类是否被占用
    const sqlStr = 'select * from ev_article_cate where name=? or alias= ?';
    db.query(sqlStr, [req.body.name, req.body.alies], (err, result) => {
        // 数据执行失败
        if (err) return res.msg(2, 'SQL数据执行失败!');

        // 名称被占用
        if (result.length >= 1) return res.msg(1, '分类名称或者分类别名被占用!');

        // 成功后插入数据
        const sqlStr = 'insert into ev_article_cate (name, alias) values(?, ?)';
        db.query(sqlStr, [req.body.name, req.body.alias], (err, result) => {
            if (err) return res.msg(2, '数据执行失败!');

            // 插入失败提示
            if (result.affectedRows !== 1) return res.msg(1, '插入文章分类失败!');

            // 成功提示
            res.msg(0, '插入文章分类成功!');
        })
    })
}

// 删除文章分类列表
module.exports.deleteArtCates = (req, res) => {
    const sqlStr = 'update ev_article_cate set is_delete=1 where id=? ';
    db.query(sqlStr, req.params.id, (err, result) => {
        if (err) return res.msg(2, '数据执行失败!');

        // 判断数据是否执行成功
        if (result.affectedRows !== 1) return res.msg(1, '删除文章分类失败!');

        // 成功
        res.msg(0, '删除文章分类成功!');
    })
}

// 根据 id 获取文章分类
module.exports.getArtCatesById = (req, res) => {
    const sqlStr = 'select * from ev_article_cate where is_delete=0 and id=?'
    db.query(sqlStr, req.params.id, (err, result) => {
        // 判断 sql 执行是否成功
        if (err) return res.msg(2, '数据执行失败!');

        // 判断数据是否执行成功
        if (result.length !== 1) return res.msg(1, '获取文章分类数据失败!');

        // 成功提示
        res.send({
            status: 0,
            message: '根据ID获取文章分类数据成功!',
            data: result[0]
        })
    })
}

// 根据文章 id 获取对应的文章列表
module.exports.getArticleById = (req, res) => {
    const sqlStr = 'SELECT * FROM ev_articles WHERE cate_id=?';

    // 查询对应文章名称的sql
    
    // SELECT name FROM liuxiaole.ev_article_cate where Id = 1;
    db.query(sqlStr, [req.params.cate_id], (err, result) => {
        if (err) return res.msg(2, '数据库操作遇到错误!');
        
        if (result.length == 0) return res.msg(1, '该分类下没有文章!')
        
        res.send({
            status: 0,
            message: '获取该文章分类的文章列表成功!',
            data: result
        })
    })
}

// 根据 id 更新文章分类
module.exports.updateCateById = (req, res) => {
    // 查询文章分类是否被占用
    const sqlStr = 'select * from ev_article_cate where id != ? and (name=? or alias=?)';
    db.query(sqlStr, [req.body.id, req.body.name, req.body.alias], (err, result) => {
        // 数据执行失败
        if (err) return res.msg(2, 'SQL数据执行失败!');

        // 名称被占用
        if (result.length >= 1) return res.msg(1, '分类名称或者分类别名被占用!');

        // 成功后更新文章数据
        const sqlStr = 'UPDATE  ev_article_cate  set name=?, alias= ? where id=? ';
        db.query(sqlStr, [req.body.name, req.body.alias, req.body.id], (err, result) => {
            if (err) return res.msg(2, '数据执行遇到错误!');

            if (result.affectedRows !== 1) return res.msg(1, '文章分类更新失败!');

            res.msg(0, '文章分类更新成功!');
        })

    })
}