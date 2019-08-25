var express = require('express');
var router = express.Router();
var db = require('../modules/db');
var fs = require('fs');

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
router.use(multer({ dest: "./uploads" }).array("pic"));

// 增加商品路由
router.get('/add', function (req, res) {
  res.render('admin/product/add');
})

// 执行添加商品
router.post('/doAdd', function (req, res) {
  // console.log(req.body);
  // console.log(req.files);
  var fname = req.files[0].filename;  //获取上传文件的名字
  var oname = req.files[0].originalname;  //获取上传文件的原始名字, 带后缀名，存入数据库
  var name = req.body.name;
  var price = req.body.price;
  var details = req.body.details;
  var sql = "INSERT INTO store(id,name,pic,details,price) VALUES(0,?,?,?,?)";
  var addSqlParams = [name, oname, details, price];

  // 将上传的图片存入本地 uploads 文件夹中
  fs.readFile('./uploads/' + fname, function (err, data) {
    // 写入图片
    fs.writeFile('./uploads/' + oname, data, function (err, data) {
      //写入文件
      if (!err) {
        console.log('写入图片成功！')
      } else {
        console.log(err);
      }
    })

    // 删除生成的临时文件
    fs.unlink('./uploads/' + fname, function (err) {
      if (err) {
        console.log(err)
      }
    });

    // 将添加的商品存入数据库
    db.add(sql, addSqlParams, function (result) {
      res.redirect('/admin')
    });
  })

})

// 删除商品路由
router.get('/delete', function (req, res) {
  // 根据传过来的 id 值删除商品
  var id = req.query.id;
  db.find("SELECT * FROM store where id='" + id + "'", function (result) {
    // 从数据库删除商品
    db.delete("DELETE FROM store where id='" + id + "'", function (result) {

    })
    // 删除商品时把对应的本地的图片删掉
    // console.log(result[0].pic);
    fs.unlink('./uploads/' + result[0].pic, function (err) {
      if (err) {
        console.log(err);
        return;
      }
    });

    res.redirect('/admin');
  });
})

// 修改商品路由
var picSrc = "";    // 保存修改前的图片
var originalID;   //保存要被修改的记录的id
router.get('/edit', function (req, res) {
  // 根据 id 获取要修改的商品的原有信息
  var id = req.query.id;
  originalID = id;
  db.find("SELECT * FROM store WHERE id='" + id + "'", function (result) {
    var data = result[0];
    picSrc = result[0].pic;
    res.render('admin/product/edit', { data });
  })
})

// 执行修改商品
router.post('/doEdit', function (req, res) {
  // console.log(req.body);
  // console.log(req.files);
  var name = req.body.name;
  var price = req.body.price;
  var details = req.body.details;
  // 修改了图片
  if (req.files[0]) {
    var fname = req.files[0].filename;
    var oname = req.files[0].originalname;
    var pic = oname;

    // 将上传的图片存入本地 uploads 文件夹中
    fs.readFile('./uploads/' + fname, function (err, data) {
      // 写入图片
      fs.writeFile('./uploads/' + oname, data, function (err, data) {
        //写入文件
        if (!err) {
          console.log('写入图片成功！')
        } else {
          console.log(err);
        }
      })

      // 删除生成的图片临时数据文件
      fs.unlink('./uploads/' + fname, function (err) {
        if (err) {
          console.log(err)
        }
      });
      // 删除原来被修改前的图片
      fs.unlink('./uploads/' + picSrc, function (err) {
        if (err) {
          console.log(err)
        }
      });
    })
  } else {
    // 未修改图片
    // console.log(picSrc);  //修改前的图片
    var pic = picSrc;
  }

  // 将更新商品 存入数据库
  var modSql = 'UPDATE store SET name = ?,pic = ?,details = ?,price = ? WHERE id = ?';
  var modSqlParams = [name, pic, details, price, originalID];
  db.update(modSql, modSqlParams, function (result) {
    res.redirect('/admin')
  })
})

// 搜索商品路由
router.get('/search', function(req, res) {
  var name = req.query.name;
  var list = [];
  db.find('SELECT * FROM store', function(result) {
    for (var i = 0; i < result.length; i ++) {
      if (result[i].name.toLowerCase().indexOf(name) != -1) {
        list.push(result[i])
      }
    }
    res.render('admin/product/search', {data: list});    
  })
})  


module.exports = router;