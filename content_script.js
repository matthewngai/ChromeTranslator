var textToSpeak;
var finalVert;
var finalHoriz;
var showOnTop = 0;
var topPos;
var textHeight;
var doNotPop;
var globalSpeakerId = "ct-chrome-tts-speakerImg-"; //for repeating speaker icon
var idSlot; //id for selected text in array
var tempWordsArray = [];

function speakWords(selectedText) {
  chrome.runtime.sendMessage(null, {'speakWords' : selectedText});
}

function removeExtensionPopup(){
  $("#chromeextensionpopup").remove();
  chrome.runtime.sendMessage(null, {'closetts': "close"});
}

function calculateXY() {
    var sel = document.selection, range;
    var width = 0, height = 0, middleHorizontal = 0, winHeightMid = 0, vertical = 0;
    if (sel) {
        if (sel.type != "Control") {
            range = sel.createRange();
            width = range.boundingWidth;
            height = range.boundingHeight;
        }
    } else if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0).cloneRange();
            if (range.getBoundingClientRect) {
                var rect = range.getBoundingClientRect();
                var body = document.body;
                var docEl = document.documentElement;

                var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
                var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

                var clientTop = docEl.clientTop || body.clientTop || 0;
                var clientLeft = docEl.clientLeft || body.clientLeft || 0;
                topPos  = rect.top +  scrollTop - clientTop;
                var left = rect.left + scrollLeft - clientLeft;

                textHeight = (rect.bottom - rect.top);
                middleHorizontal = (rect.right - rect.left)/2 + rect.left;
                vertical = (rect.bottom - rect.top)/2 + rect.top;
                winHeightMid = $(window).height() / 2;
            }
        }
    }
    if (vertical > winHeightMid) {
      finalVert = topPos; //minus
      showOnTop = 1;
    } else {
      finalVert = topPos + textHeight + textHeight/2;
      showOnTop = 0;
    }
    finalHoriz = middleHorizontal;
    doNotPop = middleHorizontal;
}

function showPopup(selectedText) {
  if (selectedText.sendback) {
    textToSpeak = selectedText;

    var winpop = document.createElement("div");
    winpop.setAttribute("id", "chromeextensionpopup");
    winpop.style.left = finalHoriz +'px';
    document.body.appendChild(winpop);

    //beginning of actual text
    var textDisplay = document.createElement("div");
    textDisplay.setAttribute("id", "displaytextstyle");
    winpop.appendChild(textDisplay);
    textDisplay.innerText = selectedText.sendback.replace(/(\r\n|\n|\r)/gm, " ");
    var speakerURL = chrome.extension.getURL('images/speaker.png');
    var img = "<img id='speakerImg' src="+ speakerURL +" />";
    // var $a = $("<a>", {id: "foo", "class": "a"});
    $('#displaytextstyle').prepend(img);
    if (showOnTop) {
      winpop.style.top = finalVert-$("#displaytextstyle").height()-textHeight +'px';
    } else {
      winpop.style.top = finalVert +'px';
    }
  } else if (selectedText.entries) {
    //pick the one selected to speak
    tempWordsArray = selectedText.entries.textOnlyArray;

    var winpop = document.createElement("div");
    winpop.setAttribute("id", "chromeextensionpopup");
    winpop.style.left = finalHoriz +'px';
    document.body.appendChild(winpop);

    var tableGroup = document.createElement("table");
    tableGroup.setAttribute("id", "chrometranslatingtablegroup");
    winpop.appendChild(tableGroup);
    var tbody = document.createElement("tbody");
    tbody.setAttribute("id", "chrometranslatingtbody");
    document.getElementById("chrometranslatingtablegroup").appendChild(tbody);
    //parse table into 4 columns and 'x' amount of rows

    var cols = 3; //it's actually 4
    var rows = selectedText.entries.textOnlyArray.length;
    var html = "";
    var noResults = 'No results found.';
    if (!rows) {
      html += '<div>' + noResults + '</div>';
    } else {
      for(var i = 0; i < rows; i++) {
          html += '<tr>';
          var element;
          for(var h = 0; h <= cols; h++) {
            if (h == 0) {
              //speaker icon
              var speakerURL = chrome.extension.getURL('images/speaker.png');
              var speakerId = globalSpeakerId + i;
              var img = '<img style="min-width: 24px; max-width: 32px;" id=' + speakerId + ' src='+ speakerURL +' />';
              element = img;
            } else if (h == 1) {
              element = selectedText.entries.textOnlyArray[i];
            } else if (h == 2) {
              element = selectedText.entries.jyutping[i];
            } else if (h == 3) {
              element = selectedText.entries.definitions[i];
            }
            if (h == 1) { //enlarge
               html += '<td id="ctTtsTRanslate" class="ct-chin-text-speciale">' + element + '</td>';
            } else {
               html += '<td>' + element + '</td>';
            }
          }
          html += '</tr>';
      }
    }

    // should be free of html elements
    document.getElementById('chrometranslatingtbody').innerHTML += html;

    if (showOnTop) {
      winpop.style.top = finalVert-$("#chrometranslatingtablegroup").height()-textHeight +'px';
    } else {
      winpop.style.top = finalVert +'px';
    }
  }

}
function activateListeners() {
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
}

