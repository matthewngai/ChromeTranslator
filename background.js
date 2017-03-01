// chrome.browserAction.onClicked.addListener(clickedAction);
// chrome.tabs.onSelectionChanged.addListener(onTabSelect);

// function clickedAction() {
// 	console.log("clicked action!");
// }

// function onTabSelect() {
// 	console.log("on tab select!");
// }

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

function showPopup(selectedText) {
  console.log(selectedText);
  /*
  TODO:
  Make the popup html here 
  get the translate
  display to popup html
  */
  chrome.runtime.getURL("/translate.html");
  console.log(chrome.runtime);
  // topdoc = window.document;
  var popup = document.getElementById('translate-window');
  // console.log(topdoc);
  console.log(popup);


	// searchText(selectedText);
}

function searchText(selectedText) {
    var lang = "yue";
    var myUrl_t = "http://www.bing.com/translator/api/Translate/TranslateArray?from=-&to=" + lang;
    var finalText = 'Hello';
    bingTrans(myUrl_t, selectedText, 
    function(resultCallback) {
      finalText = resultCallback;	//after from yandex
      //call function inside result callback
    },
    function(errorMessage) {
      renderStatus('Cannot translate: ' + errorMessage);
    });
}

var lastUtterance = '';
var speaking = false;
var globalUtteranceIndex = 0;

// if (localStorage['lastVersionUsed'] != '1') {
//   localStorage['lastVersionUsed'] = '1';
//   chrome.tabs.create({
//     url: chrome.extension.getURL('options.html')
//   });
// }

// function speak(utterance) {
//   if (speaking && utterance == lastUtterance) {
//     chrome.tts.stop();
//     return;
//   }

//   speaking = true;
//   lastUtterance = utterance;
//   globalUtteranceIndex++;
//   var utteranceIndex = globalUtteranceIndex;

//   var rate = localStorage['rate'] || 1.0;
//   var pitch = localStorage['pitch'] || 1.0;
//   var volume = localStorage['volume'] || 1.0;
//   var voice = localStorage['voice'];
  
//   chrome.tts.speak(
//       utterance,
//       {voiceName: voice,
//        rate: parseFloat(rate),
//        pitch: parseFloat(pitch),
//        volume: parseFloat(volume),
//        onEvent: function(evt) {
//          if (evt.type == 'end' ||
//              evt.type == 'interrupted' ||
//              evt.type == 'cancelled' ||
//              evt.type == 'error') {
//            if (utteranceIndex == globalUtteranceIndex) {
//              speaking = false;
//            }
//          }
//        }
//       });
// }

function initBackground() {
  // loadContentScriptInAllTabs();

  // var defaultKeyString = getDefaultKeyString();
  // var keyString = localStorage['speakKey'];
  // if (keyString == undefined) {
  //   keyString = defaultKeyString;
  //   localStorage['speakKey'] = keyString;
  // }
  // sendKeyToAllTabs(keyString);

  chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        console.log('inside passed');
        if (request['init']) {
          sendResponse({'key': localStorage['speakKey']});
        } else if (request['showPopup']) {

          showPopup(request['showPopup']);
        }
      });

  // chrome.browserAction.onClicked.addListener(
  //     function(tab) {
  //       chrome.tabs.sendRequest(
  //           tab.id,
  //           {'speakSelection': true});
  //     });
}

initBackground();