var textToSpeak;
var finalVert;
var finalHoriz;
var showOnTop = 0;
var topPos;

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

                middleHorizontal = (rect.right - rect.left)/2 + rect.left;
                vertical = (rect.bottom - rect.top)/2 + rect.top;
                winHeightMid = $(window).height() / 2;
            }
        }
    }
    console.log(vertical);
    console.log(winHeightMid);
    if (vertical > winHeightMid) {
      finalVert = topPos;
      showOnTop = 1;
    } else {
      finalVert = topPos + (rect.bottom - rect.top);
      showOnTop = 0;
    }
    console.log(finalVert);
    finalHoriz = middleHorizontal;
}

function showPopup(selectedText) {
textToSpeak = selectedText;

var winpop = document.createElement("div");
winpop.setAttribute("id", "chromeextensionpopup");
winpop.style.left = finalHoriz+'px';
winpop.style.top = finalVert+'px';
//add something to trigger showtop or show bottom
document.body.appendChild(winpop);
var closelink = document.createElement("div");
closelink.setAttribute("id", "chromeextensionpopupcloselink");
closelink.innerText = 'x';
document.getElementById("chromeextensionpopup").appendChild(closelink);
var textDisplay = document.createElement("div");
textDisplay.setAttribute("id", "displaytextstyle");
winpop.appendChild(textDisplay);
textDisplay.innerText = selectedText.sendback.replace(/(\r\n|\n|\r)/gm, " ");
var speakerURL = chrome.extension.getURL('images/speaker.png');
var img = "<img id='speakerImg' src="+ speakerURL +" />";
// var $a = $("<a>", {id: "foo", "class": "a"});
$('#displaytextstyle').prepend(img);

/*
TODO****
1. format text and word limit
*/
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
                speakWords(textToSpeak.sendback);
            } else if (!target.parents('div#chromeextensionpopup').length) {
              removeExtensionPopup();
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

function documentStatus() {
  console.log(document);
}

function deactivateListeners() {
  try {
    removeExtensionPopup();
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('mousedown', onMouseDown);
    documentStatus();
  } catch(err) {
    console.log(err);
  }
}

function initcs() {
  chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    console.log(msg);
    console.log(sender);
    console.log(sendResponse);
    if (msg.toggle) {
      if (msg.toggle == 'On') {
        activateListeners();
      } else {
        console.log("DEACTIVATE");
        deactivateListeners();
      }
    }
    else if (msg) {
      calculateXY();
      showPopup(msg);
    }
  });
}
initcs();
