const express = require('express');
const messageController = require('../controllers/messageController');

const messageRouter = express.Router();

messageRouter.get('/', messageController.getMessages);

module.exports = messageRouter;
