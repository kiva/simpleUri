# simpleUri

Addresses four use-cases:

* use instead of window.location so that you can spy on/stub out/mock out calls
* ability to parse uri strings
* setter/getter for hash and query params
* add ability to parse out uri parts like "authority", "userInfo", "user", "password", "directory", and "file"

## Use


```
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
```

## Development

1. clone
2. npm install
3. code

## Testing

```
grunt test
```

## Props

Thanks to:

* JQuery URL Parser plugin by Mark Perkins, https://github.com/allmarkedup/jQuery-URL-Parser
* Steven Levithan\'s uri parser http://blog.stevenlevithan.com/archives/parseuri
* URI.js, https://github.com/medialize/URI.js
* http://stackoverflow.com/a/3855394/500270

For inspiration (and some of the necessary code) for building this.