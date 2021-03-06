var express = require('express'),
router  = express.Router();

var usersController = require('../controllers/usersController');
var commentsController = require('../controllers/commentsController');
var authenticationsController = require('../controllers/authenticationsController');

router.post('/login', authenticationsController.login);
router.post('/register', authenticationsController.register);

router.route('/users')
  .get(usersController.usersIndex);

router.route('/users/:id') 
  .get(usersController.usersShow)
  .put(usersController.usersUpdate);

router.route('/users/:id/commentsreceived')
  .get(commentsController.commentsReceived);

router.route('/users/:id/pending')
  .get(usersController.usersPending);

router.route('/users/:id/friendrequest')
  .put(usersController.usersSendFriendRequest)

router.route('/users/:id/acceptfriendrequest')
  .put(usersController.usersAcceptFriendRequest)

router.route('/users/:id/denyfriendrequest')
  .put(usersController.usersDenyFriendRequest)

router.route('/comments')
  .get(commentsController.commentsIndex)
  .post(commentsController.commentsCreate)

module.exports = router;