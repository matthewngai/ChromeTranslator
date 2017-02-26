/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
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
  var rn = Math.floor((Math.random() * 10000) + 1);
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

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
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
