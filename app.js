var express = require('express');
var app = express();
var ejs = require('ejs');

var session = require('express-session')
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000*60*30 },
  rolling: true
}))

// 路由模块化
var client = require('./routers/client.js');
var admin = require('./routers/admin.js');
app.use("/client", client);
app.use("/admin", admin);

// 配置模板引擎
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// 配置 statics 为静态 web 服务器
app.use(express.static('statics'));
app.use("/uploads", express.static('uploads'));


// 请求首页(跳转到客户商城首页)
app.get('/', function (req, res) {
  res.redirect('/client');
});
// 登录
app.get('/login', function (req, res) {
  res.render('login');
});

app.listen(3000);