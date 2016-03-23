'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  resource = mongoose.model('Resource');

/**
 * Globals
 */
var resource1, resource2, resource3;

/**
 * Unit tests
 */
describe('resource Model Unit Tests:', function () {
  before(function () {
    resource1 = {
      title: 'Title',
      url: 'URL',
      subject: 'abcedfg'
    };
    // resource2 is a clone of resource1
    resource2 = resource1;
    resource3 = {
      title: 'diffTitle',
      url: 'diffURL',
      subject: 'diffabcedfg'
    };
  });

  describe('Method Save', function () {

    it('should be able to save without problems', function (done) {
      var _resource1 = new resource(resource1);

      _resource1.save(function (err) {
        should.not.exist(err);
        _resource1.remove(function (err) {
          should.not.exist(err);
          done();
        });
      });
    });

    it('should fail to save an existing resource again', function (done) {
      var _resource1 = new resource(resource1);
      var _resource2 = new resource(resource2);

      _resource1.save(function () {
        _resource2.save(function (err) {
          should.exist(err);
          _resource1.remove(function (err) {
            should.not.exist(err);
            done();
          });
        });
      });
    });

    it('should be able to show an error when trying to save without title', function (done) {
      var _resource1 = new resource(resource1);

      _resource1.title = '';
      _resource1.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to save 2 different resources', function (done) {
      var _resource1 = new resource(resource1);
      var _resource3 = new resource(resource3);

      _resource1.save(function (err) {
        should.not.exist(err);
        _resource3.save(function (err) {
          should.not.exist(err);
          _resource3.remove(function (err) {
            should.not.exist(err);
            _resource1.remove(function (err) {
              should.not.exist(err);
              done();
            });
          });
        });
      });
    });

  });

});
