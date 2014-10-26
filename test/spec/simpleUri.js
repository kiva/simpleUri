/*global uri */
buster.spec.expose();


describe('uri', function () {
	'use strict';

	var expect = buster.expect;
	var mockUrl = 'http://kiva.org/path/folder/file.html?param1=one&param2=two#param1=uno&param2=dos';

	describe('uri()', function () {
		it('operates on the current url or a url that is passed into the kv.url() function', function () {
			expect(uri().href).toBe(window.location.href);
			expect(uri('http://kiva.org/path/folder/file.html?param1=one&param2=two#param1=uno&param2=dos').href).toBe('http://kiva.org/path/folder/file.html?param1=one&param2=two#param1=uno&param2=dos');
		});
	});


	describe('.parseString()', function () {
		it('parses a query string into a js object', function () {
			expect(uri.parseString('cheese=delicious,fatty,smelly&pizza=cheesy')).toEqual({cheese: 'delicious,fatty,smelly', pizza: 'cheesy'});
			expect(uri.parseString('q=cheesy:delicious,fatty,smelly;pizza:cheesy&enabled=true')).toEqual({q: 'cheesy:delicious,fatty,smelly;pizza:cheesy', enabled: 'true'});
		});


		it('parses unassigned query variables as values of an empty string', function () {
			expect(uri.parseString('q&m')).toEqual({q: '', m: ''});
		});
	});


	describe('uri.prototype', function () {

		describe('.port', function () {
			it('is the port for the url', function () {
				expect(uri('http://someurl:111/somepath').port).toBe('111');
			});


			it('is an empty string if there is no port', function () {
				expect(uri(mockUrl).port).toBe('');
			});
		});


		describe('.protocol', function () {
			it('gets the protocol for the url', function () {
				expect(uri().protocol).toBe(window.location.protocol.slice(0, -1));
				expect(uri(mockUrl).protocol).toBe('http');
				expect(uri('https://someurl.com').protocol).toBe('https');
			});


			it('is an empty string if the protocol is not specified', function () {
				expect(uri('someurl.com').protocol).toBe('');
			});
		});


		describe('.host', function () {
			it('is the host for the url', function () {
				expect(uri().host).toBe(window.location.hostname);
				expect(uri(mockUrl).host).toBe('kiva.org');
			});
		});


		describe('.path', function () {
			it('is the pathname for the url', function () {
				expect(uri().path).toBe(window.location.pathname);
				expect(uri(mockUrl).path).toBe('/path/folder/file.html');
			});
		});


		describe('.relative', function () {
			it('is the relative path for the url', function () {
				expect(uri(mockUrl).relative).toBe('/path/folder/file.html?param1=one&param2=two#param1=uno&param2=dos');
			});
		});


		describe('.file', function () {
			it('is the filename from the url', function () {
				expect(uri(mockUrl).file).toBe('file.html');
			});


			it('is an empty string if there is no filename', function () {
				expect(uri('http://kiva.org/path/folder/page').file).toBe('');
			});
		});


		describe('.query', function () {
			it('is the query string for the url', function () {
				expect(uri().query).toBe(window.location.search);
				expect(uri(mockUrl).query).toBe('param1=one&param2=two');
				expect(uri('http://kiva.org/path/folder/page').query).toBe('');
			});
		});


		describe('.hash', function () {
			it('is the hash string for the url', function () {
				expect(uri().hash).toBe(window.location.hash);
				expect(uri(mockUrl).hash).toBe('param1=uno&param2=dos');
				expect(uri('http://kiva.org/path/folder/page').hash).toBe('');
			});
		});


		describe('.href', function () {
			it('is the entire url', function () {
				expect(uri().href).toBe(window.location.href);
				expect(uri(mockUrl).href).toBe(mockUrl);
			});
		});


		describe('.open()', function () {
			it('opens a new window', function () {
				var newWindow = uri('basket').open(undefined, 'width=0,height=0');
				newWindow.close();

				expect(newWindow.toString()).toMatch('Window');
			});
		});


		describe('.load()', function () {
			it('loads a new url -- not testable', function () {
				expect(uri().load).toBeDefined();
			});
		});


		describe('.reload()', function () {
			it('reloads the current url -- not testable', function () {
				expect(uri().reload).toBeDefined();
			});
		});


		describe('.segment()', function () {
			it('returns an array of all segments', function () {
				expect(uri(mockUrl).segment()).toEqual(['path', 'folder', 'file.html']);
			});


			it('returns the segment corresponding to the index requested', function () {
				expect(uri(mockUrl).segment(1)).toBe('path');
			});


			it('returns the segment corresponding to the negative index requested', function () {
				expect(uri(mockUrl).segment(-1)).toBe('file.html');
			});
		});


		describe('.param', function () {
			it('gets parameters', function () {
				var mockUrl = 'http://kiva.org/path/folder/file.html?queryParam=qpVal#hashParam=hpVal'
				, expectedParams = {
					queryParam: 'qpVal'
					, hashParam: 'hpVal'
				};

				expect(uri(mockUrl).param()).toEqual(expectedParams);
			});


			it('overrides query parameters with hash parameters', function () {
				var mockUrl = 'http://kiva.org/path/folder/file.html?param1=one&param2=two&queryParam=qpVal#param1=uno&param2=dos&hashParam=hpVal'
				, expectedParams = {
					param1: 'uno'
					, param2: 'dos'
					, queryParam: 'qpVal'
					, hashParam: 'hpVal'
				};

				expect(uri(mockUrl).param()).toEqual(expectedParams);
			});


			it('cannot set parameters, will throw if you try', function () {
				expect(function () {
					uri().param({});
				}).toThrow();
			});
		});


		describe('.hashParam', function () {
			var expectedParams
			, mockUrl = 'http://kiva.org/path/folder/file.html?param1=one&param2=two&queryParam=qpVal#param1=uno&param2=dos&hashParam=hpVal';

			it('gets hash parameters', function () {
				expectedParams = {
					param1: 'uno'
					, param2: 'dos'
					, hashParam: 'hpVal'
				};

				expect(uri(mockUrl).hashParam()).toEqual(expectedParams);
			});


			it('sets hash parameters', function () {
				expectedParams = {
					param1: 'override'
					, param2: 'dos'
					, hashParam: 'hpVal'
				};

				expect(uri(mockUrl).hashParam({param1: 'override'}).hashParam()).toEqual(expectedParams);
			});
		});


		describe('.queryParam', function () {
			var mockUrl = 'http://kiva.org/path/folder/file.html?param1=one&param2=two&queryParam=qpVal#param1=uno&param2=dos&hashParam=hpVal'
			, expectedParams;

			it('gets query parameters', function () {
				expectedParams = {
					param1: 'one'
					, param2: 'two'
					, queryParam: 'qpVal'
				};

				expect(uri(mockUrl).queryParam()).toEqual(expectedParams);
			});
			

			it('sets query parameters', function () {
				expectedParams = {
					param1: 'override'
					, param2: 'two'
					, queryParam: 'qpVal'
				};

				expect(uri(mockUrl).queryParam({param1: 'override'}).queryParam()).toEqual(expectedParams);
			});
		});
	});
});