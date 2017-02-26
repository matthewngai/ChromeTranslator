function getCurrentSelectedText(callback) {
  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getSelection") {
      console.log(window.getSelection().toString());
      sendResponse({data: window.getSelection().toString()});     
    }
    else {
      sendResponse({}); // snub them.
    }
  });
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function oddcast(url, text, errorCallback) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
    }
  });
  xhr.open("GET", url +  text + "&useUTF8=1");
  xhr.setRequestHeader("cache-control", "no-cache");
  xhr.onerror = function() {
    errorCallback('Network error: ' + xhr.status + xhr.responseText);
  };
  xhr.send(null);
}

function bingTTS(urlLink, text, errorCallback) { 
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      var blob = new Blob([xhr.response], {type: 'audio/ogg'});
      var url = window.URL || window.webkitURL;
      var objectUrl = url.createObjectURL(blob);
      var audio = new Audio();
      audio.src = objectUrl;
      renderStatus(xhr);
      audio.onload = function(evt) {
        url.revokeObjectUrl(objectUrl);
      };
      audio.play();                  
    }
  });
  xhr.open("GET", urlLink + text);
  xhr.responseType = 'blob';
  xhr.setRequestHeader("cache-control", "no-cache");
  xhr.onerror = function() {
    errorCallback('Network error: ' + xhr.status + xhr.responseText);
  };
  xhr.send(null);
}

function bingTrans(url, text, resultCallback, errorCallback) {
  var rn = Math.floor((Math.random() * 100000) + 1);
  var data = "[{id: " + rn + ", text: \"" + text + "\"}]";
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      var rs = JSON.parse(this.responseText);
      var textData = rs.items[0].text;
      resultCallback(textData);
    }
  });

  xhr.open("POST", url);
  xhr.setRequestHeader("content-type", "application/json");
  xhr.setRequestHeader("cache-control", "no-cache");

  xhr.onerror = function() {
    errorCallback('Network error: ' + xhr.status + xhr.responseText);
  };
  xhr.send(data);
}

function changeHandler() {
  //turn on
  if (onoffswitchtoggle.checked) {
    console.log('ON');
  }
  //turn off
  else  {
    console.log('OFF');
  }
}

function changeVoice() {
  if (voiceswitchtoggle.checked) {
    console.log('Male');
  }
  else {
    console.log('Female');
  }
}

document.addEventListener('DOMContentLoaded', function() {

  document.getElementById("onoffswitchtoggle").addEventListener('click', changeHandler);
  document.getElementById("voiceswitchtoggle").addEventListener('click', changeVoice);

  getCurrentSelectedText(
    function(selectedText) {
      console.log(selectedText);
      var oddUrl = "http://cache-a.oddcast.com/c_fs/440044ed609bc14281cbd9b2a466c450.mp3?engine=4&language=10&voice=1&text=";
      var lang = "yue";
      var myUrl = "http://www.bing.com/translator/api/language/Speak?locale=" + lang + "&gender=male&media=audio%2Fmp3&text=";
      var myUrl_t = "http://www.bing.com/translator/api/Translate/TranslateArray?from=-&to=" + lang;
      var finalText = 'Hello';
      var translateText = 'Does this work?';

      // bingTrans(myUrl_t, translateText, 
      // function(resultCallback) {
      //   finalText = resultCallback;
      //   //call function inside result callback
      //   bingTTS(myUrl, encodeURI(finalText), function(errorMessage) {
      //     renderStatus('Cannot retrieve speech: ' + errorMessage);
      //   });
      // },
      // function(errorMessage) {
      //   renderStatus('Cannot translate: ' + errorMessage);
      // });


  });
});
