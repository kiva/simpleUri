# simpleUri

Addresses four use-cases:

* wrapper around window.location so you can spy on/stub out/mock out calls
* parse uri strings
* setter/getter for hash and query params
* parse out uri parts like "authority", "userInfo", "user", "password", "directory", and "file"

## Use

```

// Calling uri() with no parameters parses the current url and returns a parsed uri object
uri().href
uri().protocol
uri().authority
uri().userInfo
uri().user
uri().password
uri().host
uri().port
uri().relative
uri().path
uri().directory
uri().file
uri().query
uri().hash

uri().param()
uri().queryParam()
uri().hashParam()
uri().open()
uri().load()
uri().reload()
uri().replace()
uri().segment()

// Optionally, you can pass a url string as an argument to uri() and the string will be parsed.
uri('http://kiva.org').host     // 'kiva.org'
uri('http://kiva.org').protocol // 'http'


```

## Development

1. clone
2. npm install
3. code

## Testing

```
grunt test
```

### Generating [lcov](http://ltp.sourceforge.net/coverage/lcov.php) coverage reports
```
genhtml test/coverage/coverage.lcov -o test/coverage
```

## Props

Big thanks go out to the following people and projects:

* Steven Levithan\'s uri parser http://blog.stevenlevithan.com/archives/parseuri
* JQuery URL Parser plugin by Mark Perkins, https://github.com/allmarkedup/jQuery-URL-Parser
* URI.js, https://github.com/medialize/URI.js
* http://stackoverflow.com/a/3855394/500270