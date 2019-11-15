var createError = require('http-errors');
var express = require('express');
var path = require('path');

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const stripeMod = require('stripe');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require("express-handlebars");

// DB Config
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function stopDB(done) {
    mongoose.disconnect(done)
}

function makeServer(config) {
    var stripe = stripeMod(config.stripeSecretKey);
// Connect to MongoDB
    mongoose
        .connect(config.mongoURI, { useNewUrlParser: true })
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

    var debug = require('debug')('ibcss:server');
    var http = require('http');

    /**
     * Get port from environment and store in Express.
     */

    var port = normalizePort(process.env.PORT || '3000');
    app.set('port', port);

    ////////
    var server = app.listen(port, function () {
        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
    });
    return server;
    ////////

    /**
     * Create HTTP server.
     */

    var server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    return server
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}


module.exports = makeServer;
module.exports.stopDB = stopDB;
//start the server
//app.listen(3000, function () {
   // console.log("started port 3000");
//});
