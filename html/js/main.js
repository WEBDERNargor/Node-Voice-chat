$(document).ready(function () {
	$("#startBtn").click(function () {
		$(this).hide();
		startTalking();
	});
	$("#changeRoom").click(function () {
		if (socketConnected) socketIO.emit("room:change", document.querySelector("#roomInput").value);
		recentRoom = document.querySelector("#roomInput").value.toUpperCase();
	});

	document.getElementById("roomInput").oninput = () => document.querySelector("#roomInput").value = document.querySelector("#roomInput").value.toUpperCase();
	
	var micaudio = document.getElementById("micaudio");
	var micctx = micaudio.getContext("2d");
	micctx.fillStyle = "#703642";

	var incaudio = document.getElementById("incaudio");
	var incctx = incaudio.getContext("2d");
	incctx.fillStyle = "#703642";

	onMicRawAudio = function (audioData, soundcardSampleRate) { //Data right after mic input
		micctx.clearRect(0, 0, micaudio.width, micaudio.height);
		for (var i = 0; i < audioData.length; i++) {
			micctx.fillRect(i, audioData[i] * 100 + 100, 1, 1);
		}
		return audioData;
	}

	onUserDecompressedAudio = function (audioData, userId, sampleRate, bitRate) { //Called when user audiodata coming from the client
		incctx.clearRect(0, 0, incaudio.width, incaudio.height);
		for (var i = 0; i < audioData.length; i++) {
			incctx.fillRect(i, audioData[i] * 100 + 100, 1, 1);
		}
		return audioData;
	}
});
