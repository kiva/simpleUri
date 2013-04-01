Addresses two use-cases:

.loc -> for unit testing
.parser -> set/get query and hash params
+ also to be able to manipulate/parse url strings (even just regular strings that are not in the address bar)

## Features
In addition to standard window.location properties/methods add:

* .segment()
* .param()
* .hashParam()
* .queryParam()
* .open()
* .load()
* .replace()

It also adds the following uri attributes:
* authority
* userInfo
* user
* password
* directory
* file

Calling loc.hash() gets the hash for the current url
Calling loc().hash() is a proxy to loc.hash(), but you have the option to pass in a new url to loc().

The problem with using the standard window.location methods is that it can not be used to parse urls that are not in the address bar.
So, you have to have a custom parser, which is what jquery.url gives us.

You also have to have a function that takes care of all the parsing.  Alternatively we could split the parsing up to happen on demand.
so instead of one giant parser we split it up into many smaller parsers.

Two things to test:
- how to mock out / stub global functions -> two optios var myFunc = this.sub() OR this.stub(window, 'myFunc')
- are long regexs longer to parse than short regexes -> short = 1,155,585x vs long regex = 97,946x
