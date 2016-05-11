# MainServer

各プログラム間の通信を中継するサーバ。

* HerokuServer
* BaseServer

##HerokuServer
Heroku上で回るサーバ。来場者のスマホなどの"Client"側へのデータ配信を担当する。  
https://ailab-mayfestival2016-server.herokuapp.comのポート5000で開く。  
Socket.IOでの接続時はポート番号は指定しなくてよいらしい。

管理者画面にhttps://ailab-mayfestival2016-server.herokuapp.com/adminでアクセスできる

##BaseServer
誰かのパソコンで回ることを想定したサーバ。"Client"以外全て(Phenox,Game,Controller)の通信を担当する。  
誰かのパソコンでやる場合、ポート8000で開くので、同一のLANに入ってhttp://xxx.xxx.xxx.xxx:8000に接続する。  

あるいは、https://ailab-mayfestival2016-base.herokuapp.comに接続してもよい。


##同時デバッグについて
上記のサーバは単独のインスタンスで回っているので、同時に複数のテストを行うことができない。

そのために、2セット目のサーバを以下に用意したので、状況に応じて使い分けてください。  
+ HerokuServer : https://ailab-mayfestival2016-server2.herokuapp.com
+ BaseServer : https://ailab-mayfestival2016-base2.herokuapp.com

あるいは、HerokuServerとBaseServerをともにローカルで走らせて使ってください。


##ローカルでの実行
Node.jsが必要なのでインストールする。[https://nodejs.org/](https://nodejs.org/)より、ダウンロードする。

リポジトリをcloneして、HerokuServerまたはBaseServerのディレクトリに移動し、以下のコマンドを実行する。

	npm install
	npm start

もし、`npm start`が失敗したら、`node HerokuServer.js`または`node BaseServer.js`を実行する。



