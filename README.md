# MainServer

�e�v���O�����Ԃ̒ʐM�𒆌p����T�[�o�B

* HerokuServer
* BaseServer

##HerokuServer
Heroku��ŉ��T�[�o�B����҂̃X�}�z�Ȃǂ�"Client"���ւ̃f�[�^�z�M��S������B  
https://ailab-mayfestival2016-server.herokuapp.com�̃|�[�g5000�ŊJ���B  
Socket.IO�ł̐ڑ����̓|�[�g�ԍ��͎w�肵�Ȃ��Ă悢�炵���B

�Ǘ��҉�ʂ�https://ailab-mayfestival2016-server.herokuapp.com/admin�ŃA�N�Z�X�ł���

##BaseServer
�N���̃p�\�R���ŉ�邱�Ƃ�z�肵���T�[�o�B"Client"�ȊO�S��(Phenox,Game,Controller)�̒ʐM��S������B  
�N���̃p�\�R���ł��ꍇ�A�|�[�g8000�ŊJ���̂ŁA�����LAN�ɓ�����http://xxx.xxx.xxx.xxx:8000�ɐڑ�����B  

���邢�́Ahttps://ailab-mayfestival2016-base.herokuapp.com�ɐڑ����Ă��悢�B


##�����f�o�b�O�ɂ���
��L�̃T�[�o�͒P�Ƃ̃C���X�^���X�ŉ���Ă���̂ŁA�����ɕ����̃e�X�g���s�����Ƃ��ł��Ȃ��B

���̂��߂ɁA2�Z�b�g�ڂ̃T�[�o���ȉ��ɗp�ӂ����̂ŁA�󋵂ɉ����Ďg�������Ă��������B  
+ HerokuServer : https://ailab-mayfestival2016-server2.herokuapp.com
+ BaseServer : https://ailab-mayfestival2016-base2.herokuapp.com

���邢�́AHerokuServer��BaseServer���Ƃ��Ƀ��[�J���ő��点�Ďg���Ă��������B


##���[�J���ł̎��s
Node.js���K�v�Ȃ̂ŃC���X�g�[������B[https://nodejs.org/](https://nodejs.org/)���A�_�E�����[�h����B

���|�W�g����clone���āAHerokuServer�܂���BaseServer�̃f�B���N�g���Ɉړ����A�ȉ��̃R�}���h�����s����B

	npm install
	npm start

�����A`npm start`�����s������A`node HerokuServer.js`�܂���`node BaseServer.js`�����s����B



