var createError = require('http-errors');
var express = require('express');
var path = require('path');
//next two lines for stripe payment
const keys = require('./keys/keys');
// const stripe = require('stripe')(keys.stripeSecretKey);
const stripe = require('stripe')('sk_test_37aQR0BLogkIjLroXwWC8WqN00GnnTp0I2');
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require("express-handlebars");
//connect mongoose
const mongoose = require("mongoose");
// DB Config
const db = require('./config/key').mongoURI;

// Connect to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('Remote MongoDB Connected...'))
    .catch(err => console.log(err));

//sessions
var session = require("express-session");
var passport = require("passport");
var flash = require("connect-flash");
var validator = require('express-validator');
//after importing the session package
const MongoStore = require('connect-mongo')(session);
const multer = require('multer');

//for PUT and DELETE
var methodOverride = require('method-override'); 
// var indexRouter = require('./routes/index', {
//   stripePublishableKey: 'pk_test_EHq1USOjmhVbQJ9iebQFeoap00LURhhpdQ' //keys.stripePublishableKey
// });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var shopRouter = require('./routes/shop');
var blogRouter = require('./routes/blog');
var contactRouter = require('./routes/contact');
var adminRouter = require('./routes/admin');
var app = express();

//mongoose.connect('mongodb://localhost:27017/ibcss', { useNewUrlParser: true });
//let db = mongoose.connection;
//check connection
//db.once("open", function () {
   // console.log("connected to mongodb");
//});
//check for db errors
//db.on("error", function (err) {
  //  console.log(err);
//});

app.use(methodOverride('_method'));
//load configuration from config file - setup passport
require("./config/passport");
app.set('views', path.join(__dirname, 'views'));
// view engine setup
app.engine(".hbs", expressHbs({ defaultLayout: "layout", extname: ".hbs" }));
app.set('view engine', '.hbs');


//get body parser from https://github.com/expressjs/body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

//-validator - start after body-parser if not you cannot validate
//app.use(validator());
// Routes
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());

app.get('/about', function (req, res) {
    res.render("about/about", { title: 'About IBCSS' });
});

//sessions
//defaults are true - session saved even if not initialized 
app.use(session({
    secret: "mycarnivale", resave: false, saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }//how long session lasts before it expires
})
);

//very important - initialize flash and passport after session 
app.use(flash());
app.use(passport.initialize());
//after session init
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//global variable - available in all views
app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

//for stripe payment
app.post('/charge', (req, res) => {
    const amount = req.body.chargeAmount;
    console.log(req.body.chargeAmount);
    //   res.send('TEST');
    stripe.customers
        .create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken
        })
        .then(customer =>
            stripe.charges.create({
                amount: amount * 100,
                description: 'Purchase items',
                currency: 'eur',
                customer: customer.id
            })
        )
        .then(charge => res.render('shop/success'))
        .then(req.session.cart = null);
});
//for stripe payment end


app.use('/user', usersRouter);
app.use('/', indexRouter);
app.use('/admin', adminRouter);
//products
app.use('/shop', shopRouter);
app.use('/blog', blogRouter);
app.use("/contact", contactRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
//start the server
//app.listen(3000, function () {
   // console.log("started port 3000");
//});
