var request = require('request');
var cheerio = require('cheerio');

var searchType = '4';
var searchQuery = 'hello';
var url = 'http://www.cantonese.sheik.co.uk/dictionary/search/?searchtype=4&text=' + searchQuery;

request(url, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    // var $ = cheerio.load(response.body);
  	var $ = cheerio.load(response.body);
    // console.log($);
    // console.log(cheerio);
  	var charText = $('.chinesemed').contents().map(function() {
    if (this.type === 'text')
        return $(this).text().trim();
	}).get();
  	// console.log(charText);

	var jyutping = [];
	$('span.listjyutping').each(function(i, elm) {
    console.log($(this).text().trim());
    	jyutping.push($(this).text().trim());
	}).get();
	// console.log(jyutping);

	var definitions = [];
	$('.border.valign td:last-child').each(function(i, elm) {
    	definitions.push($(this).text().trim());
	}).get();
	definitions.shift(); //rid of 'Found 0 character entries for...'
	definitions.shift(); //rid of empty element
	// console.log(definitions);
	//TODO: parse based on meaning
	//seperate top list and bottom list

  } else if (error) {
  	console.log(error);
  }
});
