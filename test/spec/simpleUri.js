/*global uri */
'use strict';

buster.spec.expose();


function getParamsTests(method) {
    var expectedParams
        , mockUrl = 'http://kiva.org/path/folder/file.html?param1=one&param2=two#param1=uno&param2=dos';

    if (method == 'hashParam') {
        expectedParams = {
            param1: 'uno'
            , param2: 'dos'
        };
    } else if (method == 'queryParam') {
        expectedParams = {
            param1: 'one'
            , param2: 'two'
        };
    } else if (method == 'param') {
        mockUrl = 'http://kiva.org/path/folder/file.html?param1=one&param2=two&queryParam=qpVal#param1=uno&param2=dos&hashParam=hpVal';

        expectedParams = {
            param1: 'uno'
            , param2: 'dos'
            , queryParam: 'qpVal'
            , hashParam: 'hpVal'
        };
    }


    it('returns an object, representing the hash parameters', function () {
        expect(uri(mockUrl)[method]()).toEqual(expectedParams);
        expect(uri('http://url.com/test')[method]()).toEqual({});
    });


    it('accepts a string, returns the value of that parameter', function () {
        expect(uri(mockUrl)[method]('param1')).toBe(expectedParams.param1);
    });


    it('returns undefined if the parameter is not found in the url hash', function () {
        expect(uri(mockUrl)[method]('param3')).toBe(undefined);
    });
}


describe('.uri()', function () {
    var mockUri = '@todo';
    var mockUrl = 'http://kiva.org/path/folder/file.html?param1=one&param2=two#param1=uno&param2=dos';


    it('operates on the current url or a url that is passed into the kv.url() function', function () {
        expect(uri().href).toBe(window.location.href);
        expect(uri('http://kiva.org/path/folder/file.html?param1=one&param2=two#param1=uno&param2=dos').href).toBe('http://kiva.org/path/folder/file.html?param1=one&param2=two#param1=uno&param2=dos');
    });


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
        it('//.open() opens new window', function () {
            var newWindow = kv.url('basket').open(undefined, 'width=0,height=0');
            newWindow.close();

            // The jasmine.any() check seems to fail when used on the Window object
            expect(newWindow.toString()).toContain('Window');
        });
    });


    describe('.load()', function () {
        it('//.load() loads a new url -- not testable', function () {
            expect(kv.url().load).toBeDefined();
        });
    });


    describe('reload()', function () {
        it('//.reload() reloads the current url -- not testable', function () {
            expect(kv.url().reload).toBeDefined();
        });
    });


    describe('kv.url().segment()', function () {
        it('//returns an array of all segments', function () {
            expect(kv.url(mockUrl).segment()).toEqual(['path', 'folder', 'file.html']);
        });

        it('//returns the segment corresponding to the index requested', function () {
            expect(kv.url(mockUrl).segment(1)).toBe('path');
        });

        it('//returns the segment corresponding to the negative index requested', function () {
            expect(kv.url(mockUrl).segment(-1)).toBe('file.html');
        });
    });


    describe('kv.url().param()', function () {
        getParamsTests('param');

        it('//will not work as a setter, and will notify users if they try to use it as one', function () {
            expect(function () {
                uri().param({});
            }).toThrow();
        });
    });
});


function setParamsTests(method) {
    var expectedHashParams
        , expectedQueryParams
        , mockUrl = 'http://kiva.org/path/folder/file.html?param1=one&param2=two#param1=uno&param2=dos';

    it('sets url parameters', function () {
        if (method == 'hashParam') {
            expectedHashParams = {
                param1: 'override'
                , param2: 'dos'
                , row: 'boat'
                , round: 'house'
            };

            expectedQueryParams = {
                param1: 'one'
                , param2: 'two'
            };
        } else {
            expectedHashParams = {
                param1: 'uno'
                , param2: 'dos'
            };

            expectedQueryParams = {
                param1: 'override'
                , param2: 'two'
                , row: 'boat'
                , round: 'house'
            };
        }


        var kvUrl = kv.url(mockUrl)
            , kvUrlObj = kvUrl[method]({param1: 'override', row: 'boat', round: 'house'})
            , params = kvUrlObj[method]();

        if (method == 'hashParam') {
            expect(params).toEqual(expectedHashParams);
        } else {
            expect(params).toEqual(expectedQueryParams);
        }

        // No guarantee of what order the params will be in the string, so test each piece
        expect(kvUrl.path()).toEqual(kv.url(mockUrl).path());
        expect(kvUrl.hashParam()).toEqual(expectedHashParams);
        expect(kvUrl.queryParam()).toEqual(expectedQueryParams);
    });


    // @todo
    xit('will update the current url, with the new params', function () {
        var kvUrl = kv.url()
            , loadSpy = spyOn(kvUrl, 'load');

        kvUrl.hashParam({newParam: 'blah'});
        expect(loadSpy).toHaveBeenCalled();
    });
}