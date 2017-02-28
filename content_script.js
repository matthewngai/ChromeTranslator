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
  chrome.extension.sendRequest({'searchText': selectedText});
}

function onExtensionMessage(request) {
  if (request['speakSelection'] != undefined) {
    if (!document.hasFocus()) {
      return;
    }
    speakSelection();
  } else if (request['key'] != undefined) {
    speakKeyStr = request['key'];
  }
}

function initcs() {
	chrome.extension.onRequest.addListener(onExtensionMessage);
	chrome.extension.sendRequest({'init': true}, onExtensionMessage);
  document.addEventListener('click', function() {
    var focused = document.activeElement;
    var selectedText;
    if (focused) {
      try {
        selectedText = focused.value.substring(
            focused.selectionStart, focused.selectionEnd);
        console.log(selectedText);
      } catch (err) {
      }
    }
    if (selectedText == undefined) {
      var sel = window.getSelection();
      var selectedText = sel.toString();
      if (selectedText) {
      console.log(selectedText);
      }
    }
  });

}

initcs();