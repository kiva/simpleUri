(function () {
    'use strict';

    describe('kv.url()', function () {
        var mockUrl = 'http://kiva.org/path/folder/file.html?param1=one&param2=two#param1=uno&param2=dos';


        it('operates on the current url or a url that is passed into the kv.url() function', function () {
            expect(kv.url().href()).toBe(kv.url(window.location.href).href());
        });


        it('.port() gets the port for the url', function () {
            expect(kv.url(mockUrl).port()).toBe('');
        });


        it('.protocol() gets the protocol for the url', function () {
            expect(kv.url(mockUrl).protocol()).toBe('http');
        });


        it('.host() gets the host for the url', function () {
            expect(kv.url(mockUrl).host()).toBe('kiva.org');
        });


        it('.path() gets the pathname for the url', function () {
            expect(kv.url(mockUrl).path()).toBe('/path/folder/file.html');
        });


        it('.relative() gets the relative path for the url', function () {
            expect(kv.url(mockUrl).relative()).toBe('/path/folder/file.html?param1=one&param2=two#param1=uno&param2=dos');
        });


        it('.file() gets the filename from the url, if there is one', function () {
            expect(kv.url(mockUrl).file()).toBe('file.html');
            expect(kv.url('http://kiva.org/path/folder/page').file()).toBe('');
        });


        it('.query() gets the query for the url, if there is one', function () {
            expect(kv.url(mockUrl).query()).toBe('param1=one&param2=two');
            expect(kv.url('http://kiva.org/path/folder/page').query()).toBe('');
        });


        it('.hash() gets the hash for the url, if there is one', function () {
            expect(kv.url(mockUrl).hash()).toBe('param1=uno&param2=dos');
            expect(kv.url('http://kiva.org/path/folder/page').hash()).toBe('');
        });


        it('.href() gets the entire url with', function () {
            expect(kv.url(mockUrl).href()).toBe(mockUrl);
        });


        it('.reset() resets the kv.url() instance', function () {
            var kvUrl;

            kvUrl = kv.url();

            // Change the url
            window.location.hash = 'test=true';

            // Should not reflect the updated url yet.
            expect(kvUrl.href()).not.toBe(window.location.href);

            // Should reflect the updated url after being reset.
            expect(kvUrl.reset().href()).toBe(window.location.href);

            window.location.hash = '';
        });


        it('.open() opens new window', function () {
            var newWindow = kv.url('basket').open(undefined, 'width=0,height=0');
            newWindow.close();

            // The jasmine.any() check seems to fail when used on the Window object
            expect(newWindow.toString()).toContain('Window');
        });


        it('.load() loads a new url -- not testable', function () {
            expect(kv.url().load).toBeDefined();
        });


        it('.reload() reloads the current url -- not testable', function () {
            expect(kv.url().reload).toBeDefined();
        });


        describe('kv.url().segment()', function () {
            it('returns an array of all segments', function () {
                expect(kv.url(mockUrl).segment()).toEqual(['path', 'folder', 'file.html']);
            });

            it('returns the segment corresponding to the index requested', function () {
                expect(kv.url(mockUrl).segment(1)).toBe('path');
            });

            it('returns the segment corresponding to the negative index requested', function () {
                expect(kv.url(mockUrl).segment(-1)).toBe('file.html');
            });
        });


        describe('kv.url().hashParam()', function () {
            getParamsTests('hashParam');
            setParamsTests('hashParam');
        });


        describe('kv.url().queryParam()', function () {
            getParamsTests('queryParam');
            setParamsTests('queryParam');
        });


        describe('kv.url().param()', function () {
            getParamsTests('param');

            it('will not work as a setter, and will notify users if they try to use it as one', function () {
                expect(function () {
                    kv.url().param({});
                }).toThrow();
            });
        });
    });


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
            expect(kv.url(mockUrl)[method]()).toEqual(expectedParams);
            expect(kv.url('http://url.com/test')[method]()).toEqual({});
        });


        it('accepts a string, returns the value of that parameter', function () {
            expect(kv.url(mockUrl)[method]('param1')).toBe(expectedParams.param1);
        });


        it('returns undefined if the parameter is not found in the url hash', function () {
            expect(kv.url(mockUrl)[method]('param3')).toBe(undefined);
        });
    }


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
}());