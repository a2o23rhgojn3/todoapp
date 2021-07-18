var express = require('express');
var router = express.Router();

var dbget = require('../db/get.js');
var dball = require('../db/all.js');
var dbdo = require('../db/exec.js');

// login page
router.get('/login', function(req, res, next){
  res.render('login', {
    title: 'Login',
    login: req.session.login,
  });
});
router.post('/login', async function(req, res, next){
  let account = req.body.account;
  let pass = req.body.password;
  let sql = "select * from users where account='"
            + account + "'and password='" + pass + "'";
  let record = await dbget.getRow(sql);
  if(record != undefined){
    req.session.login = record;
  }
  res.redirect('/');
});

// logout
router.get('/logout', function(req, res, next){
  req.session.login = undefined;
  res.redirect('/users/login');
});

// admin(add new user)
router.get('/admin', async function(req, res, next){
  if(req.session.login == undefined){
    return res.redirect('/users/login');
  }
  if(req.session.login.role != 'admin'){
    return res.redirect('/users/login');
  }
  res.render('admin', {
    title: 'Admin',
    login: req.session.login,
  });
});
router.post('/admin', async function(req, res, next){
  let account = req.body.account;
  let pass = req.body.passward;
  let name = req.body.name;
  let sql = "insert into users (account, passward, name, role) values('" + account + "','" + pass + "','" + name + "','user')";
  await dbdo.exec(sql);
  res.render('admin', {
    title: 'Admin',
    login: req.session.login,
  });
});

// show user list
router.get('/admin2', async function(req, res, next){
  if(req.session.login == undefined){
    return res.redirect('/users/login');
  }
  if(req.session.login.role != 'admin'){
    return res.redirect('/users/login');
  }
  let sql = "select * from users";
  let records = await dball.getAllRows(sql);
  res.render('admin2', {
    title: 'Admin2',
    login: req.session.login,
    data: records,
  });
});

// delete user
router.get('/del_usr', async function(req, res, next){
  if(req.session.login == undefined){
    return res.redirect('/users/login');
  }
  if(req.session.login.role != 'admin'){
    return res.redirect('/users/login');
  }
  let id = req.query.id;
  let sql = 'delete from users where id=' + id;
  await dbdo.exec(sql);
  res.redirect('/users/admin2');
});

module.exports = router;
