var textToSpeak;
var finalVert;
var finalHoriz;
var showOnTop = 0;
var topPos;
var textHeight;
var doNotPop;

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
    console.log(vertical);
    console.log(winHeightMid);
    if (vertical > winHeightMid) {
      finalVert = topPos; //minus
      showOnTop = 1;
    } else {
      finalVert = topPos + textHeight + textHeight/2;
      showOnTop = 0;
    }
    console.log(finalVert);
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
    var closelink = document.createElement("div");
    closelink.setAttribute("id", "chromeextensionpopupcloselink");
    closelink.innerText = 'x';
    document.getElementById("chromeextensionpopup").appendChild(closelink);
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
    var winpop = document.createElement("div");
    winpop.setAttribute("id", "chromeextensionpopup");
    winpop.style.left = finalHoriz +'px';
    document.body.appendChild(winpop);
    var closelink = document.createElement("div");
    closelink.setAttribute("id", "chromeextensionpopupcloselink");
    closelink.innerText = 'x';
    document.getElementById("chromeextensionpopup").appendChild(closelink);
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

    for(var i = 0; i < rows; i++) {
        html += '<tr>';
        var element;
        for(var h = 0; h <= cols; h++) {
          if (h == 0) {
            //speaker icon
            element = '';  //for now...
          } else if (h == 1) {
            element = selectedText.entries.textOnlyArray[i];
          } else if (h == 2) {
            element = selectedText.entries.jyutping[i];
          } else if (h == 3) {
            element = selectedText.entries.definitions[i];
          }
           html += '<td>' + element + '</td>';
        }
        html += '</tr>';
    }
    document.getElementById('chrometranslatingtbody').innerHTML += html;

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
      console.log(msg.switchback);
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
