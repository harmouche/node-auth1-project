const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);

const usersRouter = require("../users/users-router.js");
const authRouter = require('../auth/auth-router')


const server = express();

const sessionConfig = {
  name:'monley',
  secret:'Allah wahad',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, //secure to send to http secured
    httpOnly: true  //hide cookies from javascript only accessable through http
  },
  resave: false, //has to do with databases (didn't elaborate)
  saveUninitialized: false,  //save cookies without the concent of the user
  store: new knexSessionStore({
    knex: require('../database/config'), // connectio.js is the database config file in this project
    tablename: 'sessions', //table to contain sessions
    sidfieldname: 'sid', //session id column
    clearInterval: 1000* 60 * 60
  })
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/users", usersRouter);
server.use('/api/auth', authRouter);


server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;
