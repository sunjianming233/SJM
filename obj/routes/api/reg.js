let mongodb = require('../../lib/mongod');
let express = require('express');
let bcrypt = require('../../lib/bcrypt');
let router = express.Router();
let uniqueString = require('siwi-uniquestring');
let fs = require('fs')
let pathObj = require('path');

router.post('/', (req, res, next) => {
    let { username, password, nickname } = req.body;

    if (!username || !password) {
        res.send({ err: 1, msg: '用户名密码不能为空' });
        return;
    }
    console.log(username);
    nickname = nickname ? nickname : uniqueString.random(6);
    // nickname = uniqueString.random(6);
    let time = Date.now;
    let follow = 0;
    let fans = 0;
    let icon = '/upload/user/default_head.jpg';

    if (req.files && req.files.length > 0) {

        let oldPath = req.files[0].path;

        let newPath = req.files[0].path + pathObj.parse(req.files[0].originalname).ext;

        fs.renameSync(oldPath, newPath);
        icon = 'upload/user/' + req.files[0].filename + pathObj.parse(req.files[0].originalname).ext;
    }
    console.log(icon);
    mongodb.open({ collectionName: 'user' })
        .then(({ collection, client }) => {
            console.log(collection);
            collection.find({ username }).toArray((err, result) => {

                if (err) {
                    res.send({ err: 1, msg: '集合操作失败' });
                    client.close();
                } else {
                    if (result.length === 0) {
                        console.log(password, typeof password);
                        password = bcrypt.hashSync(password);
                        collection.insertOne({
                            username,
                            password,
                            nickname,
                            fans,
                            follow,
                            time,
                            icon
                        }, (err, result) => {
                            if (err) {
                                res.send({ err: 1, msg: '注册失败' + err });
                            } else {
                                delete result.ops[0].username;
                                delete result.ops[0].password;
                                res.send({ err: 0, msg: '注册成功', data: result.ops[0] })
                            }
                            client.close();
                        })
                    } else {
                        res.send({ err: 1, msg: '用户名重复' });
                        client.close();
                    }

                }

            })
        })

})

module.exports = router;