  function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
  }

  function switchVoice() {
    if (localStorage['gender'] == 'male') {
      localStorage['gender'] = 'female';
      document.getElementById("voiceswitchtoggle").innerHTML = 'female';
    } else {
      localStorage['gender'] = 'male';
      document.getElementById("voiceswitchtoggle").innerHTML = 'male';
    }
  }

  function switchButton() {
    if (localStorage['switch'] == 'On') {
      localStorage['switch'] = 'Off';
      document.getElementById("onoffswitchtoggle").innerHTML = 'Off';
      document.getElementById("voiceswitchtoggle").disabled = true;
      document.getElementById("voiceChromeTranslator").disabled = true;
    } else {
      localStorage['switch'] = 'On';
      document.getElementById("onoffswitchtoggle").innerHTML = 'On';
      document.getElementById("voiceswitchtoggle").disabled = false;
      document.getElementById("voiceChromeTranslator").disabled = false;
    }
  }

  function getVoiceLang() {
  var voice = document.getElementById('voiceChromeTranslator');
  var voiceArray = [];
  chrome.tts.getVoices(function(va) {
    voiceArray = va;
    for (var i = 0; i < voiceArray.length; i++) {
      var opt = document.createElement('option');
      var name = voiceArray[i].voiceName;
      if (name == localStorage['voice']) {
        opt.setAttribute('selected', '');
      }
      opt.setAttribute('value', name);
      opt.innerText = voiceArray[i].voiceName;
      voice.appendChild(opt);
    }
    });
  voice.addEventListener('change', function() {
    var i = voice.selectedIndex;
    localStorage['voice'] = voiceArray[i].voiceName;
    console.log(localStorage['voice']);
  }, false);
}

function loadListeners() {
  document.getElementById("onoffswitchtoggle").innerHTML = localStorage["switch"] || 'Off';
  localStorage["switch"] = localStorage["switch"] || 'Off';
  document.getElementById("voiceswitchtoggle").innerHTML = localStorage["gender"] || 'female';
  localStorage["gender"] = localStorage["gender"] || 'female';
  if (localStorage["switch"] == 'Off') {
    document.getElementById("voiceswitchtoggle").disabled = true;
    document.getElementById("voiceChromeTranslator").disabled = true;
  } else {
    document.getElementById("voiceswitchtoggle").disabled = false;
    document.getElementById("voiceChromeTranslator").disabled = false;
  }
  document.getElementById("onoffswitchtoggle").addEventListener('click', switchButton);
  document.getElementById("voiceswitchtoggle").addEventListener('click', switchVoice);
  getVoiceLang();
}

document.addEventListener('DOMContentLoaded', loadListeners);
