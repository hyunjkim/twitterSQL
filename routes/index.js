'use strict';
const express = require('express')
const router = express.Router();
const client = require('../db');
const join = ' FROM tweets INNER JOIN users ON tweets.user_id = users.id ';
// var tweetBank = require('../tweetBank');


module.exports = function makeRouterWithSockets (io) {

  // a reusable function
  function respondWithAllTweets (req, res, next){
    client.query('SELECT *' +join, function(err,result){
      if(err) return res.status(500).send({ error: 'something blew up' , err: err});
      let tweets = result.rows;
      res.render('index', {title: 'Twitter.js', tweets: tweets, showForm : true});
    })
  }
  //client.query('SELECT name FROM users WHERE name=$1', ['Nimit'], function (err, data) {/** ... */});
// client.query('INSERT INTO tweets (userId, content) VALUES ($1, $2)', [10, 'I love SQL!'], function (err, data) {/** ... */});

  // here we basically treet the root view and tweets view as identical
  router.get('/', respondWithAllTweets);
  router.get('/tweets', respondWithAllTweets);

  // single-user page
  router.get('/users/:username', function(req, res, next){
    let name = req.params.username;
    console.log('LINE 30**',name);
    client.query('SELECT *' +join+ 'WHERE name = $1',[name], (err,result) => {
      if(err) return res.status(500).send({result : result})
      let tweetsForName = result.rows;
      res.render('index', {
        title: 'Twitter.js',
        tweets: tweetsForName,
        showForm: true,
        username: name
      });
    })
  });

  // single-tweet page
  router.get('/tweets/:id', function(req, res, next){
    let tweetsWithThatId = Number(req.params.id);
    client.query('SELECT content' + join + 'WHERE users.id = $1',[tweetsWithThatId], (err,result) => {
      if(err) return res.status(500).send({result : result})
      let tweetsForName = result.rows;
      res.render('index', {
        title: 'Twitter.js',
        tweets: tweetsForName,
        showForm: true,
      });
    })
  });

  // create a new tweet
  router.post('/tweets', function(req, res, next){
    let newUser = req.body.name;
    let newTweet = req.body.content;
    let img = 'http://lorempixel.com/48/48?name='+ newUser;


    client.query('SELECT * FROM users WHERE name = $1',[newUser], (err,result) => {
      let tweetsForName = result.rows;
      if(err) return res.status(500).send({result : result})
      if(tweetsForName.length){
        addingTweet(tweetsForName[0].id,newTweet);
      } else {
        addingUser()
      };
    });

    function addingUser(){
        client.query('INSERT INTO users (name,picture_url) VALUES($1,$2) RETURNING *',[newUser,img], (err,result) =>{
          if(err) return res.status(500).send({result : result})
          let newUser = result.rows;
          addingTweet(newUser.id,newTweet);
        });
    }

    function addingTweet(id,content){
        client.query('INSERT INTO tweets(user_id,content) VALUES($1,$2) RETURNING *',[id,content], (err,result) =>{
          if(err) return res.status(500).send({result : result});
        });
      }
    res.redirect('/');
  });

  router.put('/tweets', function(req, res, next){
    // var newTweet = tweetBank.add(req.body.name, req.body.content);
    // io.sockets.emit('new_tweet', newTweet);
    // res.redirect('/');
  });

  router.delete('/tweets', function(req, res, next){
    // var newTweet = tweetBank.add(req.body.name, req.body.content);
    // io.sockets.emit('new_tweet', newTweet);
    // res.redirect('/');
  });

  // // replaced this hard-coded route with general static routing in app.js
  // router.get('/stylesheets/style.css', function(req, res, next){
  //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
  // });

  return router;
}
