var request = require('supertest');
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
        request(server)
            .get('/')
            .expect(200, done);
    });
    it('404 everything else', function testPath(done) {
        request(server)
            .get('/foo/bar')
            .expect(404, done);
    });
});