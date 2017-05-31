/// Represents a generator for enumerating tokens in a source string.
/// Token types are provided as an iterable (e.g. an array) of objects.
/// Each object in the iterable should have a "tag" attribute and a "pattern"
/// attribute. The "tag" is any piece of metadata which will be attached to
/// returned token objects. The "pattern" is a string or a regular expression
/// object describing what a token of this type must look like.
/// Where multiple regular expressions might apply to the current position in
/// the source string, the longest matched token is given preference. If there
/// is a tie in match length, the token type which appears soonest in the
/// input iterable is given preference.
/// Any character that matches none of the specified token types is outputted
/// as its own token with no tag, pattern, or match metadata; it indicates only
/// the index of the token in the source string and the text content of the
/// token.
/// Every enumerated token has a "tag" attribute and a "pattern" attribute
/// reflecting the inputs which define its token type. It also has a "regex"
/// attribute referring to the regular expression object used internally by
/// the function, which may differ from the pattern input. It has a "match"
/// input referring to the full match object, if any, that resulted in the
/// token. It has an "index" attribute representing the position of the token
/// in the source string and a "text" attribute holding the text content of
/// the token, which is always a substring of the source string. It additionally
/// has a "length" attribute indicating the length in characters of the token.
function* retokenize(source, types){
    // Process inputted token types to something more suitable to work with
    let patterns = [];
    for(type of types){
        patterns.push({
            tag: type.tag,
            pattern: type.pattern,
            match: null,
            // If it isn't already a regex object, make it one, and if it is
            // a regex object, make sure it has a 'g' flag.
            // (The 'g' flag is necessary to use the 'lastIndex' property.)
            regex: (type.pattern.source ?
                RegExp(type.pattern.source, 'g' + type.pattern.flags) :
                RegExp(type.pattern, 'g')
            )
        });
    }
    let i = 0;
    while(i < source.length){
        let longestPattern = null;
        let longestLength = 0;
        for(pattern of patterns){
            // Utilizing lastIndex this way prevents unneeded repeated searching.
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex
            if(pattern.regex.lastIndex <= i){
                pattern.regex.lastIndex = i;
                pattern.match = pattern.regex.exec(source);
            }
            if(
                pattern.match && pattern.match.index == i &&
                pattern.match[0].length > longestLength
            ){
                longestLength = pattern.match[0].length;
                longestPattern = pattern;
            }
        }
        if(longestPattern){
            yield {
                tag: longestPattern.tag,
                pattern: longestPattern.pattern,
                regex: longestPattern.regex,
                match: longestPattern.match,
                index: i,
                text: longestPattern.match[0],
                length: longestPattern.match[0].length,
            };
            i += longestPattern.match[0].length;
        }else{
            // Didn't match any token types - return the character as
            // its own lonesome token.
            yield {
                tag: null,
                pattern: null,
                regex: null,
                match: null,
                index: i,
                text: source[i],
                length: 1,
            };
            i++;
        }
    }
}
