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

function removeExtensionPopup(){
    document.getElementById("chromeextensionpopup").outerHTML='';
}

function showPopup(selectedText) {
  /*
  TODO:
  Make the popup html here 
  get the translate
  display to popup html
  */
  console.log(selectedText);

var div = document.createElement("div");
div.setAttribute("id", "chromeextensionpopup");
div.innerText = selectedText;
document.body.appendChild(div);

var closelink = document.createElement("div");
closelink.setAttribute("id", "chromeextensionpopupcloselink");
closelink.innerText = 'X';
document.getElementById("chromeextensionpopup").appendChild(closelink);


/*
TODO****
1. separate Popup.html from this
2. make floating popup stationary
*/
// document.getElementById("chromeextensionpopupcloselink").addEventListener("click", removeExtensionPopup);


console.log(selectedText);

  // searchText(selectedText);
}

function initcs() {
	// chrome.extension.onRequest.addListener(onExtensionMessage);
	// chrome.extension.sendRequest({'init': true}, onExtensionMessage);
  chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg) {
      showPopup(msg);
    }
  });
  document.addEventListener('click', function(evt) {
    try {
      if (evt.target.id != 'chromeextensionpopup') {
        removeExtensionPopup(); 
      }
    }
    catch(error) {
      console.log(error);
    }

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
      if (selectedText) {
      	chrome.runtime.sendMessage(null, {'showPopup' : selectedText});
      }
    }
  });

}

initcs();
