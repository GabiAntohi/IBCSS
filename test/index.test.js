var request = require('supertest');
const sinon = require('sinon');
var Blog = require("../models/blog.model");

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
    var config = {
        mongoURI: "mongodb://localhost:27017/ibcss",
    };
    beforeEach(function () {
        app = require('../app');
        server = app(config);
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
    var config = {
        mongoURI: "mongodb://localhost:27017/ibcss",
    };
    beforeEach(function () {
        app = require('../app');
        server = app(config);
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