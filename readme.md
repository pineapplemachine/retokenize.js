# retokenize.js

This is a simple implementation of a lexical scanner using regular expressions
to tokenize an input string. It is invoked using the `retokenize(source, types)`
function, where `source` is an input string to be tokenized and `types` is
an iterable containing token types. A token type is described by a `tag`
attribute and a `pattern` attribute.

Here's an example of function input and output:

``` text
> let types = [{tag: "A", pattern: /te/}, {tag: "B", pattern: /st/}];
> for(token of retokenize("testtest", types)){console.log(token);}
Object {tag: "A", pattern: /te/, regex: /te/g, match: Array(1), index: 0…}
Object {tag: "B", pattern: /st/, regex: /st/g, match: Array(1), index: 2…}
Object {tag: "A", pattern: /te/, regex: /te/g, match: Array(1), index: 4…}
Object {tag: "B", pattern: /st/, regex: /st/g, match: Array(1), index: 6…}
```

A complete outputted token object looks like this:

``` js
{
    tag: "B"
    pattern: /st/
    regex: /st/g
    match: {0: "st", index: 6, input: "testtest", length: 1}
    text: "st"
    index: 6
    length: 2
}
```
