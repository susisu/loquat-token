/*
 * loquat-token test / token.makeTokenParser().integer
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const show             = _core.show;
const SourcePos        = _core.SourcePos;
const ErrorMessageType = _core.ErrorMessageType;
const ErrorMessage     = _core.ErrorMessage;
const ParseError       = _core.ParseError;
const Config           = _core.Config;
const State            = _core.State;
const Result           = _core.Result;
const assertParser     = _core.assertParser;

const LanguageDef = _language.LanguageDef;

const makeTokenParser = _token.makeTokenParser;

describe(".integer", () => {
    it("should parse an integer", () => {
        const def = new LanguageDef({});
        const tp = makeTokenParser(def);
        const integer = tp.integer;
        assertParser(integer);
        // csuc
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "0UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = integer.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    0,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 2),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "+0UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = integer.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    0,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 3),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "-0UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = integer.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    -0,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 3),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "0x90ABCDEFUVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = integer.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 11),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "hexadecimal digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    0x90ABCDEF,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 11),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "+0x90ABCDEFUVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = integer.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 12),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "hexadecimal digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    0x90ABCDEF,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 12),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "-0x90ABCDEFUVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = integer.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 12),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "hexadecimal digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    -0x90ABCDEF,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 12),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "0o12345670UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = integer.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 11),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "octal digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    2739128, // 0o12345670
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 11),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "+0o12345670UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = integer.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 12),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "octal digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    2739128, // 0o12345670
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 12),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "-0o12345670UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = integer.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 12),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "octal digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    -2739128, // -0o12345670
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 12),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "01234567890UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = integer.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 12),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    1234567890,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 12),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "+01234567890UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = integer.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 13),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    +1234567890,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 13),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "-01234567890UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = integer.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 13),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    -1234567890,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 13),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "1234567890UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = integer.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 11),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    1234567890,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 11),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "+ 1234567890 UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = integer.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 14),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    1234567890,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 14),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "- 1234567890 UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = integer.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 14),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    -1234567890,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 14),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // cerr
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "0xUVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = integer.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "hexadecimal digit")
                        ]
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "0oUVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = integer.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "octal digit")
                        ]
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "-UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = integer.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // lexeme
                            new ErrorMessage(ErrorMessageType.EXPECT, ""),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // 0
                            new ErrorMessage(ErrorMessageType.EXPECT, ""),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // decimal
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit")
                        ]
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "+UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = integer.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // lexeme
                            new ErrorMessage(ErrorMessageType.EXPECT, ""),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // 0
                            new ErrorMessage(ErrorMessageType.EXPECT, ""),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // decimal
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit")
                        ]
                    )
                )
            )).to.be.true;
        }
        // eerr
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = integer.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // -
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // +
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // lexeme
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // 0
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // decimal
                            new ErrorMessage(ErrorMessageType.EXPECT, "integer")
                        ]
                    )
                )
            )).to.be.true;
        }
    });
});
