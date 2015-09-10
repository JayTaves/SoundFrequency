var SampleText, juilland, tableRow, analysis, roundToN;

tableRow = function (chr, count, jfreq, freq) {
	return 	"<tr>" +
				"<td>" + chr + "</td>" +
				"<td>" + count + "</td>" +
				"<td>" + roundToN(jfreq * 100, 2) + "</td>" +
				"<td>" + roundToN(freq * 100, 2) + "</td>" +
				"<td>" +
					roundToN(Math.abs(jfreq - freq) / jfreq * 100, 2) + "</td>" +
			"</tr>";
};

SampleText = function ( text, freqTable ) {

	this.text = text;
	this.total = 0;
	this.freqRef = freqTable;

	this.frequencies = (function () {
		var i, arr, curChar, surrogate;

		arr = [];

		for ( i = 0; i < this.text.length; i++ ) {
			curChar = this.text[i];
			surrogate = this.text[i + 1];

			// If we find a combining tilde, we merge and do a lookup on the
			// two piece character instead
			if (surrogate === "\u0303") {
				curChar = curChar + surrogate;
				i++;
			}

			if ( this.freqRef[ curChar ] !== undefined) {
				if ( arr[ curChar ] === undefined ) {
					arr[ curChar ] = {
						count : 1
					};
				} else {
					arr[ curChar ].count++;
				}

				this.total++;
			} else {
				// The character wasn't in the list Juilland defines. e.g. a
				// space or some other character
			}

		}

		for ( curChar in this.freqRef ) {
			if ( arr[ curChar ] === undefined) {
				arr[ curChar ] = {
					count : 0
				};
			}
		}

		return arr;
	}).call(this);

	this.sortFrequencies = function () {
		var curChar, arr, analysisClosure;

		arr = [];

		for ( curChar in this.frequencies ) {
			arr.push({
				chr : curChar,
				count : this.frequencies[curChar].count
			});
		}

		analysisClosure = this;
		this.sortedFreqs = arr.sort(function ( a, b ) {
			var refA, refB;

			refA = analysisClosure.freqRef[a.chr];
			refB = analysisClosure.freqRef[b.chr];

			if (refA !== undefined && refB !== undefined) {
				return refA - refB;
			} else {
				console.error("lookup failed");
				return 0;
			}
		});
	};

	this.sortFrequencies();

	this.createTable = function (elem) {
		var i, row, character, entry;

		elem.children().first().nextAll().remove();

		for (i = this.sortedFreqs.length - 1; i > -1; i--) {
			entry = this.sortedFreqs[i];
			character = entry.chr;

			row = tableRow(character, entry.count, juilland[character],
			    entry.count / this.total);

			elem.append(row);
		}

		elem.parent().show();
	};
};

roundToN = function (num, N) {
	return Math.round(num * Math.pow(10, N)) / Math.pow(10, N);
};

juilland = {
	"ʁ" : 0.0755,
	"a" : 0.0714,
	"ə" : 0.0559,
	"l" : 0.0543,
	"s" : 0.0535,
	"ε" : 0.0525,
	"e" : 0.0512,
	"t" : 0.0505,
	"i" : 0.0493,
	"m" : 0.0409,
	"d" : 0.0399,
	"k" : 0.0374,
	"p" : 0.0368,
	"v" : 0.0321,
	"n" : 0.0289,
	"\u0251\u0303" : 0.0289,
	"u" : 0.0286,
	"ʒ" : 0.0208,
	"y" : 0.0204,
	"ɔ" : 0.0194,
	"\u0254\u0303" : 0.0185,
	"j" : 0.0181,
	"w" : 0.0150,
	"f" : 0.0131,
	"b" : 0.0120,
	"ɑ" : 0.0118,
	"o" : 0.0110,
	"\u03B5\u0303" : 0.0109,
	"z" : 0.0073,
	"ø" : 0.0071,
	"ʃ" : 0.0062,
	"ɥ" : 0.0053,
	"œ" : 0.0051,
	"g" : 0.0046,
	"\u0153\u0303" : 0.0043,
	"ɲ" : 0.0012
};

$(document).ready(function () {
	var text;

	$("textarea#phonemes").on("input", function () {
		text = $(this).val();
		text = text.split("\n").join("</br>");
		$("p#text").html(text);

		analysis = new SampleText(text, juilland);
		analysis.createTable($("table#freqtable").children("tbody"));
	});
});