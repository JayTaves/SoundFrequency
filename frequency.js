var SampleText, juilland, tableRow, analysis, roundToN, texteZola, textePonge,
colorList, charClicked;

tableRow = function (chr, count, jfreq, freq) {
	var row;

	row = $("<tr>" +
				"<td>" + chr + "</td>" +
				"<td>" + count + "</td>" +
				"<td>" + roundToN(jfreq * 100, 2) + "</td>" +
				"<td>" + roundToN(freq * 100, 2) + "</td>" +
				"<td>" +
					roundToN((freq - jfreq) / jfreq * 100, 2) + "</td>" +
			"</tr>");

	row.hover(function () {
		$("a").removeClass("selected");
		$("a." + chr).addClass("selected");
	}, function () {
		$("a." + chr).removeClass("selected");
	});

	row.bind("click", function () {
		var color, oldColor;

		if (charClicked[chr] === undefined) {
			for (color in colorList) {
				if (!colorList[color]) {
					$(this).addClass(color);
					$("a." + chr).addClass(color);
					colorList[color] = true;
					charClicked[chr] = color;
					break;
				}
			}
		} else {
			oldColor = charClicked[chr];
			$(this).removeClass(oldColor);
			$("a." + chr).removeClass(oldColor);
			colorList[oldColor] = false;
			charClicked[chr] = undefined;
		}
	});

	return row;
};

