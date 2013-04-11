# simpleUri

Addresses four use-cases:

* wrapper around window.location so you can spy on/stub out/mock out calls
* parse uri strings
* setter/getter for hash and query params
* parse out uri parts like "authority", "userInfo", "user", "password", "directory", and "file"

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

* Steven Levithan\'s uri parser http://blog.stevenlevithan.com/archives/parseuri
* JQuery URL Parser plugin by Mark Perkins, https://github.com/allmarkedup/jQuery-URL-Parser
* URI.js, https://github.com/medialize/URI.js
* http://stackoverflow.com/a/3855394/500270

Thanks for the inspiration (and some of the necessary code) for building this.