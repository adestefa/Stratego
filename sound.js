

var NSsound = navigator.plugins && navigator.plugins["LiveAudio"]
  && navigator.javaEnabled(); // join with previous line
var IEsound = navigator.plugins && document.all;
var curVolume = 5;
var timerID = null;
var intervalID = null;
var sliding = false;
var ready = false;
var shouldPlay = false;
var loaded = false;

var songs = new Array();
songs[0] = new makeSong("eleanor.mid", "Eleanor");
songs[1] = new makeSong("girl.mid", "Girl");
songs[2] = new makeSong("michelle.mid", "Michelle");
songs[3] = new makeSong("sheway.mid", "She's Got a Way");
songs[4] = new makeSong("wholenew.mid", "A Whole New World");

var NSvolume = new Array();
for (var i = 0; i <= 10; i++) {
  NSvolume[i] = i * 10;
}

var IEvolume = new Array();
IEvolume[0] = -10000;
IEvolume[1] = -4500;
IEvolume[2] = -4000;
IEvolume[3] = -3500;
IEvolume[4] = -3000;
IEvolume[5] = -2500;
IEvolume[6] = -2000;
IEvolume[7] = -1500;
IEvolume[8] = -1000;
IEvolume[9] = -500;
IEvolume[10] = 0;

function makeSong(url, name) {
	this.url = url;
	this.name = name;
}

function changeVolume(step) {
  if (!loaded) return;
  var newVolume = curVolume + step;
  if ((newVolume >= 0) && (newVolume <= 10))
    setVolume(newVolume);
  else if (sliding)
    stopSlide();
}

function setVolume(vol) {
  if (!loaded) return;
  curVolume = vol;
  if (NSsound)
    document.jukebox.setvol(NSvolume[vol])
  else
    document.jukebox.volume = IEvolume[vol];
  for (var i = 0; i < 10; i++) {
    document.images["vol" + i].src = (i < vol) ? on.src : off.src;
  }
}

function startSlide(direction) {
  changeVolume(direction);
  timerID = setTimeout("slideVolume(" + direction + ")", 500);
  return false;
}

function slideVolume(direction) {
  sliding = true;
  intervalID = setInterval("changeVolume(" + direction + ")", 50);
}

function stopSlide() {
  if (intervalID) clearInterval(intervalID);
  if (timerID) clearTimeout(timerID);
  sliding = false;
}

function display(text) {
  if (IEsound) event.srcElement.style.cursor = "hand";
  window.status = text;
  return true;
}

function pause() {
  if (!loaded) return;
  shouldPlay = false;
  document.jukebox.pause();
}

function stop() {
  if (!loaded) return;
  shouldPlay = false;
  document.jukebox.stop();
}

function play() {
  if (!loaded) return;
  if (NSsound) ready = document.jukebox.IsReady();
  if (!ready) {
    alert("The audio file hasn't loaded yet.");
    return;
  }
  var list = document.jukeboxform.songs;
  var songURL = list.options[list.selectedIndex].value;
  if (NSsound) {
    document.jukebox.play(false, songURL)
  } else
    document.jukebox.play();
}

function change() {
  if (!loaded) return;
  var list = document.jukeboxform.songs;
  var songURL = list.options[list.selectedIndex].value;
  document.jukebox.stop();
  if (NSsound)
    document.jukebox.play(false, songURL)
  else {
    document.jukebox.filename = songURL;
    shouldPlay = true;
  }
}

function init() {
  loaded = true;
  setVolume(curVolume);
}

function makeVolume() {
  var str = "";
  for (var i = 9; i >= 0; i--) {
    str +=  "<IMG SRC='" + off.src + "' HEIGHT='" +
      off.width + "' WIDTH='" + off.width + "' NAME='vol" +
      i + "'><BR>";
  }
  return str;
}

