let mongodb = require('../../lib/mongod');
let express = require('express');
let router = express.Router();
let bcrypt = require('../../lib/bcrypt');
let jwt = require('../../lib/jwt');


router.post('/', (req, res, next) => {

    let { username, password } = req.body;
    console.log(username, password);
    if (!username || !password) {
        res.send({ err: 1, msg: '用户名和密码不能为空' })
        return;
    }

    mongodb.open({ collectionName: "user" })
        .then(({ collection, client }) => {
            collection.find({ username }).toArray((err, result) => {
                if (!err) {
                    if (result.length > 0) {
                        let bl = bcrypt.compareSync(password, result[0].password)
                        if (bl) {
                            let token = jwt.sign(username, result[0]._id);
                            console.log(result[0]._id);
                            delete result[0].username;
                            delete result[0].password;
                            res.send({ err: 0, msg: '登录成功', data: result[0], token });
                            client.close();
                        } else {
                            res.send({ err: 1, msg: '密码错误' });
                            client.close();
                        }
                    } else {
                        res.send({ err: 1, msg: '用户名或密码错误' });
                        client.close();
                    }
                } else {
                    res.send({ err: 1, msg: '集合操作失败' });
                    client.close();
                }
            })
        })
})

module.exports = router;