const cheerio = require('cheerio');
const mongoose = require('mongoose');
const request = require('supertest');
const User = require("../../models/user.model");
const bcrypt = require("bcrypt-nodejs");
var TEST_DEBUG = process.env.TEST_DEBUG || false;

function testDebug(msg) {
    if (TEST_DEBUG) {
        console.log(msg)
    }
}

function expectBodyIncludes(stringToMatch) {
    return function (res) {
        if (!(res.text.includes(stringToMatch))) {
            throw new Error("expected response body to contain '"+stringToMatch+"'")
        }
    }
}

/**
 * Note: I ran into some weird non-determinism initially with this test
 * A 'random' blog would be missing like 5% of the time. After rewriting
 * it seems to be fixed, but if test randomly fail, do also review this
 * test for correctness
 */
describe('user', function () {
    var passwordPasswordHash = bcrypt.hashSync("password", bcrypt.genSaltSync(5), null);

    describe('registration', function() {
        describe('form', function () {
            var app;
            var server;
            var config = {
                mongoURI: "mongodb://localhost:27017/ibcss",
            };

            beforeEach(function () {
                app = require('../../app');
                return app(config)
                    .then(function (s) {
                        server = s
                    });
            });
            afterEach(function (done) {
                server.close();
                app.stopDB();
                done()
            });

            it('shows form', function testSlash(done) {
                request(server)
                    .get('/user/register')
                    .expect(expectBodyIncludes("Create an account"))
                    .expect(expectBodyIncludes("Email"))
                    .expect(expectBodyIncludes("Password"))
                    .expect(200, done)
                ;
            });
        });

        describe('form submit', function () {
            var app;
            var server;
            var config = {
                mongoURI: "mongodb://localhost:27017/ibcss",
            };

            beforeEach(function () {
                app = require('../../app');
                return app(config)
                    .then(function (s) {
                        server = s
                    });
            });
            afterEach(function (done) {
                server.close();
                app.stopDB();
                done()
            });

            it('redirects to profile on success', function testSlash(done) {
                mongoose.createConnection(config.mongoURI, {
                    useNewUrlParser: true
                })
                    .then(() => {
                        testDebug("Delete old users");
                        return User.deleteMany({});
                    })
                    .then(() => {
                        testDebug("Start test");
                        request(server)
                            .get('/user/register')
                            .expect(200)
                            .end(function(err, getres) {
                                let $ = cheerio.load(getres.text);
                                var csrfToken = $("#_csrf").val();
                                request(server)
                                    .post('/user/register')
                                    .set({cookie: getres.headers['set-cookie']})
                                    .send({
                                        _csrf: csrfToken,
                                        email: "testuser@domain.localhost",
                                        password: "password"
                                    })
                                    .expect(function (res) {
                                        if (!res.header['location'].includes('/user/profile')) {
                                            throw new Error("expected redirect to profile page: " + res.header['location'])
                                        }
                                    })
                                    .expect(302)
                                    .end(done);
                            })
                        ;
                    })
                    .catch((err) => {
                        testDebug(err);
                        throw err;
                    });
            });
        });
    });

    describe('login', function () {
        describe('form', function () {
            var app;
            var server;
            var config = {
                mongoURI: "mongodb://localhost:27017/ibcss",
            };

            beforeEach(function () {
                app = require('../../app');
                return app(config)
                    .then(function (s) {
                        server = s
                    });
            });
            afterEach(function (done) {
                server.close();
                app.stopDB();
                done()
            });

            it('shows form', function testSlash(done) {
                request(server)
                    .get('/user/login')
                    .expect(expectBodyIncludes("Log In"))
                    .expect(expectBodyIncludes("Email"))
                    .expect(expectBodyIncludes("Password"))
                    .expect(expectBodyIncludes("Don't have an account?"))
                    .expect(expectBodyIncludes("Register instead!"))
                    .expect(200, done)
                ;
            });
        });

        describe('submit', function () {
            var app;
            var server;
            var config = {
                mongoURI: "mongodb://localhost:27017/ibcss",
            };

            beforeEach(function () {
                app = require('../../app');
                return app(config)
                    .then(function (s) {
                        server = s
                    });
            });
            afterEach(function (done) {
                server.close();
                app.stopDB();
                done()
            });

            it('on success, redirects to profile', function testSlash(done) {
                mongoose.createConnection(config.mongoURI, {
                    useNewUrlParser: true
                })
                    .then(() => {
                        testDebug("Delete old users");
                        return User.deleteMany({});
                    })
                    .then(() => {
                        let user = new User({
                            name: "Abe Froman",
                            email: "abefroman@domain.localhost",
                            // lowest cost factor
                            password: passwordPasswordHash,
                            isAdmin: false,
                        });
                        return user.save()
                    })
                    .then(() => {
                        testDebug("Start test");
                        request(server)
                            .get('/user/login')
                            .expect(200)
                            .then(function (getres) {
                                let $ = cheerio.load(getres.text);
                                var csrfToken = $("#_csrf").val();
                                testDebug("With CSRF token " + csrfToken);
                                var reqCookie = getres.headers['set-cookie'];
                                return request(server)
                                    .post('/user/login')
                                    .set({cookie: reqCookie})
                                    .send({
                                        _csrf: csrfToken,
                                        email: "abefroman@domain.localhost",
                                        password: "password"
                                    })
                                    .expect(function (res) {
                                        if (!res.header['location'].includes('/user/profile')) {
                                            throw new Error("expected redirect to profile page: " + res.header['location'])
                                        }
                                    })
                                    .expect(302)
                                    .then(function () {
                                        return reqCookie;
                                    });
                            })
                            .then(function (reqCookie) {
                                return request(server)
                                    .get('/user/profile')
                                    .set({cookie: reqCookie})
                                    .expect(200)
                                    .expect(expectBodyIncludes("Your Profile"))
                                    .then(function () {
                                        done();
                                    });
                            });
                    })
                    .catch((err) => {
                        testDebug(err);
                        throw err;
                    });
            });

            it('incorrect password, redirects to login', function testSlash(done) {
                mongoose.createConnection(config.mongoURI, {
                    useNewUrlParser: true
                })
                    .then(() => {
                        testDebug("Delete old users");
                        return User.deleteMany({});
                    })
                    .then(() => {
                        testDebug("Add test user");
                        let user = new User({
                            name: "Abe Froman",
                            email: "abefroman@domain.localhost",
                            // lowest cost factor
                            password: passwordPasswordHash,
                            isAdmin: false,
                        });
                        return user.save()
                    })
                    .then(() => {
                        testDebug("Start test");
                        request(server)
                            .get('/user/login')
                            .expect(200)
                            .then(function (getres) {
                                let $ = cheerio.load(getres.text);
                                var csrfToken = $("#_csrf").val();
                                testDebug("With CSRF token " + csrfToken);
                                var reqCookie = getres.headers['set-cookie'];
                                request(server)
                                    .post('/user/login')
                                    .set({cookie: reqCookie})
                                    .send({
                                        _csrf: csrfToken,
                                        email: "abefroman@domain.localhost",
                                        password: "password2"
                                    })
                                    .expect(function (res) {
                                        if (!res.header['location'].includes('/user/login')) {
                                            throw new Error("expected redirect to profile page: " + res.header['location'])
                                        }
                                    })
                                    .expect(302, done);
                            })

                    })
                    .catch((err) => {
                        testDebug(err);
                        throw err;
                    });
            });

            it('unknown user, redirects to login', function testSlash(done) {
                mongoose.createConnection(config.mongoURI, {
                    useNewUrlParser: true
                })
                    .then(() => {
                        testDebug("Delete old users");
                        return User.deleteMany({});
                    })
                    .then(() => {
                        testDebug("Start test");
                        request(server)
                            .get('/user/login')
                            .expect(200)
                            .then(function (getres) {
                                let $ = cheerio.load(getres.text);
                                var csrfToken = $("#_csrf").val();
                                testDebug("With CSRF token " + csrfToken);
                                var reqCookie = getres.headers['set-cookie'];
                                request(server)
                                    .post('/user/login')
                                    .set({cookie: reqCookie})
                                    .send({
                                        _csrf: csrfToken,
                                        email: "rowanatkinson@domain.localhost",
                                        password: "password"
                                    })
                                    .expect(function (res) {
                                        if (!res.header['location'].includes('/user/login')) {
                                            throw new Error("expected redirect to profile page: " + res.header['location'])
                                        }
                                    })
                                    .expect(302, done);
                            })

                    })
                    .catch((err) => {
                        testDebug(err);
                        throw err;
                    });
            });
        });
    });
});