function makeControlButtons() {
  var str = "";
  str += "<FONT SIZE='2' COLOR='#ffffff'>Control</FONT><BR>";
  if (NSsound) {
    str += "<A HREF='javascript:play()' onMouseOver='return " +
      "display(\"Play\")' onMouseOut='return display(\"\")'>" +
      "<IMG SRC='play.gif' WIDTH='12' HEIGHT='9' HSPACE='2' " +
      "VSPACE='3' BORDER='0'></A>";
    str += "<A HREF='javascript:pause()' onMouseOver='return " +
      "display(\"Pause\")' onMouseOut='return display(\"\")'>" +
      "<IMG SRC='pause.gif' WIDTH='12' HEIGHT='9' HSPACE='2' " +
      "VSPACE='3' BORDER='0'></A>";
    str += "<A HREF='javascript:stop()' onMouseOver='return " +
      "display(\"Stop\")' onMouseOut='return display(\"\")'>" +
      "<IMG SRC='stop.gif' WIDTH='12' HEIGHT='9' HSPACE='2' " +
      "VSPACE='3' BORDER='0'></A>";
  } else {
    str += "<IMG SRC='play.gif' WIDTH='12' HEIGHT='9' " +
      "HSPACE='2' VSPACE='3' onClick='play()' " +
      "onMouseOver='return display(\"Play\")' " +
      "onMouseOut='return display(\"\")'>";
    str += "<IMG SRC='pause.gif' WIDTH='12' HEIGHT='9' " +
      "HSPACE='2' VSPACE='3' onClick='pause()' " +
      "onMouseOver='return display(\"Pause\")' " +
      "onMouseOut='return display(\"\")'>";
    str += "<IMG SRC='stop.gif' WIDTH='12' HEIGHT='9' " +
      "HSPACE='2' VSPACE='3' onClick='stop()' " +
      "onMouseOver='return display(\"Stop\")' " +
      "onMouseOut='return display(\"\")'>";
  }
  return str;
}

function makeVolumeButtons() {
  var str = "";
  str += "<FONT SIZE=2 COLOR='#ffffff'>Volume</FONT><BR>";
  if (NSsound) {
    str += "<A HREF='javascript:void(0)' " +
      "onClick='if (!document.layers) changeVolume(1)' " +
      "onMouseDown='startSlide(1)' onMouseUp='stopSlide()' " +
      "onMouseOver='return display(\"Increase volume\")' " +
      "onMouseOut='return display(\"\")'><IMG " +
      "SRC='volup.gif' WIDTH='9' HEIGHT='10' HSPACE='2' " +
      "VSPACE='3' BORDER='0'></A>";
    str += "<A HREF='javascript:void(0)' " +
      "onClick='if (!document.layers) changeVolume(-1)' " +
      "onMouseDown='startSlide(-1)' onMouseUp='stopSlide()' " +
      "onMouseOver='return display(\"Decrease volume\")' " +
      "onMouseOut='return display(\"\")'><IMG " +
      "SRC='voldown.gif' WIDTH='9' HEIGHT='10' HSPACE='2' " +
      "VSPACE='3' BORDER='0'></A>";
  } else {
    str += "<IMG SRC='volup.gif' WIDTH='9' HEIGHT='10' " +
      "HSPACE='2' VSPACE='3' " +
      "onMouseOver='return display(\"Increase volume\")' " +
      "onMouseOut='return display(\"\")' " +
      "onMouseDown='startSlide(1)' onMouseUp='stopSlide()'>";
    str += "<IMG SRC='voldown.gif' WIDTH='9' HEIGHT='10' " +
      "HSPACE='2' VSPACE='3' " +
      "onMouseOver='return display(\"Decrease volume\")' " +
      "onMouseOut='return display(\"\")' " +
      "onMouseDown='startSlide(-1)' onMouseUp='stopSlide()'>";
  }
  return str;
}

var off = new Image(4, 4);
off.src = "off.gif";
var on = new Image(4, 4);
on.src = "on.gif";

if (NSsound || IEsound) {
  document.write(
    "<FORM NAME='jukeboxform'>",
    "<TABLE BORDER='3'><TR><TD>",
    "<TABLE BORDER='0' CELLSPACING='0' CELLPADDING='4'>",
    "<TR><TD COLSPAN='3' BGCOLOR='#000000'>",
    "<SELECT NAME='songs' onchange='change()'>"
  );
  for (var i = 0; i < songs.length; i++) {
    document.write(
      "<OPTION VALUE='", songs[i].url, "'>",
      songs[i].name
    );
  }
  document.write(
    "</SELECT>",
    "</TD></TR>",
    "<TR><TD BGCOLOR='#000000' WIDTH='15' ALIGN='center'>",
    makeVolume(),
    "</TD><TD BGCOLOR='#000000' ALIGN='center'>",
    makeVolumeButtons(),
    "</TD><TD BGCOLOR='#000000' ALIGN='center'>",
    makeControlButtons(),
    "</TD></TR>",
    "</TABLE>",
    "</TD></TR></TABLE>",
    "</FORM>"
  );

  document.write("<EMBED SRC='eleanor.mid' NAME='jukebox' HIDDEN='true' LOOP='false' AUTOSTART='false' MASTERSOUND>"); // join with previous line

  onload = init;
}


