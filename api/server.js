const express = require("express");
const helmet = require("helmet");

const usersRouter = require("../users/users-router");

const server = express();

server.use(helmet());
server.use(express.json());

server.use("/api/users", usersRouter);

module.exports = server;