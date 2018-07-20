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

var binarySelector = /(\+|\=|\\|\*|\~|\<|\>|\=|\||\/|\&|\@|\%|\,|\?|\!)+/;
var global = /([A-Z][a-zA-Z0-9_]+)|([A-Z])/;
var identifier = /([a-zA-Z_][a-zA-Z0-9_]+)|([a-zA-Z])/;
var keyword = /(([a-zA-Z_]\:)|([a-zA-Z_][a-zA-Z0-9_]+\:))+/;
var numericLiteral = /(\-\s*)?\d+(\.\d+)?([dDeEfFpPqQsS]\-?\d)?/;
var radixedLiteral = /\d+(\#|r)\-?[0-9A-Za-z]+/;

var SmalltalkCodeHighlightRules = function() {
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used
    this.$rules = {
            start: [{
                token: "comment",
                regex: /\"((\"\")|([^\"]))*\"/,
            }, {
                token : "constant.numeric", // radixed literal
                regex : radixedLiteral
            }, {
                token : "constant.numeric", // numeric literal
                regex : numericLiteral
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
            	regex: /\|\s*/,
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
            	regex: binarySelector,
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
            	regex: keyword
            }, {
            	token: "name.global",
            	regex: global
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
            	regex: identifier,
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
                regex : radixedLiteral
            }, {
                token : "constant.numeric.byte", // numeric literal
                regex : numericLiteral
            }],
            symbol: [{
            	token: "string.other.symbol",
            	regex: keyword,
            	next: "start"
            }, {
            	token: "string.other.symbol",
            	regex: identifier,
            	next: "start"
            }, {
            	token: "string.other.symbol",
            	regex: binarySelector,
            	next: "start"
			}, {
				token: "invalid",
				regex: /./,
				next: "start"
			}],
            temporaries: [{
            	token: "keyword.operator.temporaries",
            	regex: /\|/,
            	next: "start"
            }, {
            	token: "variable.other.temporary",
            	regex: identifier
            }, {
				token: "invalid",
				regex: /^\s/,
				next: "start"
			}]
        }
    
    this.normalizeRules();
};

SmalltalkCodeHighlightRules.metaData = 


oop.inherits(SmalltalkCodeHighlightRules, TextHighlightRules);

exports.SmalltalkCodeHighlightRules = SmalltalkCodeHighlightRules;
});