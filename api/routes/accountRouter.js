const express = require('express');
const accountController = require('../controllers/accountController');

const accountRouter = express.Router();

accountRouter.post('/', accountController.createUser);
accountRouter.post('/login', accountController.loginUser);
accountRouter.post('/message', accountController.writeMessage);
accountRouter.delete('/message', accountController.deleteMessage);
accountRouter.post('/:userLogin/like/:id', accountController.likeReview);
accountRouter.get('/', accountController.findUser);
accountRouter.get('/search', accountController.search);
accountRouter.put('/', accountController.changeUser);
accountRouter.delete(
  '/:userLogin/dislike/:id',
  accountController.dislikeReview,
);
accountRouter.delete('/:login', accountController.deleteUser);

module.exports = accountRouter;
