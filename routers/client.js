var express = require('express');
var router = express.Router();
var db = require('../modules/db');
var bodyParser = require('body-parser');
// 配置bodyParser
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// 用户首页
router.get('/', function (req, res) {
  var data;
  var shopNum = 0;
  db.find("SELECT * FROM cart", function(result) {
    var len = result.length;
    for (var i = 0; i < len; i ++) {
      shopNum += result[i].count;
    }
  })
  db.find("SELECT * FROM store", function (result) {
    data = result;
    res.render('client/index', {
      data,
      userinfo: req.session.userinfo,
      shopNum
    });
  })
})

// 用户登录
router.post('/login', function (req, res) {
  // console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;
  db.find("SELECT * FROM user where username='" + username + "' AND password='" + password + "'", function (result) {
    if (result[0]) {
      // 用户密码正确，登录成功
      req.session.userinfo = result[0].username;
      res.redirect('/');
    } else {
      // 登录失败
      res.send('<script> alert("用户名或密码错误"); history.go(-1); </script>')
    }
  })
})

// 用户退出登录
router.get('/loginOut', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  })
})

// 用户注册
router.get('/register', function(req, res) {
  res.render('client/register');
})
router.post('/doRegister', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  db.find("SELECT * FROM user where username='" + username + "'", function (result) {
    if (result[0]) {
      // 表中已经有该用户名，用户名已经存在，注册失败
      res.send('<script> alert("用户名已经存在"); history.go(-1); </script>');
    } else {
      // 可以注册
      var addSql = 'INSERT INTO user(Id,username,password) VALUES(0,?,?)';
      var addSqlParams = [username, password];
      db.add(addSql, addSqlParams, function(re) {
        res.redirect('/login');
      });
    }
  })
})
// 注册时进行ajax，查询用户名是否已经存在
router.get('/registerAjax', function(req, res) {
  var username = req.query.username;
  db.find('SELECT * FROM user WHERE username="' + username + '"', function(result) {
    if (result[0]) {
      res.send("用户名已存在");
    } else {
      res.send("OK！");
    }
  })
})


// 购物车路由
router.get('/cart', function (req, res) {
  // 若已登录则可以进入购物车
  if (req.session.userinfo) {
    db.find("SELECT * FROM cart", function (result) {
      var data = result;
      res.render('client/cart', {
        userinfo: req.session.userinfo,
        data
      });
    })
  } else {
    // 未登录则跳转到登陆页面
    res.redirect('/login');
  }
})

// 加入购物车路由
router.get('/addToCart', function (req, res) {
  // 若已登录则可以进入购物车
  if (req.session.userinfo) {
    var id = req.query.id;
    // 从store 表中找出数据加入 cart 表中
    db.find('SELECT * FROM store where id="' + id + '"', function (result) {
      var name = result[0].name;
      var pic = result[0].pic;
      var details = result[0].details;
      var price = result[0].price;
      // 判断加入的商品是否已在购物车中，若存在则count数量加一，不存在则创建
      db.find('SELECT * FROM cart where name="' + name + '"', function (result2) {
        // console.log(result2);
        if (result2[0]) {
          var count = result2[0].count + 1;
          var sql = "UPDATE cart SET count=? WHERE name=?";
          var addSqlParams = [count, name];
          db.update(sql, addSqlParams, function (result) {
            res.redirect('/client');
          })
        } else {
          var sql = "INSERT INTO cart(id,name,pic,details,price) VALUES(0,?,?,?,?)";
          var addSqlParams = [name, pic, details, price];
          db.add(sql, addSqlParams, function (result) {
            res.redirect('/client');
          })
        }
      })
    })
  } else {
    // 未登录则跳转到登陆页面
    res.redirect('/login');
  }
})

// 从购物车中删除商品
router.get('/deleteCart', function (req, res) {
  var id = req.query.id;
  db.delete('DELETE FROM cart where id="' + id + '"', function (result) {
    res.redirect('/client/cart');
  })
})

// 购物车增加商品数量
router.get('/addCartNum', function (req, res) {
  var id = req.query.id;
  db.find('SELECT * FROM cart where id="' + id + '"', function (result) {
    var count = result[0].count;
    var modSql = 'UPDATE cart SET count=? WHERE Id = ?';
    var modSqlParams = [count+1, id];
    db.update(modSql, modSqlParams, function(re) {
      res.redirect('/client/cart');
    })
  })
})

// 购物车减少商品数量
router.get('/reduceCartNum', function (req, res) {
  var id = req.query.id;
  db.find('SELECT * FROM cart where id="' + id + '"', function (result) {
    var count = result[0].count;
    var modSql = 'UPDATE cart SET count=? WHERE Id = ?';
    var num = count-1;
    if (num <= 1) {
      num = 1;
    }
    var modSqlParams = [num, id];
    db.update(modSql, modSqlParams, function(re) {
      res.redirect('/client/cart');
    })
  })
})

module.exports = router;