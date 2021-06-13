let jwt = require('./jwt');
module.exports = (req, res, next) => {
    //处理公共参数  address !address headers
    req.query._page = req.query._page ? req.query._page - 1 : require('../config/query-rules')._page;
    req.query._limit = req.query._limit ? req.query._limit - 0 : require('../config/query-rules')._limit;
    req.query.q = req.query.q ? req.query.q : require('../config/query-rules').q;
    req.query._sort = req.query._sort ? req.query._sort : require('../config/query-rules')._sort;

    req.body._page = req.body._page ? req.body._page - 1 : require('../config/query-rules')._page;
    req.body._limit = req.body._limit ? req.body._limit - 1 : require('../config/query-rules')._limit;
    req.body.q = req.body.q ? req.body.q : require('../config/query-rules').q;
    req.body._sort = req.body._sort ? req.body._sort : require('../config/query-rules')._sort;


    req.headers._page = req.headers._page ? req.headers._page - 1 : require('../config/query-rules')._page;
    req.headers._limit = req.headers._limit ? req.headers._limit - 1 : require('../config/query-rules')._limit;
    req.headers.q = req.headers.q ? req.headers.q : require('../config/query-rules').q;
    req.headers._sort = req.headers._sort ? req.headers._sort : require('../config/query-rules')._sort;

    if (/reg|login|logout/.test(req.url)) {
        next()
    } else {
        let token = req.body.token || req.headers.token || req.query.token
        jwt.verify(token).then((decode) => {
            req.detoken = decode;
            next();
        }).catch((message) => {
            res.send({ err: 1, msg: 'token过期或校验失败' + message })
        })

    }

}