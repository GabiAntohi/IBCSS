"use strict";
const assert = require('assert');
const app = require('../app');
const TEST_DEBUG = process.env.TEST_DEBUG || false;

describe('app', function() {
    it('throws if sessionSecret is missing', function testPath(done) {
        assert.throws(function () {
            app({
                mongoURI: "mongodb://localhost:27017/ibcss",
            })
        }, "sessionSecret missing");
        done();
    });

    it('throws if sessionSecret is null/empty', function testPath(done) {
        assert.throws(function () {
            app({
                mongoURI: "mongodb://localhost:27017/ibcss",
                sessionSecret: null,
            })
        }, "sessionSecret missing");
        done();
    });

    it('accepts non empty secret', function testPath(done) {
        // This test will start a server instance, don't forget to close
        assert.doesNotThrow(function () {
            app({
                mongoURI: "mongodb://localhost:27017/ibcss",
                sessionSecret: "abc",
            })
                .then(function(server) {
                    app.stopDB()
                    server.close()
                    done()
                });
        });
    });
});