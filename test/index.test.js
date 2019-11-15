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

describe('loading express', function () {
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
    it('responds to /', function testSlash(done) {
        var emptyBlogList = [];
        sinon.stub(Blog, 'find').yields(null, emptyBlogList);
        request(server)
            .get('/')
            .expect(200, done)
            .expect(expectBodyIncludes("Welcome to the Irish Cactus and Succulent Society Website"));
    });
    it('404 everything else', function testPath(done) {
        request(server)
            .get('/foo/bar')
            .expect(404, done);
    });
});