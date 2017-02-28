// chrome.browserAction.onClicked.addListener(clickedAction);
chrome.tabs.onSelectionChanged.addListener(onTabSelect);

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