function onMouseDown(evt) {
    var parentElement = document.getElementById('chromeextensionpopup');
    firstX = evt.clientX;
    firstY = evt.clientY;
    try {
      if (evt.target.id != parentElement.id) {
        var target = $(evt.target);
          if (!target.parents('div#chromeextensionpopup').length) {
          removeExtensionPopup();
        }
      }
    } catch (err) {
      // console.log(err);
    }
}

function onMouseUp(evt) {
    var parentElement = document.getElementById('chromeextensionpopup');
    var speakerElement = document.getElementById('speakerImg');
    try {
      if(event.button == 0) {
        try {
          if (evt.target.id != parentElement.id) {
            var target = $(evt.target);
            if (target[0].id == 'speakerImg') {
                speakWords(textToSpeak);
            } else if (!target.parents('div#chromeextensionpopup').length) {
              removeExtensionPopup();
            } else if(evt.target && evt.target.nodeName == "IMG") {
              var chosenSpeakId = evt.target.id;
              if (chosenSpeakId.indexOf(globalSpeakerId) >= 0) {
                idSlot = chosenSpeakId.substr(chosenSpeakId.indexOf(globalSpeakerId) + globalSpeakerId.length, chosenSpeakId.length);
                speakWords(tempWordsArray[idSlot]);
              }
          	}

          }
        }
        catch(error) {
          // console.log(error);
        }
        var focused = document.activeElement;
        var selectedText;
        if (focused) {
          try {
            if (focused.value) {
              selectedText = focused.value.substring(
                  focused.selectionStart, focused.selectionEnd);
            }
          } catch (err) {
            console.log(err);
          }
        }
        if (selectedText == undefined) {
          var sel = window.getSelection();
          var selectedText = sel.toString();
          if (selectedText.trim() && !parentElement) {
            chrome.runtime.sendMessage(null, {'showPopup' : selectedText});
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
}

function deactivateListeners() {
  try {
    removeExtensionPopup();
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('mousedown', onMouseDown);
  } catch(err) {
    console.log(err);
  }
}

function initcs() {
  chrome.runtime.sendMessage(null, {'getSwitch' : 'status'});

  chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.switchback) {
      if (msg.switchback == 'On') {
        activateListeners();
      }
    }
    if (msg.toggle) {
      if (msg.toggle == 'On') {
        activateListeners();
      } else {
        deactivateListeners();
      }
    }
    else if (msg) {
      calculateXY();
      if (doNotPop) {
        showPopup(msg);
      }
    }
  });
}
initcs();
