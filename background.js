// chrome.browserAction.onClicked.addListener(clickedAction);
// chrome.tabs.onSelectionChanged.addListener(onTabSelect);

function clickedAction() {
	console.log("clicked action!");
}

function onTabSelect() {
	console.log("on tab select!");
}

// React when a browser action's icon is clicked.
chrome.browserAction.onClicked.addListener(function(tab) {
	console.log("hello");
});

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


function searchText(selectedText) {
    console.log(selectedText);
    var lang = "yue";
    var myUrl_t = "http://www.bing.com/translator/api/Translate/TranslateArray?from=-&to=" + lang;
    var finalText = 'Hello';
    var translateText = 'Does this work?';
    bingTrans(myUrl_t, translateText, 
    function(resultCallback) {
      finalText = resultCallback;
      //call function inside result callback
    },
    function(errorMessage) {
      renderStatus('Cannot translate: ' + errorMessage);
    });
}