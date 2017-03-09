
// var options = { method: 'GET',
//   url: 'http://120.24.87.124/cgi-bin/ekho2.pl',
//   qs:
//    { cmd: 'SPEAK',
//      voice: '',
//      speedDelta: '0',
//      pitchDelta: '0',
//      volumeDelta: '0',
//      text: '' },
//   headers:
//    { 'postman-token': 'e9fca64e-a55d-22b3-356c-f2bcdff1ffba',
//      'cache-control': 'no-cache' } };

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);

//   console.log(response.statusCode);
// });

 //  function bingTTS(urlLink, text, errorCallback) {
 //    var xhr = new XMLHttpRequest();
 //    xhr.withCredentials = true;
 //    xhr.addEventListener("readystatechange", function () {
 //      if (this.readyState === 4) {
 //        var blob = new Blob([xhr.response], {type: 'audio/ogg'});
 //        var url = window.URL || window.webkitURL;
 //        var objectUrl = url.createObjectURL(blob);
 //        var audio = new Audio();
 //        audio.src = objectUrl;
 //        renderStatus(xhr);
 //        audio.onload = function(evt) {
 //          url.revokeObjectUrl(objectUrl);
 //        };
 //        audio.play();
 //      }
 //    });
 //    xhr.open("GET", urlLink + text);
 //    xhr.responseType = 'blob';
 //    xhr.setRequestHeader("cache-control", "no-cache");
 //    xhr.onerror = function() {
 //      errorCallback('Network error: ' + xhr.status + xhr.responseText);
 //    };
 //    xhr.send(null);
 //  }
 //    var myUrl = "http://www.bing.com/translator/api/language/Speak?locale=" + lang + "&gender=male&media=audio%2Fmp3&text=";
 //
 //  bingTTS(myUrl, encodeURI(finalText), function(errorMessage) {
 //   renderStatus('Cannot retrieve speech: ' + errorMessage);
 // });
