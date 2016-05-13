var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 8000));
var server = app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});

var ioS = require('socket.io').listen(server);
var ioC = require('socket.io-client');
//Herokuに接続するの時
var herokuServerURL="https://ailab-mayfestival2016-server.herokuapp.com";
//LocalでHerokuサーバを模擬するとき
//var herokuServerURL="http://localhost:5000"

function launchS(){
	ioS.sockets.on('connection', function (socket) {
		console.log(socket.id+" connected");
		updateClientInfo('connection',socket.id,{})
		socket.on('enter_room',function(data){
			console.log(socket.id+" entered "+data['room']);
			socket.join(data['room']);
			updateClientInfo('enter_room',socket.id,data['room']);
		});
		socket.on('leave_room',function(data){
			console.log(socket.id+" leaved "+data['room']);
			socket.leave(data['room']);
			updateClientInfo('leave_room',socket.id,data['room']);
		});
		socket.on('transfer',function(data){
			onTransfer(socket,data,false);
		});
		socket.on('disconnect',function(data){
			console.log(socket.id+' disconnected');
			updateClientInfo('disconnect',socket.id,{});
		});
	});
}
//クライアントとしてHeroku側のサーバに接続
var socketC;
//接続からハンドラの登録までをまとめる
function connectC(uri){
	socketC = ioC.connect(uri);//接続
	//接続時のイベント
	socketC.on('connect', function() {
		console.log("Connected to "+uri);
		//Heroku(来場者用Client)からの転送
		socketC.on('transfer', function (data) {
			onTransfer(socketC,data,true);
		});
		//切断時の処理
		socketC.on('disconnect', function (data) {
			console.log("disconnected");
		});
		//"Base"roomに入る
		socketC.emit('enter_room',{room:"Base"})
	});
}

function updateClientInfo(event,id,data){
	socketC.emit('base client update',{'event':event,'id':id,'data':data});
}

//データ転送
function onTransfer(socket,data,fromHeroku){
	if("room" in data){
		if(Array.isArray(data["room"])){
			var rooms=data["room"].filter(function (x, i, self) {
					return self.indexOf(x) === i;
				});
			if(fromHeroku){
				for(var i=0;i<rooms.length;++i){
					ioS.to(rooms[i]).emit(data["event"],data["data"]);
				}
			}else{
				socketC.emit("transfer",{"event":data["event"],"room":rooms,"data":data["data"]});
				for(var i=0;i<rooms.length;++i){
					socket.broadcast.to(rooms[i]).emit(data["event"],data["data"]);
				}
			}
		}else{
			if(fromHeroku){
				ioS.to(data['room']).emit(data["event"],data["data"]);
			}else{
				socketC.emit("transfer",data);
				socket.broadcast.to(data['room']).emit(data["event"],data["data"]);
			}
		}
	}else{
		if(fromHeroku){
			ioS.sockets.emit(data['event'],data['data']);
		}else{
			socketC.emit("transfer",data);
			socket.broadcast.emit(data['event'],data['data']);
		}
	}
}
//データ転送(Clientの混在を認めない(旧版))
function onTransferOld(socket,data,fromHeroku){
	//console.log(JSON.stringify(data))
	if("room" in data){
		if(Array.isArray(data["room"])){
			var rooms=data["room"].filter(function (x, i, self) {
					return self.indexOf(x) === i;
				});
			/*for(var i=0;i<rooms.length;++i){
				if(rooms[i]=="Client"){
					socketC.emit("transfer",{"event":data["event"],"data":data["data"]});
				}else{
					if(fromHeroku){
						ioS.to(rooms[i]).emit(data["event"],data["data"]);
					}else{
						socket.broadcast.to(rooms[i]).emit(data["event"],data["data"]);
					}
				}
			}*/
			if(fromHeroku){
				for(var i=0;i<rooms.length;++i){
					ioS.to(rooms[i]).emit(data["event"],data["data"]);
				}
			}else{
				socketC.emit("transfer",data);//一度Herokuにも投げる(Heroku側から再送信はされないはず)
				for(var i=0;i<rooms.length;++i){
					socket.broadcast.to(rooms[i]).emit(data["event"],data["data"]);
				}
			}
		}else{
			if(data["room"]=="Client"){
				socketC.emit("transfer",data);
			}else{
				if(fromHeroku){
					ioS.to(data['room']).emit(data["event"],data["data"]);
				}else{
					socketC.emit("transfer",data);//一度Herokuにも投げる(Heroku側から再送信はされないはず)
					socket.broadcast.to(data['room']).emit(data["event"],data["data"]);
				}
			}
		}
	}else{
		if(fromHeroku){
			ioS.sockets.emit(data['event'],data['data']);
		}else{
			socketC.emit("transfer",data);//一度Herokuにも投げる(Heroku側から再送信はされないはず)
			socket.broadcast.emit(data['event'],data['data']);
		}
	}
}


//ローカルサーバを立てる
launchS();
//Herokuサーバにつなぐ
connectC(herokuServerURL);
