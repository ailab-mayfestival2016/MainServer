var socket=null;
var cnt=0;
var is_px_ready=false;
function connect(){
	if(socket!=null && socket.connected ){return;}
	var uri="https://ailab-mayfestival2016-server.herokuapp.com";
	//var uri="https://ailab-mayfestival2016-server2.herokuapp.com";
	//var uri="http://192.168.1.58:8000";
	socket = io.connect(uri, { transports: [ 'websocket' ] });
	socket.on('connect', function() {
		socket.on('px_ready', function (data) {
			px_ready(data);
		});
		socket.on('disconnect', function (data) {
			document.getElementById("connected").innerHTML="サーバーシャットダウンにより切断";
		});
		document.getElementById("connected").innerHTML="接続中";
		console.log("connected");
		socket.emit("enter_room",{'room':"Manager"});
	});
}

function opening(){
	socket.emit("transfer",{
			'event':"opening",
			'room':["Client","Game"],
			'data':true
		});
}
function difficulty(){
	var diff=document.getElementById("diffBox").value;
	socket.emit("transfer",{
			'event':"difficulty",
			'room':["Client","Game"],
			'data':diff
		});
}
function game_start(){
	socket.emit("transfer",{
			'event':"game_start",
			'room':["Client"],
			'data':true
		});
}
function abort(){
	px_ready(false);
	socket.emit("transfer",{
			'event':"abort",
			'room':["Client","Phenox","Controller","Game"],
			'data':true
		});
}
function px_start(){
	socket.emit("transfer",{
			'event':"px_start",
			'room':["Game"],
			'data':true
		});
}
function gameover(){
	socket.emit("transfer",{
			'event':"px_position",
			'room':["Game"],
			'data':[0.0,-10000.0]
		});
}
function bar_config(){
	console.log("bar_config");
	try{
		var width=JSON.parse(document.getElementById("widthBox").value);
		var region=JSON.parse(document.getElementById("regionBox").value);
		var calib=JSON.parse(document.getElementById("calibBox").value);
		var ret=true;
		ret=ret &&(typeof(width)=="number");
		ret=ret &&(typeof(region[0])=="number");
		ret=ret &&(typeof(region[1])=="number");
		ret=ret &&(region[0]<region[1]);
		ret=ret &&(typeof(calib[0])=="number");
		ret=ret &&(typeof(calib[1])=="number");
		ret=ret &&(calib[0]<calib[1]);
		if(ret){
			if(socket==null || !socket.connected ){return;}
			socket.emit("transfer",{
				'event':"bar_config",
				'room':["Controller"],
				'data':{"width":width,"region":region,"calib":calib}
			});
			document.getElementById("widthBox").style.backgroundColor="#ffffff";
			document.getElementById("regionBox").style.backgroundColor="#ffffff";
			document.getElementById("calibBox").style.backgroundColor="#ffffff";
		}else{
			document.getElementById("widthBox").style.backgroundColor="#ff0000";
			document.getElementById("regionBox").style.backgroundColor="#ff0000";
			document.getElementById("calibBox").style.backgroundColor="#ff0000";
		}
	}catch(e){
		document.getElementById("widthBox").style.backgroundColor="#ff0000";
		document.getElementById("regionBox").style.backgroundColor="#ff0000";
		document.getElementById("calibBox").style.backgroundColor="#ff0000";
	}
}

function px_ready(val){
	if(val){
		document.getElementById("px_ready").style="color:#0000ff;";
		document.getElementById("px_ready").innerHTML="Ready";
	}else{
		document.getElementById("px_ready").style="color:#ff0000;";
		document.getElementById("px_ready").innerHTML="Not ready";
	}
}
