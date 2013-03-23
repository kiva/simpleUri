// @todo add setters and getters
// Covers use-cases: autocomplete, setter/getter, adds load and open

/*
 * Taken from JQuery URL Parser plugin, v2.2.1 by Mark Perkins
 */

var undefined
, key = ['href', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'hash'] // keys available to query
, parser = {
    strict : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,  //less intuitive, more accurate to the specs
    loose :  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // more intuitive, fails on relative paths and deviates from specs
};


function isInt(arg) {
    return /^[0-9]+$/.test(arg);
}


function parseUri(url, strictMode) {
    var i
    , str = decodeURI(url)
    , parseMode = strictMode || false ? 'strict' : 'loose'
    , res = parser[parseMode].exec(str)
    , uri = {
        param : {}
        , seg : {}
    };

    for (i = 0; i < key.length; i++) {
        uri[key[i]] = res[i] || '';
    }

    // build query and hash parameters
    uri.param['query'] = parseString(uri.query);
    uri.param['hash'] = parseString(uri.hash);

    // split path and hash into segments
    uri.seg['path'] = uri.path.replace(/^\/+|\/+$/g,'').split('/');
    uri.seg['hash'] = uri.hash.replace(/^\/+|\/+$/g,'').split('/');

    // compile a 'base' domain attribute
    uri.base = uri.host ? (uri.protocol ?  uri.protocol+'://'+uri.host : uri.host) + (uri.port ? ':'+uri.port : '') : '';

    return uri;
}


function promote(parent, key) {
    var t = {};

    if (parent[key].length == 0) {
        return parent[key] = {};
    }

    for (var i in parent[key]) {
        t[i] = parent[key][i];
    }

    parent[key] = t;
    return t;
}


function parse(parts, parent, key, val) {
    var obj
    , part = parts.shift();

    if (!part) {
        if (isArray(parent[key])) {
            parent[key].push(val);
        } else if ('object' == typeof parent[key]) {
            parent[key] = val;
        } else if ('undefined' == typeof parent[key]) {
            parent[key] = val;
        } else {
            parent[key] = [parent[key], val];
        }
    } else {
        obj = parent[key] = parent[key] || [];

        if (']' == part) {
            if (isArray(obj)) {
                if ('' != val) {
                    obj.push(val);
                }
            } else if ('object' == typeof obj) {
                obj[keys(obj).length] = val;
            } else {
                obj = parent[key] = [parent[key], val];
            }
        } else if (part.indexOf(']') > -1) {
            part = part.substr(0, part.length - 1);
            if (!isInt(part) && isArray(obj)) obj = promote(parent, key);
            parse(parts, obj, part, val);
        } else {
            // key
            if (!isInt(part) && isArray(obj)) obj = promote(parent, key);
            parse(parts, obj, part, val);
        }
    }
}


function merge(parent, key, val) {
    if (key.indexOf(']') > -1) {
        var parts = key.split('['),
            len = parts.length,
            last = len - 1;
        parse(parts, parent, 'base', val);
    } else {
        if (!isInt(key) && isArray(parent.base)) {
            var t = {};
            for (var k in parent.base) t[k] = parent.base[k];
            parent.base = t;
        }
        set(parent.base, key, val);
    }
    return parent;
}


function parseString(str) {
    return reduce(String(str).split(/&|;/), function(ret, pair) {
        try {
            pair = decodeURIComponent(pair.replace(/\+/g, ' '));
        } catch(e) {
            // ignore
        }
        var eql = pair.indexOf('='),
            brace = lastBraceInKey(pair),
            key = pair.substr(0, brace || eql),
            val = pair.substr(brace || eql, pair.length),
            val = val.substr(val.indexOf('=') + 1, val.length);

        if ('' == key) key = pair, val = '';

        return merge(ret, key, val);
    }, { base: {} }).base;
}


function set(obj, key, val) {
    var v = obj[key];
    if (undefined === v) {
        obj[key] = val;
    } else if (isArray(v)) {
        v.push(val);
    } else {
        obj[key] = [v, val];
    }
}


function lastBraceInKey(str) {
    var brace, c
    , len = str.length;

    for (var i = 0; i < len; ++i) {
        c = str[i];

        if (']' == c) {
            brace = false;
        }

        if ('[' == c) {
            brace = true;
        }

        if ('=' == c && !brace) {
            return i;
        }
    }
}


/**
 *
 * @param obj
 * @param accumulator
 * @return {*}
 */
function reduce(obj, accumulator){
    var i = 0
    , l = obj.length >> 0
    , curr = arguments[2];

    while (i < l) {
        if (i in obj) {
            curr = accumulator.call(undefined, curr, obj[i], i, obj);
        }

        ++i;
    }

    return curr;
}


/**
 *
 * @param vArg
 * @return {Boolean}
 */
function isArray(vArg) {
    return Object.prototype.toString.call(vArg) === '[object Array]';
}


/**
 *
 * @param obj
 * @return {Array}
 */
function keys(obj) {
    var prop
    , keys = [];

    for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            keys.push(prop);
        }
    }

    return keys;
}


/**
 *
 * @param url
 * @param strictMode
 * @return {Object}
 */
function loc(url, strictMode) {
    var data;

    if (arguments.length === 1 && url === true) {
        strictMode = true;
        url = undefined;
    }

    strictMode = strictMode || false;
    url = url || window.location.toString();

    data = parseUri(url, strictMode);
    return {

        authority: data.authority
        , file: data.file
        , hash: data.hash
        , host: data.host
        , href: data.href   // aka origin
        , path: data.path   // aka pathname
        , param: data.param
        , password: data.password
        , port: data.port
        , protocol: data.protocol
        , query: data.query // aka search
        , relative: data.relative
        , userInfo: data.userInfo
        , user: data.user

        // @todo cleanup, maybe nest under a ._data property?
        , seg: data.seg


        // @todo
        , hashParam: function (param) {
            return typeof param !== 'undefined' ? this.param.hash[param] : this.param.hash;
        }


        // @todo
        , queryParam: function (param) {
            return typeof param !== 'undefined' ? this.param.query[param] : this.param.query;
        }


        /**
         *
         * @param {String} windowName
         * @param {String} windowFeatures comma separated list of features
         */
        , open: function (windowName, windowFeatures) {
            return window.open(this.href, windowName, windowFeatures);
        }


        /**
         * loads a new url or reloads the existing page
         *
         * @param {Boolean} [bustCache]
         */
        , load: function (bustCache) {
            if (this.href === window.location.href) {
                window.location.reload(bustCache);
            } else {
                window.location.assign(this.href);
            }
        }


        /**
         * Will replace the current page with the one from the new url.
         * Unlike .load(), however the current page will not be saved in session history
         */
        , replace: function () {
            window.location.replace(this.href);
        }


        // return path segments
        , segment : function( seg ) {
            if ( typeof seg === 'undefined' ) {
                return this.seg.path;
            } else {
                seg = seg < 0 ? this.seg.path.length + seg : seg - 1; // negative segments count from the end
                return this.seg.path[seg];
            }
        }
    };
};

