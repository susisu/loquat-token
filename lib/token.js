/*
 * loquat-token / token.js
 * copyright (c) 2016 Susisu
 */

/**
 * @module token
 */

"use strict";

module.exports = (_core, _prim, _char, _combinators) => {
    function end() {
        return Object.create({
            makeTokenParser
        });
    }

    const lazy = _core.lazy;

    const pure     = _prim.pure;
    const bind     = _prim.bind;
    const then     = _prim.then;
    const mplus    = _prim.mplus;
    const label    = _prim.label;
    const tryParse = _prim.tryParse;
    const skipMany = _prim.skipMany;

    const string     = _char.string;
    const satisfy    = _char.satisfy;
    const oneOf      = _char.oneOf;
    const noneOf     = _char.noneOf;
    const char       = _char.char;
    const space      = _char.space;
    const upper      = _char.upper;
    const digit      = _char.digit;
    const octDigit   = _char.octDigit;
    const hexDigit   = _char.hexDigit;
    const manyChars  = _char.manyChars;
    const manyChars1 = _char.manyChars1;

    const choice    = _combinators.choice;
    const option    = _combinators.option;
    const between   = _combinators.between;
    const many1     = _combinators.many1;
    const skipMany1 = _combinators.skipMany1;
    const sepBy     = _combinators.sepBy;
    const sepBy1    = _combinators.sepBy1;

    /*
     * white space
     */
    const spaceChars  = new Set(" \f\n\r\t\v");
    const simpleSpace = skipMany1(satisfy(char => spaceChars.has(char)));

    function oneLineComment(commentLine) {
        return then(
            tryParse(string(commentLine)),
            then(
                skipMany(satisfy(char => char !== "\n")),
                pure(undefined)
            )
        );
    }

    function multiLineComment(commentStart, commentEnd, nestedComments) {
        const commentStartEnd = commentStart + commentEnd;
        const inCommentMulti = lazy(() => label(
            mplus(
                then(
                    tryParse(string(commentEnd)),
                    pure(undefined)
                ),
                mplus(
                    then(comment, inCommentMulti),
                    mplus(
                        then(
                            skipMany1(noneOf(commentStartEnd)),
                            inCommentMulti
                        ),
                        then(
                            oneOf(commentStartEnd),
                            inCommentMulti
                        )
                    )
                )
            ),
            "end of comment"
        ));
        const inCommentSingle = lazy(() => label(
            mplus(
                then(
                    tryParse(string(commentEnd)),
                    pure(undefined)
                ),
                mplus(
                    then(
                        skipMany1(noneOf(commentStartEnd)),
                        inCommentSingle
                    ),
                    then(
                        oneOf(commentStartEnd),
                        inCommentSingle
                    )
                )
            ),
            "end of comment"
        ));
        const inComment = nestedComments ? inCommentMulti : inCommentSingle;
        const comment = then(
            tryParse(string(commentStart)),
            inComment
        );
        return comment;
    }

    /*
     * number literals
     */
    function number(base, baseDigit) {
        return bind(manyChars1(baseDigit), digits => pure(parseInt(digits, base)));
    }
    const decimal     = number(10, digit);
    const hexadecimal = then(oneOf("Xx"), number(16, hexDigit));
    const octal       = then(oneOf("Oo"), number(8, octDigit));

    // natural
    const zeroNumber = label(
        then(
            char("0"),
            mplus(hexadecimal, mplus(octal, mplus(decimal, pure(0))))
        ),
        ""
    );
    const nat = mplus(zeroNumber, decimal);

    // integer
    const sign = mplus(
        then(char("-"), pure(x => -x)),
        mplus(
            then(char("+"), pure(x => x)),
            pure(x => x)
        )
    );

    // float
    const fraction = label(
        then(
            char("."),
            bind(label(manyChars1(digit), "fraction"), digits =>
                pure(parseFloat("0." + digits))
            )
        ),
        "fraction"
    );
    const exponent = label(
        then(
            oneOf("Ee"),
            bind(sign, f =>
                bind(label(decimal, "exponent"), e =>
                    pure(Math.pow(10, f(e)))
                )
            )
        ),
        "exponent"
    );
    function fractExponent(n) {
        return mplus(
            bind(fraction, fract =>
                bind(option(1, exponent), expo =>
                    pure((n + fract) * expo)
                )
            ),
            bind(exponent, expo =>
                pure(n * expo)
            )
        );
    }
    const floating = bind(decimal, fractExponent);

    // natural or float
    function fractFloat(n) {
        return bind(fractExponent(n), f =>
            pure({ type: "float", value: f })
        );
    }
    const decimalFloat = bind(decimal, n =>
        option({ type: "natural", value: n }, fractFloat(n))
    );
    const zeroNumFloat = mplus(
        bind(mplus(hexadecimal, octal), n =>
            pure({ type: "natural", value: n })
        ),
        mplus(
            decimalFloat,
            mplus(
                fractFloat(0),
                pure({ type: "natural", value: 0 })
            )
        )
    );
    const natFloat = mplus(
        then(char("0"), zeroNumFloat),
        decimalFloat
    );

    /*
     * character / string literals
     */
    const escMap = {
        "a" : "\u0007",
        "b" : "\b",
        "f" : "\f",
        "n" : "\n",
        "r" : "\r",
        "t" : "\t",
        "v" : "\v",
        "\\": "\\",
        "\"": "\"",
        "'" : "'"
    };
    const asciiMap = {
        "BS" : "\u0008",
        "HT" : "\u0009",
        "LF" : "\u000a",
        "VT" : "\u000b",
        "FF" : "\u000c",
        "CR" : "\u000d",
        "SO" : "\u000e",
        "SI" : "\u000f",
        "EM" : "\u0019",
        "FS" : "\u001c",
        "GS" : "\u001d",
        "RS" : "\u001e",
        "US" : "\u001f",
        "SP" : "\u0020",
        "NUL": "\u0000",
        "SOH": "\u0001",
        "STX": "\u0002",
        "ETX": "\u0003",
        "EOT": "\u0004",
        "ENQ": "\u0005",
        "ACK": "\u0006",
        "BEL": "\u0007",
        "DLE": "\u0010",
        "DC1": "\u0011",
        "DC2": "\u0012",
        "DC3": "\u0013",
        "DC4": "\u0014",
        "NAK": "\u0015",
        "SYN": "\u0016",
        "ETB": "\u0017",
        "CAN": "\u0018",
        "SUB": "\u001a",
        "ESC": "\u001b",
        "DEL": "\u007f"
    };
    const charEsc = choice(
        Object.keys(escMap).sort().map(c =>
            then(char(c), pure(escMap[c]))
        )
    );
    const charNum = bind(
        mplus(
            decimal,
            mplus(
                then(char("o"), number(8, octDigit)),
                then(char("x"), number(16, hexDigit))
            )
        ),
        code => pure(String.fromCharCode(code))
    );
    const charAscii = choice(
        Object.keys(asciiMap).sort().map(asc =>
            tryParse(
                then(string(asc), pure(asciiMap[asc]))
            )
        )
    );
    const charControl = then(
        char("^"),
        bind(upper, code =>
            pure(
                String.fromCharCode(code.charCodeAt(0) - "A".charCodeAt(0) + 1)
            )
        )
    );
    const escapeCode = label(
        mplus(charEsc, mplus(charNum, mplus(charAscii, charControl))),
        "escape code"
    );
    const charLetter = satisfy(c => c !== "'" && c !== "\\" && c > "\u001a");
    const charEscape = then(char("\\"), escapeCode);
    const characterChar = label(
        mplus(charLetter, charEscape),
        "literal character"
    );

    const stringLetter = satisfy(c => c !== "\"" && c !== "\\" && c > "\u001a");
    const escapeGap = then(
        many1(space),
        label(char("\\"), "end of string gap")
    );
    const escapeEmpty = char("&");
    const stringEscape = then(
        char("\\"),
        mplus(
            then(escapeGap, pure("")),
            mplus(
                then(escapeEmpty, pure("")),
                escapeCode
            )
        )
    );
    const stringChar = label(
        mplus(stringLetter, stringEscape),
        "string character"
    );

    /**
     * @function module:token.makeTokenParser
     * @static
     * @param {module:language.LanguageDef} def
     * @returns {Object}
     */
    function makeTokenParser(def) {
        const tp = {};

        /*
         * white space
         */
        const noOneLineComment = def.commentLine === "" || def.commentLine === undefined;
        const noMultiLineComment = def.commentStart === "" || def.commentEnd === ""
            || def.commentStart === undefined || def.commentEnd === undefined;
        const whiteSpace = skipMany(label(
              noOneLineComment && noMultiLineComment ? simpleSpace
            : noOneLineComment ? mplus(
                simpleSpace,
                multiLineComment(def.commentStart, def.commentEnd, def.nestedComments)
            )
            : noMultiLineComment ? mplus(
                simpleSpace,
                oneLineComment(def.commentLine)
            )
            : mplus(
                simpleSpace,
                mplus(
                    oneLineComment(def.commentLine),
                    multiLineComment(def.commentStart, def.commentEnd, def.nestedComments)
                )
            ),
            ""
        ));

        function lexeme(parser) {
            return bind(parser, x => then(whiteSpace, pure(x)));
        }

        function symbol(name) {
            return lexeme(string(name));
        }

        tp.whiteSpace = whiteSpace;
        tp.lexeme     = lexeme;
        tp.symbol     = symbol;

        /*
         * symbols
         */
        const lparen   = symbol("(");
        const rparen   = symbol(")");
        const lbrace   = symbol("{");
        const rbrace   = symbol("}");
        const langle   = symbol("<");
        const rangle   = symbol(">");
        const lbracket = symbol("[");
        const rbracket = symbol("]");

        function parens(parser) {
            return between(lparen, rparen, parser);
        }

        function braces(parser) {
            return between(lbrace, rbrace, parser);
        }

        function angles(parser) {
            return between(langle, rangle, parser);
        }

        function brackets(parser) {
            return between(lbracket, rbracket, parser);
        }

        const semi  = symbol(";");
        const comma = symbol(",");
        const colon = symbol(":");
        const dot   = symbol(".");

        function semiSep(parser) {
            return sepBy(parser, semi);
        }

        function semiSep1(parser) {
            return sepBy1(parser, semi);
        }

        function commaSep(parser) {
            return sepBy(parser, comma);
        }

        function commaSep1(parser) {
            return sepBy1(parser, comma);
        }

        tp.parens    = parens;
        tp.braces    = braces;
        tp.angles    = angles;
        tp.brackets  = brackets;
        tp.semi      = semi;
        tp.comma     = comma;
        tp.colon     = colon;
        tp.dot       = dot;
        tp.semiSep   = semiSep;
        tp.semiSep1  = semiSep1;
        tp.commaSep  = commaSep;
        tp.commaSep1 = commaSep1;

        /*
         * number literals
         */
        const int = bind(lexeme(sign), f =>
            bind(nat, n =>
                pure(f(n))
            )
        );

        const natural        = label(lexeme(nat), "natural");
        const integer        = label(lexeme(int), "integer");
        const float          = label(lexeme(floating), "float");
        const naturalOrFloat = label(lexeme(natFloat), "number");

        tp.decimal        = decimal;
        tp.hexadecimal    = hexadecimal;
        tp.octal          = octal;
        tp.natural        = natural;
        tp.integer        = integer;
        tp.float          = float;
        tp.naturalOrFloat = naturalOrFloat;

        /*
         * character / string literals
         */
        const charLiteral = label(
            lexeme(
                between(
                    char("'"),
                    label(char("'"), "end of character"),
                    characterChar
                )
            ),
            "character"
        );
        const stringLiteral = lexeme(
            label(
                between(
                    char("\""),
                    label(char("\""), "end of string"),
                    manyChars(stringChar)
                )
            ),
            "literal string"
        );

        tp.charLiteral   = charLiteral;
        tp.stringLiteral = stringLiteral;

        return tp;
    }

    return end();
};
