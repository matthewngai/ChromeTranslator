var speakKeyStr;

function speakSelection() {
  var focused = document.activeElement;
  var selectedText;
  if (focused) {
    try {
      selectedText = focused.value.substring(
          focused.selectionStart, focused.selectionEnd);
    } catch (err) {
    	console.log(err);
    }
  }
  if (selectedText == undefined) {
    var sel = window.getSelection();
    var selectedText = sel.toString();
    console.log(selectedText);
  }
  console.log(selectedText);
  // chrome.extension.sendRequest({'showPopup': selectedText});
}

function onExtensionMessage(request) {
  // if (request['speakSelection'] != undefined) {
  //   if (!document.hasFocus()) {
  //     return;
  //   }
  //   speakSelection();
  // } else if (request['key'] != undefined) {
  //   speakKeyStr = request['key'];
  // }
}

function speakWords(selectedText) {
  chrome.runtime.sendMessage(null, {'speakWords' : selectedText});
}

function removeExtensionPopup(){
  $("#chromeextensionpopup").remove();
  chrome.runtime.sendMessage(null, {'closetts'});
}

function showPopup(selectedText) {
console.log(selectedText.sendback);

var winpop = document.createElement("div");
winpop.setAttribute("id", "chromeextensionpopup");
document.body.appendChild(winpop);
var closelink = document.createElement("div");
closelink.setAttribute("id", "chromeextensionpopupcloselink");
closelink.innerText = 'x';
document.getElementById("chromeextensionpopup").appendChild(closelink);
var textDisplay = document.createElement("div");
textDisplay.setAttribute("id", "displaytextstyle");
winpop.appendChild(textDisplay);
textDisplay.innerText = selectedText.sendback;
var speakerURL = chrome.extension.getURL('images/speaker.png');
var img = "<img id='speakerImg' src="+ speakerURL +" />";
// var $a = $("<a>", {id: "foo", "class": "a"});
$('#displaytextstyle').prepend(img);

/*
TODO****
1. make floating popup attached to word
2. speak voice
3. Automate id's not hardcode
*/
document.getElementById("speakerImg").addEventListener("click", speakWords(selectedText.sendback));
document.getElementById("chromeextensionpopupcloselink").addEventListener("click", removeExtensionPopup);
  // searchText(selectedText);
}

function initcs() {
	// chrome.extension.onRequest.addListener(onExtensionMessage);
	// chrome.extension.sendRequest({'init': true}, onExtensionMessage);

  chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg) {
      console.log(msg);
      // console.log(sender);
      // console.log(sendResponse);
      showPopup(msg);
    }
  });
  document.addEventListener('click', function(evt) {
    parentElement = document.getElementById('chromeextensionpopup');
    try {
      console.log(parentElement);
      console.log(evt.target.id);
      if (evt.target.id != parentElement.id) {
        var target = $(evt.target);
        if (!target.parents('div#chromeextensionpopup').length) {
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
  });

}

initcs();
