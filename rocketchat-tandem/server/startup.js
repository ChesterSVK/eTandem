/* eslint no-multi-spaces: 0 */
import {Meteor} from 'meteor/meteor';
import TandemLanguageLevels from './models/TandemLanguageLevels';
import TandemLanguages from './models/TandemLanguages';

Meteor.startup(function () {

	const languages = [
		{_id: "tdl_akan", code: "aka", name: "Akan"},
		{_id: "tdl_amharic", code: "amh", name: "Amharic"},
		{_id: "tdl_arabic", code: "ara", name: "Arabic"},
		{_id: "tdl_azerbaijani", code: "aze", name: "Azerbaijani"},
		{_id: "tdl_balochi", code: "bal", name: "Balochi"},
		{_id: "tdl_belarusian", code: "bel", name: "Belarusian"},
		{_id: "tdl_bengali", code: "ben", name: "Bengali (Bangla)"},
		{_id: "tdl_chewa", code: "nya", name: "Chewa"},
		{_id: "tdl_czech", code: "ces", name: "Czech"},
		{_id: "tdl_deccan", code: "dcc", name: "Deccan"},
		{_id: "tdl_dutch", code: "nld", name: "Dutch"},
		{_id: "tdl_english", code: "eng", name: "English"},
		{_id: "tdl_estonian", code: "est", name: "Estonian"},
		{_id: "tdl_finnish", code: "fin", name: "Finnish"},
		{_id: "tdl_french", code: "fra", name: "French"},
		{_id: "tdl_germany", code: "deu", name: "Germany"},
		{_id: "tdl_greek", code: "ell", name: "Greek"},
		{_id: "tdl_hausa", code: "hau", name: "Hausa"},
		{_id: "tdl_hiligaynon", code: "hil", name: "Hiligaynon/Ilonggo(Visayan)"},
		{_id: "tdl_mossi", code: "mos", name: "Mossi"},
		{_id: "tdl_hindi", code: "hin", name: "Hindi"},
		{_id: "tdl_hungarian", code: "hun", name: "Hungarian"},
		{_id: "tdl_italian", code: "ita", name: "Italian"},
		{_id: "tdl_japanese", code: "jpn", name: "Japanese"},
		{_id: "tdl_javanese", code: "jav", name: "Javanese"},
		{_id: "tdl_jin", code: "jin", name: "Jin"},
		{_id: "tdl_kannada", code: "kan", name: "Kannada"},
		{_id: "tdl_kazakh", code: "kaz", name: "Kazakh"},
		{_id: "tdl_khmer", code: "khm", name: "Khmer"},
		{_id: "tdl_kinyarwanda", code: "kin", name: "Kinyarwanda"},
		{_id: "tdl_korean", code: "kor", name: "Korean"},
		{_id: "tdl_malayalam", code: "mak", name: "Malayalam"},
		{_id: "tdl_marathi", code: "mar", name: "Marathi"},
		{_id: "tdl_nepali", code: "nep", name: "Nepali"},
		{_id: "tdl_norwegian", code: "nor", name: "Norwegian"},
		{_id: "tdl_oromo", code: "orm", name: "Oromo"},
		{_id: "tdl_pashto", code: "pus", name: "Pashto"},
		{_id: "tdl_persian", code: "fas", name: "Persian"},
		{_id: "tdl_polish", code: "pol", name: "Polish"},
		{_id: "tdl_portuguese", code: "por", name: "Portuguese"},
		{_id: "tdl_punjabi", code: "pan", name: "Punjabi"},
		{_id: "tdl_romanian", code: "ron", name: "Romanian"},
		{_id: "tdl_russian", code: "rus", name: "Russian"},
		{_id: "tdl_sinhalese", code: "sin", name: "Sinhalese"},
		{_id: "tdl_slovak", code: "slk", name: "Slovak"},
		{_id: "tdl_slovenian", code: "slv", name: "Slovenian"},
		{_id: "tdl_somali", code: "som", name: "Somali"},
		{_id: "tdl_spanish", code: "spa", name: "Spanish"},
		{_id: "tdl_swedish", code: "swe", name: "Swedish"},
		{_id: "tdl_tagalog", code: "tgl", name: "Tagalog (Filipino)"},
		{_id: "tdl_tamil", code: "tam", name: "Tamil"},
		{_id: "tdl_thai", code: "tha", name: "Thai"},
		{_id: "tdl_turkish", code: "tur", name: "Turkish"},
		{_id: "tdl_turkmen", code: "tuk", name: "Turkmen"},
		{_id: "tdl_ukrainian", code: "ukr", name: "Ukrainian"},
		{_id: "tdl_uzbek", code: "uzb", name: "Uzbek"},
		{_id: "tdl_vietnamese", code: "vie", name: "Vietnamese"},
		{_id: "tdl_zulu", code: "zul", name: "Zulu"},
	];

	for (const language of languages) {
		if (!TandemLanguages.findOneById(language._id)) {
			TandemLanguages.upsert(language._id, {$set: language});
		}
	}


	const languageLevels = [
		{_id: "tdll_a1", level: "A1"},
		{_id: "tdll_a2", level: "A2"},
		{_id: "tdll_b1", level: "B1"},
		{_id: "tdll_b2", level: "B2"},
		{_id: "tdll_c1", level: "C1"},
		{_id: "tdll_c2", level: "C2"},
	];

	for (const languageLevel of languageLevels) {
		if (!TandemLanguageLevels.findOneById(languageLevel._id)) {
			TandemLanguageLevels.upsert(languageLevel._id, {$set: languageLevel});
		}
	}
});
