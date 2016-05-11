var express = require('express');
var app = express();
var adminPage = require('./routes/adminPage');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/admin',adminPage);

//管理者関連
var adminPass="ailab";
//var isAdminLoggedIn=false;
//var admins={};
//var adminSocketID;
var clients={};
var baseClients={};


var server = app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
var io = require('socket.io').listen(server);
io.set('transports', [ 'websocket','polling' ]);
io.sockets.on('connection', function (socket) {
	console.log(socket.id+" connected");
	updateClientInfo(clients,'connection',socket.id,{});
	socket.on('enter_room',function(data){
		console.log(socket.id+" entered "+data['room']);
		socket.join(data['room']);
		updateClientInfo(clients,'enter_room',socket.id,data['room']);
	});
	socket.on('leave_room',function(data){
		console.log(socket.id+" leaved "+data['room']);
		socket.leave(data['room']);
		updateClientInfo(clients,'leave_room',socket.id,data['room']);
	});
	socket.on('transfer',function(data){
		onTransfer(socket,data);
	});
	socket.on('disconnect',function(data){
		console.log(socket.id+' disconnected');
		updateClientInfo(clients,'disconnect',socket.id,{});
	});
	//管理者用
	socket.on('admin login', function(data) {
		/*if(isAdminLoggedIn){
			//すでに他で管理者ログインされている
			socket.emit('login failed', {reason:"すでに誰かが管理者としてログインしています"});
			console.log("duplicated admin");
		}else */
		if(data.pass==adminPass){
			//正しいパスワード
			isAdminLoggedIn=true;
			adminSocketID=socket.id;
			socket.emit('login accepted',{});
			socket.join("Admin");
			updateClientInfo(clients,'enter_room',socket.id,"Admin");
			console.log("admin logged in"+adminSocketID);
		}else{
			//間違い
			socket.emit('login failed', {reason:"パスワードが違います"});
		}
	});
	socket.on('admin logout', function(data){
		//if(socket.id==adminSocketID){
			//isAdminLoggedIn=false;
			console.log("admin logged out");
		//}
	});
	socket.on('base client update',function(data){
		updateClientInfo(baseClients,data['event'],data['id'],data['data']);
	});
});

function updateClientInfo(list,event,id,data){
	if(event=='connection'){
		list[id]={};
	}else if(event=='enter_room'){
		list[id][data]=true;
	}else if(event=='leave_room'){
		delete list[id][data];
	}else if(event=='disconnect'){
		delete list[id];
	}
	//if(isAdminLoggedIn){
		io.to("Admin").emit('clientInfo',{"clients":clients,"baseClients":baseClients});
	//}
}
//データ転送
function onTransfer(socket,data){
	//console.log(JSON.stringify(data))
	if('room' in data){
		if(Array.isArray(data['room'])){
			var rooms=data["room"].filter(function (x, i, self) {
					if(x=="Client"){
						if(self.indexOf(x)==i){
							socket.broadcast.to("Client").emit(data["event"],data["data"]);
						}
						return false;
					}else{
						return self.indexOf(x) === i;
					}
				});
			if(rooms.length>0){
				socket.broadcast.to("Base").emit("transfer",{"event":data["event"],"room":rooms,"data":data["data"]});
			}
		}else{
			if(data["room"]=="Client"){
				socket.broadcast.to("Client").emit(data["event"],data["data"]);
			}else{
				socket.broadcast.to("Base").emit("transder",data);
			}
		}
	}else{
		socket.broadcast.to("Client").emit(data["event"],data["data"]);
		socket.broadcast.to("Base").emit("transfer",data);
	}
}
