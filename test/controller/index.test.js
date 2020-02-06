var request = require('supertest');
const sinon = require('sinon');
const mongoose = require('mongoose');
var Blog = require("../../models/blog.model");
var TEST_DEBUG = process.env.TEST_DEBUG || false;

var config = {
    mongoURI: "mongodb://localhost:27017/ibcss",
    sessionSecret: "testing-mycarnivale"
};

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

describe('the app', function() {
    var app;
    var server;

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

    it('displays 404 errors', function testPath(done) {
        request(server)
            .get('/foo/bar')
            .expect(404, done);
    });
});

describe('home page', function () {
    var app;
    var server;

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
        Blog.find.restore(); // cleanup effects of test
        done()
    });
    it('responds to / with no blogs', function testSlash(done) {
        let emptyBlogList = [];
        sinon.stub(Blog, 'find').yields(null, emptyBlogList);
        request(server)
            .get('/')
            .expect(200, done)
            .expect(expectBodyIncludes("Welcome to the Irish Cactus and Succulent Society Website"));
    });
    it('responds to / with blogs', function testSlash(done) {
        let blog1 = new Blog;
        blog1.imagePath = "";
        blog1.title = "Announcing new website";
        blog1.author = "admin";
        blog1.content = "at last!";
        blog1.tag = "news";

        sinon.stub(Blog, 'find').yields(null, [blog1]);
        request(server)
            .get('/')
            .expect(200, done)
            .expect(expectBodyIncludes("Welcome to the Irish Cactus and Succulent Society Website"))
            .expect(expectBodyIncludes("Announcing new website"))
            .expect(expectBodyIncludes("at last!"));
    });
});

/**
 * Note: I ran into some weird non-determinism initially with this test
 * A 'random' blog would be missing like 5% of the time. After rewriting
 * it seems to be fixed, but if test randomly fail, do also review this
 * test for correctness
 */
describe('home page with live db', function () {
    var app;
    var server;

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
        mongoose.disconnect()
        done()
    });

    it('responds to / with blogs', function testSlash() {
        return mongoose.createConnection(config.mongoURI, {
            useNewUrlParser: true
        })
            .then(() => {
                testDebug("Delete old blogs");
                return Blog.deleteMany({});
            }).then(() => {
                testDebug("Populate blogs");
                var blogs = [
                    new Blog({
                        imagePath: 'https://images.pexels.com/photos/37076/pots-plants-cactus-succulent.jpg',
                        title: 'Announcing new website',
                        content: 'at last!',
                        author: "Admin1",
                        tag: "cactus"
                    }),
                    new Blog({
                        imagePath: 'https://images.pexels.com/photos/37076/pots-plants-cactus-succulent.jpg',
                        title: 'Announcing 2019 cactus show',
                        content: 'Thanks to the Botanical Gardens for hosting it',
                        author: "Admin2",
                        tag: "cactus"
                    }),
                ];
                return Promise.all(blogs.map((blog) => {
                    return blog.save()
                }))
            })
            .then(() => {
                testDebug("Start test");
                return request(server)
                    .get('/')
                    .expect(expectBodyIncludes("Welcome to the Irish Cactus and Succulent Society Website"))
                    .expect(expectBodyIncludes("Announcing new website"))
                    .expect(expectBodyIncludes("at last!"))
                    .expect(expectBodyIncludes("Admin1"))
                    .expect(expectBodyIncludes("Announcing 2019 cactus show"))
                    .expect(expectBodyIncludes("Thanks to the Botanical Gardens for hosting it"))
                    .expect(expectBodyIncludes("Admin2"))
                    .expect(200);
            })
            .catch((err) => {
                testDebug(err);
                throw err;
            });
    });
});