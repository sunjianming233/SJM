let mongodb = require("mongodb");
let mongoCt = mongodb.MongoClient;
let ObjectId = mongodb.ObjectId;

let open = ({ dbName = 'sun', collectionName, url = 'mongodb://127.0.0.1:27017' }) => {
    return new Promise((resolve, reject) => {
        mongoCt.connect(url, { useUnifiedTopology: true }, (err, client) => {
            if (err) {

                reject({
                    err: 1,
                    msg: '连接失败',
                    client
                })

            } else {
                let db = client.db(dbName)
                let collection = db.collection(collectionName);


                resolve({
                    err: 0,
                    msg: '连接成功',
                    client,
                    collection,
                    ObjectId
                })
            }

        });
    })
}

let findList = ({ dbName = 'sun', collectionName, url = 'mongodb://127.0.0.1:27017', _limit, _page, _sort, p }) => {
    //p为查询条件，是一个对象
    return new Promise((resolve, reject) => {
        open({ dbName, collectionName, url })
            .then(({ client, collection }) => {
                let skipNum = (_limit - 0) * (_page - 0);
                collection.find(p, {
                    limit: (_limit - 0),
                    skip: skipNum,
                    sort: {
                        [_sort]: 1
                    }
                }).toArray((err, result) => {
                    if (!err && result.length > 0) {
                        resolve({
                            error: 0,
                            msg: '查询成功',
                            data: result
                        })
                    } else {
                        reject({
                            error: 1,
                            msg: '查询失败',
                        })
                    }
                    client.close();
                })
            })
            .catch(({ client }) => {
                reject({
                    error: 1,
                    msg: '库连接失败',
                })
                client.close();
            })
    })
}

let findDetail = ({ dbName = 'sun', collectionName, url = 'mongodb://127.0.0.1:27017', _id }) => {
    return new Promise((resolve, reject) => {
        open({ dbName, collectionName, url })
            .then((client, collection) => {
                // console.log(client.collection);
                collection = client.collection
                collection.find({
                    _id: ObjectId(_id) //把字符id转换成ObjectId
                }, { projection: { _id: 0 } }).toArray((err, result) => {
                    console.log(err, 'aaa');
                    console.log(result);
                    if (!err && result.length > 0) {
                        resolve({
                            error: 0,
                            msg: '查询成功',
                            data: result[0]
                        })
                    } else {
                        reject({
                            error: 1,
                            msg: '查询失败',
                        })
                    }

                })
                // console.log('这是', client);
                client.close();
            })
    }).catch(({ client }) => {
        reject({
            error: 1,
            msg: '库连接失败',
        })
        client.close();
    })
}

// //查详情
// let findDetail = ({
//     collectionName,//集合名
//     dbName = sun,//库名 默认bulala
//     _id = null
// }) => {
//     return new Promise((resolve, reject) => {
//         //1.链库
//         open({
//             dbName, collectionName
//         }).then(
//             ({ collection, client }) => {
//                 //2.查询
//                 //2.1 判断 _id的长度
//                 if (_id.length === 24) {//mongodb的自动生成_id的长度 24

//                     //集合查询 查_id
//                     collection.find({
//                         _id: ObjectId(_id) //把字符id转换成ObjectId
//                     }, { projection: { _id: 0 } }).toArray((err, result) => {

//                         //3.返回结果(resolve,reject)
//                         if (!err && result.length > 0) {
//                             resolve({
//                                 err: 0,
//                                 data: result[0]//通过id查询到的结果是个对象，result是个数组
//                             })
//                         } else {
//                             resolve({
//                                 err: 1,
//                                 msg: '查无数据'
//                             })
//                         }
//                         //4.关闭库链接
//                         client.close()
//                     })


//                 } else {
//                     reject({
//                         err: 1,
//                         msg: 'id有误'
//                     })
//                     client.close()
//                 }
//             }
//         ).catch(
//             err => {
//                 reject({
//                     err: 1,
//                     msg: '链库失败'
//                 })
//                 client.close()
//             }
//         )

//     })
// }
exports.open = open;
exports.findList = findList;
exports.findDetail = findDetail;