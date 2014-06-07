/**
 *	@author Félix Girault <felix.girault@gmail.com>
 */
'use strict';

var co = require('co');
var should = require('should');
var Service = require('../../lib/service');
var OpenGraph = require('../../lib/services/opengraph');



/**
 *
 */
describe('OpenGraph', function() {
	var openGraph = null;
	var html = [
		'<html>',
			'<head>',
				'<meta property="og:title" content="Title" />',
				'<meta property="irrelevant" content="Irrelevant" />',
			'</head>',
		'</html>'
	].join('');

	beforeEach(function() {
		openGraph = new OpenGraph();
	});

	it('should extend Service', function() {
		openGraph.should.be.an.instanceOf(Service);
	});

	describe('#_fetch', function() {
		it('should fetch data from a page', function() {
			openGraph._get = function() {
				return function(cb) {
					cb(null, html);
				}
			};

			co(function *() {
				var data = yield openGraph._fetch('');
				data.should.have.property('og:title', 'Title');
			})();
		});
	});

	describe('#_extractProperties', function() {
		it('should extract OpenGraph properties', function() {
			var props = openGraph._extractProperties(html);

			props.should.eql({
				'og:title': 'Title'
			});
		});

		it('should throw an error when no properties can be extracted', function() {
			openGraph._extractProperties.bind(openGraph, '').should.throw();
		});
	});
});
