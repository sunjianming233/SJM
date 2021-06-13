var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var multer = require('multer');
let cors = require('cors');

var app = express();
//文件上传设置
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (req.url.indexOf('user') !== -1 || req.url.indexOf('reg') !== -1) {
            cb(null, path.join(__dirname, 'public', 'upload', 'user'));
        } else if (req.url.indexOf('banner')) {
            cb(null, path.join(__dirname, 'public', 'upload', 'banner'));
        } else {
            cb(null, path.join(__dirname, 'public', 'upload', 'news'));
        }
    }
})
var upload = multer({ storage });
app.use(upload.any())
app.use(cors({
    //允许所有前端域名
    "origin": ["http://localhost:8001", "http://localhost:5000", "http://127.0.0.1:8848"],
    "credentials": true, //允许携带凭证
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE", //被允许的提交方式
    "allowedHeaders": ['Content-Type', 'Authorization', 'token'] //被允许的post方式的请求头
}));
// view engine setup
//模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//日志
app.use(logger('dev'));
//body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//静态资源托管
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'template')));
// app.use('/template', express.static(path.join(__dirname, 'public', 'template')));
app.use('/supervisor', express.static(path.join(__dirname, 'public', 'admin')));
//路由响应
app.all('/api/*', require('./lib/params'));
app.use('/api/login', require('./routes/api/login'));
app.use('/api/reg', require('./routes/api/reg'));
app.use('/api/news', require('./routes/api/news'));
app.use('/api/user', require('./routes/api/auto-login'))

// catch 404 and forward to error handler
//错误信息设置
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    if (req.url.includes('/api')) { // 用户端接口不存在 返回  {err:1,msg:'不存在的接口'}
        res.send({ err: 1, msg: '不存在的接口' })
    } else if (req.url.includes('/admin')) { // 管理端接口不存在 返回  res.render('error.ejs')
        res.render('error');
    } else { // 资源托管没有对应的页面 返回 404.html
        // res.sendFile(path.join(__dirname, 'public', 'template', 'index.html'))
    }
});

module.exports = app;