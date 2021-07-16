const db = require('../db/mysql');
const path = require('path');

// 文章发布
module.exports.articleAdd = (req, res) => {
    // 判断req.file中的数据是否合法
    if (!req.file || req.file.fieldname !== 'cover_img') return res.msg(1, '文章封面参数不正确!');

    // 处理文章信息对象
    const artcileInfo = {
        ...req.body,
        // 文章封面图片
        cover_img: path.join('/uploads', req.file.filename),
        // 文章的发布时间
        pub_date: new Date(),
        // 作者ID
        author_id: req.user.id
    }

    // 发布文章
    const sqlStr = 'INSERT INTO ev_articles SET ?';
    db.query(sqlStr, artcileInfo, (err, result) => {
        if (err) return res.msg(2, '数据执行时遇到错误!');

        if (result.affectedRows !== 1) return res.msg(1, '发布文章失败!');

        res.msg(0, '发布文章成功!');
    })


}

// 文章列表
module.exports.articleGetList = (req, res) => {
    const artcileList = {
        pagenum: req.query.pagenum,
        pagesize: req.query.pagesize,
        cate_id: req.query.cate_id,
        state: req.query.state,
    }
    const startNum = artcileList.pagenum == 1 ? 0 : Number(artcileList.pagenum - 1) * artcileList.pagesize;
    const endNum = Number(startNum) + Number(artcileList.pagesize);
    const sqlStr = 'SELECT * FROM ev_articles where cate_id=? and  state = ? limit ?, ?';
    db.query(sqlStr, [artcileList.cate_id, artcileList.state, startNum, endNum ], (err, result) => {
        if (err) return res.msg(2, '数据执行时遇到错误!');

        if (result.length == 0 ) return res.msg(1, '文章列表数据获取失败!');

        res.send({
            status: 0,
            message: '文章列表数据获取成功!',
            data: result
        })
    })
}

// 根据 id 删除文章
module.exports.articleDeleteById = (req, res) => {
    const sqlStr = 'UPDATE ev_articles SET IS_DELETE=1 WHERE ID = ?';
    db.query(sqlStr, req.params.id, (err, result) => {
        if (err) return res.msg(2, '数据执行遇到错误!');

        if (result.affectedRows !== 1) return res.msg(1, '删除文章操作失败!');

        res.msg(0, '删除文章操作成功!');
    })
}

// 根据 id 获取文章
module.exports.articleGetById = (req, res) => {
    const sqlStr = 'SELECT * FROM ev_articles WHERE ID=?';
    db.query(sqlStr, req.params.id, (err, result) => {
        if (err) return res.msg(2, '数据执行遇到错误!');

        if (result.length !== 1) return res.msg(1, '获取指定文章失败!');

        res.send({
            status: 0,
            message: '获取指定文章成功!',
            data: result,
        })
    })
}

// 根据 id 更新文章
module.exports.articleUpdateById = (req, res) => {
    console.log(1);
    // 判断req.file中的数据是否合法
    if (!req.file || req.file.fieldname !== 'cover_img') return res.msg(1, '文章封面参数不正确!');

    // 重构文章列表信息
    const artcileUpdate = {
        ...req.body,
        // 文章封面图片
        cover_img: path.join('/uploads', req.file.filename),
        // 文章的发布时间
        pub_date: new Date(),
        // 作者ID
        author_id: req.user.id
    }
    console.log(artcileUpdate);
    // 根据 id 更新文章
    const sqlStr = 'UPDATE ev_articles SET ? WHERE ID= ? ';
    db.query(sqlStr, [artcileUpdate, artcileUpdate.id], (err, result) => {
        if (err) return res.msg(2, '数据执行失败!');

        if (result.affectedRows !== 1) return res.msg(1, '更新文章数据失败!');

        res.msg(0, '更新文章数据成功!');
    })
}