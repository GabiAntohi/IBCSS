const cheerio = require('cheerio');
const mongoose = require('mongoose');
const request = require('supertest');
const User = require("../../models/user.model");
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
    describe('register form', function () {
        var app;
        var server;
        var config = {
            mongoURI: "mongodb://localhost:27017/ibcss",
        };

        beforeEach(function (done) {
            app = require('../../app');
            server = app(config);
            done()
        });
        afterEach(function (done) {
            server.close();
            app.stopDB();
            done()
        });

        it('shows form input', function testSlash(done) {
            request(server)
                .get('/user/register')
                .expect(expectBodyIncludes("Create an account"))
                .expect(expectBodyIncludes("Email"))
                .expect(expectBodyIncludes("Password"))
                .expect(200, done)
            ;
        });
    });

    describe('submit form', function () {
        var app;
        var server;
        var config = {
            mongoURI: "mongodb://localhost:27017/ibcss",
        };

        beforeEach(function (done) {
            app = require('../../app');
            server = app(config);
            done()
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