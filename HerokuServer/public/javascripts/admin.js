var isLoggedIn=false;
var socket;
var keepingPass=false;
var pass="";
function connect(){
	if(socket!=null && socket.connected ){return;}
	socket = io.connect(location.origin, { transports: [ 'websocket' ] });
	socket.on('connect', function() {
		socket.on('clientInfo', function (data) {
			clientInfoUpdate(data);
		});
		socket.on('login failed', function (data) {
			document.getElementById("loginStatus").innerHTML="ログイン失敗("+data.reason+")";
			keepingPass=false;
		});
		socket.on('login accepted', function (data) {
			isLoggedIn=true;
			document.getElementById("loginStatus").innerHTML="ログイン中";
			document.getElementById("login").style.display="none";
			document.getElementById("main").style.display="";
			keepingPass=true;
		});
		socket.on('disconnect',function(data){
			document.getElementById("serverStatus").innerHTML="オフライン";
			document.getElementById("loginStatus").innerHTML="サーバーシャットダウンによりログアウト";
			isLoggedIn=false;
			document.getElementById("login").style.display="";
			document.getElementById("main").style.display="none";
			
		});
		document.getElementById("serverStatus").innerHTML="オンライン";
		document.getElementById("loginStatus").innerHTML="未ログイン";
		isLoggedIn=false;
		document.getElementById("login").style.display="";
		document.getElementById("main").style.display="none";
		if(keepingPass){
			console.log("Retry")
			document.getElementById("passBox").value=pass;
			adminLogin();
		}
	});
}
window.onbeforeunload = function (event) {
	// ログアウト通知
	if(isLoggedIn){
		socket.emit('admin logout',{});
	}
};

function clientInfoUpdate(data){
	if(isLoggedIn){
		document.getElementById("numClients").innerHTML=Object.keys(data["clients"]).length;
		var clientInfo=document.getElementById("clientInfo");
		for(var row=1+Object.keys(data["clients"]).length+Object.keys(data["baseClients"]).length;row<clientInfo.rows.length;++row){
				clientInfo.deleteRow(-1);
		}
		var row;
		var cell;
		var cnt=0;
		var admin=[];
		var bases=[];
		var clients=[];
		for(var key in data["clients"]){
			if("Admin" in data["clients"][key]){
				admin.push([key,JSON.stringify(Object.keys(data["clients"][key]))])
			}else if("Base" in data["clients"][key]){
				bases.push([key,JSON.stringify(Object.keys(data["clients"][key]))])
			}else{
				clients.push([key,JSON.stringify(Object.keys(data["clients"][key]))])
			}
		}
		for(var key in data["baseClients"]){
			bases.push([key,JSON.stringify(Object.keys(data["baseClients"][key]))])
		}
		var list=[admin,bases,clients];
		for(var i=0;i<3;++i){
			for(var j=0;j<list[i].length;++j){
				if(cnt<clientInfo.rows.length-1){
					row=clientInfo.rows[cnt+1];
				}else{
					row=clientInfo.insertRow(-1);
					for(var k=0;k<clientInfo.rows[0].cells.length;++k){
						row.insertCell(-1);
					}
				}
				//SocketID
				cell=row.cells[0];
				cell.innerHTML=list[i][j][0];
				cell.bgColor="#FFFFFF";
				//部屋
				cell=row.cells[1];
				cell.innerHTML=list[i][j][1];
				cell.bgColor="#FFFFFF";
				cnt++;
			}
		}
	}
}
function adminLogin(){
	if(!isLoggedIn){
		pass=document.getElementById("passBox").value;
		connect();
		socket.emit('admin login', {pass:pass});
	}
}
