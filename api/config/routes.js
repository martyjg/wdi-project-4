var express = require('express'),
router  = express.Router();

var usersController = require('../controllers/usersController');
var authenticationsController = require('../controllers/authenticationsController');

router.post('/login', authenticationsController.login);
router.post('/register', authenticationsController.register);

router.route('/users')
  .get(usersController.usersIndex)

router.route('/users/:id') 
  .get(usersController.usersShow)
  .put(usersController.usersUpdate)

module.exports = router;