SampleText = function ( text, freqTable ) {

	this.text = text;
	this.bodyStr = "";
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

				this.bodyStr = this.bodyStr + "<a class='" + curChar + "'>" +
					curChar + "</a>";
				this.total++;
			} else {
				// The character wasn't in the list Juilland defines. e.g. a
				// space or some other character
				if (curChar === "\n") {
					this.bodyStr = this.bodyStr + "</br>";
				} else {
					this.bodyStr = this.bodyStr +
						$("<div></div>").text(curChar).html();
				}
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

charClicked = {};

colorList = {
	"yellow" : false,
	"purple" : false,
	"orange" : false,
	"lightblue" : false,
	"red" : false,
	"buff" : false,
	"green" : false,
	"purplishpink" : false,
	"blue" : false,
	"yellowishpink" : false,
	"violet" : false,
	"orangeyellow" : false,
	"purplishred" : false,
	"greenishyellow" : false,
	"reddishbrown" : false,
	"yellowgreen" : false,
	"yellowishbrown" : false,
	"reddishorange" : false,
	"olivegreen" : false
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

texteZola = "obudlaʁygenego lɔʁskɔ̃vjε̃dekε ɔ̃tʁuvləpɑsaʒdypɔ̃nœf ynsɔʁtədəkɔʁidɔʁetʁwatesɔ̃bʁ\n kivadlaʁymazaʁinalaʁydsεn səpasaʒ atʁɑ̃tpadlɔ̃edødlaʁʒ oplys ilεpaveddalʒonɑtʁ yze desele syɑ̃tuʒuʁzynymiditeɑkʁ ləvitʁajkilkuvʁ kupeaɑ̃glədʁwa εnwaʁdəkʁas\n\n paʁleboʒuʁdete kɑ̃tε̃luʁsɔlεjbʁylleʁy ynklaʁteblɑ̃ʃɑtʁ tobdevitʁəsal etʁεnmizeʁabləmɑ̃ dɑ̃lpɑsaʒ paʁlevilε̃ʒuʁdivεʁ paʁlematinedbʁujaʁ levitʁənəʒεtkədlanɥisyʁledalglyɑ̃t dəlanɥisalieiɲɔbl\n\n agoʃsəkʁøzdebutikzɔpskyʁbɑsekʁɑze lεsɑ̃eʃapedesufləfʁwadkavo iljaladebukinist demaʁʃɑ̃dʒwεdɑ̃fɑ̃ dekaʁtɔnje dɔ̃lezetalaʒ gʁidpusjεʁ dɔʁməvagmɑ̃dɑ̃lɔ̃bʁ levitʁin fεtdəptikaʁo mwaʁetʁɑ̃ʒmɑ̃lemaʁʃɑ̃diz dəʁflεvεʁdɑtʁ odla dεʁjεʁlezetalaʒ lebutikplεndətenεbʁ sɔ̃totɑ̃dətʁulygybʁ dɑ̃lekεlsaʒitdefɔʁməbizaʁ\n\n adʁwat syʁtutlalɔ̃gœʁdypasaʒ setɑ̃ynmyʁajkɔ̃tʁəlakεl lebutikjedɑ̃fas ɔ̃plakedetʁwataʁmwaʁ dezɔbʒεsɑ̃nɔ̃ demaʁʃɑ̃ndizublijeladpɥivε̃tɑ̃ sjetalləlɔ̃dmε̃splɑ̃ʃ pε̃tdynɔʁibləkulœʁbʁyn ynmaʁʃɑ̃ddəbiʒufo setetablidɑ̃zyndezaʁmwaʁ εlyvɑ̃debagdəkε̃zsu delikatmɑ̃poze syʁε̃lidvluʁblø ofɔ̃dynbwatɑ̃nakaʒu\n\n odsydyvitʁaj ləmyʁajmɔ̃t nwaʁ gʁosjεʁmɑ̃kʁepi kɔmkuvεʁdynlεpʁ etutkutyʁedsikatʁis\n\n ləpɑsaʒdypɔ̃nœf nεpɑzε̃ljødpʁɔmnad ɔ̃lpʁɑ̃puʁeviteʁε̃detuʁ puʁgaɲekεlkəminyt ilεtʁavεʁsepaʁε̃pyblikdəʒɑ̃afeʁe dɔ̃lyniksusi edalevitedʁwadvɑ̃ø. ɔ̃nivwadezapʁɑ̃tiɑ̃tablijedtʁavaj dezuvʁiεʁʁəpɔʁtɑ̃lœʁuvʁaʒ dezɔmedefam tənɑ̃depakεsulœʁbʁɑ ɔ̃nivwaɑ̃kɔʁdevjεjaʁ sətʁεnɑ̃dɑ̃lkʁepyskylmɔʁn kitɔ̃bdevitʁ edebɑ̃ddəptizɑ̃fɑ̃ kivjεnla osɔʁtiʁdəlekɔl puʁfεʁε̃tapaʒɑ̃kuʁɑ̃ ɑ̃tapɑ̃akudsabosyʁledal tutlaʒuʁne sεtε̃bʁɥisεkepʁesedpɑ sɔnɑ̃syʁlapjεʁ avεkyniʁegylaʁiteiʁitɑ̃t pεʁsɔnnəpaʁl pεʁsɔnnəstasjɔn ʃakε̃kuʁasezɔkypasjo latεtbɑs maʁʃɑ̃ʁapidmɑ̃ sɑ̃dɔneʁobutikε̃sœlkudœj lebutikjeʁgaʁdədε̃nεʁε̃kjε lepɑsɑ̃ki paʁmiʁakl saʁεtdəvɑ̃lœʁzetalaʒ\n\n ləswaʁ tʁwabεkdəgɑz ɑ̃nfεʁmedɑ̃delɑ̃tεʁnəluʁdekaʁe eklεʁləpɑsaʒ sebεkdəgɑz pɑ̃dyovitʁaj syʁlekεlilʒεtdetaʃdəklaʁtefov lεsɑ̃tɔ̃beotuʁdø deʁɔ̃dynlɥœʁpɑl kivasijesɑ̃blədispaʁεtʁəpaʁmɔmɑ̃ ləpɑsaʒpʁɑ̃laspεsinistʁədε̃veʁitabləkupgɔʁʒ\n\n dəgʁɑ̃dzɔ̃bʁəsalɔ̃ʒsyʁledal desufləzymidvjεndəlaʁy ɔ̃diʁεyngalʁisuteʁεn vagmɑ̃ekleʁe paʁtʁwalɑ̃pfyneʁεʁ lemaʁʃɑ̃skɔ̃tɑ̃t puʁtuteklεʁaʒ demεgʁəʁejɔ̃ kəlebεkdəgɑz ɑ̃vwatalœʁvitʁin ilzalymsœlmɑ̃ dɑ̃lœʁbutik ynlɑ̃pmynidε̃abaʒuʁ kilpozsyʁləkwε̃dlœʁkɔ̃twaʁ elepɑsɑ̃pœvtalɔʁdistε̃ge skiljaofɔ̃dəsetʁu ulanɥiabitpɑ̃dɑ̃lʒuʁ […]\n\n iljakεlkəzane ɑ̃fasdəsεtmaʁʃɑ̃d sətʁuvεtynbutik dɔ̃lebwazʁidvεʁbutεj sɥεlymiditepaʁtutlœʁfɑ̃t lɑ̃sεɲ fεtdynplɑ̃ʃetʁwatelɔ̃g pɔʁtεtɑ̃lεtʁənwaʁ ləmomεʁsəʁi esyʁε̃devitʁədlapɔʁt etεtekʁiε̃nɔ̃dfam teʁεsʁakε̃ ɑ̃kaʁaktεʁʁuʒ adʁwateagoʃ sɑ̃nfɔ̃sεdevitʁinpʁɔfɔ̃d tapisedpapjeblø";
textePonge = "lɥitʁ, də la ɡʁosœʁ dɛ̃ ɡalɛ mwajɛ̃, ɛ dyn apaʁɑ̃s ply ʁyɡøːz, dyn kulœʁ mwɛ̃ yni, bʁijamɑ̃ blɑ̃ʃatʁ. sɛt-ɛ̃ mɔ̃d ɔpinjɑtʁəmɑ̃ _*3*_. puʁtɑ̃ ɔ̃ pø luvʁiːʁ: il fo alɔʁ la təniʁ o kʁø dɛ̃ tɔʁʃɔ̃, sə sɛʁviʁ dɛ̃ kuto ebʁeʃee pø fʁɑ̃, si ʁəpʁɑ̃dʁ a plyzjœʁ fwa. le dwa kyʁjø si kup, si kas lez- ɔ̃ɡl : sɛt- ɛ̃ tʁavaj ɡʁosje. le ku kɔ̃ lɥipɔʁt maʁk sɔ̃n- ɑ̃vlɔp də ʁɔ̃ blɑ̃, dyn sɔʁt də alo.\n\n a lɛ̃teʁjœʁ lɔ̃ tʁuv tut- ɛ̃ mɔ̃ːd, a bwaʁ e a mɑ̃ʒe : su ɛ̃ fiʁmamɑ̃ (a pʁɔpʁəmɑ̃ paʁle) də nakʁ, le sjø dɑ̃dəsy safɛs syʁ le sjø dɑ̃ dəsu, puʁ nə ply fɔʁme kyn maːʁ, ɛ̃ saʃɛ viskø e vɛʁdatʁ, ki fly e ʁəfly a lɔdœʁe a la vy, fʁɑ̃ʒe dyn dɑ̃tɛl nwaʁatʁ syʁ le bɔːʁ.\n\n paʁfwa tʁɛ ʁaʁ yn fɔʁmyl pɛʁl a lœʁ ɡozje də nakʁ, du lɔ̃ tʁuv osito a sɔʁne";

$(document).ready(function () {
	var text;

	$("textarea#phonemes").on("input", function () {
		text = $(this).val();

		analysis = new SampleText(text, juilland);

		$("p#text").html(analysis.bodyStr);
		$("div#copiedtext").show();

		analysis.createTable($("table#freqtable").children("tbody"));
	});

	$("input#zola").click(function () {
		$("textarea#phonemes").val(texteZola).trigger("input");
	});

	$("input#ponge").click(function () {
		$("textarea#phonemes").val(textePonge).trigger("input");
	});
});