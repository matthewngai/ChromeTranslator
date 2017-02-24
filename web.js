var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');

var searchType = '4';
var searchQuery = 'food';
var url = 'http://www.cantonese.sheik.co.uk/dictionary/search/?searchtype=4&text=' + searchQuery;

request(url, function (error, response, html) {
  if (!error && response.statusCode == 200) {
  	var $ = cheerio.load(response.body);
  	var charText = $('.chinesemed').contents().map(function() {
    if (this.type === 'text')
        return $(this).text().trim();
	}).get();
  	// console.log(charText);

	var jyutping = [];
	$('span.listjyutping').each(function(i, elm) {
    	jyutping.push($(this).text().trim());
	}).get();
	// console.log(jyutping);

	var definitions = [];
	$('.border.valign td:last-child').each(function(i, elm) {
    	definitions.push($(this).text().trim());
	}).get();	
	definitions.shift(); //rid of 'Found 0 character entries for...'
	definitions.shift(); //rid of empty element
	console.log(definitions);
	//TODO: parse based on meaning

  } else if (error) {
  	console.log(error);
  }
});

// var word = '再見喇';
// request.get('http://www.bing.com/translator/api/language/Speak?locale=yue&gender=female&media=audio/mp3&text=' + word)
//  	.on('response', function(response) {
//     	console.log(response.statusCode); 
//     	// console.log(response.body);
//   	})
//   	.on('data', function(data) {
//     	// decompressed data as it is received
//     	// console.log(typeof(data))
//   	})
//  	.on('error', function(err) {
//     	console.log(err);
//   	})
//   	.pipe(fs.createWriteStream('bing.mp3'));
