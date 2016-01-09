var express        = require('express');
var cors           = require('cors');
var path           = require('path');
var multer         = require('multer');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var passport       = require('passport');
var cookieParser   = require("cookie-parser");
var methodOverride = require("method-override");
var jwt            = require('jsonwebtoken');
var expressJWT     = require('express-jwt');
var uuid           = require('uuid');

var PORT           = process.env.PORT || 3000;

var app            = express();

var config         = require('./config/config');
var secret         = require('./config/config').secret;

var mongoUri = process.env.MONGOLAB_URI || config.database;

// var mongoUri = config.database;

mongoose.connect(mongoUri);

require('./config/passport')(passport);

var upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, next) {
      next(null, './uploads');
    },
    filename: function(req, file, next) {
      // console.log("This be the request", req.body)
      console.log("This be the file", file)
      var ext = '.' + file.mimetype.replace('image/', '');
      var filename = uuid.v1() + ext;
      next(null, filename);
    }
  })
});

app.post('/upload', upload.single('file'), function(req, res) {
  return res.status(200).json({ filename: req.file.filename });
});

app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());
app.use(passport.initialize());

app.use('/api', expressJWT({ secret: secret })
  .unless({
    path: [
    { url: '/api/login', methods: ['POST'] },
    { url: '/api/users', methods: ['GET'] },
    { url: '/api/register', methods: ['POST'] },
    { url: '/api/users/:id/pending', methods: ['GET'] },
    { url: '/api/users/pending', methods: ['GET'] }
    ]
  }));

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({message: 'Unauthorized request.'});
  }
  next();
});

var routes = require('./config/routes');
app.use("/api", routes);

app.use(express.static('front-end'));

app.listen(PORT);

console.log("Listening on..." + PORT)