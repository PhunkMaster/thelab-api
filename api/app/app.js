'use strict'

var express = require("express")
var app = express()
var mysql = require("mysql")
var _ = require("lodash")
var config = require("./config.json")
var con = mysql.createConnection(config.mysql)
var bodyParser = require("body-parser")

var jsonParser = bodyParser.json()

app.route("/")
  .get(function (req, res, next) {
    res.json({"data":"ok"})
  })
  .post(jsonParser, function (req, res, next) {
    console.log(req.body)
    con.query(`REPLACE INTO users(name, email, badge_num, disabled) VALUES(?, ?, ?, false);`,[
        req.body.name,
        req.body.email,
        req.body.badge_num
      ],
      function(err, results, fields) {
        if (err) {
          console.error(err)
        } else {
          console.log(results)
        }
      }
    )
    res.json(req.body)
  })
  .all(function (req, res, next) {
    res.json({"error":"INVALID VERB"})
  })

app.route("/members")
  .get(function (req, res, next) {
    con.query(`SELECT * FROM members`,
      function(err, results, fields) {
        if (err) {
          console.error('Error Creating table members:', err)
        } else if (_.isEmpty(results)) {
          res.send("No results found")
        } else if (!_.isEmpty(results)) {
          res.json({results})
        }
      }
    )
  })
  .post(jsonParser, function(req, res, next) {
     con.query(`REPLACE INTO members(name, email, badge_num, disabled) VALUES(?, ?, ?, false);`,[
        req.body.name,
        req.body.email,
        req.body.badge_num
      ],
      function(err, results, fields) {
        if (err) {
          console.error(err)
          res.send('There was an error inserting the user: ', err)
        } else {
          res.send('OK')
        }
      }
    )
  })

app.route("/ping")
  .get(function (req, res, next) {
    res.send("pong\n")
  })
  .all(function (req, res, next) {
    res.json({"error":"INVALID VERB"})
  })

app.use(bodyParser.json())

app.listen(3000, () => {
  con.connect(function (err) {
    if (err) {
      return console.error('error: ' + err.message)
    }

    var createMembers = `CREATE TABLE IF NOT EXISTS members(
                    id INT PRIMARY KEY auto_increment,
                    name VARCHAR(255) NOT null,
                    email VARCHAR(255) NOT null,
                    badge_num INT,
                    voting BOOLEAN NOT null default false,
                    created DATETIME default CURRENT_TIMESTAMP,
                    disabled INT,
                    disabled_date DATETIME
                )`

    var createUsers = `CREATE TABLE IF NOT EXISTS users(
                    userId INT PRIMARY KEY NOT null,
                    username VARCHAR(255) NOT null,
                    password VARCHAR(255) NOT null
                  )`

    con.query(createMembers, function(err, results, fields) {
        if (err) {
          console.error('Error Creating table users:', err)
        }
    })

    con.query(createUsers, function(err, results, fields) {
        if (err) {
          console.error('Error Creating table users:', err)
        }
    })
    
  console.log("server running on port 3000")
  })
})

