/**
* simpleUri v0.2.0
* Lightweight uri parsing and url manipulation library
*
* Copyright (c) 2013 Kiva Microfunds
* Licensed under the MIT license.
* https://github.com/kiva/simpleUri/blob/master/license.txt
*/
var $ = require('jquery');

'use strict';

/**
 *
 * @param {String|Boolean} uriString
 * @param {Boolean} strictMode
 * @return {Object}
 */
function uri(uriString, strictMode) {
    var uriObj;

    if (arguments.length === 1 && uriString === true) {
        strictMode = true;
        uriString = undefined;
    }

    uriString = uriString || window.location.href;
    uriObj = uri.parseUri(uriString, strictMode);


    /**
     *
     * @param type
     * @param param
     * @return {*}
     * @private
     */
    uriObj._getParam = function (type, param) {
        if (param === undefined) {
            return uriObj._param[type];
        }

        return uriObj._param[type][param];
    };


    /**
     *
     * @todo this isn't working yet
     *
     * @param type
     * @param newData
     * @return {*}
     * @private
     */
    uriObj._setParam = function (type, newData) {
        var data = uriObj._param[type]
        , paramObj
        , paramString
        , prefix = type == 'query' ? '?' : '#';


        paramObj = $.extend({}, data, newData);
        paramString = prefix + $.param(paramObj);

        // Are we operating on the current url?  If so, load the page with the new params.
        if (decodeURI(window.location.href) == uriObj.href) {
            return uri(paramString).reload();
        } else {
            if (type == 'query') {
                paramString = paramString + '#' + uriObj.hash;
            } else {
                paramString = '?' + uriObj.query + paramString;
            }

            uriObj = uri(this.protocol + '://' + uriObj.host + uriObj.path + paramString);
            return paramObj;
        }
    };


    /**
     *
     * @param type
     * @param keysOrObj
     * @return {*}
     * @private
     */
    uriObj._paramProcess = function (type, keysOrObj) {

        if (! keysOrObj || typeof keysOrObj == 'string') {
            return this._getParam(type, keysOrObj);
        } else {
            return this._setParam(type, keysOrObj);
        }
    };


    /**
     *
     * @param keys
     * @return {*}
     */
    uriObj.param = function (keys) {
        if (keys && typeof keys != 'string' && !$.isArray(keys)) {
            throw '.param() can only be used as a getter.  Try .queryParam() or .hashParam()';
        } else if (typeof keys == 'string') {
            return uriObj.hashParam(keys) || uriObj.queryParam(keys);
        }

        return $.extend({}, uriObj.queryParam(keys), uriObj.hashParam(keys));
    };


    /**
     *
     * @param keysOrHashObj
     * @return {Object}
     */
    uriObj.hashParam = function (keysOrHashObj) {
        return uriObj._paramProcess('hash', keysOrHashObj);
    };


    /**
     *
     * @param keysOrQueryObj
     * @return {Object}
     */
    uriObj.queryParam = function (keysOrQueryObj) {
        return uriObj._paramProcess('query', keysOrQueryObj);
    };


    /**
     *
     * @param windowName
     * @param windowFeatures
     * @return {window}
     */
    uriObj.open = function (windowName, windowFeatures) {
        return window.open(uriObj.href, windowName, windowFeatures);
    };


    /**
     *
     * @param bustCache
     */
    uriObj.load = function (bustCache) {
        if (uriObj.href === window.location.href) {
            uriObj.reload(bustCache);
        } else {
            window.location.assign(uriObj.href);
        }
    };


    /**
     *
     * @param bustCache
     */
    uriObj.reload = function (bustCache) {
        window.location.reload(bustCache);
    };


    /**
     *
     */
    uriObj.replace = function () {
        window.location.replace(uriObj.href);
    };


    /**
     *
     * @param seg
     * @return {*}
     */
    uriObj.segment = function(seg) {
        if (seg === undefined) {
            return uriObj._seg.path;
        } else {
            seg = seg < 0 ? uriObj._seg.path.length + seg : seg - 1; // negative segments count from the end
            return uriObj._seg.path[seg];
        }
    };

    return uriObj;
}


/**
 *
 * @param str
 * @return {Object}
 */
uri.parseString = function (str) {
    var i, pair, length
    , arr = str.split(/&|;/)
    , obj = {};

    if (!str) {
        return obj;
    }

    for (i = 0; i < arr.length; ++i) {
        pair = arr[i].split('=');
        length = pair.length;

        if (length >= 2) {
            obj[pair[0]] = decodeURIComponent(pair[length - 1].replace(/\+/g, ' '));
        } else if (length == 1) {
            obj[pair[0]] = '';
        }
    }

    return obj;
};


/**
 *
 * @param uriString
 * @param strictMode
 * @return {Object}
 */
uri.parseUri = function (uriString, strictMode) {
    strictMode = strictMode === undefined ? this.config.strictMode : strictMode;
    uriString = decodeURI(uriString);

    var i
    , parseMode = strictMode ? 'strict' : 'loose'
    , parsedUri = this.config.parser[parseMode].exec(uriString)
    , uriParts = this.config.uriParts
    , uriObj = {_param : {}, _seg : {}};

    for (i = 0; i < uriParts.length; i++) {
        uriObj[uriParts[i]] = parsedUri[i] || '';
    }

    // build query and hash parameters
    uriObj._param.query = this.parseString(uriObj.query);
    uriObj._param.hash = this.parseString(uriObj.hash);

    // split path into segments
    uriObj._seg.path = uriObj.path.replace(/^\/+|\/+$/g,'').split('/');

    // compile a 'base' domain attribute
    uri.base = uri.host ? (uriObj.protocol ?  uriObj.protocol + '://' + uriObj.host : uriObj.host) + (uriObj.port ? ':' + uriObj.port : '') : '';

    return uriObj;
};


uri.config = {

    // The parts of a uri
    uriParts: ['href', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'hash']
    , strictMode: false
    , parser: {
        strict : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,  //less intuitive, more accurate to the specs
        loose :  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // more intuitive, fails on relative paths and deviates from specs
    }
};


module.export = uri;