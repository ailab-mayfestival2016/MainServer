var socket=null;
var counts={};
var sockets={};
var rooms=["Phenox","Game","Client","Controller","Manager"];
var roomInds={};
var eventList={
	"Phenox":['landing','direction','abort'],
	"Game":['px_start','px_bounce','px_position','px_velocity','controller','bar_position','opening','difficulty','abort'],
	"Client":['px_position','bar_position','reflect','hit','complete','gameover','timeup','map','opening','difficulty','game_start','abort'],
	"Controller":['abort','bar_config'],
	"Manager":['px_ready']
};
var eventInds={};
for(var i=0;i<rooms.length;++i){
	sockets[rooms[i]]=null;
}
var recvBuf={};
function connect(){
	var uri="https://ailab-mayfestival2016-server.herokuapp.com";
	//var uri="https://ailab-mayfestival2016-base2.herokuapp.com";
	//var uri="http://192.168.1.58:8000";
	document.getElementById("latests").innerHTML="";
	document.getElementById("latestTable").innerHTML="<tr><td>部屋名</td><td>接続状態</td><td>累計受信数</td><td>最新イベント名</td><td>最新データ</td></tr>"
	var rowCount=0;
	for(var i=0;i<rooms.length;++i){
		eventInds[rooms[i]]={};
		counts[rooms[i]]={};
		for(var j=0;j<eventList[rooms[i]].length;++j){
			counts[rooms[i]][eventList[rooms[i]][j]]=0;
			eventInds[rooms[i]][eventList[rooms[i]][j]]=j;
			if(j==0){
				document.getElementById("latestTable").innerHTML+="<tr><td>"+rooms[i]+"</td><td>disconnected</td><td>"+counts[rooms[i]][eventList[rooms[i]][j]]+"</td><td>"+eventList[rooms[i]][j]+"</td><td></td></tr>"
				roomInds[rooms[i]]=rowCount;
			}else{
				document.getElementById("latestTable").innerHTML+="<tr><td></td><td></td><td>"+counts[rooms[i]][eventList[rooms[i]][j]]+"</td><td>"+eventList[rooms[i]][j]+"</td><td></td></tr>"
			}
			rowCount++;
		}
		if(sockets[rooms[i]]==null || !sockets[rooms[i]].connected ){
			sockets[rooms[i]] = io.connect(uri, { transports: [ 'websocket' ] });
			function onConnect(room){
				return function(){
					for(var i=0;i<eventList[room].length;++i){
						console.log(eventList[room][i]);
						function onEvent(event){
							return function(data){
								doSomething(room,event,data);
							}
						}
						sockets[room].on(eventList[room][i], onEvent(eventList[room][i]));
					}
					sockets[room].on('disconnect', function (data) {
						document.getElementById("latestTable").rows[roomInds[room]+1].cells[1].innerHTML="disconnected";
					});
					console.log("connected as "+room);
					document.getElementById("latestTable").rows[roomInds[room]+1].cells[1].innerHTML="connected";
					sockets[room].emit("enter_room",{'room':room});
				}
			}
			sockets[rooms[i]].on('connect', onConnect(rooms[i]));
		}else if(sockets[rooms[i]]!=null){
			document.getElementById("latestTable").rows[roomInds[rooms[i]]+1].cells[1].innerHTML="connected";
		}
	}
}
var sendEnabled=false;
function changeSendFlag(){
	sendEnabled=!sendEnabled;
	if(sendEnabled){
		document.getElementById("changeSendButton").innerHTML="データ送信Off";
	}else{
		document.getElementById("changeSendButton").innerHTML="データ送信On";
	}
}

function doSomething(room,event,data){
	counts[room][event]++;
	var info="cnt="+counts[room][event]+",room="+room+",event="+event+",data="+JSON.stringify(data);
	//document.getElementById("latestData").innerHTML=info;
	document.getElementById("latestTable").rows[roomInds[room]+eventInds[room][event]+1].cells[2].innerHTML=counts[room][event];
	document.getElementById("latestTable").rows[roomInds[room]+eventInds[room][event]+1].cells[3].innerHTML=event;
	document.getElementById("latestTable").rows[roomInds[room]+eventInds[room][event]+1].cells[4].innerHTML=JSON.stringify(data);
}


