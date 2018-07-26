/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2018, Ajax.org B.V. and James Foster
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

/****************************************************************************************
 * Ace highlight rules for Smalltalk code (based on https://ace.c9.io/#nav=higlighter)  *
 ****************************************************************************************/

define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var binarySelectorRegex = /(\+|\=|\\|\*|\~|\<|\>|\=|\||\/|\&|\@|\%|\,|\?|\!)+/;
var globalRegex = /([A-Z][a-zA-Z0-9_]+)|([A-Z])/;
var identifierRegex = /([a-zA-Z_][a-zA-Z0-9_]+)|([a-zA-Z])/;
var keywordRegex = /(([a-zA-Z_]\:)|([a-zA-Z_][a-zA-Z0-9_]+\:))+/;
var numericLiteralRegex = /\s*(\-\s*)?\d+(\.\d+)?([dDeEfFpPqQsS]\-?\d)?/;
var radixedLiteralRegex = /\s*\d+(\#|r)\-?[0-9A-Za-z]+/;
var specialLiteralRegex = /(true|false|nil|_remoteNil)\b/;
var comment = {
	token: "comment",
	start: /\"/,
	end: /\"/
};
var space = {
	token: "space",
	regex: /\s+/
};

//	PRAGMAS
var pragmaEnd = [space, {
	token: "Pragma.end",
	regex: /\>/,
	next: "pop"
}, {
	token: "invalid.PragmaEnd",
	regex: /[^\>]./,
	
}];
var pragmaLiteralNumberNumeric = {
	token: "Pragma.number.numeric",
	regex: numericLiteralRegex,
	next: "pragmaPairOptional"
};
var pragmaLiteralNumberRadixed = {
	token: "Pragma.number.radixed",
	regex: radixedLiteralRegex,
	next: "pragmaPairOptional"
};
var pragmaStringLiteral = {
	token: "Pragma.StringLiteral",
	regex: /(\')((\'\')|([^\']))+(\')/,
	next: "pragmaPairOptional"
};
var pragmaCharacterLiteral = {
	token: "Pragma.CharacterLiteral",
	regex: /\$./,
	next: "pragmaPairOptional"
};
var pragmaSymbolStart = {
	token: "Pragma.SymbolStart",
	regex: /\#/,
	next: "pragmaSymbol"
};
var pragmaSymbol = [{
	token: "Pragma.Symbol.Keyword",
	regex: keywordRegex,
	next: "pragmaPairOptional"
}, {
	token: "Pragma.Symbol.Identifier",
	regex: identifierRegex,
	next: "pragmaPairOptional"
}, {
	token: "Pragma.Symbol.BinarySelector",
	regex: binarySelectorRegex,
	next: "pragmaPairOptional"
}, {
	token: "Pragma.Symbol.String",
	regex: /(\')((\'\')|([^\']))+(\')/,
	next: "pragmaPairOptional"
}, {
	token: "invalid",
	regex: /./,
	next: "start"
}];
var pragmaSpecialLiteral = {
	token: "Pragma.SpecialLiteral",
	regex: specialLiteralRegex,
	next: "pragmaPairOptional"
};
var pragmaLiteral = [ space,
	pragmaLiteralNumberRadixed, 
	pragmaLiteralNumberNumeric, 
	pragmaStringLiteral,
	pragmaCharacterLiteral,
	pragmaSymbolStart,
	pragmaSpecialLiteral
];
var pragmaPair = [space, {
	token: "invalid.KeywordPragma",
	regex: /primitive\:/,
	next: "pragmaEnd"
}, {
	token: "KeywordPragma",
	regex: keywordRegex,
	next: "pragmaLiteral"
}, {
	token: "Pragma.BinarySelector",
	regex: /(\+|\=|\\|\*|\~|\<|\=|\||\/|\&|\@|\%|\,|\?|\!)+/,
	next: "pragmaLiteral"
}];
var pragmaPairOptional = pragmaPair.concat(pragmaEnd);
var pragmaSpecialLiteral = {
	token: "PragmaSpecialLiteral",
	regex: specialLiteralRegex,
	next: "pragmaEnd"
};
var unaryPragmaIdentifier = [{
	token: "invalid.UnaryPragmaIdentifier",
	regex: /(protected|unprotected|requiresVc)\b/,
	next: "pragmaEnd"
}, {
	token: "UnaryPragma",
	regex: identifierRegex,
	next: "pragmaEnd"
}];
var unaryPragma = [pragmaSpecialLiteral].concat(unaryPragmaIdentifier);
var pragmaBody = pragmaPair.concat(unaryPragma);
var pragmas = {
	token: "Pragma.start",
	regex: /\</,
	push: "pragmaBody"
};

//	TEMPORARIES
var temporariesStart = {
	token: "keyword.operator.startTemporaries",
	regex: /\|/,
	next: "temporaries"
};
var temporaries = [ space, {
	token: "keyword.operator.endTemporaries",
	regex: /\|/,
	next: "statements"
}, {
	token: "variable.other.temporary",
	regex: identifierRegex
}, {
	token: "invalid",
	regex: /^\s/,
	next: "statements"
}];

//	STATEMENTS
var assignment1 = {
	token: ["variable", "space", "keyword.operator.assignment"],
	regex: /([a-zA-Z])(\s*)(\:\=)/,
	next: "statements"
};
var assignment2 = {
	token: ["variable", "space", "keyword.operator.assignment"],
	regex: /([a-zA-Z_][a-zA-Z0-9_]+)(\s*)(\:\=)/,
	next: "statements"
};
var expression = {
	token: "expression",
	regex: /.+/,
	next: "statements"
};
var statement = [ ];
var statements = [ space, comment, pragmas, assignment1, assignment2  ]; // , expression ];
var methodBody = [ space, comment, pragmas, temporariesStart ].concat(statements);

var SmalltalkCodeHighlightRules = function() {
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used
    this.$rules = {
            start: methodBody,
            
            expression: expression,
            methodBody: methodBody,
            pragmaBody: pragmaBody,
            pragmaEnd: pragmaEnd,
            pragmaLiteral: pragmaLiteral,
            pragmaLiteralNumberRadixed: pragmaLiteralNumberRadixed,
            pragmaPairOptional: pragmaPairOptional,
            pragmaSymbol: pragmaSymbol,
            statements: statements,
            temporaries: temporaries,
 /*           
            {
                token: "constant.numeric", // radixed literal
                regex: radixedLiteral
            }, {
                token: "constant.numeric", // numeric literal
                regex: numericLiteral
            }, {
            	token: "constant.character",
            	regex: /\$./
            }, {
            	token: "constant.language",
            	regex: /true|false|nil/
            }, {
            	token: "string.quoted",
                regex: /\'((\'\')|([^\']))*\'/,
            }, {
            	token: "string.other.symbol",		// symbol string literal
                regex: /\#\'((\'\')|([^\']))*\'/,
            }, {
            	token: "keyword.operator.temporaries",
            	regex: /\|\s*/ /*,
            	next: "temporaries"
            }, {
            	token: "keyword.operator.array",
            	regex: /\#(?:\()/,
            }, {
            	token: "keyword.operator.parenthesis",
            	regex: /(?:(\(|\)))/,
            }, {
            	token: "keyword.operator.byteArray",
            	regex: /\#(?:\[)/,
            	next: "byteArray"
            }, {
            	token: "keyword.operator.block",
            	regex: /(?:(\[|\]))/,
            }, {
            	token: "keyword.operator.brace",
            	regex: /(?:(\{|\}))/,
            }, {
            	token: "keyword.operator.dot",
            	regex: /\./,
            }, {
            	token: "keyword.operator.cascade",
            	regex: /\;/,
            }, {
            	token: "keyword.operator.assignment",
            	regex: /\:\=/,
            }, {
            	token: "keyword.operator.return",
            	regex: /\^/,
            }, {
            	token: "keyword.operator.binarySelector",
            	regex: binarySelectorRegex,
            }, {
            	token: "keyword.operator.blockArg",
            	regex: /\:/,
            	next: "blockArg"
            }, {
            	token: "string.other.symbol",
            	regex: /\#/,
            	next: "symbol"
            }, {
            	token: "variable.language",
            	regex: /self|super|thisContext/
            }, {
            	token: "support.function.keyword",
            	regex: keywordRegex
            }, {
            	token: "support.variable.global",
            	regex: globalRegex
            }, {
            	token: "name",
            	regex: identifier
            }],
            blockArg: [{
            	token: "keyword.operator.blockArg",
            	regex: /\|/,
            	next: "start"
            }, {
            	token: "keyword.operator.blockArg",
            	regex: /\:/,
			}, {
            	token: "variable.other.blockArg",
            	regex: identifierRegex,
            }, {
				token: "invalid",
				regex: /^\s/,
				next: "start"
			}],
            byteArray: [{
            	token: "keyword.operator.byteArray",
            	regex: /(?:\])/,
            	next: "start"
            }, {
                token : "constant.numeric.byte", // radixed literal
                regex : radixedLiteralRegex
            }, {
                token : "constant.numeric.byte", // numeric literal
                regex : numericLiteralRegex
            }],
            symbol: [{
            	token: "string.other.symbol",
            	regex: keywordRegex,
            	next: "start"
            }, {
            	token: "string.other.symbol",
            	regex: identifierRegex,
            	next: "start"
            }, {
            	token: "string.other.symbol",
            	regex: binarySelectorRegex,
            	next: "start"
			}, {
				token: "invalid",
				regex: /./,
				next: "start"
			}],
*/     
        }
    
    this.normalizeRules();
};

SmalltalkCodeHighlightRules.metaData = 


oop.inherits(SmalltalkCodeHighlightRules, TextHighlightRules);

exports.SmalltalkCodeHighlightRules = SmalltalkCodeHighlightRules;
});