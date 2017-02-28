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
}

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("onoffswitchtoggle").addEventListener('click', changeHandler);
    document.getElementById("voiceswitchtoggle").addEventListener('click', changeVoice);
    /*
      TODO: add localStorage
    */
  });

