  function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
  }
  function changeHandler() {
    //turn on
    if (onoffswitchtoggle.checked) {
      console.log('ON');
    }
    //turn off
    else  {
      console.log('OFF');
    }
  }

  function changeVoice() {
    if (voiceswitchtoggle.checked) {
      console.log('Male');
    }
    else {
      console.log('Female');
    }
  }

  function getVoiceLang() {
  var voice = document.getElementById('voice');
  var voiceArray = [];
  chrome.tts.getVoices(function(va) {
    voiceArray = va;
    for (var i = 0; i < voiceArray.length; i++) {
      var opt = document.createElement('option');
      var name = voiceArray[i].voiceName;
      if (name == localStorage['ct_voice']) {
        opt.setAttribute('selected', '');
      }
      opt.setAttribute('value', name);
      opt.innerText = voiceArray[i].voiceName;
      voice.appendChild(opt);
    }
    });
  voice.addEventListener('change', function() {
    var i = voice.selectedIndex;
    localStorage['ct_voice'] = voiceArray[i].voiceName;
    console.log(localStorage['ct_voice']);
  }, false);
}

function loadListeners() {
  document.getElementById("onoffswitchtoggle").addEventListener('click', changeHandler);
  document.getElementById("voiceswitchtoggle").addEventListener('click', changeVoice);
  getVoiceLang();
}

document.addEventListener('DOMContentLoaded', loadListeners);
