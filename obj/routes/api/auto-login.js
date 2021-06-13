let mongodb = require('../../lib/mongod');
let express = require('express');
let router = express.Router();


router.get('/', (req, res, next) => {
    mongodb.open({ collectionName: 'user' }).then(({ collection, client, ObjectId }) => {
        collection.find({ username: req.detoken.username, _id: ObjectId(req.detoken._id) }).toArray((err, result) => {
            if (err) {
                res.send({ err: 1, msg: '集合操作失败' })
            } else {
                if (result.length > 0) {
                    delete result[0].username;
                    delete result[0].password;
                    res.send({ err: 0, msg: '成功', data: result[0] })
                } else {
                    res.send({ err: 1, msg: '自动登录失败' })
                }
            }
            client.close();
        })
    })
})

module.exports = router;