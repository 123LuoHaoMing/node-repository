var express = require('express');
var app = express();
var router = express.Router();
var db = require('../modules/db');
var bodyParser = require('body-parser');
// 配置bodyParser
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// 首页管理员后台
router.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  db.find("SELECT * FROM admin where username='" + username + "' AND password='" + password + "'", function(result) {
    if (result[0]) {
      // 用户密码正确，登录成功
      req.session.admin = result[0].username;  //将用户信息保存在 session 中
      res.redirect('/admin');
    } else {
      // 登录失败
      res.send('<script> alert("登录失败"); history.go(-1); </script>')
    }
  })
})

// 中间件，后台权限判断
router.use(function(req, res, next) {
  // 已登录管理员账号，可以对后台操作
  if (req.session.admin) {
    next();
  } else {  // 拦截未登录状态进入后台
    res.redirect('/login');
  }
})
// 产品模块化
router.use('/product', require('./product.js'))

// 后台首页 -- 分页
router.get('/', function(req, res) { 
  var cur_page = 1;   // 默认当前页为1
  if (req.query.page) {   
    // console.log(typeof req.query.page)  // 传过来的参数是字符串类型的，需要转换为整型
    cur_page = parseInt(req.query.page);
  }
  var num = 2;   //规定一页两条商品信息
  var last_page = cur_page - 1; 
  if (cur_page <= 1) {
    last_page = 1;
  }
  var next_page = cur_page + 1;
  // 根据页数，每页显示两条记录
  db.find("SELECT * FROM store LIMIT " + num + " OFFSET " + num * (cur_page - 1), function(result) {
    var data = result;
    db.find("SELECT * FROM store", function(re) {
      var len = re.length;  // 所有商品的数量
      var page_count = Math.ceil(len / num);  //求出页数
      if (next_page >= page_count) {   //限制页数不超
        next_page = page_count;
      } 
      res.render('admin/index',{
        data,
        page_count,
        cur_page,
        last_page, 
        next_page,
        num
      });
    })
  })
})


// 管理员退出后台
router.get('/loginOut', function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect('/login')
    }
  })
})

module.exports = router;