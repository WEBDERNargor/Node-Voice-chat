
const express = require('express');
const https = require('https');
var roomSize = new Map();
const fs = require('fs');
var app = express();
/* CONFIG */
const PORT = process.env.PORT || 443;
const options = {
key:fs.readFileSync('./demo_ssl/key.pem'),
cert:fs.readFileSync('./demo_ssl/cert.pem')
};
/* END CONFIG */



app.use(express.static(__dirname + '/html'));


var server = https.createServer(options,app)

const listener = server.listen(PORT, "0.0.0.0", () => {
	console.log(`[i] พอร์ท ${listener.address().port}`);
	console.log(`[i] ลิงค์: https://${listener.address().address}:${listener.address().port} เป็น SSL แบบไม่ได้ยืนยันใช้ได้ใน local หรือเครื่องที่ปิดระบบป้องกันเท่านั้น`)
});

const io = require("socket.io")(server, { log: false, transport: ["websocket"] });

//Handel connections
io.on('connection', function (socket) {
	let roomID = "1";

	socket.join(roomID);
	roomSize.set(roomID, (roomSize.get(roomID)||0)+1);
	io.to(roomID).emit('clients', roomSize.get(roomID));
	socket.on('room:change', name => {
		socket.leave(roomID);
		roomSize.set(roomID, (roomSize.get(roomID)||0)-1);
		io.to(roomID).emit('clients', roomSize.get(roomID));
		if (!roomSize.get(roomID)) roomSize.delete(roomID);
		roomID = name.toUpperCase();
		socket.join(roomID);
		roomSize.set(roomID, (roomSize.get(roomID)||0)+1);
		io.to(roomID).emit('clients', roomSize.get(roomID));
	});
	socket.on('disconnect', () => {
		roomSize.set(roomID, (roomSize.get(roomID)||0)-1);
		io.to(roomID).emit('clients', roomSize.get(roomID));
		if (!roomSize.get(roomID)) roomSize.delete(roomID);
	});
	socket.on('d', data => {
		socket.to(roomID).volatile.emit('d', data);
	});

});

// Clean Exit

let exitevent = [ "SIGINT", "SIGTRAP" ];

exitevent.forEach(event => {
	process.on(event, exit);
});

function exit() {
	console.warn("[w] เซิฟเวอร์กำลังจะล่ม! กำลังปิดเซิร์ฟเวอร์...");
	server.close();
	console.log("[i] เซิร์ฟเวอร์ปิด กำลังออก...");
	process.exit(0);
}
