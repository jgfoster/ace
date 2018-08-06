"single-line comment with ""double quotes"""
"multi-line
comment"

"Pragmas"
<true><false><nil><_remoteNil>	"UnaryPragma SpecialLiteral"
<foo>	"UnaryPragma Identifier"
<protected><unprotected><requiresVc>	"invalid UnaryPragma Identifier"
<foo: 8r377 bar: -99>	"KeywordPragma with numbers"
<foo: 'abc' bar: $a>	"KeywordPragma with string and character"
<a: #abc b: #'abc' c: #key:word: d: #+ >		"KeywordPragma with symbols"
<foo: true + 3>				"KeywordPragma with special literal and binary selector"
<primitive: 99>			"invalid KeywordPragma"


"A ""complete"" Smalltalk syntax for code (not methods)"
| byteArray literalArray runtimeArray y |
<pragma: 1>
(nil isNil and: [true & false not]) ifFalse: [self halt].
y := thisContext stack size + super size.
byteArray := #[2 2r100 8r20 16rFF].
literalArray := #($a #a #'a' #+ #foo: 'I''m' 1.0 1.23e2 3.14s2 -42).
(runtimeArray := {1 + byteArray size. literalArray})
    do: [:each | 
        | var |
        var := Transcript
            show: each class name;
            show: each printString].
literalArray select: #isNumber thenCollect: [:each |
    each perform: #* with: x].
^x < 6